import React, { useState } from "react";
import Itinerary from "./Itinerary";
import PlacesExplorer from "./PlacesExplorer";
import HotelCard from "./HotelCard";

const BASE_URL = "http://localhost:5000";

const Field = ({ icon, label, type = "text", name, value, onChange, placeholder }) => (
  <div>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8 }}>
      {icon} {label}
    </label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="input" />
  </div>
);

const TABS = [
  { key: "itinerary", label: "📅 Itinerary" },
  { key: "places", label: "📍 Places & Map" },
  { key: "hotels", label: "🏨 Hotels" },
  { key: "news", label: "📰 Travel News" },
];

export default function TripForm() {
  const [form, setForm] = useState({ budget: "", days: "", travelers: "", destination: "", description: "" });
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("itinerary");
  const [newsLoaded, setNewsLoaded] = useState(false);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const generate = async () => {
    if (!form.destination.trim()) { setError("Please enter a destination."); return; }
    try {
      setLoading(true); setError(""); setTripData(null);
      const city = form.destination.trim();

      // Run all API calls in parallel
      const [weatherRes, hotelRes, itineraryRes] = await Promise.allSettled([
        fetch(`${BASE_URL}/api/weather/${city}`),
        fetch(`${BASE_URL}/api/hotels/${city}?adults=${form.travelers || 1}&budget=${form.budget || ""}`),
        fetch(`${BASE_URL}/api/itinerary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city,
            days: Number(form.days) || 3,
            budget: form.budget,
            travelers: form.travelers || 1,
            description: form.description,
          }),
        }),
      ]);

      const weatherData = weatherRes.status === "fulfilled" ? await weatherRes.value.json() : null;
      const hotelData = hotelRes.status === "fulfilled" ? await hotelRes.value.json() : null;
      const itineraryData = itineraryRes.status === "fulfilled" ? await itineraryRes.value.json() : null;

      setTripData({
        city,
        weather: weatherData,
        hotels: hotelData?.hotels || [],
        hotelSource: hotelData?.source,
        itinerary: itineraryData?.itinerary || null,
        itinerarySuccess: itineraryData?.success,
      });

      setTab("itinerary");
    } catch (e) {
      setError("Failed to generate trip. Make sure the backend is running on port 5000.");
    } finally { setLoading(false); }
  };

  const loadNews = async () => {
    if (newsLoaded) return;
    setNewsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/news/${encodeURIComponent(form.destination || "India travel")}`);
      const data = await res.json();
      setNews(data.articles || []);
    } catch { setNews([]); }
    setNewsLoaded(true);
    setNewsLoading(false);
  };

  const handleTabChange = (t) => {
    setTab(t);
    if (t === "news" && !newsLoaded && tripData) loadNews();
  };

  const weather = tripData?.weather;
  const wData = weather?.data?.current || weather?.main ? {
    temp: weather?.data?.current?.temperature ?? weather?.main?.temp,
    humidity: weather?.data?.current?.humidity ?? weather?.main?.humidity,
    wind: weather?.data?.current?.windSpeed ?? weather?.wind?.speed,
    desc: weather?.data?.current?.description ?? weather?.weather?.[0]?.description,
    icon: weather?.data?.current?.icon,
    alerts: weather?.data?.alerts || [],
  } : null;

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>

      {/* Form card */}
      <div className="card" style={{ padding: 36, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: "var(--white)", marginBottom: 28, letterSpacing: "-.01em" }}>
          ✈️ Plan Your Trip with AI
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 16 }} className="two-col">
          <Field icon="📍" label="Destination" name="destination" value={form.destination} onChange={set} placeholder="e.g. Goa, Manali, Ujjain, Agra" />
          <Field icon="💰" label="Budget (₹)" type="number" name="budget" value={form.budget} onChange={set} placeholder="e.g. 8000" />
          <Field icon="📅" label="Number of Days" type="number" name="days" value={form.days} onChange={set} placeholder="e.g. 3" />
          <Field icon="👥" label="Travelers" type="number" name="travelers" value={form.travelers} onChange={set} placeholder="e.g. 2" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8 }}>
            🗒️ Trip Preferences (optional)
          </label>
          <textarea name="description" value={form.description} onChange={set} rows={3}
            placeholder="Tell AI your travel style, interests, food preferences, things to avoid..."
            className="input" style={{ resize: "vertical" }} />
        </div>

        {error && <div style={{ color: "var(--red)", fontSize: 14, marginBottom: 16 }}>{error}</div>}

        <button className="btn-primary" onClick={generate} disabled={loading}
          style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: 16 }}>
          {loading ? <><div className="spinner" /> Generating your trip with AI…</> : "✨ Generate AI Trip Plan"}
        </button>
      </div>

      {/* Results */}
      {tripData && (
        <div className="fade-up">

          {/* Weather */}
          {wData && (
            <div className="card" style={{ padding: 28, marginBottom: 20, background: "linear-gradient(135deg,rgba(6,182,212,.08),rgba(56,189,248,.04))", borderColor: "rgba(56,189,248,.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                {wData.icon && <img src={wData.icon} alt="" style={{ width: 48, height: 48 }} />}
                <div>
                  <div style={{ fontSize: 13, color: "var(--sky)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>🌤️ Live Weather – {tripData.city}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "var(--white)", textTransform: "capitalize" }}>{wData.desc || "—"}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }} className="three-col">
                {[
                  { l: "Temperature", v: wData.temp != null ? `${Math.round(wData.temp)}°C` : "—" },
                  { l: "Humidity", v: wData.humidity != null ? `${wData.humidity}%` : "—" },
                  { l: "Wind Speed", v: wData.wind != null ? `${wData.wind} m/s` : "—" },
                ].map(m => (
                  <div key={m.l} style={{ background: "var(--deep)", borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{m.l}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "var(--white)", fontFamily: "'Syne',sans-serif" }}>{m.v}</div>
                  </div>
                ))}
              </div>
              {wData.alerts?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  {wData.alerts.map((a, i) => (
                    <div key={i} style={{ background: "rgba(251,191,36,.08)", border: "1px solid rgba(251,191,36,.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--amber)", marginTop: 8 }}>
                      ⚠️ {a.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--rim)", flexWrap: "wrap" }}>
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => handleTabChange(key)}
                style={{
                  padding: "10px 20px", background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, fontWeight: 600,
                  color: tab === key ? "var(--sky)" : "var(--muted)",
                  borderBottom: tab === key ? "2px solid var(--sky)" : "2px solid transparent",
                  marginBottom: -1, transition: "color .2s",
                }}>{label}</button>
            ))}
          </div>

          {/* Tab: Itinerary */}
          {tab === "itinerary" && (
            tripData.itinerary
              ? <Itinerary itinerary={tripData.itinerary} />
              : <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                  ⚠️ Itinerary generation failed. Check your Gemini API key.
                </div>
          )}

          {/* Tab: Places (Google Maps) */}
          {tab === "places" && (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "var(--white)", marginBottom: 6 }}>📍 Places & Attractions in {tripData.city}</h3>
                <p style={{ fontSize: 13, color: "var(--muted)" }}>Powered by Google Maps Places API</p>
              </div>
              <PlacesExplorer city={tripData.city} />
            </div>
          )}

          {/* Tab: Hotels */}
          {tab === "hotels" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "var(--white)" }}>🏨 Hotels in {tripData.city}</h3>
                {tripData.hotelSource && (
                  <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 99, background: tripData.hotelSource === "booking.com" ? "rgba(56,189,248,.1)" : "rgba(129,140,248,.1)", color: tripData.hotelSource === "booking.com" ? "var(--sky)" : "var(--violet)", border: "1px solid currentColor" }}>
                    {tripData.hotelSource === "booking.com" ? "📡 Live from Booking.com" : "🤖 AI Suggested"}
                  </span>
                )}
              </div>
              {tripData.hotels?.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }} className="two-col">
                  {tripData.hotels.map((h, i) => <HotelCard key={i} hotel={{ ...h, source: tripData.hotelSource }} />)}
                </div>
              ) : (
                <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                  ⚠️ No hotels found. Check your RapidAPI key.
                </div>
              )}
            </div>
          )}

          {/* Tab: News */}
          {tab === "news" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "var(--white)", marginBottom: 6 }}>📰 Travel News – {tripData.city}</h3>
                <p style={{ fontSize: 13, color: "var(--muted)" }}>Powered by Mediastack News API</p>
              </div>
              {newsLoading && <div style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--muted)", padding: 20 }}><div className="spinner" /> Loading news...</div>}
              {!newsLoading && news.length === 0 && (
                <div className="card" style={{ padding: 40, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📰</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 8 }}>Travel news not available.</div>
                  <div style={{ fontSize: 12, color: "var(--sky)" }}>Add your Mediastack API key to <code>.env</code> to enable live travel news.</div>
                </div>
              )}
              {!newsLoading && news.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="three-col">
                  {news.map((article, i) => (
                    <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                      <div className="card" style={{ overflow: "hidden", cursor: "pointer", transition: "border-color .2s, transform .2s", height: "100%" }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = "var(--sky)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = "var(--rim)"; e.currentTarget.style.transform = "none"; }}>
                        {article.image && <img src={article.image} alt={article.title} style={{ width: "100%", height: 130, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
                        <div style={{ padding: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", lineHeight: 1.5, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.title}</div>
                          {article.description && <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.description}</div>}
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                            <span style={{ color: "var(--sky)", fontWeight: 600 }}>{article.source}</span>
                            <span style={{ color: "var(--muted)" }}>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @media(max-width:700px){.two-col{grid-template-columns:1fr!important}.three-col{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
}
