"use client";

import React, { useEffect, useRef } from "react";

export const AmbientParticlesMesh: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes for interconnected network
    const numParticles = Math.min(Math.floor((width * height) / 18000), 70);
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      baseAlpha: number;
    }[] = [];

    const colors = ["#00f2fe", "#6366f1", "#a855f7", "#38bdf8", "#ec4899"];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseAlpha: Math.random() * 0.5 + 0.2,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render connected neural constellation lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce at boundaries
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Mouse gentle repulsion
        const dxMouse = p1.x - mouse.x;
        const dyMouse = p1.y - mouse.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);
        if (distMouse < 120) {
          p1.x += (dxMouse / distMouse) * 1.2;
          p1.y += (dyMouse / distMouse) * 1.2;
        }

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          const maxDist = 130;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw particle point with glow
        ctx.save();
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = p1.baseAlpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p1.color;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden opacity-35">
      {/* Ambient Aurora Glow Orbs */}
      <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-cyan-500/[0.08] rounded-full blur-[140px] animate-pulse-glow" />
      <div className="absolute top-2/3 right-1/4 w-[600px] h-[600px] bg-purple-600/[0.07] rounded-full blur-[160px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-10 left-1/3 w-[550px] h-[550px] bg-indigo-500/[0.06] rounded-full blur-[150px]" />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
