"use client";

import React, { useRef, useEffect } from "react";

export const SplineGlassHero: React.FC<{ mousePos: { x: number; y: number } }> = ({
  mousePos,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 450);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // 3D Polyhedron vertices (Icosahedron / Truncated Octahedron Glass Artifact)
    const t = (1 + Math.sqrt(5)) / 2;
    const baseVertices = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ];

    // Normalize and scale
    const radius = Math.min(width, height) * 0.28;
    const vertices = baseVertices.map(([x, y, z]) => {
      const len = Math.hypot(x, y, z);
      return [(x / len) * radius, (y / len) * radius, (z / len) * radius];
    });

    const edges = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [1, 9], [1, 8], [1, 7],
      [2, 11], [2, 4], [2, 3], [2, 6], [2, 10],
      [3, 9], [3, 4], [3, 8], [3, 6],
      [4, 5], [4, 9], [4, 11],
      [5, 9], [5, 11],
      [6, 7], [6, 8], [6, 10],
      [7, 8], [7, 10],
      [8, 9],
      [10, 11]
    ];

    // Ambient floating orbital rings
    const orbitalParticles: { angle: number; speed: number; radius: number; z: number; color: string }[] = [];
    for (let i = 0; i < 40; i++) {
      orbitalParticles.push({
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        radius: radius * (1.1 + Math.random() * 0.6),
        z: (Math.random() - 0.5) * radius,
        color: Math.random() > 0.5 ? "#00f2fe" : "#818cf8",
      });
    }

    let animationFrame: number;
    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Mouse-driven rotation target with smooth inertia
      rotationRef.current.targetX = (mousePos.y / height - 0.5) * 1.2;
      rotationRef.current.targetY = (mousePos.x / width - 0.5) * 1.5;

      rotationRef.current.x += (rotationRef.current.targetX - rotationRef.current.x) * 0.05;
      rotationRef.current.y += (rotationRef.current.targetY - rotationRef.current.y) * 0.05;

      const rotX = rotationRef.current.x + time * 0.3;
      const rotY = rotationRef.current.y + time * 0.5;

      // Draw background ambient glow
      const radialGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        radius * 1.8
      );
      radialGrad.addColorStop(0, "rgba(99, 102, 241, 0.2)");
      radialGrad.addColorStop(0.4, "rgba(6, 182, 212, 0.12)");
      radialGrad.addColorStop(0.8, "rgba(168, 85, 247, 0.05)");
      radialGrad.addColorStop(1, "transparent");

      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Project 3D vertices to 2D
      const projected = vertices.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
        let y1 = y;
        let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);

        // Rotate X
        let x2 = x1;
        let y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);

        // Perspective projection
        const fov = 400;
        const scale = fov / (fov + z2);
        return {
          x: centerX + x2 * scale,
          y: centerY + y2 * scale,
          z: z2,
          scale,
        };
      });

      // Draw Orbital rings & floating quantum nodes
      orbitalParticles.forEach((p) => {
        p.angle += p.speed;
        const px = Math.cos(p.angle) * p.radius;
        const pz = Math.sin(p.angle) * p.radius;
        const py = p.z + Math.sin(time + p.angle) * 15;

        // Apply rotation
        let x1 = px * Math.cos(rotY) + pz * Math.sin(rotY);
        let z1 = -px * Math.sin(rotY) + pz * Math.cos(rotY);
        let y2 = py * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = py * Math.sin(rotX) + z1 * Math.cos(rotX);

        const fov = 400;
        const scale = fov / (fov + z2);
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;

        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(1, 2.5 * scale), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = Math.min(1, Math.max(0.2, (z2 + radius) / (2 * radius)));
        ctx.fill();
      });

      // Draw 3D Glass Facet wireframe & luminous nodes
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#38bdf8";

      edges.forEach(([i1, i2]) => {
        const p1 = projected[i1];
        const p2 = projected[i2];
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.min(0.9, Math.max(0.15, (avgZ + radius) / (2 * radius) + 0.2));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 1.5 * ((p1.scale + p2.scale) / 2);
        ctx.stroke();
      });

      // Draw Glass Vertex Nodes with chromatic highlights
      projected.forEach((p, idx) => {
        const alpha = Math.min(1, Math.max(0.3, (p.z + radius) / (2 * radius)));
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = idx % 2 === 0 ? "#00f2fe" : "#c084fc";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 12;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [mousePos]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Refractive Ambient Blur Backdrops */}
      <div className="absolute w-72 h-72 rounded-full bg-cyan-500/15 blur-[90px] animate-pulse-glow" />
      <div className="absolute w-64 h-64 rounded-full bg-indigo-600/15 blur-[100px] -translate-x-12 translate-y-12" />
      <div className="absolute w-56 h-56 rounded-full bg-purple-600/15 blur-[90px] translate-x-14 -translate-y-8" />

      {/* 3D Glass Artifact Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full max-w-[480px] max-h-[480px] cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
