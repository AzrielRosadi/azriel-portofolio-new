// App.jsx - Enhanced version dengan fix horizontal scroll
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
import StarsCanvas from "./components/StarBackground";
import { SmoothCursor } from "./components/ui/smooth-cursor";
import AllProjects from "./sections/AllProjects";

// Enhanced Loading fallback untuk WebGL
const WebGLFallback = () => (
  <div
    className="fixed inset-0 w-full h-full overflow-hidden"
    style={{
      zIndex: 1,
      background:
        "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,0,40,0.98) 50%, rgba(0,0,0,1) 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div className="text-center max-w-sm mx-auto px-4">
      <div className="mb-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-2 border-purple-400/50 rounded-full animate-pulse mx-auto"></div>
        </div>
      </div>

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
    <div className="w-full overflow-x-hidden">
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
  );
};

// Layout Component to handle conditional navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/projects" ||
    location.pathname.startsWith("/project/");

  return (
    <div className="relative w-full overflow-x-hidden" style={{ zIndex: 10 }}>
      {!hideNavbar && <NavBar />}
      {children}
    </div>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Router>
      {/* Root container dengan overflow control */}
      <div className="relative no-cursor w-full min-h-screen overflow-x-hidden">
        <div
          className={`transition-opacity duration-500 w-full ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* StarBackground dengan overflow protection */}
          <div
            className="fixed inset-0 w-full h-full overflow-hidden"
            style={{ zIndex: 1 }}
          >
            <Suspense fallback={<WebGLFallback />}>
              <StarsCanvas />
            </Suspense>
          </div>

          {/* Smooth Cursor dengan boundary */}
          <div
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 50 }}
          >
            <SmoothCursor />
          </div>

          {/* Content container */}
          <div
            className="relative w-full overflow-x-hidden"
            style={{ zIndex: 10 }}
          >
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/projects"
                  element={
                    <div className="w-full overflow-x-hidden">
                      <AllProjects />
                    </div>
                  }
                />
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen flex items-center justify-center relative w-full overflow-x-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/20 to-black/90" />

                      <div className="text-center relative z-10 max-w-2xl mx-auto px-4">
                        <div className="mb-8">
                          <div className="text-6xl sm:text-8xl mb-6 animate-bounce">
                            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                              🌟
                            </span>
                          </div>

                          <h1 className="text-6xl sm:text-8xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent relative">
                            404
                            <div className="absolute inset-0 text-6xl sm:text-8xl font-bold blur-2xl bg-gradient-to-r from-purple-400/30 via-pink-500/30 to-purple-600/30 bg-clip-text text-transparent -z-10">
                              404
                            </div>
                          </h1>

                          <p className="text-white/80 text-lg sm:text-xl mb-8 font-light tracking-wide">
                            Lost in the digital cosmos...
                          </p>
                          <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
                            The page you're searching for has drifted into
                            another dimension.
                          </p>
                        </div>

                        <div className="space-y-6">
                          <a
                            href="/"
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 group"
                          >
                            <span className="text-xl group-hover:animate-bounce">
                              🏠
                            </span>
                            <span className="font-medium">Return to Base</span>
                          </a>

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
      </div>
    </Router>
  );
};

export default App;
