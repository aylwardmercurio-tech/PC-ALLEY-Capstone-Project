"use client";

import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { motion } from "framer-motion";

export default function ExpensesPage() {
  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar title="EXPENSE REGISTRY" />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <span className="text-brand-crimson font-bold text-2xl">₱</span>
            <h1 className="text-xl font-rajdhani font-black text-main uppercase tracking-[4px]">System Expenditure</h1>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="glass-card p-10 lg:p-20 flex flex-col items-center justify-center min-h-[500px]"
          >
            <span className="text-main/10 mb-8 font-bold text-[64px]">₱</span>
            <p className="text-main font-black text-sm text-center uppercase tracking-[2px]">Fiscal Monitoring Core</p>
            <p className="text-main/30 text-[10px] mt-4 uppercase tracking-[4px] text-center max-w-xs leading-relaxed mb-10">Expense tracking and operational overhead synchronization. Ledger entries pending authorized injection.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => alert("System Notice: Expense Injection Matrix Not Enabled")} className="btn-premium px-8">
                Log New Expense
              </button>
              <button onClick={() => alert("System Notice: Fiscal Audit Protocol Restricted")} className="btn-ghost px-8 border-border/10">
                Audit Ledger
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}