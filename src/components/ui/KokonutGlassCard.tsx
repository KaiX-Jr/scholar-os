"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface KokonutGlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "indigo" | "purple" | "emerald" | "amber";
  withSpecularLine?: boolean;
  onClick?: () => void;
}

export const KokonutGlassCard: React.FC<KokonutGlassCardProps> = ({
  children,
  className = "",
  glowColor = "cyan",
  withSpecularLine = true,
  onClick,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowColors = {
    cyan: "rgba(6, 182, 212, 0.15)",
    indigo: "rgba(99, 102, 241, 0.15)",
    purple: "rgba(168, 85, 247, 0.15)",
    emerald: "rgba(16, 185, 129, 0.15)",
    amber: "rgba(245, 158, 11, 0.15)",
  }[glowColor];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative rounded-3xl backdrop-blur-3xl bg-[#0a0b16]/92 border border-white/[0.12] shadow-[0_16px_48px_rgba(0,0,0,0.7)] transition-colors duration-300 overflow-hidden ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Dynamic Cursor Spotlight (React Bits & Kokonut UI) */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColors}, transparent 80%)`,
          }}
        />
      )}

      {/* Top Specular Line Highlight */}
      {withSpecularLine && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
