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

        .white-text {
          color: white;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .white-text-glow {
          position: relative;
          color: white;
        }

        .white-text-glow::before {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          color: white;
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

        /* Mobile Responsive Styles */
        .splash-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          background: #000000;
        }

        .splash-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .splash-content-center {
          text-align: center;
          width: 100%;
          max-width: 800px;
        }

        .splash-logo-container {
          position: relative;
          margin-bottom: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .splash-logo {
          transform: ${stage >= 1 ? "scale(1)" : "scale(0.8)"};
          opacity: ${stage >= 1 ? "1" : "0"};
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .splash-letter-container {
          position: relative;
          display: inline-block;
        }

        .splash-letter-a {
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: bold;
          line-height: 1;
          transition: all 0.5s ease;
        }

        .splash-orbit-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: clamp(80px, 15vw, 120px);
          height: clamp(80px, 15vw, 120px);
        }

        .splash-orbit-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00f0ff;
          opacity: ${stage >= 2 ? "1" : "0"};
          transition: opacity 0.5s ease;
        }

        .splash-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: clamp(100px, 18vw, 140px);
          height: clamp(100px, 18vw, 140px);
          border: 2px solid transparent;
          border-radius: 50%;
          transition: all 1s ease;
        }

        .splash-text {
          margin-bottom: 40px;
          opacity: ${stage >= 2 ? "1" : "0"};
          transform: ${stage >= 2 ? "translateY(0)" : "translateY(20px)"};
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .splash-title {
          font-size: clamp(1.8rem, 6vw, 3rem);
          font-weight: bold;
          line-height: 1.2;
          margin: 0 0 15px 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 0.2em;
        }

        .splash-title-azrl,
        .splash-title-webdev {
          display: flex;
        }

        .splash-title-separator {
          margin: 0 0.3em;
        }

        .splash-subtitle {
          font-size: clamp(1rem, 3vw, 1.2rem);
          font-weight: 500;
          margin: 0;
          opacity: ${stage >= 3 ? "1" : "0"};
          transform: ${stage >= 3 ? "translateY(0)" : "translateY(15px)"};
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
          color: white;
        }

        .splash-loading {
          margin-top: 30px;
          opacity: ${stage >= 3 ? "1" : "0"};
          transform: ${stage >= 3 ? "translateY(0)" : "translateY(15px)"};
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s;
        }

        .splash-loading-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 15px;
        }

        .splash-loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: ${stage >= 3 ? "pulse" : "none"} 1.4s ease-in-out infinite;
        }

        .splash-loading-text {
          font-size: clamp(0.9rem, 2.5vw, 1rem);
          font-weight: 500;
          margin: 0;
          color: white;
        }

        .splash-progress-container {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: min(300px, 80vw);
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          opacity: ${stage >= 1 ? "1" : "0"};
          transition: opacity 0.5s ease;
        }

        .splash-progress-bar {
          height: 100%;
          border-radius: 2px;
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes pulse {
          0%,
          80%,
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes orbit-0 {
          0% {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(40px) rotate(-360deg);
          }
        }

        @keyframes orbit-1 {
          0% {
            transform: rotate(72deg) translateX(40px) rotate(-72deg);
          }
          100% {
            transform: rotate(432deg) translateX(40px) rotate(-432deg);
          }
        }

        @keyframes orbit-2 {
          0% {
            transform: rotate(144deg) translateX(40px) rotate(-144deg);
          }
          100% {
            transform: rotate(504deg) translateX(40px) rotate(-504deg);
          }
        }

        @keyframes orbit-3 {
          0% {
            transform: rotate(216deg) translateX(40px) rotate(-216deg);
          }
          100% {
            transform: rotate(576deg) translateX(40px) rotate(-576deg);
          }
        }

        @keyframes orbit-4 {
          0% {
            transform: rotate(288deg) translateX(40px) rotate(-288deg);
          }
          100% {
            transform: rotate(648deg) translateX(40px) rotate(-648deg);
          }
        }

        /* Media Queries untuk fine-tuning */
        @media (max-width: 480px) {
          .splash-content {
            padding: 15px;
          }

          .splash-logo-container {
            margin-bottom: 25px;
          }

          .splash-text {
            margin-bottom: 30px;
          }

          .splash-title-separator {
            margin: 0 0.2em;
          }

          .splash-orbit-container {
            width: 70px;
            height: 70px;
          }

          .splash-ring {
            width: 90px;
            height: 90px;
          }

          .splash-orbit-dot {
            width: 4px;
            height: 4px;
          }

          @keyframes orbit-0 {
            0% {
              transform: rotate(0deg) translateX(35px) rotate(0deg);
            }
            100% {
              transform: rotate(360deg) translateX(35px) rotate(-360deg);
            }
          }

          @keyframes orbit-1 {
            0% {
              transform: rotate(72deg) translateX(35px) rotate(-72deg);
            }
            100% {
              transform: rotate(432deg) translateX(35px) rotate(-432deg);
            }
          }

          @keyframes orbit-2 {
            0% {
              transform: rotate(144deg) translateX(35px) rotate(-144deg);
            }
            100% {
              transform: rotate(504deg) translateX(35px) rotate(-504deg);
            }
          }

          @keyframes orbit-3 {
            0% {
              transform: rotate(216deg) translateX(35px) rotate(-216deg);
            }
            100% {
              transform: rotate(576deg) translateX(35px) rotate(-576deg);
            }
          }

          @keyframes orbit-4 {
            0% {
              transform: rotate(288deg) translateX(35px) rotate(-288deg);
            }
            100% {
              transform: rotate(648deg) translateX(35px) rotate(-648deg);
            }
          }
        }

        @media (max-width: 320px) {
          .splash-orbit-container {
            width: 60px;
            height: 60px;
          }

          .splash-ring {
            width: 80px;
            height: 80px;
          }
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

        {/* Star Background (layer kedua) - Background utama sekarang */}
        <SplashStarsCanvas stage={stage} />

        {/* Main Content */}
        <div className="splash-content" style={{ zIndex: 4 }}>
          <div className="splash-content-center">
            {/* Enhanced Logo Container */}
            <div className="splash-logo-container">
              {/* Enhanced Main Logo */}
              <div
                className={`splash-logo ${
                  stage >= 1 ? "splash-logo-active" : ""
                }`}
              >
                {/* Letter A with enhanced effects - kept as gradient */}
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

            {/* Enhanced Text Animation - Only AZRL | WEBDEV with gradient */}
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
                      }}
                    >
                      <span className="animated-gradient">{letter}</span>
                    </span>
                  ))}
                </span>
                <span
                  className="splash-title-separator gradient-text-glow"
                  data-text="|"
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
                      }}
                    >
                      <span className="animated-gradient">{letter}</span>
                    </span>
                  ))}
                </span>
              </h1>
              <p
                className={`splash-subtitle white-text-glow ${
                  stage >= 3 ? "splash-subtitle-active" : ""
                }`}
                data-text="Junior Web Development"
              >
                Junior Web Development
              </p>
            </div>

            {/* Enhanced Loading Animation - changed to white text */}
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
                className="splash-loading-text white-text-glow"
                data-text="Loading Experience..."
              >
                Loading Experience...
              </p>
            </div>

            {/* Enhanced Progress Bar */}
            <div
              className={`splash-progress-container ${
                stage >= 1 ? "splash-progress-visible" : ""
              }`}
            >
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;
