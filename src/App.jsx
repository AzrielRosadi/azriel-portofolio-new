// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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
import { SmoothCursor } from "./components/ui/smooth-cursor";
import AllProjects from "./sections/AllProjects";

// Homepage Component
const HomePage = () => {
  return (
    <>
      <Hero />
      <ShowcaseSection />
      <LogoSection />
      <FeatureCard />
      <ExperienceSection />
      <TechStack />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
};

// Layout Component to handle conditional navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/projects" ||
    location.pathname.startsWith("/project/");

  return (
    <div className="relative" style={{ zIndex: 10 }}>
      {!hideNavbar && <NavBar />}
      {children}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="relative no-cursor">
        {/* Background bintang - z-index rendah */}
        <StarsCanvas />

        {/* Smooth Cursor - akan berada di atas semua elemen */}
        <SmoothCursor />

        {/* Konten utama - z-index tinggi */}
        <Layout>
          <Routes>
            {/* Homepage Route */}
            <Route path="/" element={<HomePage />} />

            {/* All Projects Route */}
            <Route path="/projects" element={<AllProjects />} />

            {/* 404 Not Found Route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-black-100 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                    <p className="text-white-200 text-xl mb-8">
                      Page Not Found
                    </p>
                    <a
                      href="/"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                    >
                      Back to Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
};

export default App;
