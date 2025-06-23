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
        return res.json({
          success: true,
          message: "Email envoyé avec succès",
          messageId: result.messageId,
        });
      } else {
        return res.status(500).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Erreur interne du serveur",
      });
    }
  }
}

module.exports = new EmailController();
