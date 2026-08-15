"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { AvatarPicker } from "@/components/auth/AvatarPicker";
import { SpecularButton } from "@/components/ui/SpecularButton";

// Extend the Window interface for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup, loginWithGoogle, updateUserProfile } = useScholarStore();
  const [tab, setTab] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(1);

  // Google Sign-In callback
  const handleGoogleCallback = useCallback(async (response: { credential: string }) => {
    setError(null);
    setIsGoogleLoading(true);
    const result = await loginWithGoogle(response.credential);
    setIsGoogleLoading(false);
    if (result?.error) setError(result.error);
  }, [loginWithGoogle]);

  // Initialize Google Identity Services when modal opens
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the button into our container
        const btnContainer = document.getElementById("google-signin-btn");
        if (btnContainer) {
          // Clear any previous button render
          btnContainer.innerHTML = "";
          window.google.accounts.id.renderButton(btnContainer, {
            theme: "filled_black",
            size: "large",
            width: "100%",
            shape: "pill",
            text: "continue_with",
            logo_alignment: "left",
          });
        }
      }
    };

    // Check if the Google script is already loaded
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      // Load the Google Identity Services script dynamically
      const existingScript = document.getElementById("google-gsi-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-gsi-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          // Small delay to ensure google.accounts.id is ready
          setTimeout(initGoogle, 100);
        };
        document.head.appendChild(script);
      } else {
        // Script exists but may not have loaded yet
        setTimeout(initGoogle, 200);
      }
    }
  }, [isAuthModalOpen, handleGoogleCallback]);

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
      // Set the selected avatar after signup
      if (!result?.error) {
        updateUserProfile({ avatarId: selectedAvatarId });
      }
    } else {
      result = await login(email, password);
    }

    setIsLoading(false);
    if (result?.error) setError(result.error);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 backdrop-blur-3xl bg-black/85 overflow-y-auto">
        {/* Click outside to close */}
        <div className="fixed inset-0 -z-10" onClick={closeAuthModal} />

        {/* Modal Container with MagicCard */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className="w-full max-w-md max-h-[92vh] flex flex-col my-auto relative z-10"
        >
          <MagicCard
            gradientColor="rgba(0, 242, 254, 0.18)"
            borderBeamColorFrom="#00f2fe"
            borderBeamColorTo="#a855f7"
            borderBeamDuration={10}
            className="pt-6 pb-6 px-6 sm:px-7 relative shadow-[0_24px_80px_rgba(0,0,0,0.95)] max-h-[92vh] overflow-y-auto flex flex-col"
          >
            {/* Rotating Magic UI Border Beam */}
            <BorderBeam size={200} duration={9} colorFrom="#00f2fe" colorTo="#a855f7" />

            {/* Close Button - Sticky/Prominent */}
            <button
              onClick={closeAuthModal}
              type="button"
              className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 transition-all z-30 shadow-lg cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with Geometric Scholar Emblem */}
            <div className="text-center mb-4 relative z-10 pt-1">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#0d0e1a] border border-cyan-400/40 shadow-[0_0_16px_-2px_rgba(6,182,212,0.4)] mb-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
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

              <h3 className="text-xl font-bold text-white tracking-tight">
                {tab === "signup" ? "Create Scholar Account" : "Welcome Back"}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs mx-auto">
                {tab === "signup"
                  ? "Start your zero-state academic workspace with custom courses."
                  : "Log in to continue your milestone sprints and streaks."}
              </p>
            </div>

            {/* React Bits Specular Button for Google Sign-In */}
            <div className="relative z-10 mb-3">
              {isGoogleLoading ? (
                <div className="w-full py-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-xs text-slate-300">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <span>Signing in with Google...</span>
                </div>
              ) : (
                <div className="relative">
                  <SpecularButton
                    type="button"
                    borderGlowColor="rgba(0, 242, 254, 0.7)"
                    glowColor="rgba(255, 255, 255, 0.18)"
                    onClick={() => {
                      if (window.google?.accounts?.id) {
                        window.google.accounts.id.prompt();
                      }
                    }}
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span className="font-semibold text-slate-100 font-mono tracking-wide text-xs">
                      Continue with Google
                    </span>
                  </SpecularButton>

                  {/* Hidden underlying GSI iframe button that captures clicks transparently */}
                  <div
                    id="google-signin-btn"
                    className="absolute inset-0 opacity-0 pointer-events-auto overflow-hidden [&>div]:!w-full [&>div]:!h-full [&_iframe]:!w-full [&_iframe]:!h-full cursor-pointer"
                    style={{ minHeight: 40 }}
                  />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">or use email</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-white/10 mb-4 relative z-10">
              <button
                type="button"
                onClick={() => {
                  setTab("signup");
                  setError(null);
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  tab === "signin"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 relative z-10 pb-1">
              {error && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {tab === "signup" && (
                <>
                  {/* Kokonut UI Avatar Picker */}
                  <div className="py-1">
                    <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block mb-2 text-center">
                      Choose Your Avatar
                    </label>
                    <AvatarPicker selectedId={selectedAvatarId} onSelect={setSelectedAvatarId} compact={true} />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wide block mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Alex Vance"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 font-mono transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wide block mb-1">
                  University Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="scholar@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 font-mono transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wide block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
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
