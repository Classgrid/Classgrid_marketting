"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function GlobalScrollProgress() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    const updateScrollState = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      
      const nextProgress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      setProgress(nextProgress);
    };

    // Small timeout to allow DOM to render before calculating height
    const timeoutId = setTimeout(updateScrollState, 100);
    
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [pathname]);

  // Strict whitelist: Only show on explicitly long-form reading pages.
  // We do NOT want this on the Home page (/), Help Center, Support/Contact, etc.
  const isLongFormPage = 
    pathname.startsWith("/blog/") || 
    pathname === "/changelog" ||
    pathname === "/terms" ||
    pathname === "/privacy" ||
    pathname === "/cookies" ||
    pathname === "/acceptable-use";

  if (!mounted || !isLongFormPage) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-[#1D9E75]"
        style={{ 
          width: `${progress}%`,
          transition: "width 0.1s ease"
        }}
      />
    </div>
  );
}
