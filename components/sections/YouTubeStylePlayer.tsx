"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  headingVariant,
  paragraphVariant,
  fadeUp,
  viewportOnce,
} from "@/lib/animations";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type VideoItem = {
  url: string;
  name?: string;
  role?: string;
  subtitle?: string;
  avatarUrl?: string;
  avatarAlt?: string;
};

interface YouTubeStylePlayerProps {
  videos?: VideoItem[];
  fallbackVideoUrl?: string;
  fallbackPosterUrl?: string;
  fallbackPosterAlt?: string;
  label?: string;
  title?: string;
  description?: string;
  useFallbackContent?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const formatTime = (s: number) => {
  if (isNaN(s) || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function YouTubeStylePlayer({
  videos,
  fallbackVideoUrl,
  fallbackPosterUrl,
  fallbackPosterAlt,
  label,
  title,
  description,
  useFallbackContent = false,
}: YouTubeStylePlayerProps) {
  /* ---- Resolve playlist ---- */
  const playlist: VideoItem[] =
    videos && videos.length > 0
      ? videos.filter((v) => v?.url?.trim())
      : useFallbackContent || fallbackVideoUrl?.trim()
        ? [{ url: fallbackVideoUrl as string }]
        : [];

  if (!playlist.length) return null;

  /* ---- State ---- */
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [showArrows, setShowArrows] = useState(true);

  // Progress & Time
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  // Volume slider
  const [volumeSlider, setVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(1);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = playlist[idx];
  const hasMultiple = playlist.length > 1;

  /* ---- Animations ---- */
  const premiumEase = [0.25, 1, 0.5, 1];
  const videoSlideVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? "100%" : "-100%",
      scale: 1.05,
      filter: "blur(8px)",
      zIndex: 2,
    }),
    center: {
      opacity: 1,
      x: "0%",
      scale: 1,
      filter: "blur(0px)",
      zIndex: 1,
      transition: { duration: 1.4, ease: premiumEase },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? "-30%" : "30%",
      scale: 0.95,
      filter: "blur(6px)",
      zIndex: 0,
      transition: { duration: 1.4, ease: premiumEase },
    }),
  };

