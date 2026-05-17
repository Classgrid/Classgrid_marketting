"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  /** Use this to make an image span 2 columns or rows in the bento grid */
  className?: string; 
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
}

/* ─── slide variants for arrow-key navigation ─── */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 400 : -400,
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 400, damping: 35 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.3 },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -400 : 400,
    opacity: 0,
    scale: 0.92,
    transition: {
      x: { type: "spring", stiffness: 400, damping: 35 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  }),
};

/**
 * Premium SaaS Image Gallery with Bento Grid layout and Full-Screen Lightbox.
 * - Click to open: Apple-level layoutId morph animation
 * - Arrow keys: cinematic horizontal slide transition
 * - Close: morphs back if on original image, or fades out gracefully
 */
export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right
  // The image that was originally clicked (for layoutId morph on open/close)
  const clickedImageRef = useRef<GalleryImage | null>(null);
  // Whether we've navigated away from the clicked image
  const hasNavigatedRef = useRef(false);

  const selectedIndex = selectedImage
    ? images.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const goNext = useCallback(() => {
    if (selectedIndex === -1) return;
    hasNavigatedRef.current = true;
    setDirection(1);
    setSelectedImage(images[(selectedIndex + 1) % images.length]);
  }, [selectedIndex, images]);

  const goPrev = useCallback(() => {
    if (selectedIndex === -1) return;
    hasNavigatedRef.current = true;
    setDirection(-1);
    setSelectedImage(images[(selectedIndex - 1 + images.length) % images.length]);
  }, [selectedIndex, images]);

  const openImage = useCallback((img: GalleryImage) => {
    clickedImageRef.current = img;
    hasNavigatedRef.current = false;
    setDirection(0);
    setSelectedImage(img);
  }, []);

  const closeImage = useCallback(() => {
    // If we navigated away, snap back to clicked image so layoutId morphs home
    if (hasNavigatedRef.current && clickedImageRef.current) {
      setSelectedImage(clickedImageRef.current);
      hasNavigatedRef.current = false;
      // Let framer re-render with the correct layoutId, then close
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSelectedImage(null);
          clickedImageRef.current = null;
        });
      });
    } else {
      setSelectedImage(null);
      clickedImageRef.current = null;
    }
  }, []);

  // Is the lightbox showing the originally-clicked image? (layoutId morph mode)
  const isOnClickedImage =
    selectedImage && clickedImageRef.current && selectedImage.id === clickedImageRef.current.id;

  // Keyboard: Escape to close, Arrow keys to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "Escape") closeImage();
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, closeImage, goNext, goPrev]);

  return (
    <>
      {/* ──────────── THE BENTO GRID ──────────── */}
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[250px]",
          className
        )}
      >
        {images.map((img, index) => (
          <motion.div
            key={img.id}
            layoutId={`gallery-image-${img.id}`}
            className={cn(
              "group relative overflow-hidden rounded-2xl bg-card border border-border cursor-pointer",
              img.className
            )}
            onClick={() => openImage(img)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Hover Overlay — subtle darkening */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20 z-10" />

            {/* Optional Caption at bottom */}
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-sm font-medium">{img.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ──────────── FULL SCREEN LIGHTBOX ──────────── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8"
            onClick={closeImage}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                closeImage();
              }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image counter */}
            <div className="absolute top-7 left-1/2 -translate-x-1/2 z-50 text-white/50 text-sm font-medium tracking-wider">
              {selectedIndex + 1} / {images.length}
            </div>

            {/* ─── Image container ─── */}
            {/* When on the originally-clicked image → layoutId morph (Apple-level) */}
            {/* When navigated via arrows → cinematic slide transition */}
            {isOnClickedImage && !hasNavigatedRef.current ? (
              <motion.div
                layoutId={`gallery-image-${selectedImage.id}`}
                className="relative w-full max-w-6xl h-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
                {selectedImage.caption && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-center"
                  >
                    <p className="text-white/90 text-lg font-medium">
                      {selectedImage.caption}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={selectedImage.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative w-full max-w-6xl h-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                  {selectedImage.caption && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-center"
                    >
                      <p className="text-white/90 text-lg font-medium">
                        {selectedImage.caption}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
