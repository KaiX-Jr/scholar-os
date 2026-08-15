"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
}

export const PulsatingButton = React.forwardRef<
  HTMLButtonElement,
  PulsatingButtonProps
>(
  (
    {
      className,
      children,
      pulseColor = "rgba(0, 242, 254, 0.35)",
      duration = "3s",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex cursor-pointer items-center justify-center rounded-full backdrop-blur-3xl bg-[#08080f]/92 border border-cyan-400/50 hover:border-cyan-300 px-6 py-3 text-center text-xs sm:text-sm font-mono font-bold text-white shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_24px_rgba(6,182,212,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_35px_rgba(6,182,212,0.55)]",
          className
        )}
        {...props}
      >
        {/* Specular line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
        
        <div className="relative z-10 flex items-center gap-2.5">{children}</div>
        
        {/* Subtle pulsating aura */}
        <div
          className="absolute inset-0 -z-10 animate-ping rounded-full opacity-30 pointer-events-none"
          style={{
            backgroundColor: pulseColor,
            animationDuration: duration,
          }}
        />
      </button>
    );
  }
);

PulsatingButton.displayName = "PulsatingButton";
