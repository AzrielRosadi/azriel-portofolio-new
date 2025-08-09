import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ProjectDetailPopup = ({
  isOpen,
  project,
  onClose,
  onGithubClick,
  onLiveLinkClick,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle escape key separately
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  // Handle body scroll lock with better implementation
  useEffect(() => {
    if (isOpen) {
      // Store original styles
      const originalBodyStyle = window.getComputedStyle(document.body);
      const originalOverflow = originalBodyStyle.overflow;

      // Lock body scroll
      document.body.style.overflow = "hidden";

      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  if (!isOpen || !project) return null;

  // Get popup images
  const getPopupImages = () => {
    if (project.popupImages && project.popupImages.length > 0) {
      return project.popupImages;
    } else if (project.popupImg) {
      return [project.popupImg];
    } else {
      return [project.img];
    }
  };

  const popupImages = getPopupImages();
  const hasMultipleImages = popupImages.length > 1;

  // Image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === popupImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? popupImages.length - 1 : prev - 1
    );
  };

  // Handle clicks
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const popupContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={handleBackdropClick}
    >
      {/* Custom CSS for scrollbar */}
      <style jsx>{`
        .custom-scrollbar {
          /* Firefox */
          scrollbar-width: auto;
          scrollbar-color: #9ca3af #f3f4f6;
        }

        /* Webkit browsers (Chrome, Safari, Edge) */
        .custom-scrollbar::-webkit-scrollbar {
          width: 18px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to right, #ffffff, #f9fafb, #f3f4f6);
          border-radius: 12px;
          margin: 4px;
          box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, #e5e7eb, #d1d5db, #9ca3af);
          border-radius: 12px;
          border: 3px solid #ffffff;
          min-height: 40px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to right, #d1d5db, #9ca3af, #6b7280);
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(to right, #9ca3af, #6b7280, #4b5563);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f3f4f6;
        }
      `}</style>

      {/* Modal Container */}
      <div
        className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-black rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl"
        style={{ maxHeight: "90vh", height: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 p-3 bg-red-500 hover:bg-red-600 rounded-full border-2 border-white shadow-lg transition-colors"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div
          className="custom-scrollbar h-full p-6"
          style={{
            overflow: "auto",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch", // For iOS safari smooth scrolling
          }}
          onWheel={(e) => {
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
          }}
          onScroll={(e) => {
            e.stopPropagation();
          }}
        >
          {/* Project Image */}
          <div className="relative mb-6 rounded-xl overflow-hidden group">
            <div className="aspect-video bg-gray-800/50">
              <img
                src={popupImages[currentImageIndex]}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/800x450/8B5CF6/FFFFFF?text=${encodeURIComponent(
                    project.title
                  )}`;
                }}
              />
            </div>

            {/* Image Navigation */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/70 hover:bg-black/90 rounded-full border border-white/30 transition-all"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/70 hover:bg-black/90 rounded-full border border-white/30 transition-all"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {popupImages.length}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {popupImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-purple-500 w-4"
                          : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Project Details */}
          <div className="space-y-6">
            {/* Title and Description */}
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white">{project.title}</h2>
              <p className="text-gray-300 text-base leading-relaxed">
                {project.des}
              </p>
            </div>

            {/* Tech Stack */}
            {project.iconLists && project.iconLists.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  Tech Stack
                </h3>
                <div className="grid grid-cols-8 gap-3">
                  {project.iconLists.map((icon, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center w-14 h-14 bg-black/50 border border-white/20 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/20 transition-all group"
                    >
                      <img
                        src={icon}
                        alt={`tech-${index}`}
                        className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML =
                            '<div class="w-4 h-4 bg-purple-500 rounded-full"></div>';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {project.githubLink && (
                <button
                  onClick={(e) => onGithubClick(project.githubLink, e)}
                  className="flex items-center gap-2 px-6 py-3 bg-black/70 border border-white/20 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/20 transition-all text-white font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              )}

              {project.liveLink && (
                <button
                  onClick={(e) => onLiveLinkClick(project.liveLink, e)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all text-white font-medium shadow-lg disabled:opacity-60"
                  disabled={project.liveLink === "#"}
                >
                  <svg
                    className="w-4 h-4"
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
                  {project.liveLink === "#" ? "No Demo" : "Live Demo"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(popupContent, document.body);
};

export default ProjectDetailPopup;
