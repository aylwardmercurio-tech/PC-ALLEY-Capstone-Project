"use client";

import { useEffect, useState, useMemo } from "react";
import Sidebar from "../../../components/Sidebar";
import TopBar from "../../../components/TopBar";
import { PackageCheck, Search, Filter, Download, Plus, RefreshCw, AlertCircle, TrendingUp, Edit, Clock, ShieldAlert, CheckCircle2, FileDown, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "../../../lib/api";
import { useTheme } from "../../../context/ThemeContext";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import RestockRequestModal from "../../../components/restock/RestockRequestModal";
import { exportToExcel } from "../../../lib/excelExport";

// --- Modals ---
// Removed old RestockModal implementation in favor of shared component


const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', sku: '', description: '', category_id: '', price: '', image_url: '' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchCats = async () => {
        try {
          const res = await fetch(apiUrl("/api/categories"), { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
          if(res.ok) setCategories(await res.json());
        } catch(e) {}
      };
      fetchCats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-brand-surface border border-brand-neonblue/30 rounded-2xl p-6 lg:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        <h2 className="text-2xl font-rajdhani font-black uppercase text-main mb-6">Create New Product</h2>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-1">Product Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-brand-bgbase border border-border text-main rounded-lg px-4 py-2 font-bold outline-none focus:border-brand-neonblue" placeholder="e.g. NVIDIA RTX 5090" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-1">SKU Code</label>
              <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-brand-bgbase border border-border text-main rounded-lg px-4 py-2 font-bold outline-none focus:border-brand-neonblue" placeholder="PCA-GPU-..." />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-1">Price (USD)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-brand-bgbase border border-border text-main rounded-lg px-4 py-2 font-bold outline-none focus:border-brand-neonblue" placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-1">Hardware Category</label>
            <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full bg-brand-bgbase border border-border text-main rounded-lg px-4 py-2 font-bold outline-none focus:border-brand-neonblue">
              <option value="">Select Category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 rounded-lg border border-border text-main font-bold uppercase tracking-widest hover:bg-brand-bgbase transition-colors">Cancel</button>
          <button onClick={() => onSave(formData)} className="flex-1 py-3 rounded-lg bg-brand-neonblue text-white font-black uppercase tracking-[2px] shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:scale-[1.02] transition-transform">Save Product</button>
        </div>
      </motion.div>
    </div>
  );
};


const EditProductModal = ({ product, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ name: '', sku: '', category_id: '', price: '' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category_id: product.category_id || '',
        price: product.price || product.lastPurchasePrice || ''
      });
      
      const fetchCats = async () => {
        try {
          const res = await fetch(apiUrl("/api/categories"), { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
          if(res.ok) setCategories(await res.json());
        } catch(e) {}
      };
      fetchCats();
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-brand-surface border border-brand-neonblue/30 rounded-2xl p-6 lg:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        <h2 className="text-2xl font-rajdhani font-black uppercase text-main mb-6">Modify Product Details</h2>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-1">Product Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-brand-bgbase border border-border text-main rounded-lg px-4 py-2 font-bold outline-none focus:border-brand-neonblue" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-1">SKU Code</label>
              <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-brand-bgbase border border-border text-main rounded-lg px-4 py-2 font-bold outline-none focus:border-brand-neonblue" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-1">Price</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-brand-bgbase border border-border text-main rounded-lg px-4 py-2 font-bold outline-none focus:border-brand-neonblue" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-black tracking-widest text-muted mb-1">Hardware Category</label>
            <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full bg-brand-bgbase border border-border text-main rounded-lg px-4 py-2 font-bold outline-none focus:border-brand-neonblue">
              <option value="">Select Category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 rounded-lg border border-border text-main font-bold uppercase tracking-widest hover:bg-brand-bgbase transition-colors">Cancel</button>
          <button onClick={() => onUpdate(formData)} className="flex-1 py-3 rounded-lg bg-brand-neonblue text-white font-black uppercase tracking-[2px] shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:scale-[1.02] transition-transform">Update Registry</button>
        </div>
      </motion.div>
    </div>
  );
};


