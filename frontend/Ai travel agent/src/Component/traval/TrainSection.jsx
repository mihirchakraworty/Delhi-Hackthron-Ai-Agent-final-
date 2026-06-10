import React from "react";

export default function TrainSection({ trains = [] }) {
  if (!Array.isArray(trains) || trains.length === 0) return null;

  return (
    <div className="card" style={{ padding:28, marginBottom:20 }}>
      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800,
                   color:"var(--white)", marginBottom:20, letterSpacing:"-.01em" }}>
        🚆 Train Options
      </h3>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}
           className="two-col">
        {trains.map((t, i) => (
          <div key={t.number || i} className="card" style={{ padding:20, transition:"border-color .2s" }}
               onMouseOver={e => e.currentTarget.style.borderColor="var(--sky)"}
               onMouseOut={e => e.currentTarget.style.borderColor="var(--rim)"}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:"var(--white)" }}>{t.name || "Train"}</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>#{t.number || "—"}</div>
              </div>
              {(t.class || t.classInfo?.name) && (
                <span style={{ fontSize:11, padding:"3px 10px", borderRadius:99,
                               background:"rgba(232,121,249,.1)", color:"var(--fuchsia)",
                               border:"1px solid rgba(232,121,249,.2)" }}>
                  {t.classInfo?.name || t.class}
                </span>
              )}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
              {t.duration && <span style={{ color:"var(--amber)" }}>⏱ {t.duration}</span>}
              {(t.total_fare || t.totalFare) && (
                <span style={{ color:"var(--green)", fontWeight:700 }}>₹{t.total_fare || t.totalFare}</span>
              )}
            </div>
            {t.recommendation && (
              <div style={{ marginTop:10, fontSize:12, color:"var(--sub)" }}>{t.recommendation}</div>
            )}
          </div>
        ))}
      </div>
      <style>{`@media(max-width:700px){.two-col{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
