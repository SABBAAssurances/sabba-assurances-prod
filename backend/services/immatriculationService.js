const axios = require("axios");

class ImmatriculationService {
  constructor() {
    this.apiKey = process.env.API_KEY_IMMATRICULATION;
    this.baseUrl = "https://api.apiplaqueimmatriculation.com";
    this.isDev = process.env.NODE_ENV === "development";
  }

  async getVehicleInfo(plaque) {
    try {
      // Si on est en mode développement, retourner les données mockées
      if (this.isDev) {
        return {
          success: true,
          data: this.getMockVehicleData(plaque),
        };
      }

      // Sinon, faire l'appel à l'API réelle
      const response = await axios.post(
        `${this.baseUrl}/plaque?immatriculation=${plaque}&token=${this.apiKey}&pays=FR`
      );

      if (response.data && response.data.data) {
        return {
          httpStatus: response.data?.httpStatus || 200,
          success: true,
          data: response.data.data,
        };
      } else {
        return {
          httpStatus: response.data?.httpStatus || 404,
          success: false,
          error: "Aucune donnée trouvée pour cette plaque",
        };
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations du véhicule:",
        error.message
      );
      return {
        httpStatus: error.response?.status || 500,
        success: false,
        error: "Erreur lors de la récupération des informations du véhicule",
      };
    }
  }

  // Méthode pour générer les données mockées
  getMockVehicleData(plaque) {
    return {
      erreur: "",
      immat: plaque.toUpperCase().replace(/[-\s]/g, ""),
      pays: "FR",
      marque: "RENAULT",
      modele: "MEGANE III",
      version: "1.9 DCI 130 XV DE FRANCE",
      debut_modele: "2009-01-01",
      fin_modele: "2012-12-31",
      date1erCir_us: "2009-04-18",
      date1erCir_fr: "18-04-2009",
      co2: "134",
      energie: "2",
      energieNGC: "DIESEL",
      type_moteur: "F9Q(870|872)",
      genreVCG: "1",
      genreVCGNGC: "VP",
      puisFisc: "7",
      carrosserieCG: "COUPE",
      code_carrosserie: "",
      carrosserie: "BE5",
      code_type_transmission: "",
      type_transmission: "Manuelle",
      capacite_litres: "1.9",
      code_systeme_alimentation: "",
      systeme_alimentation: "Injection directe",
      valves: "16",
      puisFiscReelKW: "96 KW",
      puisFiscReelCH: "131 CH",
      collection: "non",
      date30: "1989-06-30",
      vin: "VF1DZ0N0641118804",
      variante: "DZ0N06",
      boite_vitesse: "M",
      code_boite_vitesse: "",
      nr_passagers: "5",
      nb_portes: "5",
      type_mine: "DZ0N06",
      cnit: "M10JT0VP018C413",
      couleur: "NOIR",
      poids: "1807 kg",
      ptac: "1980",
      ccm: "1870 CM3",
      cylindres: "4",
      propulsion: "AVANT",
      type_compression: "TURBO",
      longueur: "431",
      largeur: "181",
      hauteur: "143",
      empattement: "264",
      sra_id: "RE80126",
      sra_group: "32",
      sra_commercial: "1.9 DCI 130 XV DE FRANCE",
      numero_serie: "41118804",
      logo_marque:
        "https://api.apiplaqueimmatriculation.com/public/storage/logos_marques/?marque=renault",
      photo_modele:
        "https://api.apiplaqueimmatriculation.com/public/storage/photos_modeles/404.jpg",
      k_type: "31164",
      tecdoc_manu_id: "0",
      tecdoc_model_id: "0",
      tecdoc_car_id: "31164",
      tecdoc_vehicules_compatible: "",
      code_moteur: "F9Q(870|872)",
      codes_platforme: "DZ0/1_",
      liste_sra_commercial: [
        { sra_id: "RE80126", sra_commercial: "1.9 DCI 130 XV DE FRANCE" },
        { sra_id: "RE80127", sra_commercial: "1.9 DCI 130 GT" },
      ],
      nbr_req_restants: 88,
    };
  }

  // Méthode utilitaire pour formater les données du véhicule
  formatVehicleData(vehicleData) {
    const energieMap = {
      1: "BIOETHANOL",
      2: "DIESEL",
      3: "ESS+G.P.L.",
      4: "ESSENCE",
      5: "ESSENCE – ELEC HYBRIDE",
      6: "ESSENCE-ELEC RECHARGEABLE",
      7: "FLEXFUEL HYBRIDE",
      8: "GAZ NATUREL",
      9: "GAZOLE – ELEC HYBRIDE",
      10: "GAZOLE-ELEC RECHARGEABLE",
      11: "GPL",
      12: "ELECTRIQUE",
      13: "ESSENCE / ETHANOL",
      14: "ESSENCE / ELECTRIQUE",
      15: "DIESEL / ELECTRIQUE",
      16: "ESSENCE / GAZ NATUREL",
      17: "ELEC / ETHANOL HYBRIDE",
    };

    const genreMap = {
      1: "VP (Véhicule Particulier)",
      2: "CTTE (Camionnette)",
      3: "VASP (Véhicule Automoteur Spécialisé)",
      4: "CAM (Camion)",
      5: "Motocyclette",
      6: "Vélomoteur et Cyclomoteur <= 50cm³",
      7: "Quadricycles à moteur",
      8: "Engin agricole",
      9: "TM (Tracteur routier)",
      10: "Cyclomoteur carrossé à 3 roues",
      11: "TCP (Transport en Commun de Personnes)",
      12: "TRR (Tracteur Routier)",
      13: "Remorque ou Semi-remorque",
      14: "RESP (Réserve Spécifique)",
    };

    const boiteVitesseMap = {
      A: "Automatique",
      M: "Manuelle",
      S: "Séquentielle",
      V: "Variable continue (CVT)",
      X: "Manuelle robotisée",
    };

    return {
      ...vehicleData,
      energieLibelle: energieMap[vehicleData.energie] || vehicleData.energieNGC,
      genreLibelle: genreMap[vehicleData.genreVCG] || vehicleData.genreVCGNGC,
      boiteVitesseLibelle:
        boiteVitesseMap[vehicleData.boite_vitesse] || vehicleData.boite_vitesse,
    };
  }
}

module.exports = new ImmatriculationService();
