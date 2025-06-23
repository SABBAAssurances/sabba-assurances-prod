const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route racine
app.get("/", (req, res) => {
  res.json({
    message: "API Devis Auto Prestige - Sabba Assurances",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      immatriculation: "/api/immatriculation?plaque=PLAQUE",
      email: "/api/send-email-recap (POST)",
    },
    status: "Serveur opérationnel",
  });
});

// Routes
const immatriculationRoutes = require("./routes/immatriculation");
const emailRoutes = require("./routes/email");

app.use("/api", immatriculationRoutes);
app.use("/api", emailRoutes);

// Route de test
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    message: "Serveur backend opérationnel",
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
