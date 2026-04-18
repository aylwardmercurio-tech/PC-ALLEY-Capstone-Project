"use client";

import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import { Copy, Plus, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function PurchaseOrdersPage() {
  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar title="PURCHASE ORDERS" />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-rajdhani font-bold flex items-center gap-3">
              <FileText size={24} className="text-brand-neonblue" /> 
              Purchase Orders 
            </h2>
            <button className="px-4 py-2 bg-brand-neonblue text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-blue-600 transition">
              <Plus size={16} /> New Order
            </button>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-brand-surface border border-border rounded-2xl p-6 lg:p-10 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <Copy size={48} className="text-muted mb-4 opacity-50" />
            <p className="text-muted font-bold text-sm">No Purchase Orders Found</p>
            <p className="text-muted/60 text-xs mt-2 uppercase tracking-widest text-center">Module in Preview Mode.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
