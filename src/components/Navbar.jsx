// NavBar.jsx - Versi sederhana dan aman
import { useState, useEffect } from "react";
import { navLinks } from "../constants";

const NavBar = ({ scrollTo }) => {
  // track if the user has scrolled down the page
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // create an event listener for when the user scrolls
    const handleScroll = () => {
      // check if the user has scrolled down at least 10px
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // add the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handler untuk navigation dengan smooth scroll
  const handleNavClick = (e, link) => {
    e.preventDefault();

    if (scrollTo && link.startsWith("#")) {
      // Gunakan locomotive scroll jika tersedia
      scrollTo(link);
    } else {
      // Fallback ke native smooth scroll
      const targetElement = document.querySelector(link);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  // Handler untuk contact button dengan smooth scroll dan lanyard trigger
  const handleContactClick = (e) => {
    e.preventDefault();

    if (scrollTo) {
      // Gunakan locomotive scroll
      scrollTo("#contact");
    } else {
      // Fallback ke native scroll
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }

    // Trigger lanyard drop setelah delay
    setTimeout(() => {
      if (window.triggerLanyardDrop) {
        window.triggerLanyardDrop();
      }
    }, 1000);
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <a
          href="#hero"
          className="logo"
          onClick={(e) => handleNavClick(e, "#hero")}
        >
          Azriel | WebDev
        </a>

        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                <a href={link} onClick={(e) => handleNavClick(e, link)}>
                  <span>{name}</span>
                  <span className="underline" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact button dengan smooth scroll dan lanyard trigger */}
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
