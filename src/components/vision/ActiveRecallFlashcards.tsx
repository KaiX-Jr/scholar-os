"use client";

import React, { useState, useEffect, useRef } from "react";
import katex from "katex";
import confetti from "canvas-confetti";
import { Flashcard } from "@/types/scholar";
import { useScholarStore } from "@/store/useScholarStore";
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Brain,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface ActiveRecallFlashcardsProps {
  cards: Flashcard[];
}

export const ActiveRecallFlashcards: React.FC<ActiveRecallFlashcardsProps> = ({ cards }) => {
  const { updateFlashcardMastery } = useScholarStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const currentCard = cards && cards.length > 0 ? cards[currentIndex] || cards[0] : null;

  // Keyboard navigation hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs/textareas
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === " " || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "1") {
        setMastery("review");
      } else if (e.key === "2") {
        setMastery("learning");
      } else if (e.key === "3") {
        setMastery("mastered");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, cards]);

  if (!cards || cards.length === 0 || !currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 border border-dashed border-white/10 rounded-2xl">
        <Brain className="w-8 h-8 text-cyan-400 mb-2 animate-pulse" />
        <span className="text-sm font-semibold text-white">No Flashcards Generated Yet</span>
        <p className="text-xs text-slate-400 mt-1">
          Upload a blackboard photo or select a sample lecture to auto-generate active recall cards.
        </p>
      </div>
    );
  }

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const setMastery = (level: Flashcard["masteryLevel"]) => {
    updateFlashcardMastery(currentCard.id, level);

    if (level === "mastered") {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#10b981", "#00f2fe", "#a855f7"],
        });
      } catch (e) {}
    }

    setTimeout(() => {
      handleNext();
    }, 350);
  };

  // Mouse 3D tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Helper to render KaTeX math in questions/answers
  const renderTextWithMath = (text: string) => {
    const parts = text.split(/\$([^$]+)\$/g);
    return parts.map((segment, idx) => {
      if (idx % 2 === 1) {
        try {
          const html = katex.renderToString(segment, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={idx}
              className="inline-block px-1 mx-0.5 text-cyan-300 font-medium font-mono"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <span key={idx}>${segment}$</span>;
        }
      }
      return segment;
    });
  };

  const masteredCount = cards.filter((c) => c.masteryLevel === "mastered").length;

  const tiltX = (mousePos.y / 200) * -10;
  const tiltY = (mousePos.x / 300) * 10;

  return (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white">Active Recall Deck</h3>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
              Mastery: {masteredCount}/{cards.length} cards
            </span>
          </div>
        </div>

        <Badge variant="cyan" size="sm">
          Card {currentIndex + 1} / {cards.length}
        </Badge>
      </div>

      {/* 3D Flip Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full min-h-[290px] sm:min-h-[320px] [perspective:1200px] my-1"
      >
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            transform: isFlipped
              ? `rotateY(180deg) rotateX(${tiltX}deg)`
              : `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          }}
          className={`relative w-full h-full min-h-[290px] sm:min-h-[320px] rounded-2xl border transition-transform duration-500 ease-out cursor-pointer [transform-style:preserve-3d] shadow-[0_15px_35px_rgba(0,0,0,0.6)] ${
            isFlipped
              ? "border-indigo-500/40 bg-gradient-to-br from-[#0a0a14] via-[#101020] to-[#080810]"
              : "border-white/[0.08] bg-[#0a0b16]/90 hover:border-cyan-400/40"
          }`}
        >
          {/* Specular Top Line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* =================================================================
              FRONT FACE: QUESTION
          ================================================================== */}
          <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between [backface-visibility:hidden]">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.05]">
              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/30 truncate max-w-[150px]">
                {currentCard.topic || "Core Concept"}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 font-mono shrink-0">
                <RotateCw className="w-3 h-3 text-cyan-400 animate-spin-slow" /> Tap to flip
              </span>
            </div>

            {/* Question Text Body */}
            <div className="py-3 flex-1 flex flex-col justify-center overflow-y-auto">
              <span className="text-[10px] text-slate-400 block mb-1.5 font-mono uppercase tracking-widest font-semibold">
                Question
              </span>
              <h4 className="text-xs sm:text-sm md:text-base font-semibold text-white leading-relaxed">
                {renderTextWithMath(currentCard.question)}
              </h4>
            </div>

            {/* Bottom Status */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/[0.06] pt-2.5">
              <span className="font-mono text-[10px]">
                Recall Level:{" "}
                <strong className={
                  currentCard.masteryLevel === "mastered"
                    ? "text-emerald-400"
                    : currentCard.masteryLevel === "review"
                    ? "text-rose-400"
                    : "text-amber-300"
                }>
                  {currentCard.masteryLevel || "Unreviewed"}
                </strong>
              </span>
              <span className="text-cyan-300 font-medium flex items-center gap-1 text-[11px] font-mono">
                See Solution <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* =================================================================
              BACK FACE: ANSWER & SPACED REPETITION RATING
          ================================================================== */}
          <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.05]">
              <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-500/30">
                Solution &amp; Proof
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 font-mono shrink-0">
                <RotateCw className="w-3 h-3 text-indigo-400" /> Tap to flip back
              </span>
            </div>

            {/* Answer Text Body */}
            <div className="py-2.5 flex-1 flex flex-col justify-center overflow-y-auto">
              <span className="text-[10px] text-slate-400 block mb-1 font-mono uppercase tracking-widest font-semibold">
                Key Answer
              </span>
              <div className="text-xs sm:text-sm text-slate-100 font-mono leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
                {renderTextWithMath(currentCard.answer)}
              </div>
            </div>

            {/* Spaced Repetition Rating Action Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="pt-2.5 border-t border-white/[0.08] space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                  How well did you know this?
                </span>
              </div>

              {/* 3-Column Responsive Rating Grid */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setMastery("review")}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-medium font-mono flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                    currentCard.masteryLevel === "review"
                      ? "bg-rose-500/25 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                      : "bg-white/5 hover:bg-rose-500/15 text-rose-300 border-white/10"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span>Hard</span>
                  <span className="hidden sm:inline opacity-60">[1]</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMastery("learning")}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-medium font-mono flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                    currentCard.masteryLevel === "learning"
                      ? "bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                      : "bg-white/5 hover:bg-amber-500/15 text-amber-300 border-white/10"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Good</span>
                  <span className="hidden sm:inline opacity-60">[2]</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMastery("mastered")}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-medium font-mono flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                    currentCard.masteryLevel === "mastered"
                      ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      : "bg-white/5 hover:bg-emerald-500/15 text-emerald-300 border-white/10"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>Mastered</span>
                  <span className="hidden sm:inline opacity-60">[3]</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrev}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-all font-mono cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {cards.map((c, i) => (
            <button
              key={c.id || i}
              type="button"
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex
                  ? "w-5 sm:w-6 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  : c.masteryLevel === "mastered"
                  ? "w-2 bg-emerald-400/80"
                  : c.masteryLevel === "review"
                  ? "w-2 bg-rose-400/80"
                  : "w-2 bg-white/20"
              }`}
              title={`Card ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-all font-mono cursor-pointer"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
