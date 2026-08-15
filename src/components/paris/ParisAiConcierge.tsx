"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Sparkles, User, Bot, RefreshCw, Copy, Check, Compass, Lightbulb } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PROMPT_SUGGESTIONS = [
  "What is the best secret spot to photograph the Eiffel Tower at sunset?",
  "Recommend a 1-day romantic luxury itinerary with dinner & jazz.",
  "Which entrance to the Louvre has the shortest security queue?",
  "What are the best vintage boutique stores and cafes in Le Marais?",
  "Suggest a Michelin-star wine pairing experience for two."
];

export const ParisAiConcierge: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour and welcome! I am your **Élégance Paris AI Concierge**. Whether you are seeking secret panoramic viewpoints, skip-the-line museum strategies, or Michelin-starred wine pairings along the Seine, how may I assist your Parisian journey today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const userMessage: Message = { role: "user", content: query };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach concierge service");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantContent,
          };
          return updated;
        });
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Pardonnez-moi, I encountered a connection issue while contacting our concierge servers. Please ensure your Gemini API key is valid or try again shortly."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="concierge" className="relative py-28 bg-[#09090e]">
      {/* Background ambient lights */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI CONCIERGE • NEURAL COGNITIVE ENGINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide uppercase">
            Your Personal Paris Concierge
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Ask anything about Paris—curated restaurant bookings, hidden viewpoints, art history anecdotes, or custom transport routes.
          </p>
        </div>

        {/* Chat Drawer / Workspace */}
        <div className="mt-12 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col h-[650px]">
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-white/[0.08] bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500/30 to-amber-400/30 border border-emerald-400/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase font-serif tracking-wider">
                  ÉLÉGANCE PARIS CONCIERGE
                </span>
                <span className="text-[10px] font-mono text-emerald-400 block">
                  ● Real-Time Multimodal Travel Assistant
                </span>
              </div>
            </div>

            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1.5"
              title="Reset Conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Compass className="w-4 h-4 text-emerald-400" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium"
                      : "bg-white/[0.04] border border-white/[0.08] text-slate-200"
                  }`}
                >
                  {/* Markdown content rendering */}
                  <div className="prose prose-invert prose-xs sm:prose-sm max-w-none whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {msg.role === "assistant" && msg.content && (
                    <button
                      onClick={() => copyToClipboard(msg.content, idx)}
                      className="mt-2 text-[10px] font-mono text-slate-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy recommendation</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-emerald-300 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Paris Concierge is curating your personalized itinerary...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-6 py-2.5 bg-black/20 border-t border-white/[0.04] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 shrink-0 uppercase">
              <Lightbulb className="w-3 h-3 text-amber-400" />
              Suggested:
            </span>
            {PROMPT_SUGGESTIONS.map((sug, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleSendMessage(sug)}
                disabled={isLoading}
                className="shrink-0 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/5 text-[11px] transition-all"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-white/[0.08] bg-black/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about hidden Paris spots, museum tricks, vintage cafes, or dining..."
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/50 transition-all font-sans"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
