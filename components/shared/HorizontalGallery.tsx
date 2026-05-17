"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  title?: string;
}

interface HorizontalGalleryProps {
  images: GalleryImage[];
  className?: string;
}

/**
 * Premium Horizontal Scroll Gallery (OpenAI Style)
 * Features CSS scroll snapping, grayscale styling, and a full-screen Lightbox.
 */
export function HorizontalGallery({ images, className }: HorizontalGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Close lightbox on escape key
  if (typeof window !== "undefined") {
    window.onkeydown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
  }

  return (
    <>
      {/* --- HORIZONTAL SNAP CAROUSEL --- */}
      <div 
        className={cn(
          "w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-8 pb-8 pt-4 px-4 md:px-8", 
          className
        )}
        style={{
          // Hide scrollbar but keep functionality
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {images.map((img, index) => (
          <motion.div
            key={img.id}
            layoutId={`horizontal-gallery-${img.id}`}
            className="group relative flex-shrink-0 w-[85vw] md:w-[60vw] max-w-4xl aspect-[4/3] md:aspect-[16/9] snap-center overflow-hidden rounded-2xl bg-muted border border-border cursor-zoom-in"
            onClick={() => setSelectedImage(img)}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
              sizes="(max-width: 768px) 85vw, 60vw"
              priority={index === 0} // prioritize first image
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-black/50 backdrop-blur-md text-white p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <Maximize2 className="w-5 h-5" />
              </div>
            </div>

            {/* Optional Title/Caption overlay matching the OpenAI builder cards style */}
            {img.title && (
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 z-20">
                 <h3 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md mb-2">{img.title}</h3>
                 {img.caption && <p className="text-white/90 font-medium drop-shadow-md">{img.caption}</p>}
              </div>
            )}
            
            {/* Gradient shadow for text readability if title exists */}
            {img.title && (
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
            )}
          </motion.div>
        ))}
      </div>

      {/* --- FULL SCREEN LIGHTBOX --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* The Image */}
            <motion.div
              layoutId={`horizontal-gallery-${selectedImage.id}`}
              className="relative w-full max-w-7xl h-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              
              {/* Lightbox Caption */}
              {(selectedImage.title || selectedImage.caption) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent text-center"
                >
                  {selectedImage.title && <h3 className="text-white text-2xl font-bold mb-2">{selectedImage.title}</h3>}
                  {selectedImage.caption && <p className="text-white/80 text-lg">{selectedImage.caption}</p>}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
