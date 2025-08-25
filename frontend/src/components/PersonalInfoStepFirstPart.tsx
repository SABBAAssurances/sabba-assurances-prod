import React, { useState } from "react";
import { FormData, ValidationError } from "../types";

interface PersonalInfoStepFirstPartProps {
  formData: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PersonalInfoStepFirstPart: React.FC<PersonalInfoStepFirstPartProps> = ({
  formData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const isValid =
    formData.nomComplet.trim() &&
    formData.adresse.trim() &&
    formData.codePostal.trim() &&
    formData.dateNaissance;

  const validate = (): boolean => {
    const newErrors: ValidationError[] = [];
    if (!formData.nomComplet.trim())
      newErrors.push({ field: "nomComplet", message: "Champ requis" });
    if (!formData.adresse.trim())
      newErrors.push({ field: "adresse", message: "Champ requis" });
    if (!formData.codePostal.trim())
      newErrors.push({ field: "codePostal", message: "Champ requis" });
    if (!formData.dateNaissance)
      newErrors.push({ field: "dateNaissance", message: "Champ requis" });
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
        <label className="form-label">Prénom NOM *</label>
        <input
          className={`form-input${getError("nomComplet") ? " error" : ""}`}
          type="text"
          value={formData.nomComplet}
          onChange={(e) => onUpdate({ nomComplet: e.target.value })}
        />
        {getError("nomComplet") && (
          <span className="error-message">{getError("nomComplet")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Adresse / Ville *</label>
        <input
          className={`form-input${getError("adresse") ? " error" : ""}`}
          type="text"
          value={formData.adresse}
          onChange={(e) => onUpdate({ adresse: e.target.value })}
        />
        {getError("adresse") && (
          <span className="error-message">{getError("adresse")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Code postal *</label>
        <input
          className={`form-input${getError("codePostal") ? " error" : ""}`}
          type="text"
          value={formData.codePostal}
          onChange={(e) => onUpdate({ codePostal: e.target.value })}
          placeholder="75001"
        />
        {getError("codePostal") && (
          <span className="error-message">{getError("codePostal")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Date de naissance *</label>
        <input
          className={`form-input${getError("dateNaissance") ? " error" : ""}`}
          type="date"
          value={formData.dateNaissance}
          onChange={(e) => onUpdate({ dateNaissance: e.target.value })}
        />
        {getError("dateNaissance") && (
          <span className="error-message">{getError("dateNaissance")}</span>
        )}
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

export default PersonalInfoStepFirstPart;
