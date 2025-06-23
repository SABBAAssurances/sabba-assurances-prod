import ProgressBar from "@ramonak/react-progress-bar";
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
  { key: FormStep.SUCCESS, label: "Succès" },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);
  const percent = Math.round(((currentIndex + 1) / steps.length) * 100);
  return (
    <div className="step-indicator">
      <ProgressBar
        completed={percent}
        bgColor="#151e29"
        baseBgColor="#f5f6fa"
        height="10px"
        isLabelVisible={false}
        borderRadius="8px"
        animateOnRender
      />
      {/* <div
        style={{
          marginTop: 10,
          color: "#151e29",
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        {steps[currentIndex]?.label}
      </div> */}
    </div>
  );
};

export default StepIndicator;
