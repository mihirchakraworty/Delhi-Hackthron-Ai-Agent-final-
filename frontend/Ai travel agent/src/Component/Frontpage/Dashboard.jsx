import React from "react";

const DESTINATIONS = [
  { emoji:"🛕", name:"Ujjain",      tag:"Spiritual",  budget:"₹2,500",  days:2 },
  { emoji:"🏖️", name:"Goa",         tag:"Beaches",    budget:"₹8,000",  days:4 },
  { emoji:"🏔️", name:"Manali",      tag:"Mountains",  budget:"₹12,000", days:5 },
  { emoji:"🏛️", name:"Agra",        tag:"Heritage",   budget:"₹3,500",  days:2 },
  { emoji:"🌴", name:"Munnar",      tag:"Nature",     budget:"₹9,000",  days:4 },
  { emoji:"🕌", name:"Hyderabad",   tag:"Culture",    budget:"₹5,000",  days:3 },
];

const FEATURES = [
  { icon:"🤖", title:"AI Itinerary",    desc:"Complete day-by-day plan built by Gemini AI" },
  { icon:"🌤️", title:"Live Weather",    desc:"Real-time conditions for any destination" },
  { icon:"🏨", title:"Hotel Search",    desc:"Curated stays matched to your budget" },
  { icon:"🚆", title:"Train Finder",    desc:"IRCTC-powered route & fare comparison" },
  { icon:"💰", title:"Budget Tracker",  desc:"Smart breakdown of every travel expense" },
  { icon:"📍", title:"Place Explorer",  desc:"Wikipedia-powered destination insights" },
];

export default function Dashboard() {
  return (
    <section style={{ padding: "60px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* ── How it works ── */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>How it works</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(30px,4vw,46px)",
                       color:"var(--white)", letterSpacing:"-.02em", marginBottom: 16 }}>
            Your trip in <span className="grad-text">three steps</span>
          </h2>
          <p style={{ color:"var(--sub)", fontSize:16, maxWidth:480, margin:"0 auto" }}>
            Tell us where and when. We handle everything else.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, marginBottom:80 }}
             className="three-col">
          {[
            { n:"01", title:"Enter your details",    desc:"Destination, budget, days, and travel style — a 30-second form." },
            { n:"02", title:"AI builds your plan",   desc:"Gemini generates a day-by-day itinerary, hotel picks, and cost breakdown instantly." },
            { n:"03", title:"Go explore",            desc:"Download your plan, check weather, and book trains — all from one place." },
          ].map(s => (
            <div key={s.n} className="card" style={{ padding: 28, position:"relative", overflow:"hidden" }}>
              <div style={{
                fontFamily:"'Syne',sans-serif", fontSize:52, fontWeight:900,
                color:"var(--rim)", position:"absolute", top:16, right:20, lineHeight:1,
              }}>{s.n}</div>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--sky)", marginBottom:12,
                            letterSpacing:".05em", textTransform:"uppercase" }}>Step {s.n}</div>
              <div style={{ fontSize:18, fontWeight:700, color:"var(--white)", marginBottom:10 }}>{s.title}</div>
              <div style={{ fontSize:14, color:"var(--sub)", lineHeight:1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Features grid ── */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div className="section-label" style={{ marginBottom:12 }}>Features</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(26px,3.5vw,40px)",
                       color:"var(--white)", letterSpacing:"-.02em" }}>
            Everything your journey needs
          </h2>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:80 }}
             className="three-col">
          {FEATURES.map(f => (
            <div key={f.title} className="card" style={{ padding:24, display:"flex", gap:16, alignItems:"flex-start",
                                                         transition:"border-color .2s, transform .2s" }}
                 onMouseOver={e => { e.currentTarget.style.borderColor="var(--sky)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                 onMouseOut={e => { e.currentTarget.style.borderColor="var(--rim)"; e.currentTarget.style.transform="none"; }}>
              <div style={{
                width:44, height:44, borderRadius:12, background:"rgba(56,189,248,.1)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0,
              }}>{f.icon}</div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:"var(--white)", marginBottom:6 }}>{f.title}</div>
                <div style={{ fontSize:13, color:"var(--muted)", lineHeight:1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Destinations grid ── */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div className="section-label" style={{ marginBottom:12 }}>Explore</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(26px,3.5vw,40px)",
                       color:"var(--white)", letterSpacing:"-.02em" }}>
            Trending destinations
          </h2>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}
             className="three-col">
          {DESTINATIONS.map(d => (
            <div key={d.name} className="card" style={{ padding:24, cursor:"pointer",
                                                        transition:"border-color .2s, transform .2s" }}
                 onMouseOver={e => { e.currentTarget.style.borderColor="var(--violet)"; e.currentTarget.style.transform="translateY(-3px)"; }}
                 onMouseOut={e => { e.currentTarget.style.borderColor="var(--rim)"; e.currentTarget.style.transform="none"; }}>
              <div style={{ fontSize:36, marginBottom:14 }}>{d.emoji}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ fontSize:17, fontWeight:700, color:"var(--white)" }}>{d.name}</div>
                <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:99,
                               background:"rgba(129,140,248,.1)", color:"var(--violet)", border:"1px solid rgba(129,140,248,.2)" }}>
                  {d.tag}
                </span>
              </div>
              <div style={{ display:"flex", gap:16, fontSize:13, color:"var(--muted)" }}>
                <span>💰 from {d.budget}</span>
                <span>📅 {d.days} days</span>
              </div>
              <div style={{ marginTop:14, fontSize:13, color:"var(--sky)", fontWeight:600 }}>
                Plan this trip →
              </div>
            </div>
          ))}
        </div>

      </div>
      <style>{`
        @media (max-width: 900px) { .three-col { grid-template-columns: 1fr !important; } }
        @media (min-width: 600px) and (max-width: 900px) { .three-col { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </section>
  );
}
