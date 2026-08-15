"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  shimmerWidth?: number;
}

export const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({
  children,
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-block bg-gradient-to-r from-white via-cyan-200 via-indigo-200 to-white bg-[200%_auto] bg-clip-text text-transparent animate-gradient-text",
        className
      )}
    >
      {children}
    </span>
  );
};

export const TextShimmer: React.FC<{ children: string; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-block bg-[linear-gradient(110deg,#94a3b8,45%,#ffffff,55%,#94a3b8)] bg-[length:250%_100%] bg-clip-text text-transparent animate-shimmer",
        className
      )}
    >
      {children}
    </span>
  );
};
