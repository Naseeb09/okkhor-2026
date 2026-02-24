"use client";

import { useRef, useEffect, useCallback } from "react";

interface HeroCanvasProps {
  text: string;
  chaos: number;
  complexity: number;
  colorMode: number;
  isGenerating: boolean;
}

interface WordDNA {
  seed: number;
  vortexStrength: number;
  crystalRigidity: number;
  flowFreq: number;
  lifespan: number;
  mode: "galaxy" | "crystal" | "liquid";
  hueBase: number;
  hueRange: number;
  assembleSpeed: number;
  dissolveDelay: number;
}

function buildDNA(text: string): WordDNA {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h) ^ text.charCodeAt(i);
    h = h >>> 0;
  }
  const n = (shift: number, range: number) => ((h >> shift) & 0xff) / 255 * range;
  const modes = ["galaxy", "crystal", "liquid"] as const;
  return {
    seed: h,
    vortexStrength: 0.3 + n(0, 0.7),
    crystalRigidity: 0.04 + n(8, 0.12),
    flowFreq: 0.0008 + n(16, 0.0022),
    lifespan: 0.84 + n(24, 0.12),
    mode: modes[(h ^ (h >> 16)) % 3],
    hueBase: n(0, 360),
    hueRange: 25 + n(4, 95),
    assembleSpeed: 0.12 + n(12, 0.18),
    dissolveDelay: 3500 + n(20, 4000),
  };
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  tx: number; ty: number;
  hue: number;
  size: number;
  phase: number;
}

function sampleGlyphPoints(text: string, physicalW: number, physicalH: number, count: number, dpr: number): { x: number; y: number }[] {
  const lw = Math.round(physicalW / dpr);
  const lh = Math.round(physicalH / dpr);
  const off = document.createElement("canvas");
  off.width = lw;
  off.height = lh;
  const ctx = off.getContext("2d")!;
  const fontSize = Math.min(lw * 0.55, lh * 0.72);
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${fontSize}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, lw / 2, lh / 2);
  const { data } = ctx.getImageData(0, 0, lw, lh);
  const lit: { x: number; y: number }[] = [];
  const stride = Math.max(1, Math.floor(Math.sqrt((lw * lh) / (count * 6))));
  for (let y = 0; y < lh; y += stride) {
    for (let x = 0; x < lw; x += stride) {
      if (data[(y * lw + x) * 4 + 3] > 128) lit.push({ x, y });
    }
  }
  if (lit.length === 0) return [];
  for (let i = lit.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [lit[i], lit[j]] = [lit[j], lit[i]];
  }
  return lit.slice(0, count);
}

function flowAngle(x: number, y: number, t: number, dna: WordDNA): number {
  const f = dna.flowFreq;
  return Math.sin(x * f + t * 0.7) * Math.cos(y * f * 0.8 + t * 0.5) * Math.PI * 2;
}

const PARTICLE_COUNT = 3200;
type Phase = "ASSEMBLING" | "ALIVE" | "DISSOLVING";

