"use client";

import React, { useState } from "react";
import { useScholarStore } from "@/store/useScholarStore";
import { HabitCategory, HabitDay } from "@/types/scholar";
import {
  Flame,
  BookOpen,
  Code2,
  Droplets,
  Clock,
  Plus,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { KokonutToggle } from "@/components/ui/KokonutToggle";

export const HabitStreakHeatmap: React.FC = () => {
  const { habitStreaks, logHabit, toggleHabitToday } = useScholarStore();
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>("study");
  const [selectedDay, setSelectedDay] = useState<HabitDay | null>(null);

  const activeStreak = habitStreaks[selectedCategory];

  const categories: {
    id: HabitCategory;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    unit: string;
  }[] = [
    { id: "study", name: "Deep Study", icon: BookOpen, color: "#00f2fe", unit: "hrs" },
    { id: "coding", name: "Algorithms", icon: Code2, color: "#6366f1", unit: "hrs" },
    { id: "attendance", name: "Lectures", icon: Clock, color: "#10b981", unit: "classes" },
    { id: "hydration", name: "Hydration", icon: Droplets, color: "#38bdf8", unit: "ml" },
  ];

  // Intensity color palettes per category for glowing liquid glass squares
  const getIntensityClass = (level: number, cat: HabitCategory) => {
    if (level === 0) return "bg-white/[0.04] border-white/[0.05] hover:border-white/25";

    if (cat === "study" || cat === "hydration") {
      switch (level) {
        case 1:
          return "bg-cyan-950/80 border-cyan-800/40 text-cyan-400";
        case 2:
          return "bg-cyan-700/80 border-cyan-500/50 text-cyan-200";
        case 3:
          return "bg-cyan-500 border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]";
        case 4:
          return "bg-cyan-300 border-white shadow-[0_0_14px_rgba(0,242,254,0.8)]";
        default:
          return "bg-cyan-500";
      }
    } else if (cat === "coding") {
      switch (level) {
        case 1:
          return "bg-indigo-950/80 border-indigo-800/40";
        case 2:
          return "bg-indigo-700/80 border-indigo-500/50";
        case 3:
          return "bg-indigo-500 border-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]";
        case 4:
          return "bg-indigo-300 border-white shadow-[0_0_14px_rgba(99,102,241,0.8)]";
        default:
          return "bg-indigo-500";
      }
    } else {
      switch (level) {
        case 1:
          return "bg-emerald-950/80 border-emerald-800/40";
        case 2:
          return "bg-emerald-700/80 border-emerald-500/50";
        case 3:
          return "bg-emerald-500 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
        case 4:
          return "bg-emerald-300 border-white shadow-[0_0_14px_rgba(16,185,129,0.8)]";
        default:
          return "bg-emerald-500";
      }
    }
  };

  // Group 112 days into 16 columns of 7 days (weeks)
  const days = activeStreak?.history || [];
  const weeks: HabitDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const todayEntry = days.find((d) => d.date === todayStr);
  const isLoggedToday = (todayEntry?.count || 0) > 0;

  const handleDayClick = (day: HabitDay) => {
    setSelectedDay(day);
    // Cycle intensity 0 -> 1 -> 2 -> 3 -> 4 -> 0
    const nextIntensity = (day.count + 1) % 5;
    const unitMultiplier =
      selectedCategory === "hydration" ? 750 : selectedCategory === "study" ? 1.5 : 1;
    const nextUnits = nextIntensity * unitMultiplier;
    logHabit(selectedCategory, day.date, nextIntensity, nextUnits);
  };

  const totalLoggedUnits = days.reduce((acc, d) => acc + d.hoursOrUnits, 0);

  return (
    <div className="relative rounded-3xl backdrop-blur-3xl bg-[#0a0b16]/92 border border-white/[0.12] shadow-[0_16px_48px_rgba(0,0,0,0.7)] p-6 sm:p-7 h-full flex flex-col justify-between overflow-hidden col-span-1 lg:col-span-2">
      {/* Top Specular Line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div>
        {/* Header & Streak Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <Flame className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  120-Day Consistency Heatmap
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                  {activeStreak?.currentStreak || 0}-Day Streak
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-category habit velocity & deep work tracking
              </p>
            </div>
          </div>

          {/* Quick Check-in for Today */}
          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-xs font-mono text-slate-300">Log Today:</span>
            <KokonutToggle
              checked={isLoggedToday}
              onChange={() => toggleHabitToday(selectedCategory)}
              size="sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const streak = habitStreaks[cat.id]?.currentStreak || 0;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedDay(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? "bg-white/[0.12] text-white border border-white/30 shadow-md"
                    : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:bg-white/[0.06]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] rounded-md ${
                    streak > 0
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {streak}d
                </span>
              </button>
            );
          })}
        </div>

        {/* 16-Week Heatmap Grid */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] overflow-x-auto">
          <div className="flex gap-1.5 min-w-[580px] justify-between">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5 flex-1">
                {week.map((day, dIdx) => {
                  const isToday = day.date === todayStr;
                  return (
                    <button
                      key={dIdx}
                      onClick={() => handleDayClick(day)}
                      title={`${day.date}: Level ${day.count} (${day.hoursOrUnits} ${activeStreak?.targetUnit})`}
                      className={`w-full aspect-square rounded-md border transition-all duration-200 ${getIntensityClass(
                        day.count,
                        selectedCategory
                      )} ${isToday ? "ring-2 ring-white/60" : ""}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click any block to cycle intensity (0 → 4)</span>
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">Less</span>
            <div className="w-3 h-3 rounded bg-white/[0.04] border border-white/10" />
            <div className="w-3 h-3 rounded bg-cyan-950 border border-cyan-800" />
            <div className="w-3 h-3 rounded bg-cyan-700 border border-cyan-500" />
            <div className="w-3 h-3 rounded bg-cyan-500 border border-cyan-300" />
            <div className="w-3 h-3 rounded bg-cyan-300 border-white" />
            <span className="text-[10px]">More</span>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
        <span className="text-slate-300">
          Total Logged:{" "}
          <strong className="text-white font-bold">
            {totalLoggedUnits.toFixed(1)} {activeStreak?.targetUnit}
          </strong>
        </span>
        <span className="text-emerald-400">
          Longest Streak: {activeStreak?.longestStreak || 0} days
        </span>
      </div>
    </div>
  );
};
