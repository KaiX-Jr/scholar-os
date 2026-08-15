"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopNav } from "@/components/navigation/TopNav";
import { AcademicCommandCenter } from "@/components/academic/AcademicCommandCenter";
import { BoardToStudyStudio } from "@/components/vision/BoardToStudyStudio";
import { HabitProductivityMatrix } from "@/components/habits/HabitProductivityMatrix";
import { DailyProfessorOralCheckin } from "@/components/tutor/DailyProfessorOralCheckin";
import { AnimatedShinyText } from "@/components/ui/AnimatedShinyText";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { MagicCard } from "@/components/ui/MagicCard";
import { PulsatingButton } from "@/components/ui/PulsatingButton";
import { InteractiveHoverButton } from "@/components/ui/InteractiveHoverButton";
import { useScholarStore } from "@/store/useScholarStore";
import {
  Sparkles,
  Eye,
  ArrowRight,
  ChevronDown,
  Gauge,
  Clock,
  Zap,
  BookOpen,
  GraduationCap,
  Award,
} from "lucide-react";

export const ScrollDashboardOverlay: React.FC = () => {
  const { user, courses, openAuthModal } = useScholarStore();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpticalClick = () => {
    if (!user) {
      openAuthModal();
    } else {
      scrollTo("vision");
    }
  };

  // Calculate dynamic stats from real user data
  const totalClasses = courses.reduce((acc, c) => acc + c.total, 0);
  const totalAttended = courses.reduce((acc, c) => acc + c.attended, 0);
  const overallAttendancePct =
    totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
  const isAttendanceSafe = totalClasses > 0 && overallAttendancePct >= 75;

  const rawTarget = user?.targetCgpa || 9.0;
  const targetCgpa = rawTarget <= 4.0 ? Number((rawTarget * 2.5).toFixed(2)) : rawTarget;
  const maxCgpa = 10.0;
  const cgpaPercentage = (targetCgpa / maxCgpa) * 100;

  return (
    <div className="relative w-full text-white">
      {/* Fixed Top Navigation Bar */}
      <TopNav />

      {/* =========================================================================
          SECTION 1: HERO SECTION
      ========================================================================== */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 text-center"
      >
        <div className="flex-1 flex flex-col items-center justify-center my-auto">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-3xl bg-[#0a0b16]/90 border border-white/[0.15] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] mb-8"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold tracking-widest text-cyan-300 uppercase">
              {user ? `${user.university} • ${user.semester}` : "Next-Gen Academic OS"}
            </span>
          </motion.div>

          {/* Main Headline with Magic UI Text Shimmer */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-4xl"
          >
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              The Cognitive Operating System for
            </span>{" "}
            <AnimatedShinyText className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent" shimmerWidth={180}>
              Scholars.
            </AnimatedShinyText>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-200 max-w-2xl leading-relaxed px-2 sm:px-0"
          >
            Turn classroom blackboard photos into organized study notes, stay on top of your assignments and attendance, and build daily study habits.
          </motion.p>

          {/* CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0"
          >
            <PulsatingButton
              onClick={() => scrollTo("academic")}
              className="py-3.5 sm:py-4 px-7 sm:px-8 text-sm font-bold w-full sm:w-auto"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </PulsatingButton>

            <InteractiveHoverButton
              onClick={handleOpticalClick}
              className="py-3 sm:py-3.5 px-6 sm:px-7 w-full sm:w-auto"
            >
              {user ? "Scan Blackboard" : "Try Board Scanner"}
            </InteractiveHoverButton>
          </motion.div>
        </div>

        {/* Hero Bottom Metric Cards with Magic UI Circular Progress & Border Beam */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto w-full mt-10 sm:mt-14 text-left"
        >
          {/* Card 1: Target CGPA Goal & Academic Benchmark */}
          <MagicCard
            gradientColor="rgba(99, 102, 241, 0.25)"
            borderBeamColorFrom="#6366f1"
            borderBeamColorTo="#a855f7"
            className="flex flex-col justify-between p-6 sm:p-7 relative overflow-hidden"
          >
            <BorderBeam size={250} duration={12} delay={0} colorFrom="#6366f1" colorTo="#a855f7" />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-indigo-300 uppercase tracking-widest block mb-1">
                  Academic Trajectory
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Target CGPA Benchmark
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xs">
                  {user
                    ? `Enrolled at ${user.university} (${user.semester})`
                    : "Zero-state baseline for honors honors tier"}
                </p>
              </div>

              {/* Magic UI Animated Circular Progress Meter */}
              <CircularProgress
                value={cgpaPercentage}
                max={100}
                size={86}
                strokeWidth={7}
                gradientFrom="#6366f1"
                gradientTo="#a855f7"
                label={`${targetCgpa.toFixed(2)}`}
                sublabel="CGPA"
              />
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>Honors Goal: {targetCgpa.toFixed(2)} / 10.00</span>
              </span>
              <span className="text-indigo-300 font-semibold">
                {courses.length} Active Courses
              </span>
            </div>
          </MagicCard>

          {/* Card 2: Real-Time Attendance Rate & 75% Threshold */}
          <MagicCard
            gradientColor="rgba(0, 242, 254, 0.25)"
            borderBeamColorFrom="#00f2fe"
            borderBeamColorTo="#10b981"
            className="flex flex-col justify-between p-6 sm:p-7 relative overflow-hidden"
          >
            <BorderBeam size={250} duration={12} delay={6} colorFrom="#00f2fe" colorTo="#10b981" />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest block mb-1">
                  Attendance Monitor
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Semester Attendance
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xs">
                  {totalClasses > 0
                    ? `${totalAttended} of ${totalClasses} lectures logged`
                    : "0 classes recorded — Ready to log"}
                </p>
              </div>

              {/* Magic UI Animated Circular Progress Meter */}
              <CircularProgress
                value={overallAttendancePct}
                max={100}
                size={86}
                strokeWidth={7}
                gradientFrom="#00f2fe"
                gradientTo="#10b981"
                label={totalClasses > 0 ? `${Math.round(overallAttendancePct)}%` : `0%`}
                sublabel={totalClasses > 0 ? "Total" : "Zero-State"}
              />
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    totalClasses === 0
                      ? "bg-slate-400"
                      : isAttendanceSafe
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-rose-400 animate-ping"
                  }`}
                />
                <span
                  className={
                    totalClasses === 0
                      ? "text-slate-400 font-semibold"
                      : isAttendanceSafe
                      ? "text-emerald-300 font-semibold"
                      : "text-rose-300 font-semibold"
                  }
                >
                  {totalClasses === 0
                    ? "0 Classes Logged (75% Target)"
                    : isAttendanceSafe
                    ? "75% Threshold Cleared"
                    : "Attendance Deficit Alert"}
                </span>
              </span>
              <span className="text-slate-400">
                {totalClasses > 0 ? "Daily Logging Active" : "No Attendance Data"}
              </span>
            </div>
          </MagicCard>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => scrollTo("academic")}
            className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-cyan-300 text-xs font-mono transition-colors"
          >
            <span className="text-[10px] tracking-widest uppercase">Explore Modules</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ACADEMIC COMMAND CENTER (Milestones + Dynamic Attendance)
      ========================================================================== */}
      <AcademicCommandCenter />

      {/* =========================================================================
          SECTION 3: "BOARD-TO-STUDY" OPTICAL STUDIO
      ========================================================================== */}
      <BoardToStudyStudio />

      {/* =========================================================================
          SECTION 4: COGNITIVE HABIT MATRIX & DEEP WORK
      ========================================================================== */}
      <HabitProductivityMatrix />

      {/* Daily Professor Oral Check-In Studio Modal */}
      <DailyProfessorOralCheckin />

      {/* =========================================================================
          SECTION 5: CLEAN FOOTER
      ========================================================================== */}
      <footer className="relative py-10 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white">SCHOLAR.OS</span>
          <span>— Cognitive Operating System</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>Next.js 14+</span>
          <span>•</span>
          <span>Optical OCR Engine</span>
          <span>•</span>
          <span>KaTeX Rigor</span>
        </div>
      </footer>
    </div>
  );
};
