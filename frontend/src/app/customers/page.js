"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import StatCard from "../../components/StatCard";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  History, 
  TrendingUp, 
  CreditCard, 
  Layers, 
  Activity, 
  ArrowUpRight,
  X,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSegment, setFilterSegment] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    segment: "REGULAR"
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    
    // Simulating database sync
    setTimeout(() => {
      setCustomers([
        { id: 1, name: "Alexander Pierce", email: "alex@gaming-hub.ph", phone: "+63 917 123 4567", category: "Retail", totalSpent: "₱150,200", status: "Active", lastPurchase: "2h ago", segment: "CORE" },
        { id: 2, name: "Maria Clara", email: "mclara@heritage.ph", phone: "+63 920 888 1234", category: "Regular", totalSpent: "₱12,500", status: "Active", lastPurchase: "1d ago", segment: "REGULAR" },
        { id: 3, name: "Renato Cruz", email: "rcruz@cyber.dev", phone: "+63 944 555 6789", category: "Bulk", totalSpent: "₱1,240,000", status: "Active", lastPurchase: "5m ago", segment: "CORPORATE" },
        { id: 4, name: "Elena Gilbert", email: "eg@mystic.com", phone: "+63 905 111 2222", category: "Regular", totalSpent: "₱8,400", status: "Inactive", lastPurchase: "3mo ago", segment: "INACTIVE" },
        { id: 5, name: "Stefan Salvatore", email: "ss@daylight.org", phone: "+63 911 333 4444", category: "Retail", totalSpent: "₱210,000", status: "Active", lastPurchase: "12h ago", segment: "CORE" },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const categoryDistribution = [
    { name: "Gaming Desktops", count: 42, percentage: 85, color: "#D72638" },
    { name: "Laptops & Notebooks", count: 128, percentage: 65, color: "#0EA5E9" },
    { name: "PC Components", count: 842, percentage: 95, color: "#F59E0B" },
    { name: "Accessories", count: 428, percentage: 40, color: "#8B5CF6" },
  ];

  const paymentMethods = [
    { method: "GCash Wallet", count: 1242, percentage: 80, icon: Activity },
    { method: "Bank Transfer", count: 420, percentage: 45, icon: TrendingUp },
    { method: "Cash on Counter", count: 812, percentage: 60, icon: CreditCard },
    { method: "Credit / Debit", count: 112, percentage: 20, icon: Layers },
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = filterSegment === "ALL" || customer.segment === filterSegment;
    return matchesSearch && matchesSegment;
  });

  const handleAddCustomer = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error("Required fields missing");
      return;
    }

    const newCustomer = {
      id: customers.length + 1,
      ...formData,
      category: formData.segment === "CORPORATE" ? "Bulk" : "Retail",
      totalSpent: "₱0",
      status: "Active",
      lastPurchase: "Just now"
    };

    setCustomers([newCustomer, ...customers]);
    setIsModalOpen(false);
    setFormData({ name: "", email: "", phone: "", segment: "REGULAR" });
    toast.success("Customer Profile Initialized");
  };

  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-all duration-500">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar title="CUSTOMER NETWORK HUB" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10 bg-brand-bgbase text-main">
          <div className="max-w-[1600px] mx-auto w-full">
          
          {/* Identity Header */}
          <div className="mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h1 className="text-4xl font-rajdhani font-black tracking-tight text-main uppercase">
                  Customer <span className="text-brand-crimson">Registry</span>
                </h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-premium h-12 px-8 flex items-center gap-2">
                  <Plus size={18} />
                  Add New Customer
                </button>
              </div>
          </div>



          {/* Client Ledger Table */}
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="glass-card p-10 shadow-[0_8px_40px_rgba(0,0,0,0.02)]"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
              <div className="relative group w-full md:max-w-lg">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-neonblue transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search for a customer name or email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-brand-surface border border-border rounded-xl py-4 pl-14 pr-6 text-xs text-main focus:outline-none focus:border-brand-neonblue/20 transition-all font-bold placeholder:opacity-40 shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                  <select 
                    value={filterSegment}
                    onChange={(e) => setFilterSegment(e.target.value)}
                    className="btn-ghost h-12 bg-transparent border-none text-[10px] font-black uppercase tracking-[2px] cursor-pointer outline-none px-4"
                  >
                    <option value="ALL">All Segments</option>
                    <option value="CORE">Core</option>
                    <option value="CORPORATE">Corporate</option>
                    <option value="REGULAR">Regular</option>
                  </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[3px] text-muted/30 border-b border-border/10">
                    <th className="pb-8 pr-4 w-32">Customer ID</th>
                    <th className="pb-8 px-4">Full Name</th>
                    <th className="pb-8 px-4">Designation</th>
                    <th className="pb-8 px-4">Contact Info</th>
                    <th className="pb-8 px-4">Total Value</th>
                    <th className="pb-8 px-4 w-40">Current State</th>
                    <th className="pb-8 pl-4 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    <tr><td colSpan="7" className="py-40 text-center text-[10px] font-black uppercase tracking-[6px] text-muted animate-pulse">Syncing Customer Database...</td></tr>
                  ) : (
                    filteredCustomers.map((client, i) => (
                      <motion.tr 
                        key={client.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.01)" }}
                        className="border-b border-main/5 transition-all group"
                      >
                        <td className="py-8 pr-4 font-mono text-[10px] text-muted-40 group-hover:text-brand-neonblue transition-colors uppercase tracking-[2px]">
                          CU-{client.id.toString().padStart(4, "0")}
                        </td>
                        <td className="py-8 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-brand-surface border border-border/50 flex items-center justify-center font-black text-[12px] text-muted group-hover:border-brand-neonblue/20 group-hover:text-brand-neonblue transition-all shadow-sm">
                              {client.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <h4 className="text-[14px] font-black text-main group-hover:text-brand-neonblue transition-colors tracking-tight">{client.name}</h4>
                              <p className="text-[10px] text-muted font-bold uppercase tracking-[2px] mt-1 opacity-40">{client.lastPurchase}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-4">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[2px] border transition-all ${
                            client.segment === "CORPORATE" ? "bg-brand-crimson/5 text-brand-crimson border-brand-crimson/10" :
                            client.segment === "CORE" ? "bg-brand-neonblue/5 text-brand-neonblue border-brand-neonblue/10" :
                            "bg-brand-bgbase text-muted/60 border-border/20"
                          }`}>
                            {client.segment}
                          </span>
                        </td>
                        <td className="py-8 px-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-muted/60 group-hover:text-main transition-colors">
                              <Mail size={12} className="opacity-30" /> {client.email}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-muted/60 group-hover:text-main transition-colors">
                              <Phone size={12} className="opacity-30" /> {client.phone}
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-4">
                          <div className="text-[16px] font-black text-main">{client.totalSpent}</div>
                        </td>
                        <td className="py-8 px-4">
                          <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[2px] border transition-all ${
                            client.status === "Active" ? "bg-green-500/5 text-green-500 border-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.05)]" : "bg-brand-bgbase text-muted/40 border-border/10"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${client.status === "Active" ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-muted/40"}`} />
                            {client.status}
                          </div>
                        </td>
                        <td className="py-8 pl-4 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-3 bg-brand-bgbase border border-border/20 rounded-xl text-muted hover:text-brand-crimson hover:border-brand-crimson/20 transition-all"><History size={16} /></button>
                            <button className="p-3 bg-brand-bgbase border border-border/20 rounded-xl text-muted hover:text-main hover:border-main/20 transition-all"><MoreVertical size={16} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          </div>
        </div>
      </main>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-bgbase/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-xl p-10 relative z-10 border border-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-rajdhani font-black tracking-tight text-main uppercase">
                    Add <span className="text-brand-neonblue">New Customer</span>
                  </h2>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-[2px] mt-1 opacity-40">Save customer details</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-brand-surface rounded-xl transition-colors text-muted hover:text-main"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddCustomer} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-muted ml-1">Full Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                    className="w-full bg-brand-surface border border-border/50 rounded-xl py-4 px-6 text-sm text-main focus:outline-none focus:border-brand-neonblue/40 transition-all font-bold placeholder:opacity-20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[2px] text-muted ml-1">Email Address</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="customer@email.com"
                      className="w-full bg-brand-surface border border-border/50 rounded-xl py-4 px-6 text-sm text-main focus:outline-none focus:border-brand-neonblue/40 transition-all font-bold placeholder:opacity-20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[2px] text-muted ml-1">Phone Number</label>
                    <input 
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+63 9XX XXX XXXX"
                      className="w-full bg-brand-surface border border-border/50 rounded-xl py-4 px-6 text-sm text-main focus:outline-none focus:border-brand-neonblue/40 transition-all font-bold placeholder:opacity-20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-muted ml-1">Customer Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["REGULAR", "CORE", "CORPORATE"].map((seg) => (
                      <button
                        key={seg}
                        type="button"
                        onClick={() => setFormData({...formData, segment: seg})}
                        className={`py-3 rounded-xl text-[9px] font-black tracking-[2px] border transition-all ${
                          formData.segment === seg 
                            ? "bg-brand-neonblue/10 border-brand-neonblue/30 text-brand-neonblue shadow-[0_0_20px_rgba(14,165,233,0.1)]" 
                            : "bg-brand-surface border-border/50 text-muted hover:border-border hover:text-main"
                        }`}
                      >
                        {seg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="btn-premium w-full h-14 text-[12px] tracking-[4px] shadow-[0_10px_30px_rgba(215,38,56,0.1)]">
                    Save Customer Info
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
