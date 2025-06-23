const immatriculationService = require("../services/immatriculationService");

class ImmatriculationController {
  async getVehicleInfo(req, res) {
    try {
      const { plaque } = req.query;

      if (!plaque) {
        return res.status(400).json({
          success: false,
          error: "La plaque d'immatriculation est requise",
        });
      }

      // Nettoyer la plaque d'immatriculation
      const cleanPlaque = plaque.replace(/[-\s]/g, "").toUpperCase();

      const result = await immatriculationService.getVehicleInfo(cleanPlaque);

      if (result.success) {
        // Formater les données du véhicule
        const formattedData = immatriculationService.formatVehicleData(
          result.data
        );
        return res.status(404).json({
          success: true,
          data: formattedData,
        });
      } else {
        return res.status(404).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error("Erreur dans le contrôleur d'immatriculation:", error);
      return res.status(500).json({
        success: false,
        error: "Erreur interne du serveur",
      });
    }
  }
}

module.exports = new ImmatriculationController();
