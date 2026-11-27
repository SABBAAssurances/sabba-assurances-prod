const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const FIELDS = [
  "immatriculation", "bonusMalus", "sinistres36Mois", "sinistres36MoisDetails",
  "utilisationVehicule", "marqueVehicule", "typeVersion", "valeurVehicule",
  "dateMiseCirculation", "energie", "puissanceFiscale", "puissanceReelle",
  "boiteVitesse", "carrosserie", "nombrePortes", "nombrePlaces", "couleur",
  "nombreCVFiscaux", "modeFinancement", "lieuStationnement", "choixGaranties",
  "demandesParticulieres", "commentConnaissance", "prenom", "nomFamille",
  "adresse", "codePostal", "ville", "dateNaissance", "moisAnneePermis",
  "profession", "email", "telephone",
];
const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  day: "2-digit", month: "2-digit", year: "numeric",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
});

function cellValue(value) {
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (typeof value === "string" || typeof value === "number") return value;
  if (Array.isArray(value)) return value.map(cellValue).join("\n");
  return "";
}

async function googleRequest(step, url, options) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(2500) });
    if (response.ok) return response.json();
    if (response.status !== 429 || attempt === 1) {
      throw new Error(`${step}_http_${response.status}`);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

async function appendResponse(req, formData, submission, emailSent) {
  const {
    GOOGLE_SHEETS_ENABLED, GOOGLE_SHEETS_ID, GOOGLE_SHEETS_TAB = "Réponses",
    GOOGLE_WIF_AUDIENCE, GOOGLE_SERVICE_ACCOUNT_EMAIL,
  } = process.env;
  if (GOOGLE_SHEETS_ENABLED !== "true") return;

  const oidc = req.headers["x-vercel-oidc-token"] || process.env.VERCEL_OIDC_TOKEN;
  if (!oidc || !GOOGLE_SHEETS_ID || !GOOGLE_WIF_AUDIENCE || !GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error("missing_sheets_configuration");
  }

  const { access_token: federatedToken } = await googleRequest("sts", "https://sts.googleapis.com/v1/token", {
    method: "POST",
    body: new URLSearchParams({
      audience: GOOGLE_WIF_AUDIENCE,
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      requested_token_type: "urn:ietf:params:oauth:token-type:access_token",
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
      subject_token: oidc,
      scope: "https://www.googleapis.com/auth/cloud-platform",
    }),
  });

  const account = encodeURIComponent(GOOGLE_SERVICE_ACCOUNT_EMAIL);
  const { accessToken } = await googleRequest("iam", `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${account}:generateAccessToken`, {
    method: "POST",
    headers: { Authorization: `Bearer ${federatedToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ scope: [SCOPE], lifetime: "600s" }),
  });

  const row = [
    dateFormat.format(submission.at).replace(" à ", " "), submission.id,
    ...FIELDS.map(field => cellValue(formData[field])),
    emailSent ? "Envoyé" : "Échec",
  ];
  const range = encodeURIComponent(`'${GOOGLE_SHEETS_TAB.replace(/'/g, "''")}'!A1:AJ`);
  await googleRequest("sheets", `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(GOOGLE_SHEETS_ID)}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values: [row] }),
  });
}

module.exports = { appendResponse };
