"use client";

/**
 * Avatar Picker inspired by Kokonut UI
 * Animated SVG avatar selection with colored ring, built with Framer Motion
 * @see https://kokonutui.com/docs/inputs/avatar-picker
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

// --- SVG Avatar Definitions ---
// Each avatar is a unique procedurally-generated face (Boring Avatars style)

interface AvatarDef {
  id: number;
  ringColor: string; // For selection ring
  bgColor: string;
  accentColor: string;
  transform: string;
  faceTranslate: string;
  faceRotate: string;
  eyeColor: string;
}

const AVATARS: AvatarDef[] = [
  { id: 1, ringColor: "255, 0, 91",    bgColor: "#ff005b", accentColor: "#ffb238", transform: "translate(9 -5) rotate(219 18 18) scale(1)",    faceTranslate: "4.5 -4", faceRotate: "9",   eyeColor: "#000" },
  { id: 2, ringColor: "255, 125, 16",   bgColor: "#ff7d10", accentColor: "#0a0310", transform: "translate(5 -1) rotate(55 18 18) scale(1.1)",   faceTranslate: "7 -6",   faceRotate: "-5",  eyeColor: "#fff" },
  { id: 3, ringColor: "137, 252, 179",  bgColor: "#89fcb3", accentColor: "#00a5ce", transform: "translate(0 -1) rotate(200 18 18) scale(1.1)",  faceTranslate: "2 -4",   faceRotate: "15",  eyeColor: "#000" },
  { id: 4, ringColor: "100, 100, 255",  bgColor: "#6464ff", accentColor: "#ff63a5", transform: "translate(-3 3) rotate(130 18 18) scale(1)",    faceTranslate: "6 -2",   faceRotate: "-8",  eyeColor: "#fff" },
  { id: 5, ringColor: "255, 193, 7",    bgColor: "#ffc107", accentColor: "#1a237e", transform: "translate(2 -6) rotate(290 18 18) scale(1.05)", faceTranslate: "3 -3",   faceRotate: "12",  eyeColor: "#000" },
  { id: 6, ringColor: "0, 230, 180",    bgColor: "#00e6b4", accentColor: "#3d1a78", transform: "translate(-2 2) rotate(160 18 18) scale(1.1)",  faceTranslate: "5 -5",   faceRotate: "-3",  eyeColor: "#000" },
  { id: 7, ringColor: "220, 50, 255",   bgColor: "#dc32ff", accentColor: "#ff8a00", transform: "translate(6 -3) rotate(80 18 18) scale(1)",     faceTranslate: "4 -2",   faceRotate: "6",   eyeColor: "#fff" },
  { id: 8, ringColor: "0, 200, 255",    bgColor: "#00c8ff", accentColor: "#002f5c", transform: "translate(1 -4) rotate(340 18 18) scale(1.05)", faceTranslate: "3 -1",   faceRotate: "-10", eyeColor: "#000" },
];

const AvatarSVG: React.FC<{ avatar: AvatarDef; size?: number }> = ({ avatar, size = 40 }) => {
  const maskId = `avatar-mask-${avatar.id}`;
  return (
    <svg
      aria-label={`Avatar ${avatar.id}`}
      fill="none"
      height={size}
      role="img"
      viewBox="0 0 36 36"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask height="36" id={maskId} maskUnits="userSpaceOnUse" width="36" x="0" y="0">
        <rect fill="#FFFFFF" height="36" rx="72" width="36" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <rect fill={avatar.bgColor} height="36" width="36" />
        <rect
          fill={avatar.accentColor}
          height="36"
          rx="6"
          transform={avatar.transform}
          width="36"
          x="0"
          y="0"
        />
        <g transform={`translate(${avatar.faceTranslate}) rotate(${avatar.faceRotate} 18 18)`}>
          <path
            d="M15 19c2 1 4 1 6 0"
            fill="none"
            stroke={avatar.eyeColor}
            strokeLinecap="round"
          />
          <rect fill={avatar.eyeColor} height="2" rx="1" stroke="none" width="1.5" x="10" y="14" />
          <rect fill={avatar.eyeColor} height="2" rx="1" stroke="none" width="1.5" x="24" y="14" />
        </g>
      </g>
    </svg>
  );
};

// --- Exported Components ---

interface AvatarPickerProps {
  selectedId: number;
  onSelect: (id: number) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedId, onSelect }) => {
  const selected = AVATARS.find(a => a.id === selectedId) || AVATARS[0];

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Main Preview Avatar with Animated Ring */}
      <div className="relative">
        {/* Animated selection ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, rgba(${selected.ringColor}, 0.9) 90deg, transparent 180deg)`,
            mask: "radial-gradient(circle at 50% 50%, transparent 62%, black 64%, black 68%, transparent 70%)",
            WebkitMask: "radial-gradient(circle at 50% 50%, transparent 62%, black 64%, black 68%, transparent 70%)",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: `conic-gradient(from 180deg, transparent 0deg, rgba(${selected.ringColor}, 0.5) 60deg, transparent 120deg)`,
            mask: "radial-gradient(circle at 50% 50%, transparent 55%, black 57%, black 60%, transparent 62%)",
            WebkitMask: "radial-gradient(circle at 50% 50%, transparent 55%, black 57%, black 60%, transparent 62%)",
          }}
        />
        
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 relative z-10 bg-[#0a0b16] flex items-center justify-center p-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
            >
              <AvatarSVG avatar={selected} size={64} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-4 gap-2.5">
        {AVATARS.map((avatar) => {
          const isSelected = avatar.id === selectedId;
          return (
            <motion.button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.id)}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className={`relative w-11 h-11 rounded-full overflow-hidden border-2 transition-colors ${
                isSelected
                  ? "border-transparent shadow-[0_0_16px_rgba(var(--ring),0.5)]"
                  : "border-white/10 hover:border-white/25"
              }`}
              style={isSelected ? {
                "--ring": avatar.ringColor,
                boxShadow: `0 0 16px rgba(${avatar.ringColor}, 0.4)`,
              } as React.CSSProperties : undefined}
            >
              <AvatarSVG avatar={avatar} size={40} />
              {/* Check overlay */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full"
                  >
                    <Check className="w-4 h-4 text-white drop-shadow-lg" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// --- Small inline avatar for display (TopNav, ProfileMenu, etc) ---
export const AvatarDisplay: React.FC<{ avatarId: number; size?: number; className?: string }> = ({
  avatarId,
  size = 24,
  className = "",
}) => {
  const avatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];
  return (
    <div className={`rounded-full overflow-hidden flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <AvatarSVG avatar={avatar} size={size} />
    </div>
  );
};

export { AVATARS };
