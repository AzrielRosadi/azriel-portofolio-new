import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

// Star Background Component (sama seperti StarBackground.jsx)
const StarBackground = (props) => {
  const ref = useRef();

  // Generate bintang secara manual
  const [sphere] = useState(() => {
    const positions = new Float32Array(10000 * 3);
    for (let i = 0; i < 5000 * 3; i += 3) {
      const radius = Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#8b5cf6" // Warna ungu
          size={0.003} // Ukuran lebih kecil
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6} // Transparansi untuk efek subtle
        />
      </Points>
    </group>
  );
};

// Splash Stars Canvas Component (konsisten dengan StarBackground.jsx)
const SplashStarsCanvas = ({ stage }) => {
  return (
    <div
      className="splash-stars-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        background: "transparent",
        opacity: stage >= 1 ? 1 : 0.3,
        transition: "opacity 1s ease-in-out",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        style={{
          background: "transparent",
          filter:
            stage >= 2 ? "brightness(1.2) saturate(1.3)" : "brightness(0.8)",
        }}
      >
        <Suspense fallback={null}>
          <StarBackground />
        </Suspense>
      </Canvas>
    </div>
  );
};

const SplashScreen = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [logoRotation, setLogoRotation] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1500);
    const timer3 = setTimeout(() => setStage(3), 2500);
    const timer4 = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete && onComplete(), 800);
    }, 4500);

    // Logo rotation animation
    const rotationInterval = setInterval(() => {
      setLogoRotation((prev) => prev + 1);
    }, 50);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(rotationInterval);
    };
  }, [onComplete]);

  if (!isVisible) {
    return <div className="splash-fade-out" />;
  }

  return (
    <div className="splash-container">
      {/* Star Background (sama seperti StarBackground.jsx) */}
      <SplashStarsCanvas stage={stage} />

      {/* Enhanced Background Effects */}
      <div className="splash-background">
        {/* Multi-layer Gradient Overlay */}
        <div className="splash-gradient splash-gradient-primary" />
        <div className="splash-gradient splash-gradient-secondary" />

        {/* Animated Background Shapes */}
        <div
          className={`splash-bg-circle ${
            stage >= 1 ? "splash-bg-circle-active" : ""
          }`}
        />
        <div
          className={`splash-bg-square ${
            stage >= 2 ? "splash-bg-square-active" : ""
          }`}
        />
        <div
          className={`splash-bg-diamond ${
            stage >= 3 ? "splash-bg-diamond-active" : ""
          }`}
        />
      </div>

      {/* Main Content */}
      <div className="splash-content">
        <div className="splash-content-center">
          {/* Enhanced Logo Container */}
          <div className="splash-logo-container">
            {/* Multi-layer Glow Effect */}
            <div
              className={`splash-glow splash-glow-inner ${
                stage >= 1 ? "splash-glow-active" : ""
              }`}
            />
            <div
              className={`splash-glow splash-glow-outer ${
                stage >= 1 ? "splash-glow-active" : ""
              }`}
            />

            {/* Enhanced Main Logo */}
            <div
              className={`splash-logo ${
                stage >= 1 ? "splash-logo-active" : ""
              }`}
            >
              {/* Letter A with enhanced effects */}
              <div className="splash-letter-container">
                <div
                  className={`splash-letter-a ${
                    stage >= 2 ? "splash-letter-animated" : ""
                  }`}
                  style={{
                    transform: `rotateY(${
                      stage >= 2 ? logoRotation * 2 : 0
                    }deg) scale(${stage >= 2 ? 1.1 : 1})`,
                    textShadow:
                      stage >= 2
                        ? "0 0 30px #8b5cf6, 0 0 60px #8b5cf6"
                        : "none",
                  }}
                >
                  A
                </div>

                {/* Enhanced Orbiting Elements */}
                <div className="splash-orbit-container">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`splash-orbit-dot splash-orbit-dot-${i} ${
                        stage >= 2 ? "splash-orbit-active" : ""
                      }`}
                      style={{
                        animation:
                          stage >= 2
                            ? `orbit-${i} ${1.5 + i * 0.3}s linear infinite`
                            : "none",
                        animationDelay: `${i * 0.2}s`,
                        background: `hsl(${260 + i * 20}, 70%, 60%)`,
                      }}
                    />
                  ))}
                </div>

                {/* Ring Animation */}
                <div
                  className={`splash-ring ${
                    stage >= 2 ? "splash-ring-active" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Text Animation */}
          <div
            className={`splash-text ${stage >= 2 ? "splash-text-active" : ""}`}
          >
            <h1 className="splash-title">
              <span className="splash-title-azrl">
                {"AZRL".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="splash-title-letter"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      display: "inline-block",
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
              <span className="splash-title-separator">|</span>
              <span className="splash-title-webdev">
                {"WEBDEV".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="splash-title-letter"
                    style={{
                      animationDelay: `${(i + 4) * 0.1}s`,
                      display: "inline-block",
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            </h1>
            <p
              className={`splash-subtitle ${
                stage >= 3 ? "splash-subtitle-active" : ""
              }`}
            >
              Junior Web Development
            </p>
          </div>

          {/* Enhanced Loading Animation */}
          <div
            className={`splash-loading ${
              stage >= 3 ? "splash-loading-active" : ""
            }`}
          >
            <div className="splash-loading-dots">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="splash-loading-dot"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    background: `hsl(${260 + i * 10}, 70%, 60%)`,
                  }}
                />
              ))}
            </div>
            <p className="splash-loading-text">Loading Experience...</p>
          </div>

          {/* Enhanced Progress Bar */}
          <div
            className={`splash-progress-container ${
              stage >= 1 ? "splash-progress-visible" : ""
            }`}
          >
            <div className="splash-progress-track" />
            <div
              className="splash-progress-bar"
              style={{
                width:
                  stage >= 3
                    ? "100%"
                    : stage >= 2
                    ? "66%"
                    : stage >= 1
                    ? "33%"
                    : "0%",
              }}
            />
            <div className="splash-progress-glow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
