import React, { useState } from "react";

interface VehicleSearchProps {
  onSearch: (plaque: string) => void;
  loading: boolean;
  error: string | null;
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({
  onSearch,
  loading,
  error,
}) => {
  const [plaque, setPlaque] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plaque.trim()) {
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
        disabled={loading || !plaque.trim()}
      >
        {loading ? "Recherche..." : "Continuer"}
      </button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default VehicleSearch;
