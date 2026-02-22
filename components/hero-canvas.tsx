"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";

interface HeroCanvasProps {
  text: string;
  chaos: number;
  complexity: number;
  colorMode: number;
  isGenerating: boolean;
}

// Perlin noise implementation for flow fields
class PerlinNoise {
  private perm: number[];

  constructor(seed: number = 0) {
    this.perm = [];
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor((seed + i) % (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    this.perm = [...p, ...p];
  }

  fade(t: number): number { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(a: number, b: number, t: number): number { return a + t * (b - a); }
  grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = this.fade(xf);
    const v = this.fade(yf);
    const a = this.perm[this.perm[X] + Y];
    const b = this.perm[this.perm[X + 1] + Y];
    const c = this.perm[this.perm[X] + Y + 1];
    const d = this.perm[this.perm[X + 1] + Y + 1];

    return this.lerp(
      this.lerp(this.grad(a, xf, yf), this.grad(b, xf - 1, yf), u),
      this.lerp(this.grad(c, xf, yf - 1), this.grad(d, xf - 1, yf - 1), u),
      v
    );
  }
}

const PARTICLE_COUNT = 2500; // Boosted slightly for better visuals
const TRAIL_LENGTH = 0.12;
const BASE_SPEED = 1.2;
const MOUSE_INFLUENCE_RADIUS = 150;
const MOUSE_REPULSE_STRENGTH = 0.15;

const CRIMSON = { r: 139, g: 0, b: 0 };
const EMERALD = { r: 0, g: 106, b: 78 };

interface Particle {
  x: number; y: number; vx: number; vy: number;
  trail: { x: number; y: number; alpha: number; velocity: number }[];
  targetX: number; targetY: number; charIndex: number; baseHue: number;
}

export function HeroCanvas({ text, chaos, complexity, colorMode, isGenerating }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const noiseRef = useRef<PerlinNoise | null>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 1. Initialize Noise
  useEffect(() => {
    if (text) {
      const seed = text.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      noiseRef.current = new PerlinNoise(seed);
    }
  }, [text]);

  // 2. Safely extract points and initialize particles (Fixed Race Condition)
  useEffect(() => {
    if (!text || !canvasRef.current || !hiddenCanvasRef.current) return;
    let isMounted = true;

    const initEngine = async () => {
      // CRITICAL FIX: Wait for fonts to load before extracting pixels
      await document.fonts.ready;
      if (!isMounted) return;

      const hCanvas = hiddenCanvasRef.current!;
      const hCtx = hCanvas.getContext("2d", { willReadFrequently: true });
      if (!hCtx) return;

      const size = 400;
      hCanvas.width = size;
      hCanvas.height = size;
      hCtx.clearRect(0, 0, size, size);

      hCtx.fillStyle = "#ffffff";
      hCtx.font = `bold ${size * 0.3}px "Hind Siliguri", sans-serif`;
      hCtx.textAlign = "center";
      hCtx.textBaseline = "middle";
      hCtx.fillText(text.slice(0, 6), size / 2, size / 2);

      const imageData = hCtx.getImageData(0, 0, size, size);
      const points: { x: number; y: number }[] = [];
      const step = 3;

      for (let y = 0; y < size; y += step) {
        for (let x = 0; x < size; x += step) {
          const idx = (y * size + x) * 4;
          if (imageData.data[idx + 3] > 128) points.push({ x, y });
        }
      }

      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || canvas.width;
      const h = rect.height || canvas.height;

      const chars = text.split("");
      const newParticles: Particle[] = [];

      if (points.length > 0) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const pointIdx = Math.floor((i / PARTICLE_COUNT) * points.length);
          const point = points[pointIdx];

          const scaleX = w / 400;
          const scaleY = h / 400;
          const offsetX = (w - 400 * scaleX) / 2;
          const offsetY = (h - 400 * scaleY) / 2;

          const charIdx = i % chars.length;
          newParticles.push({
            x: point.x * scaleX + offsetX + (Math.random() - 0.5) * 50,
            y: point.y * scaleY + offsetY + (Math.random() - 0.5) * 50,
            vx: 0, vy: 0, trail: [],
            targetX: point.x * scaleX + offsetX,
            targetY: point.y * scaleY + offsetY,
            charIndex: charIdx,
            baseHue: (chars[charIdx].charCodeAt(0) * 137.5) % 360,
          });
        }
      }
      particlesRef.current = newParticles;
    };

    initEngine();
    return () => { isMounted = false; };
  }, [text]);

