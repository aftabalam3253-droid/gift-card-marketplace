'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShieldCheck, Zap, Users, ChevronRight, Plus, Menu, X, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [bestSellingCards, setBestSellingCards] = useState<any[]>([]);
  
  // Checkout Modal States
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [buying, setBuying] = useState(false);
  const [purchasedDetails, setPurchasedDetails] = useState<any>(null);

  const pathname = usePathname();

  const fetchCards = () => {
    fetch('http://localhost:5000/api/cards')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBestSellingCards(data);
        }
      })
      .catch((err) => console.error('Error fetching cards:', err));
  };

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchCards();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const handleBuyClick = (card: any) => {
    if (!user) {
      alert('Please login first to purchase gift cards!');
      router.push('/login');
      return;
    }
    setSelectedCard(card);
    setPurchasedDetails(null);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedCard) return;
    setBuying(true);

    try {
      const response = await fetch('http://localhost:5000/api/cards/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: selectedCard.id,
          buyerId: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPurchasedDetails(data);
        fetchCards(); // Refresh cards to hide sold one
      } else {
        alert(data.message || 'Purchase failed');
      }
    } catch (error) {
      console.error('Error purchasing card:', error);
      alert('Failed to connect to server');
    } finally {
      setBuying(false);
    }
  };

  const popularBrands = [
    { name: 'Amazon', logo: '🛒' },
    { name: 'Flipkart', logo: '🛍️' },
    { name: 'Google Play', logo: '▶️' },
    { name: 'Myntra', logo: '👗' },
    { name: 'Zomato', logo: '🍕' },
    { name: 'Starbucks', logo: '☕' },
  ];

  const categories = [
    { name: 'E-commerce', icon: '🛒' },
    { name: 'Food & Beverages', icon: '🍔' },
    { name: 'Entertainment', icon: '🍿' },
    { name: 'Fashion & Lifestyle', icon: '👕' },
    { name: 'Gaming', icon: '🎮' },
    { name: 'Travel', icon: '✈️' },
    { name: 'Others', icon: '✨' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="bg-indigo-600 group-hover:bg-indigo-700 transition text-white p-2 rounded-xl font-black text-xl shadow-md shadow-indigo-200">
              🎁
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              GiftKart
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
            <Link 
              href="/" 
              className={`transition cursor-pointer ${pathname === '/' ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1' : 'hover:text-indigo-600'}`}
            >
              Home
            </Link>
            <a href="#cards" className="hover:text-indigo-600 transition cursor-pointer">
              Buy Gift Cards
            </a>
            <Link 
              href="/sell" 
              className={`transition cursor-pointer ${pathname === '/sell' ? 'text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1' : 'hover:text-indigo-600'}`}
            >
              Sell Gift Cards
            </Link>
            <a href="#features" className="hover:text-indigo-600 transition cursor-pointer">
              How It Works
            </a>
            <a href="#about" className="hover:text-indigo-600 transition cursor-pointer">
              About
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Search className="w-5 h-5 text-slate-400 cursor-pointer hover:text-indigo-600 transition" />
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="text-sm font-bold text-indigo-600 hover:underline">
                  Hi, {user.name} 👤
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition cursor-pointer"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-700 cursor-pointer">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl py-6 px-6 flex flex-col gap-4 text-center font-medium animate-fadeIn">
            <Link 
              href="/" 
              className={`py-2 rounded-xl transition cursor-pointer ${pathname === '/' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
            >
              Home
            </Link>
            <a href="#cards" className="py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer">
              Buy Gift Cards
            </a>
            <Link 
              href="/sell" 
              className={`py-2 rounded-xl transition cursor-pointer ${pathname === '/sell' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
            >
              Sell Gift Cards
            </Link>
            <a href="#features" className="py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition cursor-pointer">
              How It Works
            </a>
            <div className="pt-3 border-t border-slate-100 mt-2">
              {user ? (
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-bold text-slate-700">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition cursor-pointer shadow-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href="/login" 
                    className="py-2.5 text-sm font-semibold border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition text-center cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition text-center cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-slate-50 to-white py-12 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900">
              Buy & Sell <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Gift Cards
              </span> with Confidence
            </h1>
            <p className="text-slate-600 text-lg max-w-lg">
              Get the best deals on popular brand gift cards or sell your unused gift cards at great prices. Fast, secure and hassle-free!
            </p>

            <div className="flex items-center bg-white p-2 rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-200 max-w-lg">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                placeholder="Search for brands (Amazon, Flipkart, etc.)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 outline-none text-sm text-slate-700 bg-transparent"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition cursor-pointer">
                Search
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-600">100% Secure Transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-600">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-600">Trusted by Thousands</span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-md h-80 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-3xl p-6 flex items-center justify-center">
              <div className="absolute top-4 right-4 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl w-48 transform rotate-6 border border-slate-700">
                <div className="text-xs font-bold text-amber-400">amazon</div>
                <div className="text-sm font-semibold mt-2">Gift Card</div>
              </div>
              <div className="absolute bottom-6 left-4 bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl w-48 transform -rotate-6">
                <div className="text-xs font-bold text-cyan-200">Google Play</div>
                <div className="text-sm font-semibold mt-2">$50 Balance</div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-rose-500 text-white p-4 rounded-2xl shadow-2xl w-48 rotate-3">
                <div className="text-xs font-bold text-rose-100">ZOMATO</div>
                <div className="text-sm font-semibold mt-2">Food Voucher</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- POPULAR BRANDS --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Popular Brands</h2>
            <p className="text-slate-500 text-sm">Choose from top brands and get the best deals.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {popularBrands.map((brand, idx) => (
            <div key={idx} className="bg-white hover:border-indigo-500 border border-slate-100 shadow-sm hover:shadow-md transition rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer group">
              <span className="text-3xl mb-2 group-hover:scale-110 transition">{brand.logo}</span>
              <span className="text-xs font-semibold text-slate-700">{brand.name}</span>
            </div>
          ))}
          <div className="bg-white hover:border-indigo-500 border border-slate-100 shadow-sm hover:shadow-md transition rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer">
            <Plus className="w-6 h-6 text-indigo-600 mb-1" />
            <span className="text-xs font-semibold text-indigo-600">View All</span>
          </div>
        </div>
      </section>

      {/* --- LIVE MARKETPLACE CARDS --- */}
      <section id="cards" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Live Marketplace Gift Cards</h2>
          <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1 cursor-pointer">
            View All <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        
        {bestSellingCards.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm">No gift cards listed yet. Be the first to sell one!</p>
            <Link href="/sell" className="inline-block mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold">
              Sell Gift Card 🚀
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {bestSellingCards.map((card) => (
              <div key={card.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition flex flex-col justify-between group">
                <div>
                  <div className="h-28 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex flex-col justify-between text-white relative overflow-hidden shadow-inner">
                    <span className="self-end bg-black/20 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                    <span className="font-bold text-lg tracking-wide">{card.brand}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mt-3">{card.title}</h3>
                  <p className="text-slate-400 text-xs mt-1">Value: ₹{card.balance}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Selling Price</span>
                    <span className="text-base font-black text-emerald-600">₹{card.price}</span>
                  </div>
                  <button
                    onClick={() => handleBuyClick(card)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 transition cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- BUY CHECKOUT MODAL --- */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {!purchasedDetails ? (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Purchase 💳</h3>
                <p className="text-slate-500 text-xs mb-6">Review your card details before confirming payment.</p>

                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase">{selectedCard.brand}</span>
                    <span className="text-xs font-extrabold text-slate-900">Value: ₹{selectedCard.balance}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">{selectedCard.title}</div>
                  <div className="mt-4 pt-3 border-t border-indigo-100/60 flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-semibold">Total Price:</span>
                    <span className="text-lg font-black text-emerald-600">₹{selectedCard.price}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmPurchase}
                  disabled={buying}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 transition text-sm cursor-pointer"
                >
                  {buying ? 'Processing Payment...' : 'Confirm & Pay Now'}
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-xl font-black text-slate-900">Purchase Successful! 🎉</h3>
                <p className="text-slate-500 text-xs mt-1 mb-6">Here is your gift card access information:</p>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left space-y-3 mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Card Number / Code</span>
                    <span className="text-sm font-extrabold text-indigo-600 tracking-wider select-all">{purchasedDetails.cardCode}</span>
                  </div>
                  {purchasedDetails.cardPin && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">PIN</span>
                      <span className="text-sm font-extrabold text-slate-800 tracking-wider select-all">{purchasedDetails.cardPin}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedCard(null)}
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SHOP BY CATEGORY --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Shop by Category</h2>
          <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1 cursor-pointer">
            View All <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white hover:border-indigo-500 border border-slate-100 shadow-sm transition rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer group">
              <span className="text-2xl mb-2 group-hover:scale-110 transition">{cat.icon}</span>
              <span className="text-xs font-semibold text-slate-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- SELL BANNER --- */}
      <section id="sell" className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row justify-between items-center gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-black">Got Unused Gift Cards?</h2>
            <p className="text-indigo-200 text-sm">
              Sell your gift cards and get the best value instantly. Safe, fast and verified payouts.
            </p>
            <Link href="/sell" className="inline-block bg-white text-indigo-900 hover:bg-indigo-50 px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition cursor-pointer">
              Sell Gift Card 🚀
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-indigo-100">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-md">
              ✅ Quick & Easy Process
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-md">
              ✅ Best Market Rates
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-md">
              ✅ Secure & Reliable
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-md">
              ✅ Get Paid Fast
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 px-6 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-2 rounded-xl font-black text-lg">🎁</div>
              <span className="text-xl font-extrabold text-white">GiftKart</span>
            </div>
            <p className="text-sm">Buy. Sell. Save.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white transition cursor-pointer">Home</Link></li>
              <li><a href="#cards" className="hover:text-white transition cursor-pointer">Buy Gift Cards</a></li>
              <li><Link href="/sell" className="hover:text-white transition cursor-pointer">Sell Gift Cards</Link></li>
              <li><a href="#features" className="hover:text-white transition cursor-pointer">How It Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition cursor-pointer">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition cursor-pointer">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition cursor-pointer">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition cursor-pointer">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Follow Us</h4>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white cursor-pointer transition">f</span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white cursor-pointer transition">in</span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white cursor-pointer transition">t</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p>© 2026 GiftKart. All rights reserved.</p>
          <p className="mt-4 sm:mt-0 text-slate-500">Made with ❤️ for Gift Card Lovers</p>
        </div>
      </footer>
    </div>
  );
}