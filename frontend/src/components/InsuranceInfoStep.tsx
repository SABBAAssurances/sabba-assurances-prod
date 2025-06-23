import React, { useState } from "react";
import { FormData, ValidationError } from "../types";

const bonusOptions = Array.from({ length: 151 }, (_, i) =>
  (0.5 + i * 0.01).toFixed(2)
);
const utilisationOptions = [
  { value: "Moins de 7000km", label: "Moins de 7000km" },
  { value: "Loisirs illimité", label: "Loisirs illimité" },
  {
    value: "Déplacement privé & travail illimité",
    label: "Déplacement privé & travail illimité",
  },
];

interface InsuranceInfoStepProps {
  formData: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const InsuranceInfoStep: React.FC<InsuranceInfoStepProps> = ({
  formData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validate = (): boolean => {
    const newErrors: ValidationError[] = [];
    if (!formData.bonusMalus)
      newErrors.push({ field: "bonusMalus", message: "Champ requis" });
    if (formData.sinistres36Mois === undefined)
      newErrors.push({ field: "sinistres36Mois", message: "Champ requis" });
    if (!formData.utilisationVehicule)
      newErrors.push({ field: "utilisationVehicule", message: "Champ requis" });
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
        <label className="form-label">Votre Bonus/Malus *</label>
        <select
          className={`form-select${getError("bonusMalus") ? " error" : ""}`}
          value={formData.bonusMalus}
          onChange={(e) => onUpdate({ bonusMalus: e.target.value })}
        >
          {bonusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {getError("bonusMalus") && (
          <span className="error-message">{getError("bonusMalus")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">
          Sinistres dans les 36 derniers mois *
        </label>
        <div className="radio-group">
          <label className="radio-item">
            <input
              type="radio"
              className="form-radio"
              checked={formData.sinistres36Mois === true}
              onChange={() => onUpdate({ sinistres36Mois: true })}
            />{" "}
            OUI
          </label>
          <label className="radio-item">
            <input
              type="radio"
              className="form-radio"
              checked={formData.sinistres36Mois === false}
              onChange={() => onUpdate({ sinistres36Mois: false })}
            />{" "}
            NON
          </label>
        </div>
        {getError("sinistres36Mois") && (
          <span className="error-message">{getError("sinistres36Mois")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Utilisation de votre véhicule *</label>
        <select
          className={`form-select${
            getError("utilisationVehicule") ? " error" : ""
          }`}
          value={formData.utilisationVehicule}
          onChange={(e) => onUpdate({ utilisationVehicule: e.target.value })}
        >
          <option value="">Sélectionner</option>
          {utilisationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {getError("utilisationVehicule") && (
          <span className="error-message">
            {getError("utilisationVehicule")}
          </span>
        )}
      </div>
      <div className="step-navigation">
        <button type="button" className="btn btn-secondary" onClick={onPrev}>
          Retour
        </button>
        <button type="submit" className="btn btn-primary">
          Étape suivante
        </button>
      </div>
    </form>
  );
};

export default InsuranceInfoStep;
