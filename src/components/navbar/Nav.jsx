// Nav.jsx - Background hitam solid saat scroll
import { useState, useEffect } from "react";
import NavHome from "./NavHome";
import NavMenu from "./NavMenu";

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Trigger setelah scroll 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="pointer-events-none fixed z-[999] h-full w-full">
      {/* Background overlay dengan background hitam solid */}
      <div
        className={`fixed inset-x-0 top-0 h-20 transition-all duration-300 ease-in-out ${
          isScrolled ? "bg-black" : "bg-transparent"
        }`}
      />

      <NavHome isScrolled={isScrolled} />
      <NavMenu isScrolled={isScrolled} />
    </nav>
  );
}
