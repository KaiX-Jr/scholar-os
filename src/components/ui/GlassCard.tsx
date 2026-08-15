"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: "cyan" | "indigo" | "violet" | "emerald" | "rose" | "neutral";
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glowColor = "neutral",
  hoverEffect = true,
  ...props
}) => {
  const glowClasses = {
    cyan: "hover:border-cyan-500/40 hover:shadow-[0_0_35px_-5px_rgba(6,182,212,0.3)]",
    indigo: "hover:border-indigo-500/40 hover:shadow-[0_0_35px_-5px_rgba(99,102,241,0.3)]",
    violet: "hover:border-purple-500/40 hover:shadow-[0_0_35px_-5px_rgba(168,85,247,0.3)]",
    emerald: "hover:border-emerald-500/40 hover:shadow-[0_0_35px_-5px_rgba(16,185,129,0.3)]",
    rose: "hover:border-rose-500/40 hover:shadow-[0_0_35px_-5px_rgba(244,63,94,0.3)]",
    neutral: "hover:border-white/25 hover:shadow-[0_0_35px_-5px_rgba(255,255,255,0.12)]",
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl backdrop-blur-3xl overflow-hidden",
        "bg-[#0a0b16]/92 border border-white/[0.12]",
        "shadow-[0_16px_48px_rgba(0,0,0,0.7)]",
        hoverEffect && "transition-all duration-300",
        hoverEffect && glowClasses[glowColor],
        className
      )}
      {...props}
    >
      {/* Top Specular Inner Rim Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {children}
    </div>
  );
};
