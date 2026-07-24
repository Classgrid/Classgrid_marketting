"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type Globe as CobeGlobe } from "cobe";
import { cn } from "@/lib/utils";

type GlobeLightProps = {
  className?: string;
  showLabel?: boolean;
};

const GLOBE_SCALE = 1.06;
const GLOBE_RADIUS = 1200 * ((0.8 * GLOBE_SCALE) / 2);

/* ── Light-mode tuned colors ────────────────────────────── */
// White/off-white globe surface
const LIGHT_BASE_COLOR: [number, number, number] = [1.0, 1.0, 1.0];
// Subtle warm gray glow
const LIGHT_GLOW_COLOR: [number, number, number] = [0.88, 0.88, 0.88];
// Emerald-ish marker color
const LIGHT_MARKER_COLOR: [number, number, number] = [0.2, 0.72, 0.53];

const projectLocation = (lat: number, lon: number, phi: number, theta: number) => {
  const latRad = lat * (Math.PI / 180);
  const lonRad = lon * (Math.PI / 180) - Math.PI;

  const sx = -Math.cos(latRad) * Math.cos(lonRad);
  const sy = Math.sin(latRad);
  const sz = Math.cos(latRad) * Math.sin(lonRad);

  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);

  const fx = sx * cosPhi + sz * sinPhi;
  const fy = sx * (sinPhi * sinTheta) + sy * cosTheta + sz * (-cosPhi * sinTheta);
  const fz = sx * (-sinPhi * cosTheta) + sy * sinTheta + sz * (cosPhi * cosTheta);

  return {
    x: 600 + fx * GLOBE_RADIUS,
    y: 600 - fy * GLOBE_RADIUS,
    z: fz,
  };
};

export default function GlobeLight({ className, showLabel = false }: GlobeLightProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!container || !canvas || !overlay) return;

    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    let globe: CobeGlobe | null = null;
    let animationFrame = 0;
    let currentPhi = 0;
    const theta = 0;

    overlay.width = 1200;
    overlay.height = 1200;

    globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0.15,
      dark: 0,            // ← KEY: light mode globe
      diffuse: 2.2,       // softer diffuse lighting for light surface
      scale: GLOBE_SCALE,
      mapSamples: 16000,
      mapBrightness: 1.8, // lower brightness → darker dots on white
      mapBaseBrightness: 0.04,
      baseColor: LIGHT_BASE_COLOR,
      markerColor: LIGHT_MARKER_COLOR,
      glowColor: LIGHT_GLOW_COLOR,
      markers: [],
    });

    const cobeWrapper = canvas.parentElement;
    if (cobeWrapper && cobeWrapper !== container) {
      cobeWrapper.style.position = "absolute";
      cobeWrapper.style.inset = "0";
      cobeWrapper.style.width = "100%";
      cobeWrapper.style.height = "100%";
      cobeWrapper.style.pointerEvents = "none";
    }

    const renderOverlay = () => {
      ctx.clearRect(0, 0, 1200, 1200);

      if (!showLabel) return;

      // Pointing the label at the Central India marker
      const marker = projectLocation(21.1458, 79.0882, currentPhi, theta);
      if (marker.z <= 0.05) return;

      const text = "INDIA";
      ctx.font = "bold 22px 'Inter', sans-serif";
      const metrics = ctx.measureText(text);
      const padX = 10;
      const padY = 6;
      const boxW = metrics.width + padX * 2;
      const boxH = 22 + padY * 2;
      const boxX = marker.x - boxW / 2;
      const boxY = marker.y - boxH - 16;

      // Connector line — dark for light bg
      ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(marker.x, marker.y - 4);
      ctx.lineTo(marker.x, boxY + boxH);
      ctx.stroke();

      // Label pill — dark bg with white text for contrast on light surface
      ctx.fillStyle = "#111111";
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 4);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, marker.x, boxY + boxH / 2);
    };

    const animate = () => {
      currentPhi += 0.005;
      globe?.update({ phi: currentPhi, theta });
      renderOverlay();
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      globe?.destroy();
      if (cobeWrapper && cobeWrapper !== container && cobeWrapper.contains(canvas)) {
        container.appendChild(canvas);
        cobeWrapper.remove();
      }
    };
  }, [showLabel]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center justify-center", className)}
      style={{
        width: "min(650px, 100%)",
        aspectRatio: "1 / 1",
        maxWidth: "100%",
        isolation: "isolate",
      }}
    >
      <canvas
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          aspectRatio: 1,
          pointerEvents: "none",
          zIndex: 30,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          aspectRatio: 1,
          pointerEvents: "none",
        }}
        className="z-10 opacity-100 pointer-events-none"
      />
    </div>
  );
}
