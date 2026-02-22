"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";

interface GalleryItem {
  id: string;
  text: string;
  chaos: number;
  complexity: number;
  colorMode: number;
  timestamp: number;
}

interface GalleryProps {
  items: GalleryItem[];
}

function hashChar(char: string, seed: number): number {
  const code = char.charCodeAt(0);
  return ((code * 2654435761 + seed) >>> 0) / 4294967296;
}

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const isDark = document.documentElement.classList.contains("dark");

    ctx.clearRect(0, 0, w, h);

    const chars = item.text.split("");
    const totalShapes = Math.floor(
      chars.length * (item.complexity / 20 + 1) * 6
    );
    const cx = w / 2;
    const cy = h / 2;
    const maxRadius = Math.min(w, h) * 0.4;

    for (let i = 0; i < totalShapes; i++) {
      const charIndex = i % chars.length;
      const char = chars[charIndex];
      const h1 = hashChar(char, i * 7 + 1);
      const h2 = hashChar(char, i * 13 + 2);
      const h3 = hashChar(char, i * 19 + 3);
      const h4 = hashChar(char, i * 31 + 4);
      const h5 = hashChar(char, i * 37 + 5);

      const chaosSpread = item.chaos / 100;
      const angle = (i / totalShapes) * Math.PI * 2 * (3 + h1 * 5);
      const dist =
        h2 * maxRadius * (0.3 + chaosSpread * 0.7) +
        Math.sin(angle * 3) * maxRadius * 0.1 * chaosSpread;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      const hue = item.colorMode * 3.6 + h3 * 60 * chaosSpread;
      const sat = 60 + h4 * 30;
      const light = isDark ? 55 + h5 * 25 : 35 + h5 * 25;
      const alpha = 0.15 + h1 * 0.55;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(h2 * Math.PI * 2 * chaosSpread);

      const size = 3 + h3 * 20 * (item.complexity / 70 + 0.3);
      const shapeType = Math.floor(h4 * 5);

      if (item.colorMode < 20) {
        ctx.strokeStyle = isDark
          ? `hsla(187, 100%, ${light}%, ${alpha})`
          : `hsla(0, 0%, ${light - 20}%, ${alpha})`;
        ctx.fillStyle = "transparent";
        ctx.lineWidth = 0.5 + h5;
      } else {
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 0.7})`;
        ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;
        ctx.lineWidth = 0.5;
      }

      ctx.beginPath();
      switch (shapeType) {
        case 0:
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          break;
        case 1: {
          const sides = 3 + Math.floor(h5 * 5);
          for (let s = 0; s <= sides; s++) {
            const a = (s / sides) * Math.PI * 2;
            const px = Math.cos(a) * size;
            const py = Math.sin(a) * size;
            s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          break;
        }
        case 2:
          ctx.rect(-size / 2, -size / 2, size, size);
          break;
        case 3:
          ctx.moveTo(0, -size);
          ctx.lineTo(size * 0.8, size * 0.6);
          ctx.lineTo(-size * 0.8, size * 0.6);
          ctx.closePath();
          break;
        case 4:
          ctx.ellipse(0, 0, size, size * 0.5, 0, 0, Math.PI * 2);
          break;
      }

      if (item.colorMode < 20) {
        ctx.stroke();
      } else {
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }
  }, [item]);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  // Determine card span class based on index pattern for masonry effect
  const spanClass = (() => {
    const pattern = index % 6;
    if (pattern === 0) return "md:col-span-2 md:row-span-2";
    if (pattern === 3) return "md:col-span-2";
    return "";
  })();

  const heightClass = (() => {
    const pattern = index % 6;
    if (pattern === 0) return "h-64 md:h-full";
    if (pattern === 3) return "h-48 md:h-64";
    return "h-48 md:h-64";
  })();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 ${spanClass} ${heightClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas ref={canvasRef} className="h-full w-full" />

      {/* Hover overlay */}
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/90 via-background/30 to-transparent p-4"
      >
        <p className="font-bangla text-lg font-medium text-foreground">
          {item.text}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {"Chaos " + item.chaos + "%"}
          </span>
          <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {"Complexity " + item.complexity + "%"}
          </span>
        </div>
      </motion.div>

      {/* Corner accent on hover */}
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-accent"
      />
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-accent"
      />
    </motion.div>
  );
}

export function Gallery({ items }: GalleryProps) {
  if (items.length === 0) return null;

  return (
    <section id="gallery" className="relative px-4 pb-32 pt-12 md:px-10">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 flex items-end justify-between"
      >
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Output Gallery
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl text-balance">
            Previous Generations
          </h2>
        </div>
        <span className="hidden font-mono text-xs tabular-nums text-muted-foreground md:block">
          {items.length + (items.length === 1 ? " piece" : " pieces")}
        </span>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {items.map((item, index) => (
          <GalleryCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
