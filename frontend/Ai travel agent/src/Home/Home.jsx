import Navbar from "../Component/navbar";
import Hero from "../Component/Frontpage/Hero";
import Dashboard from "../Component/Frontpage/Dashboard";
import PopularDestinations from "../Component/Frontpage/PopularDestinations";
import Footer from "../Component/Footer";

export default function Home() {
  return (
    <div style={{ minHeight:"100vh", background:"var(--ink)" }}>
      <Navbar />
      <main>
        <Hero />
        <div style={{ borderTop:"1px solid var(--rim)" }}>
          <Dashboard />
        </div>
        <div style={{ borderTop:"1px solid var(--rim)" }}>
          <PopularDestinations />
        </div>
      </main>
      <Footer />
    </div>
  );
}
