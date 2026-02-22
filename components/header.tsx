"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Hexagon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 md:py-5"
    >
      <div className="flex items-center gap-3">
        <Hexagon className="h-6 w-6 text-accent" strokeWidth={1.5} />
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Bangla-Borno
          </span>
          <span className="hidden text-xs font-light tracking-widest uppercase text-muted-foreground sm:inline">
            Language Canvas
          </span>
        </div>
      </div>

      <nav className="hidden items-center gap-8 md:flex">
        <a
          href="#canvas"
          className="text-xs font-medium tracking-widest uppercase text-muted-foreground transition-colors hover:text-foreground"
        >
          Canvas
        </a>
        <a
          href="#gallery"
          className="text-xs font-medium tracking-widest uppercase text-muted-foreground transition-colors hover:text-foreground"
        >
          Gallery
        </a>
        <a
          href="#about"
          className="text-xs font-medium tracking-widest uppercase text-muted-foreground transition-colors hover:text-foreground"
        >
          About
        </a>
      </nav>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur-xl transition-all hover:border-accent/50 hover:bg-card"
        aria-label="Toggle theme"
      >
        {mounted && (
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-foreground" />
            )}
          </motion.div>
        )}
      </button>
    </motion.header>
  );
}
