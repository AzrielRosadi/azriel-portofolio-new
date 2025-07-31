import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import { PinContainer } from "@/components/ui/3d-pin";
import ProjectDetailPopup from "@/components/ProjectDetailPopup";
import useProjectPopup from "@/hooks/useProjectPopup";

gsap.registerPlugin(ScrollTrigger);

const AllProjects = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [filter, setFilter] = useState("all");
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Use the popup hook
  const {
    isPopupOpen,
    selectedProject,
    openPopup,
    closePopup,
    handleGithubClick,
    handleLiveLinkClick,
  } = useProjectPopup();

  // Data lengkap semua projects
  const allProjects = [
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
    {
      id: 4,
      title: "Imaginify | AI SaaS Platform",
      des: "REAL Software-as-a-Service app with AI features and payments & credits system that you might even turn into a side income or business idea. (PROGRESS)",
      img: "/images/imaginifynew.png",
      popupImages: ["/images/imaginifynew.png"],
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
      id: 5,
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
      id: 6,
      title: "Mechstrom: War Zone",
      des: "Proyek ini merupakan pembuatan game 3D sederhana menggunakan Unity Engine dan bahasa C#, dengan memanfaatkan asset gratis untuk pembelajaran dan pengembangan gameplay dasar.",
      img: "/images/gamesslandscape.png",
      popupImages: [
        "/images/Game.png",
        "/images/Game1.png",
        "/images/Game2.png",
        "/images/Game3.png",
        "/images/Game4.png",
        "/images/Game5.png",
      ],
      iconLists: [
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
        "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg",
      ],
      githubLink: "#",
      liveLink: "#", // Untuk game yang tidak ada live demo
      category: "game",
      year: 2024,
    },
    {
      id: 7,
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
      id: 8,
      title: "Games Pacman - Classic Arcade",
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
      id: 9,
      title: "Games Tetris - Classic Puzzle",
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
      id: 10,
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

  const filteredProjects =
    filter === "all"
      ? allProjects
      : allProjects.filter((project) => project.category === filter);

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

  // Handle filter changes
  useEffect(() => {
    if (!hasInitialLoad) return;

    // Kill existing triggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Reset all elements
    resetCardElements();

    // Small delay to ensure DOM updates
    setTimeout(() => {
      setupScrollTriggers();
    }, 100);
  }, [filteredProjects, hasInitialLoad]);

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

  // Improved handleBackToHome function that works with hash navigation
  const handleBackToHome = () => {
    // Check if we're already on the home page
    if (window.location.pathname === "/") {
      // If already on home page, just scroll to work section
      const workSection = document.getElementById("work");
      if (workSection) {
        workSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      return;
    }

    // Navigate to home page first
    navigate("/");

    // Wait for navigation and DOM to be ready
    const scrollToWork = () => {
      const workSection = document.getElementById("work");
      if (workSection) {
        workSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return true;
      }
      return false;
    };

    // Try scrolling with multiple attempts
    const maxAttempts = 5;
    let attempts = 0;

    const tryScroll = () => {
      attempts++;
      if (scrollToWork()) {
        console.log(
          `Successfully scrolled to work section on attempt ${attempts}`
        );
      } else if (attempts < maxAttempts) {
        setTimeout(tryScroll, 200 * attempts); // Increasing delay
      } else {
        console.warn(
          "Failed to scroll to work section after multiple attempts"
        );
      }
    };

    // Start trying after initial delay
    setTimeout(tryScroll, 300);
  };

  // Alternative solution using window.location (more reliable for hash navigation)
  const handleBackToHomeAlternative = () => {
    // Use window.location for direct hash navigation
    window.location.href = "/#work";

    // Optional: Add smooth scroll behavior after page load
    setTimeout(() => {
      const workSection = document.getElementById("work");
      if (workSection) {
        workSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // Most robust solution - works with both scenarios
  const handleBackToHomeRobust = () => {
    const currentPath = window.location.pathname;

    if (currentPath === "/") {
      // Already on home page, just scroll
      const workSection = document.getElementById("work");
      if (workSection) {
        workSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      // Navigate to home page
      navigate("/");

      // Create a promise-based approach for better control
      const waitForElement = (selector, timeout = 3000) => {
        return new Promise((resolve, reject) => {
          const startTime = Date.now();

          const checkElement = () => {
            const element = document.getElementById(selector);
            if (element) {
              resolve(element);
            } else if (Date.now() - startTime > timeout) {
              reject(
                new Error(`Element ${selector} not found within ${timeout}ms`)
              );
            } else {
              setTimeout(checkElement, 100);
            }
          };

          checkElement();
        });
      };

      // Wait for navigation to complete and element to be available
      setTimeout(() => {
        waitForElement("work")
          .then((element) => {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          })
          .catch((error) => {
            console.warn("Could not scroll to work section:", error);
          });
      }, 200);
    }
  };

  // Simple and clean solution (recommended)
  const handleBackToHomeSimple = () => {
    navigate("/");

    // Multiple attempts with exponential backoff
    const delays = [300, 600, 1000];

    delays.forEach((delay) => {
      setTimeout(() => {
        const workSection = document.getElementById("work");
        if (workSection) {
          workSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, delay);
    });
  };

  // Function untuk handle project click
  const handleProjectClick = (project, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("Project clicked:", project.title);

    if (project.liveLink && project.liveLink !== "#") {
      window.open(project.liveLink, "_blank", "noopener,noreferrer");
    } else {
      openPopup(project);
    }
  };

  // Function untuk handle card GitHub click
  const handleCardGithubClick = (githubLink, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (githubLink && githubLink !== "#") {
      window.open(githubLink, "_blank", "noopener,noreferrer");
    }
  };

  // Function untuk handle card Live Link click
  const handleCardLiveLinkClick = (liveLink, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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
            All{" "}
            <span className="text-transparent bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text">
              Projects
            </span>
          </h1>
          <p className="text-white-200 text-base sm:text-lg max-w-2xl mx-auto">
            Explore my complete portfolio of work across different technologies
            and domains
          </p>
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
                  title="Detail Project"
                  onClick={(e) => openPopup(item, e)}
                  className="w-full"
                  containerClassName="w-full h-full"
                >
                  <div className="relative w-full">
                    {/* GitHub and Live Link Icons */}
                    <div className="absolute top-2 right-2 z-20 flex gap-2">
                      {/* GitHub Icon */}
                      <button
                        onClick={(e) =>
                          handleCardGithubClick(item.githubLink, e)
                        }
                        className="project-action-btn p-2 bg-black/80 backdrop-blur-sm rounded-full border border-white/[.2] hover:border-gray-400/60 hover:bg-gray-500/20 transition-all duration-200 group"
                        title="View on GitHub"
                      >
                        <svg
                          className="w-4 h-4 text-white group-hover:text-gray-200 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </button>

                      {/* Live Link Icon */}
                      <button
                        onClick={(e) =>
                          handleCardLiveLinkClick(item.liveLink, e)
                        }
                        className="project-action-btn p-2 bg-black/80 backdrop-blur-sm rounded-full border border-white/[.2] hover:border-gray-400/60 hover:bg-gray-500/20 transition-all duration-200 group"
                        title="View Live Site"
                        disabled={item.liveLink === "#"}
                        style={{ opacity: item.liveLink === "#" ? 0.5 : 1 }}
                      >
                        <svg
                          className="w-4 h-4 text-white group-hover:text-gray-200 transition-colors"
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

                    {/* Project Content */}
                    <div
                      className="cursor-pointer select-none"
                      onClick={(e) => handleProjectClick(item, e)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleProjectClick(item, e);
                        }
                      }}
                    >
                      {/* Project Image */}
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
                            e.target.src = `https://via.placeholder.com/400x300/9CA3AF/FFFFFF?text=Project+${item.id}`;
                          }}
                        />
                      </div>

                      {/* Project Info */}
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

                        {/* Bottom section */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            {item.iconLists
                              .slice(0, 4)
                              .map((icon, iconIndex) => (
                                <div
                                  key={iconIndex}
                                  className="project-icon border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center hover:border-gray-400/60 transition-colors duration-200"
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
                                        '<div class="w-2 h-2 bg-gray-400 rounded-full"></div>';
                                    }}
                                  />
                                </div>
                              ))}
                            {item.iconLists.length > 4 && (
                              <div
                                className="project-icon border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center text-white-200 text-xs"
                                style={{
                                  transform: `translateX(-${5 * 4 + 2}px)`,
                                }}
                              >
                                +{item.iconLists.length - 4}
                              </div>
                            )}
                          </div>

                          {/* View Project Arrow */}
                          <div className="project-view-btn flex items-center gap-2 text-gray-300 group-hover:text-gray-100 transition-colors duration-200">
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
              className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-6 py-3 rounded-lg transition-all duration-200"
            >
              Show All Projects
            </button>
          </div>
        )}
        {/* Back to Home Button */}
        <div className="flex justify-center mb-20">
          <button
            onClick={handleBackToHome}
            className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-bold text-white transition duration-300 ease-out border-2 border-gray-400 rounded-full shadow-md bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-gray-500 to-slate-600 group-hover:translate-x-0 ease">
              <div className="transform w-4 h-4 border-l-2 border-b-2 border-current -rotate-45"></div>
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
              Back to Home
            </span>
            <span className="relative invisible">Back to Home</span>
          </button>
        </div>
      </div>

      {/* Project Detail Popup */}
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

export default AllProjects;
