const SibApiV3Sdk = require("sib-api-v3-sdk");

class EmailService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.sender = {
      name: "Sabba Assurances",
      email: process.env.EMAIL_SENDER,
    };
    this.recipients = this._parseRecipients(process.env.EMAILS_RECIPIENT);
    this.isDev = process.env.NODE_ENV !== "production";
  }

  /**
   * Parse la liste des emails destinataires depuis la variable d'environnement
   * @param {string} emailsString - Liste d'emails séparés par des virgules
   * @returns {Array} - Tableau d'objets recipients au format Brevo
   */
  _parseRecipients(emailsString) {
    if (!emailsString || emailsString.trim() === "") {
      console.warn(
        "⚠️  EMAILS_RECIPIENT non défini. Aucun email ne sera envoyé."
      );
      return [];
    }

    // Séparer les emails par virgule, nettoyer les espaces et filtrer les vides
    const emails = emailsString
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    // Valider le format des emails et créer les objets recipients
    const recipients = emails
      .filter((email) => this._isValidEmail(email))
      .map((email) => ({ email, name: "Sabba Asurance" }));

    if (recipients.length === 0) {
      console.warn(
        "⚠️  Aucun email valide trouvé dans EMAILS_RECIPIENT. Aucun email ne sera envoyé."
      );
    } else {
      console.log(
        `✅ ${recipients.length} destinataire(s) configuré(s) : ${recipients
          .map((r) => r.email)
          .join(", ")}`
      );
    }

    return recipients;
  }

  /**
   * Valide le format d'une adresse email
   * @param {string} email - Email à valider
   * @returns {boolean} - True si l'email est valide
   */
  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    if (!isValid) {
      console.warn(`⚠️  Email invalide ignoré : ${email}`);
    }
    return isValid;
  }

  async sendEmailRecap(formData, vehicleData) {
    try {
      // Vérifier qu'il y a au moins un destinataire
      if (!this.recipients || this.recipients.length === 0) {
        console.error(
          "❌ Aucun destinataire configuré. Impossible d'envoyer l'email."
        );
        return {
          success: false,
          error:
            "Aucun destinataire configuré. Veuillez définir EMAILS_RECIPIENT dans les variables d'environnement.",
        };
      }

      // Construction du contenu HTML
      const htmlContent = this.formatEmailContent(formData, vehicleData);

      // En mode développement, on log juste le mail
      if (this.isDev) {
        console.log("--- MAIL DEV MODE ---");
        console.log(
          `Destinataires: ${this.recipients.map((r) => r.email).join(", ")}`
        );
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
      sendSmtpEmail.to = this.recipients;
      sendSmtpEmail.subject = "Nouvelle demande de devis auto prestige";
      sendSmtpEmail.htmlContent = htmlContent;

      // Envoi de l'email
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log(
        `✅ Email envoyé avec succès à ${this.recipients.length} destinataire(s)`
      );
      return {
        success: true,
        messageId: data.messageId,
      };
    } catch (error) {
      console.error(
        "❌ Erreur lors de l'envoi de l'email via Brevo:",
        error.message
      );
      return {
        success: false,
        error: "Erreur lors de l'envoi de l'email via Brevo",
      };
    }
  }

  formatEmailContent(formData, vehicleData) {
    const esc = (str) => {
      if (str === null || str === undefined) return "Non renseigné";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };
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

    // Toutes les valeurs passent par esc() pour éviter l'injection HTML
    const vehicleInfo = {
      immatriculation: esc(formData.immatriculation || vehicleData?.immat),
      marque: esc(formData.marqueVehicule || vehicleData?.marque),
      modele: esc(formData.typeVersion || vehicleData?.modele),
      dateMiseCirculation: esc(formData.dateMiseCirculation || vehicleData?.date1erCir_us),
      valeur: esc(formData.valeurVehicule || vehicleData?.valeurVehicule),
      version: esc(vehicleData?.version),
      versionCommerciale: esc(vehicleData?.sra_commercial),
      debutModele: esc(vehicleData?.debut_modele),
      finModele: esc(vehicleData?.fin_modele),
      date1erCirFr: esc(vehicleData?.date1erCir_fr),
      co2: esc(vehicleData?.co2),
      energie: esc(vehicleData?.energieLibelle || vehicleData?.energieNGC),
      typeMoteur: esc(vehicleData?.type_moteur),
      genreVCG: esc(vehicleData?.genreLibelle || vehicleData?.genreVCGNGC),
      puissanceFiscale: esc(vehicleData?.puisFisc),
      carrosserie: esc(vehicleData?.carrosserieCG || vehicleData?.carrosserie),
      typeTransmission: esc(vehicleData?.type_transmission),
      capaciteLitres: esc(vehicleData?.capacite_litres),
      systemeAlimentation: esc(vehicleData?.systeme_alimentation),
      valves: esc(vehicleData?.valves),
      puissanceReelleKW: esc(vehicleData?.puisFiscReelKW),
      puissanceReelleCH: esc(vehicleData?.puisFiscReelCH),
      collection: esc(vehicleData?.collection),
      vin: esc(vehicleData?.vin),
      variante: esc(vehicleData?.variante),
      boiteVitesse: esc(vehicleData?.boiteVitesseLibelle || vehicleData?.boite_vitesse),
      nbPassagers: esc(vehicleData?.nr_passagers),
      nbPortes: esc(vehicleData?.nb_portes),
      typeMine: esc(vehicleData?.type_mine),
      cnit: esc(vehicleData?.cnit),
      couleur: esc(vehicleData?.couleur),
      poids: esc(vehicleData?.poids),
      ptac: esc(vehicleData?.ptac),
      ccm: esc(vehicleData?.ccm),
      cylindres: esc(vehicleData?.cylindres),
      propulsion: esc(vehicleData?.propulsion),
      typeCompression: esc(vehicleData?.type_compression),
      longueur: esc(vehicleData?.longueur),
      largeur: esc(vehicleData?.largeur),
      hauteur: esc(vehicleData?.hauteur),
      empattement: esc(vehicleData?.empattement),
      sraId: esc(vehicleData?.sra_id),
      sraCommercial: esc(vehicleData?.sra_commercial),
      numeroSerie: esc(vehicleData?.numero_serie),
      codeMoteur: esc(vehicleData?.code_moteur),
      codesPlatforme: esc(vehicleData?.codes_platforme),
    };

    // Champs personnels — saisie libre, échappement obligatoire
    const userInfo = {
      prenom: esc(formData.prenom),
      nomFamille: esc(formData.nomFamille),
      adresse: esc(formData.adresse),
      ville: esc(formData.ville),
      codePostal: esc(formData.codePostal),
      dateNaissance: formatDate(formData.dateNaissance),
      moisAnneePermis: esc(formData.moisAnneePermis),
      profession: esc(formData.profession),
      email: esc(formData.email),
      telephone: esc(formData.telephone),
      bonusMalus: esc(formData.bonusMalus),
      sinistres36Mois: formData.sinistres36Mois ? "OUI" : "NON",
      sinistres36MoisDetails: esc(formData.sinistres36MoisDetails),
      utilisationVehicule: esc(formData.utilisationVehicule),
      modeFinancement: esc(formData.modeFinancement),
      lieuStationnement: esc(formData.lieuStationnement),
      choixGaranties: esc(formData.choixGaranties),
      demandesParticulieres: esc(formData.demandesParticulieres),
      commentConnaissance: esc(formData.commentConnaissance),
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
            <h1>Nouvelle demande de devis auto prestige</h1>
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
              <span class="label">Prénom:</span>
              <span class="value">${userInfo.prenom}</span>
            </div>
            <div class="field">
              <span class="label">Nom de famille:</span>
              <span class="value">${userInfo.nomFamille}</span>
            </div>
            <div class="field">
              <span class="label">Adresse:</span>
              <span class="value">${userInfo.adresse}</span>
            </div>
            <div class="field">
              <span class="label">Ville:</span>
              <span class="value">${userInfo.ville}</span>
            </div>
            <div class="field">
              <span class="label">Code postal:</span>
              <span class="value">${userInfo.codePostal}</span>
            </div>
            <div class="field">
              <span class="label">Date de naissance:</span>
              <span class="value">${userInfo.dateNaissance}</span>
            </div>
            <div class="field">
              <span class="label">Mois/année permis:</span>
              <span class="value">${userInfo.moisAnneePermis}</span>
            </div>
            <div class="field">
              <span class="label">Profession &amp; secteur:</span>
              <span class="value">${userInfo.profession}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${userInfo.email}</span>
            </div>
            <div class="field">
              <span class="label">Téléphone:</span>
              <span class="value">${userInfo.telephone}</span>
            </div>
          </div>
          <div class="section">
            <h3>🚗 Informations d'assurance</h3>
            <div class="field">
              <span class="label">Bonus/Malus:</span>
              <span class="value">${userInfo.bonusMalus}</span>
            </div>
            <div class="field">
              <span class="label">Sinistres dans les 36 derniers mois:</span>
              <span class="value">${userInfo.sinistres36Mois}</span>
            </div>
            ${
              formData.sinistres36Mois && userInfo.sinistres36MoisDetails
                ? `<div class="field">
                    <span class="label">Détails des sinistres:</span>
                    <span class="value">${userInfo.sinistres36MoisDetails}</span>
                   </div>`
                : ""
            }
            <div class="field">
              <span class="label">Utilisation du véhicule:</span>
              <span class="value">${userInfo.utilisationVehicule}</span>
            </div>
            <div class="field">
              <span class="label">Mode de financement:</span>
              <span class="value">${userInfo.modeFinancement}</span>
            </div>
            <div class="field">
              <span class="label">Lieu de stationnement:</span>
              <span class="value">${userInfo.lieuStationnement}</span>
            </div>
            <div class="field">
              <span class="label">Choix des garanties:</span>
              <span class="value">${userInfo.choixGaranties}</span>
            </div>
          </div>
          <div class="section">
            <h3>📝 Informations complémentaires</h3>
            <div class="field">
              <span class="label">Demandes particulières:</span>
              <span class="value">${userInfo.demandesParticulieres}</span>
            </div>
            <div class="field">
              <span class="label">Comment nous avez-vous connu:</span>
              <span class="value">${userInfo.commentConnaissance}</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
