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
    <main className="relative min-h-screen bg-[#020a06] text-foreground selection:bg-accent/40">
      
<nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 ${scrolled ? "py-4" : "py-10"}`}>
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <Link href="/" className="font-bangla text-3xl text-white hover:text-accent transition-colors">ও</Link>
    
   
    <div className="flex items-center gap-8 bg-[#0a1510]/60 backdrop-blur-[20px] border border-white/10 px-8 py-3 rounded-full shadow-2xl">
      {["History", "Glyphs", "Apps"].map((item) => (
        <Link 
          key={item} 
          href={`#${item.toLowerCase()}`} 
          className="font-mono text-[11px] uppercase tracking-[0.5em] text-white/40 hover:text-white transition-all duration-300 font-black"
        >
          {item}
        </Link>
      ))}
    </div>
    <div className="w-8 md:block hidden" />
  </div>
</nav>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,204,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,255,204,0.06),transparent_60%)]" />
      </div>

      <div className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-bangla font-thin text-[120px] md:text-[200px] leading-none text-white drop-shadow-[0_0_40px_rgba(0,255,204,0.2)]">
              ওক্ষর
            </h1>
            <p className="font-mono text-sm tracking-[0.5em] text-accent mt-8 uppercase font-bold">The Living Script</p>
          </motion.div>
          <div className="max-w-2xl text-center mb-20">
            <p className="font-bangla text-2xl md:text-3xl text-white/90 mb-6 font-light">শুরু থেকে স্বাধীনতা পর্যন্ত, বাংলা ভাষার যাত্রা একটি সাংস্কৃতিক বিপ্লব।</p>
            <p className="font-mono text-xs md:text-sm text-white/60 uppercase tracking-widest leading-relaxed">
              From classical scripts to the heroic movement of 1952, witness the evolution of a language born from resistance.
            </p>
          </div>
          <Link href="#history">
            <motion.button whileHover={{ y: -5 }} className="px-10 py-4 border-2 border-white/10 rounded-full font-mono text-xs uppercase tracking-widest text-white hover:border-accent hover:text-accent transition-all duration-500 bg-white/5 backdrop-blur-md">
              Explore History ↓
            </motion.button>
          </Link>
        </section>

        <section id="history" className="py-48 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="mb-24 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent font-bold mb-4">Heritage Timeline</p>
              <h2 className="font-bangla text-6xl font-light text-white">ভাষার যাত্রা</h2>
            </div>
            
            <div className="relative space-y-32">
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
              {TIMELINE_EVENTS.map((event, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-12 ${idx % 2 === 0 ? "flex-row text-right" : "flex-row-reverse text-left"}`}
                  onMouseEnter={() => setActiveTimeline(idx)}
                  onMouseLeave={() => setActiveTimeline(null)}
                >
                  <div className="w-1/2">
                    <span className="font-mono text-sm text-accent font-bold tracking-widest">{event.year}</span>
                    <h3 className="font-bangla text-4xl text-white my-4">{event.bengaliYear}</h3>
                    <p className="font-mono text-sm text-white/70 leading-relaxed max-w-sm ml-auto mr-0" style={idx % 2 !== 0 ? { marginLeft: 0 } : {}}>{event.description}</p>
                  </div>
                  <div className="relative z-20">
                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${activeTimeline === idx ? 'bg-accent border-accent scale-150 shadow-[0_0_20px_#00ffcc]' : 'bg-[#020a06] border-white/30'}`} />
                  </div>
                  <div className="w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 px-4 border-y border-white/10 bg-white/[0.03]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center group p-10 border border-white/5 hover:border-accent/30 rounded-3xl transition-all duration-500 bg-white/[0.01]">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent font-bold">{stat.label}</p>
                <h4 className="font-bangla text-7xl md:text-8xl font-thin text-white my-6 tracking-tighter group-hover:text-accent transition-all duration-700">{stat.value}</h4>
                <p className="font-mono text-sm uppercase tracking-widest text-white/60">{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="glyphs" className="py-40 px-4">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/3 space-y-8">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent font-bold">Discovery Module</p>
              <h2 className="font-bangla text-6xl font-light text-white leading-tight">বর্ণের<br/>শারীরস্থান</h2>
              <p className="font-mono text-sm text-white/80 leading-loose">
                Hover over the characters to witness the transition from 3rd-century Brahmi foundations to modern Bengali typography.
              </p>
            </div>
            
            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {GLYPHS.map((glyph, i) => (
                <div 
                  key={i} 
                  onMouseEnter={() => setActiveGlyph(i)} 
                  onMouseLeave={() => setActiveGlyph(null)}
                  className="relative aspect-square border-2 border-white/10 rounded-[2rem] bg-white/[0.04] flex items-center justify-center overflow-hidden group cursor-crosshair hover:border-accent/50 transition-all duration-500"
                >
                  <AnimatePresence mode="wait">
                    {activeGlyph === i ? (
                      <motion.div key="brahmi" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
                        <span className="text-8xl font-serif text-accent drop-shadow-[0_0_25px_rgba(0,255,204,0.6)]">{glyph.brahmi}</span>
                        <p className="absolute bottom-8 left-0 right-0 font-mono text-xs uppercase tracking-[0.2em] text-accent font-bold">Brahmi Ancestor</p>
                      </motion.div>
                    ) : (
                      <motion.div key="modern" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                        <span className="font-bangla text-9xl text-white/20 group-hover:text-white/90 transition-all duration-700">{glyph.char}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="apps" className="py-40 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent font-bold mb-6">System Applications</p>
            <h2 className="font-bangla text-6xl text-white mb-8">অভিজ্ঞতা শুরু করুন</h2>
            <p className="font-mono text-sm text-white/50 uppercase tracking-[0.2em] leading-relaxed">
              Engage with the language through advanced digital modules. From generative art to physics-based structural play.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group relative h-[580px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-12 flex flex-col justify-between hover:border-accent/60 transition-all duration-700 shadow-2xl">
               <div>
                  <p className="font-mono text-sm text-accent uppercase tracking-[0.3em] font-bold mb-8">Digital Calligraphy</p>
                  <h3 className="font-bangla text-5xl text-white mb-6">বাংলা বর্ণ</h3>
                  <p className="font-mono text-sm text-white/70 leading-relaxed max-w-xs">Transform your words into generative art. Witness letters evolve into living, breathing patterns.</p>
               </div>
               <Link href="/create">
                 <button className="w-full py-6 rounded-2xl border-2 border-white/20 font-mono text-sm uppercase tracking-[0.3em] text-white hover:bg-accent hover:text-black hover:border-accent transition-all duration-500 font-black shadow-lg">
                   Launch Game →
                 </button>
               </Link>
            </div>
            
            <div className="group relative h-[580px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-12 flex flex-col justify-between hover:border-accent/60 transition-all duration-700 shadow-2xl">
               <div>
                  <p className="font-mono text-sm text-accent uppercase tracking-[0.3em] font-bold mb-8">Physics Simulation</p>
                  <h3 className="font-bangla text-5xl text-white mb-6">বর্ণ স্ট্যাক</h3>
                  <p className="font-mono text-sm text-white/70 leading-relaxed max-w-xs">A physics-based stacking game with glass and stone letters. Stack, balance, and build monuments.</p>
               </div>
               <Link href="/game">
                 <button className="w-full py-6 rounded-2xl border-2 border-white/20 font-mono text-sm uppercase tracking-[0.3em] text-white hover:bg-accent hover:text-black hover:border-accent transition-all duration-500 font-black shadow-lg">
                   Launch Game →
                 </button>
               </Link>
            </div>
          </div>
        </section>

        <footer className="pt-40 pb-20 border-t border-white/5 bg-[#010804]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-24 items-end">
            <div className="space-y-10">
              <h2 className="font-bangla text-5xl text-white tracking-tighter">ওক্ষর</h2>
            </div>
            
            <div className="flex flex-col gap-6 items-start md:items-end">
              <div className="flex flex-wrap gap-x-12 gap-y-4 font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">
                <Link href="#history" className="hover:text-accent transition-colors">Journey</Link>
                <Link href="#glyphs" className="hover:text-accent transition-colors">Anatomy</Link>
                <Link href="#apps" className="hover:text-accent transition-colors">Systems</Link>
              </div>
              <div className="h-px w-full bg-white/5" />
<p className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/20">
  Crafted by <Link href="https://khan-jariff.vercel.app/" target="_blank" className="text-white hover:text-accent transition-colors">Khan Jariff Al Naseeb</Link>
</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}