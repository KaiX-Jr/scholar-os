"use client";

/**
 * @author: @kokonutui
 * @description: Profile Dropdown from Kokonut UI adapted for ScholarOS
 * @website: https://kokonutui.com
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  LogOut,
  RotateCcw,
  BookOpen,
  Sparkles,
  Award,
  Compass,
} from "lucide-react";
import { useScholarStore } from "@/store/useScholarStore";
import { AvatarDisplay } from "@/components/auth/AvatarPicker";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  value?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "badge" | "danger";
  badgeColor?: string;
}

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
        className="group px-3.5 py-1.5 rounded-full backdrop-blur-3xl bg-[#08080f]/92 border border-white/[0.1] hover:border-white/25 text-slate-200 hover:text-white text-xs font-mono font-medium shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:scale-105 transition-all flex items-center gap-2"
      >
        <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan-300 group-hover:bg-white/[0.08]">
          <Sparkles className="w-3 h-3" />
        </div>
        <span className="pr-1">Sign In</span>
      </button>
    );
  }

  const menuItems: MenuItem[] = [
    {
      label: "Campus",
      value: user.university || "University",
      icon: <GraduationCap className="h-4 w-4 text-cyan-400" />,
      badgeColor: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    },
    {
      label: "Semester",
      value: user.semester || "Semester 1",
      icon: <Compass className="h-4 w-4 text-sky-400" />,
      badgeColor: "border-sky-500/20 bg-sky-500/10 text-sky-300",
    },
    {
      label: "Target CGPA",
      value: user.targetCgpa ? user.targetCgpa.toFixed(2) : "3.90",
      icon: <Award className="h-4 w-4 text-purple-400" />,
      badgeColor: "border-purple-500/20 bg-purple-500/10 text-purple-300",
    },
    {
      label: "Manage Courses",
      icon: <BookOpen className="h-4 w-4 text-indigo-400" />,
      onClick: () => {
        setIsOpen(false);
        openOnboarding();
      },
    },
    {
      label: "Reset Data to Zero State",
      icon: <RotateCcw className="h-4 w-4 text-amber-400" />,
      onClick: () => {
        setIsOpen(false);
        if (
          confirm(
            "Reset all workspace data? This will clear courses, attendance, and habit logs back to Day 0 zero state."
          )
        ) {
          resetAllData();
        }
      },
    },
  ];

  return (
    <div ref={menuRef} className="relative">
      <div className="group relative">
        {/* Kokonut UI Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className={cn(
            "flex items-center gap-3.5 sm:gap-5 rounded-2xl border border-white/[0.1] bg-[#090a15]/95 p-2 sm:p-2.5 transition-all duration-200 hover:border-white/25 hover:bg-[#0e0f1f] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] focus:outline-none",
            isOpen && "border-cyan-400/40 bg-[#0e0f1f] shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          )}
        >
          <div className="text-left min-w-0 max-w-[110px] sm:max-w-[140px] pl-1">
            <div className="font-semibold text-xs text-white leading-tight tracking-tight truncate">
              {user.name}
            </div>
            <div className="text-[10px] text-slate-400 font-mono leading-tight tracking-tight truncate mt-0.5">
              {user.email}
            </div>
          </div>

          {/* Avatar with Kokonut UI Gradient Ring */}
          <div className="relative shrink-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[1.5px] shadow-[0_0_12px_rgba(236,72,153,0.3)]">
              <div className="h-full w-full overflow-hidden rounded-full bg-[#08080f] flex items-center justify-center">
                <AvatarDisplay avatarId={user.avatarId || 1} size={32} />
              </div>
            </div>
          </div>
        </button>

        {/* Kokonut UI Bending Line Indicator */}
        <div
          className={cn(
            "absolute top-1/2 -right-2.5 -translate-y-1/2 transition-all duration-200 pointer-events-none hidden sm:block",
            isOpen ? "opacity-100" : "opacity-40 group-hover:opacity-80"
          )}
        >
          <svg
            aria-hidden="true"
            className={cn(
              "transition-all duration-200",
              isOpen
                ? "scale-110 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]"
                : "text-slate-500 group-hover:text-slate-300"
            )}
            fill="none"
            height="20"
            viewBox="0 0 12 24"
            width="10"
          >
            <path
              d="M2 4C6 8 6 16 2 20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Kokonut UI Animated Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-14 z-50 w-72 origin-top-right rounded-2xl border border-white/[0.12] bg-[#0a0b16]/98 p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            {/* Specular line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

            <div className="space-y-1">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  onClick={item.onClick}
                  className={cn(
                    "group flex items-center rounded-xl border border-transparent p-2.5 transition-all duration-200",
                    item.onClick
                      ? "cursor-pointer hover:border-white/10 hover:bg-white/[0.05]"
                      : "bg-white/[0.02]"
                  )}
                >
                  <div className="flex flex-1 items-center gap-2.5 min-w-0">
                    <div className="shrink-0">{item.icon}</div>
                    <span className="truncate font-medium text-xs text-slate-200 transition-colors group-hover:text-white">
                      {item.label}
                    </span>
                  </div>
                  {item.value && (
                    <div className="ml-auto shrink-0">
                      <span
                        className={cn(
                          "rounded-md border px-2 py-0.5 font-mono font-medium text-[11px] tracking-tight block truncate max-w-[110px]",
                          item.badgeColor || "border-white/10 bg-white/5 text-slate-300"
                        )}
                      >
                        {item.value}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Kokonut UI Gradient Separator */}
            <div className="my-2.5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Kokonut UI Sign Out Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="group flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-transparent bg-red-500/10 p-2.5 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/20"
              type="button"
            >
              <LogOut className="h-4 w-4 text-red-400 transition-transform group-hover:translate-x-0.5" />
              <span className="font-semibold text-red-400 text-xs font-mono">
                Sign Out
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
