"use client";

import React, { useRef, useEffect } from "react";

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  colorPreset?: "cyan" | "violet" | "emerald";
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  analyser,
  isPlaying,
  colorPreset = "cyan",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 280);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 64);

    const bufferLength = analyser ? analyser.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    let animationId: number;
    let phase = 0;

    const isMobile = window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches;

    const render = () => {
      if (document.hidden) {
        if (isPlaying) {
          animationId = requestAnimationFrame(render);
        }
        return;
      }

      ctx.clearRect(0, 0, width, height);

      phase += 0.04;

      if (isPlaying && analyser) {
        analyser.getByteFrequencyData(dataArray);
      }

      const numBars = isMobile ? 18 : 28;
      const barWidth = width / numBars - 2.5;
      const step = Math.floor(bufferLength / numBars) || 1;

      // Draw subtle background grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let y = 10; y < height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      for (let i = 0; i < numBars; i++) {
        const rawValue = isPlaying && analyser ? dataArray[i * step] || 0 : 0;

        let barHeight = isPlaying
          ? (rawValue / 255) * (height - 12) + 4
          : (Math.sin(phase + i * 0.28) * 0.5 + 0.5) * 8 + 4;

        if (barHeight < 3) barHeight = 3;

        const x = i * (barWidth + 2.5) + 1;
        const y = height - barHeight - 2;

        // Dynamic gradient
        const grad = ctx.createLinearGradient(0, y, 0, height);
        if (colorPreset === "cyan") {
          grad.addColorStop(0, "#00f2fe");
          grad.addColorStop(0.5, "#38bdf8");
          grad.addColorStop(1, "rgba(99, 102, 241, 0.3)");
        } else if (colorPreset === "violet") {
          grad.addColorStop(0, "#c084fc");
          grad.addColorStop(0.5, "#a855f7");
          grad.addColorStop(1, "rgba(168, 85, 247, 0.3)");
        } else {
          grad.addColorStop(0, "#34d399");
          grad.addColorStop(0.5, "#10b981");
          grad.addColorStop(1, "rgba(16, 185, 129, 0.3)");
        }

        ctx.save();
        ctx.fillStyle = grad;

        if (isPlaying && !isMobile) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = colorPreset === "violet" ? "#c084fc" : "#00f2fe";
        }

        // Draw rounded top bar
        ctx.beginPath();
        ctx.roundRect(x, y, Math.max(2, barWidth), barHeight, [3, 3, 1, 1]);
        ctx.fill();
        ctx.restore();

        // Draw glowing cap dot on top of bar when active
        if (isPlaying && barHeight > 10) {
          ctx.save();
          ctx.fillStyle = "#ffffff";
          if (!isMobile) {
            ctx.shadowBlur = 6;
            ctx.shadowColor = "#ffffff";
          }
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y - 2, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (isPlaying) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [analyser, isPlaying, colorPreset]);

  return (
    <div className="w-full h-14 relative flex items-center justify-center overflow-hidden rounded-xl bg-black/40 border border-white/[0.06] shadow-inner">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
