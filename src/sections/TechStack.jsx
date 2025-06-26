"use client";

import { forwardRef, useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import TitleHeader from "../components/TitleHeader";

const Circle = forwardRef(({ className, children, size = "default" }, ref) => {
  const sizeClasses = {
    default: "size-16 p-3",
    small: "size-12 p-2",
    large: "size-20 p-4",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex items-center justify-center rounded-full border-2 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

const TechStack = () => {
  const containerRef = useRef(null);
  const reactRef = useRef(null);
  const nextjsRef = useRef(null);
  const tailwindRef = useRef(null);
  const javascriptRef = useRef(null);
  const html5Ref = useRef(null);
  const centerRef = useRef(null);
  const css3Ref = useRef(null);
  const nodejsRef = useRef(null);
  const laravelRef = useRef(null);
  const mysqlRef = useRef(null);
  const typescriptRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section id="skills" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="My Preferred Tech Stack"
          sub="🤝 The Skills I Bring to The Table"
        />

        <div
          className={cn(
            "relative flex w-full items-center justify-center overflow-hidden rounded-lg mt-12",
            isMobile ? "h-[650px] p-8" : "h-[700px] p-16"
          )}
          ref={containerRef}
        >
          <div
            className={cn(
              "flex size-full flex-col items-stretch justify-between",
              isMobile
                ? "max-h-[600px] max-w-lg gap-8"
                : "max-h-[600px] max-w-7xl gap-12"
            )}
          >
            {/* Top Row */}
            <div
              className={cn(
                "flex flex-row items-center",
                isMobile ? "justify-between px-1" : "justify-between px-0"
              )}
            >
              <Circle
                ref={reactRef}
                className="bg-gray-50 border-gray-200"
                size={isMobile ? "small" : "default"}
              >
                <TechIcons.react />
              </Circle>
              <Circle
                ref={nextjsRef}
                className="bg-gray-50 border-gray-200"
                size={isMobile ? "small" : "default"}
              >
                <TechIcons.nextjs />
              </Circle>
              <Circle
                ref={tailwindRef}
                className="bg-gray-50 border-gray-200"
                size={isMobile ? "small" : "default"}
              >
                <TechIcons.tailwind />
              </Circle>
              {!isMobile && (
                <>
                  <Circle
                    ref={javascriptRef}
                    className="bg-gray-50 border-gray-200"
                  >
                    <TechIcons.javascript />
                  </Circle>
                  <Circle ref={html5Ref} className="bg-gray-50 border-gray-200">
                    <TechIcons.html5 />
                  </Circle>
                </>
              )}
            </div>

            {/* Mobile: Additional Top Row with better spacing */}
            {isMobile && (
              <div className="flex flex-row items-center justify-between px-12">
                <Circle
                  ref={javascriptRef}
                  className="bg-gray-50 border-gray-200"
                  size="small"
                >
                  <TechIcons.javascript />
                </Circle>
                <Circle
                  ref={html5Ref}
                  className="bg-orange-50 border-orange-200"
                  size="small"
                >
                  <TechIcons.html5 />
                </Circle>
              </div>
            )}

            {/* Center with more vertical space */}
            <div
              className={cn(
                "flex flex-row items-center justify-center",
                isMobile ? "py-8" : "py-12"
              )}
            >
              <Circle
                ref={centerRef}
                className={cn(
                  "bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200",
                  isMobile ? "size-20" : "size-28"
                )}
              >
                <div
                  className={cn(
                    "font-bold text-purple-600",
                    isMobile ? "text-2xl" : "text-4xl"
                  )}
                >
                  DEV
                </div>
              </Circle>
            </div>

            {/* Bottom Row */}
            <div
              className={cn(
                "flex flex-row items-center",
                isMobile ? "justify-between px-1" : "justify-between px-0"
              )}
            >
              <Circle
                ref={css3Ref}
                className="bg-gray-50 border-gray-200"
                size={isMobile ? "small" : "default"}
              >
                <TechIcons.css3 />
              </Circle>
              <Circle
                ref={nodejsRef}
                className="bg-gray-50 border-gray-200"
                size={isMobile ? "small" : "default"}
              >
                <TechIcons.nodejs />
              </Circle>
              <Circle
                ref={laravelRef}
                className="bg-gray-50 border-gray-200"
                size={isMobile ? "small" : "default"}
              >
                <TechIcons.laravel />
              </Circle>
              {!isMobile && (
                <>
                  <Circle ref={mysqlRef} className="bg-gray-50 border-gray-200">
                    <TechIcons.mysql />
                  </Circle>
                  <Circle
                    ref={typescriptRef}
                    className="bg-gray-50 border-gray-200"
                  >
                    <TechIcons.typescript />
                  </Circle>
                </>
              )}
            </div>

            {/* Mobile: Additional Bottom Row with better spacing */}
            {isMobile && (
              <div className="flex flex-row items-center justify-between px-12">
                <Circle
                  ref={mysqlRef}
                  className="bg-blue-50 border-blue-200"
                  size="small"
                >
                  <TechIcons.mysql />
                </Circle>
                <Circle
                  ref={typescriptRef}
                  className="bg-purple-50 border-purple-200"
                  size="small"
                >
                  <TechIcons.typescript />
                </Circle>
              </div>
            )}
          </div>

          {/* Animated Beams - Adjusted for new positions */}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={reactRef}
            toRef={centerRef}
            curvature={-85}
            endYOffset={-20}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={nextjsRef}
            toRef={centerRef}
            curvature={-45}
            endYOffset={-20}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={tailwindRef}
            toRef={centerRef}
            curvature={0}
            endYOffset={-20}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={javascriptRef}
            toRef={centerRef}
            curvature={45}
            endYOffset={-20}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={html5Ref}
            toRef={centerRef}
            curvature={85}
            endYOffset={-20}
          />

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={css3Ref}
            toRef={centerRef}
            curvature={-85}
            endYOffset={20}
            reverse
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={nodejsRef}
            toRef={centerRef}
            curvature={-45}
            endYOffset={20}
            reverse
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={laravelRef}
            toRef={centerRef}
            curvature={0}
            endYOffset={20}
            reverse
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={mysqlRef}
            toRef={centerRef}
            curvature={45}
            endYOffset={20}
            reverse
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={typescriptRef}
            toRef={centerRef}
            curvature={85}
            endYOffset={20}
            reverse
          />
        </div>
      </div>
    </section>
  );
};

// Tech Icons Components menggunakan SVG dari CDN
const TechIcons = {
  react: () => (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
      alt="React"
      className="w-8 h-8"
    />
  ),
  nextjs: () => (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg"
      alt="Next.js"
      className="w-8 h-8"
    />
  ),
  tailwind: () => (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg"
      alt="Tailwind CSS"
      className="w-8 h-8"
    />
  ),
  javascript: () => (
    <img
      src="https://cdn.simpleicons.org/javascript"
      alt="Javascript"
      className="w-8 h-8"
    />
  ),
  html5: () => (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg"
      alt="HTML5"
      className="w-8 h-8"
    />
  ),
  css3: () => (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg"
      alt="CSS3"
      className="w-8 h-8"
    />
  ),
  nodejs: () => (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg"
      alt="Node.js"
      className="w-8 h-8"
    />
  ),
  laravel: () => (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg"
      alt="Laravel"
      className="w-8 h-8"
    />
  ),
  mysql: () => (
    <img
      src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mysql.svg"
      alt="MySQL"
      className="w-8 h-8"
    />
  ),
  typescript: () => (
    <img
      src="https://logo.svgcdn.com/l/typescript-icon.svg"
      alt="Typescript"
      className="w-8 h-8"
    />
  ),
};

export default TechStack;
