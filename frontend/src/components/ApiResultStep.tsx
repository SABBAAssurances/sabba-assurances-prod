import React from "react";
import { VehicleData } from "../types";

interface ApiResultStepProps {
  vehicleData: VehicleData | null;
  onBack: () => void;
  onContinue: (modifiedData?: VehicleData | null) => void;
  onWrongVehiculeFound: () => void;
}

interface ButtonGroupProps {
  onBack: () => void;
  onContinue: () => void;
  backText: string;
  continueText: string;
  onWrongVehiculeFound?: () => void;
  showWrongVehiculeButton?: boolean;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  onBack,
  onContinue,
  backText,
  continueText,
  onWrongVehiculeFound,
  showWrongVehiculeButton = false,
}) => (
  <div className="button-group">
    <button type="button" className="btn btn-secondary" onClick={onBack}>
      ← {backText}
    </button>
    {showWrongVehiculeButton && onWrongVehiculeFound && (
      <button
        type="button"
        className="btn btn-secondary"
        style={{
          background: "#f5f6fa",
          color: "#203051",
          border: "1.5px solid #d1d5db",
        }}
        onClick={onWrongVehiculeFound}
      >
        Ce n'est pas ma voiture
      </button>
    )}
    <button type="button" className="btn btn-primary" onClick={onContinue}>
      {continueText} →
    </button>
  </div>
);

const ApiResultStep: React.FC<ApiResultStepProps> = ({
  vehicleData,
  onBack,
  onContinue,
  onWrongVehiculeFound,
}) => {
  if (!vehicleData) {
    return (
      <div className="step-container">
        <div className="step-content">
          <h2>Véhicule non trouvé</h2>
          <div className="error-message">
            <p>
              Nous n'avons pas pu trouver les informations pour ce véhicule avec
              la plaque d'immatriculation fournie.
            </p>
            <p>
              Vous devrez saisir manuellement les informations de votre véhicule
              pour continuer avec votre devis d'assurance.
            </p>
          </div>
          <ButtonGroup
            onBack={onBack}
            onContinue={() => onContinue(null)}
            backText="Retour à la recherche"
            continueText="Saisir manuellement"
          />
        </div>
      </div>
    );
  }

  const currentData = vehicleData;

  return (
    <div className="info-card info-card-editable">
      <h3>Nous avons trouvé votre véhicule</h3>
      {currentData.photo_modele && (
        <div className="vehicle-photo-container">
          <img
            src={currentData.photo_modele}
            alt={currentData.marque + " " + currentData.modele}
            className="vehicle-photo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
      {currentData.logo_marque && (
        <div className="brand-logo-container">
          <img
            src={currentData.logo_marque}
            alt={currentData.marque}
            className="brand-logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="info-row">
        <span className="info-label">Marque :</span>
        <span className="info-value">{currentData.marque}</span>
      </div>

      <div className="info-row">
        <span className="info-label">Modèle :</span>
        <span className="info-value">{currentData.modele}</span>
      </div>

      <div className="info-row">
        <span className="info-label">Version :</span>
        <span className="info-value">
          {currentData.version || currentData.sra_commercial}
        </span>
      </div>

      <div className="info-row">
        <span className="info-label">Énergie :</span>
        <span className="info-value">
          {currentData.energieLibelle || currentData.energieNGC}
        </span>
      </div>

      <div className="info-row">
        <span className="info-label">Date 1ère mise en circulation :</span>
        <span className="info-value">{currentData.date1erCir_fr}</span>
      </div>

      <div className="info-row">
        <span className="info-label">Puissance fiscale :</span>
        <span className="info-value">{currentData.puisFisc} CV</span>
      </div>

      <div className="info-row">
        <span className="info-label">Puissance réelle :</span>
        <span className="info-value">{currentData.puisFiscReelCH}</span>
      </div>

      <div className="info-row">
        <span className="info-label">Boîte de vitesse :</span>
        <span className="info-value">
          {currentData.boiteVitesseLibelle || currentData.boite_vitesse}
        </span>
      </div>

      <div className="info-row">
        <span className="info-label">Carrosserie :</span>
        <span className="info-value">
          {currentData.carrosserieCG}{" "}
          {currentData.carrosserie && `(${currentData.carrosserie})`}
        </span>
      </div>

      <div className="info-row">
        <span className="info-label">Nombre de portes :</span>
        <span className="info-value">{currentData.nb_portes}</span>
      </div>

      <div className="info-row">
        <span className="info-label">Nombre de places :</span>
        <span className="info-value">{currentData.nr_passagers}</span>
      </div>

      <div className="info-row">
        <span className="info-label">Couleur :</span>
        <span className="info-value">
          {currentData.couleur || "Non renseignée"}
        </span>
      </div>

      <ButtonGroup
        onBack={onBack}
        onContinue={() => onContinue(currentData)}
        backText="Retour à la recherche"
        continueText="Continuer"
        onWrongVehiculeFound={onWrongVehiculeFound}
        showWrongVehiculeButton={true}
      />
    </div>
  );
};

export default ApiResultStep;
