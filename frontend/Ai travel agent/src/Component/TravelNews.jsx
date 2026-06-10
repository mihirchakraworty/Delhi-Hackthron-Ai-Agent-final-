import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function TravelNews({ destination }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true); setError("");
      try {
        const endpoint = destination
          ? `${BASE_URL}/api/news/${encodeURIComponent(destination)}`
          : `${BASE_URL}/api/news`;
        const res = await axios.get(endpoint);
        if (res.data.success && res.data.articles?.length > 0) {
          setNews(res.data.articles);
        } else {
          setError(res.data.error || "No news available.");
        }
      } catch {
        setError("Travel news unavailable. Add your Mediastack API key to enable this feature.");
      } finally { setLoading(false); }
    };
    fetchNews();
  }, [destination]);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div>
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 16, color: "var(--muted)" }}>
          <div className="spinner" /> Loading travel news...
        </div>
      )}

      {!loading && error && (
        <div className="card" style={{ padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>📰</div>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>{error}</div>
        </div>
      )}

      {!loading && !error && news.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="three-col">
          {news.map((article, i) => (
            <a key={i} href={article.url} target="_blank" rel="noopener noreferrer"
              style={{ textDecoration: "none", display: "block" }}>
              <div className="card" style={{ padding: 0, overflow: "hidden", height: "100%", cursor: "pointer", transition: "border-color .2s, transform .2s" }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "var(--sky)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "var(--rim)"; e.currentTarget.style.transform = "none"; }}>
                {article.image ? (
                  <img src={article.image} alt={article.title} style={{ width: "100%", height: 140, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                ) : (
                  <div style={{ height: 80, background: "linear-gradient(135deg,rgba(56,189,248,.08),rgba(129,140,248,.06))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>📰</div>
                )}
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--white)", lineHeight: 1.5, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {article.title}
                  </div>
                  {article.description && (
                    <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {article.description}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                    <span style={{ color: "var(--sky)", fontWeight: 600 }}>{article.source}</span>
                    <span style={{ color: "var(--muted)" }}>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
      <style>{`@media(max-width:900px){.three-col{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
