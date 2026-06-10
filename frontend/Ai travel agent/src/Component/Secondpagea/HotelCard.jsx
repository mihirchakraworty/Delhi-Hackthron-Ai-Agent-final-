import React from "react";

const STAR_COLORS = { Budget: "#34d399", Standard: "#38bdf8", Premium: "#fbbf24", Luxury: "#f472b6" };

export default function HotelCard({ hotel }) {
  const {
    name, stars, category, area, address,
    price_per_night, review_score, review_score_word,
    amenities, is_free_cancellable, highlights,
    booking_search_url,
  } = hotel;

  const catColor = STAR_COLORS[category] || "#818cf8";

  return (
    <div className="card" style={{ overflow: "hidden", transition: "border-color .2s, transform .15s", display: "flex", flexDirection: "column" }}
      onMouseOver={e => { e.currentTarget.style.borderColor = catColor; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = "var(--rim)"; e.currentTarget.style.transform = "none"; }}>

      {/* Header band */}
      <div style={{ padding: "14px 18px", background: `${catColor}10`, borderBottom: "1px solid var(--rim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 18 }}>
          {"⭐".repeat(Math.min(Number(stars) || 3, 5))}
        </div>
        {category && (
          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: `${catColor}20`, color: catColor, border: `1px solid ${catColor}40`, fontWeight: 700 }}>
            {category}
          </span>
        )}
      </div>

      <div style={{ padding: 18, flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", lineHeight: 1.4 }}>{name}</div>

        {(area || address) && (
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
            📍 {address || area}
          </div>
        )}

        {highlights && (
          <div style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.5, fontStyle: "italic" }}>"{highlights}"</div>
        )}

        {/* Price & rating row */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          {price_per_night && (
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--green)", fontFamily: "'Syne',sans-serif" }}>
              {price_per_night}<span style={{ fontSize: 11, fontWeight: 400, color: "var(--muted)" }}>/night</span>
            </div>
          )}
          {review_score && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ background: "#3b82f6", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 13, fontWeight: 800 }}>{review_score}</div>
              {review_score_word && <span style={{ fontSize: 12, color: "var(--muted)" }}>{review_score_word}</span>}
            </div>
          )}
        </div>

        {/* Amenities */}
        {amenities && amenities.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {amenities.slice(0, 5).map((a, i) => (
              <span key={i} style={{ fontSize: 11, padding: "3px 8px", background: "var(--deep)", borderRadius: 6, color: "var(--muted)", border: "1px solid var(--rim)" }}>
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "auto", paddingTop: 10, borderTop: "1px solid var(--rim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {is_free_cancellable && (
            <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>✓ Free cancellation</span>
          )}
          {booking_search_url && (
            <a href={booking_search_url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: "var(--sky)", textDecoration: "none", fontWeight: 600, marginLeft: "auto" }}>
              Search Booking.com →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
