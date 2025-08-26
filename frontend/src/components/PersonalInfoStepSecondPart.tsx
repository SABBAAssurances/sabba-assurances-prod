import React, { useState } from "react";
import { FormData, ValidationError } from "../types";

const connaissanceOptions = [
  { value: "Par mon club", label: "Par mon club" },
  { value: "Un ami m'a recommandé", label: "Un ami m'a recommandé" },
  { value: "Mon concessionnaire", label: "Mon concessionnaire" },
  { value: "Sur un évènement", label: "Sur un évènement" },
  { value: "Déjà client", label: "Déjà client" },
  { value: "Pub Magazine", label: "Pub Magazine" },
  { value: "Sur un forum", label: "Sur un forum" },
  { value: "Pub internet", label: "Pub internet" },
  { value: "Autre", label: "Autre" },
];

interface PersonalInfoStepSecondPartProps {
  formData: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PersonalInfoStepSecondPart: React.FC<PersonalInfoStepSecondPartProps> = ({
  formData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const isValid =
    formData.profession.trim() &&
    formData.email.trim() &&
    formData.telephone.trim();

  const validate = (): boolean => {
    const newErrors: ValidationError[] = [];
    if (!formData.profession.trim())
      newErrors.push({ field: "profession", message: "Champ requis" });
    if (!formData.email.trim())
      newErrors.push({ field: "email", message: "Champ requis" });
    if (!formData.telephone.trim())
      newErrors.push({ field: "telephone", message: "Champ requis" });
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
        <label className="form-label">Profession & secteur d'activité *</label>
        <input
          className={`form-input${getError("profession") ? " error" : ""}`}
          type="text"
          value={formData.profession}
          onChange={(e) => onUpdate({ profession: e.target.value })}
        />
        {getError("profession") && (
          <span className="error-message">{getError("profession")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Mail *</label>
        <input
          className={`form-input${getError("email") ? " error" : ""}`}
          type="email"
          value={formData.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
        />
        {getError("email") && (
          <span className="error-message">{getError("email")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Téléphone *</label>
        <input
          className={`form-input${getError("telephone") ? " error" : ""}`}
          type="tel"
          value={formData.telephone}
          onChange={(e) => onUpdate({ telephone: e.target.value })}
        />
        {getError("telephone") && (
          <span className="error-message">{getError("telephone")}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Comment nous avez-vous connu ?</label>
        <select
          className="form-select"
          value={formData.commentConnaissance}
          onChange={(e) => onUpdate({ commentConnaissance: e.target.value })}
        >
          <option value="">Sélectionner (optionnel)</option>
          {connaissanceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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

export default PersonalInfoStepSecondPart;
