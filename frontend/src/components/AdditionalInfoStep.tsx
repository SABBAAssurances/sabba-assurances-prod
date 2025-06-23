import React, { useState } from "react";
import { FormData, ValidationError } from "../types";

const financementOptions = [
  { value: "Comptant", label: "Comptant" },
  { value: "Crédit", label: "Crédit" },
  { value: "LOA/LLD", label: "LOA/LLD" },
];
const stationnementOptions = [
  { value: "Dans la rue", label: "Dans la rue" },
  { value: "Garage individuel", label: "Garage individuel" },
  { value: "Parking plein air", label: "Parking plein air" },
  {
    value: "Parking souterrain et aérien",
    label: "Parking souterrain et aérien",
  },
  {
    value: "Jardin clos ou cours fermée",
    label: "Jardin clos ou cours fermée",
  },
];
const garantiesOptions = [
  { value: "Minimum", label: "Minimum" },
  { value: "Vol/Incendie/Bris de Glace", label: "Vol/Incendie/Bris de Glace" },
  { value: "Tous Risques", label: "Tous Risques" },
];
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

interface AdditionalInfoStepProps {
  formData: FormData;
  onUpdate: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({
  formData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validate = (): boolean => {
    const newErrors: ValidationError[] = [];
    if (!formData.modeFinancement)
      newErrors.push({ field: "modeFinancement", message: "Champ requis" });
    if (!formData.lieuStationnement)
      newErrors.push({ field: "lieuStationnement", message: "Champ requis" });
    if (!formData.choixGaranties)
      newErrors.push({ field: "choixGaranties", message: "Champ requis" });
    if (!formData.commentConnaissance)
      newErrors.push({ field: "commentConnaissance", message: "Champ requis" });
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
        <label className="form-label">Mode de financement *</label>
        <select
          className={`form-select${
            getError("modeFinancement") ? " error" : ""
          }`}
          value={formData.modeFinancement}
          onChange={(e) => onUpdate({ modeFinancement: e.target.value })}
        >
          <option value="">Sélectionner</option>
          {financementOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {getError("modeFinancement") && (
          <span className="error-message">{getError("modeFinancement")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Lieu de stationnement *</label>
        <select
          className={`form-select${
            getError("lieuStationnement") ? " error" : ""
          }`}
          value={formData.lieuStationnement}
          onChange={(e) => onUpdate({ lieuStationnement: e.target.value })}
        >
          <option value="">Sélectionner</option>
          {stationnementOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {getError("lieuStationnement") && (
          <span className="error-message">{getError("lieuStationnement")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Choix des garanties *</label>
        <select
          className={`form-select${getError("choixGaranties") ? " error" : ""}`}
          value={formData.choixGaranties}
          onChange={(e) => onUpdate({ choixGaranties: e.target.value })}
        >
          <option value="">Sélectionner</option>
          {garantiesOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {getError("choixGaranties") && (
          <span className="error-message">{getError("choixGaranties")}</span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Demandes particulières</label>
        <textarea
          className="form-textarea"
          value={formData.demandesParticulieres}
          onChange={(e) => onUpdate({ demandesParticulieres: e.target.value })}
          rows={2}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Comment nous avez-vous connu ? *</label>
        <select
          className={`form-select${
            getError("commentConnaissance") ? " error" : ""
          }`}
          value={formData.commentConnaissance}
          onChange={(e) => onUpdate({ commentConnaissance: e.target.value })}
        >
          <option value="">Sélectionner</option>
          {connaissanceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {getError("commentConnaissance") && (
          <span className="error-message">
            {getError("commentConnaissance")}
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

export default AdditionalInfoStep;
