import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { to: "/",        label: "Home" },
    { to: "/planner", label: "Planner" },
    { to: "/features",label: "Features" },
  ];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(10,13,20,.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--rim)" : "1px solid transparent",
      transition: "all .3s",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    height: 64 }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--grad-btn)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>✈️</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: "var(--white)", letterSpacing: "-.02em" }}>
              AI Travel
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".08em", textTransform: "uppercase" }}>
              Planner
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <ul style={{ display: "flex", listStyle: "none", gap: 6, alignItems: "center" }}
            className="desktop-nav">
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} style={{
                padding: "7px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                color: loc.pathname === l.to ? "var(--sky)" : "var(--sub)",
                background: loc.pathname === l.to ? "rgba(56,189,248,.1)" : "transparent",
                textDecoration: "none", display: "block",
                transition: "color .2s, background .2s",
              }}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <a href="https://app.trugen.ai/agent/c2a9c67f-ed86-4d90-bf3c-cdd2c2d7ef8d"
               target="_blank" rel="noopener noreferrer"
               style={{
                 padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                 color: "var(--fuchsia)", background: "rgba(232,121,249,.1)",
                 border: "1px solid rgba(232,121,249,.2)", textDecoration: "none", display: "block",
               }}>
              AI Assistant ✨
            </a>
          </li>
          <li>
            <Link to="/planner" className="btn-primary" style={{ padding: "8px 20px", fontSize: 14, textDecoration: "none" }}>
              Plan Trip
            </Link>
          </li>
        </ul>

        {/* Mobile burger */}
        <button onClick={() => setOpen(o => !o)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--body)", fontSize: 22, display: "none" }}
                className="burger">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ borderTop: "1px solid var(--rim)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                  style={{ color: "var(--body)", textDecoration: "none", padding: "10px 0", fontSize: 15 }}>
              {l.label}
            </Link>
          ))}
          <Link to="/planner" onClick={() => setOpen(false)} className="btn-primary" style={{ marginTop: 8, textDecoration: "none", justifyContent: "center" }}>
            Plan Trip
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .burger { display: block !important; } }
      `}</style>
    </nav>
  );
}
