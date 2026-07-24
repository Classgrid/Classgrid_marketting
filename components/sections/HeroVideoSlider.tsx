"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, headingVariant, paragraphVariant, fadeUp, viewportOnce } from "@/lib/animations";

type VideoAssets = {
  url: string;
  name?: string;
  role?: string;
  subtitle?: string;
  avatarUrl?: string;
  avatarAlt?: string;
};

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
};

const premiumEase = [0.25, 1, 0.5, 1]; // Extremely smooth, long gliding deceleration

const videoSlideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? "100%" : "-100%", // Start fully off-screen
    scale: 1.05, // Starts slightly zoomed in
    filter: "blur(8px)",
    zIndex: 2,
  }),
  center: {
    opacity: 1,
    x: "0%",
    scale: 1,
    filter: "blur(0px)",
    zIndex: 1,
    transition: {
      duration: 1.4, // Increased from 0.9s for a slower, more luxurious feel
      ease: premiumEase,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? "-30%" : "30%", // Moves back slowly (parallax)
    scale: 0.95, // Shrinks backwards into the background
    filter: "blur(6px)",
    zIndex: 0,
    transition: {
      duration: 1.4, // Match center duration
      ease: premiumEase,
    },
  }),
};

interface HeroVideoSliderProps {
  videos?: VideoAssets[];
  fallbackVideoUrl?: string;
  fallbackPosterUrl?: string;
  fallbackPosterAlt?: string;
  label?: string;
  title?: string;
  description?: string;
  useFallbackContent?: boolean;
  compact?: boolean;
}

