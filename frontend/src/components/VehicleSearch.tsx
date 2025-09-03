import React, { useEffect, useState } from "react";

interface VehicleSearchProps {
  onSearch: (plaque: string) => void;
  loading: boolean;
  error: string | null;
  launchAutomaticSearch: boolean;
}

const plaqueRegex = /^[A-Z]{2}-?\d{3}-?[A-Z]{2}$/i;

const VehicleSearch: React.FC<VehicleSearchProps> = ({
  onSearch,
  loading,
  error,
  launchAutomaticSearch: isFirstVisit,
}) => {
  const [plaque, setPlaque] = useState("");

  const isPlaqueValid = plaqueRegex.test(plaque.trim().toUpperCase());

  // Détecter automatiquement le paramètre immat dans l'URL seulement si c'est la première visite
  useEffect(() => {
    if (!isFirstVisit) return; // Ne pas faire la recherche automatique si ce n'est pas la première visite

    const urlParams = new URLSearchParams(window.location.search);
    const immatParam = urlParams.get("immat");

    if (immatParam && plaqueRegex.test(immatParam.trim().toUpperCase())) {
      const formattedImmat = formatPlaque(immatParam);
      setPlaque(formattedImmat);

      // Déclencher automatiquement la recherche après un court délai
      setTimeout(() => {
        onSearch(formattedImmat.trim());
      }, 100);
    }
  }, [onSearch, isFirstVisit]);

  const formatPlaque = (value: string): string => {
    // Supprimer tous les caractères non alphanumériques sauf les tirets
    const cleaned = value.replace(/[^A-Za-z0-9-]/g, "").toUpperCase();

    // Supprimer les tirets existants pour reformater
    const withoutDashes = cleaned.replace(/-/g, "");

    // Appliquer le formatage selon la longueur
    if (withoutDashes.length <= 2) {
      return withoutDashes;
    } else if (withoutDashes.length <= 5) {
      return `${withoutDashes.slice(0, 2)}-${withoutDashes.slice(2)}`;
    } else {
      return `${withoutDashes.slice(0, 2)}-${withoutDashes.slice(
        2,
        5
      )}-${withoutDashes.slice(5, 7)}`;
    }
  };

  const handlePlaqueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPlaque(value);
    setPlaque(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPlaqueValid) {
      onSearch(plaque.trim());
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit} autoComplete="off">
      <div className="form-group full-width">
        <label className="form-label" htmlFor="plaque">
          Retrouver mon véhicule par :
        </label>
        <input
          id="plaque"
          className="form-input"
          type="text"
          placeholder="Plaque d'immatriculation (ex: AA-123-BC)"
          value={plaque}
          onChange={handlePlaqueChange}
          disabled={loading}
          maxLength={9}
          required
        />
      </div>
      <div className="step-navigation">
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
            "Rechercher le véhicule"
          )}
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: "16px" }}>
          {error}
        </div>
      )}
    </form>
  );
};

export default VehicleSearch;
