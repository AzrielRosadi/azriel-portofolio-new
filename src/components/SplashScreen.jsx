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
          opacity={0.9} // Transparansi untuk efek subtle
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
        zIndex: 2, // Diubah dari 1 ke 2 agar berada di atas video
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

// Video Background Component dengan delay loading yang lebih lama
const VideoBackground = ({ stage, isLoaded, showVideo }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && isLoaded && showVideo) {
      // Delay video play lebih lama setelah component loaded
      const videoDelay = setTimeout(() => {
        videoRef.current.play().catch((err) => {
          console.log("Video autoplay prevented:", err);
        });
      }, 500); // Increased delay

      return () => clearTimeout(videoDelay);
    }
  }, [isLoaded, showVideo]);

  return (
    <div
      className="video-background"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        overflow: "hidden",
        opacity: showVideo && stage >= 1 ? 0.4 : 0,
        transition: "opacity 2s ease-in-out", // Slower transition
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter:
            stage >= 2
              ? "brightness(1.1) contrast(1.2)"
              : "brightness(0.8) contrast(0.9)",
          transition: "filter 1s ease-in-out",
        }}
      >
        <source src="/blackhole.webm" type="video/webm" />
        {/* Fallback untuk browser yang tidak mendukung WebM */}
        <source src="/blackhole.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay untuk mengatur intensitas video */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            stage >= 3
              ? "rgba(0, 0, 0, 0.2)"
              : stage >= 2
              ? "rgba(0, 0, 0, 0.3)"
              : "rgba(0, 0, 0, 0.5)",
          transition: "background 1s ease-in-out",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
};

