"use client";

import { useState, useEffect } from 'react';
import { apiUrl } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function RestockManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [rejectionModal, setRejectionModal] = useState(null); // stores request object
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(apiUrl('/api/restock-requests'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      toast.error('Failed to load restock requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    
    // Detect ID in URL for highlighting/scrolling
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
       // We can use this to scroll to the row later
       console.log('Target Request ID:', id);
    }
  }, []);

  const handleApprove = async (id) => {
    if (!confirm('Are you sure you want to approve this restock request? It will automatically update the branch inventory.')) return;
    
    setProcessingId(id);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(apiUrl(`/api/restock-requests/${id}/approve`), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Request approved and stock updated');
        fetchRequests();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Approval failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    const id = rejectionModal.id;
    setProcessingId(id);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(apiUrl(`/api/restock-requests/${id}/reject`), {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ reason: rejectionReason })
      });
      if (res.ok) {
        toast.success('Request rejected');
        setRejectionModal(null);
        setRejectionReason('');
        fetchRequests();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Rejection failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Approved': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Rejected': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-brand-muted bg-brand-surface/20 border-brand-border/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bebas tracking-wider text-main uppercase">Restock Procurement</h2>
          <p className="text-[10px] text-brand-muted font-rajdhani uppercase tracking-[3px]">Manage branch inventory replenishment requests</p>
        </div>
        <button 
          onClick={fetchRequests}
          className="p-3 rounded-xl bg-brand-surface border border-brand-border/30 hover:bg-brand-hover/10 transition-all text-main shadow-sm"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-border/40 bg-brand-surface/40 backdrop-blur-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-panel/20 border-b border-brand-border/30">
              <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-rajdhani font-black text-main/50">Date</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-rajdhani font-black text-main/50">Branch / Manager</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-rajdhani font-black text-main/50">Product</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-rajdhani font-black text-main/50 text-center">Qty</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-rajdhani font-black text-main/50">Est. Cost</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-rajdhani font-black text-main/50">Status</th>
              <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-rajdhani font-black text-main/50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/20">
            {loading && requests.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center text-brand-muted font-rajdhani animate-pulse uppercase tracking-[4px] text-xs">
                  Scanning for requests...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-20 text-center text-brand-muted font-rajdhani uppercase tracking-[4px] text-xs">
                  No restock requests found
                </td>
              </tr>
            ) : (
              requests.map((req) => {
                const isTarget = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('id') === String(req.id);
                return (
                  <tr key={req.id} className={`hover:bg-brand-neonblue/5 transition-all group ${isTarget ? 'bg-brand-neonblue/10 border-l-4 border-brand-neonblue' : ''}`}>
                  <td className="px-6 py-5 font-rajdhani text-[11px] font-bold text-main/60">
                    {format(new Date(req.createdAt), 'MMM dd, HH:mm')}
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[13px] font-bold text-main uppercase">{req.Branch.name}</div>
                    <div className="text-[10px] text-brand-muted font-rajdhani uppercase tracking-wider">@{req.Manager.username}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[13px] font-black text-brand-neonblue uppercase">{req.Product.name}</div>
                    <div className="text-[10px] text-brand-muted font-rajdhani uppercase tracking-widest">{req.Product.sku}</div>
                    {req.notes && (
                      <div className="text-[10px] text-main/40 mt-1.5 italic font-rajdhani truncate max-w-[200px]" title={req.notes}>
                        " {req.notes} "
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 font-rajdhani text-sm font-black text-center text-main">{req.quantity}</td>
                  <td className="px-6 py-5 font-rajdhani">
                    <div className="text-sm font-black text-main">
                      {req.cost_price ? `₱${(req.cost_price * req.quantity).toLocaleString()}` : '---'}
                    </div>
                    <div className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">₱{req.cost_price || 0} / unit</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end items-center gap-3">
                      {req.status === 'Pending' ? (
                        <>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprove(req.id)}
                            disabled={processingId === req.id}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
                          >
                            Approve
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setRejectionModal(req)}
                            disabled={processingId === req.id}
                            className="px-4 py-2 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20 disabled:opacity-50"
                          >
                            Reject
                          </motion.button>
                        </>
                      ) : (
                        <div className="text-[10px] font-rajdhani uppercase text-brand-muted font-bold italic tracking-wider bg-brand-bgbase/50 px-3 py-1.5 rounded-lg border border-brand-border/20">
                          {req.status === 'Approved' ? `Signed by @${req.Admin?.username || 'Admin'}` : `Declined: ${req.rejection_reason || 'N/A'}`}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Rejection Modal */}
      {rejectionModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-main/20 backdrop-blur-sm">
          <div className="bg-brand-bgbase border border-brand-border/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-brand-border/10 bg-gradient-to-r from-rose-500/10 to-transparent">
              <h3 className="text-xl font-bebas tracking-wider text-rose-400">Reject Request</h3>
              <p className="text-xs text-brand-muted mt-1 uppercase tracking-widest font-rajdhani">Reason for rejection</p>
            </div>
            <form onSubmit={handleReject} className="p-6 space-y-4">
              <textarea
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-brand-surface/10 border border-brand-border/10 rounded-xl px-4 py-3 text-sm text-main focus:outline-none focus:border-rose-500/50 transition-all font-rajdhani h-32 resize-none placeholder:text-brand-muted/50"
                placeholder="Enter rejection reason..."
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRejectionModal(null)}
                  className="flex-1 px-4 py-3 rounded-xl border border-brand-border/20 text-[10px] uppercase tracking-[0.2em] font-rajdhani font-bold text-main hover:bg-brand-surface/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingId}
                  className="flex-2 px-6 py-3 bg-rose-500 text-white rounded-xl text-[10px] uppercase tracking-[0.2em] font-rajdhani font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {processingId ? 'Processing...' : 'Confirm Reject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
