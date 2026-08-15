"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScholarStore, getLocalDateStr } from "@/store/useScholarStore";
import { DailyOralQuestion } from "@/types/scholar";
import { BorderBeam } from "@/components/ui/BorderBeam";
import katex from "katex";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  Flame,
  TrendingUp,
  Brain,
  RefreshCw,
  X,
  Volume2,
  VolumeX,
  ShieldCheck,
  Send,
  Zap,
  BookOpen,
  RotateCw,
} from "lucide-react";

export const DailyProfessorOralCheckin: React.FC = () => {
  const {
    courses,
    boardHistory,
    isDailyProfessorOpen,
    closeDailyProfessor,
    dailyOralQuestion,
    setDailyOralQuestion,
    recordDailyOralAnswer,
    setPomodoroMode,
    setPomodoroRunning,
  } = useScholarStore();

  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [inputMode, setInputMode] = useState<"choice" | "typed">("choice");
  const [submitting, setSubmitting] = useState(false);
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [evalResult, setEvalResult] = useState<{
    isCorrect: boolean;
    masteryScore: number;
    letterGrade: string;
    feedback: string;
    keyTakeaway: string;
    recommendedAction: string;
  } | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  const todayStr = getLocalDateStr();

  // Background scroll lock when modal is open
  useEffect(() => {
    if (isDailyProfessorOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isDailyProfessorOpen]);

  // Helper to render KaTeX math in questions/answers/formulas
  const renderMath = (text: string) => {
    if (!text) return null;
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

  const renderBlockMath = (latex: string) => {
    try {
      const html = katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
      });
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    } catch (e) {
      return <div className="font-mono text-xs text-rose-300">{latex}</div>;
    }
  };

  // Play audio synthesis
  const speakText = useCallback(
    (text: string) => {
      if (typeof window !== "undefined" && "speechSynthesis" in window && speechEnabled) {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[$#*`]/g, "");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    },
    [speechEnabled]
  );

  // Fetch or generate question
  const fetchDailyQuestion = useCallback(
    async (forceRefresh = false) => {
      if (!forceRefresh && dailyOralQuestion && dailyOralQuestion.date === todayStr) {
        return;
      }

      setLoading(true);
      setEvalResult(null);
      setSelectedOption(null);
      setTypedAnswer("");
      setShowFlashcard(false);
      setIsFlipped(false);

      try {
        const courseList = courses.map((c) => ({
          code: c.courseCode,
          name: c.courseName,
        }));

        const recentBoards = boardHistory.slice(0, 3).map((b) => ({
          topicTitle: b.topicTitle,
          summary: b.summary,
          keyFormulas: b.keyFormulas,
          structuredNotes: b.structuredNotes,
        }));

        const res = await fetch("/api/daily-checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "generate_question",
            courseList,
            recentBoards,
          }),
        });

        const data = await res.json();
        if (data.success && data.question) {
          const newQ: DailyOralQuestion = {
            ...data.question,
            date: todayStr,
            isCompleted: false,
          };
          setDailyOralQuestion(newQ);
          if (speechEnabled) {
            speakText(`Daily Quiz: ${newQ.question}`);
          }
        }
      } catch (err) {
        console.error("Failed to fetch daily quiz question:", err);
      } finally {
        setLoading(false);
      }
    },
    [courses, boardHistory, dailyOralQuestion, todayStr, setDailyOralQuestion, speechEnabled, speakText]
  );

  // Initial load when modal opens
  useEffect(() => {
    if (isDailyProfessorOpen && (!dailyOralQuestion || dailyOralQuestion.date !== todayStr)) {
      fetchDailyQuestion();
    }
  }, [isDailyProfessorOpen, dailyOralQuestion, todayStr, fetchDailyQuestion]);

  // Submit Answer
  const handleSubmitAnswer = async () => {
    if (!dailyOralQuestion) return;

    let answerToSubmit = "";
    let isChoiceCorrect = false;

    if (inputMode === "choice" && selectedOption !== null && dailyOralQuestion.options) {
      answerToSubmit = dailyOralQuestion.options[selectedOption];
      isChoiceCorrect = selectedOption === dailyOralQuestion.correctOptionIndex;
    } else if (inputMode === "typed" && typedAnswer.trim()) {
      answerToSubmit = typedAnswer.trim();
    } else {
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/daily-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate_answer",
          topic: dailyOralQuestion.topic,
          question: dailyOralQuestion.question,
          userAnswer: answerToSubmit,
          expectedAnswer: dailyOralQuestion.sampleAnswer || dailyOralQuestion.explanation,
        }),
      });

      const data = await res.json();
      const evaluation = data.evaluation || {
        isCorrect: inputMode === "choice" ? isChoiceCorrect : true,
        masteryScore: inputMode === "choice" ? (isChoiceCorrect ? 100 : 60) : 92,
        letterGrade: inputMode === "choice" ? (isChoiceCorrect ? "A+" : "B") : "A",
        feedback:
          inputMode === "choice" && !isChoiceCorrect
            ? `Incorrect. ${dailyOralQuestion.explanation}`
            : dailyOralQuestion.explanation,
        keyTakeaway: "Daily active recall builds strong concept retention.",
        recommendedAction: "Recorded into your daily habit streak (+3.0 hrs momentum).",
      };

      setEvalResult(evaluation);

      // Record to store (logs habit streak + adjusts CGPA benchmark)
      recordDailyOralAnswer(
        evaluation.isCorrect,
        evaluation.feedback,
        answerToSubmit,
        evaluation.masteryScore
      );

      if (speechEnabled) {
        speakText(
          evaluation.isCorrect
            ? `Great job! ${evaluation.feedback}`
            : `Review needed. ${evaluation.feedback}`
        );
      }
    } catch (err) {
      console.error("Evaluation failed:", err);
      const isOk = inputMode === "choice" ? isChoiceCorrect : true;
      const fallbackEval = {
        isCorrect: isOk,
        masteryScore: isOk ? 100 : 60,
        letterGrade: isOk ? "A" : "B",
        feedback: dailyOralQuestion.explanation,
        keyTakeaway: "Reinforce key concepts with daily active recall.",
        recommendedAction: "Recorded to today's habit matrix.",
      };
      setEvalResult(fallbackEval);
      recordDailyOralAnswer(isOk, dailyOralQuestion.explanation, answerToSubmit, isOk ? 100 : 60);
    } finally {
      setSubmitting(false);
    }
  };

  const startDeepWorkFlow = () => {
    setPomodoroMode("work");
    setPomodoroRunning(true);
    closeDailyProfessor();
    const el = document.getElementById("habits");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  if (!isDailyProfessorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto overscroll-contain bg-black/80 backdrop-blur-md">
      {/* Backdrop click to close */}
      <div
        onClick={closeDailyProfessor}
        className="fixed inset-0 -z-10"
      />

      {/* Main Glass Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-2xl bg-[#0a0b16]/95 border border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.85)] rounded-2xl sm:rounded-3xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        <BorderBeam size={280} duration={10} colorFrom="#00f2fe" colorTo="#a855f7" />

        {/* Sticky Header */}
        <div className="shrink-0 flex items-center justify-between p-3.5 sm:p-5 bg-[#0e0f22]/90 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/30 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide truncate">
                  Daily AI Quiz
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 uppercase">
                  Daily
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate hidden sm:block">
                Active recall challenge synced to your courses & habit streak
              </p>
            </div>
          </div>

          {/* Controls: Voice Toggle & Close */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              title={speechEnabled ? "Mute Voice" : "Enable Voice"}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                speechEnabled
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm"
                  : "bg-white/5 text-slate-400 hover:text-white border-white/10"
              }`}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{speechEnabled ? "Voice ON" : "Voice OFF"}</span>
            </button>

            <button
              onClick={closeDailyProfessor}
              aria-label="Close modal"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-200 hover:text-rose-300 border border-white/15 hover:border-rose-500/40 font-mono text-xs font-semibold transition-all"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 custom-scrollbar overscroll-contain">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
              <div className="relative w-12 h-12">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <Brain className="w-5 h-5 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-mono font-semibold text-cyan-300">
                  Generating today&apos;s active recall challenge...
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesizing key concept from your courses & lecture notes
                </p>
              </div>
            </div>
          ) : dailyOralQuestion ? (
            <>
              {/* Question Course & Topic Pill */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/25 text-indigo-300 font-bold border border-indigo-500/30 text-xs shrink-0">
                    {dailyOralQuestion.courseCode || "HONORS"}
                  </span>
                  <span className="text-slate-200 font-medium truncate text-xs sm:text-sm">
                    {dailyOralQuestion.topic}
                  </span>
                </div>

                <button
                  onClick={() => fetchDailyQuestion(true)}
                  title="Generate new question"
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors shrink-0 px-2.5 py-1 rounded-lg hover:bg-white/5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Question</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-slate-900/50 to-indigo-950/30 border border-cyan-500/25 shadow-sm">
                <p className="text-sm sm:text-base font-medium text-white leading-relaxed break-words">
                  {renderMath(dailyOralQuestion.question)}
                </p>

                {dailyOralQuestion.formula && (
                  <div className="mt-3 p-3 rounded-xl bg-black/50 border border-white/10 text-center text-xs sm:text-sm font-mono text-cyan-300 overflow-x-auto">
                    {renderBlockMath(dailyOralQuestion.formula)}
                  </div>
                )}
              </div>

              {/* Mode Toggle (Multiple Choice vs Written Answer) */}
              {!evalResult && (
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="text-slate-400">Response Mode:</span>
                  <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                    <button
                      onClick={() => setInputMode("choice")}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        inputMode === "choice"
                          ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Multiple Choice
                    </button>
                    <button
                      onClick={() => setInputMode("typed")}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        inputMode === "typed"
                          ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Written Answer
                    </button>
                  </div>
                </div>
              )}

              {/* Answer Options / Textarea */}
              {!evalResult ? (
                inputMode === "choice" && dailyOralQuestion.options ? (
                  <div className="space-y-2.5">
                    {dailyOralQuestion.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedOption(idx)}
                          className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,242,254,0.2)] ring-1 ring-cyan-400"
                              : "bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-slate-300 hover:border-white/20"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold transition-all ${
                              isSelected
                                ? "bg-cyan-400 text-slate-950 shadow-sm"
                                : "bg-white/10 text-slate-400"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-xs sm:text-sm font-medium leading-relaxed mt-0.5 break-words flex-1">
                            {renderMath(opt)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      placeholder="Write your explanation or reasoning here..."
                      rows={4}
                      className="w-full p-3.5 sm:p-4 rounded-2xl bg-black/50 border border-white/15 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                )
              ) : null}

              {/* Submit Answer Button (Before Evaluation) */}
              {!evalResult && (
                <div className="pt-2">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={
                      submitting ||
                      (inputMode === "choice" ? selectedOption === null : !typedAnswer.trim())
                    }
                    className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Evaluating your answer...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Quiz Answer</span>
                      </>
                    )}
                  </button>
                  {inputMode === "choice" && selectedOption === null && (
                    <p className="text-[11px] text-slate-400 text-center mt-2 font-mono">
                      Select one of the options above to enable submission
                    </p>
                  )}
                </div>
              )}

              {/* Post-Evaluation Feedback & Memory Flashcard */}
              <AnimatePresence>
                {evalResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950 border border-indigo-500/30 space-y-4"
                  >
                    {/* Header Score */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        {evalResult.isCorrect ? (
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                            <XCircle className="w-5 h-5 text-amber-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-bold text-white truncate">
                            {evalResult.isCorrect
                              ? "Quiz Passed (Mastered)"
                              : "Needs Review — Concept Flashcard Ready"}
                          </h4>
                          <span className="text-xs text-slate-400 font-mono">
                            Mastery Score: {evalResult.masteryScore}% ({evalResult.letterGrade})
                          </span>
                        </div>
                      </div>

                      <div className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1 shrink-0">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span>Streak +1</span>
                      </div>
                    </div>

                    {/* Feedback & Explanation */}
                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2.5 break-words">
                      <p>{renderMath(evalResult.feedback)}</p>
                      {evalResult.keyTakeaway && (
                        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-indigo-300 font-mono">
                          💡 <strong>Key Takeaway:</strong> {evalResult.keyTakeaway}
                        </div>
                      )}
                    </div>

                    {/* Interactive Active Recall Memory Flashcard */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Active Recall Flashcard</span>
                        </span>
                        <button
                          onClick={() => setIsFlipped(!isFlipped)}
                          className="text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>Flip Card</span>
                        </button>
                      </div>

                      <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="cursor-pointer p-4 rounded-2xl bg-black/60 border border-cyan-500/30 hover:border-cyan-400/60 transition-all text-xs sm:text-sm shadow-inner min-h-[100px] flex flex-col justify-center"
                      >
                        {!isFlipped ? (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                              Front • Question / Concept
                            </span>
                            <p className="text-white font-medium">
                              {renderMath(dailyOralQuestion.question)}
                            </p>
                            <p className="text-[10px] text-cyan-400/80 font-mono pt-1">
                              (Click to flip for answer & key formulas)
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                              Back • Solution & Takeaway
                            </span>
                            <p className="text-slate-200">
                              {renderMath(
                                dailyOralQuestion.sampleAnswer || dailyOralQuestion.explanation
                              )}
                            </p>
                            {dailyOralQuestion.formula && (
                              <div className="pt-1 text-cyan-300 font-mono text-xs">
                                {renderBlockMath(dailyOralQuestion.formula)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Automatic Synchronization Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-300">
                        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>Daily Habit Streak Logged</span>
                      </div>
                      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2 text-indigo-300">
                        <TrendingUp className="w-4 h-4 shrink-0 text-indigo-400" />
                        <span>Honors CGPA Boosted (+0.03)</span>
                      </div>
                    </div>

                    {/* Next Actions */}
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                      <button
                        onClick={startDeepWorkFlow}
                        className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Start 25m Focus Session</span>
                      </button>

                      <button
                        onClick={closeDailyProfessor}
                        className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Close Quiz</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};
