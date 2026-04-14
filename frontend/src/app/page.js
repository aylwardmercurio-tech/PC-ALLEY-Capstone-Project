"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.message || "Access Denied: Invalid Security Key");
      }
    } catch (err) {
      setError("System Core Offline: Check Network Link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-[#08090D] overflow-hidden font-dm-sans">
      {/* Left Decoration Column */}
      <div className="relative hidden lg:flex flex-col justify-between p-20 bg-[#0A0C11] border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-brand-crimson/10 blur-[120px] rounded-full" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-32"
          >
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2.5 shadow-2xl">
              <div className="w-full h-full bg-brand-crimson rounded-lg shadow-[0_0_15px_#D72638]" />
            </div>
            <h2 className="font-rajdhani font-black text-4xl tracking-[6px] text-white uppercase group cursor-default">
              PC ALLEY
            </h2>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[140px] font-black leading-[0.85] text-white tracking-tighter mb-10"
          >
            THE <br />
            <span className="text-brand-crimson">TECH</span> <br />
            CORE.
          </motion.h1>
          <p className="text-white/30 text-xs font-black uppercase tracking-[4px] max-w-sm leading-relaxed">
            Propelling hardware inventory management into the next generation.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 flex gap-20"
        >
          <div>
            <p className="text-4xl font-black text-white tracking-tighter">3.2k</p>
            <p className="text-[10px] text-white/20 uppercase tracking-[3px] font-black mt-1">Authorized Hubs</p>
          </div>
          <div>
            <p className="text-4xl font-black text-white tracking-tighter">1.5M</p>
            <p className="text-[10px] text-white/20 uppercase tracking-[3px] font-black mt-1">Matrix Assets</p>
          </div>
          <div className="flex flex-col items-center">
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-brand-crimson animate-pulse">
                <ShieldCheck size={20} />
             </div>
             <p className="text-[10px] text-white/20 uppercase tracking-[3px] font-black mt-2">Secure Link</p>
          </div>
        </motion.div>
      </div>

      {/* Right Login Column */}
      <div className="flex items-center justify-center p-8 lg:p-24 bg-[#08090D] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00F2FF]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-panel p-12 rounded-[56px] border-white/5 relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
        >
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-[11px] uppercase tracking-[6px] text-brand-crimson font-black mb-4">Personnel Clearance</h2>
            <h3 className="text-3xl font-black text-white tracking-tight">System Access</h3>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#00F2FF] transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Personnel ID / Email"
                  className="w-full bg-white/5 border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-[13px] text-white placeholder:text-white/10 focus:outline-none focus:border-[#00F2FF]/30 transition-all font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#00F2FF] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Security Access Key"
                  className="w-full bg-white/5 border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-[13px] text-white placeholder:text-white/10 focus:outline-none focus:border-[#00F2FF]/30 transition-all font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                 <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 accent-[#00F2FF]" />
                 <span className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-white transition-colors">Keep Session</span>
              </label>
              <button type="button" className="text-[10px] font-black text-brand-crimson uppercase tracking-[2px] hover:text-white transition-colors">
                Lost Key?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-brand-crimson hover:bg-red-700 text-white font-black rounded-3xl transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(215,38,56,0.3)] group mt-10"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                   <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                   <span className="tracking-[4px] text-xs">ENCRYPTING...</span>
                </div>
              ) : (
                <>
                  <span className="tracking-[4px] text-xs">INITIALIZE ACCESS</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-16 pt-10 border-t border-white/5 flex flex-col items-center gap-6">
             <div className="flex gap-6">
                <button className="text-[10px] font-black text-white/20 uppercase tracking-[2px] hover:text-white">Legal Protocol</button>
             </div>
             <p className="text-[9px] text-white/10 font-black uppercase tracking-[4px]">
               &copy; 2024 PC ALLEY • LOGIC CORE V4.2
             </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
