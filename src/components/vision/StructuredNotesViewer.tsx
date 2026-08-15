"use client";

import React, { useState } from "react";
import katex from "katex";
import { Copy, Check, Download, FileText, Share2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface StructuredNotesViewerProps {
  topicTitle: string;
  notesMarkdown: string;
  summary: string;
  keyFormulas?: string[];
}

export const StructuredNotesViewer: React.FC<StructuredNotesViewerProps> = ({
  topicTitle,
  notesMarkdown,
  summary,
  keyFormulas = [],
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(notesMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([`# ${topicTitle}\n\n${summary}\n\n${notesMarkdown}`], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topicTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to render inline and block LaTeX safely with KaTeX
  const renderMathContent = (content: string) => {
    // Split by block math $$...$$
    const blockParts = content.split(/\$\$([\s\S]*?)\$\$/g);

    return blockParts.map((part, index) => {
      // Odd indices are block math formulas
      if (index % 2 === 1) {
        try {
          const html = katex.renderToString(part.trim(), {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <div
              key={`block-${index}`}
              className="my-4 p-3.5 rounded-xl bg-black/40 border border-white/[0.08] overflow-x-auto text-cyan-200 shadow-inner flex justify-center"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return (
            <div key={`block-err-${index}`} className="my-2 p-2 bg-rose-500/10 text-rose-300 font-mono text-xs">
              {part}
            </div>
          );
        }
      }

      // Even indices: render markdown paragraphs and inline math $...$
      const paragraphs = part.split("\n\n");

      return (
        <div key={`text-${index}`} className="space-y-3">
          {paragraphs.map((para, pIdx) => {
            if (!para.trim()) return null;

            // Headers
            if (para.startsWith("### ")) {
              return (
                <h3
                  key={pIdx}
                  className="text-base font-bold text-white tracking-wide border-b border-white/[0.08] pb-1.5 mt-4 text-cyan-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {renderInlineMath(para.replace("### ", ""))}
                </h3>
              );
            }
            if (para.startsWith("## ")) {
              return (
                <h2
                  key={pIdx}
                  className="text-lg font-bold text-white tracking-wide border-b border-white/[0.08] pb-1.5 mt-5"
                >
                  {renderInlineMath(para.replace("## ", ""))}
                </h2>
              );
            }

            // Unordered list
            if (para.startsWith("- ") || para.startsWith("* ")) {
              const items = para.split("\n").filter((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "));
              return (
                <ul key={pIdx} className="list-disc list-inside space-y-1.5 pl-2 text-slate-300 text-xs sm:text-sm">
                  {items.map((item, iIdx) => (
                    <li key={iIdx} className="leading-relaxed">
                      {renderInlineMath(item.replace(/^[-*]\s+/, ""))}
                    </li>
                  ))}
                </ul>
              );
            }

            // Divider
            if (para.trim() === "---") {
              return <hr key={pIdx} className="border-white/[0.08] my-4" />;
            }

            // Standard paragraph
            return (
              <p key={pIdx} className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {renderInlineMath(para)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  // Render inline LaTeX $...$
  const renderInlineMath = (text: string) => {
    const inlineParts = text.split(/\$([^$]+)\$/g);
    return inlineParts.map((segment, sIdx) => {
      if (sIdx % 2 === 1) {
        try {
          const html = katex.renderToString(segment, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={`inline-${sIdx}`}
              className="inline-block px-1 mx-0.5 text-cyan-300 font-medium"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <span key={`inline-err-${sIdx}`}>${segment}$</span>;
        }
      }

      // Parse bold **text**
      const boldParts = segment.split(/\*\*([^*]+)\*\*/g);
      return boldParts.map((bSeg, bIdx) => {
        if (bIdx % 2 === 1) {
          return (
            <strong key={`bold-${bIdx}`} className="font-bold text-white">
              {bSeg}
            </strong>
          );
        }
        return bSeg;
      });
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-1">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/[0.06] gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" size="sm">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              LaTeX KaTeX Engine
            </Badge>
          </div>
          <h2 className="text-lg font-bold text-white">{topicTitle}</h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs flex items-center gap-1.5 transition-all"
            title="Copy Raw Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy MD"}</span>
          </button>

          <button
            onClick={handleExport}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs flex items-center gap-1.5 transition-all"
            title="Export as Markdown file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Box */}
      {summary && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-transparent border border-cyan-500/20 mb-5">
          <span className="text-[11px] font-mono text-cyan-300 font-semibold uppercase tracking-wider block mb-1">
            Executive Summary
          </span>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Rendered Notes with KaTeX Math */}
      <div className="space-y-4">{renderMathContent(notesMarkdown)}</div>
    </div>
  );
};
