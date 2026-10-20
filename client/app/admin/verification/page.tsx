'use client';
import { useEffect, useState } from 'react';
import { 
  ShieldCheck, Eye, EyeOff, CheckCircle2, 
  XCircle, X 
} from 'lucide-react';

export default function VerificationCenter() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQueue = () => {
    setLoading(true);
    fetch('https://gift-card-marketplace.onrender.com/api/admin/verification-queue')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQueue(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load queue:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (status: 'verified' | 'rejected') => {
    if (!selectedCard) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`https://gift-card-marketplace.onrender.com/api/admin/sell-requests/${selectedCard.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejection_reason: rejectReason }),
      });

      if (res.ok) {
        setSelectedCard(null);
        setRejectReason('');
        setShowCode(false);
        fetchQueue();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verification Center</h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full">
              {queue.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Inspect secrets, verify balance, and confirm listing validity.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-4">Card ID</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Face Value</th>
                <th className="p-4">Asking Price</th>
                <th className="p-4">Seller</th>
                <th className="p-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">Loading queue...</td>
                </tr>
              ) : queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">No pending cards found for verification!</p>
                  </td>
                </tr>
              ) : (
                queue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-4 font-mono font-bold text-slate-900">#LS{item.id}</td>
                    <td className="p-4 font-bold text-slate-900">{item.brand}</td>
                    <td className="p-4 font-bold text-slate-900">₹{item.balance}</td>
                    <td className="p-4 font-bold text-indigo-600">₹{item.price}</td>
                    <td className="p-4 text-slate-500">{item.seller_email || 'User'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedCard(item)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect Card
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECTION MODAL */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Card Verification #LS{selectedCard.id}</h2>
                  <p className="text-xs text-slate-400 font-medium">{selectedCard.brand}</p>
                </div>
                <button onClick={() => setSelectedCard(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Balance</p>
                  <p className="text-base font-black text-slate-900">₹{selectedCard.balance}</p>
                </div>
                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                  <p className="text-[10px] text-indigo-500 font-bold uppercase">Price</p>
                  <p className="text-base font-black text-indigo-600">₹{selectedCard.price}</p>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 shadow-inner my-5">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Voucher Credentials</p>
                  <button 
                    onClick={() => setShowCode(!showCode)}
                    className="text-xs font-bold text-indigo-400 flex items-center gap-1"
                  >
                    {showCode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showCode ? 'Hide' : 'Reveal'}
                  </button>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Card Number</p>
                  <p className="font-mono text-sm font-bold tracking-wider text-emerald-400 mt-0.5">
                    {showCode ? selectedCard.card_number : '•••• •••• ••••'}
                  </p>
                </div>
                {selectedCard.pin && (
                  <div>
                    <p className="text-[10px] text-slate-400">PIN</p>
                    <p className="font-mono text-xs font-bold text-amber-400 mt-0.5">
                      {showCode ? selectedCard.pin : '••••'}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 mt-4">
                <label className="text-xs font-bold text-slate-700">Rejection Reason (If Rejecting)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Invalid PIN or already used"
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-600 font-medium"
                  rows={2}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <button
                disabled={isSubmitting}
                onClick={() => handleAction('rejected')}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleAction('verified')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}