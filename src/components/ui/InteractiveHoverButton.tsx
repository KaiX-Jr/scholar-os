"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative inline-flex cursor-pointer items-center justify-center rounded-full backdrop-blur-3xl bg-[#08080f]/92 border border-white/[0.12] hover:border-white/30 px-6 py-3 text-center font-mono text-xs sm:text-sm font-semibold text-slate-200 hover:text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]",
        className
      )}
      {...props}
    >
      {/* Specular line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:bg-cyan-400 group-hover:scale-125 transition-all shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
        <span>{children || text}</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
