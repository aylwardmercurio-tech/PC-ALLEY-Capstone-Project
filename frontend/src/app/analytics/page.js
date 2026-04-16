"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import StatCard from "../../components/StatCard";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calendar,
  Download,
  Filter,
  DollarSign,
  ArrowUpRight,
  Target,
  Zap,
  Cpu,
  Activity,
  Box,
  BrainCircuit,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const velocityData = [45, 62, 58, 85, 120, 98, 145, 110, 165, 140, 190, 175];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar title="ANALYTICS MATRIX" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10 bg-brand-bgbase">
          {/* Top Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h2 className="text-xl font-rajdhani font-black tracking-[4px] uppercase text-brand-title">Intelligence Core</h2>
              <p className="text-[10px] text-brand-muted/50 font-black tracking-[2px] uppercase mt-1">Personnel Authorization: Level 4</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none h-11 px-6 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-hover transition-all text-brand-muted hover:text-brand-title">
                <Calendar size={16} /> Last 30 Cycles
              </button>
              <button className="flex-1 md:flex-none h-11 px-8 bg-brand-crimson hover:bg-red-700 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-crimson/20">
                <Download size={16} /> Extract Matrix
              </button>
            </div>
          </div>

          {/* Main KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard 
              title="Total Revenue" 
              value="₱8.42M" 
              trend="▲ 1.2M" 
              subtext="Monthly Flow" 
              icon={DollarSign}
            />
            <StatCard 
              title="Net Yield" 
              value="₱1.85M" 
              trend="+8.1%" 
              subtext="System Profit" 
              icon={TrendingUp}
            />
            <StatCard 
              title="Efficiency" 
              value="84%" 
              trend="OPTIMAL" 
              subtext="Network Load" 
              icon={Activity}
            />
            <StatCard 
              title="Core Usage" 
              value="92%" 
              trend="HIGH" 
              subtext="Resource Allocation" 
              icon={Cpu}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Velocity Visualizer */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 bg-brand-surface/80 border border-border rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-brand-neonblue/20 rounded-full" />
                  <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">Velocity Matrix</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-neonblue shadow-[0_0_8px_rgba(var(--brand-neonblue-rgb),0.5)]" />
                    <span className="text-[9px] font-bold text-muted uppercase">Active Pulse</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Chart Area */}
              <div className="h-72 w-full">
                <Line
                  data={{
                    labels: months,
                    datasets: [
                      {
                        label: 'Active Pulse',
                        data: velocityData,
                        borderColor: '#00F2FF',
                        backgroundColor: 'rgba(0, 242, 255, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#00F2FF',
                        pointBorderColor: 'rgba(var(--brand-bgbase-rgb), 1)',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                      },
                      {
                        label: 'Base Vector',
                        data: velocityData.map(v => v * 0.8),
                        borderColor: 'rgba(var(--text-main-rgb), 0.1)',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false,
                        pointBackgroundColor: 'transparent',
                        pointBorderColor: 'transparent',
                        pointRadius: 0,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(var(--brand-panel-rgb), 0.9)',
                        titleColor: 'rgb(var(--text-main-rgb))',
                        bodyColor: 'rgba(var(--text-main-rgb), 0.7)',
                        borderColor: 'rgba(var(--brand-border-rgb), 0.1)',
                        borderWidth: 1,
                      }
                    },
                    scales: {
                      y: {
                        grid: { color: 'rgba(var(--text-main-rgb), 0.05)', drawBorder: false },
                        ticks: { color: 'rgba(var(--text-main-rgb), 0.5)', font: { size: 10, family: 'DM Sans' } }
                      },
                      x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { color: 'rgba(var(--text-main-rgb), 0.5)', font: { size: 10, family: 'DM Sans' } }
                      }
                    },
                    interaction: { mode: 'nearest', axis: 'x', intersect: false }
                  }}
                />
              </div>
            </motion.div>

            {/* AI Insights Panel */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.1 }}
               className="bg-brand-surface/80 border border-border rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-brand-neonpurple/50 rounded-full" />
                  <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">Strategic AI</h3>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
                <div className="p-4 bg-brand-neonpurple/5 border border-brand-neonpurple/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-brand-neonpurple uppercase tracking-widest">Optimization Agent</span>
                  </div>
                  <p className="text-[11px] font-medium text-muted leading-relaxed">
                    Turnover is <span className="text-main">18.4% above benchmark</span>. Recommend aggressive restock.
                  </p>
                </div>

                <div className="p-4 bg-brand-neonblue/5 border border-brand-neonblue/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-brand-neonblue uppercase tracking-widest">Efficiency Scan</span>
                  </div>
                  <p className="text-[11px] font-medium text-muted leading-relaxed">
                    Peak activity at <span className="text-main">14:00 - 17:00</span>. Allocate secondary operator.
                  </p>
                </div>
              </div>

              <button className="w-full mt-6 py-3 bg-brand-surface border border-border rounded-xl text-[10px] font-bold uppercase tracking-[2px] text-muted hover:text-main transition-all">
                Full Systems Diagnosis
              </button>
            </motion.div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
            <div className="bg-brand-surface/80 border border-border rounded-2xl p-6 md:p-8 lg:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-4 bg-muted/20 rounded-full" />
                <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">Matrix Allocation</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  { label: "Hardware Core", val: "54%", color: "#D72638" },
                  { label: "Peripheral Link", val: "22%", color: "#00F2FF" },
                  { label: "Storage Units", val: "15%", color: "#BC13FE" },
                  { label: "System Service", val: "9%", color: "#FFF" },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{item.label}</span>
                      <span className="text-xs font-bold text-main">{item.val}</span>
                    </div>
                    <div className="h-1 w-full bg-brand-bgbase rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: item.val }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-surface/80 border border-border rounded-2xl p-6 md:p-8 lg:p-10 shadow-sm">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-muted/20 rounded-full" />
                  <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">Sector Performance</h3>
                </div>
                <span className="text-[10px] font-bold text-muted tracking-widest uppercase">Live Vector</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Sector Alpha (QC)", rev: "₱2.4M", trend: "▲ 15%" },
                  { name: "Sector Beta (Manila)", rev: "₱1.8M", trend: "▼ 2%" },
                  { name: "Sector Zeta (Davao)", rev: "₱1.2M", trend: "▲ 8%" },
                ].map((sector, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-brand-surface border border-border rounded-2xl group hover:border-brand-neonblue/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-brand-bgbase border border-border flex items-center justify-center text-[10px] font-bold text-muted">S{i+1}</div>
                      <div>
                        <h4 className="text-[13px] font-bold text-main">{sector.name}</h4>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{sector.rev} Yield</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold ${sector.trend.includes('▲') ? 'text-green-400' : 'text-brand-crimson'}`}>
                      {sector.trend}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
