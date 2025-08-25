import React, { useEffect, useState } from "react";
import AdditionalInfoStep from "./components/AdditionalInfoStep";
import ApiResultStep from "./components/ApiResultStep";
import InsuranceInfoStep from "./components/InsuranceInfoStep";
import PersonalInfoStepFirstPart from "./components/PersonalInfoStepFirstPart";
import PersonalInfoStepSecondPart from "./components/PersonalInfoStepSecondPart";
import StepIndicator from "./components/StepIndicator";
import SuccessStep from "./components/SuccessStep";
import SummaryStep from "./components/SummaryStep";
import VehicleInfoStep from "./components/VehicleInfoStep";
import VehicleSearch from "./components/VehicleSearch";
import { apiService } from "./services/api";
import "./styles/App.css";
import { FormData, FormStep, VehicleData } from "./types";

// Ordre centralisé des étapes
const STEPS_ORDER = [
  FormStep.VEHICLE_SEARCH,
  FormStep.API_RESULT,
  FormStep.INSURANCE_INFO,
  FormStep.VEHICLE_INFO,
  FormStep.ADDITIONAL_INFO,
  FormStep.PERSONAL_INFO_FIRST_PART,
  FormStep.PERSONAL_INFO_SECOND_PART,
  FormStep.SUMMARY,
  FormStep.SUCCESS,
];

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>(
    FormStep.VEHICLE_SEARCH
  );
  const [formData, setFormData] = useState<FormData>({
    nomComplet: "",
    adresse: "",
    codePostal: "",
    dateNaissance: "",
    moisAnneePermis: "",
    profession: "",
    email: "",
    telephone: "",
    bonusMalus: "0.50",
    sinistres36Mois: false,
    sinistres36MoisDetails: "",
    utilisationVehicule: "",
    marqueVehicule: "",
    typeVersion: "",
    valeurVehicule: undefined,
    dateMiseCirculation: "",
    immatriculation: "",
    energie: "",
    puissanceFiscale: "",
    puissanceReelle: "",
    boiteVitesse: "",
    carrosserie: "",
    nombrePortes: "",
    nombrePlaces: "",
    couleur: "",
    modeFinancement: "",
    lieuStationnement: "",
    choixGaranties: "Tous Risques",
    demandesParticulieres: "",
    commentConnaissance: "",
  });
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Vérifier la santé du serveur au démarrage
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const health = await apiService.healthCheck();

        if (!health.success) {
          setError(
            "Serveur backend indisponible. Veuillez réessayer plus tard."
          );
        }
      } catch (error) {
        setError("Impossible de contacter le serveur backend.");
      }
    };

    checkServerHealth();
  }, []);

  // Fonctions de navigation centralisées
  const getCurrentStepIndex = () => STEPS_ORDER.indexOf(currentStep);

  const navigateToStep = (step: FormStep) => {
    setCurrentStep(step);
    setError(null);
    setSuccess(null);
  };

  const navigateToNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < STEPS_ORDER.length - 1) {
      navigateToStep(STEPS_ORDER[currentIndex + 1]);
    }
  };

  const navigateToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();

    // Gestion des cas spéciaux
    if (currentStep === FormStep.INSURANCE_INFO) {
      if (!vehicleData) {
        navigateToStep(FormStep.VEHICLE_SEARCH);
      } else {
        navigateToStep(FormStep.API_RESULT);
      }
      return;
    }
    // Navigation standard
    if (currentIndex > 0) {
      navigateToStep(STEPS_ORDER[currentIndex - 1]);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updateVehicleData = (updates: Partial<VehicleData>) => {
    setVehicleData((prev) => {
      const newData = prev ? { ...prev, ...updates } : null;
      return newData;
    });
  };

  const handleVehicleSearch = async (plaque: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.getVehicleInfo(plaque);

      if (result.success && result.data) {
        setVehicleData(result.data);
        // Pré-remplir les données du véhicule
        updateFormData({
          marqueVehicule: result.data.marque,
          typeVersion: result.data.modele,
          dateMiseCirculation: result.data.date1erCir_us,
          immatriculation: result.data.immat,
          energie: result.data.energieLibelle || result.data.energieNGC || "",
          puissanceFiscale: result.data.puisFisc || "",
          puissanceReelle: result.data.puisFiscReelCH || "",
          boiteVitesse:
            result.data.boiteVitesseLibelle || result.data.boite_vitesse || "",
          carrosserie: `${result.data.carrosserieCG || ""} ${
            result.data.carrosserie ? `(${result.data.carrosserie})` : ""
          }`.trim(),
          nombrePortes: result.data.nb_portes || "",
          nombrePlaces: result.data.nr_passagers || "",
          couleur: result.data.couleur || "",
        });
        navigateToStep(FormStep.API_RESULT);
      } else {
        if (result.httpCode !== 404) {
          setError(
            "Une erreur est survenue lors de la récupération des informations."
          );
        }
        setVehicleData(null);
        navigateToStep(FormStep.API_RESULT);
      }
    } catch (error) {
      // En cas d'erreur, on affiche aussi le résultat
      setVehicleData(null);
      setError(
        "Une erreur est survenue lors de la récupération des informations."
      );
      navigateToStep(FormStep.API_RESULT);
    } finally {
      setLoading(false);
    }
  };

  const handleApiResultContinue = (modifiedData?: VehicleData | null) => {
    // Si des données modifiées sont fournies, les utiliser à la place des données originales
    if (modifiedData) {
      setVehicleData(modifiedData);
      updateFormData({
        marqueVehicule: modifiedData.marque,
        typeVersion: modifiedData.modele,
        dateMiseCirculation: modifiedData.date1erCir_us,
        immatriculation: modifiedData.immat,
        // Ajout des autres champs du véhicule
        energie: modifiedData.energieLibelle || modifiedData.energieNGC || "",
        puissanceFiscale: modifiedData.puisFisc || "",
        puissanceReelle: modifiedData.puisFiscReelCH || "",
        boiteVitesse:
          modifiedData.boiteVitesseLibelle || modifiedData.boite_vitesse || "",
        carrosserie: `${modifiedData.carrosserieCG || ""} ${
          modifiedData.carrosserie ? `(${modifiedData.carrosserie})` : ""
        }`.trim(),
        nombrePortes: modifiedData.nb_portes || "",
        nombrePlaces: modifiedData.nr_passagers || "",
        couleur: modifiedData.couleur || "",
      });
    }
    navigateToNextStep();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.sendEmailRecap(
        formData,
        vehicleData || undefined
      );

      if (result.success) {
        setSuccess(
          "Votre demande a été envoyée avec succès ! Nous vous contacterons rapidement."
        );
        navigateToStep(FormStep.SUCCESS);
      } else {
        setError(result.error || "Erreur lors de l'envoi de la demande");
      }
    } catch (error) {
      setError("Erreur lors de l'envoi de la demande");
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case FormStep.VEHICLE_SEARCH:
        return (
          <VehicleSearch
            onSearch={handleVehicleSearch}
            loading={loading}
            error={error}
          />
        );

      case FormStep.API_RESULT:
        return (
          <ApiResultStep
            vehicleData={vehicleData}
            onBack={navigateToPreviousStep}
            onContinue={handleApiResultContinue}
          />
        );

      case FormStep.PERSONAL_INFO_FIRST_PART:
        return (
          <PersonalInfoStepFirstPart
            formData={formData}
            onUpdate={updateFormData}
            onNext={navigateToNextStep}
            onPrev={navigateToPreviousStep}
          />
        );

      case FormStep.PERSONAL_INFO_SECOND_PART:
        return (
          <PersonalInfoStepSecondPart
            formData={formData}
            onUpdate={updateFormData}
            onNext={navigateToNextStep}
            onPrev={navigateToPreviousStep}
          />
        );

      case FormStep.INSURANCE_INFO:
        return (
          <InsuranceInfoStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={navigateToNextStep}
            onPrev={navigateToPreviousStep}
          />
        );

      case FormStep.VEHICLE_INFO:
        return (
          <VehicleInfoStep
            formData={formData}
            vehicleData={vehicleData}
            onUpdate={updateFormData}
            onVehicleDataUpdate={updateVehicleData}
            onNext={navigateToNextStep}
            onPrev={navigateToPreviousStep}
          />
        );

      case FormStep.ADDITIONAL_INFO:
        return (
          <AdditionalInfoStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={navigateToNextStep}
            onPrev={navigateToPreviousStep}
          />
        );

      case FormStep.SUMMARY:
        return (
          <SummaryStep
            formData={formData}
            vehicleData={vehicleData}
            onSubmit={handleSubmit}
            onPrev={navigateToPreviousStep}
            loading={loading}
            error={error}
            success={success}
          />
        );

      case FormStep.SUCCESS:
        return <SuccessStep />;

      default:
        return <div>Étape non reconnue</div>;
    }
  };

  return (
    <div className="app-container">
      <StepIndicator currentStep={currentStep} />
      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}
      {renderCurrentStep()}
    </div>
  );
};

export default App;
