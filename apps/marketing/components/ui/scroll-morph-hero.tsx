"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue, useScroll } from "framer-motion";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;
const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;

function FlipCard({
    src,
    index,
    total,
    phase,
    target,
}: FlipCardProps) {
    return (
        <MotionDiv
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 40,
                damping: 15,
            }}
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            className="group cursor-pointer"
        >
            <MotionDiv
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180 }}
            >
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl bg-gray-200 shadow-lg"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={src}
                        alt={`hero-${index}`}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                </div>

                <div
                    className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-lg"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="text-center">
                        <p className="mb-1 text-[8px] font-bold uppercase tracking-widest text-blue-400">View</p>
                        <p className="text-xs font-medium text-white">Details</p>
                    </div>
                </div>
            </MotionDiv>
        </MotionDiv>
    );
}

const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000;

const IMAGES = [
    "/dashboards/attendance-dashboard.png",
    "/dashboards/fee-ledger.png",
    "/dashboards/timetable-view.png",
    "/dashboards/results-analytics.png",
    "/dashboards/parent-portal.png",
    "/dashboards/admin-overview.png",
    "/dashboards/bus-tracking.png",
    "/dashboards/leave-approval.png",
    "/dashboards/ai-proctoring.png",
    "/dashboards/hostel-management.png",
    "/dashboards/library-system.png",
    "/dashboards/hrms-payroll.png",
    "/dashboards/faculty-portal.png",
    "/dashboards/student-homework.png",
    "/dashboards/lead-crm.png",
    "/dashboards/exam-auto-grade.png",
    "/dashboards/id-card-gen.png",
    "/dashboards/certificate-printing.png",
    "/dashboards/naac-nba.png",
    "/dashboards/alumni-network.png",
];

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function IntroAnimation() {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    const { scrollY } = useScroll();
    const virtualScroll = useTransform(scrollY, (value) => Math.min(Math.max(value, 0), MAX_SCROLL));

    const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

    const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;

            const normalizedX = (relativeX / rect.width) * 2 - 1;
            mouseX.set(normalizedX * 100);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const scatterPositions = useMemo(() => {
        return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, []);

    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
        const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeMorph();
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

    return (
        <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-background">
            <div className="perspective-1000 flex h-full w-full flex-col items-center justify-center">
                <div className="pointer-events-none absolute top-1/2 z-0 flex -translate-y-1/2 flex-col items-center justify-center text-center">
                    <MotionH1
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={
                            introPhase === "circle" && morphValue < 0.5
                                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                                : { opacity: 0, filter: "blur(10px)" }
                        }
                        transition={{ duration: 1 }}
                        className="text-4xl font-extrabold tracking-tighter text-blue-500 md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500"
                    >
                        The Operating System
                        <br />
                        for Modern Campuses.
                    </MotionH1>
                    <MotionP
                        initial={{ opacity: 0 }}
                        animate={
                            introPhase === "circle" && morphValue < 0.5
                                ? { opacity: 0.5 - morphValue }
                                : { opacity: 0 }
                        }
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mt-6 text-sm font-bold tracking-[0.3em] text-muted-foreground uppercase"
                    >
                        SCROLL TO INIT INFRASTRUCTURE
                    </MotionP>
                </div>

                <MotionDiv
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="pointer-events-none absolute top-[10%] z-10 flex flex-col items-center justify-center px-4 text-center"
                >
                    <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#FAFAFA] md:text-5xl">
                        Unprecedented Integration.
                    </h2>
                    <p className="max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground md:text-lg">
                        We don't force you to change your tools.
                        <br className="hidden md:block" />
                        Classgrid seamlessly pipes data directly into AWS, Razorpay, Zoom, and your core campus systems instantly.
                    </p>
                </MotionDiv>

                <div className="relative flex h-full w-full items-center justify-center">
                    {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        if (introPhase === "scatter") {
                            target = scatterPositions[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70;
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            const isMobile = containerSize.width < 768;
                            const minDimension = Math.min(containerSize.width, containerSize.height);

                            const circleRadius = Math.min(minDimension * 0.35, 350);

                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            const circlePos = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngle + 90,
                            };

                            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                            const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);

                            const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
                            const arcCenterY = arcApexY + arcRadius;

                            const spreadAngle = isMobile ? 100 : 130;
                            const startAngle = -90 - spreadAngle / 2;
                            const step = spreadAngle / (TOTAL_IMAGES - 1);

                            const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);

                            const maxRotation = spreadAngle * 0.8;
                            const boundedRotation = -scrollProgress * maxRotation;

                            const currentArcAngle = startAngle + i * step + boundedRotation;
                            const arcRad = (currentArcAngle * Math.PI) / 180;

                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: currentArcAngle + 90,
                                scale: isMobile ? 1.4 : 1.8,
                            };

                            target = {
                                x: lerp(circlePos.x, arcPos.x, morphValue),
                                y: lerp(circlePos.y, arcPos.y, morphValue),
                                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                scale: lerp(1, arcPos.scale, morphValue),
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={src}
                                index={i}
                                total={TOTAL_IMAGES}
                                phase={introPhase}
                                target={target}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
