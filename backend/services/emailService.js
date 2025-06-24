const SibApiV3Sdk = require("sib-api-v3-sdk");

class EmailService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.sender = {
      name: "Sabba Assurances",
      email: process.env.EMAIL_SENDER,
    };
    this.recipient = {
      email: process.env.EMAIL_RECIPIENT,
      name: "Rayan Kheloufi",
    };
    this.isDev = process.env.NODE_ENV === "development";
  }

  async sendEmailRecap(formData, vehicleData) {
    try {
      // Construction du contenu HTML
      const htmlContent = this.formatEmailContent(formData, vehicleData);

      // En mode développement, on log juste le mail
      if (this.isDev) {
        console.log("--- MAIL DEV MODE ---");
        console.log(htmlContent);
        console.log("---------------------");
        return { success: true, messageId: "DEV-MODE" };
      }

      // Initialisation du client Brevo
      var defaultClient = SibApiV3Sdk.ApiClient.instance;
      var apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = this.apiKey;
      var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

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

    // Log pour debug de la version commerciale
    console.log("=== SERVICE EMAIL - VERSION COMMERCIALE ===");
    console.log("vehicleData.sra_commercial:", vehicleData?.sra_commercial);
    console.log("==========================================");

    // Utiliser les données de formData (saisies manuellement) et vehicleData (modifiées par l'utilisateur)
    const vehicleInfo = {
      immatriculation:
        formData.immatriculation || vehicleData?.immat || "Non renseigné",
      marque: formData.marqueVehicule || vehicleData?.marque || "Non renseigné",
      modele: formData.typeVersion || vehicleData?.modele || "Non renseigné",
      dateMiseCirculation:
        formData.dateMiseCirculation ||
        vehicleData?.date1erCir_us ||
        "Non renseigné",
      valeur:
        formData.valeurVehicule ||
        vehicleData?.valeurVehicule ||
        "Non renseigné",
      version: vehicleData?.version || "Non renseigné",
      versionCommerciale: vehicleData?.sra_commercial || "Non renseigné",
      debutModele: vehicleData?.debut_modele || "Non renseigné",
      finModele: vehicleData?.fin_modele || "Non renseigné",
      date1erCirFr: vehicleData?.date1erCir_fr || "Non renseigné",
      co2: vehicleData?.co2 || "Non renseigné",
      energie:
        vehicleData?.energieLibelle ||
        vehicleData?.energieNGC ||
        "Non renseigné",
      typeMoteur: vehicleData?.type_moteur || "Non renseigné",
      genreVCG:
        vehicleData?.genreLibelle ||
        vehicleData?.genreVCGNGC ||
        "Non renseigné",
      puissanceFiscale: vehicleData?.puisFisc || "Non renseigné",
      carrosserie:
        vehicleData?.carrosserieCG ||
        vehicleData?.carrosserie ||
        "Non renseigné",
      typeTransmission: vehicleData?.type_transmission || "Non renseigné",
      capaciteLitres: vehicleData?.capacite_litres || "Non renseigné",
      systemeAlimentation: vehicleData?.systeme_alimentation || "Non renseigné",
      valves: vehicleData?.valves || "Non renseigné",
      puissanceReelleKW: vehicleData?.puisFiscReelKW || "Non renseigné",
      puissanceReelleCH: vehicleData?.puisFiscReelCH || "Non renseigné",
      collection: vehicleData?.collection || "Non renseigné",
      vin: vehicleData?.vin || "Non renseigné",
      variante: vehicleData?.variante || "Non renseigné",
      boiteVitesse:
        vehicleData?.boiteVitesseLibelle ||
        vehicleData?.boite_vitesse ||
        "Non renseigné",
      nbPassagers: vehicleData?.nr_passagers || "Non renseigné",
      nbPortes: vehicleData?.nb_portes || "Non renseigné",
      typeMine: vehicleData?.type_mine || "Non renseigné",
      cnit: vehicleData?.cnit || "Non renseigné",
      couleur: vehicleData?.couleur || "Non renseigné",
      poids: vehicleData?.poids || "Non renseigné",
      ptac: vehicleData?.ptac || "Non renseigné",
      ccm: vehicleData?.ccm || "Non renseigné",
      cylindres: vehicleData?.cylindres || "Non renseigné",
      propulsion: vehicleData?.propulsion || "Non renseigné",
      typeCompression: vehicleData?.type_compression || "Non renseigné",
      longueur: vehicleData?.longueur || "Non renseigné",
      largeur: vehicleData?.largeur || "Non renseigné",
      hauteur: vehicleData?.hauteur || "Non renseigné",
      empattement: vehicleData?.empattement || "Non renseigné",
      sraId: vehicleData?.sra_id || "Non renseigné",
      sraCommercial: vehicleData?.sra_commercial || "Non renseigné",
      numeroSerie: vehicleData?.numero_serie || "Non renseigné",
      codeMoteur: vehicleData?.code_moteur || "Non renseigné",
      codesPlatforme: vehicleData?.codes_platforme || "Non renseigné",
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
          .technical-info { background-color: #e8f4f8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 Nouvelle demande de devis auto prestige</h1>
            <p>Date de demande: ${new Date().toLocaleString("fr-FR")}</p>
          </div>
          <div class="section vehicle-info">
            <h3>📋 Informations principales du véhicule</h3>
            <div class="field">
              <span class="label">Plaque d'immatriculation:</span>
              <span class="value">${vehicleInfo.immatriculation}</span>
            </div>
            <div class="field">
              <span class="label">Marque:</span>
              <span class="value">${vehicleInfo.marque}</span>
            </div>
            <div class="field">
              <span class="label">Modèle:</span>
              <span class="value">${vehicleInfo.modele}</span>
            </div>
            <div class="field">
              <span class="label">Version:</span>
              <span class="value">${vehicleInfo.version}</span>
            </div>
            <div class="field">
              <span class="label">Version commerciale choisie:</span>
              <span class="value">${vehicleInfo.versionCommerciale}</span>
            </div>
            <div class="field">
              <span class="label">Valeur d'achat ou estimée:</span>
              <span class="value">${formatCurrency(vehicleInfo.valeur)}</span>
            </div>
            <div class="field">
              <span class="label">Date de mise en circulation:</span>
              <span class="value">${formatDate(
                vehicleInfo.dateMiseCirculation
              )}</span>
            </div>
            <div class="field">
              <span class="label">Couleur:</span>
              <span class="value">${vehicleInfo.couleur}</span>
            </div>
            <div class="field">
              <span class="label">Nombre de portes:</span>
              <span class="value">${vehicleInfo.nbPortes}</span>
            </div>
            <div class="field">
              <span class="label">Nombre de passagers:</span>
              <span class="value">${vehicleInfo.nbPassagers}</span>
            </div>
          </div>
          <div class="section technical-info">
            <h3>🔧 Informations techniques</h3>
            <div class="field">
              <span class="label">Énergie:</span>
              <span class="value">${vehicleInfo.energie}</span>
            </div>
            <div class="field">
              <span class="label">Puissance fiscale:</span>
              <span class="value">${vehicleInfo.puissanceFiscale} CV</span>
            </div>
            <div class="field">
              <span class="label">Puissance réelle:</span>
              <span class="value">${vehicleInfo.puissanceReelleCH} (${
      vehicleInfo.puissanceReelleKW
    })</span>
            </div>
            <div class="field">
              <span class="label">Type de moteur:</span>
              <span class="value">${vehicleInfo.typeMoteur}</span>
            </div>
            <div class="field">
              <span class="label">Code moteur:</span>
              <span class="value">${vehicleInfo.codeMoteur}</span>
            </div>
            <div class="field">
              <span class="label">Cylindrée:</span>
              <span class="value">${vehicleInfo.ccm}</span>
            </div>
            <div class="field">
              <span class="label">Nombre de cylindres:</span>
              <span class="value">${vehicleInfo.cylindres}</span>
            </div>
            <div class="field">
              <span class="label">Capacité en litres:</span>
              <span class="value">${vehicleInfo.capaciteLitres} L</span>
            </div>
            <div class="field">
              <span class="label">Système d'alimentation:</span>
              <span class="value">${vehicleInfo.systemeAlimentation}</span>
            </div>
            <div class="field">
              <span class="label">Nombre de soupapes:</span>
              <span class="value">${vehicleInfo.valves}</span>
            </div>
            <div class="field">
              <span class="label">Type de compression:</span>
              <span class="value">${vehicleInfo.typeCompression}</span>
            </div>
            <div class="field">
              <span class="label">Boîte de vitesse:</span>
              <span class="value">${vehicleInfo.boiteVitesse}</span>
            </div>
            <div class="field">
              <span class="label">Type de transmission:</span>
              <span class="value">${vehicleInfo.typeTransmission}</span>
            </div>
            <div class="field">
              <span class="label">Propulsion:</span>
              <span class="value">${vehicleInfo.propulsion}</span>
            </div>
            <div class="field">
              <span class="label">Carrosserie:</span>
              <span class="value">${vehicleInfo.carrosserie}</span>
            </div>
            <div class="field">
              <span class="label">Genre véhicule:</span>
              <span class="value">${vehicleInfo.genreVCG}</span>
            </div>
            <div class="field">
              <span class="label">Émissions CO2:</span>
              <span class="value">${vehicleInfo.co2} g/km</span>
            </div>
            <div class="field">
              <span class="label">Poids:</span>
              <span class="value">${vehicleInfo.poids}</span>
            </div>
            <div class="field">
              <span class="label">PTAC:</span>
              <span class="value">${vehicleInfo.ptac} kg</span>
            </div>
            <div class="field">
              <span class="label">Dimensions (L x l x h):</span>
              <span class="value">${vehicleInfo.longueur} x ${
      vehicleInfo.largeur
    } x ${vehicleInfo.hauteur} mm</span>
            </div>
            <div class="field">
              <span class="label">Empattement:</span>
              <span class="value">${vehicleInfo.empattement} mm</span>
            </div>
          </div>
          <div class="section">
            <h3>📋 Informations d'identification</h3>
            <div class="field">
              <span class="label">Numéro VIN:</span>
              <span class="value">${vehicleInfo.vin}</span>
            </div>
            <div class="field">
              <span class="label">Variante:</span>
              <span class="value">${vehicleInfo.variante}</span>
            </div>
            <div class="field">
              <span class="label">Type mine:</span>
              <span class="value">${vehicleInfo.typeMine}</span>
            </div>
            <div class="field">
              <span class="label">CNIT:</span>
              <span class="value">${vehicleInfo.cnit}</span>
            </div>
            <div class="field">
              <span class="label">Numéro de série:</span>
              <span class="value">${vehicleInfo.numeroSerie}</span>
            </div>
            <div class="field">
              <span class="label">SRA ID:</span>
              <span class="value">${vehicleInfo.sraId}</span>
            </div>
            <div class="field">
              <span class="label">SRA Commercial:</span>
              <span class="value">${vehicleInfo.sraCommercial}</span>
            </div>
            <div class="field">
              <span class="label">Codes plateforme:</span>
              <span class="value">${vehicleInfo.codesPlatforme}</span>
            </div>
            <div class="field">
              <span class="label">Période modèle:</span>
              <span class="value">${formatDate(
                vehicleInfo.debutModele
              )} - ${formatDate(vehicleInfo.finModele)}</span>
            </div>
            <div class="field">
              <span class="label">Collection:</span>
              <span class="value">${vehicleInfo.collection}</span>
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
