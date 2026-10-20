
'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Eye, Copy, ExternalLink, AlertCircle } from 'lucide-react';

interface GiftCard {
  id: number;
  title: string;
  brand: string;
  card_number: string;
  pin: string;
  balance: number;
  price: number;
  status: string;
  seller_id: number;
  created_at: string;
}

export default function VerificationCenter() {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch pending verification queue
  const fetchQueue = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/verification-queue'); // Apne backend URL ke hisab se change karein
      const data = await res.json();
      setCards(data);
    } catch (err) {
      console.error('Error fetching verification queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  // Handle Status Update (Verify or Reject)
  const handleStatusUpdate = async (id: number, status: 'verified' | 'rejected') => {
    try {
      setActionLoading(true);
      const res = await fetch(`http://localhost:5000/api/admin/sell-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setCards(cards.filter(card => card.id !== id));
        setIsModalOpen(false);
        setSelectedCard(null);
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" /> Verification Center
          </h1>
          <p className="text-sm text-gray-500">Inspect secrets, verify balance, and confirm listing validity.</p>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
          {cards.length} Pending
        </span>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading verification queue...</p>
      ) : cards.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
          <p className="text-sm text-gray-500">No pending gift cards require verification right now.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Card ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Face Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asking Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller ID</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Inspection</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#LS{card.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{card.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₹{card.balance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">₹{card.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">User #{card.seller_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => { setSelectedCard(card); setIsModalOpen(true); }}
                      className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 transition"
                    >
                      <Eye size={14} /> Inspect Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspection Modal */}
      {isModalOpen && selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Inspect Gift Card</h3>
            <p className="text-xs text-gray-500 mb-4">Review card credentials securely before making a decision.</p>

            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Brand:</span>
                <span className="font-semibold text-gray-900">{selectedCard.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Face Value (Balance):</span>
                <span className="font-semibold text-gray-900">₹{selectedCard.balance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Asking Selling Price:</span>
                <span className="font-semibold text-indigo-600">₹{selectedCard.price}</span>
              </div>

              <hr className="border-gray-200" />

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Card Number / Code:</label>
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-300 font-mono text-sm">
                  <span>{selectedCard.card_number}</span>
                  <button onClick={() => copyToClipboard(selectedCard.card_number)} className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1">
                    <Copy size={14} /> Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">PIN / Password:</label>
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-300 font-mono text-sm">
                  <span>{selectedCard.pin || 'N/A'}</span>
                  {selectedCard.pin && (
                    <button onClick={() => copyToClipboard(selectedCard.pin)} className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1">
                      <Copy size={14} /> Copy
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                disabled={actionLoading}
                onClick={() => handleStatusUpdate(selectedCard.id, 'rejected')}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-xl text-sm transition flex items-center gap-1.5"
              >
                <XCircle size={16} /> Reject Card
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleStatusUpdate(selectedCard.id, 'verified')}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 font-medium rounded-xl text-sm transition flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 size={16} /> Verify & Live
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}