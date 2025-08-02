"use client";

import useIsomorphicLayoutEffect from "../../hooks/UseIsomorphicLayoutEffect";
import gsap from "gsap";
import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

export default function NavHome({ isScrolled }) {
  const el = useRef(null);

  useIsomorphicLayoutEffect(() => {
    gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      tl.to(el.current, { x: 0, duration: 2, ease: "power4.inOut" }, 0);
    }, el);
  }, []);

  return (
    <div
      ref={el}
      className={`pointer-events-auto absolute left-[2.5%] top-5 translate-x-[calc(-15rem-2.5vw)] md:top-4 transition-all duration-300 ${
        isScrolled ? "scale-90" : "scale-100"
      }`}
    >
      <div className="overflow-hidden pb-1">
        <Link to="/" className="group inline-flex items-center gap-x-2">
          <div
            className={`p-2 rounded-lg transition-all duration-300 ${
              isScrolled ? "bg-white/10 backdrop-blur-sm" : "bg-transparent"
            }`}
          >
            <Code2
              className={`h-6 w-6 transition-all duration-300 ease-in-out group-hover:rotate-[20deg] ${
                isScrolled ? "text-white" : "text-white"
              }`}
            />
          </div>
          <p
            className={`text-md font-semibold uppercase transition-all duration-300 ${
              isScrolled ? "text-white/90" : "text-white"
            }`}
          >
            Azriel | WebDev
          </p>
        </Link>
      </div>
    </div>
  );
}
