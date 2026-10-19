'use client';

import { useEffect, useState } from 'react';

interface Card {
  id: number;
  title: string;
  brand: string;
  balance: number;
  price: number;
  card_number: string;
}

export default function BuyCardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

  useEffect(() => {
    fetch('https://gift-card-marketplace.onrender.com/api/cards')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCards(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching cards:', err);
        setLoading(false);
      });
  }, []);

  // Filter cards based on search and selected brand
  const filteredCards = cards.filter((card) => {
    const matchesSearch = card.title.toLowerCase().includes(search.toLowerCase()) || 
                          card.brand.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || card.brand.toLowerCase() === selectedBrand.toLowerCase();
    return matchesSearch && matchesBrand;
  });

  const brandsList = ['All', ...Array.from(new Set(cards.map((card) => card.brand)))];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Buy Gift Cards 🎁
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Browse discounted gift cards from top brands and save instantly on your purchases.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search gift cards or brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {brandsList.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedBrand.toLowerCase() === brand.toLowerCase()
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Card Grid / Loading / Empty State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent mb-4"></div>
            <p className="text-gray-500 text-lg font-medium">Fetching available gift cards...</p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-xl font-semibold mb-2">No Gift Cards Found</p>
            <p className="text-gray-400">Try changing your search or brand filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => {
              const discount = Math.round(((card.balance - card.price) / card.balance) * 100);

              return (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
                        {card.brand}
                      </span>
                      {discount > 0 && (
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h2>

                    <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-50">
                      <span>Face Value:</span>
                      <span className="font-semibold text-gray-700 line-through">₹{card.balance}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 flex items-center justify-between border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Selling Price</span>
                      <span className="text-2xl font-extrabold text-indigo-600">₹{card.price}</span>
                    </div>

                    <button
                      onClick={() => alert(`Purchase requested for: ${card.title}`)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all text-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}