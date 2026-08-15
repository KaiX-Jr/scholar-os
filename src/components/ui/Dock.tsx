"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DockProps {
  className?: string;
  magnification?: number;
  distance?: number;
  children: React.ReactNode;
}

const DEFAULT_MAGNIFICATION = 54;
const DEFAULT_DISTANCE = 120;

export const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      magnification = DEFAULT_MAGNIFICATION,
      distance = DEFAULT_DISTANCE,
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            mouseX: mouseX,
            magnification: magnification,
            distance: distance,
          } as any);
        }
        return child;
      });
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...props}
        className={cn(
          "mx-auto flex h-[52px] items-center gap-1.5 rounded-full border border-white/[0.12] p-1.5 backdrop-blur-2xl bg-[#090912]/85 shadow-[0_12px_40px_rgba(0,0,0,0.6)]",
          className
        )}
      >
        {renderChildren()}
      </motion.div>
    );
  }
);

Dock.displayName = "Dock";

export interface DockIconProps {
  size?: number;
  magnification?: number;
  distance?: number;
  mouseX?: any;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  title?: string;
  isActive?: boolean;
}

export const DockIcon = ({
  size = 38,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  onClick,
  title,
  isActive = false,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const defaultMouseX = useMotionValue(Infinity);
  const effectiveMouseX = mouseX || defaultMouseX;

  const distanceCalc = useTransform(effectiveMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, magnification, size]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onClick={onClick}
      className={cn(
        "relative flex cursor-pointer items-center justify-center rounded-full transition-colors select-none",
        isActive
          ? "bg-white/[0.18] text-white shadow-inner"
          : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.1] hover:text-white",
        className
      )}
      title={title}
      {...props}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
      )}
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export const DockSeparator = () => (
  <div className="w-px h-5 bg-white/10 self-center mx-0.5 shrink-0" />
);
