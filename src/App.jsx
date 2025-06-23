import LogoSection from "./sections/LogoSection";
import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/ShowcaseSection";
import FeatureCard from "./sections/FeatureCard";
import ExperienceSection from "./sections/ExperienceSection";
import TechStack from "./sections/TechStack";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import NavBar from "./components/Navbar";
import StarsCanvas from "./components/StarBackground";

const App = () => {
  return (
    <div className="relative">
      {/* Background bintang - z-index rendah */}
      <StarsCanvas />

      {/* Konten utama - z-index tinggi */}
      <div className="relative" style={{ zIndex: 10 }}>
        <NavBar />
        <Hero />
        <ShowcaseSection />
        <LogoSection />
        <FeatureCard />
        <ExperienceSection />
        <TechStack />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default App;
