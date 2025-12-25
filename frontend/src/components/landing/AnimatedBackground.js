"use client";

import { motion } from "motion/react";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary gradient orb */}
      <motion.div
        className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Secondary gradient orb */}
      <motion.div
        className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-secondary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.5, 0.4],
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      {/* Accent gradient orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-accent/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
