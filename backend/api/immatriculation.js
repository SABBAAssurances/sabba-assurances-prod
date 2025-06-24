const immatriculationService = require("../services/immatriculationService");

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

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { plaque } = req.query;

    if (!plaque) {
      return res
        .status(400)
        .json({ error: "Plaque d'immatriculation requise" });
    }

    const vehicleData = await immatriculationService.getVehicleByPlate(plaque);
    res.json(vehicleData);
  } catch (error) {
    console.error("Erreur lors de la recherche du véhicule:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
