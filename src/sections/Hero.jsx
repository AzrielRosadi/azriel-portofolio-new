import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
import AbstractSymbol from "../components/AbstractSymbol"; // Import komponen baru
import { words } from "../constants/index";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollVelocity from "../components/ScrollVelocity/ScrollVelocity";
import { color } from "framer-motion";

const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power2.inOut",
      }
    );
  });

  return (
    <section id="hero" className="relative overflow-hidden min-h-screen pt-20">
      <div className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="background" />
      </div>

      <div className="hero-layout">
        {/*LEFT: HERO CONTENT */}
        <header className="flex flex-col justify-center md:w-full w-screen md:px-20 px-5">
          <div className="flex flex-col gap-7 overflow-x-clip">
            <div className="hero-text">
              <h1>
                Membentuk
                <span className="slide">
                  <span className="wrapper">
                    {words.map((word) => (
                      <span
                        key={word.text}
                        className="flex items-center md:gap-3 gap-1 pb-2"
                      >
                        <img
                          src={word.imgPath}
                          alt={word.text}
                          className="xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full bg-white-50"
                        />
                        <span>{word.text}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </h1>
              <h1>menjadi Proyek Nyata</h1>
              <h1>yang Memberikan Hasil</h1>
            </div>
            <p className="text-white-50 md:text-xl relative z-10 pointer-events-none">
              Hi, I am Azriel, a Junior Web Developer from Depok.
            </p>
            <Button
              className="md:w-80 md:h-16 w-60 h-12"
              id="button"
              text="See my Work"
            />
          </div>
          {/* SPACING */}
          <div className="my-10 md:my-16" />

          {/* SCROLL VELOCITY - BALANCED SMOOTH & FAST SETTINGS */}
          <div className="relative w-screen -mx-[50vw] left-1/2 overflow-x-visible overflow-y-visible py-4 mt-10">
            {/* Mobile Symbol - positioned in the center of scroll text */}
            <div className="md:hidden absolute inset-0 flex items-center justify-center z-20">
              <AbstractSymbol isMobile={true} />
            </div>

            <ScrollVelocity
              texts={["FULLSTACK JAVASCRIPT ENGINEER | JUNIOR WEB DEVELOPMENT"]}
              velocity={50}
              damping={40}
              stiffness={500}
              velocityMapping={{ input: [0, 1000], output: [0, 6] }}
              parallaxClassName="relative w-auto overflow-visible"
              scrollerClassName="inline-block whitespace-nowrap text-center"
              scrollerStyle={{
                fontFamily: '"Inter", Arial, Helvetica, sans-serif',
                fontWeight: 700,
                fontSize: "8rem",
                lineHeight: "1.2",
                color: "rgba(245, 245, 245, 0.3)",
              }}
              enableMomentum={true}
              momentumDecay={0.92}
              accelerationFactor={4.0}
              maxMomentumVelocity={300}
              smoothingFactor={0.2}
              easeInOutPower={2}
              naturalDelay={0.01}
              skewDirection="auto"
              maxSkew={25}
              skewSensitivity={0.015}
              maxShift={6}
              shiftSensitivity={0.01}
              skewOrigin="center"
            />
          </div>
        </header>

        {/* RIGHT: ABSTRACT SYMBOL - Desktop only with proper height constraint */}
        <figure className="hidden md:flex items-center justify-center h-[calc(100vh-120px)] max-h-[600px]">
          <div className="hero-3d-layout">
            <AbstractSymbol />
          </div>
        </figure>
      </div>
      <AnimatedCounter />
    </section>
  );
};

export default Hero;
