"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  School,
  X,
} from "lucide-react";
import { useScholarStore, OnboardingCourseInput } from "@/store/useScholarStore";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const POPULAR_COURSE_PRESETS = [
  { code: "CS201", name: "Data Structures & Algorithms", credits: 4 },
  { code: "MATH301", name: "Linear Algebra & Differential Eq", credits: 4 },
  { code: "CS402", name: "Operating Systems Architecture", credits: 4 },
  { code: "PHYS101", name: "Quantum & Classical Mechanics", credits: 3 },
  { code: "AI501", name: "Machine Learning & Neural Nets", credits: 4 },
];

export const OnboardingWizard: React.FC = () => {
  const { user, courses: storeCourses, isOnboardingOpen, closeOnboarding, completeOnboarding } =
    useScholarStore();

  // If already onboarded, default directly to Step 2 (Course Management)
  const [step, setStep] = useState<1 | 2 | 3>(user?.isOnboarded ? 2 : 1);

  // Step 1: Academic Profile State (pre-filled from store)
  const [name, setName] = useState(user?.name || "");
  const [university, setUniversity] = useState(user?.university || "");
  const [semester, setSemester] = useState(user?.semester || "Semester 3");
  const [targetCgpa, setTargetCgpa] = useState<number>(
    user?.targetCgpa
      ? user.targetCgpa <= 4.0
        ? Number((user.targetCgpa * 2.5).toFixed(2))
        : user.targetCgpa
      : 9.0
  );

  // Step 2: Dynamic Courses State (pre-filled from store)
  const [courses, setCourses] = useState<OnboardingCourseInput[]>(
    storeCourses && storeCourses.length > 0
      ? storeCourses.map((c) => ({
          courseCode: c.courseCode,
          courseName: c.courseName,
          credits: c.credits,
          schedule: c.schedule,
        }))
      : []
  );
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newCredits, setNewCredits] = useState(4);

  // Error validation state
  const [error, setError] = useState<string | null>(null);

  // Sync state with user profile and enrolled courses whenever modal opens
  React.useEffect(() => {
    if (isOnboardingOpen) {
      if (user?.name) setName(user.name);
      if (user?.university) setUniversity(user.university);
      if (user?.semester) setSemester(user.semester);
      if (user?.targetCgpa) {
        setTargetCgpa(
          user.targetCgpa <= 4.0
            ? Number((user.targetCgpa * 2.5).toFixed(2))
            : user.targetCgpa
        );
      }
      if (user?.isOnboarded) setStep(2);

      if (storeCourses && storeCourses.length > 0) {
        setCourses(
          storeCourses.map((c) => ({
            courseCode: c.courseCode,
            courseName: c.courseName,
            credits: c.credits,
            schedule: c.schedule || ["Mon", "Wed", "Fri"],
          }))
        );
      }
    }
  }, [isOnboardingOpen, user, storeCourses]);

  if (!isOnboardingOpen) return null;

  const handleAddCourse = (code: string, cName: string, credits: number) => {
    if (!code.trim() || !cName.trim()) {
      setError("Please specify both course code and title.");
      return;
    }
    setError(null);
    const existing = courses.some(
      (c) => c.courseCode.toUpperCase() === code.toUpperCase()
    );
    if (existing) {
      setError(`Course ${code.toUpperCase()} is already in your list.`);
      return;
    }

    setCourses((prev) => [
      ...prev,
      {
        courseCode: code.toUpperCase().trim(),
        courseName: cName.trim(),
        credits: credits || 4,
        schedule: ["Mon", "Wed", "Fri"],
      },
    ]);
    setNewCode("");
    setNewName("");
  };

  const handleRemoveCourse = (code: string) => {
    setCourses((prev) => prev.filter((c) => c.courseCode !== code));
  };

  const toggleDayForCourse = (courseCode: string, day: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.courseCode !== courseCode) return c;
        const exists = c.schedule.includes(day);
        const newSched = exists
          ? c.schedule.filter((d) => d !== day)
          : [...c.schedule, day];
        return {
          ...c,
          schedule: newSched.length > 0 ? newSched : ["Mon"],
        };
      })
    );
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      const activeName = name.trim() || user?.name || "";
      if (!activeName) {
        setError("Please enter your name.");
        return;
      }
      if (!name.trim() && activeName) setName(activeName);
      setStep(2);
    } else if (step === 2) {
      if (courses.length === 0) {
        setError("Please add at least 1 enrolled course to continue.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // Finalize Onboarding
      completeOnboarding({
        name,
        university,
        semester,
        targetCgpa,
        courses,
      });

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#00f2fe", "#6366f1", "#10b981", "#a855f7"],
        });
      } catch (e) {}
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6 backdrop-blur-3xl bg-black/85 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl backdrop-blur-3xl bg-[#0a0b16]/98 border border-white/[0.15] p-4 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.95)] my-auto"
        >
          {/* Top Specular Line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />

          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl" />

          {/* Wizard Header & Step Indicator */}
          <div className="shrink-0 flex items-center justify-between pb-3.5 mb-3 border-b border-white/[0.08] relative z-10">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
              <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 flex items-center justify-center shadow-inner">
                {step === 1 && <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />}
                {step === 2 && <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />}
                {step === 3 && <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                  {step === 1 && "Step 1: Academic Profile"}
                  {step === 2 && "Step 2: Enrolled Courses"}
                  {step === 3 && "Step 3: Class Schedule"}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  {step === 1 && "Configure semester & target CGPA"}
                  {step === 2 && "Add your real academic subjects"}
                  {step === 3 && "Set weekly lecture days"}
                </p>
              </div>
            </div>

            {/* Step Progress Pips & Close Button */}
            <div className="shrink-0 flex items-center gap-2.5 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStep(s as any)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      s === step
                        ? "w-6 sm:w-7 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                        : s < step
                        ? "w-2.5 sm:w-3 bg-indigo-500"
                        : "w-2 bg-white/10"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={closeOnboarding}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white border border-white/10 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="shrink-0 mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* =========================================================================
              SCROLLABLE MODAL BODY
          ========================================================================== */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 relative z-10 custom-scrollbar">
            {/* =====================================================================
                STEP 1: ACADEMIC PROFILE
            ====================================================================== */}
            {step === 1 && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wide block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wide block mb-1">
                      College / University
                    </label>
                    <div className="relative">
                      <School className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. MIT / Stanford / Berkeley"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wide block mb-1">
                      Current Academic Term
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400/60 font-mono"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={`Semester ${sem}`} className="bg-[#0b0c16]">
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wide">
                        Target Honors CGPA Goal (10.0 Scale)
                      </label>
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        {targetCgpa.toFixed(2)} / 10.00
                      </span>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="10.0"
                      step="0.05"
                      value={targetCgpa}
                      onChange={(e) => setTargetCgpa(parseFloat(e.target.value))}
                      className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                      <span>6.00</span>
                      <span>7.50</span>
                      <span>9.00</span>
                      <span>10.00</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =====================================================================
                STEP 2: DYNAMIC ENROLLED COURSES
            ====================================================================== */}
            {step === 2 && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                {/* Dynamic Add Course Inputs */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                  <span className="text-xs font-semibold text-white font-mono flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    Add a Course / Subject
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Code (e.g. CS301)"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 font-mono"
                      />
                    </div>
                    <div className="sm:col-span-8">
                      <input
                        type="text"
                        placeholder="Course Title (e.g. Operating Systems)"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Credits:</span>
                      <select
                        value={newCredits}
                        onChange={(e) => setNewCredits(parseInt(e.target.value) || 4)}
                        className="bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6].map((cr) => (
                          <option key={cr} value={cr} className="bg-[#0b0c16]">
                            {cr} Credits
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddCourse(newCode, newName, newCredits)}
                      className="px-4 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-semibold font-mono flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Course</span>
                    </button>
                  </div>

                  {/* Quick Presets */}
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] text-slate-400 font-mono block mb-1.5">
                      Quick Preset Suggestions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_COURSE_PRESETS.map((preset) => (
                        <button
                          key={preset.code}
                          type="button"
                          onClick={() => handleAddCourse(preset.code, preset.name, preset.credits)}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] sm:text-[11px] text-slate-300 font-mono transition-all flex items-center gap-1 hover:border-cyan-400/30 cursor-pointer"
                        >
                          <span className="text-cyan-300 font-semibold">{preset.code}</span>
                          <span className="truncate max-w-[140px] sm:max-w-none">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Added Courses List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-300 uppercase tracking-wide">
                      Your Enrolled Courses ({courses.length})
                    </span>
                    {courses.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-400">
                        Total Credits: {courses.reduce((acc, c) => acc + (c.credits || 4), 0)}
                      </span>
                    )}
                  </div>

                  {courses.length === 0 ? (
                    <div className="p-5 rounded-2xl border border-dashed border-white/10 text-center text-xs text-slate-400 font-mono">
                      No courses added yet. Type your course code & title above or tap a preset.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {courses.map((course) => (
                        <div
                          key={course.courseCode}
                          className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-2.5 shadow-sm"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="shrink-0 px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold text-xs">
                              {course.courseCode}
                            </span>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-white block truncate">
                                {course.courseName}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono block truncate">
                                {course.credits} Credits • {course.schedule.join(", ")}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveCourse(course.courseCode)}
                            className="shrink-0 p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                            aria-label={`Remove ${course.courseCode}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =====================================================================
                STEP 3: WEEKLY CLASS SCHEDULE
            ====================================================================== */}
            {step === 3 && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <p className="text-xs text-slate-300 font-mono">
                  Select the days of the week each lecture meets for attendance tracking:
                </p>

                <div className="space-y-2.5">
                  {courses.map((course) => (
                    <div
                      key={course.courseCode}
                      className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.035] border border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="shrink-0 font-mono font-bold text-xs text-cyan-300">
                            {course.courseCode}
                          </span>
                          <span className="text-xs text-white font-medium truncate">
                            {course.courseName}
                          </span>
                        </div>
                        <span className="shrink-0 text-[10px] font-mono text-slate-400">
                          {course.schedule.length} days/wk
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {DAYS_OF_WEEK.map((day) => {
                          const isSelected = course.schedule.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggleDayForCourse(course.courseCode, day)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-sm"
                                  : "bg-white/[0.04] text-slate-400 border border-white/[0.08] hover:bg-white/[0.08]"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              FIXED / PINNED FOOTER CONTROLS
          ========================================================================== */}
          <div className="shrink-0 mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between relative z-10">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{step === 3 ? (user?.isOnboarded ? "Save & Update Courses" : "Launch Workspace") : "Continue"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