  /* ---- Arrow auto-hide ---- */
  const scheduleHideArrows = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setShowArrows(false);
    }, 2500);
  }, []);

  const revealArrows = useCallback(() => {
    setShowArrows(true);
    scheduleHideArrows();
  }, [scheduleHideArrows]);

  /* ---- Playback ---- */
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      vid.muted = muted;
      vid.volume = volume;
      if (i === idx && playing) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [playing, muted, volume, idx]);

  /* ---- Fullscreen listener ---- */
  useEffect(() => {
    const cb = () =>
      setFullscreen(
        !!(document.fullscreenElement || (document as any).webkitFullscreenElement)
      );
    document.addEventListener("fullscreenchange", cb);
    document.addEventListener("webkitfullscreenchange", cb);
    return () => {
      document.removeEventListener("fullscreenchange", cb);
      document.removeEventListener("webkitfullscreenchange", cb);
    };
  }, []);

  /* ---- Cleanup ---- */
  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  /* ---- Handlers ---- */
  const goTo = (i: number) => {
    setDirection(i > idx ? 1 : -1);
    setIdx(i);
    setPlaying(true);
    setProgress(0);
    setCurrentTime(0);
  };

  const next = () => {
    setDirection(1);
    setIdx((idx + 1) % playlist.length);
    setPlaying(true);
  };

  const prev = () => {
    setDirection(-1);
    setIdx((idx - 1 + playlist.length) % playlist.length);
    setPlaying(true);
  };

  const onTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (seeking) return;
    setCurrentTime(vid.currentTime);
    if (vid.duration) setProgress((vid.currentTime / vid.duration) * 100);

    // Buffered
    if (vid.buffered.length > 0) {
      const end = vid.buffered.end(vid.buffered.length - 1);
      setBuffered((end / vid.duration) * 100);
    }
  };

  const onLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    if (vid) setDuration(vid.duration);
  };

  const onEnded = () => {
    if (hasMultiple) {
      next();
    } else {
      const vid = videoRefs.current[idx];
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const bar = e.currentTarget;
    const vid = videoRefs.current[idx];
    if (!bar || !vid || !vid.duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    vid.currentTime = pct * vid.duration;
    setProgress(pct * 100);
    setCurrentTime(pct * vid.duration);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    const doc = document as any;
    if (!document.fullscreenElement && !doc.webkitFullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlaying((p) => !p);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted((m) => !m);
  };

  /* ---- Render ---- */
  return (
    <motion.section
      className="bg-gradient-to-b from-slate-50 to-white dark:bg-muted dark:from-transparent dark:to-transparent py-10"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Section header */}
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

        {/* Player container */}
        <div className="relative mx-auto max-w-[950px]">
          {/* AnimatePresence bounds — containerRef here so fullscreen targets a stable element */}
          <div
            ref={containerRef}
            className="relative aspect-video w-full overflow-hidden bg-black shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            onMouseMove={revealArrows}
            onMouseLeave={() => {
              if (hideTimer.current) clearTimeout(hideTimer.current);
              setShowArrows(false);
            }}
          >
            <AnimatePresence initial={false} custom={direction}>
              {playlist.map((video, i) => i === idx && (
                <motion.div
                  key={`yt-player-${i}`}
                  custom={direction}
                  variants={videoSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                >
                  {/* The actual player UI that slides together */}
                  <div
                    className="group relative w-full h-full bg-black cursor-pointer select-none"
                    onClick={togglePlay}
                  >
                    {/* Video element */}
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={video.url}
                      poster={fallbackPosterUrl?.trim() || undefined}
                      muted={muted}
                      playsInline
                      onTimeUpdate={onTimeUpdate}
                      onLoadedMetadata={onLoadedMetadata}
                      onEnded={onEnded}
                      className="h-full w-full object-contain bg-black"
                      aria-label={
                        fallbackPosterAlt?.trim() || video.name || title || "Video"
                      }
                    />

                    {/* Dark gradient at bottom for control readability (ALWAYS VISIBLE) */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                    {/* Big centered play button when paused */}
                    <AnimatePresence>
                      {!playing && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                        >
                          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-black/70 text-white shadow-2xl backdrop-blur-sm">
                            <Play className="ml-1.5 h-8 w-8" fill="currentColor" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bottom controls bar (ALWAYS VISIBLE) */}
                    <div
                      className="absolute inset-x-0 bottom-0 z-30 flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Progress bar — YouTube-style emerald */}
                      <div
                        className="relative mx-3 mb-1 py-3 cursor-pointer group/bar"
                        onClick={handleSeek}
                        onMouseDown={() => setSeeking(true)}
                        onMouseUp={() => setSeeking(false)}
                        onMouseLeave={() => setSeeking(false)}
                      >
                        <div className="relative h-[3px] rounded-full bg-white/25 transition-all group-hover/bar:h-[5px]">
                          {/* Buffered */}
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-white/30"
                            style={{ width: `${buffered}%` }}
                          />
                          {/* Progress */}
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                            style={{ width: `${progress}%` }}
                          />
                          {/* Scrubber dot */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-emerald-500 opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-md"
                            style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
                          />
                        </div>
                      </div>

                      {/* Control buttons */}
                      <div className="flex items-center justify-between px-3 pb-3 pt-1 text-white">
                        {/* Left controls */}
                        <div className="flex items-center gap-2 md:gap-3">
                          <button
                            onClick={togglePlay}
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                            aria-label={playing ? "Pause" : "Play"}
                          >
                            {playing ? (
                              <Pause className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" />
                            ) : (
                              <Play className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" />
                            )}
                          </button>

                          {/* Volume */}
                          <div
                            className="relative flex items-center gap-1"
                            onMouseEnter={() => setVolumeSlider(true)}
                            onMouseLeave={() => setVolumeSlider(false)}
                          >
                            <button
                              onClick={toggleMute}
                              className="p-1 rounded hover:bg-white/10 transition-colors"
                              aria-label={muted ? "Unmute" : "Mute"}
                            >
                              {muted ? (
                                <VolumeX className="h-5 w-5" />
                              ) : (
                                <Volume2 className="h-5 w-5" />
                              )}
                            </button>
                            <div
                              className={cn(
                                "overflow-hidden transition-all duration-200",
                                volumeSlider ? "w-16 md:w-20 opacity-100" : "w-0 opacity-0"
                              )}
                            >
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={muted ? 0 : volume}
                                onChange={(e) => {
                                  const v = parseFloat(e.target.value);
                                  setVolume(v);
                                  if (v > 0 && muted) setMuted(false);
                                  if (v === 0) setMuted(true);
                                }}
                                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-white"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          {/* Time */}
                          <span className="text-[11px] md:text-xs font-medium tabular-nums tracking-wide text-white/90">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        {/* Right controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={toggleFullscreen}
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                            aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                          >
                            {fullscreen ? (
                              <Minimize className="h-5 w-5" />
                            ) : (
                              <Maximize className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ---- Side chevrons (multi-video) - AUTO-HIDING ---- */}
                    {hasMultiple && !fullscreen && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prev();
                          }}
                          className={cn(
                            "absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/70",
                            showArrows
                              ? "opacity-100 pointer-events-auto"
                              : "opacity-0 pointer-events-none"
                          )}
                          aria-label="Previous video"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            next();
                          }}
                          className={cn(
                            "absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/70",
                            showArrows
                              ? "opacity-100 pointer-events-auto"
                              : "opacity-0 pointer-events-none"
                          )}
                          aria-label="Next video"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dot pagination */}
          {hasMultiple && !fullscreen && (
            <div className="flex justify-center mt-6 gap-2">
              {playlist.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === idx
                      ? "w-8 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                      : "w-1.5 bg-slate-400 dark:bg-slate-600 hover:bg-slate-500"
                  )}
                  aria-label={`Go to video ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
