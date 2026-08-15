"use client";

import { Check, User2 } from "lucide-react";
import type { Variants } from "framer-motion";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface Avatar {
  id: number;
  svg: ReactNode;
  alt: string;
}

// RGB values for the per-avatar color ring on the stage
export const AVATAR_RGB: Record<number, string> = {
  1: "255, 0, 91",
  2: "255, 125, 16",
  3: "255, 0, 91",
  4: "137, 252, 179",
};

export const avatars: Avatar[] = [
  {
    id: 1,
    svg: (
      <svg
        aria-label="Avatar 1"
        fill="none"
        height="40"
        role="img"
        viewBox="0 0 36 36"
        width="40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Avatar 1</title>
        <mask
          height="36"
          id="kokonut-avatar-mask-1"
          maskUnits="userSpaceOnUse"
          width="36"
          x="0"
          y="0"
        >
          <rect fill="#FFFFFF" height="36" rx="72" width="36" />
        </mask>
        <g mask="url(#kokonut-avatar-mask-1)">
          <rect fill="#ff005b" height="36" width="36" />
          <rect
            fill="#ffb238"
            height="36"
            rx="6"
            transform="translate(9 -5) rotate(219 18 18) scale(1)"
            width="36"
            x="0"
            y="0"
          />
          <g transform="translate(4.5 -4) rotate(9 18 18)">
            <path
              d="M15 19c2 1 4 1 6 0"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
            />
            <rect
              fill="#000000"
              height="2"
              rx="1"
              stroke="none"
              width="1.5"
              x="10"
              y="14"
            />
            <rect
              fill="#000000"
              height="2"
              rx="1"
              stroke="none"
              width="1.5"
              x="24"
              y="14"
            />
          </g>
        </g>
      </svg>
    ),
    alt: "Avatar 1",
  },
  {
    id: 2,
    svg: (
      <svg
        aria-label="Avatar 2"
        fill="none"
        height="40"
        role="img"
        viewBox="0 0 36 36"
        width="40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Avatar 2</title>
        <mask
          height="36"
          id="kokonut-avatar-mask-2"
          maskUnits="userSpaceOnUse"
          width="36"
          x="0"
          y="0"
        >
          <rect fill="#FFFFFF" height="36" rx="72" width="36" />
        </mask>
        <g mask="url(#kokonut-avatar-mask-2)">
          <rect fill="#ff7d10" height="36" width="36" />
          <rect
            fill="#0a0310"
            height="36"
            rx="6"
            transform="translate(5 -1) rotate(55 18 18) scale(1.1)"
            width="36"
            x="0"
            y="0"
          />
          <g transform="translate(7 -6) rotate(-5 18 18)">
            <path
              d="M15 20c2 1 4 1 6 0"
              fill="none"
              stroke="#FFFFFF"
              strokeLinecap="round"
            />
            <rect
              fill="#FFFFFF"
              height="2"
              rx="1"
              stroke="none"
              width="1.5"
              x="14"
              y="14"
            />
            <rect
              fill="#FFFFFF"
              height="2"
              rx="1"
              stroke="none"
              width="1.5"
              x="20"
              y="14"
            />
          </g>
        </g>
      </svg>
    ),
    alt: "Avatar 2",
  },
  {
    id: 3,
    svg: (
      <svg
        aria-label="Avatar 3"
        fill="none"
        height="40"
        role="img"
        viewBox="0 0 36 36"
        width="40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Avatar 3</title>
        <mask
          height="36"
          id="kokonut-avatar-mask-3"
          maskUnits="userSpaceOnUse"
          width="36"
          x="0"
          y="0"
        >
          <rect fill="#FFFFFF" height="36" rx="72" width="36" />
        </mask>
        <g mask="url(#kokonut-avatar-mask-3)">
          <rect fill="#0a0310" height="36" width="36" />
          <rect
            fill="#ff005b"
            height="36"
            rx="36"
            transform="translate(-3 7) rotate(227 18 18) scale(1.2)"
            width="36"
            x="0"
            y="0"
          />
          <g transform="translate(-3 3.5) rotate(7 18 18)">
            <path d="M13,21 a1,0.75 0 0,0 10,0" fill="#FFFFFF" />
            <rect
              fill="#FFFFFF"
              height="2"
              rx="1"
              stroke="none"
              width="1.5"
              x="12"
              y="14"
            />
            <rect
              fill="#FFFFFF"
              height="2"
              rx="1"
              stroke="none"
              width="1.5"
              x="22"
              y="14"
            />
          </g>
        </g>
      </svg>
    ),
    alt: "Avatar 3",
  },
  {
    id: 4,
    svg: (
      <svg
        aria-label="Avatar 4"
        fill="none"
        height="40"
        role="img"
        viewBox="0 0 36 36"
        width="40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Avatar 4</title>
        <mask
          height="36"
          id="kokonut-avatar-mask-4"
          maskUnits="userSpaceOnUse"
          width="36"
          x="0"
          y="0"
        >
          <rect fill="#FFFFFF" height="36" rx="72" width="36" />
        </mask>
        <g mask="url(#kokonut-avatar-mask-4)">
          <rect fill="#d8fcb3" height="36" width="36" />
          <rect
            fill="#89fcb3"
            height="36"
            rx="6"
            transform="translate(9 -5) rotate(219 18 18) scale(1)"
            width="36"
            x="0"
            y="0"
          />
          <g transform="translate(4.5 -4) rotate(9 18 18)">
            <path
              d="M15 19c2 1 4 1 6 0"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
            />
            <rect
              fill="#000000"
              height="2"
              rx="1"
              stroke="none"
              width="1.5"
              x="10"
              y="14"
            />
            <rect
              fill="#000000"
              height="2"
              rx="1"
              stroke="none"
              width="1.5"
              x="24"
              y="14"
            />
          </g>
        </g>
      </svg>
    ),
    alt: "Avatar 4",
  },
];

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const thumbnailVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" },
  },
};

