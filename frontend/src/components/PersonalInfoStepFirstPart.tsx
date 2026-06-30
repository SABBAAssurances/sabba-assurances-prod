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
    formData.prenom.trim() &&
    formData.nomFamille.trim() &&
    formData.ville.trim() &&
    formData.adresse.trim() &&
    formData.codePostal.trim() &&
    formData.dateNaissance &&
    formData.moisAnneePermis;

  const validate = (): boolean => {
    const newErrors: ValidationError[] = [];
    if (!formData.prenom.trim())
      newErrors.push({ field: "prenom", message: "Champ requis" });
    else if (formData.prenom.length > 100)
      newErrors.push({ field: "prenom", message: "Maximum 100 caractères" });
    if (!formData.nomFamille.trim())
      newErrors.push({ field: "nomFamille", message: "Champ requis" });
    else if (formData.nomFamille.length > 100)
      newErrors.push({ field: "nomFamille", message: "Maximum 100 caractères" });
    if (!formData.adresse.trim())
      newErrors.push({ field: "adresse", message: "Champ requis" });
    else if (formData.adresse.length > 200)
      newErrors.push({ field: "adresse", message: "Maximum 200 caractères" });
    if (!formData.ville.trim())
      newErrors.push({ field: "ville", message: "Champ requis" });
    else if (formData.ville.length > 100)
      newErrors.push({ field: "ville", message: "Maximum 100 caractères" });
    if (!formData.codePostal.trim())
      newErrors.push({ field: "codePostal", message: "Champ requis" });
    else if (formData.codePostal.length > 10)
      newErrors.push({ field: "codePostal", message: "Maximum 10 caractères" });
    if (!formData.dateNaissance)
      newErrors.push({ field: "dateNaissance", message: "Champ requis" });
    if (!formData.moisAnneePermis)
      newErrors.push({ field: "moisAnneePermis", message: "Champ requis" });
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
        <label className="form-label">Prénom *</label>
        <input
          className={`form-input${getError("prenom") ? " error" : ""}`}
          type="text"
          value={formData.prenom}
          maxLength={100}
          onChange={(e) => onUpdate({ prenom: e.target.value })}
        />
        {getError("prenom") && (
          <span className="error-message">{getError("prenom")}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Nom de famille *</label>
        <input
          className={`form-input${getError("nomFamille") ? " error" : ""}`}
          type="text"
          value={formData.nomFamille}
          maxLength={100}
          onChange={(e) => onUpdate({ nomFamille: e.target.value })}
        />
        {getError("nomFamille") && (
          <span className="error-message">{getError("nomFamille")}</span>
        )}
      </div>
      <div className="form-group full-width">
        <label className="form-label">Adresse *</label>
        <input
          className={`form-input${getError("adresse") ? " error" : ""}`}
          type="text"
          value={formData.adresse}
          maxLength={200}
          onChange={(e) => onUpdate({ adresse: e.target.value })}
        />
        {getError("adresse") && (
          <span className="error-message">{getError("adresse")}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Ville *</label>
        <input
          className={`form-input${getError("ville") ? " error" : ""}`}
          type="text"
          value={formData.ville}
          maxLength={100}
          onChange={(e) => onUpdate({ ville: e.target.value })}
        />
        {getError("ville") && (
          <span className="error-message">{getError("ville")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Code postal *</label>
        <input
          className={`form-input${getError("codePostal") ? " error" : ""}`}
          type="text"
          value={formData.codePostal}
          maxLength={10}
          onChange={(e) => onUpdate({ codePostal: e.target.value })}
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
