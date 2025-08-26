import React, { useState } from "react";
import { FormData, ValidationError, VehicleData } from "../types";

interface VehicleInfoStepProps {
  formData: FormData;
  vehicleData?: VehicleData | null;
  onUpdate: (updates: Partial<FormData>) => void;
  onVehicleDataUpdate: (updates: Partial<VehicleData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const VehicleInfoStep: React.FC<VehicleInfoStepProps> = ({
  formData,
  vehicleData,
  onUpdate,
  onVehicleDataUpdate,
  onNext,
  onPrev,
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const isValid =
    formData.marqueVehicule.trim() &&
    formData.typeVersion.trim() &&
    formData.valeurVehicule !== undefined &&
    formData.dateMiseCirculation &&
    formData.nombreCVFiscaux;

  const validate = (): boolean => {
    const newErrors: ValidationError[] = [];
    if (!formData.marqueVehicule.trim())
      newErrors.push({ field: "marqueVehicule", message: "Champ requis" });
    if (!formData.typeVersion.trim())
      newErrors.push({ field: "typeVersion", message: "Champ requis" });
    if (!formData.valeurVehicule)
      newErrors.push({ field: "valeurVehicule", message: "Champ requis" });
    if (!formData.dateMiseCirculation)
      newErrors.push({ field: "dateMiseCirculation", message: "Champ requis" });
    if (!formData.nombreCVFiscaux)
      newErrors.push({ field: "nombreCVFiscaux", message: "Champ requis" });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext();
  };

  const getError = (field: string) =>
    errors.find((e) => e.field === field)?.message;

  return (
    <div>
      {!vehicleData && (
        <div className="info-card" style={{ marginBottom: "24px" }}>
          <h4 style={{ marginBottom: "8px", color: "#203051" }}>
            Saisie manuelle des informations
          </h4>
          <p style={{ color: "#203051", fontSize: "0.95rem", margin: 0 }}>
            Veuillez saisir les informations de votre véhicule manuellement.
          </p>
        </div>
      )}
      <form className="form-container" onSubmit={handleNext} autoComplete="off">
        <div className="form-group">
          <label className="form-label">Marque de votre véhicule *</label>
          <input
            className={`form-input${
              getError("marqueVehicule") ? " error" : ""
            }`}
            type="text"
            value={formData.marqueVehicule}
            onChange={(e) => {
              onUpdate({ marqueVehicule: e.target.value });
              onVehicleDataUpdate({ marque: e.target.value });
            }}
          />
          {getError("marqueVehicule") && (
            <span className="error-message">{getError("marqueVehicule")}</span>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">
            Type et Version (le plus précis possible) *
          </label>
          <input
            className={`form-input${getError("typeVersion") ? " error" : ""}`}
            type="text"
            value={formData.typeVersion}
            onChange={(e) => {
              onUpdate({ typeVersion: e.target.value });
              onVehicleDataUpdate({ modele: e.target.value });
            }}
          />
          {getError("typeVersion") && (
            <span className="error-message">{getError("typeVersion")}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Nombre de CV fiscaux *</label>
          <input
            className={`form-input${
              getError("nombreCVFiscaux") ? " error" : ""
            }`}
            type="number"
            min={0}
            step="0.5"
            value={formData.nombreCVFiscaux}
            onChange={(e) => {
              onUpdate({ nombreCVFiscaux: e.target.value });
              onVehicleDataUpdate({ puisFisc: e.target.value });
            }}
          />
          {getError("nombreCVFiscaux") && (
            <span className="error-message">{getError("nombreCVFiscaux")}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Valeur d'achat ou estimée (€) *</label>
          <input
            className={`form-input${
              getError("valeurVehicule") ? " error" : ""
            }`}
            type="number"
            min={0}
            value={formData.valeurVehicule ?? ""}
            onChange={(e) => {
              const value = Number(e.target.value);
              onUpdate({ valeurVehicule: value });
              onVehicleDataUpdate({ valeurVehicule: value } as any);
            }}
          />
          {getError("valeurVehicule") && (
            <span className="error-message">{getError("valeurVehicule")}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Date de mise en circulation *</label>
          <input
            className={`form-input${
              getError("dateMiseCirculation") ? " error" : ""
            }`}
            type="date"
            value={formData.dateMiseCirculation}
            onChange={(e) => {
              onUpdate({ dateMiseCirculation: e.target.value });
              onVehicleDataUpdate({ date1erCir_us: e.target.value });
            }}
          />
          {getError("dateMiseCirculation") && (
            <span className="error-message">
              {getError("dateMiseCirculation")}
            </span>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">
            Immatriculation (si en votre possession)
          </label>
          <input
            className="form-input"
            type="text"
            value={formData.immatriculation}
            onChange={(e) => {
              onUpdate({ immatriculation: e.target.value });
              onVehicleDataUpdate({ immat: e.target.value });
            }}
          />
        </div>

        <div className="step-navigation">
          <button type="button" className="btn btn-secondary" onClick={onPrev}>
            Retour
          </button>
          <button type="submit" className="btn btn-primary" disabled={!isValid}>
            Étape suivante
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleInfoStep;
