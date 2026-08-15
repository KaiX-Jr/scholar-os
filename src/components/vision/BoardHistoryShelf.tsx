"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SavedBoardAnalysis } from "@/types/scholar";
import {
  Clock,
  BookOpen,
  Trash2,
  CheckCircle2,
  ChevronRight,
  ListOrdered,
  Brain,
} from "lucide-react";
import { BorderBeam } from "@/components/ui/BorderBeam";

interface BoardHistoryShelfProps {
  history: SavedBoardAnalysis[];
  activeBoardId?: string;
  onSelectBoard: (id: string) => void;
  onDeleteBoard: (id: string) => void;
  onClearHistory: () => void;
}

export const BoardHistoryShelf: React.FC<BoardHistoryShelfProps> = ({
  history,
  activeBoardId,
  onSelectBoard,
  onDeleteBoard,
  onClearHistory,
}) => {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");

  const formatTimestamp = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      if (isToday) {
        return `Today at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      }
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  // Get distinct course codes from history
  const distinctCourses = Array.from(
    new Set(
      history
        .map((b) => b.courseCode)
        .filter((c): c is string => Boolean(c && c.trim()))
    )
  );

  const filteredHistory =
    selectedCourseFilter === "all"
      ? history
      : history.filter((b) => b.courseCode === selectedCourseFilter);

  return (
    <div className="w-full mb-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Lecture History & Saved Boards
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                {history.length} {history.length === 1 ? "Board" : "Boards"}
              </span>
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear all lecture history?")) {
                onClearHistory();
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Course Filter Pills (when multiple subjects are present) */}
      {distinctCourses.length > 1 && (
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 px-1 custom-scrollbar">
          <span className="text-[11px] text-slate-400 mr-1 font-mono">Subject:</span>
          <button
            onClick={() => setSelectedCourseFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              selectedCourseFilter === "all"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            All Courses ({history.length})
          </button>
          {distinctCourses.map((code) => {
            const count = history.filter((b) => b.courseCode === code).length;
            const isSel = selectedCourseFilter === code;
            return (
              <button
                key={code}
                onClick={() => setSelectedCourseFilter(code)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                  isSel
                    ? "bg-indigo-500/25 text-indigo-300 border border-indigo-500/50 font-bold"
                    : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                [{code}] ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Boards Shelf Horizontal Carousel */}
      {filteredHistory.length > 0 ? (
        <div className="flex gap-3.5 overflow-x-auto pb-3 pt-1 px-1 custom-scrollbar snap-x">
          <AnimatePresence>
            {filteredHistory.map((board) => {
              const isActive =
                activeBoardId === board.id ||
                (history[0]?.id === board.id && !activeBoardId);

              return (
                <motion.div
                  key={board.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative shrink-0 w-[280px] sm:w-[320px] rounded-2xl border transition-all duration-300 snap-start overflow-hidden ${
                    isActive
                      ? "bg-[#0b1022]/95 border-cyan-500/50 shadow-[0_0_24px_rgba(6,182,212,0.2)]"
                      : "bg-[#0a0b16]/80 hover:bg-[#0f1124]/90 border-white/[0.08] hover:border-white/20 shadow-md"
                  }`}
                >
                  {isActive && (
                    <BorderBeam size={160} duration={8} colorFrom="#00f2fe" colorTo="#4facfe" />
                  )}

                  {/* Thumbnail Banner or Abstract Blueprint */}
                  <div
                    onClick={() => onSelectBoard(board.id)}
                    className="relative h-24 sm:h-28 w-full bg-gradient-to-br from-black via-slate-900 to-cyan-950/40 border-b border-white/[0.08] overflow-hidden cursor-pointer flex items-center justify-center"
                  >
                    {board.imageUri ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={board.imageUri}
                        alt={board.topicTitle}
                        className="w-full h-full object-cover object-center opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/30 via-slate-950 to-black">
                        <BookOpen className="w-6 h-6 text-cyan-400/70 mb-1" />
                        <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                          {board.topicTitle}
                        </span>
                      </div>
                    )}

                    {/* Active Ribbon */}
                    {isActive && (
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/90 text-black text-[10px] font-bold shadow-lg shadow-cyan-500/50">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>ACTIVE STUDY</span>
                      </div>
                    )}

                    {/* Course Code Tag Pill */}
                    {board.courseCode && (
                      <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-semibold shadow-md">
                        <span>[{board.courseCode}]</span>
                        {board.courseName && (
                          <span className="max-w-[120px] truncate text-slate-300 text-[9px]">
                            {board.courseName}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Delete Board Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBoard(board.id);
                      }}
                      title="Delete board"
                      className="absolute top-2 right-2 z-10 w-6 h-6 rounded-lg bg-black/60 hover:bg-red-500/80 text-slate-400 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div
                    onClick={() => onSelectBoard(board.id)}
                    className="p-3.5 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(board.analyzedAt)}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {board.topicTitle}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {board.summary || "Structured lecture and problem breakdown with solution steps & active recall cards."}
                      </p>
                    </div>

                    {/* Metric Badges & Action */}
                    <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <ListOrdered className="w-3 h-3 text-cyan-400" />
                          {board.steps?.length || 0} Steps
                        </span>
                        <span className="flex items-center gap-1">
                          <Brain className="w-3 h-3 text-purple-400" />
                          {board.flashcards?.length || 0} Cards
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-medium flex items-center gap-0.5 transition-colors ${
                          isActive ? "text-cyan-400 font-bold" : "text-slate-400 group-hover:text-white"
                        }`}
                      >
                        {isActive ? "Studying" : "Open"}
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Clean Zero-State: No Dummy Sample Data */
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0a0b16]/70 border border-white/[0.08] flex items-center justify-center">
          <div className="flex items-center gap-3.5 text-left max-w-lg">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">
                No Lecture Boards Saved Yet
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Upload or capture a classroom chalkboard photo below to extract structured notes, proofs, and active recall cards.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
