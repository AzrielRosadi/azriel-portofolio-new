import { useState } from "react";

const useProjectPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Function to open popup with project data
  const openPopup = (project, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("Opening popup for project:", project.title); // Debug log
    setSelectedProject(project);
    setIsPopupOpen(true);
  };

  // Function to close popup
  const closePopup = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("Closing popup"); // Debug log
    setIsPopupOpen(false);
    setSelectedProject(null);
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

  return {
    isPopupOpen,
    selectedProject,
    openPopup,
    closePopup,
    handleGithubClick,
    handleLiveLinkClick,
  };
};

export default useProjectPopup;
