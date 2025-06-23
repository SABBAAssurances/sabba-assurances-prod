import React, { useState } from "react";
import { VehicleData } from "../types";

interface VehicleFoundProps {
  vehicleData: VehicleData;
  onNext: () => void;
}

const VehicleFound: React.FC<VehicleFoundProps> = ({ vehicleData, onNext }) => {
  const [selectedVersion, setSelectedVersion] = useState(
    vehicleData.sra_commercial
  );

  const versions =
    vehicleData.liste_sra_commercial &&
    vehicleData.liste_sra_commercial.length > 1
      ? vehicleData.liste_sra_commercial
      : null;

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
          {vehicleData.version || selectedVersion}
        </span>
      </div>
      {versions && (
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="form-label">Autres versions commerciales :</label>
          <select
            className="form-select"
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
          >
            {versions.map((v) => (
              <option key={v.sra_id} value={v.sra_commercial}>
                {v.sra_commercial}
              </option>
            ))}
          </select>
        </div>
      )}
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
