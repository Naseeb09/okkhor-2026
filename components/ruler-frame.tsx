"use client";

import { motion } from "framer-motion";

export function RulerFrame() {
  const ticksHorizontal = Array.from({ length: 60 }, (_, i) => i);
  const ticksVertical = Array.from({ length: 40 }, (_, i) => i);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Corner marks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute left-3 top-3 h-6 w-6 border-l border-t border-ruler md:left-5 md:top-5 md:h-8 md:w-8"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute right-3 top-3 h-6 w-6 border-r border-t border-ruler md:right-5 md:top-5 md:h-8 md:w-8"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute bottom-3 left-3 h-6 w-6 border-b border-l border-ruler md:bottom-5 md:left-5 md:h-8 md:w-8"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute bottom-3 right-3 h-6 w-6 border-b border-r border-ruler md:bottom-5 md:right-5 md:h-8 md:w-8"
      />

      {/* Top ruler ticks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="absolute left-12 right-12 top-3 flex justify-between md:left-16 md:right-16 md:top-5"
      >
        {ticksHorizontal.map((i) => (
          <div
            key={`top-${i}`}
            className={`bg-ruler ${i % 10 === 0 ? "h-3 w-px" : i % 5 === 0 ? "h-2 w-px" : "h-1 w-px"}`}
          />
        ))}
      </motion.div>

      {/* Bottom ruler ticks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="absolute bottom-3 left-12 right-12 flex justify-between md:bottom-5 md:left-16 md:right-16"
      >
        {ticksHorizontal.map((i) => (
          <div
            key={`bottom-${i}`}
            className={`bg-ruler ${i % 10 === 0 ? "h-3 w-px" : i % 5 === 0 ? "h-2 w-px" : "h-1 w-px"}`}
          />
        ))}
      </motion.div>

      {/* Left ruler ticks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-12 left-3 top-12 flex flex-col justify-between md:bottom-16 md:left-5 md:top-16"
      >
        {ticksVertical.map((i) => (
          <div
            key={`left-${i}`}
            className={`bg-ruler ${i % 10 === 0 ? "h-px w-3" : i % 5 === 0 ? "h-px w-2" : "h-px w-1"}`}
          />
        ))}
      </motion.div>

      {/* Right ruler ticks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-12 right-3 top-12 flex flex-col items-end justify-between md:bottom-16 md:right-5 md:top-16"
      >
        {ticksVertical.map((i) => (
          <div
            key={`right-${i}`}
            className={`bg-ruler ${i % 10 === 0 ? "h-px w-3" : i % 5 === 0 ? "h-px w-2" : "h-px w-1"}`}
          />
        ))}
      </motion.div>

      {/* Coordinate labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <span className="absolute left-14 top-5 font-mono text-[9px] text-ruler md:left-20 md:top-7">
          0,0
        </span>
        <span className="absolute right-14 top-5 font-mono text-[9px] text-ruler md:right-20 md:top-7">
          1920,0
        </span>
        <span className="absolute bottom-5 left-14 font-mono text-[9px] text-ruler md:bottom-7 md:left-20">
          0,1080
        </span>
      </motion.div>
    </div>
  );
}
