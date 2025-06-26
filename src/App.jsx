// App.jsx - Enhanced version dengan SplashScreen dan StarBackground terintegrasi
import React, { useState, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Import Components
import SplashScreen from "./components/SplashScreen";
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
import StarsCanvas from "./components/StarBackground"; // Import dengan nama yang benar
import { SmoothCursor } from "./components/ui/smooth-cursor";
import AllProjects from "./sections/AllProjects";

// Enhanced Loading fallback untuk WebGL - disesuaikan dengan tema SplashScreen
const WebGLFallback = () => (
  <div
    className="fixed inset-0 w-full h-full"
    style={{
      zIndex: 1,
      background:
        "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,0,40,0.98) 50%, rgba(0,0,0,1) 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div className="text-center">
      {/* Loading animation konsisten dengan SplashScreen */}
      <div className="mb-6">
        <div className="relative">
          {/* Animated Ring */}
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          {/* Inner glow */}
          <div className="absolute inset-0 w-16 h-16 border-2 border-purple-400/50 rounded-full animate-pulse mx-auto"></div>
        </div>
      </div>

      {/* Loading dots animation */}
      <div className="flex justify-center space-x-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      <p className="text-white/70 text-sm font-light tracking-wide">
        Loading Stellar Experience...
      </p>
    </div>
  </div>
);

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
  // State untuk mengontrol splash screen
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Handler ketika splash screen selesai
  const handleSplashComplete = () => {
    setShowSplash(false);
    // Tambahkan delay kecil untuk transisi yang smooth
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Jika masih loading, tampilkan splash screen
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Router>
      <div className="relative no-cursor">
        {/* Main Application - Tampil setelah splash selesai */}
        <div
          className={`transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* StarBackground dengan fallback - konsisten dengan SplashScreen */}
          <Suspense fallback={<WebGLFallback />}>
            <StarsCanvas />
          </Suspense>

          {/* Smooth Cursor - akan berada di atas semua elemen */}
          <SmoothCursor />

          {/* Konten utama - z-index tinggi */}
          <Layout>
            <Routes>
              {/* Homepage Route */}
              <Route path="/" element={<HomePage />} />

              {/* All Projects Route */}
              <Route path="/projects" element={<AllProjects />} />

              {/* 404 Not Found Route - Enhanced styling konsisten dengan tema */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center relative">
                    {/* Background overlay untuk 404 page */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/20 to-black/90" />

                    <div className="text-center relative z-10">
                      <div className="mb-8">
                        {/* Animated 404 icon */}
                        <div className="text-8xl mb-6 animate-bounce">
                          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                            🌟
                          </span>
                        </div>

                        {/* 404 Text with glow effect */}
                        <h1 className="text-8xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent relative">
                          404
                          <div className="absolute inset-0 text-8xl font-bold blur-2xl bg-gradient-to-r from-purple-400/30 via-pink-500/30 to-purple-600/30 bg-clip-text text-transparent -z-10">
                            404
                          </div>
                        </h1>

                        <p className="text-white/80 text-xl mb-8 font-light tracking-wide">
                          Lost in the digital cosmos...
                        </p>
                        <p className="text-white/60 text-sm mb-8">
                          The page you're searching for has drifted into another
                          dimension.
                        </p>
                      </div>

                      <div className="space-y-6">
                        {/* Enhanced back to home button */}
                        <a
                          href="/"
                          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group"
                        >
                          <span className="text-xl group-hover:animate-bounce">
                            🏠
                          </span>
                          <span className="font-medium">Return to Base</span>
                        </a>

                        {/* Additional info */}
                        <div className="text-sm text-white/50 max-w-md mx-auto">
                          <p className="italic">
                            "Not all who wander are lost, but this page
                            definitely is."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
            </Routes>
          </Layout>
        </div>
      </div>
    </Router>
  );
};

export default App;
