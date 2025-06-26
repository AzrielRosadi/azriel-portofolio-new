import { useState, useEffect } from "react";

import { navLinks } from "../constants";

const NavBar = () => {
  // track if the user has scrolled down the page
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // create an event listener for when the user scrolls
    const handleScroll = () => {
      // check if the user has scrolled down at least 10px
      // if so, set the state to true
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // add the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handler untuk contact button dengan smooth scroll dan lanyard trigger
  const handleContactClick = (e) => {
    e.preventDefault();

    // Scroll smooth ke section contact
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      // Calculate scroll distance for optimal timing
      const targetPosition = contactSection.offsetTop;
      const currentPosition = window.pageYOffset;
      const distance = Math.abs(targetPosition - currentPosition);

      // Estimate scroll duration (max 1 second)
      const scrollDuration = Math.min(distance / 2, 1000);

      // Start smooth scroll
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Trigger lanyard drop at optimal timing (70% of scroll completion)
      setTimeout(() => {
        if (window.triggerLanyardDrop) {
          window.triggerLanyardDrop();
        }
      }, scrollDuration * 0.7);
    }
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <a href="#hero" className="logo">
          Azriel | WebDev
        </a>

        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                <a href={link}>
                  <span>{name}</span>
                  <span className="underline" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Updated contact button dengan smooth scroll dan lanyard trigger */}
        <button
          onClick={handleContactClick}
          className="contact-btn group"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <div className="inner">
            <span>Contact me</span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default NavBar;
