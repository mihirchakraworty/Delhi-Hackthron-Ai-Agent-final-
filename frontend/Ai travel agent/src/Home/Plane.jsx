import Navbar from "../Component/navbar";
import PlannerHero from "../Component/Secondpagea/PlannerHero";
import TripForm from "../Component/Secondpagea/TripForm";
import Footer from "../Component/Footer";

export default function Plane() {
  return (
    <div style={{ minHeight:"100vh", background:"var(--ink)" }}>
      <Navbar />
      <main>
        <PlannerHero />
        <div style={{ borderTop:"1px solid var(--rim)" }}>
          <TripForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
