'use client';
import { useEffect, useState } from 'react';
import { ShieldCheck, XCircle, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SellRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch sell requests from backend
  const fetchRequests = () => {
    fetch('https://gift-card-marketplace.onrender.com/api/admin/sell-requests')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRequests(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading sell requests:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle Verify or Reject Action
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`https://gift-card-marketplace.onrender.com/api/admin/sell-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh list after successful update
        fetchRequests();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sell Requests Verification</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Review and verify user-submitted gift cards before listing them live.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                <th className="p-4">#ID</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Card Value</th>
                <th className="p-4">Selling Price</th>
                <th className="p-4">Code / PIN</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">Loading requests...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">No sell requests found.</td>
                </tr>
              ) : (
                requests.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono text-[11px]">#LS{item.id}</td>
                    <td className="p-4 font-bold text-slate-900">{item.brand_name || item.brand}</td>
                    <td className="p-4">₹{item.card_value}</td>
                    <td className="p-4 font-bold text-indigo-600">₹{item.selling_price}</td>
                    <td className="p-4 font-mono text-xs bg-slate-100 px-2 py-1 rounded max-w-[120px] truncate">
                      {item.card_code || 'N/A'}
                    </td>
                    <td className="p-4">
                      {item.status === 'verified' ? (
                        <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : item.status === 'rejected' ? (
                        <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleStatusUpdate(item.id, 'verified')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition"
                      >
                        Verify
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(item.id, 'rejected')}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-3 py-1.5 rounded-xl text-[11px] transition"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}