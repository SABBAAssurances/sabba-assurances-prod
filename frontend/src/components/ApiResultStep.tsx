import React from "react";
import { VehicleData } from "../types";

interface ApiResultStepProps {
  vehicleData: VehicleData | null;
  onBack: () => void;
  onContinue: () => void;
}

interface ButtonGroupProps {
  onBack: () => void;
  onContinue: () => void;
  backText: string;
  continueText: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  onBack,
  onContinue,
  backText,
  continueText,
}) => (
  <div className="button-group" style={{ display: "flex", gap: "16px" }}>
    <button type="button" className="btn btn-secondary" onClick={onBack}>
      ← {backText}
    </button>
    <button type="button" className="btn btn-primary" onClick={onContinue}>
      {continueText} →
    </button>
  </div>
);

const ApiResultStep: React.FC<ApiResultStepProps> = ({
  vehicleData,
  onBack,
  onContinue,
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
            onContinue={onContinue}
            backText="Retour à la recherche"
            continueText="Saisir manuellement"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="info-card">
      <h3>Nous avons trouvé votre véhicule</h3>
      {vehicleData.photo_modele && (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <img
            src={vehicleData.photo_modele}
            alt={vehicleData.marque + " " + vehicleData.modele}
            style={{
              maxHeight: 90,
              maxWidth: 180,
              objectFit: "contain",
              borderRadius: 8,
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
      {vehicleData.logo_marque && (
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <img
            src={vehicleData.logo_marque}
            alt={vehicleData.marque}
            style={{ maxHeight: 32, maxWidth: 90, objectFit: "contain" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
      <div className="info-row">
        <span className="info-label">Marque :</span>
        <span className="info-value">{vehicleData.marque}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Modèle :</span>
        <span className="info-value">{vehicleData.modele}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Version :</span>
        <span className="info-value">
          {vehicleData.version || vehicleData.sra_commercial}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Énergie :</span>
        <span className="info-value">
          {vehicleData.energieLibelle || vehicleData.energieNGC}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Date 1ère mise en circulation :</span>
        <span className="info-value">{vehicleData.date1erCir_fr}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Puissance fiscale :</span>
        <span className="info-value">{vehicleData.puisFisc} CV</span>
      </div>
      <div className="info-row">
        <span className="info-label">Puissance réelle :</span>
        <span className="info-value">{vehicleData.puisFiscReelCH}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Boîte de vitesse :</span>
        <span className="info-value">
          {vehicleData.boiteVitesseLibelle || vehicleData.boite_vitesse}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Carrosserie :</span>
        <span className="info-value">
          {vehicleData.carrosserieCG}{" "}
          {vehicleData.carrosserie && `(${vehicleData.carrosserie})`}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Nombre de portes :</span>
        <span className="info-value">{vehicleData.nb_portes}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Nombre de places :</span>
        <span className="info-value">{vehicleData.nr_passagers}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Couleur :</span>
        <span className="info-value">
          {vehicleData.couleur || "Non renseignée"}
        </span>
      </div>
      <ButtonGroup
        onBack={onBack}
        onContinue={onContinue}
        backText="Retour à la recherche"
        continueText="Continuer"
      />
    </div>
  );
};

export default ApiResultStep;
