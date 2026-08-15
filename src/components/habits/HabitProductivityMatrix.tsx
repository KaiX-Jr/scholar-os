"use client";

import React from "react";
import { HabitStreakHeatmap } from "./HabitStreakHeatmap";
import { PomodoroTimer } from "./PomodoroTimer";
import { Activity, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

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

        {/* Grid: Habit heatmap spans full on mobile, 2-of-3 on large */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          <HabitStreakHeatmap />
          <PomodoroTimer />
        </div>
      </div>
    </section>
  );
};
