"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Github, Twitter, Globe } from "lucide-react";

const TIMELINE_EVENTS = [
  { year: "১০০০", bengaliYear: "১০০০ খ্রিস্টাব্দ", title: "Classical Birth", description: "Ancient Bangla scripts emerge from Sanskrit roots, forming the backbone of the language." },
  { year: "১৩৫০", bengaliYear: "১৩৫০ খ্রিস্টাব্দ", title: "Medieval Flourish", description: "Bangla literature reaches its first golden age under regional rulers and poets." },
  { year: "১৯৫২", bengaliYear: "১৯৫২ খ্রিস্টাব্দ", title: "Language Movement", description: "The historic struggle where students sacrificed for the constitutional status of Bangla." },
];

const STATS = [
  { label: "Speakers Worldwide", value: "300M+", sub: "5th Most Spoken Language" },
  { label: "Historical Weight", value: "1952", sub: "The Language Revolution" },
  { label: "Global Presence", value: "30+", sub: "Countries with Bangla Speakers" },
];

const GLYPHS = [
  { char: "অ", name: "A-Kar", brahmi: "𑀅", evolution: "Brahmi → Medieval → Modern" },
  { char: "ক", name: "Ka", brahmi: "𑀓", evolution: "Brahmi → Eastern Nagari → Modern" },
  { char: "শ", name: "Sha", brahmi: "𑀰", evolution: "Brahmi → Proto-Bengali → Modern" },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState<number | null>(null);
  const [activeGlyph, setActiveGlyph] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-[#020a06] text-foreground selection:bg-accent/40 overflow-x-hidden">
      
      <nav className={`fixed left-0 right-0 z-[100] flex justify-center transition-all duration-700 px-6 ${scrolled ? "top-4" : "top-8"}`}>
        <div className="group flex items-center bg-[#0a1510]/40 backdrop-blur-xl border border-white/5 px-2 py-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:border-emerald-500/20 max-w-full overflow-x-auto no-scrollbar">
          {["History", "Glyphs", "Apps"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative px-4 md:px-6 py-2 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/30 hover:text-emerald-400 transition-all duration-500 font-bold group/item whitespace-nowrap"
            >
              <span className="relative z-10">{item}</span>
              <div className="absolute inset-0 bg-white/[0.03] rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover/item:opacity-100 group-hover/item:shadow-[0_0_8px_#10b981] transition-all duration-500" />
            </Link>
          ))}
        </div>
      </nav>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,204,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,255,204,0.06),transparent_60%)]" />
      </div>

      <div className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-bangla font-thin text-[clamp(80px,22vw,200px)] leading-none text-white drop-shadow-[0_0_40px_rgba(0,255,204,0.2)]">
              ওক্ষর
            </h1>
            <p className="font-mono text-xs md:text-sm tracking-[0.5em] text-accent mt-8 uppercase font-bold">The Living Script</p>
          </motion.div>
          <div className="max-w-2xl text-center mb-20">
            <p className="font-bangla text-2xl md:text-3xl text-white/90 mb-6 font-light px-4">শুরু থেকে স্বাধীনতা পর্যন্ত, বাংলা ভাষার যাত্রা একটি সাংস্কৃতিক বিপ্লব।</p>
            <p className="font-mono text-[10px] md:text-xs text-white/60 uppercase tracking-widest leading-relaxed px-6">
              From classical scripts to the heroic movement of 1952, witness the evolution of a language born from resistance.
            </p>
          </div>
          <Link href="#history">
            <motion.button whileHover={{ y: -5 }} className="px-10 py-4 border-2 border-white/10 rounded-full font-mono text-[10px] uppercase tracking-widest text-white hover:border-accent hover:text-accent transition-all duration-500 bg-white/5 backdrop-blur-md">
              Explore History ↓
            </motion.button>
          </Link>
        </section>

        <section id="history" className="py-24 md:py-48 px-6 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="mb-24 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-4">Heritage Timeline</p>
              <h2 className="font-bangla text-5xl md:text-6xl font-light text-white">ভাষার যাত্রা</h2>
            </div>
            
            <div className="relative space-y-24 md:space-y-32">
              <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
              {TIMELINE_EVENTS.map((event, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-start md:items-center gap-8 md:gap-12 ${idx % 2 === 0 ? "md:flex-row md:text-right" : "md:flex-row-reverse md:text-left"}`}
                  onMouseEnter={() => setActiveTimeline(idx)}
                  onMouseLeave={() => setActiveTimeline(null)}
                >
                  <div className="w-full md:w-1/2 pl-12 md:pl-0">
                    <span className="font-mono text-xs text-accent font-bold tracking-widest">{event.year}</span>
                    <h3 className="font-bangla text-3xl md:text-4xl text-white my-4">{event.bengaliYear}</h3>
                    <p className="font-mono text-xs md:text-sm text-white/70 leading-relaxed max-w-sm md:ml-auto md:mr-0" style={idx % 2 !== 0 ? { marginLeft: 0 } : {}}>{event.description}</p>
                  </div>
                  <div className="absolute left-[13px] md:relative md:left-0 z-20">
                    <div className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border-2 transition-all duration-500 ${activeTimeline === idx ? 'bg-accent border-accent scale-150 shadow-[0_0_20px_#00ffcc]' : 'bg-[#020a06] border-white/30'}`} />
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 px-4 border-y border-white/10 bg-white/[0.03]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center group p-10 border border-white/5 hover:border-accent/30 rounded-3xl transition-all duration-500 bg-white/[0.01]">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent font-bold">{stat.label}</p>
                <h4 className="font-bangla text-6xl md:text-8xl font-thin text-white my-6 tracking-tighter group-hover:text-accent transition-all duration-700">{stat.value}</h4>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="glyphs" className="py-24 md:py-40 px-6">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-20">
            <div className="w-full lg:w-1/3 space-y-8 text-center lg:text-left">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Discovery Module</p>
              <h2 className="font-bangla text-5xl md:text-6xl font-light text-white leading-tight">বর্ণের<br/>শারীরস্থান</h2>
              <p className="font-mono text-xs md:text-sm text-white/80 leading-loose max-w-sm mx-auto lg:mx-0">
                Hover or tap characters to witness the transition from 3rd-century Brahmi foundations to modern Bengali typography.
              </p>
            </div>
            
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {GLYPHS.map((glyph, i) => (
                <div 
                  key={i} 
                  onMouseEnter={() => setActiveGlyph(i)} 
                  onMouseLeave={() => setActiveGlyph(null)}
                  onClick={() => setActiveGlyph(activeGlyph === i ? null : i)}
                  className="relative aspect-square border-2 border-white/10 rounded-[2rem] bg-white/[0.04] flex items-center justify-center overflow-hidden group cursor-crosshair hover:border-accent/50 transition-all duration-500"
                >
                  <AnimatePresence mode="wait">
                    {activeGlyph === i ? (
                      <motion.div key="brahmi" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
                        <span className="text-7xl md:text-8xl font-serif text-accent drop-shadow-[0_0_25px_rgba(0,255,204,0.6)]">{glyph.brahmi}</span>
                        <p className="absolute bottom-8 left-0 right-0 font-mono text-[8px] md:text-xs uppercase tracking-[0.2em] text-accent font-bold">Brahmi Ancestor</p>
                      </motion.div>
                    ) : (
                      <motion.div key="modern" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                        <span className="font-bangla text-8xl md:text-9xl text-white/20 group-hover:text-white/90 transition-all duration-700">{glyph.char}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="apps" className="py-24 md:py-40 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center mb-20 md:mb-24">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-6">System Applications</p>
            <h2 className="font-bangla text-5xl md:text-6xl text-white mb-8">অভিজ্ঞতা শুরু করুন</h2>
            <p className="font-mono text-xs md:text-sm text-white/50 uppercase tracking-[0.2em] leading-relaxed max-w-2xl mx-auto px-4">
              Engage with the language through advanced digital modules. From generative art to physics-based structural play.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {[
              { title: "বাংলা বর্ণ", desc: "Transform your words into generative art. Witness letters evolve into living, breathing patterns.", tag: "Digital Calligraphy", link: "/create" },
              { title: "বর্ণ স্ট্যাক", desc: "A physics-based stacking game with glass and stone letters. Stack, balance, and build monuments.", tag: "Physics Simulation", link: "/game" }
            ].map((app, i) => (
              <div key={i} className="group relative min-h-[500px] md:h-[580px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-8 md:p-12 flex flex-col justify-between hover:border-accent/60 transition-all duration-700 shadow-2xl">
                 <div>
                    <p className="font-mono text-xs md:text-sm text-accent uppercase tracking-[0.3em] font-bold mb-6 md:mb-8">{app.tag}</p>
                    <h3 className="font-bangla text-4xl md:text-5xl text-white mb-6">{app.title}</h3>
                    <p className="font-mono text-xs md:text-sm text-white/70 leading-relaxed max-w-xs">{app.desc}</p>
                 </div>
                 <Link href={app.link}>
                   <button className="w-full py-5 md:py-6 rounded-2xl border-2 border-white/20 font-mono text-xs uppercase tracking-[0.3em] text-white hover:bg-accent hover:text-black hover:border-accent transition-all duration-500 font-black shadow-lg">
                     Launch Engine →
                   </button>
                 </Link>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-24 md:pt-40 pb-16 md:pb-20 border-t border-white/5 bg-[#010804]">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-end">
            <div className="space-y-8 text-center md:text-left">
              <h2 className="font-bangla text-5xl text-white tracking-tighter">ওক্ষর</h2>
            </div>
            
            <div className="flex flex-col gap-6 items-center md:items-end">
              <div className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-4 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">
                <Link href="#history" className="hover:text-accent transition-colors">Journey</Link>
                <Link href="#glyphs" className="hover:text-accent transition-colors">Anatomy</Link>
                <Link href="#apps" className="hover:text-accent transition-colors">Systems</Link>
              </div>
              <div className="h-px w-full bg-white/5" />
              <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-white/20">
                Crafted by <Link href="https://khan-jariff.vercel.app/" target="_blank" className="text-white hover:text-accent transition-colors">Khan Jariff Al Naseeb</Link>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}