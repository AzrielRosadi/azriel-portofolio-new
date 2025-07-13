import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import { PinContainer } from "@/components/ui/3d-pin";
import ProjectDetailPopup from "@/components/ProjectDetailPopup";
import useProjectPopup from "@/hooks/useProjectPopup";

gsap.registerPlugin(ScrollTrigger);

const ShowcaseSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Menggunakan custom hook untuk popup functionality
  const {
    isPopupOpen,
    selectedProject,
    openPopup,
    closePopup,
    handleGithubClick,
    handleLiveLinkClick,
  } = useProjectPopup();

  // Data projects (hanya menampilkan 3 project terbaru)
  const projects = [
    {
      id: 1,
      title: "Platform top-up game dan layanan sosial media",
      des: "Proyek ini menggunakan tech stack berupa React, TypeScript, TailwindCSS, dan React Query di frontend, Node.js, Express, dan Passport.js di backend, PostgreSQL dengan Drizzle ORM untuk database, serta Vite, Shadcn/UI, dan Framer Motion sebagai tools pendukung.",
      img: "/images/liboyneww.png",
      popupImages: [
        "/images/liboyneww.png",
        "/images/trackingliboy.png",
        "/images/detailliboyy.png",
        "/images/adminliboyy.png",
      ],
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
      popupImages: [
        "/images/MbuuttProject.png",
        "/images/strukmbuutt .png",
        "/images/adminmbuutt.png",
        "/images/editmbuutt.png",
        "/images/ownermbuutt.png",
      ],
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
      title: "DOML | AI Marketing Optimized Reach",
      des: "This website is a prototype landing page for DOML, a marketing platform concept based on Artificial Intelligence (AI). This page is designed to convey DOML's vision, benefits, and potential features to potential users, business partners, or investors.",
      img: "/images/Frame 3.png",
      iconLists: [
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        "https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/tailwindcss-icon.svg",
        "https://lucide.dev/logo.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postcss/postcss-original.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
      ],
      githubLink: "https://github.com/AzrielRosadi/DOML-AZRL",
      liveLink: "https://doml-azrl.vercel.app/",
      category: "web",
      year: 2025,
    },
  ];

  // Function to animate individual card with all its elements
  const animateCard = (cardElement, index = 0) => {
    const image = cardElement.querySelector(".project-image");
    const title = cardElement.querySelector(".project-title");
    const description = cardElement.querySelector(".project-description");
    const icons = cardElement.querySelectorAll(".project-icon");
    const viewBtn = cardElement.querySelector(".project-view-btn");
    const actionBtns = cardElement.querySelectorAll(".project-action-btn");

    // Create timeline for this card
    const tl = gsap.timeline({ delay: index * 0.2 });

    // Animate card container first
    tl.fromTo(
      cardElement,
      { y: 80, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
    );

    // Animate image
    if (image) {
      tl.fromTo(
        image,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
    }

    // Animate title
    if (title) {
      tl.fromTo(
        title,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );
    }

    // Animate description
    if (description) {
      tl.fromTo(
        description,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );
    }

    // Animate icons
    if (icons.length > 0) {
      tl.fromTo(
        icons,
        { x: -20, opacity: 0, scale: 0.8 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      );
    }

    // Animate view button
    if (viewBtn) {
      tl.fromTo(
        viewBtn,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.3"
      );
    }

    // Animate action buttons
    if (actionBtns.length > 0) {
      tl.fromTo(
        actionBtns,
        { y: -10, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      );
    }

    return tl;
  };

  // Reset all card elements to initial state
  const resetCardElements = () => {
    gsap.set(".project-card-animation", {
      y: 80,
      opacity: 0,
      scale: 0.9,
    });
    gsap.set(".project-image", {
      y: 30,
      opacity: 0,
      scale: 0.9,
    });
    gsap.set(".project-title", {
      y: 20,
      opacity: 0,
    });
    gsap.set(".project-description", {
      y: 20,
      opacity: 0,
    });
    gsap.set(".project-icon", {
      x: -20,
      opacity: 0,
      scale: 0.8,
    });
    gsap.set(".project-view-btn", {
      x: 20,
      opacity: 0,
    });
    gsap.set(".project-action-btn", {
      y: -10,
      opacity: 0,
      scale: 0.8,
    });
  };

  // Setup scroll triggers
  const setupScrollTriggers = () => {
    ScrollTrigger.batch(".project-card-animation", {
      onEnter: (elements) => {
        elements.forEach((element, index) => {
          animateCard(element, index);
        });
      },
      onLeave: (elements) => {
        gsap.to(elements, {
          opacity: 0.3,
          scale: 0.95,
          duration: 0.3,
          ease: "power2.out",
        });
      },
      onEnterBack: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      },
      onLeaveBack: (elements) => {
        gsap.to(elements, {
          opacity: 0.3,
          scale: 0.95,
          duration: 0.3,
          ease: "power2.out",
        });
      },
      start: "top 85%",
      end: "bottom 15%",
    });
  };

  // Effect to handle body scroll when popup is open
  useEffect(() => {
    if (isPopupOpen) {
      // Disable body scroll when popup is open
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px"; // Prevent layout shift
    } else {
      // Re-enable body scroll when popup is closed
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isPopupOpen]);

  // Initial setup
  useGSAP(() => {
    // Animate section container
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }

    // Initially hide all card elements
    resetCardElements();

    // Setup scroll triggers after a short delay
    setTimeout(() => {
      setupScrollTriggers();
      setHasInitialLoad(true);
    }, 200);

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleShowAllProjects = () => {
    navigate("/projects");

    // Scroll ke atas setelah navigasi
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  };

  // Function to handle card click (redirect to GitHub or live link)
  const handleCardClick = (project, e) => {
    e.stopPropagation(); // Prevent PinContainer onClick
    // Priority: live link first, then GitHub
    const targetLink =
      project.liveLink !== "#" ? project.liveLink : project.githubLink;
    if (targetLink && targetLink !== "#") {
      window.open(targetLink, "_blank", "noopener,noreferrer");
    }
  };

  // Handle popup open with proper event handling
  const handlePopupOpen = (project, e) => {
    e.preventDefault();
    e.stopPropagation();
    openPopup(project, e);
  };

  return (
    <div id="work" ref={sectionRef} className="py-20 relative">
      <div className="flex flex-wrap items-center justify-center p-4 gap-8 lg:gap-16 mt-10">
        {projects.map((item, index) => (
          <div
            className="project-card-animation lg:min-h-[35rem] h-[32rem] flex items-center justify-center w-full sm:w-96 max-w-sm"
            key={item.id}
          >
            <PinContainer
              title="Detail Project"
              onClick={(e) => handlePopupOpen(item, e)}
              className="w-full cursor-pointer"
              containerClassName="w-full h-full"
            >
              <div className="relative w-full">
                {/* GitHub and Live Link Icons */}
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                  {/* GitHub Icon */}
                  <button
                    onClick={(e) => handleGithubClick(item.githubLink, e)}
                    className="project-action-btn p-2 bg-black/80 backdrop-blur-sm rounded-full border border-white/[.2] hover:border-purple-500/50 hover:bg-purple-500/20 transition-all duration-200 group"
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
                    className="project-action-btn p-2 bg-black/80 backdrop-blur-sm rounded-full border border-white/[.2] hover:border-purple-500/50 hover:bg-purple-500/20 transition-all duration-200 group"
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
                  onClick={(e) => handleCardClick(item, e)}
                >
                  <div className="project-image relative flex items-center justify-center w-full overflow-hidden h-[20vh] lg:h-[30vh] mb-6">
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
                    <h1 className="project-title font-bold lg:text-2xl md:text-xl text-lg line-clamp-2 text-white mb-3">
                      {item.title}
                    </h1>

                    <p
                      className="project-description lg:text-base text-sm line-clamp-3 mb-6 leading-relaxed"
                      style={{
                        color: "#BEC1DD",
                      }}
                    >
                      {item.des}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        {item.iconLists.slice(0, 4).map((icon, iconIndex) => (
                          <div
                            key={iconIndex}
                            className="project-icon border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center hover:border-purple-500/50 transition-colors duration-200"
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
                            className="project-icon border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center text-white-200 text-xs"
                            style={{ transform: `translateX(-${5 * 4 + 2}px)` }}
                          >
                            +{item.iconLists.length - 4}
                          </div>
                        )}
                      </div>

                      {/* View Project Arrow */}
                      <div className="project-view-btn flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors duration-200">
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

      {/* Project Detail Popup menggunakan komponen terpisah dengan Portal */}
      <ProjectDetailPopup
        isOpen={isPopupOpen}
        project={selectedProject}
        onClose={closePopup}
        onGithubClick={handleGithubClick}
        onLiveLinkClick={handleLiveLinkClick}
      />
    </div>
  );
};

export default ShowcaseSection;
