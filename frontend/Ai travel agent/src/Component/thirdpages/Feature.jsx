import React from "react";

const FEATURES = [
  {
    icon:"🤖", title:"Gemini AI Itinerary",
    desc:"Google's Gemini AI generates a complete personalised day-by-day travel plan based on your destination, budget, duration, and travel preferences.",
    tags:["AI Powered","Personalised","Instant"],
  },
  {
    icon:"🌤️", title:"Live Weather Data",
    desc:"Real-time weather conditions pulled from OpenWeatherMap. Get current temperature, humidity, wind, 5-day forecast, and automated safety alerts.",
    tags:["OpenWeatherMap","5-Day Forecast","Alerts"],
  },
  {
    icon:"🏨", title:"Smart Hotel Search",
    desc:"AI-curated hotel recommendations matched to your budget and destination. View pricing, ratings, and locations before you book.",
    tags:["Budget Match","Ratings","Locations"],
  },
  {
    icon:"🚆", title:"IRCTC Train Finder",
    desc:"Search trains between any two stations. Filter by class, fare, and duration. Results are cached for speed with smart sorting.",
    tags:["IRCTC","RapidAPI","Filters & Sort"],
  },
  {
    icon:"💰", title:"Budget Analytics",
    desc:"Smart breakdown of your trip spend across transport, accommodation, food, and local travel. Visual progress bar tracks remaining budget.",
    tags:["Cost Breakdown","Visual","Savings Tracker"],
  },
  {
    icon:"📍", title:"Destination Explorer",
    desc:"Search any city, temple, or tourist attraction and get rich information including description, images, coordinates, and attractions from Wikipedia.",
    tags:["Wikipedia API","Images","Coordinates"],
  },
  {
    icon:"🗺️", title:"Google Maps Integration",
    desc:"Search hotels and attractions, get directions, calculate distances, and explore nearby places — all via the Google Maps API.",
    tags:["Google Maps","Directions","Nearby"],
  },
  {
    icon:"⚡", title:"Smart Caching",
    desc:"All API responses are cached intelligently — weather for 30 mins, trains for 1 hr, destinations for 24 hrs — so the app stays fast.",
    tags:["Performance","Node-Cache","60%+ Faster"],
  },
  {
    icon:"🛡️", title:"Rate Limiting & Security",
    desc:"Express rate limiters protect each API endpoint. Validation schemas catch bad input before it reaches any external service.",
    tags:["Rate Limiting","Joi Validation","Secure"],
  },
];

export default function Feature() {
  return (
    <section style={{ padding:"60px 0 80px" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div className="section-label" style={{ marginBottom:12 }}>Platform Features</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800,
                       fontSize:"clamp(32px,5vw,60px)", color:"var(--white)", letterSpacing:"-.03em",
                       marginBottom:16 }}>
            Everything in one<br /><span className="grad-text">travel platform</span>
          </h1>
          <p style={{ fontSize:16, color:"var(--sub)", maxWidth:500, margin:"0 auto" }}>
            Six live APIs working together to handle every part of your journey — from planning to booking.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}
             className="three-col">
          {FEATURES.map(f => (
            <div key={f.title} className="card" style={{ padding:28,
                                                          transition:"border-color .2s, transform .2s" }}
                 onMouseOver={e => { e.currentTarget.style.borderColor="var(--sky)"; e.currentTarget.style.transform="translateY(-3px)"; }}
                 onMouseOut={e => { e.currentTarget.style.borderColor="var(--rim)"; e.currentTarget.style.transform="none"; }}>
              <div style={{
                width:52, height:52, borderRadius:14,
                background:"rgba(56,189,248,.08)", border:"1px solid rgba(56,189,248,.15)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:26, marginBottom:18,
              }}>{f.icon}</div>
              <div style={{ fontSize:17, fontWeight:700, color:"var(--white)", marginBottom:10 }}>{f.title}</div>
              <p style={{ fontSize:13, color:"var(--sub)", lineHeight:1.65, marginBottom:16 }}>{f.desc}</p>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {f.tags.map(t => (
                  <span key={t} style={{ fontSize:11, padding:"3px 10px", borderRadius:99,
                                         background:"var(--deep)", color:"var(--muted)",
                                         border:"1px solid var(--rim)" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign:"center", marginTop:64 }}>
          <div className="card" style={{ display:"inline-block", padding:"48px 64px" }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800,
                         color:"var(--white)", marginBottom:12 }}>
              Ready to plan your trip?
            </h2>
            <p style={{ fontSize:15, color:"var(--sub)", marginBottom:24 }}>
              Takes 30 seconds. No signup required.
            </p>
            <a href="/planner" className="btn-primary" style={{ textDecoration:"none", fontSize:16, padding:"14px 36px" }}>
              Start Planning →
            </a>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.three-col{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}
