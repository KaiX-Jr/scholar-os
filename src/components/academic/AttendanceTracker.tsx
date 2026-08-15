"use client";

import React, { useState } from "react";
import { MagicCard } from "@/components/ui/MagicCard";
import { useScholarStore } from "@/store/useScholarStore";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Calculator,
  ShieldAlert,
  Calendar,
  Check,
  X as XIcon,
  MinusCircle,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CircularProgress } from "@/components/ui/CircularProgress";

export const AttendanceTracker: React.FC = () => {
  const { courses, logAttendance, addCourse, deleteCourse, openOnboarding } =
    useScholarStore();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses[0]?.id || ""
  );
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newCredits, setNewCredits] = useState(4);

  const selectedCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Overall attendance calculations
  const totalClasses = courses.reduce((acc, c) => acc + c.total, 0);
  const totalAttended = courses.reduce((acc, c) => acc + c.attended, 0);
  const overallPercentage =
    totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 100;

  // Danger threshold check (< 75%)
  const lowAttendanceCourses = courses.filter(
    (c) => c.total > 0 && (c.attended / c.total) * 100 < c.minThreshold
  );

  // Per-Course Analytics Calculations
  const currentRatio =
    selectedCourse && selectedCourse.total > 0
      ? selectedCourse.attended / selectedCourse.total
      : 1;

  // Classes needed to attend consecutively to reach 75%:
  const classesNeededToSafe =
    currentRatio < 0.75 && selectedCourse && selectedCourse.total > 0
      ? Math.ceil(
          (0.75 * selectedCourse.total - selectedCourse.attended) / 0.25
        )
      : 0;

  // Max consecutive classes you can safely skip while staying >= 75%:
  const maxSafeSkips =
    currentRatio >= 0.75 && selectedCourse && selectedCourse.total > 0
      ? Math.floor(
          (selectedCourse.attended - 0.75 * selectedCourse.total) / 0.75
        )
      : 0;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;
    addCourse({
      courseCode: newCode.toUpperCase().trim(),
      courseName: newName.trim(),
      credits: newCredits,
      minThreshold: 75,
      schedule: ["Mon", "Wed", "Fri"],
    });
    setNewCode("");
    setNewName("");
    setIsAddingCourse(false);
  };

  return (
    <MagicCard
      gradientColor="rgba(6, 182, 212, 0.18)"
      borderBeamColorFrom="#00f2fe"
      borderBeamColorTo="#10b981"
      className="h-full flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shadow-inner">
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Course Attendance Tracker
              </h3>
              <p className="text-xs text-slate-400">
                75% Mandatory Threshold & Bunk Analyzer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingCourse(!isAddingCourse)}
              className="px-3.5 py-1.5 rounded-full backdrop-blur-3xl bg-[#08080f]/92 hover:bg-white/[0.08] text-cyan-300 border border-white/[0.1] hover:border-cyan-400/40 text-xs font-mono flex items-center gap-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:scale-105 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Course</span>
            </button>

            {lowAttendanceCourses.length > 0 ? (
              <Badge variant="rose" size="sm">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                {lowAttendanceCourses.length} Warning
              </Badge>
            ) : (
              <Badge variant="emerald" size="sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Safe
              </Badge>
            )}
          </div>
        </div>

        {/* Inline Add Course Form */}
        {isAddingCourse && (
          <form
            onSubmit={handleQuickAdd}
            className="mb-4 p-4 rounded-2xl bg-white/[0.04] border border-cyan-400/40 backdrop-blur-xl animate-in fade-in space-y-2.5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                required
                placeholder="Code (e.g. CS401)"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="sm:col-span-4 bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                required
                placeholder="Course Title"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="sm:col-span-8 bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingCourse(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono"
              >
                Save Course
              </button>
            </div>
          </form>
        )}

        {/* Low Threshold Warning Banner */}
        {lowAttendanceCourses.length > 0 && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 shadow-inner">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-rose-200">
                Attendance Deficit in{" "}
                {lowAttendanceCourses.map((c) => c.courseCode).join(", ")}
              </span>
              <p className="text-slate-300 mt-0.5 leading-relaxed">
                Attendance is below 75%. Attend consecutive classes to restore hall ticket eligibility.
              </p>
            </div>
          </div>
        )}

        {/* Course Cards / Zero State */}
        {courses.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center space-y-3">
            <Clock className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
            <div className="text-xs font-semibold text-white">
              No Enrolled Courses Found
            </div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Add your university subjects to begin tracking daily attendance and bunk safety limits.
            </p>
            <button
              onClick={openOnboarding}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-semibold transition-all"
            >
              Launch Onboarding Wizard
            </button>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {courses.map((course) => {
              const pct =
                course.total > 0
                  ? (course.attended / course.total) * 100
                  : 100;
              const isLow = course.total > 0 && pct < course.minThreshold;
              const isSelected =
                course.id === (selectedCourse?.id || courses[0]?.id);

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white/[0.08] border-cyan-400/50 shadow-md ring-1 ring-cyan-400/30"
                      : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300">
                        {course.courseCode}
                      </span>
                      <span className="text-xs font-semibold text-white truncate max-w-[140px] sm:max-w-[180px]">
                        {course.courseName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-extrabold ${
                          isLow ? "text-rose-400" : "text-emerald-400"
                        }`}
                      >
                        {course.total > 0 ? `${pct.toFixed(1)}%` : "100%"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({course.attended}/{course.total})
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2.5 w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-px">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLow
                          ? "bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                          : "bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  {/* Daily Logging Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="text-[10px] font-mono text-slate-400">
                      Log Today:
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          logAttendance(course.id, "present");
                        }}
                        className="px-3 py-1 rounded-full bg-[#08080f]/90 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-semibold flex items-center gap-1 hover:scale-105 transition-all shadow-sm"
                      >
                        <Check className="w-3 h-3" />
                        <span>Present</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          logAttendance(course.id, "absent");
                        }}
                        className="px-3 py-1 rounded-full bg-[#08080f]/90 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-mono font-semibold flex items-center gap-1 hover:scale-105 transition-all shadow-sm"
                      >
                        <XIcon className="w-3 h-3" />
                        <span>Absent</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          logAttendance(course.id, "cancelled");
                        }}
                        className="px-2.5 py-1 rounded-full bg-[#08080f]/90 hover:bg-white/10 text-slate-400 border border-white/10 text-[11px] font-mono flex items-center gap-1 hover:scale-105 transition-all"
                      >
                        <MinusCircle className="w-3 h-3" />
                        <span className="hidden sm:inline">Off</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Smart Analytics & Insight Card */}
      {selectedCourse && (
        <div className="mt-5 pt-4 border-t border-white/[0.08]">
          <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-cyan-400" />
                {selectedCourse.courseCode} Analytics Insight
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Min 75% Requirement
              </span>
            </div>

            {selectedCourse.total === 0 ? (
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                No classes recorded yet for {selectedCourse.courseCode}. Click <strong>Present</strong> or <strong>Absent</strong> above after attending your lecture.
              </p>
            ) : currentRatio >= 0.75 ? (
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-300">
                  Safe Status: You can safely skip{" "}
                  <strong className="text-white font-bold">{maxSafeSkips}</strong>{" "}
                  consecutive {maxSafeSkips === 1 ? "class" : "classes"}.
                </span>
                <Badge variant="emerald" size="sm">
                  Eligible
                </Badge>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-rose-300">
                  Deficit: Attend{" "}
                  <strong className="text-white font-bold">{classesNeededToSafe}</strong>{" "}
                  consecutive {classesNeededToSafe === 1 ? "class" : "classes"} to restore 75%.
                </span>
                <Badge variant="rose" size="sm">
                  Action Required
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}
    </MagicCard>
  );
};
