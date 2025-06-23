import React, { useState } from "react";

interface VehicleSearchProps {
  onSearch: (plaque: string) => void;
  loading: boolean;
  error: string | null;
}

const plaqueRegex = /^[A-Z]{2}-?\d{3}-?[A-Z]{2}$/i;

const VehicleSearch: React.FC<VehicleSearchProps> = ({
  onSearch,
  loading,
  error,
}) => {
  const [plaque, setPlaque] = useState("");

  const isPlaqueValid = plaqueRegex.test(plaque.trim().toUpperCase());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPlaqueValid) {
      onSearch(plaque.trim());
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit} autoComplete="off">
      <div className="form-group">
        <label className="form-label" htmlFor="plaque">
          Retrouver mon véhicule par :
        </label>
        <input
          id="plaque"
          className="form-input"
          type="text"
          placeholder="Plaque d'immatriculation (ex: AA-123-BC)"
          value={plaque}
          onChange={(e) => setPlaque(e.target.value)}
          disabled={loading}
          maxLength={15}
          required
        />
      </div>
      <button
        className="btn btn-primary"
        type="submit"
        disabled={loading || !isPlaqueValid}
      >
        {loading ? (
          <span
            className="spinner"
            style={{
              width: 22,
              height: 22,
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
        ) : (
          "Continuer"
        )}
      </button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default VehicleSearch;
