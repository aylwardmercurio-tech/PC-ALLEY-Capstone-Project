"use client";

import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import { Package } from "lucide-react";
import { motion } from "framer-motion";

export default function AddPage() {
  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar title="PROVISION NEW UNIT" />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <Package className="text-brand-crimson" size={24} />
            <h1 className="text-xl font-rajdhani font-black text-main uppercase tracking-[4px]">Initialize Instance</h1>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="glass-card p-10 lg:p-20 flex flex-col items-center justify-center min-h-[500px]"
          >
            <Package size={48} className="text-main/10 mb-8" />
            <p className="text-main font-black text-sm text-center uppercase tracking-[2px]">Product Provisioning Matrix</p>
            <p className="text-main/30 text-[10px] mt-4 uppercase tracking-[4px] text-center max-w-xs leading-relaxed">The unit initialization module is ready for entity mapping. Authorized clearance required for bulk ledger injection.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
