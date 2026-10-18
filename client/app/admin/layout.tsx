'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Tag, ShoppingCart, ArrowUpRight, 
  ShieldCheck, Wallet, Ticket, Headphones, BarChart3, 
  Settings, Bell, Search, FileText, Lock
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar - Complete with all navigation items */}
      <aside className="w-64 bg-[#111827] text-slate-300 flex flex-col fixed h-full z-20 shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-white font-black text-xl tracking-wider">LIQ200</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5 font-semibold">Gift Card Admin Panel</p>
        </div>

        {/* Scrollable Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 text-xs font-semibold custom-scrollbar">
          <Link href="/admin" className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${pathname === '/admin' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          
          <Link href="/admin/users" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <Users className="w-4 h-4" /> Users
          </Link>

          {/* Gift Cards Section */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Management</div>
          <Link href="/admin/gift-cards" className="flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <Tag className="w-4 h-4" /> Gift Cards
          </Link>
          <Link href="/admin/brands" className="flex items-center gap-3 px-7 py-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition text-[11px]">
            • Brands
          </Link>
          <Link href="/admin/inventory" className="flex items-center gap-3 px-7 py-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition text-[11px]">
            • Inventory
          </Link>

          {/* Orders Section */}
          <Link href="/admin/buy-orders" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition mt-2">
            <ShoppingCart className="w-4 h-4" /> Buy Orders
          </Link>
          <Link href="/admin/sell-requests" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <ArrowUpRight className="w-4 h-4" /> Sell Requests
          </Link>
          <Link href="/admin/verification" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <ShieldCheck className="w-4 h-4" /> Verification Center
          </Link>

          {/* Finance & Payouts */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Finance</div>
          <Link href="/admin/wallets" className="flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <Wallet className="w-4 h-4" /> Wallets & Payouts
          </Link>
          <Link href="/admin/coupons" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <Ticket className="w-4 h-4" /> Coupons
          </Link>

          {/* Support & System */}
          <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">System</div>
          <Link href="/admin/support" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <Headphones className="w-4 h-4" /> Support Tickets
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <BarChart3 className="w-4 h-4" /> Reports & Analytics
          </Link>
          <Link href="/admin/roles" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <Lock className="w-4 h-4" /> Admin Roles
          </Link>
          <Link href="/admin/audit-logs" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <FileText className="w-4 h-4" /> Audit Logs
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text" 
              placeholder="Search users, orders, cards..." 
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-600 font-medium"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 relative text-slate-600">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-1.5 right-1.5"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md">A</span>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">Admin</p>
                <p className="text-[10px] text-slate-400 font-semibold">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}