const SplashScreen = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false); // State untuk initial loading
  const [showVideo, setShowVideo] = useState(false); // State untuk delay video
  const [logoRotation, setLogoRotation] = useState(0);

  useEffect(() => {
    // Initial delay sebelum splash screen muncul
    const initialDelay = setTimeout(() => {
      setIsLoaded(true);
    }, 300); // 300ms delay sebelum splash screen muncul

    // Delay khusus untuk video black hole (lebih lama)
    const videoDelay = setTimeout(() => {
      setShowVideo(true);
    }, 1500); // 1.5 detik delay untuk video

    // Timeline animasi splash screen (dimulai setelah initial delay)
    const timer1 = setTimeout(() => setStage(1), 800); // 500 + 300 = 800ms
    const timer2 = setTimeout(() => setStage(2), 1800); // 1500 + 300 = 1800ms
    const timer3 = setTimeout(() => setStage(3), 2800); // 2500 + 300 = 2800ms
    const timer4 = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete && onComplete(), 800);
    }, 5500); // Diperpanjang karena video delay

    // Logo rotation animation (hanya dimulai setelah loaded)
    const rotationInterval = setInterval(() => {
      if (isLoaded) {
        setLogoRotation((prev) => prev + 1);
      }
    }, 50);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(videoDelay);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(rotationInterval);
    };
  }, [onComplete, isLoaded]);

  // Jika belum loaded, tampilkan layar hitam dengan fade-in effect
  if (!isLoaded) {
    return (
      <div
        className="splash-initial-loading"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#000000",
          zIndex: 9999,
          opacity: 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    );
  }

  if (!isVisible) {
    return <div className="splash-fade-out" />;
  }

  return (
    <>
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(
            45deg,
            #00f0ff 0%,
            #5200ff 48%,
            #ff2df7 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none !important;
        }

        .gradient-text-glow {
          position: relative;
        }

        .gradient-text-glow::before {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          background: linear-gradient(
            45deg,
            #00f0ff 0%,
            #5200ff 48%,
            #ff2df7 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: blur(8px);
          opacity: 0.7;
          z-index: -1;
        }

        .splash-title-letter {
          transition: all 0.3s ease;
        }

        .splash-title-letter:hover {
          transform: scale(1.1);
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animated-gradient {
          background: linear-gradient(
            45deg,
            #00f0ff,
            #5200ff,
            #ff2df7,
            #00f0ff
          );
          background-size: 400% 400%;
          animation: gradient-shift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div
        className="splash-container"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "scale(1)" : "scale(0.95)",
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Video Background (layer paling bawah) dengan delay */}
        <VideoBackground
          stage={stage}
          isLoaded={isLoaded}
          showVideo={showVideo}
        />

        {/* Star Background (layer kedua) */}
        <SplashStarsCanvas stage={stage} />

        {/* Enhanced Background Effects */}
        <div className="splash-background" style={{ zIndex: 3 }}>
          {/* Multi-layer Gradient Overlay dengan transparansi yang disesuaikan */}
          <div
            className="splash-gradient splash-gradient-primary"
            style={{
              background: `radial-gradient(circle at center, 
                rgba(0, 240, 255, 0.1) 0%, 
                rgba(82, 0, 255, 0.2) 50%, 
                rgba(255, 45, 247, 0.15) 100%)`,
            }}
          />
          <div
            className="splash-gradient splash-gradient-secondary"
            style={{
              background: `linear-gradient(45deg, 
                rgba(0, 240, 255, 0.05) 0%, 
                rgba(82, 0, 255, 0.1) 50%, 
                rgba(255, 45, 247, 0.08) 100%)`,
            }}
          />

          {/* Animated Background Shapes dengan transparansi */}
          <div
            className={`splash-bg-circle ${
              stage >= 1 ? "splash-bg-circle-active" : ""
            }`}
            style={{ opacity: 0.3 }}
          />
          <div
            className={`splash-bg-square ${
              stage >= 2 ? "splash-bg-square-active" : ""
            }`}
            style={{ opacity: 0.2 }}
          />
          <div
            className={`splash-bg-diamond ${
              stage >= 3 ? "splash-bg-diamond-active" : ""
            }`}
            style={{ opacity: 0.25 }}
          />
        </div>

        {/* Main Content */}
        <div className="splash-content" style={{ zIndex: 4 }}>
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
                    className={`splash-letter-a gradient-text-glow ${
                      stage >= 2 ? "splash-letter-animated" : ""
                    }`}
                    data-text="A"
                    style={{
                      transform: `rotateY(${
                        stage >= 2 ? logoRotation * 2 : 0
                      }deg) scale(${stage >= 2 ? 1.1 : 1})`,
                      fontSize: "4rem",
                      fontWeight: "bold",
                    }}
                  >
                    <span className="animated-gradient">A</span>
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
                          background: `linear-gradient(45deg, #00F0FF, #5200FF, #FF2DF7)`,
                          boxShadow:
                            stage >= 2
                              ? `0 0 15px #00F0FF, 0 0 25px #5200FF, 0 0 35px #FF2DF7`
                              : "none",
                        }}
                      />
                    ))}
                  </div>

                  {/* Ring Animation */}
                  <div
                    className={`splash-ring ${
                      stage >= 2 ? "splash-ring-active" : ""
                    }`}
                    style={{
                      borderColor: stage >= 2 ? "#00F0FF" : "transparent",
                      boxShadow: stage >= 2 ? "0 0 20px #00F0FF" : "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Text Animation with Gradient */}
            <div
              className={`splash-text ${
                stage >= 2 ? "splash-text-active" : ""
              }`}
            >
              <h1 className="splash-title">
                <span className="splash-title-azrl">
                  {"AZRL".split("").map((letter, i) => (
                    <span
                      key={i}
                      className="splash-title-letter gradient-text-glow"
                      data-text={letter}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        display: "inline-block",
                        fontSize: "3rem",
                        fontWeight: "bold",
                      }}
                    >
                      <span className="animated-gradient">{letter}</span>
                    </span>
                  ))}
                </span>
                <span
                  className="splash-title-separator gradient-text-glow"
                  data-text="|"
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    margin: "0 0.5rem",
                  }}
                >
                  <span className="animated-gradient">|</span>
                </span>
                <span className="splash-title-webdev">
                  {"WEBDEV".split("").map((letter, i) => (
                    <span
                      key={i}
                      className="splash-title-letter gradient-text-glow"
                      data-text={letter}
                      style={{
                        animationDelay: `${(i + 4) * 0.1}s`,
                        display: "inline-block",
                        fontSize: "3rem",
                        fontWeight: "bold",
                      }}
                    >
                      <span className="animated-gradient">{letter}</span>
                    </span>
                  ))}
                </span>
              </h1>
              <p
                className={`splash-subtitle gradient-text-glow ${
                  stage >= 3 ? "splash-subtitle-active" : ""
                }`}
                data-text="Junior Web Development"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                }}
              >
                <span className="animated-gradient">
                  Junior Web Development
                </span>
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
                      background:
                        i % 3 === 0
                          ? "#00F0FF"
                          : i % 3 === 1
                          ? "#5200FF"
                          : "#FF2DF7",
                      boxShadow: `0 0 10px ${
                        i % 3 === 0
                          ? "#00F0FF"
                          : i % 3 === 1
                          ? "#5200FF"
                          : "#FF2DF7"
                      }`,
                    }}
                  />
                ))}
              </div>
              <p
                className="splash-loading-text gradient-text-glow"
                data-text="Loading Experience..."
                style={{
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                <span className="animated-gradient">Loading Experience...</span>
              </p>
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
                  background:
                    "linear-gradient(90deg, #00F0FF 0%, #5200FF 50%, #FF2DF7 100%)",
                  boxShadow:
                    "0 0 15px #00F0FF, 0 0 30px #5200FF, 0 0 45px #FF2DF7",
                }}
              />
              <div className="splash-progress-glow" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;
