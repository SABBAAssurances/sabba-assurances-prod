import { Turnstile } from "@marsidev/react-turnstile";
import React, { useCallback, useEffect, useState } from "react";

interface VehicleSearchProps {
  onSearch: (plaque: string, turnstileToken: string) => void;
  loading: boolean;
  error: string | null;
  launchAutomaticSearch: boolean;
  onContinueWithoutSearch: () => void;
}

const plaqueRegex = /^[A-Z]{2}-?\d{3}-?[A-Z]{2}$/i;
const TURNSTILE_SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY;

if (!TURNSTILE_SITE_KEY) {
  throw new Error("REACT_APP_TURNSTILE_SITE_KEY non défini.");
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({
  onSearch,
  loading,
  error,
  launchAutomaticSearch: isFirstVisit,
  onContinueWithoutSearch,
}) => {
  const [plaque, setPlaque] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const isPlaqueValid = plaqueRegex.test(plaque.trim().toUpperCase());

  const formatPlaque = useCallback((value: string): string => {
    const cleaned = value.replace(/[^A-Za-z0-9-]/g, "").toUpperCase();
    const withoutDashes = cleaned.replace(/-/g, "");
    if (withoutDashes.length <= 2) return withoutDashes;
    if (withoutDashes.length <= 5)
      return `${withoutDashes.slice(0, 2)}-${withoutDashes.slice(2)}`;
    return `${withoutDashes.slice(0, 2)}-${withoutDashes.slice(2, 5)}-${withoutDashes.slice(5, 7)}`;
  }, []);

  // Recherche automatique depuis le paramètre URL ?immat=
  // Attend que le token Turnstile soit prêt avant de déclencher
  useEffect(() => {
    if (!isFirstVisit || !turnstileToken) return;

    const urlParams = new URLSearchParams(window.location.search);
    const immatParam = urlParams.get("immat");

    if (immatParam && plaqueRegex.test(immatParam.trim().toUpperCase())) {
      const formattedImmat = formatPlaque(immatParam);
      setPlaque(formattedImmat);
      setTimeout(() => {
        onSearch(formattedImmat.trim(), turnstileToken);
      }, 100);
    }
  }, [onSearch, isFirstVisit, turnstileToken, formatPlaque]);

  const handlePlaqueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaque(formatPlaque(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPlaqueValid && turnstileToken) {
      onSearch(plaque.trim(), turnstileToken);
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

      <Turnstile
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={setTurnstileToken}
        onExpire={() => setTurnstileToken(null)}
        onError={() => setTurnstileToken(null)}
        options={{ appearance: "interaction-only" }}
      />

      <div
        className="step-navigation"
        style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
      >
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading || !isPlaqueValid || !turnstileToken}
          style={{ flex: "3 1 200px", minWidth: 0 }}
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
        <button
          className="btn btn-secondary"
          onClick={onContinueWithoutSearch}
          style={{ flex: "1 1 180px", minWidth: 0 }}
        >
          Continuer sans recherche
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
