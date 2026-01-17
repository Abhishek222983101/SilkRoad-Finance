"use client";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const words = ["Suppliers", "Factories", "Agencies", "Exporters"];

export function TextLoop() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-block w-[8ch] text-left align-top">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          // Added py-1 to prevent vertical clipping
          className="absolute top-0 left-0 text-transparent bg-clip-text bg-gradient-to-r from-[#00E500] to-green-400 whitespace-nowrap py-1"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
      {/* Increased width placeholder */}
      <span className="invisible py-1">Exporters</span>
    </div>
  );
}