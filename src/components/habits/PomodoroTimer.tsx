"use client";

import React, { useEffect } from "react";
import { useScholarStore } from "@/store/useScholarStore";
import { useSoundSynth } from "@/hooks/useSoundSynth";
import { AudioVisualizer } from "./AudioVisualizer";
import { formatSeconds } from "@/lib/utils";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Headphones,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const PomodoroTimer: React.FC = () => {
  const {
    pomodoro,
    setPomodoroRunning,
    setPomodoroMode,
    tickPomodoro,
    resetPomodoro,
    setPomodoroSound,
    setPomodoroVolume,
  } = useScholarStore();

  const { analyser, initAudio } = useSoundSynth(
    pomodoro.soundPreset,
    pomodoro.volume,
    pomodoro.isRunning
  );

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (pomodoro.isRunning) {
      interval = setInterval(() => {
        tickPomodoro();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoro.isRunning, tickPomodoro]);

  const toggleRunning = () => {
    if (!pomodoro.isRunning) {
      initAudio();
    }
    setPomodoroRunning(!pomodoro.isRunning);
  };

  // Circular gauge math
  const totalSeconds = pomodoro.durationMinutes * 60;
  const progress = ((totalSeconds - pomodoro.remainingSeconds) / totalSeconds) * 100;
  const radius = 64;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const soundPresets: {
    id: typeof pomodoro.soundPreset;
    name: string;
    desc: string;
  }[] = [
    { id: "binaural_alpha", name: "10Hz Alpha Waves", desc: "432Hz Binaural Focus" },
    { id: "deep_theta", name: "6Hz Theta Waves", desc: "Deep Conceptual Recall" },
    { id: "rain_focus", name: "Pink Noise Rain", desc: "Chalkboard Flow State" },
    { id: "stellar_ambient", name: "Stellar Ambient", desc: "Harmonic Analog Drone" },
    { id: "none", name: "Mute Synth", desc: "Silent Focus" },
  ];

  const focusHoursLogged = ((pomodoro.sessionsCompleted * 25) / 60).toFixed(1);

  return (
    <div className="relative rounded-3xl backdrop-blur-3xl bg-[#0a0b16]/92 border border-white/[0.12] shadow-[0_16px_48px_rgba(0,0,0,0.7)] p-6 sm:p-7 h-full flex flex-col justify-between overflow-hidden">
      {/* Top Specular Highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shadow-inner">
              <Headphones className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Deep Work Synthesizer</h3>
              <p className="text-xs text-slate-400">Pomodoro timer & neuro-acoustic focus audio</p>
            </div>
          </div>

          <Badge variant={pomodoro.isRunning ? "cyan" : "neutral"} size="sm">
            {pomodoro.isRunning ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Active Session
              </>
            ) : (
              "Paused"
            )}
          </Badge>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/60 border border-white/[0.1] mb-6 shadow-inner">
          <button
            onClick={() => setPomodoroMode("work")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              pomodoro.mode === "work"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Deep Work (25m)
          </button>

          <button
            onClick={() => setPomodoroMode("short_break")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              pomodoro.mode === "short_break"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Short Break (5m)
          </button>

          <button
            onClick={() => setPomodoroMode("long_break")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              pomodoro.mode === "long_break"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Circular Countdown & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-4">
          {/* Circular Countdown */}
          <div className="relative flex items-center justify-center">
            <svg height={radius * 2} width={radius * 2} className="-rotate-90">
              <circle
                stroke="rgba(255, 255, 255, 0.08)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="url(#timerGrad)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{
                  strokeDashoffset,
                  transition: "stroke-dashoffset 0.5s ease-in-out",
                }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <defs>
                <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#00f2fe" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute flex flex-col items-center justify-center select-none">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight drop-shadow-[0_0_12px_rgba(0,242,254,0.4)]">
                {formatSeconds(pomodoro.remainingSeconds)}
              </span>
              <span className="text-[10px] text-cyan-300 font-bold uppercase font-mono mt-0.5 tracking-wider">
                {pomodoro.mode.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col items-center gap-3">
            <button
              onClick={toggleRunning}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                pomodoro.isRunning
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                  : "bg-[#08080f]/95 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 hover:scale-105 shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              }`}
              title={pomodoro.isRunning ? "Pause Session" : "Start Session"}
            >
              {pomodoro.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={resetPomodoro}
              className="w-10 h-10 rounded-full bg-[#08080f]/90 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center transition-all shadow-sm hover:scale-105"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Audio Visualizer Spectrum */}
        <div className="my-5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              LIVE FREQUENCY SPECTRUM
            </span>
            <span className="text-cyan-300 font-mono text-[10px]">
              {pomodoro.soundPreset === "none" ? "Synth Off" : "Web Audio Synth"}
            </span>
          </div>

          <AudioVisualizer
            analyser={analyser}
            isPlaying={pomodoro.isRunning && pomodoro.soundPreset !== "none"}
            colorPreset="violet"
          />
        </div>
      </div>

      {/* Audio Preset Selector & Volume Slider (No overflow / drop-out) */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between gap-2.5">
          <select
            value={pomodoro.soundPreset}
            onChange={(e) => setPomodoroSound(e.target.value as any)}
            className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-purple-400 font-mono truncate"
          >
            {soundPresets.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.name} — {sp.desc}
              </option>
            ))}
          </select>

          {/* Volume Control - Contained */}
          <div className="flex items-center gap-2 w-20 sm:w-24 shrink-0">
            {pomodoro.volume === 0 ? (
              <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={pomodoro.volume}
              onChange={(e) => setPomodoroVolume(Number(e.target.value))}
              className="accent-purple-400 w-full h-1.5 bg-white/10 rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Sessions Completed Today: <strong className="text-white font-bold">{pomodoro.sessionsCompleted}</strong></span>
          <span className="text-purple-300 font-bold">{focusHoursLogged} hrs Focus</span>
        </div>
      </div>
    </div>
  );
};
