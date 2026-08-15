"use client";

import React, { useState } from "react";
import { useBoardAnalysis } from "@/hooks/useBoardAnalysis";
import { HighResImageViewer } from "@/components/vision/HighResImageViewer";
import { StructuredNotesViewer } from "@/components/vision/StructuredNotesViewer";
import { DerivationBreakdown } from "@/components/vision/DerivationBreakdown";
import { ActiveRecallFlashcards } from "@/components/vision/ActiveRecallFlashcards";
import { ContextualChatDrawer } from "@/components/vision/ContextualChatDrawer";
import { BoardHistoryShelf } from "@/components/vision/BoardHistoryShelf";

import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  FileText,
  ListOrdered,
  Brain,
  MessageSquare,
  Eye,
  UploadCloud,
  Layers,
} from "lucide-react";

type StudioTab = "notes" | "steps" | "flashcards" | "chat";

export const BoardToStudyStudio: React.FC = () => {
  const {
    activeBoardResult,
    activeImageUri,
    boardHistory,
    isAnalyzing,
    chatMessages,
    isChatStreaming,
    imageFilters,
    processImageFile,
    selectBoardHistoryItem,
    deleteBoardFromHistory,
    clearBoardHistory,
    sendChatMessage,
    updateFilters,
    resetFilters,
  } = useBoardAnalysis();

  const [activeTab, setActiveTab] = useState<StudioTab>("notes");

  const tabs = [
    { id: "notes" as StudioTab, label: "Notes", icon: FileText },
    {
      id: "steps" as StudioTab,
      label: "Steps",
      icon: ListOrdered,
      count: activeBoardResult?.steps?.length,
    },
    {
      id: "flashcards" as StudioTab,
      label: "Cards",
      icon: Brain,
      count: activeBoardResult?.flashcards?.length,
    },
    { id: "chat" as StudioTab, label: "Ask AI", icon: MessageSquare },
  ];

  return (
    <section id="vision" className="py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan" size="sm">
              <Eye className="w-3 h-3 text-cyan-400" />
              "BOARD-TO-STUDY" OPTICAL STUDIO
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Classroom Blackboard Intelligence
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Upload a classroom chalkboard photo to generate structured notes, step-by-step derivations, and active recall flashcards.
          </p>
        </div>

        {/* Lecture History & Saved Boards Shelf */}
        <BoardHistoryShelf
          history={boardHistory}
          activeBoardId={
            boardHistory.find(
              (b) => b.topicTitle.toLowerCase() === activeBoardResult?.topicTitle?.toLowerCase()
            )?.id
          }
          onSelectBoard={selectBoardHistoryItem}
          onDeleteBoard={deleteBoardFromHistory}
          onClearHistory={clearBoardHistory}
        />

        {/* Split Screen Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Pane: High-Res Interactive Image Viewer (5 cols on lg) */}
          <div className="lg:col-span-5 h-[460px] sm:h-[540px] lg:h-[640px]">
            <HighResImageViewer
              imageUri={activeImageUri}
              isAnalyzing={isAnalyzing}
              filters={imageFilters}
              updateFilters={updateFilters}
              resetFilters={resetFilters}
              onFileUpload={processImageFile}
            />
          </div>

          {/* Right Pane: Analysis Workspace with Tabbed Views (7 cols on lg) */}
          <div className="lg:col-span-7 h-[500px] sm:h-[560px] lg:h-[640px] flex flex-col">
            <GlassCard glowColor="cyan" className="p-3 sm:p-6 h-full flex flex-col">
              {/* Tab Header Bar - Mobile Scrollable without Clipping */}
              <div className="w-full border-b border-white/[0.08] pb-2.5 sm:pb-3 mb-3 sm:mb-4 shrink-0 overflow-x-auto custom-scrollbar">
                <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-full bg-black/40 border border-white/[0.08] w-max mx-auto sm:w-auto justify-start sm:justify-center">
                  {tabs.map((t) => {
                    const Icon = t.icon;
                    const isActive = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                          isActive
                            ? "bg-[#08080f]/95 text-cyan-300 border border-cyan-400/40 shadow-md shadow-cyan-500/20"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.label}</span>
                        {t.count !== undefined && (
                          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono leading-none">
                            {t.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 min-h-0 overflow-hidden relative">
                {activeBoardResult ? (
                  <>
                    {activeTab === "notes" && (
                      <StructuredNotesViewer
                        topicTitle={activeBoardResult.topicTitle}
                        notesMarkdown={activeBoardResult.structuredNotes}
                        summary={activeBoardResult.summary}
                        keyFormulas={activeBoardResult.keyFormulas}
                      />
                    )}

                    {activeTab === "steps" && (
                      <DerivationBreakdown steps={activeBoardResult.steps} />
                    )}

                    {activeTab === "flashcards" && (
                      <ActiveRecallFlashcards cards={activeBoardResult.flashcards} />
                    )}

                    {activeTab === "chat" && (
                      <ContextualChatDrawer
                        messages={chatMessages}
                        isStreaming={isChatStreaming}
                        onSendMessage={sendChatMessage}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 sm:p-8 border border-dashed border-white/10 rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                      <UploadCloud className="w-7 h-7 text-cyan-300 animate-pulse" />
                    </div>
                    <h4 className="text-base font-bold text-white font-mono">
                      No Blackboard Image Loaded
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed px-2 sm:px-0">
                      Upload or snap a classroom chalkboard photo to generate structured notes, step-by-step logic, and active recall flashcards.
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-[11px] font-mono text-cyan-300">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Supported: JPG, PNG, WEBP & Live WebCam</span>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};
