"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  ChevronDown,
  Activity,
  ArrowRight
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [adjustValue, setAdjustValue] = useState(0);
  const [adjustThreshold, setAdjustThreshold] = useState(5);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    if (userData?.role === 'super_admin') {
      fetchBranches();
    }
    fetchInventory();
  }, [selectedBranch]);

  const fetchBranches = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/branches", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setBranches(data);
    } catch (err) {
      console.error("Branch Link Failure:", err);
    }
  };

  const fetchInventory = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      let url = "http://localhost:5000/api/inventory";
      if (selectedBranch) url += `?branch_id=${selectedBranch}`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setInventory(data);
    } catch (err) {
      console.error("Matrix Sync Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/inventory/stock", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: editingItem.Product.id,
          branch_id: editingItem.branch_id,
          quantity: parseInt(adjustValue),
          low_stock_threshold: parseInt(adjustThreshold)
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchInventory();
      }
    } catch (err) {
      console.error("Pulse Modulation Error:", err);
    }
  };

  const openAdjustModal = (item) => {
    setEditingItem(item);
    setAdjustValue(item.quantity);
    setAdjustThreshold(item.low_stock_threshold || 5);
    setIsModalOpen(true);
  };

  const filteredInventory = inventory.filter(item => 
    item.Product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.Product?.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalItems: inventory.reduce((acc, curr) => acc + curr.quantity, 0),
    criticalNodes: inventory.filter(p => p.quantity <= p.low_stock_threshold).length,
    valuation: inventory.reduce((acc, curr) => acc + (curr.quantity * (curr.Product?.price || 0)), 0),
    categories: [...new Set(inventory.map(p => p.Product?.Category?.name).filter(Boolean))].length
  };

  const barData = {
    labels: [...new Set(inventory.map(p => p.Product?.Category?.name).filter(Boolean))],
    datasets: [
      {
        label: 'Stock Level',
        data: [...new Set(inventory.map(p => p.Product?.Category?.name).filter(Boolean))].map(cat => 
           inventory.filter(p => p.Product?.Category?.name === cat).reduce((a, b) => a + b.quantity, 0)
        ),
        backgroundColor: 'rgba(0, 242, 255, 0.2)',
        borderColor: '#00F2FF',
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(0, 242, 255, 0.4)',
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: 'rgba(var(--text-main-rgb), 0.05)' }, ticks: { color: 'rgba(var(--text-main-rgb), 0.5)' } },
      x: { grid: { display: false }, ticks: { color: 'rgba(var(--text-main-rgb), 0.5)' } }
    }
  };

  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar title="INVENTORY MANAGEMENT" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10 bg-brand-bgbase text-main">
          
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 relative overflow-hidden group">
               <h3 className="text-[10px] font-black tracking-[2px] uppercase text-muted mb-3">Total Inventory</h3>
               <div className="text-3xl font-rajdhani font-bold text-main tracking-tight mb-2">{stats.totalItems.toLocaleString()}</div>
               <p className="text-[10px] text-muted/40 uppercase font-bold tracking-widest">Active Units in Core</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 relative overflow-hidden group">
               <h3 className="text-[10px] font-black tracking-[2px] uppercase text-white/40 mb-3 text-brand-crimson">Critical Nodes</h3>
               <div className="text-3xl font-rajdhani font-bold text-main tracking-tight mb-2">{stats.criticalNodes}</div>
               <p className="text-[10px] text-muted/40 uppercase font-bold tracking-widest">Requiring Stock Sync</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 relative overflow-hidden group">
               <h3 className="text-[10px] font-black tracking-[2px] uppercase text-white/40 mb-3 text-brand-neonpurple">Classifications</h3>
               <div className="text-3xl font-rajdhani font-bold text-main tracking-tight mb-2">{stats.categories}</div>
               <p className="text-[10px] text-muted/40 uppercase font-bold tracking-widest">Active Hardware Sectors</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 relative overflow-hidden group">
               <h3 className="text-[10px] font-black tracking-[2px] uppercase text-muted mb-3">Asset Valuation</h3>
               <div className="text-3xl font-rajdhani font-bold text-main tracking-tight mb-2">₱{(stats.valuation / 1000000).toFixed(1)}M</div>
               <p className="text-[10px] text-muted/40 uppercase font-bold tracking-widest">Total Sector Capital</p>
            </motion.div>
          </div>

          {/* Admin Controls */}
          {user?.role === 'super_admin' && (
            <div className="flex gap-4 mb-8">
               <div className="relative group">
                   <select 
                     value={selectedBranch}
                     onChange={(e) => setSelectedBranch(e.target.value)}
                     className="appearance-none bg-brand-surface border border-border rounded-xl py-2.5 pl-4 pr-10 text-xs text-main focus:outline-none focus:border-brand-neonblue/30 transition-all font-bold shadow-sm"
                   >
                     <option value="" className="bg-brand-surface">All Logical Sectors</option>
                     {branches.map(b => (
                       <option key={b.id} value={b.id} className="bg-brand-surface">{b.name}</option>
                     ))}
                   </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
               </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sector Matrix Chart */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="lg:col-span-2 bg-brand-surface border border-border rounded-2xl p-8 lg:p-10 flex flex-col shadow-sm"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-brand-neonblue/20 rounded-full" />
                  <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">Sector Matrix</h3>
                </div>
              </div>
              <div className="h-64 w-full">
                {stats.categories > 0 ? (
                  <Bar data={barData} options={barOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-[10px] font-black uppercase text-muted/20 tracking-[4px]">No Data Stream</div>
                )}
              </div>
            </motion.div>

            {/* Restock Priority */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-brand-surface/80 border-border rounded-2xl p-8 lg:p-10 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-brand-crimson/50 rounded-full" />
                  <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">Priority Sync</h3>
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto no-scrollbar flex-1">
                {inventory.filter(i => i.quantity <= i.low_stock_threshold).slice(0, 4).map((item, i) => (
                  <div key={i} onClick={() => openAdjustModal(item)} className="p-4 bg-brand-bgbase border border-border rounded-2xl group hover:border-brand-crimson/30 transition-all cursor-pointer shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-[11px] font-bold text-muted group-hover:text-main transition-colors capitalize">{item.Product?.name}</h4>
                       <span className="text-[8px] font-black uppercase tracking-widest text-brand-crimson">LOW PULSE</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-[13px] font-black text-main">{item.quantity} Units</p>
                        <div className="w-16 h-1 bg-brand-surface rounded-full overflow-hidden">
                          <div className="h-full bg-brand-crimson" style={{ width: `${(item.quantity / (item.low_stock_threshold || 5)) * 100}%` }} />
                       </div>
                    </div>
                  </div>
                ))}
                 {stats.criticalNodes === 0 && (
                    <div className="h-full flex items-center justify-center text-center opacity-40">
                      <p className="text-[10px] font-black uppercase tracking-[2px] text-muted">All sectors stable</p>
                    </div>
                 )}
              </div>
            </motion.div>
          </div>

          {/* Matrix Registry */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-brand-surface/80 border-border rounded-2xl p-6 lg:p-8">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-1 h-4 bg-muted/20 rounded-full" />
                 <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">Branch Registry</h3>
               </div>
               <div className="relative group max-w-sm flex-1 ml-10">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-neonblue transition-colors" />
                 <input
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Query Registry Module..."
                   className="w-full bg-brand-bgbase border border-border rounded-xl py-2.5 pl-11 pr-4 text-xs text-main focus:outline-none focus:border-brand-neonblue/30 transition-all"
                 />
               </div>
            </div>
            <div className="overflow-x-auto">
               {loading ? (
                 <div className="py-20 flex flex-col items-center gap-4 opacity-40">
                   <Activity size={32} className="animate-pulse text-muted" />
                   <p className="text-[10px] font-black uppercase tracking-[4px] text-muted">Syncing Matrix...</p>
                 </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-muted border-b border-border">
                      <th className="pb-4 pr-4">Node Hash</th>
                      <th className="pb-4 px-4">Designation</th>
                      <th className="pb-4 px-4">Sector</th>
                      <th className="pb-4 px-4">Classification</th>
                      <th className="pb-4 px-4">Pulse (Stock)</th>
                      <th className="pb-4 pl-4 text-right">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredInventory.map((item, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 pr-4 font-mono text-[10px] text-muted-40 group-hover:text-brand-neonblue transition-colors uppercase">{item.Product?.sku}</td>
                        <td className="py-4 px-4">
                          <h4 className="text-[13px] font-bold text-main group-hover:text-brand-neonblue transition-colors capitalize">{item.Product?.name}</h4>
                        </td>
                        <td className="py-4 px-4 border-l border-white/5">
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted opacity-50">{item.Branch?.name}</span>
                        </td>
                        <td className="py-4 px-4">
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-border bg-brand-surface text-muted">{item.Product?.Category?.name || 'GENERIC'}</span>
                        </td>
                        <td className="py-4 px-4">
                           <div className="flex items-center gap-2">
                             <span className={`text-sm font-black ${item.quantity <= item.low_stock_threshold ? 'text-brand-crimson' : 'text-main'}`}>{item.quantity}</span>
                             {item.quantity <= item.low_stock_threshold && <AlertTriangle size={12} className="text-brand-crimson animate-pulse" />}
                           </div>
                        </td>
                        <td className="py-4 pl-4 text-right">
                           <button 
                             onClick={() => openAdjustModal(item)}
                             className="px-4 py-1.5 bg-brand-surface border border-border rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-brand-neonblue hover:text-white transition-all shadow-sm"
                           >
                             Modulate Pulse
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Stock Modulation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-brand-surface border border-border rounded-[32px] p-10 relative z-10 overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neonblue/10 blur-[60px] pointer-events-none" />
               <div className="mb-10">
                 <h3 className="text-xl font-rajdhani font-black tracking-[4px] uppercase text-main mb-2">Pulse Modulation</h3>
                 <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Adjust stock levels for {editingItem?.Product.name}</p>
               </div>
               <form onSubmit={handleUpdateStock} className="space-y-8">
                  <div className="space-y-4">
                     <div>
                        <label className="text-[9px] font-black uppercase tracking-[3px] text-white/20 ml-2">New Quantity</label>
                        <div className="flex items-center gap-4 mt-2">
                           <input 
                             type="number" 
                             required
                             value={adjustValue}
                             onChange={(e) => setAdjustValue(e.target.value)}
                             className="flex-1 bg-brand-bgbase border border-border rounded-2xl py-4 px-6 text-xl font-rajdhani font-bold text-brand-neonblue focus:outline-none focus:border-brand-neonblue transition-all"
                           />
                           <div className="px-5 py-4 bg-brand-surface border border-border rounded-2xl flex flex-col items-center">
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Current</span>
                              <span className="text-sm font-black text-white">{editingItem?.quantity}</span>
                           </div>
                        </div>
                     </div>
                     <div>
                        <label className="text-[9px] font-black uppercase tracking-[3px] text-muted ml-2">Critical Threshold</label>
                        <input 
                          type="number" 
                          required
                          value={adjustThreshold}
                          onChange={(e) => setAdjustThreshold(e.target.value)}
                          className="w-full mt-2 bg-brand-bgbase border border-border rounded-2xl py-4 px-6 text-sm text-main focus:outline-none focus:border-brand-crimson/50 transition-all font-bold"
                        />
                     </div>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-[3px] text-muted hover:text-main transition-all">Abort</button>
                    <button type="submit" className="flex-[2] py-4 bg-brand-neonblue rounded-2xl text-[10px] font-black tracking-[3px] text-brand-navy shadow-lg shadow-brand-neonblue/20 transition-all active:scale-95">Apply Modulation</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
