"use client";

import React, { useState } from "react";
import { MagicCard } from "@/components/ui/MagicCard";
import { useScholarStore } from "@/store/useScholarStore";
import { TrendingUp, Target, Award, ArrowUpRight, BarChart2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const CgpaProgressRing: React.FC = () => {
  const { user } = useScholarStore();

  const currentCgpa = user?.currentCgpa || 3.85;
  const targetCgpa = user?.targetCgpa || 3.95;
  const completedCredits = user?.completedCredits || 96;
  const totalRequiredCredits = user?.totalRequiredCredits || 128;
  const semesterGpas = [
    { semester: "Sem 1", gpa: 3.75, credits: 16 },
    { semester: "Sem 2", gpa: 3.82, credits: 16 },
    { semester: "Sem 3", gpa: 3.86, credits: 16 },
    { semester: "Sem 4", gpa: 3.94, credits: 16 },
  ];

  const [activeTab, setActiveTab] = useState<"overview" | "projection">("overview");

  // Circular gauge math (max CGPA = 4.0)
  const maxGpa = 4.0;
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const currentPercent = (currentCgpa / maxGpa) * 100;
  const strokeDashoffset = circumference - (currentPercent / 100) * circumference;

  const targetPercent = (targetCgpa / maxGpa) * 100;
  const targetDashoffset = circumference - (targetPercent / 100) * circumference;

  // Remaining calculation
  const remainingCredits = Math.max(1, totalRequiredCredits - completedCredits);
  const requiredRemainingGpa = Math.min(
    4.0,
    Math.max(
      0,
      (targetCgpa * totalRequiredCredits - currentCgpa * completedCredits) / remainingCredits
    )
  );

  return (
    <MagicCard
      gradientColor="rgba(99, 102, 241, 0.18)"
      borderBeamColorFrom="#6366f1"
      borderBeamColorTo="#a855f7"
      className="h-full flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shadow-inner">
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">CGPA Honors Trajectory</h3>
              <p className="text-xs text-slate-400">Cumulative Academic Target Model</p>
            </div>
          </div>

          <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                activeTab === "overview"
                  ? "bg-indigo-500 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("projection")}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                activeTab === "projection"
                  ? "bg-indigo-500 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Projection
            </button>
          </div>
        </div>

        {activeTab === "overview" ? (
          <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
            {/* SVG Circular Progress Gauge */}
            <div className="relative flex items-center justify-center">
              <svg height={radius * 2} width={radius * 2} className="-rotate-90">
                {/* Background Ring */}
                <circle
                  stroke="rgba(255, 255, 255, 0.08)"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                {/* Target Marker Ring (Dashed) */}
                <circle
                  stroke="rgba(168, 85, 247, 0.4)"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference} ${circumference}`}
                  style={{ strokeDashoffset: targetDashoffset }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                {/* Current CGPA Active Arc */}
                <circle
                  stroke="url(#cgpaGradient)"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference} ${circumference}`}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                />
                <defs>
                  <linearGradient id="cgpaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Text Metrics */}
              <div className="absolute flex flex-col items-center justify-center text-center select-none">
                <span className="text-2xl font-mono font-extrabold text-white tracking-tight leading-none">
                  {currentCgpa.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-widest">
                  / {maxGpa.toFixed(1)} CGPA
                </span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="flex-1 w-full space-y-3">
              <div className="p-3 rounded-2xl bg-white/[0.035] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-slate-300 font-medium">Target CGPA</span>
                </div>
                <span className="text-sm font-mono font-bold text-purple-300">
                  {targetCgpa.toFixed(2)}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.035] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-300 font-medium">Completed Credits</span>
                </div>
                <span className="text-sm font-mono font-bold text-cyan-300">
                  {completedCredits} / {totalRequiredCredits}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-indigo-300 font-semibold uppercase">
                  Required Remaining GPA
                </span>
                <Badge variant="indigo" size="sm">
                  {remainingCredits} Credits Left
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-extrabold text-white">
                  {requiredRemainingGpa.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">average required across remaining terms</span>
              </div>
            </div>

            {/* Historical Semester Progression Bars */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide block">
                Semester Historical Record
              </span>
              <div className="grid grid-cols-4 gap-2">
                {semesterGpas.map((sem: { semester: string; gpa: number; credits: number }, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center"
                  >
                    <span className="text-[10px] text-slate-400 font-mono block">{sem.semester}</span>
                    <span className="text-xs font-mono font-bold text-white block mt-0.5">
                      {sem.gpa.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Tag */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Magna Cum Laude Track
        </span>
        <span className="text-indigo-400 font-semibold">{((completedCredits / totalRequiredCredits) * 100).toFixed(0)}% Degree Done</span>
      </div>
    </MagicCard>
  );
};
