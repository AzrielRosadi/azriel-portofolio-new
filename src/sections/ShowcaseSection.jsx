// src/section/ShowcaseSection.jsx
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import { PinContainer } from "@/components/ui/3d-pin";

gsap.registerPlugin(ScrollTrigger);

const ShowcaseSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const project1 = useRef(null);
  const project2 = useRef(null);
  const project3 = useRef(null);

  // Data projects (hanya menampilkan 3 project terbaru)
  const projects = [
    {
      id: 1,
      title: "Game top-up platform and social media services",
      des: "Complete solution for top up your favorite games and boost social media with fast, safe, and reliable process. Get diamonds, coins, followers, and likes at the best price!",
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
    },
    {
      id: 2,
      title: "Website Based Laundry System",
      des: "Laundry Made Easy, Life Made Practical - Online booking, pick-up and delivery, real-time tracking",
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
  ];

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
      if (card) {
        // Check if ref exists
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
      }
    });
  }, []);

  const handleShowAllProjects = () => {
    navigate("/projects");
  };

  // Function to handle project click
  const handleProjectClick = (projectId) => {
    // Navigate to project detail page (optional)
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
    <div id="work" ref={sectionRef} className="py-20">
      <div className="flex flex-wrap items-center justify-center p-4 gap-8 lg:gap-16 mt-10">
        {projects.map((item, index) => (
          <div
            className="lg:min-h-[35rem] h-[32rem] flex items-center justify-center w-full sm:w-96 max-w-sm"
            key={item.id}
            ref={index === 0 ? project1 : index === 1 ? project2 : project3}
          >
            <PinContainer
              title="View Project"
              href={item.liveLink}
              className="w-full"
              containerClassName="w-full h-full"
            >
              <div className="relative w-full">
                {/* GitHub and Live Link Icons */}
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

                {/* Original Card Content */}
                <div
                  className="cursor-pointer"
                  onClick={() => handleProjectClick(item.id)}
                >
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {item.iconLists.slice(0, 4).map((icon, iconIndex) => (
                          <div
                            key={iconIndex}
                            className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center hover:border-purple-500/50 transition-colors duration-200"
                            style={{
                              transform: `translateX(-${5 * iconIndex + 2}px)`,
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
                            style={{ transform: `translateX(-${5 * 4 + 2}px)` }}
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

      {/* Show All Projects Button */}
      <div className="flex justify-center mt-16">
        <button
          onClick={handleShowAllProjects}
          className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              ></path>
            </svg>
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
            Load More
          </span>
          <span className="relative invisible">Load More</span>
        </button>
      </div>
    </div>
  );
};

export default ShowcaseSection;
