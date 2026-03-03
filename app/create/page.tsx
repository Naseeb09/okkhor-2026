"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HeroCanvas } from "@/components/hero-canvas";
import { CommandBar } from "@/components/command-bar";
import { RulerFrame } from "@/components/ruler-frame";
import { SettingsPanel } from "@/components/settings-panel";
import { Gallery } from "@/components/gallery";
import { BanglaKeyboard } from "@/components/bangla-keyboard";
import { phoneticTransliterate } from "@/lib/phonetic-transliteration";

interface GalleryItem {
  id: string;
  text: string;
  chaos: number;
  complexity: number;
  colorMode: number;
  timestamp: number;
}

const SEED_GALLERY: GalleryItem[] = [
  { id: "seed-1", text: "স্বপ্ন", chaos: 42, complexity: 68, colorMode: 55, timestamp: Date.now() },
];

export default function CreatePage() {
  const [mounted, setMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const [chaos, setChaos] = useState(35);
  const [complexity, setComplexity] = useState(50);
  const [colorMode, setColorMode] = useState(50);
  
  const [inputText, setInputText] = useState("");
  const [currentText, setCurrentText] = useState("ওক্ষর");
  const [isGenerating, setIsGenerating] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(SEED_GALLERY);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdate = useCallback((val: string) => {
    setInputText(val);
    const translated = phoneticTransliterate(val);
    setCurrentText(translated || "ওক্ষর"); 
  }, []);

  const handleGenerate = useCallback((text: string) => {
    if (!text) return;
    
    setIsGenerating(true);
    const finalTranslation = phoneticTransliterate(text);
    setCurrentText(finalTranslation);

    setGalleryItems((prev) => [
      { 
        id: `gen-${Date.now()}`, 
        text: finalTranslation, 
        chaos, 
        complexity, 
        colorMode, 
        timestamp: Date.now() 
      },
      ...prev,
    ]);

    setTimeout(() => setIsGenerating(false), 1200);
  }, [chaos, complexity, colorMode]);

  if (!mounted) return null;

  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#010804] flex items-center justify-center">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] bg-emerald-500/[0.02] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-950/10 to-transparent" />
        <h1 className="select-none font-bangla text-[25vw] font-black text-white/[0.02] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        </h1>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 group-hover:text-emerald-500 transition-all">
            ← Back to Core
          </span>
        </Link>
        <div className="flex gap-10">
          <button 
            onClick={() => setGalleryOpen(true)} 
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all border-b border-transparent hover:border-white/20 pb-1"
          >
            ARCHIVE
          </button>
          <button 
            onClick={() => setAboutOpen(true)} 
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all border-b border-transparent hover:border-white/20 pb-1"
          >
            MANIFESTO
          </button>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-6xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-video w-full rounded-[2rem] border border-white/5 bg-[#020d08]/40 backdrop-blur-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
        >
          <RulerFrame />
          
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <HeroCanvas
              text={currentText}
              chaos={chaos}
              complexity={complexity}
              colorMode={colorMode}
              isGenerating={isGenerating}
            />
          </div>

          <div className="absolute bottom-8 left-12 right-12 flex justify-between items-end border-t border-white/5 pt-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`h-1.5 w-1.5 rounded-full ${isGenerating ? 'bg-cyan-400 shadow-[0_0_12px_cyan]' : 'bg-emerald-500 shadow-[0_0_10px_emerald]'}`} 
                />
                <span className="font-mono text-[9px] text-white/50 tracking-[0.3em] uppercase">
                  {isGenerating ? "Synthesizing Geometry..." : "Protocol Stable"}
                </span>
              </div>
            </div>
            
            <div className="flex gap-8 items-center">
              <div className="text-right">
                <p className="font-mono text-[7px] text-white/20 uppercase tracking-[0.2em] mb-1">Entropy Level</p>
                <p className="font-mono text-[10px] text-white/60 tracking-widest">{chaos}%</p>
              </div>
              <div className="h-8 w-px bg-white/5" />
              <div className="text-right">
                <p className="font-mono text-[7px] text-white/20 uppercase tracking-[0.2em] mb-1">Density Index</p>
                <p className="font-mono text-[10px] text-white/60 tracking-widest">{complexity}%</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-[100]">
        <CommandBar
          ref={inputRef}
          value={inputText}
          onChange={handleUpdate}
          onGenerate={handleGenerate}
          onSettingsOpen={() => setSettingsOpen(true)}
          isGenerating={isGenerating}
        />
      </div>

      <BanglaKeyboard 
        visible={keyboardVisible}
        onToggle={() => setKeyboardVisible(!keyboardVisible)}
        onKeyPress={(char) => handleUpdate(inputText + char)}
        onBackspace={() => handleUpdate(inputText.slice(0, -1))}
        onSpace={() => handleUpdate(inputText + " ")}
        inputRef={inputRef}
      />

      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -50 }}
            className="fixed inset-y-0 left-0 z-[120] w-full max-w-sm bg-[#010804]/98 backdrop-blur-3xl border-r border-white/5 p-12 shadow-2xl overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-16">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.5em] text-emerald-500 font-bold">History Log</h2>
              <button onClick={() => setGalleryOpen(false)} className="text-white/20 hover:text-white transition-colors p-2">✕</button>
            </div>
            <Gallery items={galleryItems} />
          </motion.div>
        )}

        {aboutOpen && (
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-[#010804]/98 backdrop-blur-2xl flex items-center justify-center p-8"
          >
            <div className="max-w-3xl w-full">
              <div className="flex justify-between items-center mb-20">
                <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-emerald-500 font-bold underline underline-offset-8 decoration-emerald-500/30">Manifesto</span>
                <button onClick={() => setAboutOpen(false)} className="text-white/20 hover:text-white font-mono text-[10px] tracking-[0.4em] transition-colors p-4">EXIT VIEW</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <h2 className="font-bangla text-8xl text-white font-thin leading-[0.85] tracking-tighter">ভাষার<br/>প্রাণশক্তি</h2>
                  <p className="font-mono text-[9px] text-white/20 tracking-[0.4em] uppercase">Bangla Borno</p>
                </div>
                
                <div className="space-y-10 font-mono text-[11px] leading-relaxed text-white/50 uppercase tracking-[0.2em] border-l border-white/5 pl-10">
                  <p>
                    Okkhor is a digital preservation of resistance. 
                    Born from the 1952 Language Movement, the Bengali script carries the weight 
                    of a thousand years of evolution.
                  </p>
                  <p>
                    By merging generative physics with classical typography, we transform 
                    static glyphs into living structures. Every particle is a tribute to 
                    the movement that gave a nation its voice.
                  </p>
                  <div className="pt-10">
                    <p className="text-emerald-500/60">"রাষ্ট্রভাষা বাংলা চাই"</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsPanel
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        chaos={chaos}
        onChaosChange={setChaos}
        colorMode={colorMode}
        onColorModeChange={setColorMode}
        complexity={complexity}
        onComplexityChange={setComplexity}
      />
    </main>
  );
}