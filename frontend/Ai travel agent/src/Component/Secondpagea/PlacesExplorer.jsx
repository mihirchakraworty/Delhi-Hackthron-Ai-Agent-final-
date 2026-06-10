import React, { useState, useEffect, useRef } from "react";

const BASE_URL = "http://localhost:5000";

// Category config → Overpass API tags
const CATEGORIES = [
  { key: "attraction",  label: "🏛️ Attractions",  tag: 'tourism~"attraction|museum|monument|temple|fort|palace"', color: "#818cf8" },
  { key: "restaurant",  label: "🍽️ Restaurants",  tag: 'amenity~"restaurant|cafe|food_court"',                   color: "#34d399" },
  { key: "hotel",       label: "🏨 Hotels",        tag: 'tourism~"hotel|guest_house|hostel"',                     color: "#38bdf8" },
  { key: "shopping",    label: "🛍️ Shopping",      tag: 'shop~"mall|supermarket|market|clothes|jewelry"',         color: "#fbbf24" },
  { key: "hospital",    label: "🏥 Medical",        tag: 'amenity~"hospital|clinic|pharmacy"',                    color: "#f87171" },
  { key: "transport",   label: "🚉 Transport",      tag: 'railway~"station|halt"',                                color: "#a78bfa" },
];

// Build Overpass QL query around a lat/lng bbox
const buildOverpassQuery = (lat, lng, tagFilter, radius = 5000) => {
  const delta = radius / 111320; // rough degrees per metre
  const s = lat - delta, n = lat + delta, w = lng - delta * 1.3, e = lng + delta * 1.3;
  return `
[out:json][timeout:20];
(
  node[${tagFilter}](${s},${w},${n},${e});
  way[${tagFilter}](${s},${w},${n},${e});
);
out center 20;
`.trim();
};

