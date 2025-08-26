import ProgressBar from "@ramonak/react-progress-bar";
import React from "react";
import { STEPS_ORDER } from "../App";
import { FormStep } from "../types";

interface StepIndicatorProps {
  currentStep: FormStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIndex = STEPS_ORDER.indexOf(currentStep);
  const percent = Math.round(((currentIndex + 1) / STEPS_ORDER.length) * 100);
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
