"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Package, 
  Layers, 
  Tag, 
  Filter,
  ArrowUpRight,
  MoreVertical,
  Cpu,
  Monitor,
  HardDrive,
  Database,
  Hash
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      console.error("Catalog Link Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(products.map(p => p.Category?.name).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.Category?.name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (catName) => {
    switch(catName?.toUpperCase()) {
      case 'CPU': return <Cpu size={14} />;
      case 'GPU': return <Layers size={14} />;
      case 'MOTHERBOARD': return <Database size={14} />;
      case 'RAM': return <Hash size={14} />;
      case 'STORAGE': return <HardDrive size={14} />;
      default: return <Tag size={14} />;
    }
  };

  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar title="PRODUCT CATALOG" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10 bg-brand-bgbase text-main">
          
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="relative group w-full md:w-96">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-neonblue transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or SKU identifier..."
                className="w-full bg-brand-surface/80 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm text-main focus:outline-none focus:border-brand-neonblue/30 transition-all font-bold tracking-tight shadow-sm"
              />
            </div>

            <div className="flex gap-4">
              <button className="h-12 px-6 bg-brand-surface border border-border rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[2px] text-muted hover:text-main transition-all">
                <Filter size={16} /> Advanced Filter
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-[2px] transition-all flex items-center gap-2 border ${
                  activeCategory === cat 
                  ? "bg-brand-neonblue/10 border-brand-neonblue/40 text-brand-neonblue shadow-[0_0_15px_rgba(0,119,204,0.1)]" 
                  : "bg-brand-surface border-border text-muted hover:text-main hover:bg-brand-muted/5"
                }`}
              >
                {cat !== "All" && getCategoryIcon(cat)}
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-brand-surface/80 backdrop-blur-xl border border-border rounded-[32px] p-8 relative overflow-hidden group hover:border-brand-neonblue/20 transition-all shadow-sm"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00F2FF]/5 to-transparent pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-brand-neonblue/10 border border-brand-neonblue/20 rounded-2xl text-brand-neonblue">
                      <Package size={24} />
                    </div>
                    <button className="p-2 text-muted hover:text-main transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[10px] font-mono text-muted/40 uppercase tracking-widest">{product.sku}</span>
                       <div className="w-1 h-1 rounded-full bg-border" />
                       <span className="flex items-center gap-1.5 px-2 py-0.5 bg-brand-surface border border-border rounded text-[9px] font-black uppercase tracking-widest text-muted">
                         {getCategoryIcon(product.Category?.name)}
                         {product.Category?.name || 'Uncategorized'}
                       </span>
                    </div>
                    <h3 className="text-xl font-rajdhani font-black tracking-tight text-main mb-1 group-hover:text-brand-neonblue transition-colors capitalize">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-end justify-between border-t border-border pt-6">
                    <div>
                      <p className="text-[10px] text-muted font-black uppercase tracking-[2px] mb-1">Market Value</p>
                      <p className="text-2xl font-rajdhani font-bold text-main tracking-tight">₱{Number(product.price).toLocaleString()}</p>
                    </div>
                    <button className="w-12 h-12 bg-brand-neonblue hover:bg-main hover:text-brand-bgbase text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-brand-neonblue/20 active:scale-95">
                      <ArrowUpRight size={24} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-2 border-border border-t-brand-neonblue rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[4px] text-muted">Syncing Catalog...</p>
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-brand-surface rounded-[32px] border border-dashed border-border">
              <Package size={48} className="text-muted/20 mb-4" />
              <h3 className="text-sm font-black uppercase tracking-[4px] text-muted">No Products Located</h3>
              <p className="text-[10px] text-muted/40 font-bold uppercase mt-1">Adjust filters or refine search query</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
