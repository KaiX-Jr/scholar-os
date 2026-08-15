"use client";

import React, { useState, useEffect } from "react";
import { Compass, Sparkles, MapPin, Calendar, MessageSquare, ArrowUpRight, Plane } from "lucide-react";
import { AmbientSoundPlayer } from "@/components/audio/AmbientSoundPlayer";

interface ParisNavbarProps {
  onOpenBooking: () => void;
}

export const ParisNavbar: React.FC<ParisNavbarProps> = ({ onOpenBooking }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#060609]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.7)] py-3.5"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 via-white/10 to-amber-200/30 border border-amber-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-4 h-4 text-amber-300 animate-spin-slow" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-[0.25em] text-sm font-bold text-white uppercase">
                ÉLÉGANCE
              </span>
              <span className="text-[10px] font-mono tracking-widest text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                PARIS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase hidden sm:block">
              Curated Luxury Journey
            </p>
          </div>
        </div>

        {/* Center: Luxury Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl shadow-inner">
          <button
            onClick={() => scrollTo("flight-hero")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <Plane className="w-3.5 h-3.5 text-amber-400" />
            Ascent
          </button>

          <button
            onClick={() => scrollTo("monuments")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            Monuments
          </button>

          <button
            onClick={() => scrollTo("experiences")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Experiences
          </button>

          <button
            onClick={() => scrollTo("itinerary")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            Itinerary
          </button>

          <button
            onClick={() => scrollTo("concierge")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            AI Concierge
          </button>
        </nav>

        {/* Right: Ambient Audio & Booking Action */}
        <div className="flex items-center gap-3">
          <AmbientSoundPlayer />

          <button
            onClick={onOpenBooking}
            className="relative group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-black overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 opacity-95 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 font-bold tracking-wider uppercase text-[11px]">
              Reserve Pass
            </span>
            <ArrowUpRight className="relative z-10 w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
