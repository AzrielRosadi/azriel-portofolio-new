import { useEffect, useState } from "react";

const ProjectDetailPopup = ({
  isOpen,
  project,
  onClose,
  onGithubClick,
  onLiveLinkClick,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle body scroll when popup opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  // Don't render if not open or no project
  if (!isOpen || !project) return null;

  // Determine which images to show in popup
  const getPopupImages = () => {
    if (project.popupImages && project.popupImages.length > 0) {
      return project.popupImages;
    } else if (project.popupImg) {
      return [project.popupImg];
    } else {
      // Fallback to original image if no popup-specific images
      return [project.img];
    }
  };

  const popupImages = getPopupImages();
  const hasMultipleImages = popupImages.length > 1;

  // Navigate to next image
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === popupImages.length - 1 ? 0 : prev + 1
    );
  };

  // Navigate to previous image
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? popupImages.length - 1 : prev - 1
    );
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      style={{
        padding: "16px",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      {/* Container yang bisa di-scroll */}
      <div className="w-full h-full flex items-start justify-center overflow-y-auto py-4">
        <div
          className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/[.2] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            minHeight: "fit-content",
          }}
        >
          {/* Close Button - Fixed Position */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-3 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/30 transition-all duration-200 group"
            title="Close"
            style={{ position: "sticky" }}
          >
            <svg
              className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content Container */}
          <div className="p-6 space-y-6">
            {/* Project Image Gallery */}
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl group">
              <img
                src={popupImages[currentImageIndex]}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=${encodeURIComponent(
                    project.title
                  )}`;
                }}
              />

              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>

              {/* Navigation arrows for multiple images */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/20 hover:border-purple-500/50 hover:bg-purple-500/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Previous Image"
                  >
                    <svg
                      className="w-5 h-5 text-white"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/20 hover:border-purple-500/50 hover:bg-purple-500/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Next Image"
                  >
                    <svg
                      className="w-5 h-5 text-white"
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
                </>
              )}

              {/* Image counter */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {popupImages.length}
                </div>
              )}

              {/* Image dots indicator */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {popupImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex
                          ? "bg-purple-500 w-6"
                          : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="space-y-6">
              {/* Title and Description */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {project.title}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                  {project.des}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400"
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
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {project.iconLists.map((icon, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black/50 border border-white/[.2] rounded-xl hover:border-purple-500/50 hover:bg-purple-500/20 transition-all duration-200 group"
                    >
                      <img
                        src={icon}
                        alt={`tech-${index}`}
                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain group-hover:scale-110 transition-transform duration-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML =
                            '<div class="w-4 h-4 sm:w-6 sm:h-6 bg-purple-500 rounded-full"></div>';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  onClick={(e) => onGithubClick(project.githubLink, e)}
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-black/70 border border-white/[.2] rounded-xl hover:border-purple-500/50 hover:bg-purple-500/20 transition-all duration-200 text-white text-sm sm:text-base font-medium group"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="hidden sm:inline">
                    View GitHub Repository
                  </span>
                  <span className="sm:hidden">GitHub</span>
                </button>

                <button
                  onClick={(e) => onLiveLinkClick(project.liveLink, e)}
                  className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all duration-200 text-white text-sm sm:text-base font-medium group shadow-lg"
                  disabled={project.liveLink === "#"}
                  style={{ opacity: project.liveLink === "#" ? 0.6 : 1 }}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200"
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
                  <span className="hidden sm:inline">
                    {project.liveLink === "#"
                      ? "No Live Demo"
                      : "View Live Demo"}
                  </span>
                  <span className="sm:hidden">
                    {project.liveLink === "#" ? "No Demo" : "Live Demo"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPopup;
