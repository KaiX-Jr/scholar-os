"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  LogOut,
  RotateCcw,
  BookOpen,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useScholarStore } from "@/store/useScholarStore";
import { AvatarDisplay } from "@/components/auth/AvatarPicker";

export const UserProfileMenu: React.FC = () => {
  const { user, openAuthModal, openOnboarding, logout, resetAllData } =
    useScholarStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!user) {
    return (
      <button
        onClick={openAuthModal}
        className="group px-3 py-1.5 rounded-full backdrop-blur-3xl bg-[#08080f]/92 border border-white/[0.1] hover:border-white/25 text-slate-200 hover:text-white text-xs font-mono font-medium shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:scale-105 transition-all flex items-center gap-2"
      >
        <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan-300 group-hover:bg-white/[0.08]">
          <Sparkles className="w-3 h-3" />
        </div>
        <span className="pr-1">Sign In</span>
      </button>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SC";

  return (
    <div ref={menuRef} className="relative">
      {/* User Avatar Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-full backdrop-blur-3xl bg-[#08080f]/92 border border-white/[0.1] hover:border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all hover:scale-105"
      >
        <AvatarDisplay avatarId={user.avatarId || 1} size={24} />
        <div className="text-left hidden sm:block">
          <span className="text-xs font-bold text-white block leading-none truncate max-w-[90px]">
            {user.name.split(" ")[0]}
          </span>
        </div>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform ${
            isOpen ? "rotate-180 text-cyan-300" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-xs sm:w-72 rounded-3xl backdrop-blur-3xl bg-[#0a0b16]/95 border border-white/[0.15] shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-4 overflow-hidden"
          >
            {/* Top Specular Line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Profile Info Header */}
            <div className="pb-3 mb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <AvatarDisplay avatarId={user.avatarId || 1} size={40} className="rounded-2xl" />
                <div className="min-w-0">
                  <span className="text-sm font-bold text-white block truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-slate-400 font-mono block truncate">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Academic Badges */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-left">
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <span className="text-[9px] font-mono text-slate-400 uppercase block">
                    Campus
                  </span>
                  <span className="text-[11px] font-semibold text-white truncate block">
                    {user.university || "University"}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <span className="text-[9px] font-mono text-slate-400 uppercase block">
                    Target CGPA
                  </span>
                  <span className="text-[11px] font-semibold text-cyan-300 font-mono block">
                    {user.targetCgpa.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Actions */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  openOnboarding();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2.5 transition-all text-left"
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Manage Enrolled Courses</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  if (
                    confirm(
                      "Reset all workspace data? This will clear courses, attendance, and habit logs back to Day 0 zero state."
                    )
                  ) {
                    resetAllData();
                  }
                }}
                className="w-full p-2.5 rounded-xl hover:bg-rose-500/15 text-slate-300 hover:text-rose-300 text-xs font-mono flex items-center gap-2.5 transition-all text-left"
              >
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Reset Data to Zero State</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2.5 transition-all text-left"
              >
                <LogOut className="w-4 h-4 text-slate-400" />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
