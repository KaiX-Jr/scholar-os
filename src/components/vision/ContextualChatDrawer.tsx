"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import katex from "katex";
import { ChatMessage } from "@/types/scholar";
import { Send, Bot, User, Sparkles, MessageSquare, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface ContextualChatDrawerProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSendMessage: (text: string) => void;
  suggestedQuestions?: string[];
}

export const ContextualChatDrawer: React.FC<ContextualChatDrawerProps> = ({
  messages,
  isStreaming,
  onSendMessage,
  suggestedQuestions = [
    "How does quantum tunneling through a finite barrier occur?",
    "Can you derive the Heisenberg uncertainty relation from this wave equation?",
    "Explain the physical intuition of probability flux vector J.",
  ],
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isUserScrolledUp = useRef(false);

  // Track whether user has scrolled away from the bottom
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isUserScrolledUp.current = distanceFromBottom > 80;
    setShowScrollButton(isUserScrolledUp.current);
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (force || !isUserScrolledUp.current) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // Auto-scroll only when user is already at the bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSendMessage(input.trim());
    setInput("");
  };

  // Helper to render KaTeX math in chat bubbles
  const renderMessageContent = (content: string) => {
    // Split by block math $$...$$
    const blockParts = content.split(/\$\$([\s\S]*?)\$\$/g);

    return blockParts.map((part, index) => {
      if (index % 2 === 1) {
        try {
          const html = katex.renderToString(part.trim(), {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <div
              key={`block-${index}`}
              className="my-2 p-2 rounded-lg bg-black/40 border border-cyan-500/20 text-cyan-200 overflow-x-auto text-xs"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <div key={`err-${index}`} className="font-mono text-xs">{part}</div>;
        }
      }

      // Render lines with markdown headers/bold/inline math
      const lines = part.split("\n");
      return (
        <div key={`text-${index}`} className="space-y-1.5">
          {lines.map((line, lIdx) => {
            if (!line.trim()) return <div key={lIdx} className="h-1" />;

            if (line.startsWith("### ")) {
              return (
                <h4 key={lIdx} className="text-xs font-bold text-cyan-300 mt-2">
                  {renderInlineMath(line.replace("### ", ""))}
                </h4>
              );
            }

            return (
              <p key={lIdx} className="text-xs sm:text-[13px] leading-relaxed">
                {renderInlineMath(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };

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
              className="inline-block px-1 text-cyan-300 font-medium"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <span key={`inline-err-${sIdx}`}>${segment}$</span>;
        }
      }

      // Parse bold
      const boldParts = segment.split(/\*\*([^*]+)\*\*/g);
      return boldParts.map((bSeg, bIdx) => {
        if (bIdx % 2 === 1) {
          return <strong key={bIdx} className="font-bold text-white">{bSeg}</strong>;
        }
        return bSeg;
      });
    });
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white">Lecture Research Mentor</h3>
            <p className="text-[11px] text-slate-400">Scoped to current board notes & equations</p>
          </div>
        </div>

        <Badge variant="indigo" size="sm">
          <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
          AI Stream
        </Badge>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto space-y-3 pr-1 max-h-[320px] min-h-[220px]"
      >
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs ${
                  isUser
                    ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none shadow-md"
                    : "bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-tl-none backdrop-blur-md"
                }`}
              >
                {renderMessageContent(msg.content)}

                {msg.isStreaming && (
                  <span className="inline-block w-1.5 h-3.5 ml-1 bg-cyan-400 animate-pulse align-middle" />
                )}

                <div
                  className={`text-[9px] mt-1.5 ${
                    isUser ? "text-cyan-200" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-indigo-300" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll-to-bottom button — appears when user scrolls up during streaming */}
      {showScrollButton && (
        <div className="flex justify-center -mt-1 mb-1">
          <button
            onClick={() => scrollToBottom(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-mono hover:bg-cyan-500/30 transition-all animate-bounce"
          >
            <ChevronDown className="w-3 h-3" />
            New reply below
          </button>
        </div>
      )}

      {/* Suggested Question Chips */}
      {suggestedQuestions && suggestedQuestions.length > 0 && (
        <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-400 font-mono shrink-0">Prompts:</span>
          {suggestedQuestions.map((q, qIdx) => (
            <button
              key={qIdx}
              onClick={() => onSendMessage(q)}
              disabled={isStreaming}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-cyan-300 border border-white/10 shrink-0 transition-all text-left"
            >
              {q.length > 42 ? q.slice(0, 42) + "..." : q}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <form onSubmit={handleSubmit} className="pt-2 border-t border-white/[0.06] relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the board proof or physics..."
          disabled={isStreaming}
          className="w-full pl-3 pr-10 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="absolute right-1.5 top-3.5 p-1 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white disabled:opacity-30 transition-opacity"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
