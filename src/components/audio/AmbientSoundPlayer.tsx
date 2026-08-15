"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music, Sparkles } from "lucide-react";

export const AmbientSoundPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.connect(ctx.destination);

        audioCtxRef.current = ctx;
        gainNodeRef.current = gainNode;
      }
    } else if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const startAmbientSynth = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    const master = gainNodeRef.current;
    if (!ctx || !master) return;

    // Create warm ambient Parisian chord (F major 7 / C major 9 mellow drone)
    const freqs = [174.61, 220.0, 261.63, 329.63, 392.0]; // F3, A3, C4, E4, G4
    const newNodes: AudioNode[] = [];

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(f, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450 + idx * 50, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.1 + idx * 0.05, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.04, ctx.currentTime);

      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (panner) {
        panner.pan.setValueAtTime((idx / (freqs.length - 1)) * 1.6 - 0.8, ctx.currentTime);
      }

      osc.connect(filter);
      if (panner) {
        filter.connect(panner);
        panner.connect(master);
      } else {
        filter.connect(master);
      }

      lfo.connect(lfoGain);
      lfoGain.connect(master.gain);

      osc.start();
      lfo.start();
      newNodes.push(osc, filter, lfo, lfoGain);
    });

    nodesRef.current = newNodes;
  };

  const stopAmbientSynth = () => {
    nodesRef.current.forEach((n) => {
      try {
        (n as any).stop?.();
        n.disconnect();
      } catch (e) {}
    });
    nodesRef.current = [];
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAmbientSynth();
      setIsPlaying(false);
    } else {
      startAmbientSynth();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSynth();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-xl transition-all duration-300 ${
        isPlaying
          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          : "bg-white/[0.05] text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
      }`}
      title={isPlaying ? "Mute Ambient Parisian Atmosphere" : "Play Ambient Parisian Soundscape"}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="font-mono text-[11px]">PARIS AMBIENCE: ON</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono text-[11px]">AMBIENT AUDIO</span>
        </>
      )}
    </button>
  );
};