const HistoryModal = ({ isOpen, onClose, product }) => {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    if (isOpen && product) {
      const fetchHistory = async () => {
        try {
          const res = await fetch(apiUrl(`/api/inventory/${product.id}/history`), { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
          if(res.ok) setHistory(await res.json());
        } catch(e) {}
      };
      fetchHistory();
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-brand-surface border border-border rounded-2xl p-6 lg:p-8 max-w-2xl w-full shadow-2xl relative">
        <h2 className="text-xl font-rajdhani font-black uppercase text-main mb-1">Stock Changes</h2>
        <p className="text-muted font-bold text-sm mb-6 uppercase tracking-widest">{product.name}</p>
        
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-border/50 text-[10px] uppercase tracking-widest text-muted">
                 <th className="py-3 px-2 font-black">Date</th>
                 <th className="py-3 px-2 font-black">Action</th>
                 <th className="py-3 px-2 font-black text-right">Qty</th>
                 <th className="py-3 px-2 font-black text-right">Before → After</th>
                 <th className="py-3 px-2 font-black">User</th>
               </tr>
             </thead>
             <tbody>
               {history.length > 0 ? history.map((log, i) => (
                 <tr key={i} className="border-b border-border/20 text-sm hover:bg-brand-bgbase/50 transition-colors">
                   <td className="py-3 px-2 text-main/80 font-bold">{new Date(log.createdAt).toLocaleDateString()}</td>
                   <td className="py-3 px-2">
                     <span className={`px-2 py-1 rounded text-[9px] uppercase font-black ${log.type === 'RESTOCK' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                       {log.type}
                     </span>
                   </td>
                   <td className={`py-3 px-2 text-right font-black ${log.quantity > 0 ? 'text-green-500' : 'text-orange-500'}`}>{log.quantity > 0 ? `+${log.quantity}` : log.quantity}</td>
                   <td className="py-3 px-2 text-right font-bold text-muted">{log.previous_stock} → <span className="text-main">{log.new_stock}</span></td>
                   <td className="py-3 px-2 text-main/80 font-bold text-xs">{log.User?.name || 'System'}</td>
                 </tr>
               )) : <tr><td colSpan="5" className="py-10 text-center text-muted font-bold uppercase tracking-widest">No movement history found.</td></tr>}
             </tbody>
          </table>
        </div>
        <button onClick={onClose} className="mt-6 w-full py-3 rounded-lg bg-brand-bgbase text-main font-bold uppercase tracking-widest hover:bg-border/20 transition-colors">Close</button>
      </motion.div>
    </div>
  );
};
const DeleteActionModal = ({ product, onClose, onSuccess, user }) => {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAdjust = async () => {
    if (qty <= 0) return toast.error("Quantity must be greater than 0");
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(apiUrl("/api/inventory/adjust-stock"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          product_id: product.id,
          branch_id: product.branch_id,
          quantity: -Math.abs(qty),
          note: note || "Manual stock reduction"
        })
      });
      if (res.ok) {
        toast.success(`Removed ${qty} units from inventory.`);
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.error || "Adjustment failed.");
      }
    } catch (e) {
      toast.error("Telemetry Error.");
    } finally {
      setLoading(false);
    }
  };

  const handlePurge = async () => {
    if (!window.confirm(`ALERT: You are about to PERMANENTLY PURGE "${product.name}" from the entire system registry. This action is irreversible. Continue?`)) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(apiUrl(`/api/inventory/products/${product.id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Product successfully purged from registry.");
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.error || err.message || "Failed to purge product.");
      }
    } catch (e) {
      toast.error("Telemetry Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-brand-surface border border-border/50 rounded-2xl p-8 w-full max-w-md shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-crimson pointer-events-none"><Trash2 size={120} /></div>
        
        <h2 className="text-xl font-black text-main mb-2 uppercase tracking-tighter flex items-center gap-2">
          <Trash2 size={20} className="text-brand-crimson" /> 
          STOCK <span className="text-brand-crimson">REMOVAL</span> & DELETE
        </h2>
        <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-8">Manage inventory for {product.name}</p>

        {/* Action 1: Remove Quantity */}
        <div className="space-y-4 mb-8">
          <div className="p-4 rounded-xl bg-brand-bgbase border border-border/30">
            <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-3">Subtract from current stock</label>
            <div className="flex gap-3">
              <input 
                type="number" 
                value={qty} 
                onChange={e => setQty(e.target.value)} 
                className="flex-1 bg-brand-surface border border-border/50 rounded-lg px-4 py-2.5 text-main font-bold outline-none focus:border-brand-crimson/50 transition-colors" 
              />
              <button 
                onClick={handleAdjust} 
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-brand-crimson/10 text-brand-crimson font-black text-[10px] uppercase tracking-widest border border-brand-crimson/20 hover:bg-brand-crimson hover:text-white transition-all"
              >
                REMOVE
              </button>
            </div>
          </div>
        </div>

        {/* Action 2: Delete Product */}
        <div className="pt-6 border-t border-border/30">
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[2px] mb-4 text-center underline decoration-red-500/30 underline-offset-4">Delete Product Entry</p>
          <button 
            onClick={handlePurge}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-red-600 text-white font-black uppercase tracking-[3px] text-xs hover:bg-red-700 transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] active:scale-[0.98]"
          >
            DELETE FROM SYSTEM
          </button>
        </div>

        <button onClick={onClose} className="w-full mt-6 py-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-main transition-colors">Cancel</button>
      </motion.div>
    </div>
  );
};


export default function StockReportPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [user, setUser] = useState(null);
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  const [activeRestock, setActiveRestock] = useState(null);
  const [activeHistory, setActiveHistory] = useState(null);
  const [activeDelete, setActiveDelete] = useState(null);
  const [activeEdit, setActiveEdit] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [invRes, salesRes] = await Promise.all([
        fetch(apiUrl("/api/inventory"), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(apiUrl("/api/sales/history"), { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if(invRes.ok) setInventory(await invRes.json());
      if(salesRes.ok) setSalesData(await salesRes.json());
    } catch(e) { console.error(e) }
  };

  // Derive computations securely
  const processedData = useMemo(() => {
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const prodSales = {};
    salesData.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if(orderDate >= thirtyDaysAgo && order.OrderItems) {
        order.OrderItems.forEach(item => {
          prodSales[item.product_id] = (prodSales[item.product_id] || 0) + item.quantity;
        });
      }
    });

    return inventory.map(item => {
      const sold = prodSales[item.product_id] || 0;
      const daily = sold / 30;
      const daysRem = daily > 0 ? Math.floor(item.quantity / daily) : 999;
      
      let statusGroup = 'Healthy', statusColor = 'text-green-500', badge = 'bg-green-500/10 border-green-500/20';
      if(sold === 0) { statusGroup = 'Dead Stock'; statusColor = 'text-main/50'; badge = 'bg-brand-bgbase border-border'; }
      else if(daysRem <= 5) { statusGroup = 'Critical'; statusColor = 'text-brand-crimson'; badge = 'bg-red-500/10 border-red-500/20'; }
      else if(daysRem <= 10) { statusGroup = 'Low'; statusColor = 'text-orange-500'; badge = 'bg-orange-500/10 border-orange-500/20'; }

      return {
        id: item.product_id,
        branch_id: item.branch_id,
        name: item.Product?.name || 'Unknown',
        category: item.Product?.Category?.name || 'Uncategorized',
        last_purchase_price: item.Product?.last_purchase_price,
        price: item.Product?.price,
        stock: item.quantity,
        dailySales: daily.toFixed(1),
        daysRemaining: daysRem > 500 ? '∞' : daysRem,
        statusGroup, statusColor, badge
      };
    });
  }, [inventory, salesData]);

  const filteredData = useMemo(() => {
    return processedData.filter(i => {
      const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterStatus === "All" || i.statusGroup === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [processedData, search, filterStatus]);

  // KPIs
  const kpis = {
    total: processedData.length,
    low: processedData.filter(i => i.statusGroup === 'Low' || i.statusGroup === 'Critical').length,
    dead: processedData.filter(i => i.statusGroup === 'Dead Stock').length,
    incoming: 0 // Mock pending feature
  };

  // Legacy handleRestockSubmit removed in favor of approval workflow

  const handleExport = () => {
    const exportData = filteredData.map(i => ({
      'Product Name': i.name,
      'Category': i.category,
      'Current Stock': i.stock,
      'Daily Sales Trend': i.dailySales,
      'Days Remaining': i.daysRemaining,
      'Status': i.statusGroup
    }));
    
    const exportOptions = {
      title: 'PC ALLEY - INVENTORY INTELLIGENCE REPORT',
      subtitle: `Target Branch: All Branches | Filter: ${filterStatus}`,
      summary: {
        'Total Unique SKUs': kpis.total,
        'Stock Alert Count': kpis.low,
        'Dead Stock Items': kpis.dead,
        'Report Accuracy': 'High (Live System Data)'
      }
    };

    try {
      exportToExcel(exportData, `PCA_Stock_Report`, 'Inventory', exportOptions);
      toast.success("Excel Intelligence Report Generated");
    } catch (error) {
      toast.error("Export Protocol Failed");
    }
  };

  const handleSaveProduct = async (formData) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(apiUrl("/api/inventory/products"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Product Registry Updated: Matrix synchronized.");
        setIsAddingProduct(false);
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || "Registry Conflict.");
      }
    } catch (e) {
      toast.error("Telemetry Error: Connection severed.");
    }
  };

  const handleUpdateProduct = async (payload) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(apiUrl(`/api/products/${activeEdit.id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Product Registry Updated: Matrix synchronized.");
        setActiveEdit(null);
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || "Update Conflict.");
      }
    } catch (e) {
      toast.error("Telemetry Error: Connection severed.");
    }
  };

  const handleDeleteProduct = (product) => {
    setActiveDelete(product);
  };

  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-all duration-300">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Toaster position="top-right" />
        <TopBar title="MANAGE STOCK" />
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 text-main">
          <div className="responsive-container">
            
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h2 className="text-[10px] font-black tracking-[4px] uppercase text-main/40 mb-2">Stock Status</h2>
                <h1 className="text-2xl font-rajdhani font-black uppercase mb-0">
                  INVENTORY <span className="text-brand-neonblue">SUMMARY</span>
                </h1>
              </div>
             <div className="flex gap-2">
               {['All', 'Critical', 'Low', 'Healthy', 'Dead Stock'].map(status => (
                 <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${
                    filterStatus === status 
                    ? 'bg-brand-neonblue/10 border-brand-neonblue/40 text-brand-neonblue' 
                    : 'bg-brand-surface border-border text-muted hover:text-main'
                  }`}
                 >
                   {status}
                 </button>
               ))}
             </div>
          </div>

          {/* 🔷 TOP SECTION — KPI STRIP */}
          <div className="responsive-grid mb-8">
             <div className="glass-card p-4 md:p-6 flex items-center justify-between">
               <div><p className="text-[10px] uppercase font-black tracking-widest text-muted mb-1">Total Products</p><h3 className="text-2xl font-black text-main">{kpis.total}</h3></div>
               <div className="w-10 h-10 rounded-xl bg-brand-neonblue/10 flex items-center justify-center text-brand-neonblue"><PackageCheck size={20} /></div>
             </div>
             <div className="glass-card p-4 md:p-6 flex items-center justify-between border-l-2 border-orange-500">
               <div><p className="text-[10px] uppercase font-black tracking-widest text-muted mb-1">Low / Critical</p><h3 className="text-2xl font-black text-orange-500">{kpis.low}</h3></div>
               <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500"><TrendingUp size={20} /></div>
             </div>
             <div className="glass-card p-4 md:p-6 flex items-center justify-between border-l-2 border-border">
               <div><p className="text-[10px] uppercase font-black tracking-widest text-muted mb-1">Dead Stock</p><h3 className="text-2xl font-black text-main">{kpis.dead}</h3></div>
               <div className="w-10 h-10 rounded-xl bg-brand-bgbase flex items-center justify-center text-muted"><AlertCircle size={20} /></div>
             </div>
             <div className="glass-card p-4 md:p-6 flex items-center justify-between">
               <div><p className="text-[10px] uppercase font-black tracking-widest text-muted mb-1">On The Way</p><h3 className="text-2xl font-black text-main">{kpis.incoming}</h3></div>
               <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500"><Clock size={20} /></div>
             </div>
          </div>

          {/* 🔷 FILTER & ACTION BAR */}
          <div className="bg-brand-surface border border-border/50 rounded-xl p-4 mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
             <div className="flex w-full lg:w-auto gap-4">
               <div className="relative flex-1 lg:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                 <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-brand-bgbase border border-border/50 text-main text-xs font-bold rounded-lg pl-9 pr-4 py-3 outline-none focus:border-brand-neonblue transition-colors" />
               </div>
             </div>
              <div className="flex w-full lg:w-auto gap-3">
                <button 
                  onClick={handleExport}
                  className="bg-brand-bgbase border border-border text-muted hover:text-main px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-brand-surface"
                >
                  <FileDown size={16} className="text-brand-neonblue" /> Export Excel
                </button>
                {(user?.role !== 'employee' && user?.role !== 'staff') && (
                  <button onClick={() => setIsAddingProduct(true)} className="btn-premium flex items-center gap-2 py-2.5 px-5 rounded-lg shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:scale-105 transition-transform"><Plus size={16} /> Add Product</button>
                )}
              </div>
          </div>

          {/* 🔷 MAIN TABLE */}
          <div className="bg-brand-surface border border-border/50 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
             <div className="overflow-x-auto custom-scrollbar">
               <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
                  <thead>
                    <tr className="bg-brand-bgbase/50 text-[10px] uppercase font-black tracking-widest text-muted border-b border-border/50">
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-4 text-right">Current Stock</th>
                      <th className="py-4 px-4 text-center">Daily Trend</th>
                      <th className="py-4 px-4 text-center">Runway</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, idx) => (
                      <motion.tr initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={idx} className="border-b border-border/20 text-sm hover:bg-brand-bgbase/30 transition-colors group">
                        <td className="py-4 px-6 font-bold text-main">{item.name}</td>
                        <td className="py-4 px-6 text-xs text-muted/80 font-bold uppercase tracking-wider">{item.category}</td>
                        <td className="py-4 px-4 text-right font-black text-main text-lg">{item.stock}</td>
                        <td className="py-4 px-4 text-center text-xs font-bold text-muted">{item.dailySales}/day</td>
                        <td className={`py-4 px-4 text-center font-black ${item.statusColor}`}>
                          {item.daysRemaining} {item.daysRemaining !== '∞' && 'days'}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border rounded w-full inline-block ${item.badge} ${item.statusColor}`}>
                            {item.statusGroup}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                           <div className="flex items-center justify-end gap-2 transition-opacity">
                             {(user?.role !== 'employee' && user?.role !== 'staff') && (
                               <button onClick={() => setActiveEdit(item)} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted hover:text-main hover:bg-border/20 transition-all" title="Edit"><Edit size={14} /></button>
                             )}
                             <button onClick={() => setActiveHistory(item)} className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted hover:text-main hover:bg-border/20 transition-all" title="History"><Clock size={14} /></button>
                             {user?.role === 'super_admin' && (
                               <button 
                                 onClick={() => handleDeleteProduct(item)}
                                 className="w-8 h-8 rounded-lg border border-red-500 bg-red-500/10 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-600 transition-all" 
                                 title="Delete"
                               >
                                 <Trash2 size={14} />
                               </button>
                             )}
                             {(user?.role !== 'employee' && user?.role !== 'staff') && (
                               <button onClick={() => setActiveRestock(item)} className="px-4 py-1.5 rounded-lg bg-brand-neonblue/10 text-brand-neonblue font-black text-[10px] uppercase tracking-widest hover:bg-brand-neonblue hover:text-white transition-colors border border-brand-neonblue/20 flex items-center gap-2">
                                 Restock <TrendingUp size={12} />
                               </button>
                             )}
                           </div>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr><td colSpan="7" className="py-20 text-center text-muted font-bold tracking-widest uppercase text-xs">No inventory records located.</td></tr>
                    )}
                  </tbody>
               </table>
             </div>
          </div>
          </div>
        </div>
      </main>

      {/* Render Modals */}
      <AnimatePresence>
        {activeRestock && (
          <RestockRequestModal 
            product={activeRestock} 
            onClose={() => setActiveRestock(null)} 
            onSuccess={fetchData} 
          />
        )}
        {activeHistory && <HistoryModal isOpen={true} onClose={() => setActiveHistory(null)} product={activeHistory} />}
        {activeEdit && (
          <EditProductModal 
            isOpen={true} 
            product={activeEdit} 
            onClose={() => setActiveEdit(null)} 
            onUpdate={handleUpdateProduct} 
          />
        )}
        {activeDelete && (
          <DeleteActionModal 
            product={activeDelete} 
            onClose={() => setActiveDelete(null)} 
            onSuccess={fetchData} 
            user={user}
          />
        )}
        {isAddingProduct && <AddProductModal isOpen={true} onClose={() => setIsAddingProduct(false)} onSave={handleSaveProduct} />}
      </AnimatePresence>
    </div>
  );
}
