"use client";

import React from "react";
import { motion } from "framer-motion";

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
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 110,
  strokeWidth = 9,
  gradientId = "circ-grad",
  gradientFrom = "#00f2fe",
  gradientTo = "#6366f1",
  label,
  sublabel,
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Animated Progress Indicator */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
          fill="none"
          className="drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
        />
      </svg>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
        <span className="text-lg font-mono font-extrabold text-white leading-none">
          {label !== undefined ? label : `${Math.round(percentage)}%`}
        </span>
        {sublabel && (
          <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tight">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
