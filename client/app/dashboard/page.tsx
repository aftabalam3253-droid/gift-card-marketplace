'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Tag, Key, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'purchases' | 'listings'>('purchases');
  const [purchasedCards, setPurchasedCards] = useState<any[]>([]);
  const [listedCards, setListedCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Fetch user's purchased & listed cards
    Promise.all([
      fetch(`https://gift-card-marketplace.onrender.com/api/cards/my-purchases/${userData.id}`).then((res) => res.json()),
      fetch(`https://gift-card-marketplace.onrender.com/api/cards/my-listings/${userData.id}`).then((res) => res.json()),
    ])
      .then(([purchases, listings]) => {
        if (Array.isArray(purchases)) setPurchasedCards(purchases);
        if (Array.isArray(listings)) setListedCards(listings);
      })
      .catch((err) => console.error('Error fetching dashboard data:', err))
      .finally(() => setLoading(false));
  }, [router]);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-bold text-sm animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        {/* Profile Header */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Welcome, {user.name} 👋</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">{user.email}</p>
          </div>
          <Link
            href="/sell"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-indigo-100 transition cursor-pointer"
          >
            + Sell New Gift Card
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'purchases'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            My Purchased Cards ({purchasedCards.length})
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'listings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Tag className="w-4 h-4" />
            My Listed Cards ({listedCards.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'purchases' ? (
          <div>
            {purchasedCards.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                <p className="text-slate-500 text-sm">You haven't purchased any gift cards yet.</p>
                <Link href="/" className="inline-block mt-4 text-xs font-bold text-indigo-600 hover:underline">
                  Browse Marketplace Cards →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchasedCards.map((card) => (
                  <div key={card.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {card.brand}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        Price Paid: ₹{card.price}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{card.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Value: ₹{card.balance}</p>

                    <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 p-3 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Card Code:</span>
                        <span className="font-mono font-bold text-indigo-600 select-all">{card.card_number}</span>
                      </div>
                      {card.pin && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">PIN:</span>
                          <span className="font-mono font-bold text-slate-800 select-all">{card.pin}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {listedCards.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                <p className="text-slate-500 text-sm">You haven't listed any gift cards for sale yet.</p>
                <Link href="/sell" className="inline-block mt-4 text-xs font-bold text-indigo-600 hover:underline">
                  List a Card Now →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listedCards.map((card) => (
                  <div key={card.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                          {card.brand}
                        </span>
                        {card.is_sold ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Sold
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                            <Clock className="w-3 h-3" /> Listed for Sale
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{card.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">Value: ₹{card.balance}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Selling Price:</span>
                      <span className="font-black text-slate-900 text-sm">₹{card.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}