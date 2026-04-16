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
  Cpu,
  Monitor,
  HardDrive,
  Database,
  Hash,
  ChevronRight,
  Zap
} from "lucide-react";
import { apiUrl } from "../../lib/api";

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
      const res = await fetch(apiUrl("/api/products"), {
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

  // Group products by category
  const grouped = filteredProducts.reduce((acc, product) => {
    const cat = product.Category?.name || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  const getCategoryIcon = (catName) => {
    switch(catName?.toUpperCase()) {
      case 'CPU': return <Cpu size={14} />;
      case 'GPU': return <Layers size={14} />;
      case 'MOTHERBOARD': return <Database size={14} />;
      case 'RAM': return <Hash size={14} />;
      case 'STORAGE': return <HardDrive size={14} />;
      case 'PERIPHERALS': return <Monitor size={14} />;
      case 'POWER SUPPLY': return <Zap size={14} />;
      default: return <Tag size={14} />;
    }
  };

  const getCategoryColor = (catName) => {
    switch(catName?.toUpperCase()) {
      case 'GPU': return 'text-brand-crimson border-brand-crimson/20 bg-brand-crimson/10';
      case 'CPU': return 'text-brand-neonblue border-brand-neonblue/20 bg-brand-neonblue/10';
      case 'MOTHERBOARD': return 'text-purple-400 border-purple-400/20 bg-purple-400/10';
      case 'RAM': return 'text-green-400 border-green-400/20 bg-green-400/10';
      case 'STORAGE': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
      case 'PERIPHERALS': return 'text-pink-400 border-pink-400/20 bg-pink-400/10';
      case 'POWER SUPPLY': return 'text-orange-400 border-orange-400/20 bg-orange-400/10';
      default: return 'text-muted border-border bg-brand-surface';
    }
  };

  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar title="PRODUCT CATALOG" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10 bg-brand-bgbase text-main">
          
          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
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
          <div className="flex gap-3 mb-10 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-[2px] transition-all flex items-center gap-2 border ${
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

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-2 border-border border-t-brand-neonblue rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[4px] text-muted">Syncing Catalog...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-brand-surface rounded-[32px] border border-dashed border-border">
              <Package size={48} className="text-muted/20 mb-4" />
              <h3 className="text-sm font-black uppercase tracking-[4px] text-muted">No Products Located</h3>
              <p className="text-[10px] text-muted/40 font-bold uppercase mt-1">Adjust filters or refine search query</p>
            </div>
          )}

          {/* Categorized List */}
          {!loading && Object.entries(grouped).map(([catName, items], groupIdx) => (
            <motion.div
              key={catName}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.07 }}
              className="mb-8"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-3 px-1">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${getCategoryColor(catName)}`}>
                  {getCategoryIcon(catName)}
                  {catName}
                </div>
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] font-black text-muted/40 uppercase tracking-widest">{items.length} item{items.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Product Rows */}
              <div className="bg-brand-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                {items.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: groupIdx * 0.07 + idx * 0.04 }}
                    className={`flex items-center gap-4 px-6 py-4 hover:bg-brand-muted/5 transition-colors group cursor-pointer ${
                      idx !== items.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center border ${getCategoryColor(catName)}`}>
                      {getCategoryIcon(catName)}
                    </div>

                    {/* SKU */}
                    <span className="font-mono text-[10px] text-muted/40 uppercase tracking-widest w-32 flex-shrink-0 hidden md:block">
                      {product.sku}
                    </span>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-rajdhani font-bold text-main group-hover:text-brand-neonblue transition-colors truncate capitalize">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-muted/40 uppercase tracking-widest font-mono md:hidden">{product.sku}</p>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-[9px] text-muted font-black uppercase tracking-[2px] mb-0.5">Price</p>
                      <p className="text-sm font-rajdhani font-bold text-main">₱{Number(product.price).toLocaleString()}</p>
                    </div>

                    {/* Action */}
                    <button className="w-9 h-9 flex-shrink-0 bg-brand-bgbase border border-border rounded-xl flex items-center justify-center text-muted hover:bg-brand-neonblue hover:text-main hover:border-brand-neonblue transition-all active:scale-95 ml-2">
                      <ChevronRight size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

        </div>
      </main>
    </div>
  );
}
