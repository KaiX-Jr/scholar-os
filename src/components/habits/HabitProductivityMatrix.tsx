"use client";

import React from "react";
import { HabitStreakHeatmap } from "./HabitStreakHeatmap";
import { PomodoroTimer } from "./PomodoroTimer";
import { Activity, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useScholarStore } from "@/store/useScholarStore";

export const HabitProductivityMatrix: React.FC = () => {
  return (
    <section id="habits" className="py-14 sm:py-20 scroll-mt-24 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="emerald" size="sm">
                <Activity className="w-3 h-3 text-emerald-400" />
                COGNITIVE HABIT & DEEP WORK MATRIX
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Cognitive Habit Heatmaps & Acoustic Flow
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Consistency matrix tracking across deep study, algorithmic problems, and recovery paired with real-time neuro-acoustic synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2" id="pomodoro">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono backdrop-blur-xl">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-slate-200">10Hz Alpha Binaural Preset</span>
            </div>
          </div>
        </div>

        {/* Daily Quiz Check-In Banner */}
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-[#0a0b16]/80 border border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_25px_rgba(0,242,254,0.08)]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white tracking-wide">
                  Daily AI Concept Quiz
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 uppercase">
                  Active Recall
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Answer today&apos;s daily concept question to automatically log your habit streak and boost your honors CGPA trajectory.
              </p>
            </div>
          </div>

          <button
            onClick={() => useScholarStore.getState().openDailyProfessor()}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono shrink-0 transition-all shadow-[0_0_15px_rgba(0,242,254,0.25)] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Take Daily Quiz</span>
          </button>
        </div>

        {/* Grid: Habit heatmap spans full on mobile, 2-of-3 on large */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          <HabitStreakHeatmap />
          <PomodoroTimer />
        </div>
      </div>
    </section>
  );
};

