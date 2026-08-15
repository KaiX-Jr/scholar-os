"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "./BorderBeam";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientColor?: string;
  gradientSize?: number;
  borderBeamColorFrom?: string;
  borderBeamColorTo?: string;
  borderBeamDuration?: number;
  withTilt?: boolean;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className,
  gradientColor = "rgba(0, 242, 254, 0.2)",
  gradientSize = 400,
  borderBeamColorFrom = "#00f2fe",
  borderBeamColorTo = "#6366f1",
  borderBeamDuration = 8,
  withTilt = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });

    if (withTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      setTilt({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: -1000, y: -1000 });
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: withTilt && isHovered
          ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl p-6 sm:p-7 backdrop-blur-3xl",
        "bg-[#0a0b16]/92 border border-white/[0.12]",
        "shadow-[0_16px_48px_rgba(0,0,0,0.7)]",
        "hover:border-white/25 transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* React Bits Mouse Spotlight Radial Gradient */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${gradientSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${gradientColor}, transparent 70%)`,
        }}
      />

      {/* Top Specular Inner Rim Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Magic UI Rotating Border Beam */}
      <BorderBeam
        size={250}
        duration={borderBeamDuration}
        colorFrom={borderBeamColorFrom}
        colorTo={borderBeamColorTo}
      />

      {/* Content Container */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
