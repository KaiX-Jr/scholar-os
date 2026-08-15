"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScholarLogoButtonProps {
  onClick?: () => void;
  className?: string;
}

export const ScholarLogoButton: React.FC<ScholarLogoButtonProps> = ({
  onClick,
  className = "",
}) => {
  return (
    <motion.button
      onClick={onClick || (() => window.scrollTo({ top: 0, behavior: "smooth" }))}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 rounded-full backdrop-blur-3xl bg-[#08080f]/92 border border-white/[0.1] shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 hover:border-white/25 hover:shadow-[0_0_20px_-3px_rgba(6,182,212,0.3)] cursor-pointer select-none ${className}`}
    >
      {/* Top Specular Edge Line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Circular Isometric Quantum Prism Icon Pod (matching middle dock circle pods) */}
      <div className="relative w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shadow-inner group-hover:bg-white/[0.08] group-hover:border-cyan-400/50 transition-all shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)] group-hover:rotate-12 transition-transform duration-500"
        >
          <path
            d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z"
            stroke="url(#scholar-logo-grad)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 22V12M12 12L20.5 7M12 12L3.5 7"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeOpacity="0.85"
          />
          <circle cx="12" cy="12" r="1.5" fill="#38bdf8" className="animate-pulse" />
          <defs>
            <linearGradient
              id="scholar-logo-grad"
              x1="3.5"
              y1="2"
              x2="20.5"
              y2="22"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00f2fe" />
              <stop offset="0.5" stopColor="#6366f1" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex items-center gap-1.5 pr-1">
        <span className="text-xs font-bold tracking-wider text-white font-mono leading-none">
          SCHOLAR<span className="text-cyan-400">.OS</span>
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f2fe]" />
      </div>
    </motion.button>
  );
};
