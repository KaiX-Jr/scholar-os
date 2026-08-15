"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  CheckSquare,
  Eye,
  Activity,
  Timer,
  ArrowRight,
  Command,
} from "lucide-react";
import { useScholarStore } from "@/store/useScholarStore";

interface StaggeredMenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sublabel: string;
  tag?: string;
  action: () => void;
  color: string;
}

export const StaggeredMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pomodoro } = useScholarStore();

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      // CMD+K or CTRL+K opens the staggered menu
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scrolling when full menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  const menuItems: StaggeredMenuItem[] = [
    {
      icon: Sparkles,
      label: "Overview & Metrics",
      sublabel: "Scholar OS Hero Overview",
      tag: "Top",
      action: () => {
        setIsOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      color: "from-cyan-500 to-indigo-500",
    },
    {
      icon: CheckSquare,
      label: "Milestone & Sprint Kanban",
      sublabel: "Track problem sets, lab reports, and deadlines",
      tag: "Pipeline",
      action: () => scrollTo("academic"),
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Eye,
      label: "Board-to-Study Optical Studio",
      sublabel: "Chalkboard extractor & step solutions",
      tag: "OCR Studio",
      action: () => scrollTo("vision"),
      color: "from-cyan-400 to-indigo-400",
    },
    {
      icon: Activity,
      label: "Cognitive Habit Heatmap",
      sublabel: "120-day deep work consistency matrix",
      tag: "Habits",
      action: () => scrollTo("habits"),
      color: "from-emerald-400 to-teal-500",
    },
    {
      icon: Timer,
      label: "Deep Work Focus Synthesizer",
      sublabel: pomodoro.isRunning ? "Session Active (25:00)" : "10Hz Alpha Binaural Equalizer",
      tag: pomodoro.isRunning ? "Running" : "Ready",
      action: () => {
        scrollTo("habits");
      },
      color: "from-purple-500 to-rose-500",
    },
  ];

  // Framer motion staggered container variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.04,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: 15,
      scale: 0.96,
      transition: { duration: 0.15 },
    },
  };

  return (
    <>
      {/* Trigger Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Staggered Menu"
        className="relative group p-2.5 sm:px-3.5 sm:py-2 rounded-2xl backdrop-blur-3xl bg-[#0a0b16]/92 border border-white/[0.12] hover:border-white/30 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300 flex items-center gap-2 hover:scale-105"
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          <Menu className={`w-4 h-4 text-cyan-300 transition-all duration-300 ${isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`} />
          <X className={`w-4 h-4 text-rose-400 absolute inset-0 transition-all duration-300 ${isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`} />
        </div>
        <span className="text-xs font-semibold font-mono hidden sm:block">Menu</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Fullscreen Staggered Menu Modal / Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 backdrop-blur-3xl bg-black/85"
          >
            {/* Click outside to close */}
            <div
              className="absolute inset-0 -z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Modal Container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#0a0b16]/95 border border-white/[0.12] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden"
            >
              {/* Radial Background Spotlight */}
              <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">Scholar Navigation OS</h3>
                    <p className="text-xs text-slate-400">Staggered Workspace Navigation</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Staggered Navigation Items List */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1"
              >
                {menuItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      onClick={item.action}
                      className="group p-3.5 sm:p-4 rounded-2xl bg-white/[0.035] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-200 cursor-pointer flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} p-px shadow-inner`}>
                          <div className="w-full h-full rounded-[11px] bg-[#0b0b14] flex items-center justify-center group-hover:bg-transparent transition-colors">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                              {item.label}
                            </span>
                            {item.tag && (
                              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {item.sublabel}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Modal Footer Quick Action */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Real-time Optical OCR Synthesis
                </span>
                <span>Press ESC to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
