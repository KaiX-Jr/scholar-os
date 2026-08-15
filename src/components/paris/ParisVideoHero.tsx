"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Plane, Compass, Wind, Eye, ArrowDown, Sparkles, MapPin, Gauge } from "lucide-react";

interface ParisVideoHeroProps {
  onExploreClick: () => void;
}

export const ParisVideoHero: React.FC<ParisVideoHeroProps> = ({ onExploreClick }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Load video metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration || 5);
      setIsVideoLoaded(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, []);

  // Update video currentTime based on scroll position with smooth interpolation
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setCurrentProgress(latest);
    const video = videoRef.current;
    if (video && video.duration) {
      // Seek video frame
      video.currentTime = latest * video.duration;
    }
  });

  // Dynamic telemetry transforms based on scroll
  const altitude = Math.round(34000 - currentProgress * 32800);
  const speed = Math.round(540 - currentProgress * 380);

  // Text phase opacities
  const title1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.35], [1, 1, 0]);
  const title1Y = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

  const title2Opacity = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, 1, 0]);
  const title2Y = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [30, 0, -30]);

  const title3Opacity = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 1, 1]);
  const title3Y = useTransform(scrollYProgress, [0.7, 0.85], [30, 0]);

  return (
    <div id="flight-hero" ref={containerRef} className="relative h-[300vh] bg-black">
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Video (Scroll Scrubbed) */}
        <video
          ref={videoRef}
          src="/assets/plane-window.mp4"
          playsInline
          muted
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none brightness-[0.85] contrast-[1.08]"
        />

        {/* Fallback Image Crossfade if video is buffering */}
        <div
          style={{
            opacity: isVideoLoaded ? 0 : 1,
            backgroundImage: `url('/assets/paris-hero-1.jpg')`,
          }}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 select-none pointer-events-none"
        />

        {/* Cinematic Vignette & Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none" />

        {/* Top Floating Flight HUD */}
        <div className="absolute top-24 inset-x-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between pointer-events-none">
          {/* Left: Flight Telemetry Pill */}
          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-2xl text-xs flex items-center gap-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-amber-400 -rotate-45" />
              <div>
                <span className="text-[10px] text-slate-400 font-mono block">FLIGHT PATH</span>
                <span className="font-mono font-bold text-white tracking-wider">AF 0107 • CDG</span>
              </div>
            </div>

            <div className="w-px h-6 bg-white/15" />

            <div>
              <span className="text-[10px] text-slate-400 font-mono block">ALTITUDE</span>
              <span className="font-mono font-bold text-amber-300">
                {altitude.toLocaleString()} FT
              </span>
            </div>

            <div className="w-px h-6 bg-white/15" />

            <div>
              <span className="text-[10px] text-slate-400 font-mono block">AIRSPEED</span>
              <span className="font-mono font-bold text-cyan-300">{speed} KTS</span>
            </div>
          </div>

          {/* Right: City Coordinates & Sunset Condition */}
          <div className="hidden md:flex p-3 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-2xl text-xs items-center gap-3 shadow-2xl">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">COORDINATES</span>
              <span className="font-mono text-white text-[11px]">48°51&apos;24&quot; N, 2°21&apos;07&quot; E</span>
            </div>
            <div className="w-px h-6 bg-white/15" />
            <div className="text-right">
              <span className="text-[10px] text-amber-300 font-mono block">GOLDEN HOUR</span>
              <span className="font-mono text-slate-300 text-[11px]">21°C • Sunset Sky</span>
            </div>
          </div>
        </div>

        {/* Center Floating Text - Phase 1: High Altitude Cloud Flight */}
        <motion.div
          style={{ opacity: title1Opacity, y: title1Y }}
          className="absolute z-20 max-w-4xl mx-auto px-6 text-center pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 backdrop-blur-xl mb-4 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-mono font-medium tracking-widest text-amber-300 uppercase">
              The Grand Parisian Sojourn
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-extrabold tracking-widest text-white uppercase drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            PARIS
          </h1>

          <p className="mt-4 text-base sm:text-xl text-slate-200 font-light tracking-wide max-w-2xl mx-auto drop-shadow-md">
            Experience the timeless elegance, golden twilight, and iconic skyline from 30,000 feet down to the cobblestone avenues.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-amber-300 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            SCROLL TO DESCEND THROUGH THE CLOUDS
          </div>
        </motion.div>

        {/* Center Floating Text - Phase 2: Banking over Île-de-France */}
        <motion.div
          style={{ opacity: title2Opacity, y: title2Y }}
          className="absolute z-20 max-w-4xl mx-auto px-6 text-center pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-xl mb-3">
            <span className="text-xs font-mono text-cyan-300">APPROACH VECTOR • 12,000 FT</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-wide uppercase drop-shadow-2xl">
            Where History Meets The Sky
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Glimpse the gleaming curves of the Seine River, Haussmannian boulevards, and the silhouette of the Eiffel Tower parting the mist.
          </p>
        </motion.div>

        {/* Center Floating Text - Phase 3: Final Approach & Touchdown */}
        <motion.div
          style={{ opacity: title3Opacity, y: title3Y }}
          className="absolute z-20 max-w-4xl mx-auto px-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 backdrop-blur-xl mb-4">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono font-medium text-emerald-300 tracking-wider uppercase">
              Arrived in Paris • City of Lights
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-wide uppercase drop-shadow-2xl">
            Bienvenue à Paris
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-xl mx-auto">
            Discover curated world-class monuments, Michelin-starred gastronomy, private Seine yachts, and your AI Paris concierge.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
            <button
              onClick={onExploreClick}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-black text-xs font-bold uppercase tracking-widest shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:scale-105 transition-all duration-300"
            >
              Explore Parisian Monuments
            </button>
          </div>
        </motion.div>

        {/* Bottom Scroll Indicator */}
        <div className="absolute bottom-8 inset-x-0 z-20 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
          <span className="text-[10px] font-mono tracking-widest uppercase mb-1.5 text-slate-400">
            Scroll Progress: {Math.round(currentProgress * 100)}%
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-amber-400" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
