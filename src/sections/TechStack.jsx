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
  const bootstrapRef = useRef(null);
  const html5Ref = useRef(null);
  const centerRef = useRef(null);
  const css3Ref = useRef(null);
  const nodejsRef = useRef(null);
  const laravelRef = useRef(null);
  const postgresRef = useRef(null);
  const figmaRef = useRef(null);

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
                ? "max-h-[600px] max-w-lg gap-16"
                : "max-h-[600px] max-w-7xl gap-20"
            )}
          >
            {/* Top Row */}
            <div
              className={cn(
                "flex flex-row items-center",
                isMobile ? "justify-between px-4" : "justify-between px-2"
              )}
            >
              <Circle
                ref={reactRef}
                className="bg-blue-50 border-blue-200"
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
                className="bg-cyan-50 border-cyan-200"
                size={isMobile ? "small" : "default"}
              >
                <TechIcons.tailwind />
              </Circle>
              {!isMobile && (
                <>
                  <Circle
                    ref={bootstrapRef}
                    className="bg-purple-50 border-purple-200"
                  >
                    <TechIcons.bootstrap />
                  </Circle>
                  <Circle
                    ref={html5Ref}
                    className="bg-orange-50 border-orange-200"
                  >
                    <TechIcons.html5 />
                  </Circle>
                </>
              )}
            </div>

            {/* Mobile: Additional Top Row with better spacing */}
            {isMobile && (
              <div className="flex flex-row items-center justify-between px-8">
                <Circle
                  ref={bootstrapRef}
                  className="bg-purple-50 border-purple-200"
                  size="small"
                >
                  <TechIcons.bootstrap />
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
                isMobile ? "justify-between px-4" : "justify-between px-2"
              )}
            >
              <Circle
                ref={css3Ref}
                className="bg-blue-50 border-blue-200"
                size={isMobile ? "small" : "default"}
              >
                <TechIcons.css3 />
              </Circle>
              <Circle
                ref={nodejsRef}
                className="bg-green-50 border-green-200"
                size={isMobile ? "small" : "default"}
              >
                <TechIcons.nodejs />
              </Circle>
              <Circle
                ref={laravelRef}
                className="bg-red-50 border-red-200"
                size={isMobile ? "small" : "default"}
              >
                <TechIcons.laravel />
              </Circle>
              {!isMobile && (
                <>
                  <Circle
                    ref={postgresRef}
                    className="bg-blue-50 border-blue-200"
                  >
                    <TechIcons.postgresql />
                  </Circle>
                  <Circle
                    ref={figmaRef}
                    className="bg-purple-50 border-purple-200"
                  >
                    <TechIcons.figma />
                  </Circle>
                </>
              )}
            </div>

            {/* Mobile: Additional Bottom Row with better spacing */}
            {isMobile && (
              <div className="flex flex-row items-center justify-between px-8">
                <Circle
                  ref={postgresRef}
                  className="bg-blue-50 border-blue-200"
                  size="small"
                >
                  <TechIcons.postgresql />
                </Circle>
                <Circle
                  ref={figmaRef}
                  className="bg-purple-50 border-purple-200"
                  size="small"
                >
                  <TechIcons.figma />
                </Circle>
              </div>
            )}
          </div>

          {/* Animated Beams - Adjusted for better spacing */}
          {!isMobile ? (
            <>
              {/* Desktop Beams - Top Row */}
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={reactRef}
                toRef={centerRef}
                curvature={-75}
                endYOffset={-15}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={nextjsRef}
                toRef={centerRef}
                curvature={-35}
                endYOffset={-15}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={tailwindRef}
                toRef={centerRef}
                curvature={0}
                endYOffset={-15}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={bootstrapRef}
                toRef={centerRef}
                curvature={35}
                endYOffset={-15}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={html5Ref}
                toRef={centerRef}
                curvature={75}
                endYOffset={-15}
              />

              {/* Desktop Beams - Bottom Row */}
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={css3Ref}
                toRef={centerRef}
                curvature={-75}
                endYOffset={15}
                reverse
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={nodejsRef}
                toRef={centerRef}
                curvature={-35}
                endYOffset={15}
                reverse
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={laravelRef}
                toRef={centerRef}
                curvature={0}
                endYOffset={15}
                reverse
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={postgresRef}
                toRef={centerRef}
                curvature={35}
                endYOffset={15}
                reverse
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={figmaRef}
                toRef={centerRef}
                curvature={75}
                endYOffset={15}
                reverse
              />
            </>
          ) : (
            <>
              {/* Mobile Beams - Adjusted for better spacing */}
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={reactRef}
                toRef={centerRef}
                curvature={-35}
                endYOffset={-8}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={nextjsRef}
                toRef={centerRef}
                curvature={0}
                endYOffset={-8}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={tailwindRef}
                toRef={centerRef}
                curvature={35}
                endYOffset={-8}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={bootstrapRef}
                toRef={centerRef}
                curvature={-20}
                endYOffset={-5}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={html5Ref}
                toRef={centerRef}
                curvature={20}
                endYOffset={-5}
              />

              <AnimatedBeam
                containerRef={containerRef}
                fromRef={css3Ref}
                toRef={centerRef}
                curvature={-35}
                endYOffset={8}
                reverse
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={nodejsRef}
                toRef={centerRef}
                curvature={0}
                endYOffset={8}
                reverse
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={laravelRef}
                toRef={centerRef}
                curvature={35}
                endYOffset={8}
                reverse
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={postgresRef}
                toRef={centerRef}
                curvature={-20}
                endYOffset={5}
                reverse
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={figmaRef}
                toRef={centerRef}
                curvature={20}
                endYOffset={5}
                reverse
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

// Tech Icons Components
const TechIcons = {
  react: () => (
    <svg
      className="w-8 h-8 text-blue-500"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
    </svg>
  ),
  nextjs: () => (
    <svg
      className="w-8 h-8 text-gray-900"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.5429.0445h-.4570l-.0803-.0516c-.0516-.0336-.0939-.0822-.1213-.1201-.0146-.0212-.0094-1.3157.0188-4.2857l.0375-4.2488.0563-.0687c.0188-.0235.0375-.0469.0562-.0618.0375-.0235.1125-.0235.1687-.0235.0802 0 .1687.0469.2299.1201.0516.0516 2.1203 3.1667 4.6447 6.9374 2.5244 3.7707 4.6447 6.9374 4.6447 6.9374.0188.0235.0375.0469.0562.0618.0375-.0235.1125.0235.1687.0235.0802 0 .1687-.0469.2299-.1201.0516-.0516.0516-.0516.0516-.1201 0-.0469-.0188-.0939-.0516-.1408z" />
    </svg>
  ),
  tailwind: () => (
    <svg
      className="w-8 h-8 text-cyan-500"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
    </svg>
  ),
  bootstrap: () => (
    <svg
      className="w-8 h-8 text-purple-600"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572zm.324 1.206H9.957v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.326-1.663zM24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zM7.746 5.746v12.508h4.569c2.266 0 3.569-.754 3.569-2.754 0-1.204-.648-2.006-1.658-2.754v-.105c.811-.754 1.336-1.754 1.336-2.754 0-2.006-1.303-3.141-3.569-3.141H7.746z" />
    </svg>
  ),
  html5: () => (
    <svg
      className="w-8 h-8 text-orange-600"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" />
    </svg>
  ),
  css3: () => (
    <svg
      className="w-8 h-8 text-blue-600"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" />
    </svg>
  ),
  nodejs: () => (
    <svg
      className="w-8 h-8 text-green-500"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.570,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z" />
    </svg>
  ),
  laravel: () => (
    <svg
      className="w-8 h-8 text-red-500"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 01.023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 01.375 0L9.93 2.247h.002c.015.01.027.021.04.033.012.009.025.018.037.027.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.02.014.032.005.032.01.065.014.098v15.455l4.367-2.52V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 01.023-.058c.008-.013.018-.022.024-.033l.032-.045c.013-.01.025-.018.037-.027.014-.012.027-.024.041-.034H14.93L19.443.05a.375.375 0 01.375 0L24.33 2.247h.002c.015.01.027.021.04.033.012.009.025.018.037.027.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.02.014.032.005.032.01.065.014.098v15.455l4.367-2.52V5.53c0-.135.073-.26.189-.326L23.642 5.43z" />
    </svg>
  ),
  postgresql: () => (
    <svg
      className="w-8 h-8 text-blue-600"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M23.111 5.441c-.777-1.185-2.479-1.635-4.52-1.199-.595.127-1.239.294-1.889.476-.24-.393-.51-.774-.815-1.135C14.538 2.199 12.906 1.55 11.223 1.55c-2.509 0-4.744 1.353-6.304 3.815-.405.639-.739 1.323-1.006 2.032-.267-.138-.544-.264-.831-.378C1.965 6.59.68 6.631.204 7.416c-.476.785-.044 1.962 1.217 3.318.39.419.84.82 1.325 1.195-.485.375-.935.776-1.325 1.195-1.261 1.356-1.693 2.533-1.217 3.318.476.785 1.761.826 2.878.397.287-.114.564-.24.831-.378.267.709.601 1.393 1.006 2.032 1.56 2.462 3.795 3.815 6.304 3.815 1.683 0 3.315-.649 4.664-2.033.305-.361.575-.742.815-1.135.65.182 1.294.349 1.889.476 2.041.436 3.743-.014 4.52-1.199.777-1.185.044-2.962-2.065-5.006-.651-.631-1.378-1.235-2.154-1.795.776-.56 1.503-1.164 2.154-1.795 2.109-2.044 2.842-3.821 2.065-5.006z" />
    </svg>
  ),
  figma: () => (
    <svg
      className="w-8 h-8 text-purple-500"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117v-6.038H8.148zm7.704 0c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49-4.49-2.014-4.49-4.49 2.014-4.49 4.49-4.49zm0 7.509c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019-3.019 1.355-3.019 3.019 1.354 3.019 3.019 3.019zM8.148 24c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49 4.49 2.014 4.49 4.49-2.014 4.49-4.49 4.49zm0-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019 3.019-1.355 3.019-3.019-1.355-3.019-3.019-3.019z" />
    </svg>
  ),
};

export default TechStack;
