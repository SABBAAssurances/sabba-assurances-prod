import React from "react";

const SuccessStep: React.FC = () => {
  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" fill="#4CAF50" />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="success-title">Demande envoyée avec succès !</h2>
        <p className="success-message">
          Nous vous contacterons rapidement pour traiter votre demande de devis
          d'assurance.
        </p>
      </div>
    </div>
  );
};

export default SuccessStep;
