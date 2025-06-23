const SibApiV3Sdk = require("sib-api-v3-sdk");

class EmailService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.sender = {
      name: "Sabba Assurances",
      email: "noreply@sabba-assurances.com",
    };
    this.recipient = {
      email: "rayan.kheloufi@hotmail.com",
      name: "Rayan Kheloufi",
    };
  }

  async sendEmailRecap(formData, vehicleData) {
    try {
      // Initialisation du client Brevo
      var defaultClient = SibApiV3Sdk.ApiClient.instance;
      var apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = this.apiKey;
      var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

      // Construction du contenu HTML
      const htmlContent = this.formatEmailContent(formData, vehicleData);

      // Préparation de l'email
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.sender = this.sender;
      sendSmtpEmail.to = [this.recipient];
      sendSmtpEmail.subject = "Nouvelle demande de devis auto prestige";
      sendSmtpEmail.htmlContent = htmlContent;

      // Envoi de l'email
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      return {
        success: true,
        messageId: data.messageId,
      };
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'email via Brevo:",
        error.message
      );
      return {
        success: false,
        error: "Erreur lors de l'envoi de l'email via Brevo",
      };
    }
  }

  formatEmailContent(formData, vehicleData) {
    const formatDate = (dateString) => {
      if (!dateString) return "Non renseigné";
      return new Date(dateString).toLocaleDateString("fr-FR");
    };
    const formatCurrency = (amount) => {
      if (!amount) return "Non renseigné";
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
    };
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nouvelle demande de devis auto prestige</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
          .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .section h3 { color: #2c3e50; margin-top: 0; }
          .field { margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .value { margin-left: 10px; }
          .vehicle-info { background-color: #f8f9fa; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 Nouvelle demande de devis auto prestige</h1>
            <p>Date de demande: ${new Date().toLocaleString("fr-FR")}</p>
          </div>
          <div class="section vehicle-info">
            <h3>📋 Informations du véhicule</h3>
            <div class="field">
              <span class="label">Plaque d'immatriculation:</span>
              <span class="value">${
                vehicleData?.immat || "Non renseigné"
              }</span>
            </div>
            <div class="field">
              <span class="label">Marque:</span>
              <span class="value">${
                vehicleData?.marque || "Non renseigné"
              }</span>
            </div>
            <div class="field">
              <span class="label">Modèle:</span>
              <span class="value">${
                vehicleData?.modele || "Non renseigné"
              }</span>
            </div>
            <div class="field">
              <span class="label">Énergie:</span>
              <span class="value">${
                vehicleData?.energieLibelle ||
                vehicleData?.energieNGC ||
                "Non renseigné"
              }</span>
            </div>
            <div class="field">
              <span class="label">Date de première mise en circulation:</span>
              <span class="value">${formatDate(
                vehicleData?.date1erCir_us
              )}</span>
            </div>
            <div class="field">
              <span class="label">Puissance fiscale:</span>
              <span class="value">${
                vehicleData?.puisFisc || "Non renseigné"
              } CV</span>
            </div>
            <div class="field">
              <span class="label">Puissance réelle:</span>
              <span class="value">${
                vehicleData?.puisFiscReelCH || "Non renseigné"
              }</span>
            </div>
            <div class="field">
              <span class="label">Boîte de vitesse:</span>
              <span class="value">${
                vehicleData?.boiteVitesseLibelle ||
                vehicleData?.boite_vitesse ||
                "Non renseigné"
              }</span>
            </div>
          </div>
          <div class="section">
            <h3>👤 Informations personnelles</h3>
            <div class="field">
              <span class="label">Nom complet:</span>
              <span class="value">${
                formData.nomComplet || "Non renseigné"
              }</span>
            </div>
            <div class="field">
              <span class="label">Adresse:</span>
              <span class="value">${formData.adresse || "Non renseigné"}</span>
            </div>
            <div class="field">
              <span class="label">Date de naissance:</span>
              <span class="value">${formatDate(formData.dateNaissance)}</span>
            </div>
            <div class="field">
              <span class="label">Date de permis B:</span>
              <span class="value">${formatDate(formData.datePermisB)}</span>
            </div>
            <div class="field">
              <span class="label">Mois/année permis:</span>
              <span class="value">${
                formData.moisAnneePermis || "Non renseigné"
              }</span>
            </div>
            <div class="field">
              <span class="label">Profession & secteur:</span>
              <span class="value">${
                formData.profession || "Non renseigné"
              }</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${formData.email || "Non renseigné"}</span>
            </div>
            <div class="field">
              <span class="label">Téléphone:</span>
              <span class="value">${
                formData.telephone || "Non renseigné"
              }</span>
            </div>
          </div>
          <div class="section">
            <h3>🚗 Informations d'assurance</h3>
            <div class="field">
              <span class="label">Bonus/Malus:</span>
              <span class="value">${
                formData.bonusMalus || "Non renseigné"
              }</span>
            </div>
            <div class="field">
              <span class="label">Sinistres dans les 36 derniers mois:</span>
              <span class="value">${
                formData.sinistres36Mois ? "OUI" : "NON"
              }</span>
            </div>
            <div class="field">
              <span class="label">Utilisation du véhicule:</span>
              <span class="value">${
                formData.utilisationVehicule || "Non renseigné"
              }</span>
            </div>
            <div class="field">
              <span class="label">Valeur d'achat ou estimée:</span>
              <span class="value">${formatCurrency(
                formData.valeurVehicule
              )}</span>
            </div>
            <div class="field">
              <span class="label">Mode de financement:</span>
              <span class="value">${
                formData.modeFinancement || "Non renseigné"
              }</span>
            </div>
            <div class="field">
              <span class="label">Lieu de stationnement:</span>
              <span class="value">${
                formData.lieuStationnement || "Non renseigné"
              }</span>
            </div>
            <div class="field">
              <span class="label">Choix des garanties:</span>
              <span class="value">${
                formData.choixGaranties || "Non renseigné"
              }</span>
            </div>
          </div>
          <div class="section">
            <h3>📝 Informations complémentaires</h3>
            <div class="field">
              <span class="label">Demandes particulières:</span>
              <span class="value">${
                formData.demandesParticulieres || "Aucune"
              }</span>
            </div>
            <div class="field">
              <span class="label">Comment nous avez-vous connu:</span>
              <span class="value">${
                formData.commentConnaissance || "Non renseigné"
              }</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
