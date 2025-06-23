import React from "react";
import { FormStep } from "../types";

interface StepIndicatorProps {
  currentStep: FormStep;
}

const steps = [
  { key: FormStep.VEHICLE_SEARCH, label: "Plaque" },
  { key: FormStep.VEHICLE_FOUND, label: "Véhicule" },
  { key: FormStep.PERSONAL_INFO, label: "Infos Perso" },
  { key: FormStep.INSURANCE_INFO, label: "Assurance" },
  { key: FormStep.VEHICLE_INFO, label: "Véhicule (suite)" },
  { key: FormStep.ADDITIONAL_INFO, label: "Complément" },
  { key: FormStep.SUMMARY, label: "Résumé" },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);
  return (
    <div className="step-indicator">
      {steps.map((step, idx) => (
        <span
          key={step.key}
          className={`step${idx === currentIndex ? " active" : ""}${
            idx < currentIndex ? " completed" : ""
          }`}
        >
          {idx + 1}
        </span>
      ))}
    </div>
  );
};

export default StepIndicator;
