'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Eye, Lock, ExternalLink, Check } from 'lucide-react';

export default function VerificationCenter() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('Invalid Code or PIN');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchQueue = () => {
    fetch('https://gift-card-marketplace.onrender.com/api/admin/verification-queue')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCards(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching verification queue:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (cardId: number, status: string, reason?: string) => {
    try {
      const res = await fetch('https://gift-card-marketplace.onrender.com/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, status, reason }),
      });
      if (res.ok) {
        setSelectedCard(null);
        setShowRejectModal(false);
        fetchQueue();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Function to copy credentials and redirect to Flipkart
  const handleCheckAndRedirect = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Open Flipkart Gift Card Check page in new tab
    window.open('https://www.flipkart.com/account/giftcard', '_blank');
  };

  if (loading) return <div className="p-8 text-sm font-bold text-slate-500">Loading Verification Queue...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Verification Center</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Inspect gift card secrets and verify balance before approving for marketplace listing.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Pending Verification ({cards.length})
          </h3>
        </div>

        {cards.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            No pending cards found for verification! 🎉
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="p-4">ID</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Card Title</th>
                  <th className="p-4">Value / Selling Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Inspection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {cards.map((card) => {
                  const isSuspicious = card.card_number?.length < 8 || card.title?.length < 4;
                  return (
                    <tr key={card.id} className={`hover:bg-slate-50/50 ${isSuspicious ? 'bg-rose-50/20' : ''}`}>
                      <td className="p-4 font-mono font-bold">#LS{card.id}</td>
                      <td className="p-4 font-bold text-indigo-600">{card.brand}</td>
                      <td className="p-4 flex items-center gap-2">
                        {card.title}
                        {isSuspicious && (
                          <span className="text-[10px] bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Suspicious
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="block text-slate-900 font-bold">Face: ₹{card.balance}</span>
                        <span className="block text-emerald-600 font-bold">Offer: ₹{card.price}</span>
                      </td>
                      <td className="p-4">
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          PENDING VERIFICATION
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedCard(card)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl font-bold text-[11px] transition shadow-sm flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect Code
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  {selectedCard.brand}
                </span>
                <h3 className="font-black text-slate-900 text-lg mt-1">{selectedCard.title}</h3>
                <p className="text-xs text-slate-400 font-medium">Listing ID: #LS{selectedCard.id}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedCard(null);
                  setShowRejectModal(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 font-bold text-base"
              >
                ✕
              </button>
            </div>

            {/* Sensitive Credentials & Check Button */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between text-slate-700 font-bold text-xs">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-600" /> Sensitive Credentials
                </span>

                {/* 🔍 CHECK & REDIRECT BUTTON */}
                <button
                  onClick={() => handleCheckAndRedirect(selectedCard.card_number)}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-xl font-bold text-[11px] transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Check Balance'}
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Card Number / Voucher Code</label>
                  <div className="bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-xs font-bold text-slate-900">
                    {selectedCard.card_number}
                  </div>
                </div>

                {selectedCard.pin && (
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Security PIN</label>
                    <div className="bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-xs font-bold text-slate-900">
                      {selectedCard.pin}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Value comparison */}
            <div className="grid grid-cols-2 gap-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 text-center">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Claimed Face Value</span>
                <p className="text-base font-black text-slate-900">₹{selectedCard.balance}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Selling Price</span>
                <p className="text-base font-black text-emerald-600">₹{selectedCard.price}</p>
              </div>
            </div>

            {/* Rejection Form inside Modal */}
            {showRejectModal ? (
              <div className="space-y-3 bg-rose-50 border border-rose-200 p-4 rounded-2xl">
                <label className="block text-xs font-bold text-rose-900">Select Reason for Rejection</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-white border border-rose-200 rounded-xl p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="Invalid Code or PIN">Invalid Code or PIN</option>
                  <option value="Zero or Mismatched Balance">Zero or Mismatched Balance</option>
                  <option value="Fake / Junk Text Entry">Fake / Junk Text Entry</option>
                  <option value="Already Redeemed Code">Already Redeemed Code</option>
                </select>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="px-3 py-1.5 bg-white text-slate-600 font-bold text-xs rounded-xl border border-slate-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleAction(selectedCard.id, 'REJECTED', rejectReason)}
                    className="px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" /> Reject Card
                </button>
                <button
                  onClick={() => handleAction(selectedCard.id, 'VERIFIED')}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Verify & Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}