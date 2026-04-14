"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { motion } from "framer-motion";
import {
  Currency,
  DollarSign
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/login";
    } else {
      setUser(JSON.parse(userData));
    }
  }, []);

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [190, 230, 200, 250, 220, 280, 270, 310, 280, 320, 300, 290],
        borderColor: '#FF3B4E', // Red line
        backgroundColor: 'rgba(255, 59, 78, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FF3B4E',
        pointBorderColor: 'rgba(var(--brand-bgbase-rgb), 1)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Orders',
        data: [210, 250, 230, 270, 250, 310, 290, 340, 290, 350, 320, 300].map(v => v - 30), // Blue line slightly below
        borderColor: '#2563C4', // Blue line
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#2563C4',
        pointBorderColor: 'rgba(var(--brand-bgbase-rgb), 1)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
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
        min: 180,
        max: 360,
        ticks: {
          stepSize: 20,
          color: 'rgba(var(--text-main-rgb), 0.5)',
          font: { size: 10, family: 'DM Sans' },
          callback: (value) => '₱' + value + 'k'
        },
        grid: {
          color: 'rgba(var(--text-main-rgb), 0.05)',
          drawBorder: false,
        }
      },
      x: {
        ticks: {
          color: 'rgba(var(--text-main-rgb), 0.5)',
          font: { size: 10, family: 'DM Sans' }
        },
        grid: {
          display: false,
          drawBorder: false,
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const doughnutData = {
    labels: ['Electronics', 'Apparel', 'Other'],
    datasets: [
      {
        data: [45, 25, 30],
        backgroundColor: ['#2563C4', '#F8F9FB', '#FF3B4E'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(8, 11, 18, 0.9)',
        titleColor: '#fff',
        bodyColor: '#A0AEC0',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }
    }
  };

  const recentOrders = [
    { id: "#ORD-9821", customer: "Maria Santos", product: "Laptop Pro X1", amount: "₱1,299", status: "Delivered", date: "Apr 03, 2026" },
    { id: "#ORD-9820", customer: "Jose Reyes", product: "Wireless Earbuds", amount: "₱89", status: "Processing", date: "Apr 03, 2026" },
    { id: "#ORD-9819", customer: "Ana Cruz", product: "Office Chair", amount: "₱340", status: "Shipped", date: "Apr 02, 2026" },
  ];

  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Reusing TopBar for layout consistency, but adjusting it to look more like the mockup globally */}
        <TopBar title="OVERVIEW DASHBOARD" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10 bg-brand-bgbase">
          
          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Revenue */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/5 flex items-center justify-center opacity-20">
                <DollarSign size={20} />
              </div>
              <h3 className="text-[10px] font-black tracking-[2px] uppercase text-muted mb-3">Total Revenue</h3>
              <div className="text-3xl font-rajdhani font-bold text-main tracking-tight mb-2">₱284,920</div>
              <div className="flex items-center gap-1.5 text-xs text-brand-muted/70">
                <span className="text-green-400 font-bold flex items-center gap-1">▲ 12.4%</span>
                <span>vs last month</span>
              </div>
              {/* Subtle top indicator line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF3B4E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            {/* Card 2: Orders */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 relative overflow-hidden group">
              <h3 className="text-[10px] font-black tracking-[2px] uppercase text-muted mb-3">Total Orders</h3>
              <div className="text-3xl font-rajdhani font-bold text-main tracking-tight mb-2">4,821</div>
              <div className="flex items-center gap-1.5 text-xs text-brand-muted/70">
                <span className="text-green-400 font-bold flex items-center gap-1">▲ 8.1%</span>
                <span>vs last month</span>
              </div>
            </motion.div>

            {/* Card 3: Customers */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 relative overflow-hidden group">
              <h3 className="text-[10px] font-black tracking-[2px] uppercase text-muted mb-3">Active Customers</h3>
              <div className="text-3xl font-rajdhani font-bold text-main tracking-tight mb-2">1,294</div>
              <div className="flex items-center gap-1.5 text-xs text-brand-muted/70">
                <span className="text-muted font-bold flex items-center gap-1">▼ 2.3%</span>
                <span>vs last month</span>
              </div>
            </motion.div>

            {/* Card 4: Stock */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-6 right-6 h-0.5 bg-green-500/50" />
              <h3 className="text-[10px] font-black tracking-[2px] uppercase text-muted mb-3 mt-1">Stock Items</h3>
              <div className="text-3xl font-rajdhani font-bold text-main tracking-tight mb-2">8,340</div>
              <div className="flex items-center gap-1.5 text-xs text-brand-muted/70">
                <span className="text-green-400 font-bold flex items-center gap-1">▲ 3.7%</span>
                <span>restocked</span>
              </div>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Line Chart Panel */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="col-span-2 bg-brand-surface/80 border-border rounded-2xl p-6 lg:p-8 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-white/20 rounded-full" />
                  <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">Monthly Revenue</h3>
                </div>
                <button className="px-4 py-1.5 rounded-lg border border-border text-[10px] font-bold tracking-widest uppercase text-muted hover:text-main hover:bg-brand-surface transition-colors">
                  Export
                </button>
              </div>
              
              <div className="h-64 w-full">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>

              {/* Custom Legend */}
              <div className="flex items-center gap-6 mt-6 ml-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-crimson/40" />
                  <span className="text-xs text-muted">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-neonblue" />
                  <span className="text-xs text-muted">Orders</span>
                </div>
              </div>
            </motion.div>

            {/* Doughnut Chart Panel */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 lg:p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-4 bg-muted/20 rounded-full" />
                <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">Category Split</h3>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="w-48 h-48 relative">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              </div>

              {/* Doughnut Custom Legend */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-bgbase border border-border" />
                  <span className="text-xs text-muted">Electronics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2563C4]" />
                  <span className="text-xs text-muted">Apparel</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B4E]" />
                  <span className="text-xs text-muted">Other</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Table Section */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-brand-surface border border-border rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-muted/20 rounded-full" />
                <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">Recent Orders</h3>
              </div>
              <button className="px-4 py-1.5 rounded-lg border border-border hover:bg-brand-muted/5 text-[10px] font-bold tracking-widest uppercase text-muted hover:text-main transition-colors">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-muted border-b border-border">
                    <th className="pb-4 pr-4">Order ID</th>
                    <th className="pb-4 px-4">Customer</th>
                    <th className="pb-4 px-4">Product</th>
                    <th className="pb-4 px-4">Amount</th>
                    <th className="pb-4 px-4 w-32">Status</th>
                    <th className="pb-4 pl-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="border-b border-border hover:bg-brand-muted/5 transition-colors">
                      <td className="py-4 pr-4 font-bold text-main">{order.id}</td>
                      <td className="py-4 px-4 text-muted">{order.customer}</td>
                      <td className="py-4 px-4 text-muted">{order.product}</td>
                      <td className="py-4 px-4 font-bold text-main">{order.amount}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border opacity-80 ${
                          order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          order.status === 'Processing' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right text-muted text-[13px]">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
