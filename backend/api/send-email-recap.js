const emailService = require("../services/emailService");

module.exports = async (req, res) => {
  // Configuration CORS pour Vercel
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Gestion des requêtes OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { formData, vehicleData } = req.body;

    if (!formData) {
      return res.status(400).json({ error: "Données du formulaire requises" });
    }

    const result = await emailService.sendRecapEmail(formData, vehicleData);
    res.json(result);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
