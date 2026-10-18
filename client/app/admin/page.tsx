'use client';
import { useEffect, useState } from 'react';
import { 
  Users, ShoppingBag, ArrowUpRight, ShieldCheck, Banknote, 
  TrendingUp, TrendingDown, CheckCircle2, Clock, XCircle, ArrowUp
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';

// Chart Dummy Data (Matching Screenshot Visuals)
const lineData = [
  { name: 'Oct 1', buy: 20, sell: 10 },
  { name: 'Oct 2', buy: 28, sell: 14 },
  { name: 'Oct 3', buy: 21, sell: 11 },
  { name: 'Oct 4', buy: 42, sell: 28 },
  { name: 'Oct 5', buy: 34, sell: 20 },
  { name: 'Oct 6', buy: 35, sell: 20 },
  { name: 'Oct 7', buy: 48, sell: 28 },
  { name: 'Oct 8', buy: 65, sell: 45 },
  { name: 'Oct 9', buy: 42, sell: 32 },
  { name: 'Oct 10', buy: 48, sell: 30 },
  { name: 'Oct 11', buy: 57, sell: 43 },
  { name: 'Oct 12', buy: 71, sell: 44 },
];

const barData = [
  { name: 'Oct 1', revenue: 15, profit: 8 },
  { name: 'Oct 4', revenue: 20, profit: 12 },
  { name: 'Oct 7', revenue: 25, profit: 15 },
  { name: 'Oct 10', revenue: 30, profit: 19 },
  { name: 'Oct 12', revenue: 38, profit: 25 },
];

const userGrowthData = [
  { name: 'Oct 1', count: 30 },
  { name: 'Oct 3', count: 45 },
  { name: 'Oct 5', count: 70 },
  { name: 'Oct 7', count: 90 },
  { name: 'Oct 9', count: 110 },
  { name: 'Oct 11', count: 145 },
];

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/stats')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load admin stats:', err);
        setLoading(false);
      });
  }, []);

  const stats = data?.stats || { totalUsers: 1250, totalBuyOrders: 86, totalSellRequests: 64, pendingVerifications: 12 };

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Welcome back, Admin! Here's an overview of your gift card business.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm text-xs font-semibold text-slate-600">
          <span>Oct 1, 2026 - Oct 12, 2026</span>
        </div>
      </div>

      {/* 1. TOP 5 METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-black text-slate-900">{stats.totalUsers}</h3>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> 12%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">+134 this month</p>
          </div>
        </div>

        {/* Buy Orders */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Buy Orders</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-black text-slate-900">{stats.totalBuyOrders}</h3>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> 18%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">+13 this week</p>
          </div>
        </div>

        {/* Sell Requests */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sell Requests</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-black text-slate-900">{stats.totalSellRequests}</h3>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> 25%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">+16 this week</p>
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Verification</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-black text-slate-900">{stats.pendingVerifications}</h3>
              <span className="text-[10px] font-bold text-rose-500 flex items-center"><TrendingDown className="w-3 h-3 mr-0.5" /> 20%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Review required</p>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Banknote className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Payouts</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-black text-slate-900">₹24,500</h3>
              <span className="text-[10px] font-bold text-rose-500 flex items-center"><TrendingDown className="w-3 h-3 mr-0.5" /> 10%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">5 withdrawal requests</p>
          </div>
        </div>
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Transaction Overview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Transaction Overview</h3>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Buy Orders</span>
              <span className="flex items-center gap-1.5 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Sell Orders</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="buy" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="sell" stroke="#10b981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Revenue & Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-900 text-sm">Revenue & Profit</h3>
            <span className="text-xs text-slate-400 font-medium">This Month</span>
          </div>
          <div className="flex gap-6 mb-4">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Revenue</p>
              <h4 className="text-lg font-black text-slate-900">₹1,25,000 <span className="text-xs text-emerald-600 font-bold">↑ 18%</span></h4>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Net Profit</p>
              <h4 className="text-lg font-black text-slate-900">₹28,500 <span className="text-xs text-emerald-600 font-bold">↑ 24%</span></h4>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. THREE TABLES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Buy Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Buy Orders</h3>
            <span className="text-xs text-indigo-600 font-bold cursor-pointer">View All</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[10px]">
                <th className="pb-2">#ID</th>
                <th className="pb-2">User</th>
                <th className="pb-2">Brand</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              <tr>
                <td className="py-2.5 font-mono text-[11px]">LB1023</td>
                <td className="py-2.5">rohan12</td>
                <td className="py-2.5 font-bold">Amazon</td>
                <td className="py-2.5">₹920</td>
                <td className="py-2.5"><span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold text-[10px]">Completed</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-[11px]">LB1022</td>
                <td className="py-2.5">priya45</td>
                <td className="py-2.5 font-bold">Google Play</td>
                <td className="py-2.5">₹460</td>
                <td className="py-2.5"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold text-[10px]">Processing</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-[11px]">LB1021</td>
                <td className="py-2.5">amit2026</td>
                <td className="py-2.5 font-bold">Flipkart</td>
                <td className="py-2.5">₹1,840</td>
                <td className="py-2.5"><span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold text-[10px]">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Recent Sell Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Sell Requests</h3>
            <span className="text-xs text-indigo-600 font-bold cursor-pointer">View All</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[10px]">
                <th className="pb-2">#ID</th>
                <th className="pb-2">User</th>
                <th className="pb-2">Brand</th>
                <th className="pb-2">Offer</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              <tr>
                <td className="py-2.5 font-mono text-[11px]">LS1024</td>
                <td className="py-2.5">vikas21</td>
                <td className="py-2.5 font-bold">Amazon</td>
                <td className="py-2.5">₹880</td>
                <td className="py-2.5"><span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold text-[10px]">Under Review</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-[11px]">LS1023</td>
                <td className="py-2.5">neha88</td>
                <td className="py-2.5 font-bold">Google Play</td>
                <td className="py-2.5">₹425</td>
                <td className="py-2.5"><span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold text-[10px]">Pending</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-[11px]">LS1022</td>
                <td className="py-2.5">raju90</td>
                <td className="py-2.5 font-bold">Flipkart</td>
                <td className="py-2.5">₹860</td>
                <td className="py-2.5"><span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold text-[10px]">Verified</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verification Queue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Verification Queue</h3>
            <span className="text-xs text-indigo-600 font-bold cursor-pointer">View All</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <div>
                <p className="text-xs font-bold text-slate-900">LS1024 • ₹1,000 • vikas21</p>
                <p className="text-[10px] text-slate-400">10 min ago</p>
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg">Verify</button>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <div>
                <p className="text-xs font-bold text-slate-900">LS1023 • ₹500 • neha88</p>
                <p className="text-[10px] text-slate-400">25 min ago</p>
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg">Verify</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">LS1018 • ₹1,000 • arjun77</p>
                <p className="text-[10px] text-slate-400">1 hour ago</p>
              </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold px-3 py-1 rounded-lg">Verify</button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Brands */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Top Brands (Sales)</h3>
            <span className="text-xs text-indigo-600 font-bold cursor-pointer">View All</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Amazon</span>
                <span className="text-slate-400">32% (450 orders)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Google Play</span>
                <span className="text-slate-400">24% (320 orders)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Flipkart</span>
                <span className="text-slate-400">18% (250 orders)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-900 text-sm">User Growth</h3>
            <span className="text-xs text-indigo-600 font-bold cursor-pointer">View All</span>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <Bar dataKey="count" fill="#818cf8" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Activities</h3>
            <span className="text-xs text-indigo-600 font-bold cursor-pointer">View All</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex gap-2.5 items-start">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">New user registered</p>
                <p className="text-[10px] text-slate-400">rohan12 joined the platform • 10 min ago</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <ShoppingBag className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Buy order completed</p>
                <p className="text-[10px] text-slate-400">Order LB1023 payment confirmed • 25 min ago</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <ArrowUpRight className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">New sell request</p>
                <p className="text-[10px] text-slate-400">Order LS1024 submitted • 1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}