  // 3. Flow Field Animation Loop
  const runFlowField = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    if (!noiseRef.current || particlesRef.current.length === 0) return;

    ctx.fillStyle = "rgba(2, 13, 8, 0.15)"; // Deep green-black fade
    ctx.fillRect(0, 0, w, h);

    const time = Date.now() * 0.0005;
    const flowSpeed = BASE_SPEED * (1 + chaos / 100);
    const mouse = mousePosRef.current;

    for (const p of particlesRef.current) {
      const nx = p.x * 0.01 + time;
      const ny = p.y * 0.01 + time;
      const angle = noiseRef.current.noise2D(nx, ny) * Math.PI * 2;
      const magnitude = (noiseRef.current.noise2D(nx * 2, ny * 2) * 0.5 + 0.5) * flowSpeed;

      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      const distToTarget = Math.sqrt(dx * dx + dy * dy);
      const attraction = Math.min(distToTarget * 0.02, 0.8);

      let mRx = 0, mRy = 0;
      if (mouse && isHovered) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const dist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (dist < MOUSE_INFLUENCE_RADIUS) {
          const force = (1 - dist / MOUSE_INFLUENCE_RADIUS) * MOUSE_REPULSE_STRENGTH;
          mRx = (mdx / dist) * force;
          mRy = (mdy / dist) * force;
        }
      }

      p.vx += Math.cos(angle) * magnitude + (dx / distToTarget) * attraction + mRx;
      p.vy += Math.sin(angle) * magnitude + (dy / distToTarget) * attraction + mRy;
      p.vx *= 0.90; p.vy *= 0.90; // Friction
      p.x += p.vx; p.y += p.vy;

      const velocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      const vRatio = Math.min(velocity / 5, 1);

      p.trail.push({ x: p.x, y: p.y, alpha: 1, velocity });
      if (p.trail.length > 25) p.trail.shift();
      for (let t = 0; t < p.trail.length; t++) p.trail[t].alpha *= 1 - TRAIL_LENGTH;

      if (p.trail.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let t = 1; t < p.trail.length; t++) ctx.lineTo(p.trail[t].x, p.trail[t].y);

        const r = Math.floor(CRIMSON.r + (EMERALD.r - CRIMSON.r) * vRatio);
        const g = Math.floor(CRIMSON.g + (EMERALD.g - CRIMSON.g) * vRatio);
        const b = Math.floor(CRIMSON.b + (EMERALD.b - CRIMSON.b) * vRatio);

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.trail[0].alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }, [chaos, isHovered]);

  // 4. Mount & Resize Handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    let animationId: number;
    const loop = () => {
      const r = canvas.parentElement?.getBoundingClientRect();
      if (r) runFlowField(ctx, r.width, r.height);
      animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [runFlowField]);

  // 5. Mouse Interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseenter", () => setIsHovered(true));
    canvas.addEventListener("mouseleave", () => { setIsHovered(false); mousePosRef.current = null; });
    return () => {
      canvas.removeEventListener("mousemove", handleMove);
    };
  }, []);

  const downloadArt = () => {
    const link = document.createElement('a');
    link.href = canvasRef.current?.toDataURL('image/png') || '';
    link.download = `bangla-borno-${Date.now()}.png`;
    link.click();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative h-full w-full">
      {/* CRITICAL FIX: Only ONE visible canvas allowed */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-pointer z-10" onDoubleClick={downloadArt} />
      <canvas ref={hiddenCanvasRef} className="hidden" style={{ display: "none" }} />
    </motion.div>
  );
}