"use client";

import React, { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 250;

// Format frame index to 3-digit padded string (e.g. 1 -> "001")
const getFramePath = (index: number) => {
  const paddedIndex = String(index).padStart(3, "0");
  return `/frames/frame_${paddedIndex}.jpg`;
};

export const ScrollCanvasSequence: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(1);
  const animationFrameId = useRef<number | null>(null);

  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Draw frame with ultra-sharp object-fit: cover and high-quality smoothing
  const renderFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const clampedIndex = Math.min(Math.max(Math.round(frameIndex), 1), TOTAL_FRAMES);
    const img = imagesRef.current[clampedIndex - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || 2560;
    const imgHeight = img.naturalHeight || 1440;

    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = imgWidth / imgHeight;

    let renderWidth: number;
    let renderHeight: number;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      renderWidth = canvasWidth;
      renderHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - renderHeight) / 2;
    } else {
      renderWidth = canvasHeight * imgRatio;
      renderHeight = canvasHeight;
      offsetX = (canvasWidth - renderWidth) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  };

  // Resize canvas for sharp rendering using DevicePixelRatio (HiDPI / Retina)
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    renderFrame(currentFrameRef.current);
  };

  // Preload all frames on mount
  useEffect(() => {
    let count = 0;
    const preloadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);

      img.onload = () => {
        count++;
        setLoadedCount(count);

        // Render first frame as soon as it's ready
        if (i === 1) {
          resizeCanvas();
          renderFrame(1);
        }

        if (count === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        count++;
        setLoadedCount(count);
        if (count === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      preloadedImages.push(img);
    }

    imagesRef.current = preloadedImages;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Update target frame based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      targetFrameRef.current = 1 + progress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Animation Loop (Smooth Lerp)
  useEffect(() => {
    // Initial draw
    resizeCanvas();
    renderFrame(1);

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      // Lerp smoothing factor
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.12;
        renderFrame(currentFrameRef.current);
      }

      animationFrameId.current = requestAnimationFrame(tick);
    };

    animationFrameId.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const loadPercent = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <>
      {/* Fixed Sticky Background Canvas (z-0) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen pointer-events-none z-0"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Preloader Screen with Frosted Glass Styling */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08080c]/90 backdrop-blur-md text-white select-none">
          <div className="w-72 p-6 rounded-2xl backdrop-blur-2xl bg-white/[0.04] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] space-y-4 text-center">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="tracking-wider">CACHING 2.5K FRAMES</span>
              <span className="font-bold text-cyan-400">{loadPercent}%</span>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-150 ease-out rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                style={{ width: `${loadPercent}%` }}
              />
            </div>

            <p className="text-[11px] font-mono text-slate-400">
              {loadedCount} / {TOTAL_FRAMES} high-res frames in memory
            </p>
          </div>
        </div>
      )}
    </>
  );
};
