"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { KEYBOARD_ROWS } from "@/lib/avro-map";

interface BanglaKeyboardProps {
  visible: boolean;
  onToggle: () => void;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function BanglaKeyboard({
  visible,
  onToggle,
  onKeyPress,
  onBackspace,
  onSpace,
  inputRef,
}: BanglaKeyboardProps) {
  const [lastWasConsonant, setLastWasConsonant] = useState(false);

  const handleKeyClick = (char: string, vowelSign?: string) => {
    inputRef.current?.focus();
    // If we have a vowel sign and last char was a consonant, we could replace
    // For simplicity, just insert the main character (full vowel or consonant)
    onKeyPress(char);
    setLastWasConsonant(
      char >= "\u0995" && char <= "\u09B9" || char === "\u0995\u09CD\u09B7"
    );
  };

  return (
    <>
      {/* Toggle button - floating */}
      <motion.button
        onClick={onToggle}
        className="fixed right-6 bottom-24 z-50 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/40 shadow-xl backdrop-blur-xl transition-colors hover:bg-black/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        aria-label={visible ? "Hide keyboard" : "Show Bangla keyboard"}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <Keyboard className="h-5 w-5 text-foreground" />
      </motion.button>

      {/* Keyboard panel */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 left-6 z-50 md:left-auto md:right-6 md:w-[520px]"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Avro Phonetic
                </span>
                <button
                  onClick={onToggle}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label="Close keyboard"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Key rows */}
              <div className="space-y-1.5 p-3">
                {KEYBOARD_ROWS.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`flex flex-wrap gap-1 ${row.className ?? ""}`}
                  >
                    {row.keys.map((keyDef) => (
                      <button
                        key={keyDef.label + keyDef.char}
                        type="button"
                        onClick={() =>
                          handleKeyClick(keyDef.char, keyDef.vowelSign)
                        }
                        className="flex min-w-[2rem] flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2 py-2 font-bangla text-base transition-all hover:scale-105 hover:border-accent/40 hover:bg-accent/20 active:scale-95"
                      >
                        <span className="font-bangla text-lg leading-tight text-foreground">
                          {keyDef.char}
                        </span>
                        <span className="mt-0.5 font-mono text-[9px] text-muted-foreground">
                          {keyDef.label}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}

                {/* Bottom row: Space, Backspace */}
                <div className="flex gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      inputRef.current?.focus();
                      onSpace();
                    }}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 font-mono text-[10px] text-muted-foreground transition-all hover:border-accent/30 hover:bg-accent/10 hover:text-foreground"
                  >
                    Space
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      inputRef.current?.focus();
                      onBackspace();
                    }}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-[10px] text-muted-foreground transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-foreground"
                  >
                    ⌫
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
