"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { MagicCard } from "@/components/ui/MagicCard";
import { useScholarStore } from "@/store/useScholarStore";
import { Assignment } from "@/types/scholar";
import {
  CheckSquare,
  Clock,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

export const AssignmentKanban: React.FC = () => {
  const { assignments, updateAssignmentStatus, addAssignment, deleteAssignment } =
    useScholarStore();

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState("CS401");
  const [newPriority, setNewPriority] = useState<Assignment["priority"]>("medium");
  const [newDueDate, setNewDueDate] = useState("In 4 Days");
  const [newHours, setNewHours] = useState(3);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#00f2fe", "#6366f1", "#a855f7", "#10b981"],
      });
    } catch (e) {}
  };

  const handleStatusChange = (id: string, newStatus: Assignment["status"]) => {
    updateAssignmentStatus(id, newStatus);
    if (newStatus === "done") {
      triggerCelebration();
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAssignment({
      title: newTitle.trim(),
      courseCode: newCourse,
      status: "todo",
      priority: newPriority,
      dueDate: newDueDate,
      estimatedHours: Number(newHours) || 2,
    });

    setNewTitle("");
    setIsAdding(false);
  };

  const columns: {
    id: Assignment["status"];
    label: string;
    badgeVariant: "indigo" | "cyan" | "emerald";
    borderColor: string;
  }[] = [
    { id: "todo", label: "To Do", badgeVariant: "indigo", borderColor: "border-indigo-500/20" },
    { id: "in_progress", label: "In Progress", badgeVariant: "cyan", borderColor: "border-cyan-500/20" },
    { id: "done", label: "Completed", badgeVariant: "emerald", borderColor: "border-emerald-500/20" },
  ];

  const priorityColors = {
    urgent: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    high: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    medium: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    low: "bg-white/5 text-slate-300 border-white/10",
  };

  return (
    <MagicCard
      gradientColor="rgba(168, 85, 247, 0.15)"
      borderBeamColorFrom="#a855f7"
      borderBeamColorTo="#ec4899"
      className="col-span-1 lg:col-span-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shadow-inner shrink-0">
            <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
              Assignment &amp; Milestone Sprint Board
            </h3>
            <p className="text-[11px] text-slate-400 hidden sm:block">Deadlines, proofs &amp; problem set pipeline</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full backdrop-blur-3xl bg-[#08080f]/92 hover:bg-white/[0.08] text-purple-300 border border-white/[0.1] hover:border-purple-400/40 text-xs font-mono font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:scale-105 transition-all shrink-0"
        >
          <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline">Add Milestone</span>
        </button>
      </div>

      {/* Inline Quick Add Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-5 rounded-2xl bg-white/[0.04] border border-purple-500/40 backdrop-blur-xl shadow-2xl animate-in fade-in duration-200"
        >
          <div className="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            New Milestone Details
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="e.g. Fourier Operator Problem Set #4"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              autoFocus
            />

            <select
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="CS401">CS401 Quantum Computing</option>
              <option value="CS408">CS408 Deep Learning</option>
              <option value="MAT302">MAT302 Complex Analysis</option>
              <option value="PHY204">PHY204 Electrodynamics</option>
              <option value="CS420">CS420 Distributed Consensus</option>
            </select>

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🔵 Medium</option>
              <option value="low">⚪ Low</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-4">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md hover:scale-105 transition-all"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Kanban Grid — horizontal scroll on mobile, 3-col on md+ */}
      <div className="-mx-1 overflow-x-auto pb-2">
      <div className="grid grid-cols-3 md:grid-cols-3 gap-3 sm:gap-5 min-w-[540px] sm:min-w-0">
        {columns.map((col) => {
          const colAssignments = assignments.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] flex flex-col"
            >
              {/* Column Title */}
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/[0.06]">
                <span className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                  {col.label}
                </span>
                <Badge variant={col.badgeVariant} size="sm">
                  {colAssignments.length}
                </Badge>
              </div>

              {/* Assignment Cards */}
              <div className="space-y-3 flex-1 min-h-[160px]">
                {colAssignments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl text-slate-400 text-xs">
                    No items in {col.label.toLowerCase()}
                  </div>
                ) : (
                  colAssignments.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl bg-white/[0.035] border border-white/[0.08] hover:border-cyan-400/40 hover:bg-white/[0.06] transition-all duration-200 group flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        {/* Tags */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <span className="font-mono text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/25">
                            {task.courseCode}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md border ${
                              priorityColors[task.priority]
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2">
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Due Date & Action */}
                      <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {task.dueDate}
                        </span>

                        <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                          {col.id !== "done" ? (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  task.id,
                                  col.id === "todo" ? "in_progress" : "done"
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 text-[10px] flex items-center gap-1 border border-white/10 font-sans font-medium transition-all"
                              title={col.id === "todo" ? "Move to In Progress" : "Mark Completed"}
                            >
                              <span>{col.id === "todo" ? "Start" : "Done"}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              onClick={() => deleteAssignment(task.id)}
                              className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                              title="Archive completed"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </MagicCard>
  );
};
