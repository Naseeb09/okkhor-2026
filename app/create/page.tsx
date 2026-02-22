"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HeroCanvas } from "@/components/hero-canvas";
import { CommandBar } from "@/components/command-bar";
import { BanglaKeyboard } from "@/components/bangla-keyboard";
import { RulerFrame } from "@/components/ruler-frame";
import { SettingsPanel } from "@/components/settings-panel";
import { Gallery } from "@/components/gallery";
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
  { id: "seed-2", text: "আলো", chaos: 18, complexity: 45, colorMode: 8, timestamp: Date.now() },
];

export default function CreatePage() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [chaos, setChaos] = useState(35);
  const [complexity, setComplexity] = useState(50);
  const [colorMode, setColorMode] = useState(50);
  const [inputText, setInputText] = useState("");
  const [currentText, setCurrentText] = useState("ওক্ষর");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationKey, setGenerationKey] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(SEED_GALLERY);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [phoneticEnabled, setPhoneticEnabled] = useState(true); // Default to true for better UX
  const inputRef = useRef<HTMLInputElement>(null);

  // FIX: Instant Transliteration (ami -> আমি)
  const handleInputChange = useCallback(
    (value: string) => {
      if (phoneticEnabled && value.length > 0) {
        // Transliterate immediately on every keystroke
        const translated = phoneticTransliterate(value);
        setInputText(translated);
      } else {
        setInputText(value);
      }
    },
    [phoneticEnabled]
  );

  const handleGenerate = useCallback(
    (text: string) => {
      if (!text) return;
      setCurrentText(text);
      setIsGenerating(true);
      setGenerationKey((k) => k + 1);

      setTimeout(() => {
        setIsGenerating(false);
        setGalleryItems((prev) => [
          { id: `gen-${Date.now()}`, text, chaos, complexity, colorMode, timestamp: Date.now() },
          ...prev,
        ]);
      }, 2000);
    },
    [chaos, complexity, colorMode]
  );

  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#020d08] flex items-center justify-center">

      {/* 1. BACKGROUND LAYER (Glows + Large Text) */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="absolute h-[600px] w-[600px] rounded-full bg-glow-red/[0.05] blur-[120px]" />
        <h1 className="select-none font-bangla text-[20vw] font-bold text-white/[0.02] mt-[-5vh]">
          বর্ণ
        </h1>
      </div>

      {/* 2. HEADER HUD */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 backdrop-blur-md bg-black/20 border-b border-white/5">
        <Link href="/" className="font-mono text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">
          ← OKKHOR
        </Link>
        <h1 className="font-bangla text-xl font-medium text-white/90">বাংলা বর্ণ</h1>
        <div className="flex gap-6">
          <button onClick={() => setGalleryOpen(true)} className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            HISTORY
          </button>
          <button onClick={() => setAboutOpen(true)} className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            INFO
          </button>
        </div>
      </header>

      {/* LAYER 3: Internal Canvas Status */}
      {/* 3. THE CENTERED STAGE (Fixed the Canvas Overflow) */}
      <div className="relative z-10 w-full max-w-5xl px-6 aspect-[16/10] md:aspect-video flex items-center justify-center">
        <div className="relative h-full w-full rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-sm overflow-hidden">

          {/* LAYER 1: The Ruler Frame (Pinned to absolute edges) */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <RulerFrame />
          </div>

          {/* LAYER 2: The Canvas (Forced to the exact center, ignoring the ruler) */}
          <div className="absolute inset-0 z-10 p-8 md:p-12 flex items-center justify-center">
            {/* Added a wrapper here to make sure HeroCanvas respects the padding */}
            <div className="relative h-full w-full flex items-center justify-center">
              <HeroCanvas
                key={generationKey}
                text={inputText || currentText}
                chaos={chaos}
                complexity={complexity}
                colorMode={colorMode}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* LAYER 3: Internal Canvas Status */}
          <div className="absolute bottom-4 left-8 right-8 z-30 flex items-center justify-between border-t border-white/5 pt-4 bg-black/20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${isGenerating ? "animate-pulse bg-red-500" : "bg-green-500"}`} />
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">
                {isGenerating ? "Processing Geometry" : "Engine Ready"}
              </span>
            </div>
            <div className="font-mono text-[9px] text-white/20 space-x-4">
              <span>C:{chaos}</span> <span>X:{complexity}</span> <span>H:{colorMode}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. FLOATING COMMAND BAR & FOOTER */}
      {/* 4. FLOATING COMMAND BAR & BRANDING */}
      <div className="fixed bottom-6 left-1/2 z-[100] w-full -translate-x-1/2 px-4 md:bottom-10 md:max-w-2xl">
        <div className="flex flex-col items-center gap-6">
          
          {/* Main Input Component */}
          <CommandBar
            ref={inputRef}
            value={inputText}
            onChange={handleInputChange}
            onGenerate={handleGenerate}
            onSettingsOpen={() => setSettingsOpen(true)}
            isGenerating={isGenerating}
            onPhoneticChange={setPhoneticEnabled}
            onClear={() => setInputText("")}
          />
        </div>
      </div>

      {/* 5. OVERLAYS (Gallery, Settings, About) */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            className="fixed inset-y-0 left-0 z-[60] w-full max-w-md bg-black/90 backdrop-blur-2xl border-r border-white/10 p-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-bangla text-2xl text-white">গ্যালারি</h2>
              <button onClick={() => setGalleryOpen(false)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <Gallery items={galleryItems} />
          </motion.div>
        )}

        {aboutOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            onClick={() => setAboutOpen(false)}
          >
            <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-3xl max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-white text-2xl font-semibold mb-4">Geometry of Language</h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Bangla-Borno is a digital instrument where script becomes architecture. By analyzing the strokes and curves of Bangla characters, we generate unique geometric fields.
              </p>
              <button onClick={() => setAboutOpen(false)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">Close</button>
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