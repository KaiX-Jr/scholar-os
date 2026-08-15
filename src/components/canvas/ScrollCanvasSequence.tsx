"use client";

import React, { useEffect, useRef } from "react";

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

  // Adaptive frame loading: downsample preloads on mobile to save bandwidth & memory
  useEffect(() => {
    const isMobile =
      window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;
    const step = isMobile ? 4 : 1; // Load every 4th frame on mobile (approx 62 frames instead of 250)

    const preloadedImages: HTMLImageElement[] = [];

    // Always load first frame immediately
    const firstImg = new Image();
    firstImg.src = getFramePath(1);
    firstImg.onload = () => {
      resizeCanvas();
      renderFrame(1);
    };
    preloadedImages[0] = firstImg;

    // Load remaining frames with prioritization
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      if (i % step === 0 || i === TOTAL_FRAMES) {
        const img = new Image();
        img.src = getFramePath(i);
        preloadedImages[i - 1] = img;
      }
    }

    imagesRef.current = preloadedImages;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Update target frame based on scroll and trigger rendering
  useEffect(() => {
    let isTicking = false;

    const startAnimation = () => {
      if (isTicking) return;
      isTicking = true;

      const tick = () => {
        if (document.hidden) {
          isTicking = false;
          return;
        }

        const diff = targetFrameRef.current - currentFrameRef.current;

        if (Math.abs(diff) > 0.05) {
          currentFrameRef.current += diff * 0.15;
          renderFrame(currentFrameRef.current);
          animationFrameId.current = requestAnimationFrame(tick);
        } else {
          currentFrameRef.current = targetFrameRef.current;
          renderFrame(currentFrameRef.current);
          isTicking = false;
          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
          }
        }
      };

      animationFrameId.current = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      targetFrameRef.current = 1 + progress * (TOTAL_FRAMES - 1);
      startAnimation();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
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
  );
};
