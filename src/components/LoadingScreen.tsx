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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    document.body.style.overflow = "hidden";

    const counter = { value: 0 };

    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
      },
      onComplete: () => {
        document.body.style.overflow = "";
        onComplete();
      },
    });

    tl.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 10,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.25,
      }
    );

    tl.fromTo(
      progressBarRef.current,
      {
        scaleX: 0,
      },
      {
        scaleX: 1,
        duration: 1.2,
      },
      "<"
    );

    tl.to(
      counter,
      {
        value: 100,
        duration: 1.2,
        ease: "none",
        onUpdate: () => {
          setCount(Math.round(counter.value));
        },
      },
      "<"
    );

    tl.to({}, { duration: 0.15 });

    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.35,
      ease: "power4.inOut",
    });

    return () => {
      document.body.style.overflow = "";
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-[#0b0b0d] text-[#f4f3ef]"
    >
      <div className="w-[85vw] max-w-105 flex flex-col gap-4">
        <div className="flex justify-between items-end text-xs uppercase tracking-[0.25em] opacity-70">
          <span ref={titleRef}>RIDOY HOSSAIN / PORTFOLIO</span>

          <span className="font-mono tabular-nums">
            {count.toString().padStart(3, "0")}%
          </span>
        </div>

        <div className="h-0.5 overflow-hidden rounded-full bg-white/10">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left bg-[#d4af37]"
          />
        </div>

        <div className="text-center text-[10px] uppercase tracking-[0.3em] opacity-40">
          Handcrafting the digital workshop
        </div>
      </div>
    </div>
  );
}