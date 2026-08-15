"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "./BorderBeam";
import {
  Eye,
  Brain,
  Headphones,
  CheckSquare,
  Activity,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  RotateCw,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface MagicBentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "indigo" | "violet" | "emerald" | "amber";
  withBorderBeam?: boolean;
  borderBeamDuration?: number;
  mousePos: { x: number; y: number };
}

export const MagicBentoCard: React.FC<MagicBentoCardProps> = ({
  children,
  className,
  glowColor = "cyan",
  withBorderBeam = false,
  borderBeamDuration = 8,
  mousePos,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [localPos, setLocalPos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setLocalPos({
      x: mousePos.x - rect.left,
      y: mousePos.y - rect.top,
    });
  }, [mousePos]);

  const glowGradients = {
    cyan: "rgba(0, 242, 254, 0.18)",
    indigo: "rgba(99, 102, 241, 0.18)",
    violet: "rgba(168, 85, 247, 0.18)",
    emerald: "rgba(16, 185, 129, 0.18)",
    amber: "rgba(245, 158, 11, 0.18)",
  };

  const beamColors = {
    cyan: { from: "#00f2fe", to: "#38bdf8" },
    indigo: { from: "#6366f1", to: "#a855f7" },
    violet: { from: "#a855f7", to: "#ec4899" },
    emerald: { from: "#10b981", to: "#34d399" },
    amber: { from: "#f59e0b", to: "#fbbf24" },
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-3xl backdrop-blur-2xl",
        "bg-gradient-to-b from-white/[0.07] via-white/[0.025] to-[#090914]/90",
        "border border-white/[0.1] shadow-[0_16px_40px_rgba(0,0,0,0.6)]",
        "hover:border-white/25 transition-all duration-300",
        className
      )}
    >
      {/* React Bits Shared Global Grid Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0.4,
          background: `radial-gradient(500px circle at ${localPos.x}px ${localPos.y}px, ${glowGradients[glowColor]}, transparent 65%)`,
        }}
      />

      {/* Top Specular Inner Rim Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Magic UI Border Beam */}
      {withBorderBeam && (
        <BorderBeam
          size={260}
          duration={borderBeamDuration}
          colorFrom={beamColors[glowColor].from}
          colorTo={beamColors[glowColor].to}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10 p-6 sm:p-7 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

export const MagicBentoGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="bento" className="py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              REACT BITS × MAGIC UI BENTO
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Integrated Scholar OS Architecture
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Multimodal optical OCR, active recall decks, binaural acoustic flow, and agile milestone pipelines engineered into a unified workspace.
            </p>
          </div>

          <span className="text-xs text-slate-400 font-mono hidden md:block">
            5 Core Cognitive Modules
          </span>
        </div>

        {/* Global Spotlight Interactive Bento Grid */}
        <div
          ref={gridRef}
          onMouseMove={handleMouseMove}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {/* =========================================================================
              CARD 1: Multimodal Blackboard OCR & KaTeX (2 cols on lg)
          ========================================================================== */}
          <MagicBentoCard
            mousePos={mousePos}
            glowColor="cyan"
            withBorderBeam
            className="md:col-span-2 lg:col-span-2 min-h-[300px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shadow-inner">
                  <Eye className="w-5 h-5 text-cyan-400" />
                </div>
                <Badge variant="cyan" size="sm">
                  Multimodal Vision
                </Badge>
              </div>

              <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider block mb-1">
                Multimodal Optical Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                "Board-to-Study" Chalkboard Synthesis
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Instantly extract handwritten theorems, differential operators, and complex diagrams into formatted LaTeX Markdown and step-by-step mathematical proofs.
              </p>

              {/* Simulated Formula Chip Preview */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] font-mono text-xs text-cyan-300 flex items-center justify-between shadow-inner">
                <span>iℏ ∂ψ/∂t = (-ℏ²/2m ∇² + V)ψ</span>
                <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">KaTeX Clean</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <button
                onClick={() => scrollTo("vision")}
                className="text-xs font-semibold text-cyan-300 hover:text-white flex items-center gap-1.5 group-hover:translate-x-1 transition-all"
              >
                <span>Launch Vision Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400">14ms Optical Stream</span>
            </div>
          </MagicBentoCard>

          {/* =========================================================================
              CARD 2: Active Recall Flashcard Deck (1 col)
          ========================================================================== */}
          <MagicBentoCard
            mousePos={mousePos}
            glowColor="indigo"
            className="md:col-span-1 lg:col-span-1 min-h-[300px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shadow-inner">
                  <Brain className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-xs text-indigo-300 font-mono flex items-center gap-1">
                  <RotateCw className="w-3 h-3" /> 3D Flip
                </span>
              </div>

              <span className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider block mb-1">
                Spaced Repetition
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                Active Recall Deck
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Auto-generated concept cards with SuperMemo-2 spaced intervals and 3D card tilt physics.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Mastery Level:</span>
              <span className="font-bold text-emerald-400 font-mono">88% Retained</span>
            </div>
          </MagicBentoCard>

          {/* =========================================================================
              CARD 3: 10Hz Alpha Neuro-Acoustics (1 col)
          ========================================================================== */}
          <MagicBentoCard
            mousePos={mousePos}
            glowColor="violet"
            className="md:col-span-1 lg:col-span-1 min-h-[300px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shadow-inner">
                  <Headphones className="w-5 h-5 text-purple-400" />
                </div>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              </div>

              <span className="text-[11px] font-mono text-purple-300 uppercase tracking-wider block mb-1">
                Neuro-Acoustics
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                Deep Work Synthesizer
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                10Hz Alpha and 6Hz Theta binaural frequency waves designed for flow states.
              </p>

              {/* Animated Mini Soundwave Bars */}
              <div className="flex items-end gap-1 h-8 px-2 py-1 rounded-lg bg-black/40 border border-white/[0.06]">
                {[40, 70, 90, 60, 100, 75, 45, 85, 95, 60, 80, 50].map((h, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${h}%` }}
                    className="flex-1 rounded-full bg-gradient-to-t from-purple-600 to-cyan-400 animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Preset: 432Hz Alpha</span>
              <span className="text-cyan-300">Active</span>
            </div>
          </MagicBentoCard>

          {/* =========================================================================
              CARD 4: Milestone & Task Kanban (1 col)
          ========================================================================== */}
          <MagicBentoCard
            mousePos={mousePos}
            glowColor="amber"
            className="md:col-span-1 lg:col-span-1 min-h-[300px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-inner">
                  <CheckSquare className="w-5 h-5 text-amber-400" />
                </div>
                <Badge variant="amber" size="sm">
                  Kanban
                </Badge>
              </div>

              <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider block mb-1">
                Milestone Pipeline
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                Sprint Tracking
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Agile assignment Kanban with priority weights, deadlines, and celebration confetti.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Completion:</span>
              <span className="font-bold text-amber-300 font-mono">4 / 6 Done</span>
            </div>
          </MagicBentoCard>

          {/* =========================================================================
              CARD 5: 120-Day Cognitive Habit Matrix (2 cols on lg)
          ========================================================================== */}
          <MagicBentoCard
            mousePos={mousePos}
            glowColor="emerald"
            withBorderBeam
            className="md:col-span-2 lg:col-span-3 min-h-[300px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shadow-inner">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono border border-emerald-500/30">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  18-Day Streak Active
                </span>
              </div>

              <span className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider block mb-1">
                Long-Horizon Consistency
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                120-Day Cognitive Habit Heatmap
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 max-w-2xl">
                Daily deep work tracking across algorithmic problem solving, research reading, physical conditioning, and hydration metrics.
              </p>

              {/* Mini Heatmap Matrix Dots Preview */}
              <div className="grid grid-cols-16 sm:grid-cols-20 gap-1.5 p-3 rounded-2xl bg-black/40 border border-white/[0.08] shadow-inner max-w-full overflow-hidden">
                {Array.from({ length: 60 }).map((_, idx) => {
                  const level = (idx * 7) % 4;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "w-3 h-3 rounded-sm transition-all duration-300",
                        level === 0 && "bg-white/[0.06]",
                        level === 1 && "bg-emerald-500/30",
                        level === 2 && "bg-emerald-500/60",
                        level === 3 && "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]"
                      )}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <button
                onClick={() => scrollTo("habits")}
                className="text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-1.5 group-hover:translate-x-1 transition-all"
              >
                <span>View Full Habit Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400">91.8% Habit Velocity</span>
            </div>
          </MagicBentoCard>
        </div>
      </div>
    </section>
  );
};
