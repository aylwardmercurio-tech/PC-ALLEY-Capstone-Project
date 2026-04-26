"use client";

import { motion } from "framer-motion";

/**
 * MODERN LOGO COMPONENT
 * Clean, CSS-driven implementation based on the new brand identity.
 * Adapts to light/dark themes and any screen size.
 */

export const LogoIcon = ({ className = "w-12 h-12" }) => {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`${className} relative flex items-center justify-center shrink-0`}
    >
      {/* Outer Glow Effect - Increased blur and spread for a softer look */}
      <div className="absolute inset-[-15%] bg-[#FF2D55] blur-[15px] opacity-30 rounded-2xl" />
      
      {/* The Rounded Square Icon - Using a custom border radius for the 'squircle' feel */}
      <div className="relative w-full h-full bg-[#FF2D55] rounded-[30%] shadow-[inset_0_0_15px_rgba(255,255,255,0.25)] border border-white/10" />
    </motion.div>
  );
};

export const LogoBrandingV2 = ({ className = "", size = "normal" }) => {
  // Determine sizes based on the 'size' prop
  const iconSize = size === "large" ? "w-14 h-14" : (size === "small" ? "w-8 h-8" : "w-12 h-12");
  const mainTextSize = size === "large" ? "text-4xl" : (size === "small" ? "text-xl" : "text-3xl");
  const subTextSize = size === "large" ? "text-[11px]" : (size === "small" ? "text-[7px]" : "text-[9px]");
  const gap = size === "large" ? "gap-5" : (size === "small" ? "gap-2" : "gap-4");

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      <LogoIcon className={`${iconSize}`} />
      
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col justify-center"
      >
        <span className={`${mainTextSize} font-black tracking-tighter text-main font-rajdhani leading-[0.9]`}>
          PC ALLEY
        </span>
        <span className={`${subTextSize} tracking-[0.4em] text-muted font-bold uppercase leading-tight mt-1.5 opacity-70`}>
          Integrated Systems
        </span>
      </motion.div>
    </div>
  );
};

export default LogoBrandingV2;
