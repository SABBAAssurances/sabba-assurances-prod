import React, { useEffect, useState } from "react";
import AdditionalInfoStep from "./components/AdditionalInfoStep";
import InsuranceInfoStep from "./components/InsuranceInfoStep";
import PersonalInfoStep from "./components/PersonalInfoStep";
import StepIndicator from "./components/StepIndicator";
import SummaryStep from "./components/SummaryStep";
import VehicleFound from "./components/VehicleFound";
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
    valeurVehicule: 0,
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
        console.log("Checking server health...");
        const health = await apiService.healthCheck();
        console.log("Health:", health);
        console.log("Health:", health.success);
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
        setCurrentStep(FormStep.VEHICLE_FOUND);
      } else {
        setError(result.error || "Aucun véhicule trouvé pour cette plaque");
      }
    } catch (error) {
      setError("Erreur lors de la recherche du véhicule");
    } finally {
      setLoading(false);
    }
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
        setCurrentStep(FormStep.SUMMARY);
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

      case FormStep.VEHICLE_FOUND:
        return <VehicleFound vehicleData={vehicleData!} onNext={nextStep} />;

      case FormStep.PERSONAL_INFO:
        return (
          <PersonalInfoStep
            formData={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
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

      default:
        return <div>Étape non reconnue</div>;
    }
  };

  return (
    <div className="app-container">
      {error && <div className="message error">{error}</div>}

      {success && <div className="message success">{success}</div>}

      <StepIndicator currentStep={currentStep} />

      {renderCurrentStep()}
    </div>
  );
};

export default App;
