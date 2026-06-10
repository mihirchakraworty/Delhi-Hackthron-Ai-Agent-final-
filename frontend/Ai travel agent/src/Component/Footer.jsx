import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      borderTop:"1px solid var(--rim)", background:"var(--ink)",
      padding:"48px 0 28px",
    }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:40, marginBottom:40 }}
             className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"var(--grad-btn)",
                            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>✈️</div>
              <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:"var(--white)" }}>
                AI Travel Planner
              </span>
            </div>
            <p style={{ fontSize:14, color:"var(--muted)", lineHeight:1.7, maxWidth:280 }}>
              AI-powered travel planning with live weather, hotel search, train routes, and complete itineraries.
            </p>
            <div style={{ marginTop:16, fontSize:12, color:"var(--muted)" }}>
              Built by Team TECH X
            </div>
          </div>

          {/* Nav */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"var(--sky)", letterSpacing:".1em",
                          textTransform:"uppercase", marginBottom:16 }}>Navigation</div>
            {[["Home","/"],["Planner","/planner"],["Features","/features"]].map(([l,t]) => (
              <div key={l} style={{ marginBottom:10 }}>
                <Link to={t} style={{ fontSize:14, color:"var(--sub)", textDecoration:"none",
                                       transition:"color .2s" }}
                      onMouseOver={e => e.currentTarget.style.color="var(--sky)"}
                      onMouseOut={e => e.currentTarget.style.color="var(--sub)"}>
                  {l}
                </Link>
              </div>
            ))}
          </div>

          {/* APIs */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"var(--sky)", letterSpacing:".1em",
                          textTransform:"uppercase", marginBottom:16 }}>APIs Used</div>
            {["Google Gemini","OpenWeatherMap","Wikipedia","IRCTC (RapidAPI)","Google Maps"].map(a => (
              <div key={a} style={{ fontSize:13, color:"var(--muted)", marginBottom:8 }}>
                {a}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop:"1px solid var(--rim)", paddingTop:20,
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                      flexWrap:"wrap", gap:12 }}>
          <div style={{ fontSize:13, color:"var(--muted)" }}>
            © 2026 AI Travel Planner. All rights reserved.
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {["🤖 AI","🌤️ Weather","🚆 Trains","🏨 Hotels"].map(tag => (
              <span key={tag} style={{ fontSize:11, padding:"3px 10px", borderRadius:99,
                                       background:"var(--panel)", color:"var(--muted)",
                                       border:"1px solid var(--rim)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.footer-grid{grid-template-columns:1fr!important}}`}</style>
    </footer>
  );
}
