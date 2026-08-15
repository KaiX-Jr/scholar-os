"use client";

import React from "react";
import { motion } from "framer-motion";

interface KokonutToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  activeColor?: string;
  className?: string;
}

export const KokonutToggle: React.FC<KokonutToggleProps> = ({
  checked,
  onChange,
  label,
  size = "md",
  activeColor = "from-cyan-400 to-indigo-500",
  className = "",
}) => {
  const dimensions = {
    sm: { track: "w-9 h-5", thumb: "w-3.5 h-3.5", translate: 16 },
    md: { track: "w-12 h-6", thumb: "w-4.5 h-4.5", translate: 24 },
    lg: { track: "w-14 h-7", thumb: "w-5.5 h-5.5", translate: 28 },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${className}`} onClick={() => onChange(!checked)}>
      <div
        className={`relative ${dimensions.track} rounded-full p-0.5 transition-all duration-300 backdrop-blur-xl border ${
          checked
            ? `bg-gradient-to-r ${activeColor} border-white/30 shadow-[0_0_15px_rgba(6,182,212,0.4)]`
            : "bg-white/[0.06] border-white/10"
        }`}
      >
        <motion.div
          animate={{ x: checked ? dimensions.translate : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`${dimensions.thumb} rounded-full bg-white shadow-md flex items-center justify-center`}
        >
          {checked && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          )}
        </motion.div>
      </div>
      {label && <span className="text-xs text-slate-300 font-medium">{label}</span>}
    </div>
  );
};
