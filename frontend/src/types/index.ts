// Types pour les données du véhicule
export interface VehicleData {
  erreur: string;
  immat: string;
  pays: string;
  marque: string;
  modele: string;
  date1erCir_us: string;
  date1erCir_fr: string;
  co2: string;
  energie: string;
  energieNGC: string;
  genreVCG: string;
  genreVCGNGC: string;
  puisFisc: string;
  carrosserieCG: string;
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
  ccm: string;
  cylindres: string;
  sra_id: string;
  sra_group: string;
  sra_commercial: string;
  numero_serie: string;
  ptac: string;
  logo_marque: string;
  k_type: string;
  tecdoc_manuid: string;
  tecdoc_modelid: string;
  tecdoc_carid: string;
  code_moteur: string;
  codes_platforme: string;
  nbr_req_restants: number;
  energieLibelle?: string;
  genreLibelle?: string;
  boiteVitesseLibelle?: string;
}

// Types pour les données du formulaire
export interface FormData {
  // Informations personnelles
  nomComplet: string;
  adresse: string;
  dateNaissance: string;
  datePermisB: string;
  moisAnneePermis: string;
  profession: string;
  email: string;
  telephone: string;
  
  // Informations d'assurance
  bonusMalus: string;
  sinistres36Mois: boolean;
  utilisationVehicule: string;
  
  // Informations du véhicule
  marqueVehicule: string;
  typeVersion: string;
  valeurVehicule: number;
  dateMiseCirculation: string;
  immatriculation: string;
  
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
}

export interface EmailResponse {
  success: boolean;
  message?: string;
  messageId?: string;
  error?: string;
}

// Types pour les étapes du formulaire
export enum FormStep {
  VEHICLE_SEARCH = 'vehicle_search',
  VEHICLE_FOUND = 'vehicle_found',
  PERSONAL_INFO = 'personal_info',
  INSURANCE_INFO = 'insurance_info',
  VEHICLE_INFO = 'vehicle_info',
  ADDITIONAL_INFO = 'additional_info',
  SUMMARY = 'summary'
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