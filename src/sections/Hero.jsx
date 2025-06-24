import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
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
    <section id="hero" className="relative overflow-hidden">
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

          {/* SCROLL VELOCITY */}
          <div className="relative w-screen -mx-[50vw] left-1/2 overflow-x-visible overflow-y-visible py-4 -mt-20">
            <ScrollVelocity
              texts={[
                "FULLSTACK JAVASCRIPT ENGINEER",
                "JUNIOR WEB DEVELOPMENT",
              ]}
              velocity={30}
              parallaxClassName="relative w-auto overflow-visible"
              scrollerClassName="inline-block whitespace-nowrap text-center"
              scrollerStyle={{
                fontFamily: '"Inter", Arial, Helvetica, sans-serif',
                fontWeight: 700,
                fontSize: "4rem",
                lineHeight: "1.2",
                color: "rgba(245, 245, 245, 0.3)",
              }}
              // Momentum & Acceleration (lebih natural)
              enableMomentum={true}
              momentumDecay={0.96} // Sedikit lebih lambat decay
              accelerationFactor={1.8} // Lebih responsive
              maxMomentumVelocity={400} // Batas yang lebih natural
              // Natural Smoothing (BARU!)
              smoothingFactor={0.25} // Transisi lebih halus
              easeInOutPower={4.0} // Easing yang lebih natural
              naturalDelay={0.1} // Slight delay untuk realisme
              // Skew effect (lebih smooth)
              skewDirection="auto"
              maxSkew={20} // Sedikit dikurangi untuk lebih natural
              skewSensitivity={0.015} // Sedikit dikurangi
            />
          </div>
        </header>

        {/* <figure>
          <div className="hero-3d-layout">
            <Globe />
          </div>
        </figure> */}
      </div>

      <AnimatedCounter />
    </section>
  );
};

export default Hero;
