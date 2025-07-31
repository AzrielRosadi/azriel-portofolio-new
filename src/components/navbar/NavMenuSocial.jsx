"use client";

import useIsomorphicLayoutEffect from "../../hooks/UseIsomorphicLayoutEffect";
import { cn } from "../../lib/utils";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function NavMenuSocial({
  title,
  active,
  duration,
  classes,
  link,
}) {
  const el = useRef(null);
  const tl = useRef(gsap.timeline({ paused: true }));

  useIsomorphicLayoutEffect(() => {
    if (!el.current) return console.log("el.current is null");
    gsap.context(() => {
      tl.current?.fromTo(
        el.current,
        { x: 150 },
        { x: 0, duration: duration, ease: "power3.inOut" }
      );
    }, el);
  }, [duration]);

  useEffect(() => {
    if (active) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [active]);

  return (
    <a
      href={link}
      target={title === "email" ? "_self" : "_blank"}
      rel={title !== "email" ? "noopener noreferrer" : undefined}
      className={cn("group", classes)}
    >
      <p className="text-zinc-200 dark:text-zinc-800">{title}</p>
      <div className="h-[2px] w-full origin-center -translate-y-2 scale-x-0 rounded-full bg-zinc-200 transition group-hover:translate-y-0 group-hover:scale-x-100 dark:bg-zinc-800" />
    </a>
  );
}
