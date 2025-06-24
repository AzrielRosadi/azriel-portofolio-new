// src/section/AllProjects.jsx
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import { PinContainer } from "@/components/ui/3d-pin";

gsap.registerPlugin(ScrollTrigger);

const AllProjects = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [filter, setFilter] = useState("all");

  // Data lengkap semua projects
  const allProjects = [
    {
      id: 1,
      title: "Platform top-up game dan layanan sosial media",
      des: "Proyek ini menggunakan tech stack berupa React, TypeScript, TailwindCSS, dan React Query di frontend, Node.js, Express, dan Passport.js di backend, PostgreSQL dengan Drizzle ORM untuk database, serta Vite, Shadcn/UI, dan Framer Motion sebagai tools pendukung.",
      img: "/images/liboyneww.png",
      iconLists: [
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        "https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/tailwindcss-icon.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      ],
      githubLink: "https://github.com/AzrielRosadi/LiboyyStore.ID",
      liveLink: "https://github.com/AzrielRosadi/LiboyyStore.ID",
      category: "web",
      year: 2025,
    },
    {
      id: 2,
      title: "System Laundry berbasis Website",
      des: "Proyek ini merupakan sistem laundry berbasis website yang menggunakan tech stack berupa Blade Template Engine dan TailwindCSS untuk frontend, Laravel 11 (PHP) dengan Laravel Breeze dan Laravel Sanctum untuk backend.",
      img: "/images/MbuuttProject.png",
      iconLists: [
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        "https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/tailwindcss-icon.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
      ],
      githubLink: "https://github.com/AzrielRosadi/Mbuutts-Laundry",
      liveLink: "https://mbuutt-laundry.infinityfreeapp.com/",
      category: "web",
      year: 2025,
    },
    {
      id: 3,
      title: "AI SaaS Platform",
      des: "REAL Software-as-a-Service app with AI features and payments & credits system that you might even turn into a side income or business idea.",
      img: "/images/imaginifynew.png",
      iconLists: [
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        "https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/stripe.svg",
        "https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/cloudinary.svg",
        "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/clerk.svg",
      ],
      githubLink: "https://github.com/AzrielRosadi/AiSaas-Application",
      liveLink: "https://github.com/AzrielRosadi/AiSaas-Application",
      category: "ai",
      year: 2025,
    },
    {
      id: 4,
      title: "Citra Negara Website",
      des: "Platform pencarian film dan serial TV yang comprehensive dengan memanfaatkan database IMDb melalui API integration.",
      img: "/images/cnhome.png",
      iconLists: [
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
      ],
      githubLink: "https://github.com/ashfaa28/BackEnd_WebSekolahPBO-",
      liveLink: "https://github.com/ashfaa28/BackEnd_WebSekolahPBO-",
      category: "web",
      year: 2024,
    },
    {
      id: 5,
      title: "Mechstrom: War Zone",
      des: "Proyek ini merupakan pembuatan game 3D sederhana menggunakan Unity Engine dan bahasa C#, dengan memanfaatkan asset gratis untuk pembelajaran dan pengembangan gameplay dasar.",
      img: "/images/gamesslandscape.png",
      iconLists: [
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
      ],
      githubLink: "https://github.com/username/mechstrom",
      liveLink: "#", // Untuk game yang tidak ada live demo
      category: "game",
      year: 2024,
    },
    {
      id: 6,
      title: "Tools Scraper - GUI Application",
      des: "A GUI-based desktop application specifically designed to automatically and efficiently scrape product data from the Shopee e-commerce platform.",
      img: "/images/scrapperr.png",
      iconLists: [
        "https://icongr.am/devicon/python-original.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
      ],
      githubLink: "https://github.com/AzrielRosadi/toolsscrapershopee",
      liveLink: "https://github.com/AzrielRosadi/toolsscrapershopee",
      category: "desktop",
      year: 2024,
    },
    {
      id: 7,
      title: "Games Pacman",
      des: "Pac-Man is a classic arcade game created by Toru Iwatani of Namco and first released in 1980 in Japan.",
      img: "/images/pacman.png",
      iconLists: [
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
      ],
      githubLink: "https://github.com/AzrielRosadi/Games-Pacman",
      liveLink: "https://github.com/AzrielRosadi/Games-Pacman",
      category: "game",
      year: 2023,
    },
    {
      id: 8,
      title: "Games Tetris",
      des: "Tetris is a puzzle game created by Alexey Pajitnov, a Russian programmer, in 1984 at the Soviet Academy of Sciences.",
      img: "/images/tetris.png",
      iconLists: [
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
      ],
      githubLink: "https://github.com/AzrielRosadi/Games-Tetris2",
      liveLink: "https://github.com/AzrielRosadi/Games-Tetris2",
      category: "game",
      year: 2023,
    },
    {
      id: 9,
      title: "Search Film - IMDb API",
      des: "Platform pencarian film dan serial TV yang comprehensive dengan memanfaatkan database IMDb melalui API integration.",
      img: "/images/film.png",
      iconLists: [
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
      ],
      githubLink: "https://github.com/AzrielRosadi/Search-Filmp",
      liveLink: "https://github.com/AzrielRosadi/Search-Film",
      category: "web",
      year: 2023,
    },
  ];

  const categories = [
    { key: "all", label: "All Projects" },
    { key: "web", label: "Web Development" },
    { key: "desktop", label: "Desktop Apps" },
    { key: "game", label: "Game Development" },
    { key: "ai", label: "AI & Machine Learning" },
  ];

  const filteredProjects =
    filter === "all"
      ? allProjects
      : allProjects.filter((project) => project.category === filter);

  // Reset animations when filter changes
  useEffect(() => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.fromTo(
      ".project-card-animation",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.1,
      }
    );
  }, [filteredProjects]);

  useGSAP(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5 }
      );
    }

    gsap.fromTo(
      ".project-card-animation",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top bottom-=100",
        },
      }
    );
  }, []);

  const handleBackToHome = () => {
    navigate("/");
    setTimeout(() => {
      const workSection = document.getElementById("work");
      if (workSection) {
        workSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  // Function to handle GitHub link click
  const handleGithubClick = (githubLink, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (githubLink && githubLink !== "#") {
      window.open(githubLink, "_blank", "noopener,noreferrer");
    }
  };

  // Function to handle live site link click
  const handleLiveLinkClick = (liveLink, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (liveLink && liveLink !== "#") {
      window.open(liveLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      {/* Container dengan max-width dan center alignment */}
      <div ref={sectionRef} className="container mx-auto max-w-7xl">
        {/* Header dengan spacing yang konsisten */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            All <span className="text-purple">Projects</span>
          </h1>
          <p className="text-white-200 text-base sm:text-lg max-w-2xl mx-auto">
            Explore my complete portfolio of work across different technologies
            and domains
          </p>
        </div>

        {/* Filter Categories dengan spacing yang diperbaiki */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setFilter(category.key)}
                className={`px-4 py-2.5 lg:px-6 lg:py-3 rounded-full font-medium transition-all duration-300 text-sm lg:text-base whitespace-nowrap transform hover:scale-105 ${
                  filter === category.key
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105"
                    : "bg-black-200/80 text-white-200 hover:bg-purple-600/20 hover:text-purple-300 border border-white/[0.1] backdrop-blur-sm"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid dengan layout yang sama seperti ShowcaseSection */}
        <div className="projects-grid mb-20">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {filteredProjects.map((item) => (
              <div
                className="project-card-animation lg:min-h-[35rem] h-[32rem] flex items-center justify-center w-full sm:w-96 max-w-sm"
                key={item.id}
              >
                <PinContainer
                  title="View Project"
                  href={item.liveLink} // ✅ Fixed: Changed from project.liveLink to item.liveLink
                  className="w-full"
                  containerClassName="w-full h-full"
                >
                  <div className="relative w-full">
                    {/* GitHub and Live Link Icons - Same as ShowcaseSection */}
                    <div className="absolute top-2 right-2 z-20 flex gap-2">
                      {/* GitHub Icon */}
                      <button
                        onClick={(e) => handleGithubClick(item.githubLink, e)}
                        className="p-2 bg-black/80 backdrop-blur-sm rounded-full border border-white/[.2] hover:border-purple-500/50 hover:bg-purple-500/20 transition-all duration-200 group"
                        title="View on GitHub"
                      >
                        <svg
                          className="w-4 h-4 text-white group-hover:text-purple-300 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </button>

                      {/* Live Link Icon */}
                      <button
                        onClick={(e) => handleLiveLinkClick(item.liveLink, e)}
                        className="p-2 bg-black/80 backdrop-blur-sm rounded-full border border-white/[.2] hover:border-purple-500/50 hover:bg-purple-500/20 transition-all duration-200 group"
                        title="View Live Site"
                        disabled={item.liveLink === "#"}
                        style={{ opacity: item.liveLink === "#" ? 0.5 : 1 }}
                      >
                        <svg
                          className="w-4 h-4 text-white group-hover:text-purple-300 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Original Card Content - Same structure as ShowcaseSection */}
                    <div
                      className="cursor-pointer"
                      onClick={() => handleProjectClick(item.id)}
                    >
                      {/* Project Image dengan style yang sama seperti ShowcaseSection */}
                      <div className="relative flex items-center justify-center w-full overflow-hidden h-[20vh] lg:h-[30vh] mb-6">
                        <div
                          className="relative w-full h-full overflow-hidden lg:rounded-3xl rounded-2xl"
                          style={{ backgroundColor: "#13162D" }}
                        >
                          <img
                            src="https://via.placeholder.com/400x300/1E293B/64748B?text=Background"
                            alt="bgimg"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <img
                          src={item.img}
                          alt="project preview"
                          className="z-10 absolute inset-0 w-full h-full object-cover rounded-2xl lg:rounded-3xl"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Project+${item.id}`;
                          }}
                        />
                      </div>

                      {/* Project Info dengan padding yang sama */}
                      <div className="px-4">
                        <h1 className="font-bold lg:text-2xl md:text-xl text-lg line-clamp-2 text-white mb-3">
                          {item.title}
                        </h1>

                        <p
                          className="lg:text-base text-sm line-clamp-3 mb-6 leading-relaxed"
                          style={{
                            color: "#BEC1DD",
                          }}
                        >
                          {item.des}
                        </p>

                        {/* Bottom section dengan layout yang sama */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {item.iconLists
                              .slice(0, 4)
                              .map((icon, iconIndex) => (
                                <div
                                  key={iconIndex}
                                  className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center hover:border-purple-500/50 transition-colors duration-200"
                                  style={{
                                    transform: `translateX(-${
                                      5 * iconIndex + 2
                                    }px)`,
                                  }}
                                >
                                  <img
                                    src={icon}
                                    alt={`tech-${iconIndex}`}
                                    className="w-4 h-4 lg:w-5 lg:h-5 object-contain"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                      e.target.parentElement.innerHTML =
                                        '<div class="w-2 h-2 bg-purple-500 rounded-full"></div>';
                                    }}
                                  />
                                </div>
                              ))}
                            {item.iconLists.length > 4 && (
                              <div
                                className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center text-white-200 text-xs"
                                style={{
                                  transform: `translateX(-${5 * 4 + 2}px)`,
                                }}
                              >
                                +{item.iconLists.length - 4}
                              </div>
                            )}
                          </div>

                          {/* View Project Arrow */}
                          <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors duration-200">
                            <span className="text-sm font-medium">View</span>
                            <div className="transform rotate-45 w-3 h-3 border-r-2 border-t-2 border-current group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PinContainer>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl lg:text-8xl mb-6 opacity-50">🚧</div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              No Projects Found
            </h3>
            <p className="text-white-200 text-lg mb-8">
              Try selecting a different category to explore more projects.
            </p>
            <button
              onClick={() => setFilter("all")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Show All Projects
            </button>
          </div>
        )}

        {/* Back to Home Button */}
        <div className="flex justify-center mb-20">
          <button
            onClick={handleBackToHome}
            className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-bold text-white transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
              <div className="transform w-4 h-4 border-l-2 border-b-2 border-current -rotate-45"></div>
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
              Back to Home
            </span>
            <span className="relative invisible">Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
