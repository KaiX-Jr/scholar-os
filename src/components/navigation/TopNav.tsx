"use client";

import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Eye,
  Activity,
  Timer,
  Home,
  GraduationCap,
} from "lucide-react";
import { useScholarStore } from "@/store/useScholarStore";
import { Dock, DockIcon, DockSeparator } from "@/components/ui/Dock";
import { InfiniteMenu } from "@/components/ui/InfiniteMenu";
import { ScholarLogoButton } from "@/components/ui/ScholarLogoButton";
import { UserProfileMenu } from "@/components/navigation/UserProfileMenu";

export const TopNav: React.FC = () => {
  const { pomodoro, openDailyProfessor, dailyOralQuestion } = useScholarStore();
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      const academicEl = document.getElementById("academic");
      const visionEl = document.getElementById("vision");
      const habitsEl = document.getElementById("habits");

      if (habitsEl && scrollPos >= habitsEl.offsetTop) {
        setActiveSection("habits");
      } else if (visionEl && scrollPos >= visionEl.offsetTop) {
        setActiveSection("vision");
      } else if (academicEl && scrollPos >= academicEl.offsetTop) {
        setActiveSection("academic");
      } else {
        setActiveSection("hero");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 py-2.5 sm:py-3.5 px-3 sm:px-6 lg:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Left: Scholar OS Logo Pill (Never clipped, prominent on both mobile & desktop) */}
        <div className="shrink-0">
          <ScholarLogoButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        </div>

        {/* Center: Magic UI Magnifying Dock (Desktop Only) */}
        <div className="hidden md:block">
          <Dock magnification={52} distance={100}>
            <DockIcon
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              isActive={activeSection === "hero"}
              title="Overview (Top)"
            >
              <Home className="w-4 h-4 text-slate-200" />
            </DockIcon>

            <DockSeparator />

            <DockIcon
              onClick={() => scrollTo("academic")}
              isActive={activeSection === "academic"}
              title="Milestone & Assignment Kanban"
            >
              <CheckSquare className="w-4 h-4 text-indigo-400" />
            </DockIcon>

            <DockIcon
              onClick={() => scrollTo("vision")}
              isActive={activeSection === "vision"}
              title="Board-to-Study Optical Studio"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
            </DockIcon>

            <DockIcon
              onClick={() => scrollTo("habits")}
              isActive={activeSection === "habits"}
              title="Cognitive Habit Matrix"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
            </DockIcon>

            <DockSeparator />

            <DockIcon
              onClick={() => scrollTo("habits")}
              title="Deep Work Focus Synthesizer"
            >
              <div className="relative flex items-center justify-center">
                <Timer className="w-4 h-4 text-purple-400" />
                {pomodoro.isRunning && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
            </DockIcon>
            <DockSeparator />

            <DockIcon
              onClick={openDailyProfessor}
              title="Daily AI Concept Quiz"
            >
              <div className="relative flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-cyan-300" />
                {(!dailyOralQuestion || !dailyOralQuestion.isCompleted) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </div>
            </DockIcon>
          </Dock>
        </div>

        {/* Right: Quick Navigation Menu + Kokonut UI User Profile */}
        <div className="shrink-0 flex items-center gap-2 sm:gap-3">
          {/* Daily Quiz Pill Button (Mobile & Desktop) */}
          <button
            onClick={openDailyProfessor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition-all shadow-[0_0_15px_rgba(0,242,254,0.15)]"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Daily AI Quiz</span>
            {(!dailyOralQuestion || !dailyOralQuestion.isCompleted) && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            )}
          </button>

          {/* React Bits Infinite Menu */}
          <InfiniteMenu />

          {/* User Profile Avatar / Sign In */}
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
};