export function HeroCanvas({ text, chaos, complexity, colorMode }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const S = useRef<{
    particles: Particle[];
    dna: WordDNA;
    phase: Phase;
    phaseStart: number;
    dpr: number;
  }>({
    particles: [],
    dna: buildDNA("ওক্ষর"),
    phase: "ASSEMBLING",
    phaseStart: performance.now(),
    dpr: 1,
  });

  const initParticles = useCallback((physW: number, physH: number, dpr: number) => {
    const label = text || "ওক্ষর";
    const dna = buildDNA(label);
    const targets = sampleGlyphPoints(label, physW, physH, PARTICLE_COUNT, dpr);
    if (targets.length === 0) return;
    const lw = physW / dpr;
    const lh = physH / dpr;
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = targets[i % targets.length];
      let sx: number, sy: number;
      switch (Math.floor(Math.random() * 4)) {
        case 0: sx = Math.random() * lw; sy = -20; break;
        case 1: sx = lw + 20; sy = Math.random() * lh; break;
        case 2: sx = Math.random() * lw; sy = lh + 20; break;
        default: sx = -20; sy = Math.random() * lh;
      }
      particles.push({
        x: sx, y: sy,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        tx: t.x, ty: t.y,
        hue: dna.hueBase + (Math.random() - 0.5) * dna.hueRange,
        size: 0.6 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
      });
    }
    S.current = { particles, dna, dpr, phase: "ASSEMBLING", phaseStart: performance.now() };
  }, [text]);

  const startLoop = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")!;
    const tick = () => {
      const { particles, dna, dpr, phase } = S.current;
      if (particles.length === 0) { rafRef.current = requestAnimationFrame(tick); return; }
      const physW = canvas.width, physH = canvas.height;
      const lw = physW / dpr, lh = physH / dpr;
      const now = performance.now();
      const t = now * 0.001;
      const elapsed = now - S.current.phaseStart;

      if (phase === "ASSEMBLING") {
        let close = 0;
        for (const p of particles) {
          const dx = p.tx - p.x, dy = p.ty - p.y;
          if (dx * dx + dy * dy < 20) close++;
        }
        if (close > particles.length * 0.8 || elapsed > 3500) {
          S.current.phase = "ALIVE";
          S.current.phaseStart = now;
        }
      } else if (phase === "ALIVE" && elapsed > dna.dissolveDelay) {
        S.current.phase = "DISSOLVING";
        S.current.phaseStart = now;
      } else if (phase === "DISSOLVING" && elapsed > 4000) {
        initParticles(physW, physH, dpr);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(2, 8, 6, ${1 - dna.lifespan})`;
      ctx.fillRect(0, 0, physW, physH);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.scale(dpr, dpr);

      for (const p of particles) {
        const dx = p.tx - p.x, dy = p.ty - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;

        if (phase === "ASSEMBLING") {
          const f = dna.assembleSpeed * (1 + chaos / 70);
          p.vx += (dx / dist) * f;
          p.vy += (dy / dist) * f;
        } else if (phase === "ALIVE") {
          if (dna.mode === "galaxy") {
            const angle = Math.atan2(dy, dx) + Math.PI / 2;
            const str = dna.vortexStrength * 8 * (complexity / 50);
            p.vx += Math.cos(angle) * str * 0.05 + dx * 0.01;
            p.vy += Math.sin(angle) * str * 0.05 + dy * 0.01;
          } else if (dna.mode === "crystal") {
            p.vx += dx * dna.crystalRigidity;
            p.vy += dy * dna.crystalRigidity;
            p.vx += Math.sin(t * 10 + p.phase) * (complexity / 150);
            p.vy += Math.cos(t * 10 + p.phase) * (complexity / 150);
          } else {
            const angle = flowAngle(p.x, p.y, t, dna);
            p.vx += Math.cos(angle) * (chaos / 50);
            p.vy += Math.sin(angle) * (chaos / 50);
            p.vx += dx * 0.01; p.vy += dy * 0.01;
          }
        } else {
          if (elapsed < 600) {
            const angle = Math.atan2(p.y - lh/2, p.x - lw/2);
            p.vx += Math.cos(angle) * 0.5;
            p.vy += Math.sin(angle) * 0.5;
          }
          const angle = flowAngle(p.x * 0.6, p.y * 0.6, t, dna);
          p.vx += Math.cos(angle) * (dna.vortexStrength * 1.5);
          p.vy += Math.sin(angle) * (dna.vortexStrength * 1.5);
        }

        const f = phase === "DISSOLVING" ? 0.96 : 0.92;
        p.vx *= f; p.vy *= f;
        p.x += p.vx; p.y += p.vy;

        if (p.x < -50) p.x = lw + 50; else if (p.x > lw + 50) p.x = -50;
        if (p.y < -50) p.y = lh + 50; else if (p.y > lh + 50) p.y = -50;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        let alpha = Math.min(0.85, 0.15 + speed * 0.4);
        if (phase === "DISSOLVING") alpha *= (1 - (elapsed / 4000));

        const h = (colorMode + p.hue + speed * 15) % 360;
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${h}, 85%, 65%, ${alpha})`;
        ctx.lineWidth = p.size * (1 + speed * 0.3);
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
        ctx.stroke();

        if (speed > 2.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${h}, 100%, 90%, ${alpha * 0.4})`;
          ctx.fill();
        }
      }
      ctx.restore();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [chaos, complexity, colorMode, initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const setup = () => {
      const dpr = window.devicePixelRatio || 1;
      const p = canvas.parentElement!;
      canvas.width = Math.round(p.clientWidth * dpr);
      canvas.height = Math.round(p.clientHeight * dpr);
      canvas.style.width = p.clientWidth + "px";
      canvas.style.height = p.clientHeight + "px";
      initParticles(canvas.width, canvas.height, dpr);
    };
    setup();
    const ro = new ResizeObserver(setup);
    ro.observe(canvas.parentElement!);
    startLoop(canvas);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [initParticles, startLoop]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || c.width === 0) return;
    initParticles(c.width, c.height, S.current.dpr);
  }, [text, initParticles]);

  return <canvas ref={canvasRef} style={{ display: "block", background: "#020806" }} />;
}