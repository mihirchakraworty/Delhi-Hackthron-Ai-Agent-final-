import React, { useState } from "react";
import { getPlace } from "../../servers/placeService";

export default function PopularDestinations() {
  const [search, setSearch] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      setLoading(true); setError("");
      const data = await getPlace(search.trim());
      const exists = places.some(p => p.title?.toLowerCase() === data.title?.toLowerCase());
      if (!exists) setPlaces(prev => [data, ...prev]);
      setSearch("");
    } catch { setError("Place not found. Try a different name."); }
    finally { setLoading(false); }
  };

  return (
    <section style={{ padding: "60px 0 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Destination Explorer</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(28px,4vw,44px)",
                       color:"var(--white)", letterSpacing:"-.02em", marginBottom:12 }}>
            Search any destination
          </h2>
          <p style={{ color:"var(--sub)", fontSize:15 }}>
            Get instant info from Wikipedia for any city, temple, or tourist spot
          </p>
        </div>

        {/* Search bar */}
        <div style={{ display:"flex", gap:12, maxWidth:640, margin:"0 auto 40px", flexWrap:"wrap" }}>
          <input
            className="input"
            style={{ flex:1, minWidth:200 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Try: Ujjain, Taj Mahal, Goa..."
          />
          <button className="btn-primary" onClick={handleSearch} disabled={loading}
                  style={{ whiteSpace:"nowrap" }}>
            {loading ? <><div className="spinner" />Searching</> : "Search →"}
          </button>
        </div>

        {error && (
          <div style={{ textAlign:"center", color:"var(--red)", marginBottom:24, fontSize:14 }}>{error}</div>
        )}

        {!loading && places.length === 0 && (
          <div className="card" style={{ padding:48, textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:16 }}>🗺️</div>
            <div style={{ fontSize:17, fontWeight:600, color:"var(--white)", marginBottom:8 }}>
              No destinations searched yet
            </div>
            <div style={{ fontSize:14, color:"var(--muted)" }}>
              Search for a city or attraction to see details
            </div>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}
             className="three-col">
          {places.map((place, i) => (
            <div key={i} className="card" style={{
              overflow:"hidden", transition:"border-color .2s, transform .2s",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor="var(--sky)"; e.currentTarget.style.transform="translateY(-3px)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor="var(--rim)"; e.currentTarget.style.transform="none"; }}>
              {place?.imageUrl || place?.image ? (
                <img src={place.imageUrl || place.image} alt={place.title}
                     style={{ width:"100%", height:200, objectFit:"cover" }} />
              ) : (
                <div style={{ height:200, background:"var(--deep)", display:"flex",
                              alignItems:"center", justifyContent:"center", fontSize:48 }}>
                  🌏
                </div>
              )}
              <div style={{ padding: 24 }}>
                <div style={{ fontSize:19, fontWeight:700, color:"var(--white)", marginBottom:12 }}>
                  {place?.title}
                </div>
                <p style={{ fontSize:13, color:"var(--sub)", lineHeight:1.65,
                            display:"-webkit-box", WebkitLineClamp:4, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                  {place?.description}
                </p>
                {place?.contentUrl && (
                  <a href={place.contentUrl} target="_blank" rel="noopener noreferrer"
                     style={{ display:"inline-block", marginTop:16, fontSize:13,
                              color:"var(--sky)", textDecoration:"none", fontWeight:600 }}>
                    Read more →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:900px){.three-col{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}
