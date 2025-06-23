const emailService = require("../services/emailService");

class EmailController {
  async sendEmailRecap(req, res) {
    try {
      const { formData, vehicleData } = req.body;

      if (!formData) {
        return res.status(400).json({
          success: false,
          error: "Les données du formulaire sont requises",
        });
      }

      const result = await emailService.sendEmailRecap(formData, vehicleData);

      if (result.success) {
        res.json({
          success: true,
          message: "Email envoyé avec succès",
          messageId: result.messageId,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.error("Erreur dans le contrôleur d'email:", error);
      res.status(500).json({
        success: false,
        error: "Erreur interne du serveur",
      });
    }
  }
}

module.exports = new EmailController();
