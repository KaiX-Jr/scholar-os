"use client";

/**
 * Specular Button component inspired by React Bits (reactbits.dev)
 * Glass-style interactive button featuring a cursor-aware specular rim light and reflection.
 */

import React, { useRef, useState } from "react";
import type { HTMLMotionProps } from "framer-motion";
import { motion, useMotionValue, useMotionTemplate, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpecularButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  borderGlowColor?: string;
}

export const SpecularButton: React.FC<SpecularButtonProps> = ({
  children,
  className = "",
  glowColor = "rgba(255, 255, 255, 0.16)",
  borderGlowColor = "rgba(0, 242, 254, 0.6)",
  onClick,
  disabled = false,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinate motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for fluid specular movement
  const springX = useSpring(mouseX, { stiffness: 400, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(-100);
    mouseY.set(-100);
  };

  // Radial gradients following the cursor for border and surface specular highlights
  const surfaceBackground = useMotionTemplate`radial-gradient(circle 120px at ${springX}px ${springY}px, ${glowColor}, transparent 80%)`;
  const borderBackground = useMotionTemplate`radial-gradient(circle 90px at ${springX}px ${springY}px, ${borderGlowColor}, rgba(255, 255, 255, 0.1) 40%, transparent 80%)`;

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "group relative flex w-full items-center justify-center overflow-hidden rounded-2xl p-[1px] transition-all duration-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* Specular Rim / Border Light Layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          background: borderBackground,
          opacity: isHovered ? 1 : 0.4,
        }}
      />

      {/* Outer Default Border Fallback */}
      <div className="absolute inset-0 rounded-2xl border border-white/15 pointer-events-none" />

      {/* Button Interior Body (Glass Surface) */}
      <div className="relative flex w-full items-center justify-center gap-3 rounded-[15px] bg-[#0c0d1b]/90 px-4 py-2.5 backdrop-blur-xl transition-all duration-300 group-hover:bg-[#101226]/95">
        {/* Cursor Specular Surface Glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[15px] transition-opacity duration-300"
          style={{
            background: surfaceBackground,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Top Edge Specular Reflection (Glass highlight) */}
        <div className="pointer-events-none absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Bottom Ambient Glow */}
        <div className="pointer-events-none absolute inset-x-6 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

        {/* Button Content */}
        <div className="relative z-10 flex items-center justify-center gap-2.5 font-medium text-xs text-white">
          {children}
        </div>
      </div>
    </motion.button>
  );
};
