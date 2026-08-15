"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles,
  ArrowDown,
  BrainCircuit,
  Eye,
  GraduationCap,
  Activity,
  Zap,
  Code2,
} from "lucide-react";
import { SplineGlassHero } from "./SplineGlassHero";
import { Badge } from "@/components/ui/Badge";

export const HeroSection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scroll driven transforms for hero container
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.88]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, -60]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const scrollToVision = () => {
    const el = document.getElementById("vision");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAcademic = () => {
    const el = document.getElementById("academic");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background Refractive Grid & Light Blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center"
      >
        {/* Top Floating Intelligence Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-cyan-400/20 backdrop-blur-xl shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono text-cyan-300 font-medium tracking-wide">
              MULTIMODAL AI VISION ENGINE
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-mono text-slate-300">NEO-OBSIDIAN OS</span>
          </div>
        </motion.div>

        {/* 3D Glass Artifact Hero Object */}
        <div className="w-full max-w-[420px] h-[280px] sm:h-[320px] mb-4">
          <SplineGlassHero mousePos={mousePos} />
        </div>

        {/* Hero Title with Chromatic Shimmer Gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 max-w-4xl"
        >
          The Cognitive Operating System{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
            for Scholars.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-slate-300/90 max-w-2xl font-normal leading-relaxed"
        >
          Turn classroom blackboard photos into organized notes, track your assignments & attendance, and build consistent daily study habits.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={scrollToVision}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-sm text-white overflow-hidden shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Eye className="relative z-10 w-4 h-4" />
            <span className="relative z-10 font-semibold tracking-wide">
              Scan Blackboard
            </span>
          </button>

          <button
            onClick={scrollToAcademic}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:scale-[1.02]"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            Explore Dashboard
          </button>
        </motion.div>

        {/* Quick Feature Pillars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full max-w-4xl"
        >
          {[
            {
              icon: BrainCircuit,
              title: "Board-to-Study AI",
              desc: "LaTeX & KaTeX Extraction",
              accent: "text-cyan-400",
            },
            {
              icon: GraduationCap,
              title: "CGPA & Attendance",
              desc: "Predictive Target Tracking",
              accent: "text-indigo-400",
            },
            {
              icon: Activity,
              title: "Habit Heatmap",
              desc: "120-Day Cognitive Streaks",
              accent: "text-emerald-400",
            },
            {
              icon: Zap,
              title: "Deep Work Synth",
              desc: "Binaural Audio Waveforms",
              accent: "text-purple-400",
            },
          ].map((feat, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md flex flex-col items-center text-center hover:border-white/15 transition-all"
            >
              <feat.icon className={`w-5 h-5 ${feat.accent} mb-1.5`} />
              <span className="text-xs font-semibold text-white">{feat.title}</span>
              <span className="text-[11px] text-slate-400 mt-0.5">{feat.desc}</span>
            </div>
          ))}
        </motion.div>

        {/* Scroll Guide Indicator */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-12 flex flex-col items-center text-slate-400 cursor-pointer"
          onClick={scrollToAcademic}
        >
          <span className="text-[11px] font-mono tracking-wider text-slate-400 mb-1">
            SCROLL TO DOCK INTO DASHBOARD
          </span>
          <ArrowDown className="w-4 h-4 text-cyan-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};
