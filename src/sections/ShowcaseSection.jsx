import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const project1 = useRef(null);
  const project2 = useRef(null);
  const project3 = useRef(null);

  useGSAP(() => {
    // Animation for the main section
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    // Animations for each app showcase
    const cards = [project1.current, project2.current, project3.current];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, []);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          <div ref={project1} className="first-project-wrapper">
            <div className="image-wrapper">
              <img
                src="/images/liboyyy.png"
                alt="Top Up Games and Social Media"
              />
            </div>
            <div className="text-content">
              <h2>Platform top-up game dan layanan sosial media</h2>
              <p className="text-white-50 md:text-xl">
                Proyek ini menggunakan tech stack berupa React, TypeScript,
                TailwindCSS, dan React Query di frontend, Node.js, Express, dan
                Passport.js di backend, PostgreSQL dengan Drizzle ORM untuk
                database, serta Vite, Shadcn/UI, dan Framer Motion sebagai tools
                pendukung, yang dirancang untuk layanan top up games dan layanan
                social media.
              </p>
            </div>
          </div>

          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={project2}>
              <div className="image-wrapper bg-[#e8e6e3]">
                <img
                  src="/images/MbuuttProject.png"
                  alt="System Laundry berbasis Website"
                />
              </div>
              <h2>System Laundry berbasis Website</h2> <br />
              <p className="text-white-50 md:text-xl">
                Proyek ini merupakan sistem laundry berbasis website yang
                menggunakan tech stack berupa Blade Template Engine dan
                TailwindCSS untuk frontend, Laravel 11 (PHP) dengan Laravel
                Breeze dan Laravel Sanctum untuk backend, MySQL sebagai
                database, serta Vite sebagai tool pendukung.
              </p>
            </div>

            <div className="project" ref={project3}>
              <div className="image-wrapper bg-[#4f4f4f54]">
                <img src="/images/gamesslandscape.png" alt="Games 3D" />
              </div>
              <h2>Mechstrom: War Zone</h2> <br />
              <p className="text-white-50 md:text-xl">
                Proyek ini merupakan pembuatan game 3D sederhana menggunakan
                Unity Engine dan bahasa C#, dengan memanfaatkan asset gratis
                untuk pembelajaran dan pengembangan gameplay dasar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
