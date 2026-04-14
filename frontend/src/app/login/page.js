'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, MonitorIcon, Activity } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const resp = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', resp.data.token);
      localStorage.setItem('user', JSON.stringify(resp.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070e17] overflow-hidden flex flex-col md:grid md:grid-cols-2 font-dmsans">
      
      {/* Background Layer with specific grid and radial gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#070e17]"></div>
        {/* Subtle dot or linear grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-bluelight/10 rounded-full blur-[120px] opacity-20"></div>
      </div>

      {/* Left Panel - Branding */}
      <div className="relative z-10 flex flex-col justify-center px-12 lg:px-24 py-12 h-screen">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-16"
        >
          <div className="bg-[#2563C4] px-4 py-3 rounded-l-lg flex items-center justify-center">
            <MonitorIcon size={24} className="text-white" />
          </div>
          <div className="bg-[#D72638] font-rajdhani font-black text-2xl tracking-[4px] px-6 py-3 rounded-r-lg text-white">
            ALLEY
          </div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="font-bebas text-[7vw] leading-[0.9] tracking-wider mb-8"
        >
          <span className="text-white block">YOUR</span>
          <span className="text-[#3b82f6] block">TECH</span>
          <span className="text-[#D72638] block">ALLY.</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#7a8fa8] text-base max-w-md leading-relaxed mb-16"
        >
          The internal hub for PC Alley staff and administrators. Secure, fast, and built for the people who keep things running.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-6"
        >
          <div className="bg-transparent p-5 rounded-sm border-l border-b border-[#2a303c] border-opacity-50 border-t-0 border-r-0 min-w-[140px] shadow-[inset_1px_-1px_10px_rgba(255,255,255,0.01)] backdrop-blur-sm">
             <div className="font-rajdhani text-2xl font-black text-white tracking-widest">24/<span className="text-[#D72638]">7</span></div>
            <div className="text-[10px] uppercase tracking-[3px] text-[#7a8fa8] mt-2 font-bold">System Uptime</div>
          </div>
          <div className="bg-transparent p-5 rounded-sm border-l border-b border-[#2a303c] border-opacity-50 border-t-0 border-r-0 min-w-[140px] shadow-[inset_1px_-1px_10px_rgba(255,255,255,0.01)] backdrop-blur-sm">
             <div className="font-rajdhani text-2xl font-black text-white tracking-widest">256<span className="text-[#D72638]">-bit</span></div>
            <div className="text-[10px] uppercase tracking-[3px] text-[#7a8fa8] mt-2 font-bold">Encryption</div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Form Container with dividing line */}
      <div className="relative z-10 flex flex-col justify-center items-end pr-12 lg:pr-24 pl-12 h-screen">
        <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-red-500/20 to-transparent"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-[500px] bg-[#121620] p-10 lg:p-14 rounded-[32px] relative overflow-hidden backdrop-blur-md shadow-2xl"
        >
          {/* Top-left/Top-right gradient border lines */}
          <div className="absolute top-0 left-0 w-24 h-1 bg-[#3b82f6]"></div>
          <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-r from-transparent to-[#D72638]"></div>
          
          <div className="mb-10 mt-2">
            <span className="text-[10px] uppercase tracking-[3px] text-[#D72638] font-bold">PC Alley Internal Portal</span>
            <h1 className="font-bebas text-5xl tracking-widest text-[#F8F9FB] mt-3">SIGN IN</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[2px] text-[#7a8fa8] font-bold">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8fa8] w-4 h-4 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="you@pcalley.com"
                  className="w-full bg-[#0d1117] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-white/20 transition-all text-white placeholder-[#4b5563]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[2px] text-[#7a8fa8] font-bold">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8fa8] w-4 h-4 group-focus-within:text-white transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-[#0d1117] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-white/20 transition-all text-white placeholder-[#4b5563]"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[#7a8fa8] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-[11px] text-[#7a8fa8] hover:text-white transition-colors">
                Forgot your password?
              </Link>
            </div>

            {error && <p className="text-[#ff6b7a] text-xs text-center">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#D72638] hover:bg-[#e8344a] text-white font-rajdhani font-black text-xl tracking-[4px] py-4 rounded-[16px] shadow-[0_0_20px_rgba(215,38,56,0.3)] active:translate-y-0.5 transition-all uppercase relative mt-4 group"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Activity className="w-5 h-5 animate-spin mr-2" />
                  AUTHENTICATING
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  LOGIN
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </div>

    </div>
  );
}
