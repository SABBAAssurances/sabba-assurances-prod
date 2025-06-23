import React, { useState } from "react";
import { FormData, ValidationError, VehicleData } from "../types";

interface VehicleInfoStepProps {
  formData: FormData;
  vehicleData?: VehicleData | null;
  onUpdate: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const VehicleInfoStep: React.FC<VehicleInfoStepProps> = ({
  formData,
  vehicleData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const isValid =
    formData.marqueVehicule.trim() &&
    formData.typeVersion.trim() &&
    formData.valeurVehicule &&
    formData.dateMiseCirculation;

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
    <form className="form-container" onSubmit={handleNext} autoComplete="off">
      <div className="form-group">
        <label className="form-label">Marque de votre véhicule *</label>
        <input
          className={`form-input${getError("marqueVehicule") ? " error" : ""}`}
          type="text"
          value={formData.marqueVehicule}
          onChange={(e) => onUpdate({ marqueVehicule: e.target.value })}
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
          onChange={(e) => onUpdate({ typeVersion: e.target.value })}
        />
        {getError("typeVersion") && (
          <span className="error-message">{getError("typeVersion")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Valeur d'achat ou estimée (€) *</label>
        <input
          className={`form-input${getError("valeurVehicule") ? " error" : ""}`}
          type="number"
          min={0}
          value={formData.valeurVehicule}
          onChange={(e) => onUpdate({ valeurVehicule: Number(e.target.value) })}
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
          onChange={(e) => onUpdate({ dateMiseCirculation: e.target.value })}
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
          onChange={(e) => onUpdate({ immatriculation: e.target.value })}
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
  );
};

export default VehicleInfoStep;
