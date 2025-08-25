import React, { useEffect, useState } from "react";
import AdditionalInfoStep from "./components/AdditionalInfoStep";
import ApiResultStep from "./components/ApiResultStep";
import InsuranceInfoStep from "./components/InsuranceInfoStep";
import PersonalInfoStep from "./components/PersonalInfoStep";
import StepIndicator from "./components/StepIndicator";
import SuccessStep from "./components/SuccessStep";
import SummaryStep from "./components/SummaryStep";
import VehicleInfoStep from "./components/VehicleInfoStep";
import VehicleSearch from "./components/VehicleSearch";
import { apiService } from "./services/api";
import "./styles/App.css";
import { FormData, FormStep, VehicleData } from "./types";

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>(
    FormStep.VEHICLE_SEARCH
  );
  const [formData, setFormData] = useState<FormData>({
    nomComplet: "",
    adresse: "",
    dateNaissance: "",
    datePermisB: "",
    moisAnneePermis: "",
    profession: "",
    email: "",
    telephone: "",
    bonusMalus: "1.00",
    sinistres36Mois: false,
    utilisationVehicule: "",
    marqueVehicule: "",
    typeVersion: "",
    valeurVehicule: undefined,
    dateMiseCirculation: "",
    immatriculation: "",
    modeFinancement: "",
    lieuStationnement: "",
    choixGaranties: "",
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

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updateVehicleData = (updates: Partial<VehicleData>) => {
    setVehicleData((prev) => {
      const newData = prev ? { ...prev, ...updates } : null;
      return newData;
    });
  };

  const nextStep = () => {
    const steps = Object.values(FormStep);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      setError(null);
      setSuccess(null);
    }
  };

  const prevStep = () => {
    const steps = Object.values(FormStep);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      setError(null);
      setSuccess(null);
    }
  };

  const prevStepFromPersonalInfo = () => {
    // Si aucun véhicule n'a été trouvé, retourner à VEHICLE_SEARCH
    if (!vehicleData) {
      setCurrentStep(FormStep.VEHICLE_SEARCH);
      setError(null);
      setSuccess(null);
    } else {
      // Sinon, retourner à API_RESULT
      setCurrentStep(FormStep.API_RESULT);
      setError(null);
      setSuccess(null);
    }
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
        });
        setCurrentStep(FormStep.API_RESULT);
      } else {
        // Véhicule non trouvé ou erreur
        if (result.httpCode !== 404) {
          setError(
            "Une erreur est survenue lors de la récupération des informations."
          );
        }
        setVehicleData(null);
        setCurrentStep(FormStep.API_RESULT);
      }
    } catch (error) {
      // En cas d'erreur, on affiche aussi le résultat
      setVehicleData(null);
      setError(
        "Une erreur est survenue lors de la récupération des informations."
      );
      setCurrentStep(FormStep.API_RESULT);
    } finally {
      setLoading(false);
    }
  };

  const handleApiResultBack = () => {
    setCurrentStep(FormStep.VEHICLE_SEARCH);
    setError(null);
    setSuccess(null);
  };

  const handleApiResultContinue = (modifiedData?: VehicleData) => {
    // Si des données modifiées sont fournies, les utiliser à la place des données originales
    if (modifiedData) {
      setVehicleData(modifiedData);
    }
    setCurrentStep(FormStep.PERSONAL_INFO);
    setError(null);
    setSuccess(null);
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
        setCurrentStep(FormStep.SUCCESS);
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
            onBack={handleApiResultBack}
            onContinue={handleApiResultContinue}
          />
        );

      case FormStep.PERSONAL_INFO:
        return (
          <PersonalInfoStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrev={prevStepFromPersonalInfo}
          />
        );

      case FormStep.INSURANCE_INFO:
        return (
          <InsuranceInfoStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case FormStep.VEHICLE_INFO:
        return (
          <VehicleInfoStep
            formData={formData}
            vehicleData={vehicleData}
            onUpdate={updateFormData}
            onVehicleDataUpdate={updateVehicleData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case FormStep.ADDITIONAL_INFO:
        return (
          <AdditionalInfoStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case FormStep.SUMMARY:
        return (
          <SummaryStep
            formData={formData}
            vehicleData={vehicleData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
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