interface AvatarPickerProps {
  selectedId: number;
  onSelect: (id: number) => void;
  compact?: boolean;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  selectedId,
  onSelect,
  compact = true,
}) => {
  const selectedAvatar = avatars.find((a) => a.id === selectedId) || avatars[0];
  const shouldReduceMotion = useReducedMotion();
  const rgb = AVATAR_RGB[selectedAvatar.id] || "255, 0, 91";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar Stage */}
      <div className={cn("relative", compact ? "h-20 w-20" : "h-28 w-28")}>
        {/* Animated per-avatar color ring */}
        <motion.div
          animate={{
            boxShadow: `0 0 0 2px rgba(${rgb}, 0.65), 0 6px 20px rgba(${rgb}, 0.28)`,
          }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.45, ease: "easeOut" }
          }
        />

        {/* Avatar circle */}
        <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-black/40">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={selectedAvatar.id}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.2, ease: "easeOut" }
              }
            >
              <div className={compact ? "scale-[2] transform" : "scale-[2.8] transform"}>
                {selectedAvatar.svg}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Avatar name — fades with selection */}
      <AnimatePresence mode="wait">
        <motion.span
          animate={{ opacity: 1 }}
          className="text-[10px] text-slate-400 uppercase font-mono tracking-[0.14em]"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={selectedAvatar.id}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.16, ease: "easeOut" }
          }
        >
          {selectedAvatar.alt}
        </motion.span>
      </AnimatePresence>

      {/* Thumbnail strip */}
      <motion.div
        animate="animate"
        className="flex gap-2.5"
        initial="initial"
        variants={containerVariants}
      >
        {avatars.map((avatar) => {
          const isSelected = selectedAvatar.id === avatar.id;
          return (
            <motion.button
              aria-label={`Select ${avatar.alt}`}
              aria-pressed={isSelected}
              className={cn(
                "relative h-11 w-11 overflow-hidden rounded-xl border bg-black/50 transition-[opacity,box-shadow] duration-200 ease-out",
                isSelected
                  ? "border-white/40 opacity-100 ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#08080f]"
                  : "border-white/10 opacity-50 hover:opacity-100 hover:border-white/25"
              )}
              key={avatar.id}
              onClick={() => onSelect(avatar.id)}
              type="button"
              variants={thumbnailVariants}
              whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="scale-[1.1] transform">{avatar.svg}</div>
              </div>
              {isSelected && (
                <div className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400">
                  <Check
                    aria-hidden="true"
                    className="h-2.5 w-2.5 text-black font-extrabold"
                  />
                </div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

// Render small inline avatar
export const AvatarDisplay: React.FC<{
  avatarId: number;
  size?: number;
  className?: string;
}> = ({ avatarId, size = 24, className = "" }) => {
  const avatar = avatars.find((a) => a.id === avatarId) || avatars[0];
  const scale = size / 40;

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden flex items-center justify-center relative",
        className
      )}
      style={{ width: size, height: size }}
    >
      <div
        className="flex items-center justify-center"
        style={{ transform: `scale(${scale})` }}
      >
        {avatar.svg}
      </div>
    </div>
  );
};
