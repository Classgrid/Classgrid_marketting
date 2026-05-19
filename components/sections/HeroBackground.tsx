"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroBackground() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const animate = useCallback(() => {
    const element = parallaxRef.current;
    if (!element) return;

    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.08;
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.08;

    element.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`;
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetRef.current.x = (event.clientX - window.innerWidth / 2) * 0.01;
      targetRef.current.y = (event.clientY - window.innerHeight / 2) * 0.01;
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="grid-container max-sm:[mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_72%,transparent_72%)] max-sm:[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_72%,transparent_72%)] sm:[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_100%)] sm:[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_100%)]"
      >
        <div className="grid-motion" />
      </div>

      <div ref={parallaxRef} className="absolute inset-0 z-[1]">
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute left-[-15%] top-[-15%] h-[1000px] w-[1000px] rounded-full bg-[#00dfd8]/35 blur-[160px] transition-colors duration-500 dark:bg-[#00dfd8]/40"
        />
        <motion.div
          style={{ y: y2, opacity }}
          className="absolute right-[-10%] top-[5%] h-[900px] w-[900px] rounded-full bg-[#ff0080]/25 blur-[150px] transition-colors duration-500 dark:bg-[#ff0080]/30"
        />
      </div>
    </div>
  );
}
