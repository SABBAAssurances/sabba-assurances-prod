const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.TURNSTILE_SECRET_KEY) {
  throw new Error("FATAL: TURNSTILE_SECRET_KEY non défini.");
}

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(helmet({ frameguard: false }));
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// Vérifie que la requête provient du frontend (navigateur).
// Les navigateurs envoient toujours le header Origin pour les requêtes cross-origin.
// Les scripts directs (bots, curl) ne l'envoient pas ou envoient un mauvais Origin.
function requireFrontendOrigin(req, res, next) {
  const origin = req.headers.origin;
  if (!origin || origin !== FRONTEND_URL) {
    return res.status(403).json({ success: false, error: "Accès non autorisé." });
  }
  next();
}

async function requireTurnstileToken(req, res, next) {
  const token = req.headers["x-turnstile-token"];
  if (!token) {
    return res.status(403).json({ success: false, error: "Vérification manquante." });
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });
    const data = await response.json();
    if (!data.success) {
      return res.status(403).json({ success: false, error: "Vérification échouée." });
    }
    next();
  } catch (err) {
    console.error("Erreur vérification Turnstile:", err.message);
    return res.status(500).json({ success: false, error: "Erreur de vérification." });
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "API Devis Auto Prestige - Sabba Assurances",
    version: "1.0.0",
    status: "Serveur opérationnel",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "OK", message: "Serveur backend opérationnel" });
});

const immatriculationRoutes = require("../routes/immatriculation");
const emailRoutes = require("../routes/email");

app.use("/api/vref", requireFrontendOrigin, requireTurnstileToken, immatriculationRoutes);
app.use("/api", requireFrontendOrigin, requireTurnstileToken, emailRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

module.exports = app;
