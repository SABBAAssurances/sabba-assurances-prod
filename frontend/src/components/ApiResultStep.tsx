import React, { useState } from "react";
import { VehicleData } from "../types";

interface ApiResultStepProps {
  vehicleData: VehicleData | null;
  onBack: () => void;
  onContinue: (modifiedData?: VehicleData) => void;
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
  <div className="button-group">
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<VehicleData | null>(null);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData(vehicleData ? { ...vehicleData } : null);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    // Les données modifiées sont maintenant dans editedData
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  const handleFieldChange = (field: keyof VehicleData, value: string) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const handleContinue = () => {
    // Si on est en mode édition et qu'il y a des modifications, utiliser editedData
    // Sinon utiliser les données originales
    const dataToUse = isEditing && editedData ? editedData : vehicleData;
    onContinue(dataToUse || undefined);
  };

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

  const currentData = isEditing && editedData ? editedData : vehicleData;

  return (
    <div className="info-card info-card-editable">
      {/* Icône de modification en haut à droite */}
      <div className="edit-button-container">
        {!isEditing ? (
          <button
            type="button"
            onClick={handleEditClick}
            className="edit-button"
            title="Modifier les informations"
          >
            ✏️
          </button>
        ) : (
          <div className="edit-controls">
            <button
              type="button"
              onClick={handleSaveEdit}
              className="save-button"
              title="Sauvegarder"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="cancel-button"
              title="Annuler"
            >
              ✕
            </button>
          </div>
        )}
      </div>

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
        {isEditing ? (
          <input
            type="text"
            value={currentData.marque}
            onChange={(e) => handleFieldChange("marque", e.target.value)}
            className="edit-input"
          />
        ) : (
          <span className="info-value">{currentData.marque}</span>
        )}
      </div>

      <div className="info-row">
        <span className="info-label">Modèle :</span>
        {isEditing ? (
          <input
            type="text"
            value={currentData.modele}
            onChange={(e) => handleFieldChange("modele", e.target.value)}
            className="edit-input"
          />
        ) : (
          <span className="info-value">{currentData.modele}</span>
        )}
      </div>

      <div className="info-row">
        <span className="info-label">Version :</span>
        {isEditing ? (
          <input
            type="text"
            value={currentData.version || currentData.sra_commercial || ""}
            onChange={(e) => handleFieldChange("version", e.target.value)}
            className="edit-input"
          />
        ) : (
          <span className="info-value">
            {currentData.version || currentData.sra_commercial}
          </span>
        )}
      </div>

      <div className="info-row">
        <span className="info-label">Énergie :</span>
        {isEditing ? (
          <input
            type="text"
            value={currentData.energieLibelle || currentData.energieNGC || ""}
            onChange={(e) =>
              handleFieldChange("energieLibelle", e.target.value)
            }
            className="edit-input"
          />
        ) : (
          <span className="info-value">
            {currentData.energieLibelle || currentData.energieNGC}
          </span>
        )}
      </div>

      <div className="info-row">
        <span className="info-label">Date 1ère mise en circulation :</span>
        {isEditing ? (
          <input
            type="text"
            value={currentData.date1erCir_fr}
            onChange={(e) => handleFieldChange("date1erCir_fr", e.target.value)}
            className="edit-input"
          />
        ) : (
          <span className="info-value">{currentData.date1erCir_fr}</span>
        )}
      </div>

      <div className="info-row">
        <span className="info-label">Puissance fiscale :</span>
        {isEditing ? (
          <input
            type="text"
            value={currentData.puisFisc}
            onChange={(e) => handleFieldChange("puisFisc", e.target.value)}
            className="edit-input"
          />
        ) : (
          <span className="info-value">{currentData.puisFisc} CV</span>
        )}
      </div>

      <div className="info-row">
        <span className="info-label">Puissance réelle :</span>
        {isEditing ? (
          <input
            type="text"
            value={currentData.puisFiscReelCH}
            onChange={(e) =>
              handleFieldChange("puisFiscReelCH", e.target.value)
            }
            className="edit-input"
          />
        ) : (
          <span className="info-value">{currentData.puisFiscReelCH}</span>
        )}
      </div>

      <div className="info-row">
        <span className="info-label">Boîte de vitesse :</span>
        {isEditing ? (
          <input
            type="text"
            value={
              currentData.boiteVitesseLibelle || currentData.boite_vitesse || ""
            }
            onChange={(e) =>
              handleFieldChange("boiteVitesseLibelle", e.target.value)
            }
            className="edit-input"
          />
        ) : (
          <span className="info-value">
            {currentData.boiteVitesseLibelle || currentData.boite_vitesse}
          </span>
        )}
      </div>

      <div className="info-row">
        <span className="info-label">Carrosserie :</span>
        {isEditing ? (
          <input
            type="text"
            value={`${currentData.carrosserieCG} ${
              currentData.carrosserie ? `(${currentData.carrosserie})` : ""
            }`.trim()}
            onChange={(e) => handleFieldChange("carrosserieCG", e.target.value)}
            className="edit-input"
          />
        ) : (
          <span className="info-value">
            {currentData.carrosserieCG}{" "}
            {currentData.carrosserie && `(${currentData.carrosserie})`}
          </span>
        )}
      </div>

      <div className="info-row">
        <span className="info-label">Nombre de portes :</span>
        {isEditing ? (
          <input
            type="text"
            value={currentData.nb_portes}
            onChange={(e) => handleFieldChange("nb_portes", e.target.value)}
            className="edit-input"
          />
        ) : (
          <span className="info-value">{currentData.nb_portes}</span>
        )}
      </div>

      <div className="info-row">
        <span className="info-label">Nombre de places :</span>
        {isEditing ? (
          <input
            type="text"
            value={currentData.nr_passagers}
            onChange={(e) => handleFieldChange("nr_passagers", e.target.value)}
            className="edit-input"
          />
        ) : (
          <span className="info-value">{currentData.nr_passagers}</span>
        )}
      </div>

      <div className="info-row">
        <span className="info-label">Couleur :</span>
        {isEditing ? (
          <input
            type="text"
            value={currentData.couleur || ""}
            onChange={(e) => handleFieldChange("couleur", e.target.value)}
            className="edit-input"
          />
        ) : (
          <span className="info-value">
            {currentData.couleur || "Non renseignée"}
          </span>
        )}
      </div>

      <ButtonGroup
        onBack={onBack}
        onContinue={handleContinue}
        backText="Retour à la recherche"
        continueText="Continuer"
      />
    </div>
  );
};

export default ApiResultStep;
