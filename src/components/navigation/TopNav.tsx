"use client";

import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Eye,
  Activity,
  Timer,
  ChevronRight,
  Home,
  GraduationCap,
} from "lucide-react";
import { useScholarStore } from "@/store/useScholarStore";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { Dock, DockIcon, DockSeparator } from "@/components/ui/Dock";
import { InfiniteMenu } from "@/components/ui/InfiniteMenu";
import { ScholarLogoButton } from "@/components/ui/ScholarLogoButton";
import { UserProfileMenu } from "@/components/navigation/UserProfileMenu";

export const TopNav: React.FC = () => {
  const { pomodoro, openAuthModal, user } = useScholarStore();
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

  const handleUploadClick = () => {
    if (!user) {
      openAuthModal();
    } else {
      scrollTo("vision");
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 py-3.5 px-4 sm:px-6 lg:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Left: Magic UI Shiny Scholar Logo Button */}
        <ScholarLogoButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

        {/* Center: Magic UI Magnifying Dock (Desktop) */}
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
              title="Milestone &amp; Assignment Kanban"
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
          </Dock>
        </div>

        {/* Right: User Profile Menu + Infinite Menu + Action Button */}
        <div className="flex items-center gap-2.5">
          {/* User Profile Avatar / Sign In */}
          <UserProfileMenu />

          {/* React Bits Infinite Menu */}
          <InfiniteMenu />

          {/* Upload Board Capsule Action Button */}
          <button
            onClick={handleUploadClick}
            className="group relative px-3.5 py-1.5 rounded-full backdrop-blur-3xl bg-[#08080f]/92 border border-cyan-400/40 hover:border-cyan-400 text-white text-xs font-mono font-semibold shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_28px_rgba(6,182,212,0.45)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-500/30 transition-all shrink-0">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline">Upload Board</span>
            <ChevronRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