export function HeroVideoSlider({
  videos,
  fallbackVideoUrl,
  fallbackPosterUrl,
  fallbackPosterAlt,
  label,
  title,
  description,
  useFallbackContent = false,
  compact = false,
}: HeroVideoSliderProps) {
  const displayVideos =
    videos && videos.length > 0
      ? videos.filter((video) => video?.url?.trim())
      : (useFallbackContent || fallbackVideoUrl?.trim())
        ? [{ url: fallbackVideoUrl as string }]
        : [];

  if (!displayVideos.length) {
    return null;
  }

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Custom Controls State
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay compliance
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCaptionVisible, setIsCaptionVisible] = useState(true);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const captionHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arrowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCaptionHideTimer = () => {
    if (!captionHideTimerRef.current) return;
    clearTimeout(captionHideTimerRef.current);
    captionHideTimerRef.current = null;
  };

  const scheduleCaptionHide = (delayMs: number) => {
    clearCaptionHideTimer();
    captionHideTimerRef.current = setTimeout(() => {
      setIsCaptionVisible(false);
      setIsCaptionExpanded(false);
    }, delayMs);
  };

  const handleMouseMove = () => {
    setShowArrows(true);
    if (arrowTimeoutRef.current) {
      clearTimeout(arrowTimeoutRef.current);
    }
    arrowTimeoutRef.current = setTimeout(() => {
      setShowArrows(false);
    }, 2500);
  };

  const handleMouseLeave = () => {
    if (arrowTimeoutRef.current) {
      clearTimeout(arrowTimeoutRef.current);
    }
    setShowArrows(false);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const nextVideo = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % displayVideos.length);
    setIsPlaying(true);
  };

  const prevVideo = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + displayVideos.length) % displayVideos.length);
    setIsPlaying(true);
  };

  // When video ends, auto-advance to next
  const handleVideoEnded = () => {
    nextVideo();
  };

  // Play/Pause logic: only active video plays, others pause + reset
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === current && isPlaying) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
        if (i !== current) {
          video.currentTime = 0;
        }
      }
    });

    // Reset progress bar on slide change
    setProgress(0);
    setCurrentTime(0);
  }, [current, isPlaying]);

  useEffect(() => {
    return () => {
      clearCaptionHideTimer();
      if (arrowTimeoutRef.current) clearTimeout(arrowTimeoutRef.current);
    };
  }, []);

  const currentSubtitle = displayVideos[current]?.subtitle?.trim() ?? "";
  const activeVideo = displayVideos[current];

  useEffect(() => {
    const hasSubtitle = Boolean(currentSubtitle);

    if (!hasSubtitle) {
      clearCaptionHideTimer();
      setIsCaptionVisible(false);
      setIsCaptionExpanded(false);
      return;
    }

    setIsCaptionVisible(true);
    setIsCaptionExpanded(false);

    if (isPlaying) {
      scheduleCaptionHide(4200);
    } else {
      clearCaptionHideTimer();
    }
  }, [current, isPlaying, currentSubtitle]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration) {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = Number(e.target.value);
    const video = videoRefs.current[current];
    if (video && video.duration) {
      const newTime = (seekTo / 100) * video.duration;
      video.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(seekTo);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = newMuted;
    });
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  const togglePlayPause = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlaying(!isPlaying);
    
    // Show arrows when tapped (especially useful for mobile)
    setShowArrows(true);
    if (arrowTimeoutRef.current) {
      clearTimeout(arrowTimeoutRef.current);
    }
    arrowTimeoutRef.current = setTimeout(() => {
      setShowArrows(false);
    }, 3000);
  };

  const getInitials = (value?: string) => {
    if (!value?.trim()) return "U";
    return value
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  if (compact) {
    return (
      <div className="relative mx-auto w-full">
        {/* Main Card Container — exact same player as homepage */}
        <div
          ref={containerRef}
          className="relative rounded-none overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.18)] bg-black aspect-video w-full cursor-pointer"
          onClick={togglePlayPause}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`compact-video-${current}`}
              custom={direction}
              className="absolute inset-0"
              variants={videoSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {getYouTubeId(activeVideo.url) ? (
                <iframe
                  className="h-full w-full pointer-events-auto"
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.url)}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={activeVideo.name || title || "YouTube video"}
                />
              ) : (
                <video
                  ref={(el) => { videoRefs.current[current] = el; }}
                  src={activeVideo.url}
                  poster={fallbackPosterUrl?.trim() || undefined}
                  autoPlay={isPlaying}
                  muted={isMuted}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleVideoEnded}
                  className="h-full w-full object-cover"
                />
              )}

              {!isPlaying && !getYouTubeId(activeVideo.url) && (
                <div className="absolute inset-0 z-10 bg-black/20 pointer-events-none" />
              )}

              {!isPlaying && !getYouTubeId(activeVideo.url) && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-2xl backdrop-blur-md">
                    <Play className="ml-1 h-8 w-8" fill="currentColor" />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Custom Video Controls — hide for YouTube */}
          {!getYouTubeId(displayVideos[current]?.url || "") && (
            <div
              className="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1.5 cursor-pointer appearance-none rounded-full bg-white/30 accent-emerald-500"
                  style={{ background: `linear-gradient(to right, #10b981 ${progress}%, rgba(255,255,255,0.3) ${progress}%)` }}
                />
                <div className="flex items-center justify-between text-white mt-1">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlayPause} className="hover:text-emerald-400">
                      {isPlaying ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}
                    </button>
                    <button onClick={toggleMute} className="hover:text-emerald-400">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                    <div className="text-xs font-medium tracking-wide">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  <button onClick={toggleFullscreen} className="hover:text-emerald-400">
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.section
      className={compact
        ? "w-full"
        : "bg-gradient-to-b from-slate-50 to-white dark:bg-muted dark:from-transparent dark:to-transparent py-10"}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
    >
      <div className={compact ? "w-full" : "max-w-[1400px] mx-auto px-4 md:px-6"}>
        {!compact && (
          <motion.div
            className="mx-auto mb-10 max-w-3xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
          >
            <motion.div variants={headingVariant}>
              <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500" />
              {label?.trim() ? (
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  {label}
                </p>
              ) : null}
              {title?.trim() ? (
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
                  {title}
                </h2>
              ) : null}
            </motion.div>
            {description?.trim() ? (
              <motion.p
                variants={paragraphVariant}
                className="mx-auto mt-4 max-w-xl text-base text-muted-foreground"
              >
                {description}
              </motion.p>
            ) : null}
          </motion.div>
        )}

        <div 
          className="relative mx-auto max-w-[1000px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Card Container */}
          <div 
            ref={containerRef}
            className="relative rounded-none overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.18)] bg-black aspect-video w-full cursor-pointer"
            onClick={togglePlayPause}
          >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`hero-video-${current}`}
              custom={direction}
              className="absolute inset-0"
              variants={videoSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {getYouTubeId(activeVideo.url) ? (
                <iframe
                  className="h-full w-full pointer-events-auto"
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.url)}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={activeVideo.name || title || "YouTube video"}
                />
              ) : (
                <video
                  ref={(el) => {
                    videoRefs.current[current] = el;
                  }}
                  src={activeVideo.url}
                  poster={fallbackPosterUrl?.trim() || undefined}
                  muted={isMuted}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleVideoEnded}
                  className="h-full w-full object-cover"
                  aria-label={fallbackPosterAlt?.trim() || activeVideo.name || title || "Product video"}
                />
              )}
              
              {!isPlaying && !getYouTubeId(activeVideo.url) && (
                <div className="absolute inset-0 z-10 bg-black/20 pointer-events-none" />
              )}

              <div className="absolute bottom-[4.5rem] left-4 sm:left-6 z-20 max-w-[85%] sm:max-w-xl pr-4 sm:pr-6 text-white md:bottom-24 md:left-8">
                {activeVideo.subtitle?.trim() ? (
                  <div className="max-w-xl">
                    {isCaptionVisible ? (
                      <div className={cn(
                        "rounded-xl backdrop-blur-md transition-all duration-300 custom-scrollbar",
                        isCaptionExpanded 
                          ? "bg-black/85 p-3 sm:p-4 max-h-[110px] sm:max-h-[160px] overflow-y-auto border border-white/20 shadow-2xl pointer-events-auto"
                          : "bg-black/55 px-3 py-2 pointer-events-none"
                      )}
                      onClick={(e) => {
                        if (isCaptionExpanded) e.stopPropagation(); // allow scrolling without pausing video
                      }}>
                        <p
                          className={cn(
                            "text-sm font-medium leading-relaxed opacity-95 md:text-lg",
                            !isCaptionExpanded && (activeVideo.subtitle?.trim().length ?? 0) > 120
                              ? "line-clamp-2"
                              : ""
                          )}
                        >
                          &ldquo;{activeVideo.subtitle}&rdquo;
                        </p>
                      </div>
                    ) : null}

                    {(activeVideo.subtitle?.trim().length ?? 0) > 120 ? (
                      <button
                        type="button"
                        className="hidden sm:block mt-2 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-black/65"
                        onClick={(e) => {
                          e.stopPropagation();

                          if (!isCaptionVisible) {
                            setIsCaptionVisible(true);
                            setIsCaptionExpanded(true);
                            scheduleCaptionHide(7000);
                            return;
                          }

                          if (isCaptionExpanded) {
                            setIsCaptionExpanded(false);
                            scheduleCaptionHide(2500);
                            return;
                          }

                          setIsCaptionExpanded(true);
                          scheduleCaptionHide(7000);
                        }}
                      >
                        {!isCaptionVisible
                          ? "Show more"
                          : isCaptionExpanded
                            ? "Show less"
                            : "Show more"}
                      </button>
                    ) : null}
                  </div>
                ) : null}

                {activeVideo.name?.trim() || activeVideo.role?.trim() ? (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="hidden h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/20 bg-black/45 shadow-lg sm:block">
                      {activeVideo.avatarUrl?.trim() ? (
                        <Image
                          src={activeVideo.avatarUrl}
                          alt={activeVideo.avatarAlt?.trim() || activeVideo.name || "Testimonial avatar"}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-white/90">
                          {getInitials(activeVideo.name)}
                        </div>
                      )}
                    </div>
                    <div>
                      {activeVideo.name?.trim() ? (
                        <p className="text-sm font-semibold tracking-tight text-white drop-shadow-md sm:text-lg md:text-xl">
                          {activeVideo.name}
                        </p>
                      ) : null}
                      {activeVideo.role?.trim() ? (
                        <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-300 opacity-90 drop-shadow-sm sm:text-xs md:text-sm">
                          {activeVideo.role}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              {!isPlaying && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-2xl backdrop-blur-md">
                    <Play className="ml-1 h-8 w-8" fill="currentColor" />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

            {/* Custom Video Controls — hide for YouTube */}
            {!getYouTubeId(displayVideos[current]?.url || "") && (
            <div 
              className="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-6" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2">
                {/* Seek Bar */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1.5 cursor-pointer appearance-none rounded-full bg-white/30 accent-emerald-500"
                  style={{
                    background: `linear-gradient(to right, #10b981 ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
                  }}
                />
                
                {/* Bottom Control Buttons */}
                <div className="flex items-center justify-between text-white mt-1">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlayPause} className="hover:text-emerald-400">
                      {isPlaying ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}
                    </button>
                    
                    <button onClick={toggleMute} className="hover:text-emerald-400">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>

                    <div className="text-xs font-medium tracking-wide">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Mobile-only Show More button */}
                    {((activeVideo.subtitle?.trim().length ?? 0) > 120) ? (
                      <button
                        type="button"
                        className="sm:hidden rounded border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-sm transition hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isCaptionVisible) {
                            setIsCaptionVisible(true);
                            setIsCaptionExpanded(true);
                            scheduleCaptionHide(7000);
                            return;
                          }
                          if (isCaptionExpanded) {
                            setIsCaptionExpanded(false);
                            scheduleCaptionHide(2500);
                            return;
                          }
                          setIsCaptionExpanded(true);
                          scheduleCaptionHide(7000);
                        }}
                      >
                        {!isCaptionVisible ? "More" : isCaptionExpanded ? "Less" : "More"}
                      </button>
                    ) : null}

                    <button onClick={toggleFullscreen} className="hover:text-emerald-400">
                      {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Side Chevron Controls — Auto-hiding */}
          {displayVideos.length > 1 && !isFullscreen && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevVideo();
                }}
                className={cn(
                  "absolute left-2 md:-left-8 top-1/2 z-20 flex h-10 w-10 md:h-14 md:w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-slate-900 shadow-2xl backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
                  showArrows ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextVideo();
                }}
                className={cn(
                  "absolute right-2 md:-right-8 top-1/2 z-20 flex h-10 w-10 md:h-14 md:w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-slate-900 shadow-2xl backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
                  showArrows ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </>
          )}

          {/* Bottom Pagination Indicators */}
          {displayVideos.length > 1 && !isFullscreen && (
            <div className="flex justify-center mt-8 gap-3">
              {displayVideos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                    setIsPlaying(true);
                  }}
                  className={cn(
                    "h-2 w-2 rounded-full",
                    i === current
                      ? "bg-emerald-500 w-8 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
