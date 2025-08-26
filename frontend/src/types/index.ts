// Types pour les données du véhicule
export interface VehicleData {
  erreur: string;
  immat: string;
  pays: string;
  marque: string;
  modele: string;
  version?: string;
  debut_modele?: string;
  fin_modele?: string;
  date1erCir_us: string;
  date1erCir_fr: string;
  co2: string;
  energie: string;
  energieNGC: string;
  type_moteur?: string;
  genreVCG: string;
  genreVCGNGC: string;
  puisFisc: string;
  carrosserieCG: string;
  code_carrosserie?: string;
  carrosserie?: string;
  code_type_transmission?: string;
  type_transmission?: string;
  capacite_litres?: string;
  code_systeme_alimentation?: string;
  systeme_alimentation?: string;
  valves?: string;
  puisFiscReelKW: string;
  puisFiscReelCH: string;
  collection: string;
  date30: string;
  vin: string;
  variante: string;
  boite_vitesse: string;
  code_boite_vitesse: string;
  nr_passagers: string;
  nb_portes: string;
  type_mine: string;
  cnit: string;
  couleur: string;
  poids: string;
  ptac?: string;
  ccm: string;
  cylindres: string;
  propulsion?: string;
  type_compression?: string;
  longueur?: string;
  largeur?: string;
  hauteur?: string;
  empattement?: string;
  sra_id: string;
  sra_group: string;
  sra_commercial: string;
  numero_serie: string;
  logo_marque: string;
  photo_modele?: string;
  k_type: string;
  tecdoc_manu_id?: string;
  tecdoc_model_id?: string;
  tecdoc_car_id: string;
  tecdoc_vehicules_compatible?: string;
  code_moteur: string;
  codes_platforme: string;
  liste_sra_commercial?: { sra_id: string; sra_commercial: string }[];
  nbr_req_restants: number;
  energieLibelle?: string;
  genreLibelle?: string;
  boiteVitesseLibelle?: string;
}

// Types pour les données du formulaire
export interface FormData {
  // Informations personnelles
  prenom: string;
  nomFamille: string;
  ville: string;
  adresse: string;
  codePostal: string;
  dateNaissance: string;
  moisAnneePermis: string;
  profession: string;
  email: string;
  telephone: string;
  
  // Informations d'assurance
  bonusMalus: string;
  sinistres36Mois: boolean;
  sinistres36MoisDetails: string;
  utilisationVehicule: string;
  
  // Informations du véhicule
  marqueVehicule: string;
  typeVersion: string;
  valeurVehicule: number | undefined;
  dateMiseCirculation: string;
  immatriculation: string;
  energie: string;
  puissanceFiscale: string;
  puissanceReelle: string;
  boiteVitesse: string;
  carrosserie: string;
  nombrePortes: string;
  nombrePlaces: string;
  couleur: string;
  nombreCVFiscaux: string;
  
  // Informations complémentaires
  modeFinancement: string;
  lieuStationnement: string;
  choixGaranties: string;
  demandesParticulieres: string;
  commentConnaissance: string;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  httpCode?: number;
}

export interface EmailResponse {
  success: boolean;
  message?: string;
  messageId?: string;
  error?: string;
  httpCode?: number;
}

// Types pour les étapes du formulaire
export enum FormStep {
  VEHICLE_SEARCH = 'vehicle_search',
  API_RESULT = 'api_result',
  INSURANCE_INFO = 'insurance_info',
  VEHICLE_INFO = 'vehicle_info',
  ADDITIONAL_INFO = 'additional_info',
  PERSONAL_INFO_FIRST_PART = 'personal_info_first_part',
  PERSONAL_INFO_SECOND_PART = 'personal_info_second_part',
  SUMMARY = 'summary',
  SUCCESS = 'success'
}

// Types pour les options des menus déroulants
export interface SelectOption {
  value: string;
  label: string;
}

// Types pour les erreurs de validation
export interface ValidationError {
  field: string;
  message: string;
} 