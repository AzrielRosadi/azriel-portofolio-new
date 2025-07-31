import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

// Star Background
const StarBackground = () => {
  const ref = useRef();
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3);
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

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#8b5cf6"
          size={0.003}
          sizeAttenuation
          depthWrite={false}
          opacity={0.9}
        />
      </Points>
    </group>
  );
};

const SplashStarsCanvas = () => (
  <Canvas
    camera={{ position: [0, 0, 1] }}
    style={{
      position: "absolute",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    }}
  >
    <Suspense fallback={null}>
      <StarBackground />
    </Suspense>
  </Canvas>
);

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState("initial");
  const [cutProgress, setCutProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => setPhase("fade-in"), 100);
    const fadeTimer = setTimeout(() => setPhase("cutting"), 3500);
    return () => clearTimeout(fadeTimer);
  }, [onComplete]);

  useEffect(() => {
    let animationFrame;
    if (phase === "cutting") {
      let progress = 0;
      const animate = () => {
        progress += 1.5;
        setCutProgress(progress);
        if (progress >= 100) {
          setTimeout(() => setPhase("split"), 300);
        } else {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      animationFrame = requestAnimationFrame(animate);
    }
    if (phase === "split") {
      setTimeout(() => {
        setPhase("done");
        onComplete?.();
      }, 1300);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  return (
    <>
      <style jsx>{`
        .splash-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 9999;
          overflow: hidden;
          background: black;
        }

        .half {
          position: absolute;
          width: 100%;
          height: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          transition: transform 1s ease-in-out;
        }

        .top {
          top: 0;
          align-items: flex-end;
          transform: ${phase === "split"
            ? "translateY(-100%)"
            : "translateY(0)"};
        }

        .bottom {
          bottom: 0;
          align-items: flex-start;
          transform: ${phase === "split"
            ? "translateY(100%)"
            : "translateY(0)"};
        }

        .background-stars {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .text-line {
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: bold;
          background: linear-gradient(135deg, #ffffff, #d1d5db, #9ca3af);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 0.15em;
          pointer-events: none;
          z-index: 2;
          padding: 0 1rem;
          position: relative;
          overflow: visible;

          /* Animasi masuk + transisi */
          opacity: ${phase === "initial" ? 0 : phase === "split" ? 0 : 1};
          transform: ${phase === "initial"
            ? "translateY(30px)"
            : phase === "split"
            ? "scale(0.8)"
            : "translateY(0)"};
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);

          /* GLOW LEMBUT per huruf */
          text-shadow: 0 0 4px rgba(255, 255, 255, 0.4),
            0 0 8px rgba(255, 255, 255, 0.2), 0 0 12px rgba(255, 255, 255, 0.1);
        }

        /* ANIMASI MASUK */
        .text-line.azriel {
          animation: ${phase === "fade-in" || phase === "cutting"
              ? "slideInLeft"
              : "none"}
            1.2s ease-out forwards;
        }

        .text-line.webdev {
          animation: ${phase === "fade-in" || phase === "cutting"
              ? "slideInRight"
              : "none"}
            1.2s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
          transform: scaleX(-1);
        }

        .text-container-left {
          display: flex;
          justify-content: flex-start;
          width: 100%;
          padding-left: 5%;
        }

        .text-container-right {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          padding-right: 5%;
        }

        .cut-line {
          position: absolute;
          top: 50%;
          left: 0;
          height: 4px;
          width: ${cutProgress}%;
          background: linear-gradient(
            90deg,
            transparent,
            #00f0ff,
            #fff,
            #00f0ff,
            transparent
          );
          transform: translateY(-50%);
          box-shadow: 0 0 10px #00f0ff, 0 0 30px #00f0ff;
          filter: blur(0.5px);
          z-index: 3;
          will-change: width;
        }

        .glowing-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.05) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 1;
        }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-100px) scale(0.8);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(100px) scale(0.8) scaleX(-1);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1) scaleX(-1);
            filter: blur(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes glowPulse {
          0% {
            text-shadow: 0 0 6px rgba(255, 255, 255, 0.3),
              0 0 10px rgba(255, 255, 255, 0.2),
              0 0 20px rgba(255, 255, 255, 0.1);
          }
          50% {
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.4),
              0 0 12px rgba(255, 255, 255, 0.3),
              0 0 25px rgba(255, 255, 255, 0.15);
          }
          100% {
            text-shadow: 0 0 6px rgba(255, 255, 255, 0.3),
              0 0 10px rgba(255, 255, 255, 0.2),
              0 0 20px rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>

      <div className="splash-container">
        {/* ATAS - AZRIEL (KIRI) */}
        <div className="half top">
          <div className="background-stars">
            <SplashStarsCanvas />
          </div>
          <div className="glowing-effect"></div>
          <div className="text-container-left">
            <div className="text-line azriel">AZRIEL</div>
          </div>
        </div>

        {/* BAWAH - WEBDEV (KANAN) */}
        <div className="half bottom">
          <div className="background-stars">
            <SplashStarsCanvas />
          </div>
          <div className="glowing-effect"></div>
          <div className="text-container-right">
            <div className="text-line webdev">WEBDEV</div>
          </div>
        </div>

        {/* GARIS CUT */}
        {phase === "cutting" && <div className="cut-line" />}
      </div>
    </>
  );
};

export default SplashScreen;
