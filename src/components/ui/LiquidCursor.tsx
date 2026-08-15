"use client";

import React, { useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
}

export const LiquidCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({
    x: -100,
    y: -100,
    targetX: -100,
    targetY: -100,
    isHovering: false,
    speed: 0,
  });
  const ringRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef<TrailPoint[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest(
        "button, a, input, select, textarea, [role='button'], .interactive-hover"
      ) as HTMLElement | null;

      let targetX = e.clientX;
      let targetY = e.clientY;

      if (interactiveEl) {
        mouseRef.current.isHovering = true;
        // Magnetic pull toward interactive element center
        const rect = interactiveEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < 80) {
          const pull = 0.35;
          targetX = targetX * (1 - pull) + centerX * pull;
          targetY = targetY * (1 - pull) + centerY * pull;
        }
      } else {
        mouseRef.current.isHovering = false;
      }

      const dx = targetX - mouseRef.current.x;
      const dy = targetY - mouseRef.current.y;
      mouseRef.current.speed = Math.hypot(dx, dy);

      mouseRef.current.targetX = targetX;
      mouseRef.current.targetY = targetY;

      // Add trail point
      if (mouseRef.current.speed > 1 && trailRef.current.length < 24) {
        const colors = ["#00f2fe", "#6366f1", "#a855f7", "#38bdf8"];
        trailRef.current.push({
          x: targetX,
          y: targetY,
          size: Math.random() * 4 + 2,
          alpha: 0.75,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const m = mouseRef.current;
      const ring = ringRef.current;

      // Smooth lerp for outer liquid ring
      m.x += (m.targetX - m.x) * 0.4;
      m.y += (m.targetY - m.y) * 0.4;

      ring.x += (m.targetX - ring.x) * 0.18;
      ring.y += (m.targetY - ring.y) * 0.18;

      // Render Chromatic Glow Trails
      const trail = trailRef.current;
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.alpha -= 0.035;
        p.size *= 0.94;

        if (p.alpha <= 0 || p.size <= 0.5) {
          trail.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Render Outer Magnetic Liquid Ring
      if (ring.x > 0 && ring.y > 0) {
        ctx.save();
        const radius = m.isHovering ? 26 : 14;

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);

        if (m.isHovering) {
          ctx.strokeStyle = "rgba(0, 242, 254, 0.9)";
          ctx.lineWidth = 2;
          ctx.shadowColor = "#00f2fe";
          ctx.shadowBlur = 18;
          ctx.fillStyle = "rgba(0, 242, 254, 0.08)";
          ctx.fill();
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          ctx.lineWidth = 1.5;
          ctx.shadowColor = "rgba(99, 102, 241, 0.6)";
          ctx.shadowBlur = 10;
        }

        ctx.stroke();

        // Render Inner Dot
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.isHovering ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      style={{ mixBlendMode: "screen" }}
    />
  );
};
