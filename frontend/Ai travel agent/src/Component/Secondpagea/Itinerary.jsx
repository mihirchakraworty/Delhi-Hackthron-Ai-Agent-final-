import React, { useState } from "react";

export default function Itinerary({ itinerary }) {
  const [expanded, setExpanded] = useState(0);
  if (!itinerary) return null;

  // Handle both structured JSON and plain text (fallback)
  const isStructured = typeof itinerary === "object" && itinerary.days;

  if (!isStructured) {
    // Legacy plain-text rendering
    const days = itinerary.match(/Day\s+\d+[\s\S]*?(?=Day\s+\d+|$)/gi) || [itinerary];
    const fmt = (text) => text
      .replace(/Day\s+\d+[:\-]?/i, "")
      .replace(/Morning:/gi, "\n🌅 Morning:")
      .replace(/Afternoon:/gi, "\n☀️ Afternoon:")
      .replace(/Evening:/gi, "\n🌙 Evening:")
      .replace(/Night:/gi, "\n🌃 Night:")
      .replace(/Estimated Cost:/gi, "\n💰 Cost:")
      .trim();
    return (
      <section>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "var(--white)", marginBottom: 24 }}>📅 Day-by-Day Itinerary</h3>
        {days.map((day, i) => (
          <div key={i} className="card" style={{ padding: 24, marginBottom: 12, cursor: "pointer" }} onClick={() => setExpanded(expanded === i ? null : i)}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--sky)", marginBottom: expanded === i ? 12 : 0 }}>Day {i + 1} {expanded === i ? "▲" : "▼"}</div>
            {expanded === i && <div style={{ fontSize: 14, color: "var(--body)", whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{fmt(day)}</div>}
          </div>
        ))}
      </section>
    );
  }

  // Structured JSON rendering
  const { summary, totalEstimatedCost, days, topAttractions, localFoods, transportationTips, budgetBreakdown, packingTips, bestSeason } = itinerary;

  const slots = [
    { key: "morning", emoji: "🌅", label: "Morning" },
    { key: "afternoon", emoji: "☀️", label: "Afternoon" },
    { key: "evening", emoji: "🌙", label: "Evening" },
    { key: "night", emoji: "🌃", label: "Night" },
  ];

  return (
    <section>
      {/* Summary banner */}
      {summary && (
        <div style={{ background: "linear-gradient(135deg,rgba(56,189,248,.1),rgba(129,140,248,.08))", border: "1px solid rgba(56,189,248,.2)", borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: "var(--sky)", fontWeight: 600, marginBottom: 6 }}>✨ Trip Overview</div>
          <div style={{ fontSize: 15, color: "var(--white)", lineHeight: 1.6 }}>{summary}</div>
          {totalEstimatedCost && (
            <div style={{ marginTop: 10, fontSize: 13, color: "var(--green)", fontWeight: 700 }}>💰 Total Estimated: {totalEstimatedCost}</div>
          )}
          {bestSeason && (
            <div style={{ marginTop: 4, fontSize: 13, color: "var(--muted)" }}>🗓️ Best Season: {bestSeason}</div>
          )}
        </div>
      )}

      {/* Budget breakdown */}
      {budgetBreakdown && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--white)", marginBottom: 16 }}>💰 Budget Breakdown</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }} className="five-col">
            {Object.entries(budgetBreakdown).map(([k, v]) => (
              <div key={k} style={{ background: "var(--deep)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, textTransform: "capitalize" }}>{k}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--green)", fontFamily: "'Syne',sans-serif" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Days */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "var(--white)" }}>📅 Day-by-Day Itinerary</h3>
        <span className="tag">{days.length} Day Plan</span>
      </div>

      <div style={{ position: "relative", paddingLeft: 56 }}>
        <div className="timeline-line" />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {days.map((day, i) => (
            <div key={i} style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: -56, top: 18, width: 44, height: 44, borderRadius: "50%", background: "var(--grad-btn)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff", fontFamily: "'Syne',sans-serif", boxShadow: "0 0 0 4px var(--ink)" }}>{i + 1}</div>
              <div className="card" style={{ overflow: "hidden", cursor: "pointer", transition: "border-color .2s" }}
                onClick={() => setExpanded(expanded === i ? null : i)}
                onMouseOver={e => e.currentTarget.style.borderColor = "var(--sky)"}
                onMouseOut={e => expanded !== i && (e.currentTarget.style.borderColor = "var(--rim)")}>
                <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--sky)" }}>Day {day.day}: {day.title}</div>
                    {day.dailyCost && <div style={{ fontSize: 12, color: "var(--green)", marginTop: 4 }}>💰 {day.dailyCost}</div>}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{expanded === i ? "▲ collapse" : "▼ expand"}</div>
                </div>

                {expanded === i && (
                  <div style={{ padding: "0 24px 24px", borderTop: "1px solid var(--rim)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, paddingTop: 16 }} className="two-col">
                      {slots.map(slot => {
                        const s = day[slot.key];
                        if (!s) return null;
                        return (
                          <div key={slot.key} style={{ background: "var(--deep)", borderRadius: 12, padding: 16 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--sky)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".05em" }}>{slot.emoji} {slot.label}</div>
                            <div style={{ fontSize: 14, color: "var(--white)", fontWeight: 600, marginBottom: 6 }}>{s.place}</div>
                            <div style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.6, marginBottom: 8 }}>{s.activity}</div>
                            {s.tip && <div style={{ fontSize: 12, color: "var(--amber)", background: "rgba(251,191,36,.08)", padding: "6px 10px", borderRadius: 8 }}>💡 {s.tip}</div>}
                            {s.estimatedCost && <div style={{ fontSize: 12, color: "var(--green)", marginTop: 6 }}>{s.estimatedCost}</div>}
                          </div>
                        );
                      })}
                    </div>

                    {day.meals && day.meals.length > 0 && (
                      <div style={{ marginTop: 14, background: "rgba(34,197,94,.05)", border: "1px solid rgba(34,197,94,.15)", borderRadius: 12, padding: "12px 16px" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", marginBottom: 8 }}>🍽️ MEAL SUGGESTIONS</div>
                        {day.meals.map((m, mi) => <div key={mi} style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.7 }}>{m}</div>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attractions */}
      {topAttractions && topAttractions.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "var(--white)", marginBottom: 16 }}>🏛️ Top Attractions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }} className="three-col">
            {topAttractions.map((a, i) => (
              <div key={i} className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 8 }}>{a.name}</div>
                <div style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.5, marginBottom: 10 }}>{a.description}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                  {a.entryFee && <span style={{ color: "var(--green)" }}>🎟️ {a.entryFee}</span>}
                  {a.bestTime && <span style={{ color: "var(--amber)" }}>⏰ {a.bestTime}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Local Foods */}
      {localFoods && localFoods.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, color: "var(--white)", marginBottom: 16 }}>🍜 Local Foods to Try</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }} className="three-col">
            {localFoods.map((f, i) => (
              <div key={i} className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--amber)", marginBottom: 8 }}>{f.name}</div>
                <div style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.5, marginBottom: 8 }}>{f.description}</div>
                {f.wherToTry && <div style={{ fontSize: 12, color: "var(--sky)" }}>📍 {f.wherToTry}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {(transportationTips?.length > 0 || packingTips?.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 28 }} className="two-col">
          {transportationTips?.length > 0 && (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--sky)", marginBottom: 12 }}>🚌 Transportation Tips</div>
              {transportationTips.map((t, i) => <div key={i} style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.7, paddingLeft: 12, borderLeft: "2px solid var(--sky)", marginBottom: 8 }}>{t}</div>)}
            </div>
          )}
          {packingTips?.length > 0 && (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--violet)", marginBottom: 12 }}>🎒 Packing Tips</div>
              {packingTips.map((t, i) => <div key={i} style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.7, paddingLeft: 12, borderLeft: "2px solid var(--violet)", marginBottom: 8 }}>{t}</div>)}
            </div>
          )}
        </div>
      )}

      <style>{`
        @media(max-width:700px){.two-col{grid-template-columns:1fr!important}.three-col{grid-template-columns:1fr!important}.five-col{grid-template-columns:repeat(2,1fr)!important}}
      `}</style>
    </section>
  );
}
