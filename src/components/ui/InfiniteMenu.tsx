"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  CheckSquare,
  Eye,
  Activity,
  Timer,
  BookOpen,
  ArrowRight,
  Command,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
} from "lucide-react";
import { useScholarStore } from "@/store/useScholarStore";

interface InfiniteMenuItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  targetId: string;
}

const MENU_ITEMS: InfiniteMenuItem[] = [
  {
    id: "hero",
    title: "Scholar OS Overview",
    category: "01 / HOME",
    description: "Next-gen academic workspace hero & cognitive throughput metrics.",
    icon: Sparkles,
    color: "#00f2fe",
    gradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
    targetId: "hero",
  },
  {
    id: "academic",
    title: "Milestone & Sprint Kanban",
    category: "02 / PIPELINE",
    description: "Agile assignment board with priority tiers, deadlines & celebration confetti.",
    icon: CheckSquare,
    color: "#6366f1",
    gradient: "from-indigo-500/20 via-purple-500/20 to-pink-500/20",
    targetId: "academic",
  },
  {
    id: "vision",
    title: "Board-to-Study Optical Studio",
    category: "03 / OCR STUDIO",
    description: "Real-time blackboard theorem extraction, KaTeX derivations & recall cards.",
    icon: Eye,
    color: "#38bdf8",
    gradient: "from-sky-500/20 via-cyan-500/20 to-teal-500/20",
    targetId: "vision",
  },
  {
    id: "habits",
    title: "120-Day Habit Matrix",
    category: "04 / CONSISTENCY",
    description: "Multi-category streak velocity tracking across deep study & problem sets.",
    icon: Activity,
    color: "#10b981",
    gradient: "from-emerald-500/20 via-green-500/20 to-teal-500/20",
    targetId: "habits",
  },
  {
    id: "pomodoro",
    title: "Deep Work Focus Synth",
    category: "05 / ACOUSTICS",
    description: "10Hz Alpha / 6Hz Theta binaural audio synthesis & Pomodoro flow timer.",
    icon: Timer,
    color: "#a855f7",
    gradient: "from-purple-500/20 via-violet-500/20 to-rose-500/20",
    targetId: "habits",
  },
];

export const InfiniteMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalItems = MENU_ITEMS.length;

  // Keyboard shortcut: Cmd+K / Ctrl+K / Esc / Arrow Keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (isOpen) {
        if (e.key === "ArrowRight") {
          setActiveIndex((prev) => (prev + 1) % totalItems);
        } else if (e.key === "ArrowLeft") {
          setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
        } else if (e.key === "Enter") {
          handleSelect(MENU_ITEMS[activeIndex]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, totalItems]);

  // Prevent background scroll when infinite menu overlay is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleSelect = (item: InfiniteMenuItem) => {
    setIsOpen(false);
    setTimeout(() => {
      if (item.targetId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(item.targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 150);
  };

  // Touch swipe interaction for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diffX) > 40) {
      if (diffX < 0) {
        setActiveIndex((prev) => (prev + 1) % totalItems);
      } else {
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
      }
    }
  };

  // Wheel scroll interaction
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 20) {
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        if (delta > 0) {
          setActiveIndex((prev) => (prev + 1) % totalItems);
        } else {
          setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
        }
      }
    },
    [totalItems]
  );

  return (
    <>
      {/* Trigger Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Infinite Menu"
        className={`group relative px-3 py-1.5 rounded-full backdrop-blur-3xl transition-all duration-300 flex items-center gap-2 border shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${
          isOpen
            ? "bg-[#0b0c18] border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-white"
            : "bg-[#08080f]/92 border-white/[0.1] hover:border-white/25 text-slate-200 hover:text-white hover:scale-105"
        }`}
      >
        <div className="relative w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.08] shrink-0">
          <Menu
            className={`w-3.5 h-3.5 text-cyan-300 transition-all duration-300 ${
              isOpen ? "rotate-90 opacity-0 scale-75" : "rotate-0 opacity-100 scale-100"
            }`}
          />
          <X
            className={`w-3.5 h-3.5 text-rose-400 absolute inset-0 m-auto transition-all duration-300 ${
              isOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-75"
            }`}
          />
        </div>
        <span className="text-xs font-semibold font-mono hidden sm:block">Menu</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded-full">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Infinite Carousel 3D Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 backdrop-blur-3xl bg-black/85 select-none"
            onWheel={handleWheel}
          >
            {/* Ambient Background Spotlights */}
            <div className="pointer-events-none absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
            <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[140px]" />

            {/* Top Bar / Header */}
            <div className="w-full max-w-6xl flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                    Scholar Navigation OS
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Continuous Workspace Carousel</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                  <MoveHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Scroll or drag left/right</span>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white border border-white/10 transition-all hover:scale-105"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center: 3D Cylindrical Infinite Menu Track */}
            <div
              ref={containerRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-full max-w-6xl flex items-center justify-center my-auto py-4 sm:py-8 overflow-visible"
            >
              <div className="relative flex items-center justify-center w-full h-[320px] sm:h-[400px]">
                {MENU_ITEMS.map((item, idx) => {
                  const Icon = item.icon;
                  // Calculate distance from activeIndex with continuous wrapping
                  let distance = idx - activeIndex;
                  if (distance < -Math.floor(totalItems / 2)) distance += totalItems;
                  if (distance > Math.floor(totalItems / 2)) distance -= totalItems;

                  const isActive = distance === 0;
                  const isVisible = Math.abs(distance) <= 2;

                  if (!isVisible) return null;

                  // Infinite positioning (flatter on mobile for 60fps performance)
                  const translateX = distance * (typeof window !== "undefined" && window.innerWidth < 640 ? 220 : 280);
                  const scale = isActive ? 1 : 0.84 - Math.abs(distance) * 0.08;
                  const opacity = isActive ? 1 : 0.4 - Math.abs(distance) * 0.15;

                  return (
                    <motion.div
                      key={item.id}
                      onClick={() => (isActive ? handleSelect(item) : setActiveIndex(idx))}
                      animate={{
                        x: translateX,
                        scale: scale,
                        opacity: opacity,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className={`absolute w-[82vw] sm:w-80 h-[310px] sm:h-[380px] rounded-3xl p-5 sm:p-7 backdrop-blur-xl border transition-colors duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
                        isActive
                          ? "bg-[#0a0b16]/95 border-cyan-400/50 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.2)] z-30 ring-1 ring-cyan-400/40"
                          : "bg-[#0a0b16]/80 border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.5)] z-10 hover:border-white/20"
                      }`}
                    >
                      {/* Top Specular Line */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                      {/* Card Header */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} border border-white/15 flex items-center justify-center shadow-inner`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                            {item.category}
                          </span>
                        </div>

                        <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-2">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Footer Action */}
                      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                        <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 group">
                          <span>{isActive ? "Jump to Section" : "Select Module"}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls: Navigation Arrows & Indicator Pips */}
            <div className="w-full max-w-xl flex flex-col items-center gap-4 z-10">
              {/* Indicator Pips */}
              <div className="flex items-center gap-2">
                {MENU_ITEMS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? "w-8 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems)}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all hover:scale-105 shadow-md flex items-center gap-1 text-xs font-mono"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                <button
                  onClick={() => handleSelect(MENU_ITEMS[activeIndex])}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 transition-all"
                >
                  Enter Section
                </button>

                <button
                  onClick={() => setActiveIndex((prev) => (prev + 1) % totalItems)}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all hover:scale-105 shadow-md flex items-center gap-1 text-xs font-mono"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
