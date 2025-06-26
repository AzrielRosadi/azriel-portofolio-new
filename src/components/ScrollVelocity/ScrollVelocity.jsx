"use client";

import { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";

function useElementWidth(ref) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) setWidth(ref.current.offsetWidth);
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);
  return width;
}

export default function ScrollVelocity({
  scrollContainerRef,
  texts = [],
  velocity = 100,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = "",
  scrollerClassName = "",
  parallaxStyle = {},
  scrollerStyle = {},
  // Parameter baru untuk kontrol animasi skew dan shift
  maxSkew = 50, // maksimal derajat kemiringan
  maxShift = 10, // maksimal pergeseran vertikal dalam px
  skewSensitivity = 0.01, // sensitivitas skew terhadap velocity
  shiftSensitivity = 0.005, // sensitivitas shift terhadap velocity
  // Parameter kontrol posisi kemiringan
  skewDirection = "auto", // "auto", "left", "right", "reverse"
  skewOrigin = "center", // "center", "top", "bottom", "left", "right"
  customSkewAngle = null, // sudut kustom dalam derajat (override maxSkew jika diset)
  // Parameter kontrol momentum dan acceleration
  enableMomentum = true, // aktifkan efek momentum
  momentumDecay = 0.1, // perlambatan momentum (0.9-0.99)
  accelerationFactor = 1.5, // faktor percepatan (1.0-3.0)
  maxMomentumVelocity = 500, // batas maksimal momentum velocity
  // Parameter untuk natural smoothness
  smoothingFactor = 0.15, // faktor smoothing untuk transisi (0.05-0.3)
  easeInOutPower = 2, // kekuatan ease in/out (1-4)
  naturalDelay = 0.1, // delay natural untuk responsivitas (0-0.5)
}) {
  function VelocityText({
    children,
    baseVelocity = velocity,
    scrollContainerRef,
    className = "",
    damping,
    stiffness,
    numCopies,
    velocityMapping,
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle,
    maxSkew,
    maxShift,
    skewSensitivity,
    shiftSensitivity,
    skewDirection,
    skewOrigin,
    customSkewAngle,
    enableMomentum,
    momentumDecay,
    accelerationFactor,
    maxMomentumVelocity,
    smoothingFactor,
    easeInOutPower,
    naturalDelay,
  }) {
    const baseX = useMotionValue(0);
    const skewX = useMotionValue(0);
    const translateY = useMotionValue(0);

    // Smooth spring configurations for more natural feel
    const springConfig = {
      damping: damping ?? 50,
      stiffness: stiffness ?? 400,
      mass: 1.2, // Slight mass for more natural movement
    };

    const scrollOptions = scrollContainerRef
      ? { container: scrollContainerRef }
      : {};
    const { scrollY } = useScroll(scrollOptions);
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, springConfig);

    const velocityFactor = useTransform(
      smoothVelocity,
      velocityMapping?.input || [0, 1000],
      velocityMapping?.output || [0, 5],
      { clamp: false }
    );

    const copyRef = useRef(null);
    const copyWidth = useElementWidth(copyRef);

    function wrap(min, max, v) {
      const range = max - min;
      const mod = (((v - min) % range) + range) % range;
      return mod + min;
    }

    const x = useTransform(baseX, (v) => {
      if (copyWidth === 0) return "0px";
      return `${wrap(-copyWidth, 0, v)}px`;
    });

    // Transform untuk skew dan translateY
    const skewTransform = useTransform(skewX, (v) => `${v}deg`);
    const yTransform = useTransform(translateY, (v) => `${v}px`);

    // Transform origin berdasarkan setting
    const getTransformOrigin = () => {
      switch (skewOrigin) {
        case "top":
          return "center top";
        case "bottom":
          return "center bottom";
        case "left":
          return "left center";
        case "right":
          return "right center";
        case "center":
        default:
          return "center center";
      }
    };

    // arah scroll berdasarkan perubahan scrollY
    const prevScrollY = useRef(0);
    const directionFactor = useRef(1);
    const momentumVelocity = useRef(0); // menyimpan momentum velocity
    const lastScrollTime = useRef(0);
    const smoothSkew = useRef(0); // smooth skew value
    const smoothShift = useRef(0); // smooth shift value
    const velocityHistory = useRef([]); // history untuk smooth velocity calculation

    // Easing function untuk natural movement
    const easeInOutQuad = (t) => {
      const power = easeInOutPower;
      return t < 0.5
        ? Math.pow(2 * t, power) / 2
        : 1 - Math.pow(2 * (1 - t), power) / 2;
    };

    useAnimationFrame((t, delta) => {
      const currentScrollY = scrollY.get();
      const currentVelocity = scrollVelocity.get();
      const currentTime = t;
      const deltaTime = delta / 1000; // convert to seconds

      // Update velocity history for smoother calculations
      velocityHistory.current.push(currentVelocity);
      if (velocityHistory.current.length > 5) {
        velocityHistory.current.shift();
      }

      // Calculate average velocity for smoother response
      const avgVelocity =
        velocityHistory.current.reduce((a, b) => a + b, 0) /
        velocityHistory.current.length;

      // tentukan arah: scroll up atau down dengan smooth transition
      const scrollDiff = currentScrollY - prevScrollY.current;
      if (Math.abs(scrollDiff) > 0.1) {
        // threshold untuk avoid jitter
        if (scrollDiff > 0) {
          directionFactor.current = -1;
        } else {
          directionFactor.current = 1;
        }
      }

      prevScrollY.current = currentScrollY;

      // Hitung momentum dan acceleration dengan natural easing
      let effectiveVelocity = baseVelocity;

      if (enableMomentum) {
        const scrollSpeed = Math.abs(avgVelocity);

        // Natural acceleration curve
        if (scrollSpeed > 0) {
          const normalizedSpeed = Math.min(scrollSpeed / 200, 1); // normalize 0-1
          const easedAcceleration = easeInOutQuad(normalizedSpeed);
          const acceleration = easedAcceleration * accelerationFactor;

          momentumVelocity.current += acceleration * deltaTime * 60; // normalize to 60fps
          momentumVelocity.current = Math.min(
            momentumVelocity.current,
            maxMomentumVelocity
          );
        }

        // Apply momentum decay with natural curve
        const decayRate = Math.pow(momentumDecay, deltaTime * 60);
        momentumVelocity.current *= decayRate;

        // Combine base velocity with momentum
        effectiveVelocity = baseVelocity + momentumVelocity.current;
      }

      // Smooth speed calculation
      const scrollVel = Math.abs(avgVelocity);
      const scrollFactor = Math.min(scrollVel / 800, 2); // cap the factor
      const speed = effectiveVelocity * (1 + scrollFactor * 0.5);
      const moveBy = directionFactor.current * speed * deltaTime;

      baseX.set(baseX.get() + moveBy);

      lastScrollTime.current = currentTime;

      // Hitung skew dan shift berdasarkan velocity dan arah dengan natural smoothing
      let targetSkew;

      // Gunakan custom angle jika diset
      if (customSkewAngle !== null) {
        targetSkew = customSkewAngle;
      } else {
        // Gunakan average velocity untuk smoother skew
        let skewMultiplier = 1;

        switch (skewDirection) {
          case "left":
            skewMultiplier = -1;
            targetSkew =
              Math.abs(avgVelocity * skewSensitivity) * skewMultiplier;
            break;
          case "right":
            skewMultiplier = 1;
            targetSkew =
              Math.abs(avgVelocity * skewSensitivity) * skewMultiplier;
            break;
          case "reverse":
            targetSkew = -avgVelocity * skewSensitivity;
            break;
          case "auto":
          default:
            targetSkew = avgVelocity * skewSensitivity;
            break;
        }

        // Apply natural easing to skew
        const skewIntensity = Math.min(Math.abs(targetSkew) / maxSkew, 1);
        const easedSkewIntensity = easeInOutQuad(skewIntensity);
        targetSkew = Math.sign(targetSkew) * easedSkewIntensity * maxSkew;

        // Batasi dengan maxSkew
        targetSkew = Math.min(Math.max(targetSkew, -maxSkew), maxSkew);
      }

      const targetShift = Math.min(
        Math.max(avgVelocity * shiftSensitivity, -maxShift),
        maxShift
      );

      // Natural smooth transition dengan delay
      const smoothingRate = smoothingFactor * (deltaTime * 60);

      smoothSkew.current += (targetSkew - smoothSkew.current) * smoothingRate;
      smoothShift.current +=
        (targetShift - smoothShift.current) * smoothingRate;

      // Apply natural delay for more organic feel
      setTimeout(() => {
        skewX.set(smoothSkew.current);
        translateY.set(smoothShift.current);
      }, naturalDelay * 1000);

      if (baseX.get() < -copyWidth) {
        baseX.set(baseX.get() + copyWidth);
      } else if (baseX.get() > 0) {
        baseX.set(baseX.get() - copyWidth);
      }
    });

    const chars = Array.from(children); // split per huruf
    const spans = [];
    for (let i = 0; i < numCopies; i++) {
      spans.push(
        <span
          className={`flex-shrink-0 ${className}`}
          key={i}
          ref={i === 0 ? copyRef : null}
        >
          {chars.map((ch, index) => (
            <motion.span
              key={index}
              className="inline-block"
              style={{
                willChange: "transform",
                skewX: skewTransform,
                translateY: yTransform,
                transformOrigin: getTransformOrigin(),
              }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      );
    }

    return (
      <div
        className={`relative overflow-hidden ${parallaxClassName}`}
        style={parallaxStyle}
      >
        <motion.div
          className={`flex whitespace-nowrap text-center font-sans text-4xl font-bold tracking-[-0.02em] drop-shadow md:text-[5rem] md:leading-[5rem] ${scrollerClassName}`}
          style={{ x, ...scrollerStyle }}
        >
          {spans}
        </motion.div>
      </div>
    );
  }

  return (
    <section>
      {texts.map((text, index) => (
        <VelocityText
          key={index}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          scrollContainerRef={scrollContainerRef}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
          maxSkew={maxSkew}
          maxShift={maxShift}
          skewSensitivity={skewSensitivity}
          shiftSensitivity={shiftSensitivity}
          skewDirection={skewDirection}
          skewOrigin={skewOrigin}
          customSkewAngle={customSkewAngle}
          enableMomentum={enableMomentum}
          momentumDecay={momentumDecay}
          accelerationFactor={accelerationFactor}
          maxMomentumVelocity={maxMomentumVelocity}
          smoothingFactor={smoothingFactor}
          easeInOutPower={easeInOutPower}
          naturalDelay={naturalDelay}
        >
          {text}&nbsp;
        </VelocityText>
      ))}
    </section>
  );
}
