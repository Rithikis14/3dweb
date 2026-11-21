"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

const FRAME_COUNTS = {
  sequence1: 240,
  sequence2: 232,
};
const TOTAL_FRAMES = FRAME_COUNTS.sequence1 + FRAME_COUNTS.sequence2; // 472

export default function CanvasContainer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { scrollYProgress } = useScroll();

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    let isFirstLoaded = false;

    const loadSequence = (folder: string, count: number, offset: number) => {
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(3, "0");
        img.src = `/videos/${folder}/ezgif-frame-${paddedIndex}.jpg`;
        
        const globalIndex = offset + i - 1;

        img.onload = () => {
          imagesRef.current[globalIndex] = img;
          loadedCount++;

          // Show canvas as soon as the first frame loads so it's not blank
          if (globalIndex === 0 || loadedCount > 0) {
            if (!isFirstLoaded) {
              setLoaded(true);
              isFirstLoaded = true;
              // Draw the first frame immediately
              requestAnimationFrame(() => drawFrame(0));
            }
          }
        };

        img.onerror = (e) => {
          console.error(`Failed to load image: ${img.src}`, e);
        };
      }
    };

    loadSequence("frame1", FRAME_COUNTS.sequence1, 0);
    loadSequence("frame2", FRAME_COUNTS.sequence2, FRAME_COUNTS.sequence1);
  }, []);

  // Draw frame on canvas
  const drawFrame = (index: number) => {
    // If exact frame is missing, try to find the closest previous loaded frame
    let frameToDraw = imagesRef.current[index];
    if (!frameToDraw) {
      let fallbackIndex = index;
      while (fallbackIndex > 0 && !imagesRef.current[fallbackIndex]) {
        fallbackIndex--;
      }
      frameToDraw = imagesRef.current[fallbackIndex];
    }

    if (!frameToDraw || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = frameToDraw;

    // Resize canvas to match window size exactly
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Calculate aspect ratio covering
    const canvasRatio = canvas.width / canvas.height;
    // We want to crop the bottom portion (e.g., bottom 10%) to remove the watermark
    const CROP_RATIO = 0.1; // Crop 10% from bottom
    const imgWidth = img.width;
    const imgHeight = img.height * (1 - CROP_RATIO);
    const imgRatio = imgWidth / imgHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      // Canvas is wider than image (landscape)
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      // Canvas is taller than image (portrait)
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0, 0, img.width, imgHeight, // Source (cropped)
      offsetX, offsetY, drawWidth, drawHeight // Destination
    );
  };

  // Initial draw and resize handler
  useEffect(() => {
    const handleResize = () => {
      const latestScroll = scrollYProgress.get();
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(latestScroll * TOTAL_FRAMES)
      );
      requestAnimationFrame(() => drawFrame(frameIndex));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update frame on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!loaded) return;
    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.floor(latest * TOTAL_FRAMES)
    );
    requestAnimationFrame(() => drawFrame(frameIndex));
  });

  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-obsidian">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-cartier-gold/50 font-sans tracking-widest uppercase text-sm">
          Loading Experience...
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 1s ease" }}
      />
    </div>
  );
}
