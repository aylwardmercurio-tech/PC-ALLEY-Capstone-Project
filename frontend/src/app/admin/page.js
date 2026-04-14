"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import { 
  Shield, 
  Users, 
  Activity, 
  Key, 
  MoreVertical, 
  Search, 
  UserPlus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [provisionData, setProvisionData] = useState({
    username: "",
    password: "",
    role: "employee",
    branch_id: ""
  });
  const [branchData, setBranchData] = useState({
    name: "",
    location: "",
    phone: ""
  });
  const [editingBranch, setEditingBranch] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(storedUser);
    
    if (storedUser?.role === 'employee') {
       window.location.href = '/dashboard';
       return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [uRes, bRes] = await Promise.all([
        fetch("http://localhost:5000/api/auth/users", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/branches", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const uData = await uRes.json();
      const bData = await bRes.json();
      
      if (uRes.ok) setUsers(uData);
      if (bRes.ok) setBranches(bData);
    } catch (err) {
      console.error("Link Failure:", err);
    } finally {
      setLoading(false);
    }
  };

  const activityLogs = [
    { id: 101, action: "Inventory Restock", user: "Alexander Pierce", time: "2m ago", status: "Success", detail: "Added 50x RTX 4090" },
    { id: 102, action: "Security Login", user: "Maria Clara", time: "1h ago", status: "Success", detail: "Terminal 04 Access" },
    { id: 103, action: "Refund Issued", user: "Renato Cruz", time: "2h ago", status: "Alert", detail: "₱12,500 Vector Loop" },
    { id: 104, action: "Registry Change", user: "System Core", time: "5h ago", status: "Success", detail: "Price matrix update" },
  ];

  const handleProvision = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const payload = {
      ...provisionData,
      branch_id: currentUser.role === 'branch_admin' ? currentUser.branch_id : provisionData.branch_id
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setProvisionData({ username: "", password: "", role: "employee", branch_id: "" });
        fetchData();
      }
    } catch (err) {
       console.error("Provisioning Error:", err);
    }
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/branches", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(branchData)
      });
      
      if (res.ok) {
        setIsBranchModalOpen(false);
        setBranchData({ name: "", location: "", phone: "" });
        fetchData(); // Refresh branch list
      }
    } catch (err) {
      console.error("Branch Creation Error:", err);
    }
  };

  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/branches/${editingBranch.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(branchData)
      });
      
      if (res.ok) {
        setIsEditModalOpen(false);
        setEditingBranch(null);
        setBranchData({ name: "", location: "", phone: "" });
        fetchData();
      }
    } catch (err) {
      console.error("Branch Update Error:", err);
    }
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setBranchData({
      name: branch.name,
      location: branch.location || "",
      phone: branch.phone || ""
    });
    setIsEditModalOpen(true);
  };
  return (
    <div className="flex bg-brand-bgbase min-h-screen text-main font-dmsans transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopBar title="SYSTEM ADMINISTRATION" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar relative z-10 bg-brand-bgbase text-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* User Management Section */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="lg:col-span-2 bg-brand-surface border border-border rounded-2xl p-6 lg:p-8 overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-brand-neonblue/50 rounded-full" />
                  <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">User Registry</h3>
                </div>
                <div className="flex items-center gap-4">
                  {currentUser?.role === 'super_admin' && (
                    <button 
                      onClick={() => setIsBranchModalOpen(true)}
                      className="h-10 px-5 bg-brand-surface border border-border rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[2px] text-muted hover:bg-brand-neonblue hover:text-white transition-all group"
                    >
                       Create Sector
                    </button>
                  )}
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="h-10 px-5 bg-brand-surface border border-border rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[2px] text-muted hover:bg-brand-crimson hover:text-white transition-all group"
                  >
                     Provision Personnel
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-widest text-muted border-b border-border">
                      <th className="pb-4 pr-4">ID Vector</th>
                      <th className="pb-4 px-4">Personnel</th>
                      <th className="pb-4 px-4">Authorization</th>
                      <th className="pb-4 px-4">Sector</th>
                      <th className="pb-4 pl-4 text-right">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {users.map((user, i) => (
                      <tr key={user.id} className="border-b border-border hover:bg-brand-muted/5 transition-colors group cursor-pointer">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-2 font-mono text-[10px] text-muted-40 truncate uppercase">
                            UID-{user.id.toString().padStart(4, '0')}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-brand-surface border border-border flex items-center justify-center text-[10px] font-bold text-muted group-hover:border-brand-neonblue/30 group-hover:text-brand-neonblue transition-all opacity-60 uppercase">
                              {user.username.substring(0, 2)}
                            </div>
                            <div>
                               <h4 className="text-[13px] font-bold text-main group-hover:text-brand-neonblue transition-colors">{user.username}</h4>
                               <p className="text-[10px] text-muted-40 uppercase tracking-widest mt-0.5">Active Session</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                            user.role === 'super_admin' ? 'bg-brand-crimson/10 border-brand-crimson/20 text-brand-crimson' : 
                            user.role === 'employee' ? 'bg-orange-400/10 border-orange-400/20 text-orange-400' :
                            'bg-brand-neonblue/10 border-brand-neonblue/20 text-brand-neonblue'
                          }`}>
                            {user.role === 'employee' ? 'Staff' : (user.role === 'branch_admin' ? 'Manager' : 'Admin')}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-[10px] text-muted-40 uppercase">
                           {user.Branch ? user.Branch.name : 'Central Core'}
                        </td>
                        <td className="py-4 pl-4 text-right">
                           <button className="p-2.5 bg-brand-surface border border-border rounded-xl text-muted hover:text-main transition-all shadow-sm"><MoreVertical size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>




            {/* Activity Logs Section */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.1 }}
               className="bg-brand-surface border border-border rounded-2xl p-8 lg:p-10 flex flex-col h-[500px] lg:h-auto shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-brand-neonpurple/50 rounded-full" />
                  <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">Logic Flow</h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-brand-neonpurple shadow-[0_0_8px_#BC13FE]" />
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
                {activityLogs.map((log, i) => (
                  <div key={log.id} className="relative pl-6 pb-6 border-l border-white/5 last:pb-0">
                    <div className={`absolute left-[-4.5px] top-0 w-2 h-2 rounded-full ${
                      log.status === 'Alert' ? 'bg-brand-crimson shadow-[0_0_8px_#D72638]' : 'bg-brand-neonblue shadow-[0_0_8px_#00F2FF]'
                    }`} />
                    <div className="flexjustify-between items-start mb-1">
                      <h4 className={`text-[10px] font-bold uppercase tracking-widest ${log.status === 'Alert' ? 'text-brand-crimson' : 'text-main/60'}`}>{log.action}</h4>
                      <span className="text-[9px] font-bold text-muted uppercase">{log.time}</span>
                    </div>
                    <p className="text-[11px] font-medium text-muted mb-3">{log.detail}</p>
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded bg-brand-bgbase flex items-center justify-center text-[8px] font-black text-muted border border-border">
                         {log.user.split(' ').map(n => n[0]).join('')}
                       </div>
                       <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{log.user}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 bg-brand-surface border border-border rounded-xl text-[10px] font-bold uppercase tracking-[2px] text-muted hover:text-main transition-all shadow-sm">
                Full System Audit
              </button>
            </motion.div>
          </div>

          {/* Branch Registry Section - NEW */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-brand-surface border border-border rounded-2xl p-6 lg:p-8 mb-8 overflow-hidden shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-brand-neonblue/50 rounded-full" />
                <h3 className="text-sm font-rajdhani font-bold uppercase text-main tracking-wider">Branch Registry</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-muted border-b border-border">
                    <th className="pb-4 pr-4">Sector ID</th>
                    <th className="pb-4 px-4">Designation</th>
                    <th className="pb-4 px-4">Coordinates</th>
                    <th className="pb-4 px-4">Uplink</th>
                    <th className="pb-4 pl-4 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {branches.map((branch) => (
                    <tr key={branch.id} className="border-b border-border hover:bg-brand-muted/5 transition-colors group">
                      <td className="py-4 pr-4">
                        <div className="font-mono text-[10px] text-muted-40 uppercase">SEC-{branch.id.toString().padStart(3, '0')}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-[13px] font-bold text-main group-hover:text-brand-neonblue transition-colors">{branch.name}</div>
                      </td>
                      <td className="py-4 px-4 text-[11px] text-muted-40 uppercase tracking-tight">
                        {branch.location || "Unset"}
                      </td>
                      <td className="py-4 px-4 text-[11px] text-muted-40 font-mono">
                        {branch.phone || "---"}
                      </td>
                      <td className="py-4 pl-4 text-right">
                         <button 
                           onClick={() => openEditModal(branch)}
                           className="px-4 py-1.5 bg-brand-surface border border-border rounded-lg text-[9px] font-black uppercase tracking-widest text-muted hover:bg-brand-neonblue hover:text-white transition-all shadow-sm"
                         >
                           Reconfigure
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Bottom Security Insight */}
          <motion.div 
             initial={{ opacity: 0, y: 10 }} 
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-[#121826]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 flex items-center justify-between relative overflow-hidden group mb-8"
          >
             <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-brand-crimson/5 to-transparent pointer-events-none" />
             
             <div className="flex items-center gap-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-brand-surface border border-border flex items-center justify-center">
                   <Shield size={24} className="text-brand-crimson" />
                </div>
                <div>
                   <h3 className="text-sm font-rajdhani font-bold tracking-[2px] uppercase text-main">Shield Protocol Active</h3>
                   <p className="text-[10px] text-muted uppercase tracking-widest">Distributed Ledger Encryption active (AES-256)</p>
                </div>
             </div>
             
             <div className="flex items-center gap-8 relative z-10">
                <div className="text-right">
                   <p className="text-[8px] font-black text-muted uppercase mb-1">Threat Level</p>
                   <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">OPTIMAL</p>
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-black text-muted uppercase mb-1">Active Nodes</p>
                   <p className="text-[10px] font-black text-main uppercase tracking-widest">12 / 12</p>
                </div>
             </div>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0E121A] border border-white/10 rounded-[32px] p-10 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-crimson/10 blur-[80px] pointer-events-none" />
              
              <div className="mb-10">
                <h3 className="text-xl font-rajdhani font-black tracking-[4px] uppercase text-main mb-2">Access Provisioning</h3>
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Generate new personnel authorization credentials</p>
              </div>

              <form onSubmit={handleProvision} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[3px] text-muted ml-2">Logical Identifier (Email)</label>
                   <input 
                     type="email" 
                     required
                     value={provisionData.username}
                     onChange={(e) => setProvisionData({...provisionData, username: e.target.value})}
                     className="w-full bg-brand-bgbase border border-border rounded-2xl py-4 px-6 text-sm text-main focus:outline-none focus:border-brand-neonblue transition-all"
                     placeholder="personnel@pcalley.com"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[3px] text-muted ml-2">Security Access Key</label>
                   <input 
                     type="password" 
                     required
                     value={provisionData.password}
                     onChange={(e) => setProvisionData({...provisionData, password: e.target.value})}
                     className="w-full bg-brand-bgbase border border-border rounded-2xl py-4 px-6 text-sm text-main focus:outline-none focus:border-brand-crimson transition-all"
                     placeholder="••••••••"
                   />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[3px] text-muted ml-2">Authority Level</label>
                     <select 
                       value={provisionData.role}
                       onChange={(e) => setProvisionData({...provisionData, role: e.target.value})}
                       className="w-full bg-brand-bgbase border border-border rounded-2xl py-4 px-6 text-sm text-main focus:outline-none focus:border-brand-neonblue transition-all appearance-none"
                       disabled={currentUser?.role === 'branch_admin'}
                     >
                        <option value="employee" className="bg-brand-surface">Staff Associate</option>
                        <option value="branch_admin" className="bg-brand-surface">Branch Manager</option>
                        <option value="super_admin" className="bg-brand-surface">Super Admin</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[9px] font-black uppercase tracking-[3px] text-muted ml-2">Logical Sector</label>
                     <select 
                       value={provisionData.branch_id}
                       onChange={(e) => setProvisionData({...provisionData, branch_id: e.target.value})}
                       className="w-full bg-brand-bgbase border border-border rounded-2xl py-4 px-6 text-sm text-main focus:outline-none focus:border-brand-neonblue transition-all appearance-none"
                       disabled={currentUser?.role === 'branch_admin'}
                       required={currentUser?.role === 'super_admin'}
                     >
                        <option value="" className="bg-brand-surface">Global Hub</option>
                        {branches.map(b => (
                           <option key={b.id} value={b.id} className="bg-brand-surface">{b.name}</option>
                        ))}
                     </select>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl border border-border text-[10px] font-black uppercase tracking-[3px] text-muted hover:text-main hover:bg-brand-muted/5 transition-all"
                  >
                   Abort
                  </button>
                  <button 
                     type="submit"
                     className="flex-[2] py-4 bg-brand-crimson hover:bg-red-700 rounded-2xl text-[10px] font-black uppercase tracking-[3px] text-white shadow-lg shadow-brand-crimson/20 transition-all active:scale-[0.98]"
                  >
                    Initialize Provisioning
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBranchModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBranchModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0E121A] border border-white/10 rounded-[32px] p-10 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neonblue/10 blur-[80px] pointer-events-none" />
              
              <div className="mb-10">
                <h3 className="text-xl font-rajdhani font-black tracking-[4px] uppercase text-white mb-2">Initialize Sector</h3>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Establish a new logical branch in the ERP core</p>
              </div>

              <form onSubmit={handleCreateBranch} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[3px] text-white/20 ml-2">Sector Designation (Name)</label>
                   <input 
                     type="text" 
                     required
                     value={branchData.name}
                     onChange={(e) => setBranchData({...branchData, name: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-brand-neonblue transition-all"
                     placeholder="e.g. Branch D - Northern Spire"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[3px] text-white/20 ml-2">Geographic Coordinates (Address)</label>
                   <input 
                     type="text" 
                     value={branchData.location}
                     onChange={(e) => setBranchData({...branchData, location: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-brand-neonblue transition-all"
                     placeholder="Business District, Quezon City"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[3px] text-white/20 ml-2">Comms Uplink (Phone)</label>
                   <input 
                     type="text" 
                     value={branchData.phone}
                     onChange={(e) => setBranchData({...branchData, phone: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-brand-neonblue transition-all"
                     placeholder="0917-000-0000"
                   />
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsBranchModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[3px] text-white/20 hover:text-white hover:bg-white/5 transition-all"
                  >
                   Abort
                  </button>
                  <button 
                     type="submit"
                     className="flex-[2] py-4 bg-brand-neonblue hover:bg-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-[3px] text-white shadow-lg shadow-brand-neonblue/20 transition-all active:scale-[0.98]"
                  >
                    Establish Link
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0E121A] border border-white/10 rounded-[32px] p-10 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neonblue/10 blur-[80px] pointer-events-none" />
              
              <div className="mb-10">
                <h3 className="text-xl font-rajdhani font-black tracking-[4px] uppercase text-white mb-2">Reconfigure Sector</h3>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Update parameters for {editingBranch?.name}</p>
              </div>

              <form onSubmit={handleUpdateBranch} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[3px] text-white/20 ml-2">Sector Designation</label>
                   <input 
                     type="text" 
                     required
                     value={branchData.name}
                     onChange={(e) => setBranchData({...branchData, name: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-brand-neonblue transition-all"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[3px] text-white/20 ml-2">Coordinates</label>
                   <input 
                     type="text" 
                     value={branchData.location}
                     onChange={(e) => setBranchData({...branchData, location: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-brand-neonblue transition-all"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-[3px] text-white/20 ml-2">Uplink</label>
                   <input 
                     type="text" 
                     value={branchData.phone}
                     onChange={(e) => setBranchData({...branchData, phone: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-brand-neonblue transition-all"
                   />
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[3px] text-white/20 hover:text-white hover:bg-white/5 transition-all"
                  >
                   Abort
                  </button>
                  <button 
                     type="submit"
                     className="flex-[2] py-4 bg-brand-neonblue hover:bg-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-[3px] text-white shadow-lg shadow-brand-neonblue/20 transition-all active:scale-[0.98]"
                  >
                    Sync Parameters
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
