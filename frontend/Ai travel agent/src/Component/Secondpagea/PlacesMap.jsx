import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function PlacesMap({ city }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeType, setActiveType] = useState("tourist_attraction");

  const TYPES = [
    { key: "tourist_attraction", label: "🏛️ Attractions" },
    { key: "restaurant", label: "🍽️ Restaurants" },
    { key: "lodging", label: "🏨 Hotels" },
    { key: "shopping_mall", label: "🛍️ Shopping" },
    { key: "hospital", label: "🏥 Hospitals" },
  ];

  const fetchPlaces = async (type) => {
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${BASE_URL}/api/maps/search`, {
        query: `${type.replace("_", " ")} in ${city}`,
      });
      if (res.data.success) setPlaces(res.data.places || []);
      else setError("No places found.");
    } catch {
      setError("Google Maps API not configured or unavailable.");
    } finally { setLoading(false); }
  };

  useEffect(() => { if (city) fetchPlaces(activeType); }, [city, activeType]);

  return (
    <div>
      {/* Type tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {TYPES.map(t => (
          <button key={t.key} onClick={() => setActiveType(t.key)}
            style={{
              padding: "8px 16px", borderRadius: 99, border: "1px solid",
              borderColor: activeType === t.key ? "var(--sky)" : "var(--rim)",
              background: activeType === t.key ? "rgba(56,189,248,.1)" : "transparent",
              color: activeType === t.key ? "var(--sky)" : "var(--muted)",
              cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all .2s",
            }}>{t.label}</button>
        ))}
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 20, color: "var(--muted)" }}>
          <div className="spinner" /> Searching places...
        </div>
      )}

      {error && (
        <div style={{ padding: 20, color: "var(--muted)", fontSize: 14, background: "var(--deep)", borderRadius: 12 }}>
          ℹ️ {error} <span style={{ color: "var(--sky)" }}>Add your Google Maps API key to enable this feature.</span>
        </div>
      )}

      {!loading && !error && places.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }} className="two-col">
          {places.slice(0, 8).map((place, i) => (
            <div key={i} className="card" style={{ padding: 18, transition: "border-color .2s" }}
              onMouseOver={e => e.currentTarget.style.borderColor = "var(--sky)"}
              onMouseOut={e => e.currentTarget.style.borderColor = "var(--rim)"}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--white)", marginBottom: 6 }}>{place.name}</div>
              {place.address && <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, lineHeight: 1.5 }}>📍 {place.address}</div>}
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                {place.rating > 0 && (
                  <span style={{ fontSize: 12, color: "var(--amber)" }}>⭐ {place.rating} ({place.userRatings?.toLocaleString()})</span>
                )}
                {place.businessStatus && (
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: place.businessStatus === "OPERATIONAL" ? "rgba(34,197,94,.1)" : "rgba(239,68,68,.1)", color: place.businessStatus === "OPERATIONAL" ? "var(--green)" : "var(--red)" }}>
                    {place.businessStatus === "OPERATIONAL" ? "Open" : "Closed"}
                  </span>
                )}
              </div>
              {place.location && (
                <a href={`https://www.google.com/maps/search/?api=1&query=${place.location.latitude},${place.location.longitude}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: 10, fontSize: 12, color: "var(--sky)", textDecoration: "none", fontWeight: 600 }}>
                  View on Maps →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
