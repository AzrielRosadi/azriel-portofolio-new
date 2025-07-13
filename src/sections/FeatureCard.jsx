import { abilities } from "../constants";
import { useEffect, useRef, useState } from "react";

const FeatureCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before entering viewport
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className="w-full padding-x-lg">
      <div className="mx-auto grid-3-cols">
        {abilities.map(({ imgPath, title, desc }, index) => (
          <div
            key={title}
            className={`card-border rounded-xl p-8 flex flex-col gap-4 transition-all duration-700 ease-out transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
            }}
          >
            <div
              className={`size-14 flex items-center justify-center rounded-full transition-all duration-500 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150 + 200}ms` : "0ms",
              }}
            >
              <img src={imgPath} alt={title} />
            </div>
            <h3
              className={`text-white text-2xl font-semibold mt-2 transition-all duration-500 ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150 + 300}ms` : "0ms",
              }}
            >
              {title}
            </h3>
            <p
              className={`text-white-50 text-lg transition-all duration-500 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150 + 400}ms` : "0ms",
              }}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCard;
