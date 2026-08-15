"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "cyan" | "indigo" | "violet" | "emerald" | "amber" | "rose" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "cyan",
  size = "sm",
  className,
}) => {
  const variantStyles = {
    cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20 shadow-[0_0_12px_-3px_rgba(6,182,212,0.3)]",
    indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20 shadow-[0_0_12px_-3px_rgba(99,102,241,0.3)]",
    violet: "bg-purple-500/10 text-purple-300 border-purple-500/20 shadow-[0_0_12px_-3px_rgba(168,85,247,0.3)]",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)]",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-[0_0_12px_-3px_rgba(245,158,11,0.3)]",
    rose: "bg-rose-500/10 text-rose-300 border-rose-500/20 shadow-[0_0_12px_-3px_rgba(244,63,94,0.3)]",
    neutral: "bg-white/5 text-slate-300 border-white/10",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs sm:text-sm font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md font-mono transition-all duration-200",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
