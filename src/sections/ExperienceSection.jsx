import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { expCards } from "../constants";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  useGSAP(() => {
    // Loop through each timeline card and animate them in
    // as the user scrolls to each card
    gsap.utils.toArray(".timeline-card").forEach((card) => {
      // Animate the card coming in from the left
      // and fade in
      gsap.from(card, {
        // Move the card in from the left
        xPercent: -100,
        // Make the card invisible at the start
        opacity: 0,
        // Set the origin of the animation to the left side of the card
        transformOrigin: "left left",
        // Animate over 1 second
        duration: 1,
        // Use a power2 ease-in-out curve
        ease: "power2.inOut",
        // Trigger the animation when the card is 80% of the way down the screen
        scrollTrigger: {
          // The card is the trigger element
          trigger: card,
          // Trigger the animation when the card is 80% down the screen
          start: "top 80%",
          // End when the card is 20% from top
          end: "top 20%",
          // Enable toggleActions for both directions
          toggleActions: "play none none reverse",
        },
      });
    });

    // Enhanced gradient-line animation - growing from top to bottom as user scrolls
    // Set initial state of gradient-line (height 0)
    gsap.set(".gradient-line", {
      scaleY: 0,
      transformOrigin: "top top",
    });

    // Set initial state of all logos (hidden)
    gsap.utils.toArray(".timeline-logo").forEach((logo) => {
      gsap.set(logo, {
        opacity: 0,
        scale: 0.8,
      });
    });

    // Animate gradient-line height based on scroll progress
    // Gradient-line grows from top to bottom as user scrolls down
    // and shrinks back up as user scrolls up
    gsap.to(".gradient-line", {
      scaleY: 1,
      transformOrigin: "top top",
      ease: "none", // Linear animation for smooth scroll tracking
      scrollTrigger: {
        trigger: ".timeline-wrapper",
        start: "top 80%", // Start later to make it slower
        end: "bottom 20%", // End earlier to make it slower
        scrub: 3, // Slower scrubbing - higher value = slower animation
        onUpdate: (self) => {
          // Update gradient-line height based on scroll progress
          // 0 = fully collapsed, 1 = fully extended
          gsap.set(".gradient-line", {
            scaleY: self.progress,
            transformOrigin: "top top",
          });
        },
      },
    });

    // Animate each logo individually based on scroll position
    gsap.utils.toArray(".timeline-logo").forEach((logo, index) => {
      gsap.to(logo, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: logo,
          start: "top 70%", // Logo appears when it's 70% down the screen
          end: "top 30%", // Logo disappears when it's 30% from top
          scrub: 1,
          onEnter: () => {
            // Logo appears when scrolling down into view
            gsap.to(logo, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "back.out(1.7)",
            });
          },
          onLeave: () => {
            // Logo stays visible when scrolling past it (down)
            // We don't hide it here because we want it to stay visible
          },
          onEnterBack: () => {
            // Logo appears again when scrolling back up into view
            gsap.to(logo, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "back.out(1.7)",
            });
          },
          onLeaveBack: () => {
            // Logo disappears when scrolling up past it (back to top)
            gsap.to(logo, {
              opacity: 0,
              scale: 0.8,
              duration: 0.3,
              ease: "power2.in",
            });
          },
        },
      });
    });

    // Enhanced expText animation with scroll up support
    gsap.utils.toArray(".expText").forEach((text) => {
      // Create a timeline for better control
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: text,
          start: "top 60%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Set initial state
      gsap.set(text, {
        opacity: 0,
        xPercent: -20, // Start slightly to the left
      });

      // Animate in
      tl.to(text, {
        opacity: 1,
        xPercent: 0,
        duration: 1,
        ease: "power2.inOut",
      });
    });

    // Enhanced animation for card titles, dates, and content
    gsap.utils.toArray(".exp-card-wrapper").forEach((wrapper) => {
      const title = wrapper.querySelector("h1");
      const date = wrapper.querySelector("p");
      const responsibilities = wrapper.querySelector("ul");
      const responsibilityLabel = wrapper.querySelector(
        ".text-\\[\\#839CB5\\]"
      );

      // Create timeline for coordinated animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top 70%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
      });

      // Set initial states
      if (title) {
        gsap.set(title, {
          opacity: 0,
          y: 30,
          xPercent: -10,
        });
      }

      if (date) {
        gsap.set(date, {
          opacity: 0,
          y: 20,
          xPercent: -10,
        });
      }

      if (responsibilityLabel) {
        gsap.set(responsibilityLabel, {
          opacity: 0,
          y: 20,
          xPercent: -10,
        });
      }

      if (responsibilities) {
        gsap.set(responsibilities, {
          opacity: 0,
          y: 40,
          xPercent: -10,
        });
      }

      // Animate elements in sequence
      tl.to(title, {
        opacity: 1,
        y: 0,
        xPercent: 0,
        duration: 0.8,
        ease: "power2.out",
      })
        .to(
          date,
          {
            opacity: 1,
            y: 0,
            xPercent: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .to(
          responsibilityLabel,
          {
            opacity: 1,
            y: 0,
            xPercent: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          responsibilities,
          {
            opacity: 1,
            y: 0,
            xPercent: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        );
    });

    // Enhanced individual responsibility item animations
    gsap.utils.toArray(".exp-card-wrapper ul li").forEach((item, index) => {
      gsap.set(item, {
        opacity: 0,
        x: -30,
        y: 20,
      });

      gsap.to(item, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: index * 0.1, // Stagger effect
        scrollTrigger: {
          trigger: item.closest(".exp-card-wrapper"),
          start: "top 65%",
          end: "top 25%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }, []);

  return (
    <section
      id="experience"
      className="flex-center md:mt-40 mt-20 section-padding xl:px-0"
    >
      <div className="w-full h-full md:px-20 px-5">
        <TitleHeader
          title="Professional Work Experience"
          sub="💼 My Career Overview"
        />
        <div className="mt-32 relative">
          <div className="relative z-50 xl:space-y-32 space-y-10">
            {expCards.map((card) => (
              <div key={card.title} className="exp-card-wrapper">
                <div className="xl:w-2/6">
                  <GlowCard card={card}>
                    <div className="timeline-card">
                      <img src={card.imgPath} alt="exp-img" />
                    </div>
                  </GlowCard>
                </div>
                <div className="xl:w-4/6">
                  <div className="flex items-start">
                    <div className="timeline-wrapper">
                      <div className="gradient-line w-1 h-full" />
                    </div>
                    <div className="expText flex xl:gap-20 md:gap-10 gap-5 relative z-20">
                      <div className="timeline-logo">
                        <img src={card.logoPath} alt="logo" />
                      </div>
                      <div>
                        <h1 className="font-semibold text-3xl">{card.title}</h1>
                        <p className="my-5 text-white-50">
                          🗓️&nbsp;{card.date}
                        </p>
                        <p className="text-[#839CB5] italic">
                          Responsibilities
                        </p>
                        <ul className="list-disc ms-5 mt-5 flex flex-col gap-5 text-white-50">
                          {card.responsibilities.map(
                            (responsibility, index) => (
                              <li key={index} className="text-lg">
                                {responsibility}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
