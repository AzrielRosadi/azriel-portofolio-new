import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
import { words } from "../constants/index";
import { ParallaxText } from "../components/ScrollVelocity/ScrollVelocity";

const Hero = () => {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="hero-layout">
        {/* LEFT: HERO CONTENT */}
        <header className="flex flex-col justify-start md:w-full w-screen md:px-20 px-5 pt-5">
          <div className="flex flex-col gap-7 overflow-x-clip">
            {/* HEADLINE */}
            <div className="hero-text animate-fadeInUp [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              <h1>
                Membentuk
                <span className="slide">
                  <span className="wrapper">
                    {words.map((word, index) => (
                      <span
                        key={word.text}
                        className="flex items-center md:gap-3 gap-1 pb-2"
                        style={{
                          animation: `fadeInUp 0.8s ease-out ${
                            0.4 + index * 0.1
                          }s forwards`,
                          opacity: 0,
                        }}
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
              <h1 className="animate-fadeInUp [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
                Menjadi Proyek Nyata
              </h1>
              <h1 className="animate-fadeInUp [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
                Yang Memberikan Hasil
              </h1>
            </div>

            {/* SUBTEXT */}
            <p className="text-white-50 md:text-xl text-base relative z-10 pointer-events-none animate-fadeInUp [animation-delay:1s] opacity-0 [animation-fill-mode:forwards] transform translate-y-4">
              Hi, I am Azriel, a Junior Web Developer from Depok.
            </p>
            <div className="md:my-0" />

            {/* CTA BUTTON */}
            <Button
              className="md:w-80 md:h-16 w-60 h-12 hover:scale-105 transition-transform duration-300"
              id="button"
              text="See my Work"
            />
          </div>

          {/* PARALLAX TEXT */}
          <div className="relative w-screen -mx-[50vw] left-1/2 overflow-hidden py-4 mt-10 animate-fadeIn [animation-delay:1.4s] opacity-0 [animation-fill-mode:forwards]">
            <div className="flex flex-col gap-4">
              <ParallaxText
                direction={100}
                baseVelocity={-0.2}
                className="tracking-wider md:tracking-[.25em] text-[0.8rem] sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-semibold uppercase"
              >
                JUNIOR&nbsp;&nbsp;&nbsp;WEB&nbsp;&nbsp;&nbsp;DEVELOPMENT&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;FULLSTACK&nbsp;&nbsp;&nbsp;JAVASCRIPT&nbsp;&nbsp;&nbsp;ENGINEER
              </ParallaxText>
            </div>
          </div>
        </header>

        {/* OPTIONAL: 3D or Illustration Section */}
        {/* <figure>
          <div className="hero-3d-layout">
            <Globe />
          </div>
        </figure> */}
      </div>

      {/* COUNTER DECORATION */}
      <div className="animate-fadeInUp [animation-delay:1.6s] opacity-0 [animation-fill-mode:forwards]">
        <AnimatedCounter />
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