export default function PlacesExplorer({ city }) {
  const [coords, setCoords]         = useState(null);  // { lat, lng }
  const [places, setPlaces]         = useState([]);
  const [loading, setLoading]       = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError]           = useState("");
  const [activeCategory, setActive] = useState(CATEGORIES[0].key);
  const [selectedPlace, setSelected]= useState(null);
  const [search, setSearch]         = useState("");
  const iframeRef = useRef(null);

  // Step 1 — geocode the city once
  useEffect(() => {
    if (!city) return;
    setGeoLoading(true);
    setCoords(null); setPlaces([]); setError(""); setSelected(null);

    fetch(`${BASE_URL}/api/maps/geocode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setCoords({ lat: data.lat, lng: data.lng, label: data.formattedAddress });
        else setError("Could not locate city.");
      })
      .catch(() => setError("Geocoding service unavailable."))
      .finally(() => setGeoLoading(false));
  }, [city]);

  // Step 2 — fetch places from Overpass when category or coords change
  useEffect(() => {
    if (!coords) return;
    const cat = CATEGORIES.find(c => c.key === activeCategory);
    if (!cat) return;

    setLoading(true); setPlaces([]); setError(""); setSelected(null);

    const query = buildOverpassQuery(coords.lat, coords.lng, cat.tag, 6000);

    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(r => r.json())
      .then(data => {
        const items = (data.elements || [])
          .map(el => ({
            id: el.id,
            name: el.tags?.name || el.tags?.["name:en"] || "Unnamed",
            lat: el.lat ?? el.center?.lat,
            lng: el.lon ?? el.center?.lon,
            address: [el.tags?.["addr:street"], el.tags?.["addr:housenumber"], el.tags?.["addr:city"]]
              .filter(Boolean).join(", "),
            phone: el.tags?.phone || el.tags?.["contact:phone"] || "",
            website: el.tags?.website || el.tags?.["contact:website"] || "",
            opening: el.tags?.opening_hours || "",
            cuisine: el.tags?.cuisine || "",
            stars: el.tags?.stars || "",
            tourism: el.tags?.tourism || "",
            amenity: el.tags?.amenity || "",
          }))
          .filter(el => el.name !== "Unnamed" && el.lat && el.lng)
          .slice(0, 24);

        setPlaces(items);
        if (items.length === 0) setError(`No ${cat.label.replace(/[^\w\s]/g, "").trim()} found nearby.`);
      })
      .catch(() => setError("OpenStreetMap data unavailable. Try again."))
      .finally(() => setLoading(false));
  }, [coords, activeCategory]);

  const filtered = search.trim()
    ? places.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : places;

  const activeCat = CATEGORIES.find(c => c.key === activeCategory);

  // OSM iframe embed URL for the selected place or city centre
  const mapLat  = selectedPlace?.lat  ?? coords?.lat;
  const mapLng  = selectedPlace?.lng  ?? coords?.lng;
  const mapZoom = selectedPlace ? 17 : 14;
  const mapSrc  = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.04},${mapLat - 0.03},${mapLng + 0.04},${mapLat + 0.03}&layer=mapnik&marker=${mapLat},${mapLng}`
    : null;

  return (
    <div>
      {/* ── Category pills ── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button key={cat.key} onClick={() => setActive(cat.key)}
            style={{
              padding: "8px 16px", borderRadius: 99, border: "1px solid",
              borderColor: activeCategory === cat.key ? cat.color : "var(--rim)",
              background: activeCategory === cat.key ? `${cat.color}18` : "transparent",
              color: activeCategory === cat.key ? cat.color : "var(--muted)",
              cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all .2s",
            }}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Search within results ── */}
      {places.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <input
            className="input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search within ${places.length} ${activeCat?.label ?? ""}…`}
            style={{ maxWidth: 380 }}
          />
        </div>
      )}

      {/* ── Loading / error states ── */}
      {(geoLoading || loading) && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 0", color: "var(--muted)" }}>
          <div className="spinner" />
          {geoLoading ? `Locating ${city}…` : `Finding ${activeCat?.label ?? "places"} on OpenStreetMap…`}
        </div>
      )}

      {!geoLoading && !loading && error && (
        <div style={{ padding: "16px 20px", background: "var(--deep)", borderRadius: 12, fontSize: 14, color: "var(--muted)" }}>
          ℹ️ {error}
        </div>
      )}

      {/* ── Main layout: map + cards ── */}
      {!geoLoading && coords && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}
             className="map-layout">

          {/* Map */}
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--rim)", background: "var(--deep)" }}>
            <div style={{ padding: "12px 16px", background: "var(--deep)", borderBottom: "1px solid var(--rim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, color: "var(--white)", fontWeight: 600 }}>
                🗺️ {selectedPlace ? selectedPlace.name : city}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {selectedPlace && (
                  <button onClick={() => setSelected(null)}
                    style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "var(--rim)", border: "none", color: "var(--muted)", cursor: "pointer" }}>
                    ✕ Clear
                  </button>
                )}
                <a href={`https://www.openstreetmap.org/#map=${mapZoom}/${mapLat}/${mapLng}`}
                   target="_blank" rel="noopener noreferrer"
                   style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "rgba(56,189,248,.1)", color: "var(--sky)", textDecoration: "none", fontWeight: 600 }}>
                  Open full map ↗
                </a>
              </div>
            </div>

            {mapSrc && (
              <iframe
                ref={iframeRef}
                src={mapSrc}
                title="OpenStreetMap"
                width="100%"
                height="420"
                style={{ border: "none", display: "block" }}
                loading="lazy"
              />
            )}

            <div style={{ padding: "10px 16px", fontSize: 11, color: "var(--muted)", borderTop: "1px solid var(--rim)" }}>
              📍 {coords.label} · Map data © <a href="https://openstreetmap.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--sky)" }}>OpenStreetMap</a> contributors
            </div>
          </div>

          {/* Place list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 500, overflowY: "auto", paddingRight: 4 }}>
            {!loading && filtered.length === 0 && !error && (
              <div style={{ padding: 20, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>No results found.</div>
            )}

            {filtered.map(place => (
              <div key={place.id}
                onClick={() => setSelected(selectedPlace?.id === place.id ? null : place)}
                style={{
                  padding: 14, borderRadius: 12, cursor: "pointer", border: "1px solid",
                  borderColor: selectedPlace?.id === place.id ? activeCat?.color ?? "var(--sky)" : "var(--rim)",
                  background: selectedPlace?.id === place.id ? `${activeCat?.color ?? "#38bdf8"}10` : "var(--deep)",
                  transition: "all .15s",
                }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", marginBottom: 4, lineHeight: 1.4 }}>{place.name}</div>

                {place.address && (
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, lineHeight: 1.4 }}>📍 {place.address}</div>
                )}

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {place.stars && <span style={{ fontSize: 11, color: "var(--amber)" }}>⭐ {place.stars} stars</span>}
                  {place.cuisine && <span style={{ fontSize: 11, color: "var(--green)" }}>🍴 {place.cuisine.replace(/_/g, ", ")}</span>}
                  {place.opening && <span style={{ fontSize: 11, color: "var(--muted)" }}>🕐 {place.opening.slice(0, 30)}</span>}
                </div>

                {selectedPlace?.id === place.id && (
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                       target="_blank" rel="noopener noreferrer"
                       style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "rgba(56,189,248,.1)", color: "var(--sky)", textDecoration: "none", fontWeight: 600 }}>
                      Google Maps ↗
                    </a>
                    {place.website && (
                      <a href={place.website.startsWith("http") ? place.website : `https://${place.website}`}
                         target="_blank" rel="noopener noreferrer"
                         style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "rgba(129,140,248,.1)", color: "var(--violet)", textDecoration: "none", fontWeight: 600 }}>
                        Website ↗
                      </a>
                    )}
                    {place.phone && (
                      <a href={`tel:${place.phone}`}
                         style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "rgba(34,197,94,.1)", color: "var(--green)", textDecoration: "none", fontWeight: 600 }}>
                        📞 Call
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:900px){ .map-layout{ grid-template-columns:1fr!important } }
      `}</style>
    </div>
  );
}
