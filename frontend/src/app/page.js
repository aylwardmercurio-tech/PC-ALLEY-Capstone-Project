"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { apiUrl, getApiErrorMessage } from "../lib/api";
import { LogoBrandingV2 } from "../components/Logo";

export default function LandingPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getRoleHome = (role) => {
    switch (role) {
      case "super_admin":
      case "branch_admin":
        return "/admin";
      case "employee":
        return "/sales";
      default:
        return "/dashboard";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const normalizedUsername = username.trim();
 
    if (!normalizedUsername) {
      setError("Please enter your username or account ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalizedUsername, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push(getRoleHome(data.user?.role));
      } else {
        const errorMsg = data.message || data.error || "Access Denied: Invalid Security Key";
        setError(errorMsg);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "System Core Offline: Check Network Link"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgbase flex justify-center overflow-hidden">
      <main className="w-full max-w-[1800px] grid lg:grid-cols-2 bg-brand-bgbase font-dm-sans relative shadow-[0_0_100px_rgba(0,0,0,0.1)]">
        {/* Left Decoration Column */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 xl:p-20 bg-brand-surface border-r border-border overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-brand-crimson/10 blur-[120px] rounded-full" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-32"
          >
            <div className="flex items-center justify-start overflow-visible">
              <LogoBrandingV2 size="large" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[64px] xl:text-[96px] font-black leading-[0.85] text-main tracking-tighter mb-10"
          >
            THE <br />
            <span className="text-brand-crimson">TECH</span> <br />
            CORE.
          </motion.h1>
          <p className="text-muted text-xs font-black uppercase tracking-[4px] max-w-sm leading-relaxed">
            Propelling hardware inventory management into the next generation.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 flex gap-12"
        >
          <motion.div whileHover={{ scale: 1.05, y: -5 }} className="cursor-default group">
            <p className="text-3xl font-black text-main tracking-tighter group-hover:text-brand-neonblue transition-colors duration-300">3.2k</p>
            <p className="text-[10px] text-muted uppercase tracking-[3px] font-black mt-1">Authorized Hubs</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }} className="cursor-default group">
            <p className="text-3xl font-black text-main tracking-tighter group-hover:text-brand-neonblue transition-colors duration-300">1.5M</p>
            <p className="text-[10px] text-muted uppercase tracking-[3px] font-black mt-1">Matrix Assets</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }} className="flex flex-col items-center cursor-default">
             <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-brand-crimson animate-pulse">
                <ShieldCheck size={20} />
             </div>
             <p className="text-[10px] text-muted uppercase tracking-[3px] font-black mt-2">Secure Link</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Login Column */}
      <div className="flex items-center justify-center p-8 lg:p-12 xl:p-24 bg-brand-bgbase relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-neonblue/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Theme Quick Toggle */}
        <div className="absolute top-8 right-8 lg:top-12 lg:right-12 z-20">
          <motion.button 
            type="button"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-brand-surface border border-border hover:border-brand-neonblue/30 flex items-center justify-center transition-colors group shadow-sm overflow-hidden"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ y: 20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun size={18} className="text-brand-neonblue" /> : <Moon size={18} className="text-brand-neonblue" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-panel p-12 rounded-[56px] border-border relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col items-center lg:items-start"
        >


          <div className="mb-8 text-center lg:text-left w-full">
            <h2 className="text-[11px] uppercase tracking-[6px] text-brand-crimson font-black mb-4">Personnel Clearance</h2>
            <h3 className="text-3xl font-black text-main tracking-tight">System Access</h3>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 bg-brand-crimson/10 border border-brand-crimson/30 rounded-2xl text-[13px] font-bold text-brand-crimson text-center flex items-center justify-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-crimson animate-pulse" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-5">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }} className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-neonblue transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Personnel ID / Username"
                  className="w-full bg-main/5 border border-border rounded-3xl py-5 pl-14 pr-6 text-[13px] text-main placeholder:text-muted focus:outline-none focus:border-brand-neonblue/30 transition-all font-bold"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }} className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-neonblue transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Security Access Key"
                  className="w-full bg-main/5 border border-border rounded-3xl py-5 pl-14 pr-14 text-[13px] text-main placeholder:text-muted focus:outline-none focus:border-brand-neonblue/30 transition-all font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-brand-neonblue transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>
            </div>

            <div className="flex justify-between items-center px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                 <input
                   type="checkbox"
                   style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                   className="w-4 h-4 rounded border-border bg-main/5 accent-brand-neonblue"
                   checked={showPassword}
                   onChange={() => setShowPassword(!showPassword)}
                 />
                 <span className="text-[10px] font-black text-muted uppercase tracking-widest group-hover:text-main transition-colors">Show Password</span>
              </label>
              <button onClick={() => router.push("/forgot-password")} type="button" className="text-[10px] font-black text-brand-crimson uppercase tracking-[2px] hover:text-main hover:underline underline-offset-4 decoration-current transition-all">
                Forgot Password?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-brand-crimson hover:bg-red-700 text-main font-black rounded-full transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(10,65,116,0.2)] group mt-10"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                   <div className="w-5 h-5 border-4 border-border border-t-white rounded-full animate-spin" />
                   <span className="tracking-[4px] text-xs">ENCRYPTING...</span>
                </div>
              ) : (
                <>
                  <span className="tracking-[4px] text-xs">LOGIN</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-16 pt-10 border-t border-border flex flex-col items-center gap-6">
             <div className="flex gap-6">
                <button onClick={() => router.push("/essentials")} className="text-[10px] font-black text-muted uppercase tracking-[2px] hover:text-main hover:underline underline-offset-4 transition-all">Legal Protocol</button>
             </div>
             <p className="text-[9px] text-muted font-black uppercase tracking-[4px]">
               &copy; 2024 PC ALLEY • LOGIC CORE V4.2
             </p>
          </div>
        </motion.div>
      </div>
    </main>
  </div>
  );
}
