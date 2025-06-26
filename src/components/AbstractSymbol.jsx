import React, { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const AbstractSymbol = ({ isMobile = false }) => {
  const containerRef = useRef(null);
  const linesRef = useRef([]);
  const particlesRef = useRef([]);

  useGSAP(() => {
    const lines = linesRef.current;
    const particles = particlesRef.current;

    // Timeline untuk animasi pembentukan yang berulang
    const drawTimeline = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    // Reset semua elemen
    drawTimeline.set(lines, {
      strokeDasharray: "2000",
      strokeDashoffset: "2000",
      opacity: 0,
    });

    // Animasi pembentukan garis A secara berurutan
    drawTimeline
      .to(linesRef.current[0], {
        // Garis kiri A
        strokeDashoffset: "0",
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      })
      .to(
        linesRef.current[1],
        {
          // Garis kanan A
          strokeDashoffset: "0",
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        "-=0.6"
      )
      .to(
        linesRef.current[2],
        {
          // Garis tengah A
          strokeDashoffset: "0",
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        [linesRef.current[3], linesRef.current[4], linesRef.current[5]],
        {
          // Elemen dekoratif
          strokeDashoffset: "0",
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to({}, { duration: 3 }); // Pause sebelum repeat

    // Animasi partikel yang lebih dinamis
    particles.forEach((particle, i) => {
      gsap.to(particle, {
        y: -30,
        x: gsap.utils.random(-20, 20),
        opacity: 0,
        duration: gsap.utils.random(2, 4),
        repeat: -1,
        delay: i * 0.3,
        ease: "power1.out",
        onComplete: () => {
          gsap.set(particle, { y: 0, x: 0, opacity: 1 });
        },
      });
    });

    // Efek glow yang berkedip
    gsap.to(lines, {
      filter:
        "drop-shadow(0 0 30px rgba(147, 51, 234, 0.9)) drop-shadow(0 0 60px rgba(147, 51, 234, 0.5))",
      duration: 1.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.1,
    });
  }, []);

  const size = isMobile ? 350 : 500;

  return (
    <div
      className={`flex items-center justify-center h-full w-full ${
        isMobile ? "absolute inset-0 z-0" : ""
      }`}
    >
      <div
        ref={containerRef}
        className="relative"
        style={{ transformOrigin: "center center" }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 400 400"
          className="drop-shadow-2xl"
        >
          {/* Garis kiri A */}
          <line
            ref={(el) => (linesRef.current[0] = el)}
            x1="200"
            y1="80"
            x2="120"
            y2="320"
            stroke="url(#purpleGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Garis kanan A */}
          <line
            ref={(el) => (linesRef.current[1] = el)}
            x1="200"
            y1="80"
            x2="280"
            y2="320"
            stroke="url(#purpleGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Garis tengah A */}
          <line
            ref={(el) => (linesRef.current[2] = el)}
            x1="160"
            y1="200"
            x2="240"
            y2="200"
            stroke="url(#purpleGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Elemen dekoratif 1 */}
          <path
            ref={(el) => (linesRef.current[3] = el)}
            d="M140 160 Q200 120 260 160"
            fill="none"
            stroke="url(#purpleGradient2)"
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Elemen dekoratif 2 */}
          <circle
            ref={(el) => (linesRef.current[4] = el)}
            cx="200"
            cy="80"
            r="12"
            fill="none"
            stroke="url(#purpleGradient2)"
            strokeWidth="4"
            className="transition-all duration-300"
          />

          {/* Elemen dekoratif 3 */}
          <path
            ref={(el) => (linesRef.current[5] = el)}
            d="M100 300 L140 280 M300 300 L260 280"
            stroke="url(#purpleGradient3)"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient
              id="purpleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>

            <linearGradient
              id="purpleGradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>

            <radialGradient id="purpleGradient3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DDD6FE" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </radialGradient>
          </defs>
        </svg>

        {/* Partikel animasi yang lebih banyak */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              ref={(el) => (particlesRef.current[i] = el)}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              style={{
                top: `${20 + ((i * 8) % 60)}%`,
                left: `${15 + ((i * 12) % 70)}%`,
              }}
            />
          ))}
        </div>

        {/* Ring effects */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-purple-500/20 rounded-full animate-ping"
              style={{
                width: `${(i + 1) * 100}px`,
                height: `${(i + 1) * 100}px`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: "3s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AbstractSymbol;
