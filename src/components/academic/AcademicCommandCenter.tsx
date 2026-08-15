"use client";

import React from "react";
import { AssignmentKanban } from "@/components/academic/AssignmentKanban";
import { AttendanceTracker } from "@/components/academic/AttendanceTracker";
import { Badge } from "@/components/ui/Badge";
import { CheckSquare } from "lucide-react";

export const AcademicCommandCenter: React.FC = () => {
  return (
    <section id="academic" className="py-20 scroll-mt-24 optimize-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="indigo" size="sm">
                <CheckSquare className="w-3 h-3 text-indigo-400" />
                ACADEMIC DASHBOARD
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Assignments & Attendance
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Track your coursework deadlines, tasks, and class attendance all in one place.
            </p>
          </div>
        </div>

        {/* 2-Column Grid: Kanban Pipeline (7 cols) + Dynamic Attendance Tracker (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <AssignmentKanban />
          </div>
          <div className="lg:col-span-5">
            <AttendanceTracker />
          </div>
        </div>
      </div>
    </section>
  );
};
