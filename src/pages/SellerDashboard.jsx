// pages/seller/SellerDashboard.jsx
// Full Daraz-like seller dashboard with sidebar navigation

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';
import {
  LayoutDashboard, Package, ShoppingBag, Store,
  Bell, LogOut, Menu, X, TrendingUp, ChevronRight,
  Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

// ── Sidebar nav items ─────────────────────────────────────────────────────────
const NAV = [
  { path: '/seller/dashboard',          label: 'Overview',        icon: LayoutDashboard },
  { path: '/seller/products',           label: 'Products',        icon: Package },
  { path: '/seller/orders',             label: 'Orders',          icon: ShoppingBag },
  { path: '/seller/store',              label: 'My Store',        icon: Store },
];

export default function SellerDashboard() {
  const { seller, logout, isApproved, isPending, sellerAxios } = useSellerAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [stats,        setStats]        = useState(null);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!seller) { navigate('/seller/login'); return; }
    fetchStats();
    fetchNotifications();
  }, [seller]);

  const fetchStats = async () => {
    try {
      const res = await sellerAxios.get('/api/seller/stats/');
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await sellerAxios.get('/api/seller/notifications/');
      setNotifications(res.data);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => { logout(); navigate('/seller/login'); };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // ── Status banner ──────────────────────────────────────────────────────────
  const StatusBanner = () => {
    if (!seller) return null;
    const config = {
      pending:  { bg: 'bg-amber-50 border-amber-200',  text: 'text-amber-800',  icon: Clock,         msg: 'Your account is under review. Our team will approve it within 2–3 business days.' },
      rejected: { bg: 'bg-red-50 border-red-200',      text: 'text-red-800',    icon: XCircle,       msg: `Application rejected. ${seller.rejection_note || 'Please contact support.'}` },
      banned:   { bg: 'bg-red-50 border-red-200',      text: 'text-red-800',    icon: AlertCircle,   msg: 'Your account has been suspended. Contact support.' },
      approved: null,
    }[seller.status];

    if (!config) return null;
    const Icon = config.icon;
    return (
      <div className={`border rounded-lg p-4 mb-6 flex gap-3 ${config.bg}`}>
        <Icon size={18} className={`flex-shrink-0 mt-0.5 ${config.text}`} />
        <p className={`text-sm ${config.text}`}>{config.msg}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-[240px] bg-white border-r border-gray-100 z-50
        transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <Link to="/" className="border border-[#A33B26] px-3 py-1">
            <span className="text-[#A33B26] text-sm font-bold tracking-[0.2em] uppercase">SOMAGOAM</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Seller info */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A33B26] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {seller?.company_name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{seller?.company_name}</p>
              <p className="text-xs text-gray-400 truncate">{seller?.email}</p>
            </div>
          </div>

          {/* Status pill */}
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
              seller?.status === 'approved' ? 'bg-green-100 text-green-700' :
              seller?.status === 'pending'  ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {seller?.status === 'approved' ? <CheckCircle size={10} /> : <Clock size={10} />}
              {seller?.status}
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="p-4 space-y-1 flex-1">
          {NAV.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                location.pathname === path
                  ? 'bg-[#A33B26]/10 text-[#A33B26] font-bold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              <Icon size={18} />
              {label}
              {location.pathname === path && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded text-sm text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600">
              <Menu size={22} />
            </button>
            <h1 className="text-base font-bold text-gray-800">Seller Center</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications bell */}
            <button className="relative text-gray-500 hover:text-[#A33B26]">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A33B26] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* View public store */}
            {isApproved && seller?.slug && (
              <Link to={`/producers/${seller.slug}`} target="_blank"
                className="hidden sm:flex items-center gap-1 text-xs text-[#A33B26] font-bold border border-[#A33B26] px-3 py-1.5 hover:bg-[#A33B26] hover:text-white transition-colors">
                View Store
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <StatusBanner />

          {/* ── Overview Stats ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Products', value: stats?.total_products ?? '—',  icon: Package,      color: 'text-blue-500',  bg: 'bg-blue-50'  },
              { label: 'Total Orders',   value: stats?.total_sales    ?? '—',  icon: ShoppingBag,  color: 'text-green-500', bg: 'bg-green-50' },
              { label: 'Total Revenue',  value: stats ? `৳${stats.total_revenue}` : '—', icon: TrendingUp, color: 'text-[#A33B26]', bg: 'bg-red-50' },
              { label: 'Rating',         value: stats?.rating         ?? '—',  icon: Store,        color: 'text-amber-500', bg: 'bg-amber-50' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
                <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="text-2xl font-bold text-gray-800">{value}</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>

          {/* ── Quick actions ─────────────────────────────────────────── */}
          {isApproved && (
            <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm mb-8">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Add Product',    path: '/seller/products/new', icon: '➕' },
                  { label: 'View Orders',    path: '/seller/orders',       icon: '📦' },
                  { label: 'Edit Store',     path: '/seller/store',        icon: '✏️' },
                  { label: 'Public Profile', path: `/producers/${seller?.slug}`, icon: '🌐', external: true },
                ].map(a => (
                  <Link key={a.label} to={a.path} target={a.external ? '_blank' : undefined}
                    className="flex flex-col items-center gap-2 p-4 border border-gray-100 rounded-lg hover:border-[#A33B26] hover:bg-[#A33B26]/5 transition-all text-center">
                    <span className="text-2xl">{a.icon}</span>
                    <span className="text-xs font-semibold text-gray-600">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Pending — complete profile CTA */}
          {isPending && (
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 mb-2">
                Complete your profile while you wait ✍️
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Add your logo, banner, and bio so your store is ready to go once approved.
              </p>
              <Link to="/seller/store"
                className="inline-block bg-[#A33B26] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded hover:bg-[#8B2F1D]">
                Complete Store Profile
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
