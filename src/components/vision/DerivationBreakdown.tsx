"use client";

import React, { useState } from "react";
import katex from "katex";
import { DerivationStep } from "@/types/scholar";
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface DerivationBreakdownProps {
  steps: DerivationStep[];
}

export const DerivationBreakdown: React.FC<DerivationBreakdownProps> = ({ steps }) => {
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const toggleStep = (stepNum: number) => {
    setExpandedSteps((prev) => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    steps.forEach((s) => (all[s.stepNumber] = true));
    setExpandedSteps(all);
  };

  const collapseAll = () => {
    setExpandedSteps({});
  };

  const renderKatexFormula = (latex: string) => {
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

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
        <div>
          <h3 className="text-sm font-semibold text-white">Step-by-Step Mathematical Derivation</h3>
          <p className="text-xs text-slate-400">Sequential deductive proofs extracted from blackboard</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Expand All
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={collapseAll}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            Collapse
          </button>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3.5">
        {steps.map((step) => {
          const isExpanded = !!expandedSteps[step.stepNumber];

          return (
            <div
              key={step.stepNumber}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-white/15"
            >
              {/* Step Header */}
              <div
                onClick={() => toggleStep(step.stepNumber)}
                className="p-3.5 flex items-center justify-between cursor-pointer bg-white/[0.015] hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold">
                    {step.stepNumber}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white">
                    {step.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    Step {step.stepNumber} of {steps.length}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Step Body */}
              {isExpanded && (
                <div className="p-4 pt-2 border-t border-white/[0.04] space-y-3 animate-in fade-in duration-200">
                  {/* Formula Container */}
                  {step.formula && (
                    <div className="p-3 rounded-lg bg-black/40 border border-cyan-500/20 text-cyan-200 flex justify-center shadow-inner overflow-x-auto">
                      {renderKatexFormula(step.formula)}
                    </div>
                  )}

                  {/* Theoretical Explanation */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.explanation}
                  </p>

                  {/* Intuition Callout */}
                  {step.intuition && (
                    <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-2.5 text-xs text-indigo-200">
                      <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-indigo-300 block mb-0.5">
                          Physical & Geometric Intuition
                        </span>
                        <p className="text-slate-300">{step.intuition}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
