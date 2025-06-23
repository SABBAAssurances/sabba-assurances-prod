import React, { useState } from "react";
import { FormData, ValidationError } from "../types";

interface PersonalInfoStepProps {
  formData: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const isValid =
    formData.nomComplet.trim() &&
    formData.adresse.trim() &&
    formData.dateNaissance &&
    formData.datePermisB &&
    formData.moisAnneePermis &&
    formData.profession.trim() &&
    formData.email.trim() &&
    formData.telephone.trim();

  const validate = (): boolean => {
    const newErrors: ValidationError[] = [];
    if (!formData.nomComplet.trim())
      newErrors.push({ field: "nomComplet", message: "Champ requis" });
    if (!formData.adresse.trim())
      newErrors.push({ field: "adresse", message: "Champ requis" });
    if (!formData.dateNaissance)
      newErrors.push({ field: "dateNaissance", message: "Champ requis" });
    if (!formData.datePermisB)
      newErrors.push({ field: "datePermisB", message: "Champ requis" });
    if (!formData.moisAnneePermis)
      newErrors.push({ field: "moisAnneePermis", message: "Champ requis" });
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
        <label className="form-label">Adresse / Ville / CP *</label>
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
      <div className="form-group">
        <label className="form-label">Date de permis B *</label>
        <input
          className={`form-input${getError("datePermisB") ? " error" : ""}`}
          type="date"
          value={formData.datePermisB}
          onChange={(e) => onUpdate({ datePermisB: e.target.value })}
        />
        {getError("datePermisB") && (
          <span className="error-message">{getError("datePermisB")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Mois/année permis de conduire *</label>
        <input
          className={`form-input${getError("moisAnneePermis") ? " error" : ""}`}
          type="month"
          value={formData.moisAnneePermis}
          onChange={(e) => onUpdate({ moisAnneePermis: e.target.value })}
        />
        {getError("moisAnneePermis") && (
          <span className="error-message">{getError("moisAnneePermis")}</span>
        )}
      </div>
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

export default PersonalInfoStep;
