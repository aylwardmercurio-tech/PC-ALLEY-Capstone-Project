"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import StatCard from "../../components/StatCard";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  History,
  Star,
  Award,
  Globe,
  TrendingUp,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    
    setTimeout(() => {
      setCustomers([
        { id: 1, name: "Alexander Pierce", email: "alex@highvoltage.io", phone: "+63 917 123 4567", category: "VIP", totalSpent: "₱450,200", status: "Active", lastPurchase: "2h ago", segment: "VIP" },
        { id: 2, name: "Maria Clara", email: "mclara@heritage.ph", phone: "+63 920 888 1234", category: "Regular", totalSpent: "₱12,500", status: "Active", lastPurchase: "1d ago", segment: "REGULAR" },
        { id: 3, name: "Renato Cruz", email: "rcruz@cyber.dev", phone: "+63 944 555 6789", category: "Enterprise", totalSpent: "₱1,240,000", status: "Active", lastPurchase: "5m ago", segment: "VIP" },
        { id: 4, name: "Elena Gilbert", email: "eg@mystic.com", phone: "+63 905 111 2222", category: "Regular", totalSpent: "₱8,400", status: "Inactive", lastPurchase: "3mo ago", segment: "INACTIVE" },
        { id: 5, name: "Stefan Salvatore", email: "ss@daylight.org", phone: "+63 911 333 4444", category: "VIP", totalSpent: "₱210,000", status: "Active", lastPurchase: "12h ago", segment: "VIP" },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const segments = [
    { name: "VIP CLIENTS", count: 124, percentage: 85, color: "#D72638" },
    { name: "REGULAR", count: 1842, percentage: 65, color: "#00F2FF" },
    { name: "NEW LEADS", count: 428, percentage: 40, color: "#BC13FE" },
    { name: "INACTIVE", count: 88, percentage: 15, color: "#666" },
  ];

  const locations = [
    { city: "Quezon City", count: 842, percentage: 90 },
    { city: "Manila", count: 654, percentage: 75 },
    { city: "Davao City", count: 423, percentage: 55 },
    { city: "Cebu City", count: 312, percentage: 40 },
  ];

  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar title="CUSTOMER MONITOR" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10 bg-brand-bgbase text-main">
          {/* Header KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 relative overflow-hidden group shadow-sm">
               <h3 className="text-[10px] font-black tracking-[2px] uppercase text-muted mb-3">Total Base</h3>
               <div className="text-3xl font-rajdhani font-bold text-main tracking-tight mb-2">2,482</div>
               <div className="flex items-center gap-1.5 text-xs text-muted/70">
                 <span className="text-green-400 font-bold flex items-center gap-1">▲ 12.5%</span>
                 <span>Personnel Link</span>
               </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 relative overflow-hidden group shadow-sm">
               <h3 className="text-[10px] font-black tracking-[2px] uppercase text-muted mb-3 text-cyan-400">VIP Sector</h3>
               <div className="text-3xl font-rajdhani font-bold text-main tracking-tight mb-2">124</div>
               <div className="flex items-center gap-1.5 text-xs text-muted/70">
                 <span className="text-cyan-400 font-bold flex items-center gap-1">▲ 5.2%</span>
                 <span>High-Value Core</span>
               </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 relative overflow-hidden group shadow-sm">
               <h3 className="text-[10px] font-black tracking-[2px] uppercase text-muted mb-3 text-brand-neonpurple">Active Leads</h3>
               <div className="text-3xl font-rajdhani font-bold text-main tracking-tight mb-2">48</div>
               <div className="flex items-center gap-1.5 text-xs text-muted/70">
                 <span className="text-muted/40 font-bold flex items-center gap-1">STABLE</span>
                 <span>Current Cycle</span>
               </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 relative overflow-hidden group shadow-sm">
               <h3 className="text-[10px] font-black tracking-[2px] uppercase text-muted mb-3">Retention</h3>
               <div className="text-3xl font-rajdhani font-bold text-main tracking-tight mb-2">92%</div>
               <div className="flex items-center gap-1.5 text-xs text-muted/70">
                 <span className="text-green-400 font-bold flex items-center gap-1">OPTIMUM</span>
                 <span>Network Stability</span>
               </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left: Customer Segments */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${user?.role === 'employee' ? 'lg:col-span-3' : 'lg:col-span-1'} bg-brand-surface border border-border rounded-2xl p-8 lg:p-10 flex flex-col shadow-sm`}
            >
              <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-[2px] mb-8 flex items-center gap-3">
                <Filter size={18} className="text-brand-neonblue" /> Customer Segments
              </h3>
              <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
                {segments.map((seg) => (
                  <div key={seg.name} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-muted tracking-widest uppercase">{seg.name}</span>
                      <span className="text-xs font-bold text-main">{seg.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-brand-bgbase rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${seg.percentage}%` }}
                        transition={{ duration: 1.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: seg.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {user?.role !== 'employee' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 bg-brand-surface border border-border rounded-2xl p-8 lg:p-10 flex flex-col shadow-sm"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-[2px] flex items-center gap-3">
                    <Globe size={18} className="text-brand-neonpurple" /> Strategic Locations
                  </h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-main transition-colors">Visual Matrix &gt;</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {locations.map((loc) => (
                    <div key={loc.city} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-muted" />
                          <span className="text-[11px] font-bold text-main">{loc.city}</span>
                        </div>
                        <span className="text-[10px] font-bold text-muted whitespace-nowrap">{loc.count} Base</span>
                      </div>
                      <div className="h-1 w-full bg-brand-bgbase rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${loc.percentage}%` }}
                          transition={{ duration: 1.5 }}
                          className="h-full bg-brand-neonblue/20 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Customer Table */}
          <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-brand-surface border border-border rounded-2xl p-6 lg:p-8 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
              <div className="relative group flex-1 w-full max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-neonblue transition-colors" />
                <input 
                  type="text" 
                  placeholder="Query Database Profile..." 
                  className="w-full bg-brand-bgbase border border-border rounded-xl py-2.5 pl-11 pr-4 text-xs text-main focus:outline-none focus:border-brand-neonblue/30 transition-all font-bold"
                />
              </div>
              <button className="h-11 px-6 bg-brand-crimson hover:bg-red-700 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[2px] text-white transition-all shadow-lg shadow-brand-crimson/20">
                <UserPlus size={18} /> Register Personnel
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-muted border-b border-border">
                    <th className="pb-4 pr-4">Link ID</th>
                    <th className="pb-4 px-4">Tactical Profile</th>
                    <th className="pb-4 px-4">Segment Auth</th>
                    <th className="pb-4 px-4">Network Vector</th>
                    <th className="pb-4 px-4">Transaction Flow</th>
                    <th className="pb-4 px-4 w-32">State</th>
                    <th className="pb-4 pl-4 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    <tr><td colSpan="7" className="py-32 text-center text-[10px] font-bold uppercase tracking-[4px] text-white/10 animate-pulse">Syncing Network Base...</td></tr>
                  ) : (
                    customers.map((client, i) => (
                      <tr 
                        key={client.id}
                        className="border-b border-border hover:bg-brand-muted/5 transition-colors group cursor-pointer"
                      >
                        <td className="py-5 pr-4 font-mono text-[10px] text-muted-40 group-hover:text-brand-crimson transition-colors">
                          VC-{client.id.toString().padStart(4, "0")}
                        </td>
                        <td className="py-5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-brand-surface border border-border flex items-center justify-center font-bold text-[10px] text-muted-40 group-hover:border-brand-neonblue/30 group-hover:text-brand-neonblue transition-all">
                              {client.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <h4 className="text-[13px] font-bold text-main group-hover:text-brand-neonblue transition-colors">{client.name}</h4>
                              <p className="text-[10px] text-muted-40 uppercase tracking-widest mt-0.5">{client.lastPurchase}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border border-border ${
                            client.segment === "VIP" ? "bg-brand-crimson/10 text-brand-crimson border-brand-crimson/20" :
                            client.segment === "REGULAR" ? "bg-brand-neonblue/10 text-brand-neonblue border-brand-neonblue/20" :
                            "bg-brand-surface text-muted"
                          }`}>
                            {client.segment}
                          </span>
                        </td>
                        <td className="py-5 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted group-hover:text-main transition-colors">
                              <Mail size={12} className="opacity-30" /> {client.email}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted group-hover:text-main transition-colors">
                              <Phone size={12} className="opacity-30" /> {client.phone}
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-4">
                          <div className="text-[13px] font-bold text-main">{client.totalSpent}</div>
                          <div className="w-12 h-1 bg-brand-bgbase rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-brand-neonpurple rounded-full" style={{ width: client.segment === "VIP" ? "90%" : "40%" }} />
                          </div>
                        </td>
                        <td className="py-5 px-4">
                          <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-border ${
                            client.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-brand-surface text-muted"
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${client.status === "Active" ? "bg-green-400 animate-pulse" : "bg-muted"}`} />
                            {client.status}
                          </div>
                        </td>
                        <td className="py-5 pl-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button className="p-2 bg-brand-surface border border-border rounded-lg text-muted hover:text-main hover:bg-brand-muted/10 transition-all"><History size={14} /></button>
                            <button className="p-2 bg-brand-surface border border-border rounded-lg text-muted hover:text-brand-crimson hover:bg-brand-muted/10 transition-all"><MoreVertical size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    )
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
