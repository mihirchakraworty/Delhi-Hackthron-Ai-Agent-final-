import React from "react";

export default function PlannerHero() {
  return (
    <section style={{ position:"relative", padding:"80px 0 48px", overflow:"hidden" }}>
      <div className="blob" style={{ width:500, height:500, background:"rgba(56,189,248,.07)", top:-100, left:-100 }} />
      <div className="blob" style={{ width:400, height:400, background:"rgba(232,121,249,.07)", bottom:-100, right:-100 }} />

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px", textAlign:"center" }}>
        <div className="tag" style={{ marginBottom:20 }}>✨ AI-Powered</div>
        <h1 style={{
          fontFamily:"'Syne',sans-serif", fontWeight:800,
          fontSize:"clamp(36px,5.5vw,68px)", letterSpacing:"-.03em",
          color:"var(--white)", lineHeight:1.05, marginBottom:20,
        }}>
          Build Your Perfect<br />
          <span className="grad-text">Travel Experience</span>
        </h1>
        <p style={{ fontSize:17, color:"var(--sub)", maxWidth:540, margin:"0 auto 40px", lineHeight:1.7 }}>
          Enter your destination, budget, and dates. Gemini AI instantly generates a personalised itinerary with hotels, trains, and a full cost breakdown.
        </p>

        <div style={{ display:"flex", justifyContent:"center", gap:24, flexWrap:"wrap" }}>
          {[
            { n:"50+", l:"Destinations" },
            { n:"AI",  l:"Gemini Powered" },
            { n:"24/7",l:"Always Available" },
          ].map(s => (
            <div key={s.l} className="card" style={{ padding:"16px 28px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:"var(--white)" }}>{s.n}</div>
              <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
