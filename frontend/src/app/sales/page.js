"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { useLayout } from "../../context/LayoutContext";
import {
  ShoppingCart,
  Search,
  Trash2,
  CreditCard,
  Banknote,
  Scan,
  User,
  CheckCircle2,
  Package,
  Barcode,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "../../lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function SalesPage() {
  const { isMobile } = useLayout();
  const [cart, setCart] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [proofFile, setProofFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(apiUrl("/api/inventory"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setInventory(data);
    } catch (err) {
      toast.error("Network link interrupted");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(inventory.map(i => i.Product?.Category?.name).filter(Boolean))];

  const filteredInventory = activeCategory === "All" 
    ? inventory 
    : inventory.filter(item => item.Product?.Category?.name === activeCategory);

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.product_id);
    if (existing) {
      if (existing.quantity >= item.quantity) {
        toast.error("Stock threshold reached");
        return;
      }
      setCart(cart.map((c) => (c.id === item.product_id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      if (item.quantity <= 0) {
        toast.error("Out of stock");
        return;
      }
      setCart([...cart, { 
        id: item.product_id, 
        name: item.Product.name, 
        price: item.Product.price, 
        sku: item.Product.sku, 
        quantity: 1,
        maxStock: item.quantity
      }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        if (newQty > item.maxStock) {
          toast.error("Insufficient stock");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.12;
  const grandTotal = total + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setProcessing(true);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    
    try {
      const res = await fetch(apiUrl("/api/sales"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          branch_id: user.branch_id,
          customer_name: "Walk-in Customer",
          payment_method: paymentMethod,
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      if (res.ok) {
        setSuccess(true);
        toast.success("Transaction Secrued");
        fetchInventory();
        setTimeout(() => {
          setSuccess(false);
          setCart([]);
        }, 4000);
      } else {
        const err = await res.json();
        toast.error(err.message || "Checkout Protocol Failed");
      }
    } catch (err) {
      toast.error("Network synchronization error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar title="SALES TERMINAL" />

        <div className="flex-1 overflow-y-auto md:overflow-hidden p-4 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8 bg-brand-bgbase text-main custom-scrollbar">
          {/* Main Selection Area */}
          <div className="flex-[2] flex flex-col space-y-6 md:overflow-hidden lg:mb-0">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="w-full md:flex-1 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-neonblue transition-colors">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Scan barcode or manual search..."
                  className="w-full bg-brand-surface border border-border rounded-2xl py-4 pl-12 pr-4 text-sm text-main focus:outline-none focus:border-brand-neonblue/30 transition-all font-bold tracking-tight shadow-sm"
                />
              </div>

            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-full border text-[10px] font-black uppercase tracking-[2px] transition-all shrink-0 ${
                    activeCategory === cat 
                      ? "bg-brand-neonblue/10 border-brand-neonblue/30 text-brand-neonblue shadow-sm" 
                      : "bg-brand-surface border-border text-muted hover:text-main"
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                {loading ? (
                  <div className="col-span-full py-20 flex flex-col items-center opacity-40">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-[4px]">Syncing Matrix...</p>
                  </div>
                ) : (
                <AnimatePresence mode="popLayout">
                  {filteredInventory.map((item, i) => (
                    <motion.div
                      key={item.product_id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(item)}
                      className="group bg-brand-surface border border-border rounded-[32px] p-6 cursor-pointer hover:border-brand-neonblue/30 hover:bg-brand-muted/5 transition-all relative overflow-hidden shadow-sm"
                    >
                      <div className="absolute top-0 right-0 p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={isMobile ? 16 : 20} className="text-[#00F2FF]" />
                      </div>
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-brand-bgbase border border-border flex items-center justify-center mb-4 md:mb-6 group-hover:border-brand-neonblue/20 transition-all">
                        <Package size={isMobile ? 20 : 24} className="text-muted/20 group-hover:text-brand-neonblue" />
                      </div>
                      <h4 className="text-[12px] md:text-[14px] font-black text-main mb-1 group-hover:text-brand-neonblue transition-colors truncate">{item.Product.name}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted/40 mb-4">{item.Product.sku}</p>
                      <div className="flex justify-between items-end">
                        <span className="text-lg font-rajdhani font-black text-main">₱{item.Product.price.toLocaleString()}</span>
                        <div className={`text-[9px] font-black px-2 py-1 rounded-lg border ${item.quantity <= 5 ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-green-500/10 border-green-500/20 text-green-500"}`}>
                          {item.quantity} LEFT
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                )}
              </div>
            </div>
          </div>

          {/* Checkout Side Panel */}
          <div className="flex-1 bg-brand-surface border border-border rounded-[32px] md:rounded-[40px] flex flex-col relative overflow-hidden shadow-sm min-h-[500px] mb-8 lg:mb-0">
            {/* Header */}
            <div className="p-6 md:p-10 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-rajdhani font-black tracking-[2px] uppercase flex items-center gap-3 text-main">
                  <ShoppingCart size={20} className="text-brand-neonpurple" /> Cart Summary
                </h3>
                <span className="px-3 py-1 bg-brand-bgbase border border-border rounded-full text-[10px] font-black text-muted uppercase tracking-widest">{cart.length} ITEMS</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar relative">
              <AnimatePresence>
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group p-5 bg-main/5 rounded-3xl border border-border relative"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-6">
                          <h4 className="text-[13px] font-bold text-main truncate">{item.name}</h4>
                          <p className="text-[10px] font-black text-muted/40 uppercase tracking-widest mt-1">{item.sku}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-muted/40 hover:text-brand-crimson transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 p-1.5 bg-black/40 rounded-xl border border-border">
                          <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:text-[#00F2FF] transition-colors"><Minus size={14} /></motion.button>
                          <span className="min-w-[20px] text-center text-xs font-black">{item.quantity}</span>
                          <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:text-[#00F2FF] transition-colors"><Plus size={14} /></motion.button>
                        </div>
                        <span className="text-sm font-black text-[#00F2FF]">₱{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 px-10">
                    <Zap size={64} className="mb-6 stroke-[1px] text-brand-neonpurple" />
                    <h4 className="text-[12px] font-black uppercase tracking-[4px] text-muted">Waiting for Entry</h4>
                    <p className="text-[10px] mt-2 font-bold leading-tight text-muted">Initialize transaction by scanning or selecting hardware core components.</p>
                  </div>
                )}
              </AnimatePresence>

              {/* Success Overlay */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-brand-surface/95 backdrop-blur-2xl z-20 flex flex-col items-center justify-center p-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-24 h-24 rounded-[32px] bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                    >
                      <ShieldCheck size={48} className="text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-rajdhani font-black tracking-[4px] uppercase mb-4 text-main">Auth Secured</h3>
                    <p className="text-[11px] text-muted font-bold mb-10 leading-relaxed uppercase tracking-widest">Transaction Vector Synchronized to Distributed Core Database</p>
                    <div className="w-full h-1.5 bg-brand-surface rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 4 }} className="h-full bg-green-500 shadow-[0_0_10px_#22C55E]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Calculations & Footer */}
            <div className="p-6 md:p-10 bg-brand-muted/5 border-t border-border space-y-6 md:space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted">
                  <span>Subtotal Matrix</span>
                  <span className="text-main">₱{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] md:text-[11px] font-black uppercase tracking-widest text-muted">
                  <span>Processing VAT (12%)</span>
                  <span className="text-main">₱{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-6 md:pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 mb-6 md:mb-8">
                  <span className="text-[10px] font-black text-muted uppercase tracking-[4px]">Total Payable</span>
                  <span className="text-3xl md:text-4xl font-rajdhani font-black text-main tracking-widest">₱{grandTotal.toLocaleString()}</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPaymentMethod("Cash")}
                      className={`h-12 lg:h-16 flex items-center justify-center gap-3 rounded-full border text-[11px] font-black uppercase tracking-[2px] transition-all ${
                        paymentMethod === "Cash" ? "bg-brand-neonblue/10 border-brand-neonblue/40 text-brand-neonblue shadow-sm" : "bg-brand-bgbase border-border text-muted hover:text-main"
                      }`}
                    >
                      <Banknote size={16} /> Fiat
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPaymentMethod("Card")}
                      className={`h-12 lg:h-16 flex items-center justify-center gap-3 rounded-full border text-[11px] font-black uppercase tracking-[2px] transition-all ${
                        paymentMethod === "Card" ? "bg-brand-neonpurple/10 border-brand-neonpurple/40 text-brand-neonpurple shadow-sm" : "bg-brand-bgbase border-border text-muted hover:text-main"
                      }`}
                    >
                      <CreditCard size={16} /> Card
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPaymentMethod("GCash")}
                      className={`h-12 lg:h-16 flex items-center justify-center gap-3 rounded-full border text-[11px] font-black uppercase tracking-[2px] transition-all ${
                        paymentMethod === "GCash" ? "bg-blue-500/10 border-blue-500/40 text-blue-500 shadow-sm" : "bg-brand-bgbase border-border text-muted hover:text-main"
                      }`}
                    >
                      <Zap size={16} /> GCash
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPaymentMethod("Bank")}
                      className={`h-12 lg:h-16 flex items-center justify-center gap-3 rounded-full border text-[11px] font-black uppercase tracking-[2px] transition-all ${
                        paymentMethod === "Bank" ? "bg-green-500/10 border-green-500/40 text-green-500 shadow-sm" : "bg-brand-bgbase border-border text-muted hover:text-main"
                      }`}
                    >
                      <Banknote size={16} /> Bank
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {(paymentMethod === "GCash" || paymentMethod === "Bank" || paymentMethod === "Card") && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2">
                        <label className="text-[9px] font-black text-muted uppercase tracking-[3px] mb-2 block">Upload Proof of Payment</label>
                        <input type="file" onChange={(e) => setProofFile(e.target.files[0])} accept="image/*" className="w-full bg-brand-surface border border-border rounded-xl p-3 text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-brand-neonblue/10 file:text-brand-neonblue hover:file:bg-brand-neonblue/20" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={cart.length === 0 || success}
                    className={`w-full h-18 rounded-full font-black uppercase tracking-[6px] text-xs flex items-center justify-center gap-4 transition-all ${
                      success 
                      ? "bg-green-500 text-main" 
                      : "bg-brand-crimson hover:bg-red-700 text-main shadow-[0_20px_40px_rgba(215,38,56,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                    }`}
                  >
                    {success ? <CheckCircle2 size={24} /> : <>Initialize Process <ArrowRight size={20} /></>}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
