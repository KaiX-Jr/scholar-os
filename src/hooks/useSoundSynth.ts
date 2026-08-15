import { useEffect, useRef, useState, useCallback } from "react";
import { PomodoroSession } from "@/types/scholar";

export function useSoundSynth(
  preset: PomodoroSession["soundPreset"],
  volume: number,
  isPlaying: boolean
) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        const ctx = new AudioCtxClass();
        const gainNode = ctx.createGain();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;

        gainNode.connect(analyser);
        analyser.connect(ctx.destination);

        audioCtxRef.current = ctx;
        gainNodeRef.current = gainNode;
        analyserRef.current = analyser;
        setIsAudioReady(true);
      }
    } else if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, []);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        isPlaying ? Math.max(0.001, volume * 0.3) : 0,
        audioCtxRef.current.currentTime,
        0.1
      );
    }
  }, [volume, isPlaying]);

  // Handle presets and active synthesis
  useEffect(() => {
    if (!isPlaying || preset === "none") {
      // Stop and disconnect existing nodes
      nodesRef.current.forEach((n) => {
        try {
          (n as any).stop?.();
          n.disconnect();
        } catch (e) {}
      });
      nodesRef.current = [];
      return;
    }

    initAudio();
    const ctx = audioCtxRef.current;
    const masterGain = gainNodeRef.current;
    if (!ctx || !masterGain) return;

    // Clear previous nodes
    nodesRef.current.forEach((n) => {
      try {
        (n as any).stop?.();
        n.disconnect();
      } catch (e) {}
    });
    nodesRef.current = [];

    const newNodes: AudioNode[] = [];

    if (preset === "binaural_alpha") {
      // 432Hz Left, 442Hz Right (10Hz Alpha difference)
      const merger = ctx.createChannelMerger(2);

      const oscL = ctx.createOscillator();
      oscL.type = "sine";
      oscL.frequency.value = 432;

      const oscR = ctx.createOscillator();
      oscR.type = "sine";
      oscR.frequency.value = 442;

      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(masterGain);

      oscL.start();
      oscR.start();
      newNodes.push(oscL, oscR, merger);
    } else if (preset === "deep_theta") {
      // 216Hz Left, 222Hz Right (6Hz Theta difference)
      const merger = ctx.createChannelMerger(2);

      const oscL = ctx.createOscillator();
      oscL.type = "sine";
      oscL.frequency.value = 216;

      const oscR = ctx.createOscillator();
      oscR.type = "sine";
      oscR.frequency.value = 222;

      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(masterGain);

      oscL.start();
      oscR.start();
      newNodes.push(oscL, oscR, merger);
    } else if (preset === "rain_focus") {
      // Generate Pink Noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 750;

      noiseSource.connect(filter);
      filter.connect(masterGain);

      noiseSource.start();
      newNodes.push(noiseSource, filter);
    } else if (preset === "stellar_ambient") {
      // Ambient chord with slow LFO
      const osc1 = ctx.createOscillator();
      osc1.type = "triangle";
      osc1.frequency.value = 130.81; // C3

      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = 196.0; // G3

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 400;

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();
      newNodes.push(osc1, osc2, filter);
    }

    nodesRef.current = newNodes;

    return () => {
      newNodes.forEach((n) => {
        try {
          (n as any).stop?.();
          n.disconnect();
        } catch (e) {}
      });
    };
  }, [preset, isPlaying, initAudio]);

  return {
    analyser: analyserRef.current,
    initAudio,
    isAudioReady,
  };
}
