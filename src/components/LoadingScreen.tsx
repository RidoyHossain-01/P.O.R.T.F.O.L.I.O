"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({
  onComplete,
}: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  const [count, setCount] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    document.body.style.overflow = "hidden";

    const countObj = { value: 0 };

    const counterTween = gsap.to(countObj, {
      value: 100,
      duration: 0.45,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.round(countObj.value));
      },
    });

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onComplete();
      },
    });

    tl.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 12,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out",
      }
    )
      .fromTo(
        progressBarRef.current,
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 0.45,
          ease: "power2.out",
        },
        "<"
      )
      .to({}, { duration: 0.08 })
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.35,
        ease: "power4.inOut",
        force3D: true,
      });

    return () => {
      counterTween.kill();
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="
      fixed
      left-0
      top-0
      z-[9999]
      h-dvh
      w-screen
      bg-[#0b0b0d]
      text-[#f4f3ef]
      flex
      items-center
      justify-center
      overflow-hidden
      px-6
      select-none
      font-mono
      "
    >
      <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg">

        <div className="flex items-end justify-between mb-4">
          <span
            ref={titleRef}
            className="
            text-[10px]
            sm:text-xs
            uppercase
            tracking-[0.3em]
            text-white/70
            "
          >
            RIDOY HOSSAIN / PORTFOLIO
          </span>

          <span
            className="
            text-[10px]
            sm:text-xs
            tracking-[0.2em]
            text-[#d4af37]
            "
          >
            {count.toString().padStart(3, "0")}%
          </span>
        </div>

        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left bg-[#d4af37]"
          />
        </div>

        <p
          className="
          mt-4
          text-center
          text-[9px]
          sm:text-[10px]
          uppercase
          tracking-[0.35em]
          text-white/40
          "
        >
          Handcrafting the Digital Workshop
        </p>
      </div>
    </div>
  );
}