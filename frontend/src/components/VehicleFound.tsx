import React from "react";
import { VehicleData } from "../types";

interface VehicleFoundProps {
  vehicleData: VehicleData;
  onNext: () => void;
}

const VehicleFound: React.FC<VehicleFoundProps> = ({ vehicleData, onNext }) => {
  return (
    <div className="info-card">
      <h3>Nous avons trouvé votre véhicule</h3>
      <div className="info-row">
        <span className="info-label">Marque :</span>
        <span className="info-value">{vehicleData.marque}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Modèle :</span>
        <span className="info-value">{vehicleData.modele}</span>
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
        <span className="info-label">Boîte de vitesse :</span>
        <span className="info-value">
          {vehicleData.boiteVitesseLibelle || vehicleData.boite_vitesse}
        </span>
      </div>
      <button
        className="btn btn-primary"
        onClick={onNext}
        style={{ marginTop: 20 }}
      >
        Étape suivante
      </button>
    </div>
  );
};

export default VehicleFound;
