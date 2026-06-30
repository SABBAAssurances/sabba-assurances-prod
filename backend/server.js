const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }),
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
  res.json({ message: "API Devis Auto Prestige - Sabba Assurances", version: "1.0.0", status: "Serveur opérationnel" });
});

// Health check sans middleware (monitoring, pas d'auth requise)
app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "OK", message: "Serveur backend opérationnel" });
});

const immatriculationRoutes = require("./routes/immatriculation");
const emailRoutes = require("./routes/email");

app.use("/api/vref", requireFrontendOrigin, requireTurnstileToken, immatriculationRoutes);
app.use("/api", requireFrontendOrigin, requireTurnstileToken, emailRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
