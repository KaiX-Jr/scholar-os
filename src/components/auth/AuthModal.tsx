"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useScholarStore } from "@/store/useScholarStore";
import { MagicCard } from "@/components/ui/MagicCard";
import { BorderBeam } from "@/components/ui/BorderBeam";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup } = useScholarStore();
  const [tab, setTab] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid academic email address.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setIsLoading(true);
    let result: { error?: string };

    if (tab === "signup") {
      if (!name.trim()) {
        setError("Please enter your name.");
        setIsLoading(false);
        return;
      }
      result = await signup(name, email, password);
    } else {
      result = await login(email, password);
    }

    setIsLoading(false);
    if (result?.error) setError(result.error);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 backdrop-blur-3xl bg-black/80">
        {/* Click outside to close */}
        <div className="absolute inset-0 -z-10" onClick={closeAuthModal} />

        {/* Modal Container with MagicCard from Magic UI */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className="w-full max-w-md"
        >
          <MagicCard
            gradientColor="rgba(0, 242, 254, 0.18)"
            borderBeamColorFrom="#00f2fe"
            borderBeamColorTo="#a855f7"
            borderBeamDuration={10}
            className="pt-9 pb-8 px-7 sm:px-8 relative overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.95)]"
          >
            {/* Rotating Magic UI Border Beam */}
            <BorderBeam size={220} duration={9} colorFrom="#00f2fe" colorTo="#a855f7" />

            {/* Close Button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with Geometric Scholar Emblem */}
            <div className="text-center mb-6 relative z-10 pt-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0d0e1a] border border-cyan-400/40 shadow-[0_0_20px_-3px_rgba(6,182,212,0.4)] mb-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                >
                  <path
                    d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z"
                    stroke="url(#auth-scholar-grad)"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 22V12M12 12L20.5 7M12 12L3.5 7"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeOpacity="0.8"
                  />
                  <circle cx="12" cy="12" r="1.75" fill="#38bdf8" className="animate-pulse" />
                  <defs>
                    <linearGradient
                      id="auth-scholar-grad"
                      x1="3.5"
                      y1="2"
                      x2="20.5"
                      y2="22"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#00f2fe" />
                      <stop offset="0.5" stopColor="#6366f1" />
                      <stop offset="1" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                {tab === "signup" ? "Create Scholar Account" : "Welcome Back"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                {tab === "signup"
                  ? "Start your zero-state academic workspace with custom courses & tracking."
                  : "Log in to continue your milestone sprints and habit streaks."}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-white/10 mb-6 relative z-10">
              <button
                type="button"
                onClick={() => {
                  setTab("signup");
                  setError(null);
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  tab === "signup"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign Up (New)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("signin");
                  setError(null);
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  tab === "signin"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {tab === "signup" && (
                <div>
                  <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wide block mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Alex Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 font-mono transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wide block mb-1.5">
                  University Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="scholar@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 font-mono transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wide block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    <span>{tab === "signup" ? "Creating Account..." : "Signing In..."}</span>
                  </>
                ) : (
                  <>
                    <span>{tab === "signup" ? "Proceed to Onboarding" : "Sign In to Workspace"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </MagicCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
