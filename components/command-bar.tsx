"use client";

import { useState, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Settings2, Command, Zap, X } from "lucide-react";
import { getTransliterationPreview } from "@/lib/phonetic-transliteration";

interface CommandBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onGenerate: (text: string) => void;
  onSettingsOpen: () => void;
  isGenerating: boolean;
  onPhoneticChange?: (enabled: boolean) => void;
  onClear?: () => void;
}

export const CommandBar = forwardRef<HTMLInputElement, CommandBarProps>(
  function CommandBar(
    { value = "", onChange, onGenerate, onSettingsOpen, isGenerating, onPhoneticChange, onClear },
    ref
  ) {
  const [isFocused, setIsFocused] = useState(false);
  const [phoneticEnabled, setPhoneticEnabled] = useState(false);
  const [preview, setPreview] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const setInputRef = (el: HTMLInputElement | null) => {
    (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
  };

  const text = value;
  const setText = (v: string) => {
    if (phoneticEnabled && !v.endsWith(' ')) setPreview(getTransliterationPreview(v));
    else setPreview("");
    onChange?.(v);
  };
  
  const handleToggle = () => {
    setPhoneticEnabled(!phoneticEnabled);
    onPhoneticChange?.(!phoneticEnabled);
  };

  const hasText = text.trim().length > 0;

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); inputRef.current?.focus(); }
      if (e.key === "Escape" && text) { e.preventDefault(); onClear?.(); setPreview(""); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClear, text]);

  const go = () => { if (hasText && !isGenerating) onGenerate(text); };

  return (
    <div className="fixed bottom-6 left-1/2 z-[100] w-full -translate-x-1/2 px-3 md:bottom-10 md:max-w-2xl">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`relative flex items-center gap-2 rounded-2xl border bg-card/80 p-1.5 shadow-2xl backdrop-blur-2xl md:gap-3 md:p-2 ${
          isFocused ? "border-accent/50" : "border-border/40"
        }`}
      >
        <div className="flex shrink-0 items-center gap-0.5 md:gap-1">
          <button
            onClick={handleToggle}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
              phoneticEnabled ? "bg-accent/20 text-accent" : "text-muted-foreground hover:bg-white/5"
            }`}
          >
            <Zap className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => { onClear?.(); setPreview(""); }}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>

          <button
            onClick={onSettingsOpen}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/5"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>

        <div className="relative flex flex-1 min-w-0 flex-col py-1">
          <input
            ref={setInputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => { setIsFocused(false); setPreview(""); }}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="বাংলায় লিখুন..."
            className="w-full bg-transparent font-bangla text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none md:text-base"
          />
          <AnimatePresence>
            {preview && phoneticEnabled && (
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute -bottom-4 left-0 truncate text-[10px] text-accent/70"
              >
                {preview}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={go}
          disabled={!hasText || isGenerating}
          className={`flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 transition-all ${
            hasText ? "bg-accent text-accent-foreground shadow-lg" : "bg-muted text-muted-foreground"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden xs:inline text-xs font-bold uppercase tracking-wider">
            {isGenerating ? "..." : "Generate"}
          </span>
        </button>
      </motion.div>
    </div>
  );
});