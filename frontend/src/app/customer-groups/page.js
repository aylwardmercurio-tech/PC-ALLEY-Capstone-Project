"use client";

import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { Users, Filter, Plus, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomerGroupsPage() {
  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar title="CUSTOMER GROUPS" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10 bg-brand-bgbase text-main">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-rajdhani font-bold flex items-center gap-3">
              <Users size={24} className="text-brand-neonblue" /> 
              Customer Segment Management
            </h2>
            <button className="px-4 py-2 bg-brand-crimson text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-red-700 transition">
              <Plus size={16} /> Add Group
            </button>
          </div>

          <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-brand-surface border border-border rounded-2xl p-6 lg:p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-[2px] flex items-center gap-3">
                <Filter size={18} className="text-muted" /> Configured Groups
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-muted border-b border-border">
                    <th className="pb-4 pr-4">Group Name</th>
                    <th className="pb-4 px-4">Calculation Percentage</th>
                    <th className="pb-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-border hover:bg-brand-muted/5 transition-colors">
                    <td className="py-5 pr-4 font-bold text-[13px] text-main">VIP CLIENTS</td>
                    <td className="py-5 px-4 text-brand-crimson font-mono">+ 15.00%</td>
                    <td className="py-5 px-4 text-right">
                      <div className="flex justify-end gap-3 text-muted">
                        <Edit2 size={16} className="cursor-pointer hover:text-brand-neonblue transition" />
                        <Trash2 size={16} className="cursor-pointer hover:text-brand-crimson transition" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-border hover:bg-brand-muted/5 transition-colors">
                    <td className="py-5 pr-4 font-bold text-[13px] text-main">REGULAR</td>
                    <td className="py-5 px-4 text-muted font-mono">0.00%</td>
                    <td className="py-5 px-4 text-right">
                      <div className="flex justify-end gap-3 text-muted">
                        <Edit2 size={16} className="cursor-pointer hover:text-brand-neonblue transition" />
                        <Trash2 size={16} className="cursor-pointer hover:text-brand-crimson transition" />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-border hover:bg-brand-muted/5 transition-colors">
                    <td className="py-5 pr-4 font-bold text-[13px] text-main">BULK WHOLESALE</td>
                    <td className="py-5 px-4 text-brand-neonblue font-mono">- 10.00%</td>
                    <td className="py-5 px-4 text-right">
                      <div className="flex justify-end gap-3 text-muted">
                        <Edit2 size={16} className="cursor-pointer hover:text-brand-neonblue transition" />
                        <Trash2 size={16} className="cursor-pointer hover:text-brand-crimson transition" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 text-center text-xs text-muted">
              Note: This feature is currently in preview mode. Data is simulated for display purposes.
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
