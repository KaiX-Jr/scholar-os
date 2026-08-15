"use client";

import React from "react";
import { motion } from "framer-motion";

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* React Bits Dynamic Aurora Atmosphere Layer */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30">
        <motion.div
          animate={{
            scale: [1, 1.2, 1.05, 1],
            x: [0, 60, -40, 0],
            y: [0, -50, 30, 0],
            rotate: [0, 15, -10, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-cyan-500/25 via-indigo-600/20 to-purple-600/15 blur-[130px]"
        />

        <motion.div
          animate={{
            scale: [1.1, 0.95, 1.15, 1.1],
            x: [0, -70, 50, 0],
            y: [0, 40, -60, 0],
            rotate: [0, -20, 15, 0],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[35%] -right-[15%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-bl from-purple-500/20 via-pink-500/15 to-cyan-400/20 blur-[140px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 0.95, 1],
            x: [0, 40, -50, 0],
            y: [0, -30, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-500/20 to-indigo-600/15 blur-[150px]"
        />

        {/* Ambient Grid overlay pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {children}
    </div>
  );
};
