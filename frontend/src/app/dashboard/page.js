"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { motion } from "framer-motion";
import {
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
import StatCard from "../../components/StatCard";
import { useTheme } from "../../context/ThemeContext";
import { getChartTheme } from "../../lib/chartTheme";

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
  const { theme } = useTheme();
  const chartTheme = getChartTheme(theme);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/";
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
        pointBorderColor: chartTheme.pointBorderColor,
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
        pointBorderColor: chartTheme.pointBorderColor,
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
        backgroundColor: chartTheme.tooltipBackgroundColor,
        titleColor: chartTheme.tooltipTitleColor,
        bodyColor: chartTheme.tooltipBodyColor,
        borderColor: chartTheme.tooltipBorderColor,
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        min: 180,
        max: 360,
        ticks: {
          stepSize: 20,
          color: chartTheme.tickColor,
          font: { size: 10, family: 'DM Sans' },
          callback: (value) => '₱' + value + 'k'
        },
        grid: {
          color: chartTheme.gridColor,
          drawBorder: false,
        }
      },
      x: {
        ticks: {
          color: chartTheme.tickColor,
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
        <TopBar title="OVERVIEW DASHBOARD" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10 bg-brand-bgbase">
          
          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard 
              title="Total Revenue" 
              value="₱284,920" 
              trend="▲ 12.4%" 
              subtext="vs last month" 
              icon={DollarSign}
            />
            <StatCard 
              title="Total Orders" 
              value="4,821" 
              trend="▲ 8.1%" 
              subtext="vs last month" 
            />
            <StatCard 
              title="Active Customers" 
              value="1,294" 
              trend="▼ 2.3%" 
              subtext="vs last month" 
            />
            <StatCard 
              title="Stock Items" 
              value="8,340" 
              trend="▲ 3.7%" 
              subtext="restocked" 
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Line Chart Panel */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="col-span-2 bg-brand-surface/80 border-border rounded-2xl p-6 lg:p-8 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-main/20 rounded-full" />
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
