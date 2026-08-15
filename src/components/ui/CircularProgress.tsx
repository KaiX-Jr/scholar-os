"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0 to 100
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  gradientId?: string;
  gradientFrom?: string;
  gradientTo?: string;
  label?: string;
  sublabel?: string;
  className?: string;
  glowColor?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 110,
  strokeWidth = 8,
  gradientId = "circ-grad",
  gradientFrom = "#00f2fe",
  gradientTo = "#6366f1",
  label,
  sublabel,
  className = "",
  glowColor,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const activeGlow = glowColor || gradientFrom;

  return (
    <div
      className={cn("relative flex items-center justify-center shrink-0 select-none", className)}
      style={{ width: size, height: size }}
    >
      {/* 1. Immersive Ambient Circular Glow (No square artifacts) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-xl opacity-30 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${activeGlow} 0%, transparent 70%)`,
        }}
      />

      {/* 2. Frosted Circular Glass Lens Backing */}
      <div className="absolute inset-1 rounded-full bg-[#0a0b16]/60 backdrop-blur-md border border-white/[0.08] shadow-[inset_0_0_12px_rgba(255,255,255,0.03)]" />

      {/* 3. SVG Progress Ring */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 relative z-10 overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
          {/* Native SVG Blur Filter for ultra-smooth glow without rectangular composite box */}
          <filter id={`${gradientId}-blur`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Outer Glow Halo Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth + 2}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="none"
          opacity={0.35}
          filter={`url(#${gradientId}-blur)`}
        />

        {/* Crisp Foreground Progress Indicator */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* 4. Center Metrics Floating within Lens */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
        <span className="text-base sm:text-lg font-mono font-extrabold text-white tracking-tight leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {label !== undefined ? label : `${Math.round(percentage)}%`}
        </span>
        {sublabel && (
          <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest leading-none font-semibold">
            {sublabel}
          </span>
        )}
      </div>

      {/* 5. Top Specular Glare Arc on the Glass Lens */}
      <div className="pointer-events-none absolute inset-x-3 top-1 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-full z-30" />
    </div>
  );
};
