"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function useSlidingLogo() {
  const slidingLogo = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(slidingLogo.current, {
      x: "-50%",
      repeat: -1,
      ease: "none",
      duration: 10,
    });
  }, []);

  return slidingLogo;
}

export function useDivExpansion() {
  const divExpansion = useRef<HTMLDivElement>(null);
  const buttonExpansion = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(divExpansion.current, {
      height: "33%",
      opacity: 1,
      duration: 2,
      ease: "power3.out",
    });

    tl.to(buttonExpansion.current, {
      width: "20%",
      padding: "0.5rem",
      opacity: 1,
      duration: 2.4,
      ease: "power3.out",
    });
  }, []);

  return [divExpansion, buttonExpansion];
}
