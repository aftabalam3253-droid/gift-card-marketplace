'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Search, CheckCircle2 } from 'lucide-react';

export default function SellPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    card_number: '',
    pin: '',
    balance: '',
    price: '',
  });

  const [dbBrands, setDbBrands] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch brands from database
  useEffect(() => {
    fetch('https://gift-card-marketplace.onrender.com/api/cards/brands')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDbBrands(data);
      })
      .catch((err) => console.error('Error loading brands:', err));

    // Outside click handle to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const popularBrands = dbBrands.filter((b) => b.is_popular).slice(0, 5);
  
  const filteredBrands = dbBrands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isExactMatch = dbBrands.some(
    (b) => b.name.toLowerCase() === searchTerm.trim().toLowerCase()
  );

  const handleSelectBrand = (brandName: string) => {
    setFormData({ ...formData, brand: brandName });
    setSearchTerm(brandName);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    try {
      const response = await fetch('https://gift-card-marketplace.onrender.com/api/cards/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          brand: formData.brand || searchTerm,
          seller_id: user?.id || 1,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ title: '', brand: '', card_number: '', pin: '', balance: '', price: '' });
        setSearchTerm('');
        
        // Refresh brand list in background
        fetch('https://gift-card-marketplace.onrender.com/api/cards/brands')
          .then((res) => res.json())
          .then((data) => Array.isArray(data) && setDbBrands(data));
      } else {
        alert('Failed to list gift card.');
      }
    } catch (error) {
      console.error('Error creating card:', error);
      alert('Error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6 font-sans">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8">
          <h1 className="text-2xl font-black text-slate-900 text-center">Sell Your Gift Card 🚀</h1>
          <p className="text-xs text-slate-500 text-center mt-1 mb-8">List your unused gift card and turn it into cash instantly.</p>

          {success && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Gift Card listed successfully! Brand saved to database.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* BRAND SEARCH & SELECTOR */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select or Search Brand</label>

              {/* Popular Quick Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] font-bold text-slate-400 self-center">Popular:</span>
                {popularBrands.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBrand(b.name)}
                    className={`text-xs px-3 py-1 rounded-full border font-semibold transition cursor-pointer ${
                      formData.brand === b.name
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              {/* Searchable Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Type to search or enter new brand..."
                  value={searchTerm}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFormData({ ...formData, brand: e.target.value });
                    setShowDropdown(true);
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm font-medium"
                />
              </div>

              {/* Autocomplete Dropdown List */}
              {showDropdown && (searchTerm.length > 0 || filteredBrands.length > 0) && (
                <div className="absolute z-30 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-56 overflow-y-auto">
                  {filteredBrands.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => handleSelectBrand(b.name)}
                      className="px-4 py-3 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-sm font-medium cursor-pointer transition flex justify-between items-center"
                    >
                      <span>{b.name}</span>
                      {b.is_popular && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Popular</span>}
                    </div>
                  ))}

                  {/* Add New Custom Brand Option */}
                  {searchTerm.trim() !== '' && !isExactMatch && (
                    <div
                      onClick={() => handleSelectBrand(searchTerm.trim())}
                      className="px-4 py-3 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-700 text-sm font-bold cursor-pointer transition border-t border-indigo-100 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-indigo-600" />
                      Add "{searchTerm}" as new brand
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Card Title / Description</label>
              <input
                type="text"
                required
                placeholder="e.g., $100 Gift Card"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Card Code</label>
                <input
                  type="text"
                  required
                  placeholder="Enter secret code"
                  value={formData.card_number}
                  onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">PIN (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter PIN if any"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Face Value (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="1000"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="850"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition text-sm cursor-pointer"
            >
              {loading ? 'Listing Card...' : 'List Gift Card for Sale'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}