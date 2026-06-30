const emailService = require("../services/emailService");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_FIELDS = ["prenom", "nomFamille", "email", "telephone", "immatriculation"];

const FIELD_MAX_LENGTHS = {
  prenom: 100,
  nomFamille: 100,
  adresse: 200,
  ville: 100,
  codePostal: 10,
  moisAnneePermis: 10,
  profession: 150,
  email: 254,
  telephone: 20,
  immatriculation: 20,
  marqueVehicule: 100,
  typeVersion: 200,
  energie: 50,
  bonusMalus: 10,
  sinistres36MoisDetails: 2000,
  utilisationVehicule: 100,
  modeFinancement: 100,
  lieuStationnement: 100,
  choixGaranties: 100,
  demandesParticulieres: 2000,
  commentConnaissance: 200,
};

function validateFormData(formData) {
  for (const field of REQUIRED_FIELDS) {
    if (!formData[field] || String(formData[field]).trim() === "") {
      return "Données du formulaire incomplètes.";
    }
  }
  if (!EMAIL_REGEX.test(formData.email)) {
    return "Format d'email invalide.";
  }
  for (const [field, maxLen] of Object.entries(FIELD_MAX_LENGTHS)) {
    const value = formData[field];
    if (value !== undefined && value !== null && String(value).length > maxLen) {
      return "Un ou plusieurs champs dépassent la taille maximale autorisée.";
    }
  }
  return null;
}

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

      const validationError = validateFormData(formData);
      if (validationError) {
        return res.status(400).json({ success: false, error: validationError });
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
