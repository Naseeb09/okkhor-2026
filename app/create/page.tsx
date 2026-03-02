"use client";

import { useState, useCallback, useRef } from "react";
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
  // UI States
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Canvas States
  const [chaos, setChaos] = useState(35);
  const [complexity, setComplexity] = useState(50);
  const [colorMode, setColorMode] = useState(50);
  
  // Input & Engine States
  const [inputText, setInputText] = useState("");
  const [currentText, setCurrentText] = useState("ওক্ষর");
  const [isGenerating, setIsGenerating] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(SEED_GALLERY);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // --- REFINED UPDATE LOGIC ---
  const handleUpdate = useCallback((val: string) => {
    setInputText(val);
    // Transliterate on the fly for the particle canvas
    const translated = phoneticTransliterate(val);
    setCurrentText(translated || "ওক্ষর"); 
  }, []);

  const handleGenerate = useCallback((text: string) => {
    if (!text) return;
    
    setIsGenerating(true);
    const finalTranslation = phoneticTransliterate(text);
    setCurrentText(finalTranslation);

    // Save to Archive
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

  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#010604] flex items-center justify-center">
      
      {/* Background HUD Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="h-[600px] w-[600px] bg-emerald-500/[0.03] blur-[120px] rounded-full" />
        <h1 className="select-none font-bangla text-[22vw] font-bold text-white/[0.01] mt-[-5vh]">
          বর্ণ
        </h1>
      </div>

      {/* --- TOP HEADER (THE MISSING BUTTONS) --- */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        <Link href="/" className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all">
          ← BACK TO CORE
        </Link>
        <div className="flex gap-8">
          <button 
            onClick={() => setGalleryOpen(true)} 
            className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            ARCHIVE
          </button>
          <button 
            onClick={() => setAboutOpen(true)} 
            className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            MANIFESTO
          </button>
        </div>
      </header>

      {/* Main Stage */}
      <div className="relative z-10 w-full max-w-6xl px-6 aspect-video">
        <div className="relative h-full w-full rounded-3xl border border-white/5 bg-black/20 backdrop-blur-3xl overflow-hidden shadow-2xl">
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

          {/* Engine Status Bar */}
          <div className="absolute bottom-6 left-10 right-10 flex justify-between items-center border-t border-white/5 pt-4">
            <div className="flex items-center gap-3">
              <div className={`h-1 w-1 rounded-full transition-all duration-500 ${isGenerating ? 'bg-cyan-400 shadow-[0_0_10px_cyan]' : 'bg-emerald-500 shadow-[0_0_8px_emerald]'}`} />
              <span className="font-mono text-[8px] text-white/40 tracking-[0.2em] uppercase">
                {isGenerating ? "Synthesizing_Geometry" : "System_Stable"}
              </span>
            </div>
            <div className="font-mono text-[8px] text-white/20 uppercase tracking-tighter space-x-6">
              <span>Entropy: {chaos}%</span>
              <span>Density: {complexity}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- FLOATING CONTROLS --- */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-[100]">
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

      {/* --- OVERLAYS --- */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="fixed inset-y-0 left-0 z-[120] w-full max-w-sm bg-black/90 backdrop-blur-3xl border-r border-white/5 p-12 shadow-2xl overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-white/50">History_Log</h2>
              <button onClick={() => setGalleryOpen(false)} className="text-white/20 hover:text-white transition-colors">✕</button>
            </div>
            <Gallery items={galleryItems} />
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