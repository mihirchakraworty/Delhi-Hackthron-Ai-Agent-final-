import React from "react";
import { Link } from "react-router-dom";

const DESTINATIONS = [
  { emoji: "🛕", name: "Ujjain", tag: "Spiritual" },
  { emoji: "🏖️", name: "Goa", tag: "Beaches" },
  { emoji: "🏔️", name: "Manali", tag: "Mountains" },
  { emoji: "🏛️", name: "Agra", tag: "Heritage" },
  { emoji: "🌴", name: "Kerala", tag: "Nature" },
];

export default function Hero() {
  return (
    <section style={{ position: "relative", padding: "80px 0 60px", overflow: "hidden" }}>
      {/* Blobs */}
      <div className="blob" style={{ width: 600, height: 600, background: "rgba(56,189,248,.07)", top: -200, left: -100 }} />
      <div className="blob" style={{ width: 500, height: 500, background: "rgba(129,140,248,.07)", top: 100, right: -150 }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}
             className="hero-grid">

          {/* Left */}
          <div className="fade-up">
            <div className="tag" style={{ marginBottom: 24 }}>🚀 AI-Powered Travel Planning</div>

            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(42px, 5vw, 72px)",
              lineHeight: 1.05, color: "var(--white)", letterSpacing: "-.03em",
              marginBottom: 24,
            }}>
              Plan Your Next<br />
              <span className="grad-text">Dream Journey</span><br />
              With AI
            </h1>

            <p style={{ fontSize: 18, color: "var(--sub)", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Discover destinations, compare budgets, check live weather, find hotels — and get a complete day-by-day itinerary in seconds.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
              <Link to="/planner" className="btn-primary" style={{ textDecoration: "none" }}>
                Start Planning →
              </Link>
              <Link to="/features" className="btn-ghost" style={{ textDecoration: "none" }}>
                See Features
              </Link>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {[
                { n: "10K+", l: "Trips Planned" },
                { n: "150+", l: "Destinations" },
                { n: "98%",  l: "Happy Travelers" },
              ].map(s => (
                <div key={s.l} className="card" style={{ padding: "18px 16px" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "var(--white)", fontFamily: "'Syne',sans-serif" }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — AI preview card */}
          <div className="fade-up" style={{ animationDelay: ".15s" }}>
            <div className="card" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
              {/* window dots */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {["#ef4444","#f59e0b","#10b981"].map(c => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                ))}
              </div>

              {/* User message */}
              <div style={{
                background: "var(--deep)", borderRadius: 12, padding: "14px 18px",
                fontSize: 14, color: "var(--body)", marginBottom: 16,
                borderLeft: "3px solid var(--sky)",
              }}>
                I want a spiritual trip under ₹4,000 from Madhya Pradesh
              </div>

              {/* AI response */}
              <div style={{
                background: "rgba(56,189,248,.06)", border: "1px solid rgba(56,189,248,.15)",
                borderRadius: 14, padding: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: "var(--grad-btn)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                  }}>🤖</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--sky)" }}>AI Recommendation</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { e: "🛕", n: "Ujjain", d: "Mahakaleshwar Jyotirlinga" },
                    { e: "🙏", n: "Omkareshwar", d: "Sacred Narmada Island" },
                    { e: "🏛️", n: "Maheshwar", d: "Historic Temple City" },
                  ].map(p => (
                    <div key={p.n} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 14px", borderRadius: 10,
                      background: "var(--deep)", fontSize: 14,
                    }}>
                      <span style={{ fontSize: 20 }}>{p.e}</span>
                      <div>
                        <div style={{ color: "var(--white)", fontWeight: 600, fontSize: 14 }}>{p.n}</div>
                        <div style={{ color: "var(--muted)", fontSize: 12 }}>{p.d}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--rim)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>Estimated Budget</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "var(--green)", fontFamily: "'Syne',sans-serif" }}>₹3,500</span>
                </div>
              </div>

              {/* Typing input */}
              <div style={{
                marginTop: 16, display: "flex", alignItems: "center", gap: 10,
                background: "var(--deep)", borderRadius: 12, padding: "12px 16px",
                border: "1px solid var(--rim)",
              }}>
                <span style={{ fontSize: 13, color: "var(--muted)", flex: 1 }}>Ask AI about your next trip...</span>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, background: "var(--grad-btn)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>↑</div>
              </div>
            </div>

            {/* Floating badges */}
            <div style={{
              position: "absolute", top: -12, right: 12,
              background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.25)",
              borderRadius: 10, padding: "8px 14px", fontSize: 13, color: "var(--green)",
              fontWeight: 600, backdropFilter: "blur(10px)",
            }}>
              ✅ Budget Optimised
            </div>
          </div>

        </div>

        {/* Scrolling destination strip */}
        <div style={{ marginTop: 56, overflow: "hidden" }}>
          <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
            Popular destinations
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {DESTINATIONS.map(d => (
              <div key={d.name} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 16px", borderRadius: 99,
                background: "var(--panel)", border: "1px solid var(--rim)",
                fontSize: 14, color: "var(--sub)", cursor: "default",
                transition: "border-color .2s",
              }}
              onMouseOver={e => e.currentTarget.style.borderColor="var(--sky)"}
              onMouseOut={e => e.currentTarget.style.borderColor="var(--rim)"}>
                <span>{d.emoji}</span>
                <span style={{ color: "var(--body)", fontWeight: 500 }}>{d.name}</span>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{d.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
