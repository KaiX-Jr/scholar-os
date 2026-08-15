"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import { useScholarStore } from "@/store/useScholarStore";
import { InfiniteMenu } from "@/components/ui/InfiniteMenu";
import { ScholarLogoButton } from "@/components/ui/ScholarLogoButton";
import { UserProfileMenu } from "@/components/navigation/UserProfileMenu";

export const TopNav: React.FC = () => {
  const { openDailyProfessor, dailyOralQuestion } = useScholarStore();

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 py-2.5 sm:py-3.5 px-3 sm:px-6 lg:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Left: Scholar OS Logo Pill (Never clipped, prominent on both mobile & desktop) */}
        <div className="shrink-0">
          <ScholarLogoButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
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
