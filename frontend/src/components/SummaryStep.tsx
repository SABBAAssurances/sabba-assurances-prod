import React from "react";
import { FormData, VehicleData } from "../types";

interface SummaryStepProps {
  formData: FormData;
  vehicleData?: VehicleData | null;
  onSubmit: () => void;
  onPrev: () => void;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const SummaryStep: React.FC<SummaryStepProps> = ({
  formData,
  vehicleData,
  onSubmit,
  onPrev,
  loading,
  error,
  success,
}) => {
  return (
    <div className="form-container">
      <h3>Récapitulatif de votre demande</h3>
      <div className="info-card">
        <h4>Véhicule</h4>
        <div className="info-row">
          <span className="info-label">Marque :</span>
          <span className="info-value">{formData.marqueVehicule}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Modèle :</span>
          <span className="info-value">{formData.typeVersion}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Immatriculation :</span>
          <span className="info-value">{formData.immatriculation}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Date mise en circulation :</span>
          <span className="info-value">{formData.dateMiseCirculation}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Valeur :</span>
          <span className="info-value">{formData.valeurVehicule} €</span>
        </div>
      </div>
      <div className="info-card">
        <h4>Assuré</h4>
        <div className="info-row">
          <span className="info-label">Nom :</span>
          <span className="info-value">{formData.nomComplet}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Adresse :</span>
          <span className="info-value">{formData.adresse}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Date de naissance :</span>
          <span className="info-value">{formData.dateNaissance}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Mail :</span>
          <span className="info-value">{formData.email}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Téléphone :</span>
          <span className="info-value">{formData.telephone}</span>
        </div>
      </div>
      <div className="info-card">
        <h4>Assurance</h4>
        <div className="info-row">
          <span className="info-label">Bonus/Malus :</span>
          <span className="info-value">{formData.bonusMalus}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Sinistres 36 mois :</span>
          <span className="info-value">
            {formData.sinistres36Mois ? "OUI" : "NON"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Utilisation :</span>
          <span className="info-value">{formData.utilisationVehicule}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Mode financement :</span>
          <span className="info-value">{formData.modeFinancement}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Lieu stationnement :</span>
          <span className="info-value">{formData.lieuStationnement}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Garanties :</span>
          <span className="info-value">{formData.choixGaranties}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Demandes particulières :</span>
          <span className="info-value">
            {formData.demandesParticulieres || "Aucune"}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Comment nous avez-vous connu :</span>
          <span className="info-value">{formData.commentConnaissance}</span>
        </div>
      </div>
      <div className="step-navigation">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onPrev}
          disabled={loading}
        >
          Retour
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Envoi en cours..." : "Envoyer la demande"}
        </button>
      </div>
      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}
    </div>
  );
};

export default SummaryStep;
