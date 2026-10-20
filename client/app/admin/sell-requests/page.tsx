'use client';
import { useEffect, useState } from 'react';
import { ShieldCheck, XCircle, CheckCircle2, Clock, User, Calendar } from 'lucide-react';

export default function SellRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`https://gift-card-marketplace.onrender.com/api/admin/sell-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sell Requests Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Complete audit history of all user-submitted gift cards.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                <th className="p-4">#ID</th>
                <th className="p-4">Brand / Title</th>
                <th className="p-4">Seller Details</th>
                <th className="p-4">Value / Price</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions / Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">Loading sell requests ledger...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">No sell requests found.</td>
                </tr>
              ) : (
                requests.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono text-[11px] font-bold">#LS{item.id}</td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{item.brand}</span>
                      <span className="text-[10px] text-slate-400">{item.title}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                        {item.seller_email || `User #${item.seller_id}`}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="block text-slate-900 font-bold">Face: ₹{item.balance}</span>
                      <span className="block text-emerald-600 font-bold">Offer: ₹{item.price}</span>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      {item.status && item.status.toLowerCase() === 'verified' ? (
                        <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : item.status && item.status.toLowerCase() === 'rejected' ? (
                        <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {item.status && item.status.toLowerCase() === 'verified' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          ✓ Approved & Live
                        </span>
                      ) : item.status && item.status.toLowerCase() === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                          ✕ Rejected
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusUpdate(item.id, 'verified')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(item.id, 'rejected')}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
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