"use client";

import { motion } from "motion/react";

export const HolographicGlobe = () => {
  return (
    <div className="relative w-64 h-64 md:w-96 md:h-96 mx-auto perspective-1000">
      {/* CORE SPHERE */}
      <motion.div
        className="absolute inset-0 rounded-full border border-green-500/30 bg-green-900/10 shadow-[0_0_80px_rgba(0,229,0,0.4)] backdrop-blur-sm"
        animate={{ rotateY: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* GRID LINES (LATITUDE/LONGITUDE) */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`lat-${i}`}
            className="absolute inset-0 rounded-full border border-green-500/20"
            style={{ transform: `rotateX(${i * 36}deg)` }}
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <div
            key={`long-${i}`}
            className="absolute inset-0 rounded-full border border-green-500/20"
            style={{ transform: `rotateY(${i * 36}deg)` }}
          />
        ))}
      </motion.div>

      {/* FLOATING PARTICLES */}
      <motion.div
        className="absolute -inset-10 border border-dashed border-green-500/20 rounded-full"
        animate={{ rotateZ: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -inset-20 border border-dotted border-green-500/10 rounded-full"
        animate={{ rotateZ: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};