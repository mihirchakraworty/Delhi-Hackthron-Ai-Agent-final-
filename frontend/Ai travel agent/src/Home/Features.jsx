import Navbar from "../Component/navbar";
import Feature from "../Component/thirdpages/Feature";
import Footer from "../Component/Footer";

export default function FeaturesPage() {
  return (
    <div style={{ minHeight:"100vh", background:"var(--ink)" }}>
      <Navbar />
      <main>
        <Feature />
      </main>
      <Footer />
    </div>
  );
}
