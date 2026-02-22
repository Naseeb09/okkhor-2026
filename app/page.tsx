"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const spring = { type: "spring", stiffness: 300, damping: 30 };

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState<number | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [btnDelta, setBtnDelta] = useState({ explore: { x: 0, y: 0 }, create: { x: 0, y: 0 }, game: { x: 0, y: 0 } });
  const [tlCursor, setTlCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const timelineEvents = [
    { year: "১০০০", bengaliYear: "১০০০ খ্রিস্টাব্দ", title: "Classical Birth", description: "Ancient Bangla scripts emerge from Sanskrit roots" },
    { year: "১৩৫০", bengaliYear: "১৩৫০ খ্রিস্টাব্দ", title: "Medieval Flourish", description: "Bangla literature reaches golden age under rulers" },
    { year: "১৯৫২", bengaliYear: "১৯৫২ খ্রিস্টাব্দ", title: "Language Movement", description: "Students sacrificed for Bangla's constitutional status" },
  ];

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Deep forest green with subtle grain */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          className="min-h-screen flex flex-col items-center justify-center px-4 pt-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Title */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="font-bangla font-thin text-[140px] md:text-[180px] lg:text-[220px] leading-none text-foreground tracking-tighter">
              ওক্ষর
            </h1>
            <p className="font-mono text-xs md:text-sm tracking-widest text-foreground/60 mt-8 uppercase letter-spacing-wide">
              The Living Script
            </p>
          </motion.div>

          {/* Heritage Summary */}
          <motion.div
            variants={itemVariants}
            className="max-w-3xl text-center mb-20 space-y-4"
          >
            <p className="font-bangla text-xl md:text-2xl text-foreground leading-relaxed">
              শুরু থেকে স্বাধীনতা পর্যন্ত, বাংলা ভাষার যাত্রা একটি সাংস্কৃতিক বিপ্লব।
            </p>
            <p className="font-mono text-xs md:text-sm text-foreground/60 tracking-wide leading-relaxed">
              From classical scripts of the year 1000 to the heroic language movement of 1952, explore how words became monuments and letters became symbols of resistance.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            onMouseMove={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
              const d = Math.hypot(mouse.x - cx, mouse.y - cy);
              if (d < 120) {
                const a = Math.atan2(mouse.y - cy, mouse.x - cx);
                const t = (120 - d) / 120 * 15;
                setBtnDelta(p => ({ ...p, explore: { x: Math.cos(a) * t, y: Math.sin(a) * t } }));
              } else {
                setBtnDelta(p => ({ ...p, explore: { x: 0, y: 0 } }));
              }
            }}
            onMouseLeave={() => setBtnDelta(p => ({ ...p, explore: { x: 0, y: 0 } }))}
          >
            <Link href="#timeline">
              <motion.button 
                animate={btnDelta.explore}
                transition={spring}
                className="group relative px-8 py-3 border border-foreground/30 backdrop-blur-md bg-foreground/[0.02] hover:bg-accent/10 hover:border-accent/60 rounded-lg overflow-hidden"
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLElement;
                  b.style.boxShadow = '0 0 30px rgba(0, 255, 204, 0.4), 0 0 60px rgba(0, 255, 204, 0.15)';
                  b.style.letterSpacing = '0.1em';
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLElement;
                  b.style.boxShadow = 'none';
                  b.style.letterSpacing = '0.05em';
                }}
              >
                <span className="font-mono text-sm uppercase tracking-wider text-foreground group-hover:text-accent transition-colors">
                  Explore
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.section>

        {/* Timeline Section - FIRST after Hero */}
        <motion.section
          id="timeline"
          className="py-40 px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <motion.div variants={itemVariants} className="mb-20 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-3">Heritage Timeline</p>
              <h2 className="font-bangla text-5xl md:text-6xl font-light text-foreground">
                ভাষার যাত্রা
              </h2>
            </motion.div>

            {/* Vertical Timeline */}
            <div className="relative space-y-12">
              {/* Central line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-foreground/20" />

              {timelineEvents.map((event, idx) => {
                const isHov = activeTimeline === idx;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className={`flex gap-8 ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                    onMouseMove={(e) => {
                      if (isHov) {
                        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        setTlCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
                      }
                    }}
                    onMouseEnter={() => setActiveTimeline(idx)}
                    onMouseLeave={() => {
                      setActiveTimeline(null);
                      setTlCursor({ x: 0, y: 0 });
                    }}
                  >
                    <motion.div 
                      className="w-1/2"
                      animate={{ y: isHov ? -4 : 0 }}
                      transition={spring}
                    >
                      <div className="text-right space-y-2" style={idx % 2 !== 0 ? { textAlign: "left" } : {}}>
                        <p className="font-mono text-xs uppercase tracking-widest text-foreground/60">{event.year}</p>
                        <h3 className="font-bangla text-2xl md:text-3xl font-medium text-foreground">
                          {event.bengaliYear}
                        </h3>
                        <p className="font-mono text-sm text-foreground/70">{event.title}</p>
                        <p className="font-mono text-xs text-foreground/50">{event.description}</p>
                      </div>
                    </motion.div>

                    <div className="w-0 flex justify-center relative">
                      {isHov && (
                        <svg className="absolute pointer-events-none" style={{ left: 0, top: 0, width: "100%", height: "100%", zIndex: 5 }}>
                          <line x1="0" y1="0" x2={tlCursor.x} y2={tlCursor.y} stroke="#00ffcc" strokeWidth="1" opacity="0.7" vectorEffect="non-scaling-stroke" />
                        </svg>
                      )}
                      {isHov && (
                        <motion.div className="absolute w-6 h-6 border border-accent rounded-full" animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeOut" }} />
                      )}
                      <motion.div animate={{ scale: isHov ? 1.3 : 1, boxShadow: isHov ? "0 0 25px rgba(0, 255, 204, 0.8), 0 0 50px rgba(0, 255, 204, 0.3)" : "0 0 15px rgba(0, 255, 204, 0.5)" }} transition={spring}>
                        <div className="absolute w-4 h-4 bg-accent rounded-full" />
                        <div className="w-2 h-2 bg-accent rounded-full" />
                      </motion.div>
                    </div>

                    {/* Empty space */}
                    <div className="w-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Features Section - Equal Height Cards */}
        <motion.section
          id="features"
          className="py-40 px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <motion.div variants={itemVariants} className="mb-20 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-3">Tools & Games</p>
              <h2 className="font-bangla text-5xl md:text-6xl font-light text-foreground">
                অভিজ্ঞতা শুরু করুন
              </h2>
            </motion.div>

            {/* Grid with equal height */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bangla Borno Card with Glass-morphism Glow */}
              <motion.div
                variants={itemVariants}
                className="group relative h-[500px] flex flex-col rounded-lg overflow-hidden"
                onMouseMove={(e) => {
                  setHovered("create");
                  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const bg = (e.currentTarget as HTMLElement).querySelector(".card-bg") as HTMLElement;
                  if (bg) {
                    bg.style.setProperty("--spotlight-x", `${e.clientX - r.left}px`);
                    bg.style.setProperty("--spotlight-y", `${e.clientY - r.top}px`);
                    bg.style.setProperty("--spotlight-opacity", "1");
                  }
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  const bg = (e as any).currentTarget?.querySelector(".card-bg") as HTMLElement;
                  if (bg) bg.style.setProperty("--spotlight-opacity", "0");
                }}
              >
                <style>{`
                  .card-bg {
                    --spotlight-x: 50%;
                    --spotlight-y: 50%;
                    --spotlight-opacity: 0;
                  }
                  .card-bg::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(600px at var(--spotlight-x) var(--spotlight-y), rgba(0, 255, 204, 0.2), transparent);
                    opacity: var(--spotlight-opacity);
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                  }
                `}</style>
                <div className="card-bg absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-background border border-foreground/20 group-hover:border-accent/40 backdrop-blur-xl" />
                <div className="relative z-10 h-full flex flex-col p-8 justify-between">
                  <motion.div 
                    className="space-y-4"
                    animate={{ y: hovered === "create" ? -2 : 0 }}
                    transition={spring}
                  >
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-foreground/60 mb-2">Digital Calligraphy</p>
                      <h3 className="font-bangla text-3xl md:text-4xl font-semibold text-foreground">
                        বাংলা বর্ণ
                      </h3>
                    </div>
                    <p className="font-mono text-sm text-foreground/70 leading-relaxed">
                      Transform your words into generative art. Witness Bangla letters evolve into living, breathing patterns.
                    </p>
                  </motion.div>
                  
                  {/* High-fidelity preview image */}
                  <div className="relative mb-6 h-40 overflow-hidden rounded-lg bg-gradient-to-br from-accent/10 to-background border border-foreground/10">
                    <Image
                      src="/bangla-borno-preview.jpg"
                      alt="Glowing neon Bengali letters in digital calligraphy"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <Link href="/create" className="w-full">
                    <motion.button 
                      className="w-full px-6 py-3 border border-foreground/30 backdrop-blur-sm bg-foreground/[0.02] hover:bg-accent/15 hover:border-accent/60 rounded-lg overflow-hidden"
                      onMouseEnter={(e) => {
                        const b = e.currentTarget as HTMLElement;
                        b.style.boxShadow = '0 0 28px rgba(0, 255, 204, 0.5), 0 0 55px rgba(0, 255, 204, 0.2)';
                        b.style.letterSpacing = '0.1em';
                      }}
                      onMouseLeave={(e) => {
                        const b = e.currentTarget as HTMLElement;
                        b.style.boxShadow = 'none';
                        b.style.letterSpacing = '0.05em';
                      }}
                      animate={btnDelta.create}
                      transition={spring}
                      onMouseMove={(e) => {
                        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
                        const d = Math.hypot(mouse.x - cx, mouse.y - cy);
                        if (d < 100) {
                          const a = Math.atan2(mouse.y - cy, mouse.x - cx);
                          const t = (100 - d) / 100 * 12;
                          setBtnDelta(p => ({ ...p, create: { x: Math.cos(a) * t, y: Math.sin(a) * t } }));
                        }
                      }}
                      onMouseLeave={() => setBtnDelta(p => ({ ...p, create: { x: 0, y: 0 } }))}
                    >
                      <span className="font-mono text-xs uppercase tracking-wider text-foreground group-hover:text-accent transition-colors">
                        আরও দেখুন →
                      </span>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Borno Stack Card with Glass-morphism Glow */}
              <motion.div
                variants={itemVariants}
                className="group relative h-[500px] flex flex-col rounded-lg overflow-hidden"
                onMouseMove={(e) => {
                  setHovered("game");
                  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const bg = (e.currentTarget as HTMLElement).querySelector(".card-bg") as HTMLElement;
                  if (bg) {
                    bg.style.setProperty("--spotlight-x", `${e.clientX - r.left}px`);
                    bg.style.setProperty("--spotlight-y", `${e.clientY - r.top}px`);
                    bg.style.setProperty("--spotlight-opacity", "1");
                  }
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  const bg = (e as any).currentTarget?.querySelector(".card-bg") as HTMLElement;
                  if (bg) bg.style.setProperty("--spotlight-opacity", "0");
                }}
              >
                <div className="card-bg absolute inset-0 bg-gradient-to-br from-foreground/5 via-background to-background border border-foreground/20 group-hover:border-accent/40 backdrop-blur-xl" />
                <div className="relative z-10 h-full flex flex-col p-8 justify-between">
                  <motion.div 
                    className="space-y-4"
                    animate={{ y: hovered === "game" ? -2 : 0 }}
                    transition={spring}
                  >
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-foreground/60 mb-2">Tower of Unity</p>
                      <h3 className="font-bangla text-3xl md:text-4xl font-semibold text-foreground">
                        বর্ণ স্ট্যাক
                      </h3>
                    </div>
                    <p className="font-mono text-sm text-foreground/70 leading-relaxed">
                      A physics-based stacking game with glass and stone Bengali letters. Stack, balance, and build monuments.
                    </p>
                  </motion.div>

                  {/* 3D Preview Image */}
                  <div className="relative mb-6 h-40 overflow-hidden rounded-lg bg-gradient-to-br from-accent/10 to-background border border-foreground/10">
                    <Image
                      src="/borno-stack-preview.jpg"
                      alt="Glass and stone Bengali letters stacking"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <Link href="/game" className="w-full">
                    <motion.button 
                      className="w-full px-6 py-3 border border-foreground/30 backdrop-blur-sm bg-foreground/[0.02] hover:bg-accent/15 hover:border-accent/60 rounded-lg overflow-hidden"
                      onMouseEnter={(e) => {
                        const b = e.currentTarget as HTMLElement;
                        b.style.boxShadow = '0 0 28px rgba(0, 255, 204, 0.5), 0 0 55px rgba(0, 255, 204, 0.2)';
                        b.style.letterSpacing = '0.1em';
                      }}
                      onMouseLeave={(e) => {
                        const b = e.currentTarget as HTMLElement;
                        b.style.boxShadow = 'none';
                        b.style.letterSpacing = '0.05em';
                      }}
                      animate={btnDelta.game}
                      transition={spring}
                      onMouseMove={(e) => {
                        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
                        const d = Math.hypot(mouse.x - cx, mouse.y - cy);
                        if (d < 100) {
                          const a = Math.atan2(mouse.y - cy, mouse.x - cx);
                          const t = (100 - d) / 100 * 12;
                          setBtnDelta(p => ({ ...p, game: { x: Math.cos(a) * t, y: Math.sin(a) * t } }));
                        }
                      }}
                      onMouseLeave={() => setBtnDelta(p => ({ ...p, game: { x: 0, y: 0 } }))}
                    >
                      <span className="font-mono text-xs uppercase tracking-wider text-foreground group-hover:text-accent transition-colors">
                        আরও দেখুন →
                      </span>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="py-16 px-4 border-t border-foreground/10"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <p className="font-mono text-xs text-foreground/40 uppercase tracking-widest">
              Celebrating Bangla Language Heritage
            </p>
          </div>
        </motion.footer>
        <footer className="py-12 text-center border-t border-border/20">
          <a 
            href="https://khan-jariff.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-foreground/40 hover:text-foreground/100 transition-colors duration-300"
          >
            made by Khan Jariff Al Naseeb
          </a>
        </footer>
      </div>
    </main>
  );
}
