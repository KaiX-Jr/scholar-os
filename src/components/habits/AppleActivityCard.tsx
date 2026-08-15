"use client";

import React, { useState } from "react";
import { MagicCard } from "@/components/ui/MagicCard";
import {
  Flame,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  Plus,
  BookOpen,
  Code2,
  Timer,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface ActivityRingMetric {
  id: "study" | "algorithms" | "focus";
  name: string;
  current: number;
  target: number;
  unit: string;
  colorFrom: string;
  colorTo: string;
  trackColor: string;
  shadowColor: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export const AppleActivityCard: React.FC = () => {
  const [activeMetricId, setActiveMetricId] = useState<"study" | "algorithms" | "focus">("study");

  const [metrics, setMetrics] = useState<{
    study: { current: number; target: number };
    algorithms: { current: number; target: number };
    focus: { current: number; target: number };
  }>({
    study: { current: 5.4, target: 6.0 },
    algorithms: { current: 9, target: 10 },
    focus: { current: 7, target: 8 },
  });

  const [streakDays, setStreakDays] = useState(18);

  const ringConfigs: ActivityRingMetric[] = [
    {
      id: "study",
      name: "Deep Study",
      current: metrics.study.current,
      target: metrics.study.target,
      unit: "Hours",
      colorFrom: "#ff2d55",
      colorTo: "#ff375f",
      trackColor: "rgba(255, 45, 85, 0.15)",
      shadowColor: "rgba(255, 45, 85, 0.5)",
      icon: BookOpen,
    },
    {
      id: "algorithms",
      name: "Algorithms",
      current: metrics.algorithms.current,
      target: metrics.algorithms.target,
      unit: "Problem Sets",
      colorFrom: "#30d158",
      colorTo: "#34c759",
      trackColor: "rgba(48, 209, 88, 0.15)",
      shadowColor: "rgba(48, 209, 88, 0.5)",
      icon: Code2,
    },
    {
      id: "focus",
      name: "Focus Sessions",
      current: metrics.focus.current,
      target: metrics.focus.target,
      unit: "Pomodoros",
      colorFrom: "#00f2fe",
      colorTo: "#0a84ff",
      trackColor: "rgba(10, 132, 255, 0.15)",
      shadowColor: "rgba(10, 132, 255, 0.5)",
      icon: Timer,
    },
  ];

  // SVG Geometry for concentric rings
  const center = 110;
  const strokeWidth = 14;
  const gap = 4;

  const radii = {
    study: 90,
    algorithms: 90 - (strokeWidth + gap),
    focus: 90 - (strokeWidth + gap) * 2,
  };

  const getRingOffset = (current: number, target: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(1.5, current / target);
    return circumference - progress * circumference;
  };

  const incrementMetric = (id: "study" | "algorithms" | "focus", delta: number) => {
    setMetrics((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        current: Number((prev[id].current + delta).toFixed(1)),
      },
    }));
  };

  // Weekly Activity Trend Data
  const weeklyTrend = [
    { day: "M", study: 92, algo: 80, focus: 100 },
    { day: "T", study: 100, algo: 100, focus: 85 },
    { day: "W", study: 85, algo: 90, focus: 75 },
    { day: "T", study: 110, algo: 100, focus: 100 },
    { day: "F", study: 95, algo: 85, focus: 90 },
    { day: "S", study: 70, algo: 60, focus: 80 },
    { day: "S", study: 90, algo: 90, focus: 88 },
  ];

  const activeMetric = ringConfigs.find((m) => m.id === activeMetricId) || ringConfigs[0];
  const activePct = Math.round((activeMetric.current / activeMetric.target) * 100);

  return (
    <MagicCard
      gradientColor="rgba(255, 45, 85, 0.12)"
      borderBeamColorFrom="#ff2d55"
      borderBeamColorTo="#00f2fe"
      className="col-span-1 lg:col-span-2 p-6 sm:p-7"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/[0.08] gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500/20 via-emerald-500/20 to-cyan-500/20 border border-white/15 flex items-center justify-center shadow-inner">
            <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Apple Activity Rings</h3>
              <Badge variant="rose" size="sm">
                Kokonut UI
              </Badge>
            </div>
            <p className="text-xs text-slate-400">Daily cognitive habit closure & streak velocity</p>
          </div>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-white font-bold">{streakDays}-Day Streak</span>
          <span className="text-slate-400">• 94% Consistency</span>
        </div>
      </div>

      {/* Main Body: Concentric Rings + Metrics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left (Col 1-5): SVG Apple Concentric Activity Rings */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative py-2">
          <div className="relative w-[220px] h-[220px] flex items-center justify-center">
            <svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              className="-rotate-90 drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]"
            >
              <defs>
                {/* Gradients for each ring */}
                <linearGradient id="ringStudyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff2d55" />
                  <stop offset="100%" stopColor="#ff375f" />
                </linearGradient>
                <linearGradient id="ringAlgoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#30d158" />
                  <stop offset="100%" stopColor="#34c759" />
                </linearGradient>
                <linearGradient id="ringFocusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="100%" stopColor="#0a84ff" />
                </linearGradient>
              </defs>

              {/* Ring 1 (Outer - Move / Study) */}
              <circle
                cx={center}
                cy={center}
                r={radii.study}
                stroke={ringConfigs[0].trackColor}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx={center}
                cy={center}
                r={radii.study}
                stroke="url(#ringStudyGrad)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * radii.study}
                style={{
                  strokeDashoffset: getRingOffset(metrics.study.current, metrics.study.target, radii.study),
                  transition: "stroke-dashoffset 0.8s ease-in-out",
                }}
              />

              {/* Ring 2 (Middle - Exercise / Algorithms) */}
              <circle
                cx={center}
                cy={center}
                r={radii.algorithms}
                stroke={ringConfigs[1].trackColor}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx={center}
                cy={center}
                r={radii.algorithms}
                stroke="url(#ringAlgoGrad)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * radii.algorithms}
                style={{
                  strokeDashoffset: getRingOffset(metrics.algorithms.current, metrics.algorithms.target, radii.algorithms),
                  transition: "stroke-dashoffset 0.8s ease-in-out",
                }}
              />

              {/* Ring 3 (Inner - Stand / Focus Pomodoro) */}
              <circle
                cx={center}
                cy={center}
                r={radii.focus}
                stroke={ringConfigs[2].trackColor}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx={center}
                cy={center}
                r={radii.focus}
                stroke="url(#ringFocusGrad)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * radii.focus}
                style={{
                  strokeDashoffset: getRingOffset(metrics.focus.current, metrics.focus.target, radii.focus),
                  transition: "stroke-dashoffset 0.8s ease-in-out",
                }}
              />
            </svg>

            {/* Inner Ring Center Stat */}
            <div className="absolute flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {activePct}%
              </span>
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400">
                {activeMetric.name}
              </span>
            </div>
          </div>

          <span className="text-[11px] text-slate-400 font-mono mt-3">
            Click cards on right to inspect & log
          </span>
        </div>

        {/* Right (Col 6-12): Interactive Metric Tiles & Quick Log */}
        <div className="md:col-span-7 space-y-3">
          {ringConfigs.map((ring) => {
            const Icon = ring.icon;
            const isSelected = activeMetricId === ring.id;
            const pct = Math.round((ring.current / ring.target) * 100);

            return (
              <div
                key={ring.id}
                onClick={() => setActiveMetricId(ring.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-white/[0.08] border-white/25 shadow-lg scale-[1.01]"
                    : "bg-white/[0.025] border-white/[0.08] hover:bg-white/[0.05] hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: ring.trackColor }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {ring.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Target: {ring.target} {ring.unit}/day
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono text-sm font-extrabold text-white block">
                        {ring.current} <span className="text-[10px] text-slate-400">/ {ring.target}</span>
                      </span>
                      <span
                        className="text-[11px] font-mono font-bold"
                        style={{ color: ring.colorFrom }}
                      >
                        {pct}% Completed
                      </span>
                    </div>

                    {/* Quick Log Increment Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        incrementMetric(ring.id, ring.id === "study" ? 0.5 : 1);
                      }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 shadow-sm"
                      title={`Add +1 ${ring.unit}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Mini Bar */}
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${Math.min(100, pct)}%`,
                      backgroundColor: ring.colorFrom,
                      boxShadow: `0 0 10px ${ring.shadowColor}`,
                    }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: Weekly 7-Day Activity Matrix Trend */}
      <div className="mt-6 pt-5 border-t border-white/[0.08]">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            7-Day Activity Ring History
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Goals Met (6/7 Days)
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weeklyTrend.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex flex-col items-center gap-1.5 hover:border-white/20 transition-all"
            >
              <span className="text-[10px] font-mono text-slate-400">{item.day}</span>
              <div className="flex items-end gap-1 h-12 w-full justify-center">
                {/* 3 mini bars corresponding to the 3 rings */}
                <div
                  style={{ height: `${Math.min(100, item.study)}%` }}
                  className="w-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(255,45,85,0.4)]"
                  title={`Study: ${item.study}%`}
                />
                <div
                  style={{ height: `${Math.min(100, item.algo)}%` }}
                  className="w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,199,89,0.4)]"
                  title={`Algorithms: ${item.algo}%`}
                />
                <div
                  style={{ height: `${Math.min(100, item.focus)}%` }}
                  className="w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,242,254,0.4)]"
                  title={`Focus: ${item.focus}%`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MagicCard>
  );
};
