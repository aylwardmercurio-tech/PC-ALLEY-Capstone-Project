"use client";

import { motion } from "framer-motion";
import { useLayout } from "../context/LayoutContext";

const StatCard = ({ title, value, subtext, icon: Icon, trend, colorClass = "red" }) => {
  const { isMobile } = useLayout();
  const isPositive = trend?.includes("▲") || trend?.startsWith("+") || trend?.includes("12.4%") || trend?.includes("8.1%");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative p-5 md:p-7 glass-panel rounded-2xl border border-border group overflow-hidden"
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-[9px] md:text-[11px] uppercase tracking-[1.5px] md:tracking-[2.5px] text-brand-crimson font-black">{title}</h3>
            {Icon && (
              <div className="p-1.5 md:p-2 rounded-lg bg-brand-surface border border-border opacity-50">
                <Icon size={isMobile ? 12 : 14} className="text-main" />
              </div>
            )}
          </div>
          <div className="text-2xl md:text-3xl lg:text-4xl font-rajdhani font-bold text-main tracking-tight mb-2">
            {value}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <div className={`flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold ${isPositive ? 'text-green-500' : 'text-brand-crimson'}`}>
              <span className="text-[8px]">{isPositive ? "▲" : "▼"}</span>
              {trend}
            </div>
          )}
          {subtext && <span className="text-[9px] md:text-[10px] text-muted opacity-60 uppercase tracking-tighter truncate">{subtext}</span>}
        </div>
      </div>

      {/* Subtle corner glow */}
      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-brand-crimson/10 blur-[40px] rounded-full pointer-events-none" />
    </motion.div>
  );
};

export default StatCard;
