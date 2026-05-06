import { useState, useEffect } from 'react';
import { Menu, X, LogOut, LayoutDashboard, Users, DollarSign, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PortalMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'admin', 'partner', or null

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const me = await base44.auth.me();
      if (me) {
        setUser(me);
        setUserType(me.role === 'admin' ? 'admin' : 'partner');
      }
    } catch (err) {
      setUser(null);
      setUserType(null);
    }
  };

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  // PortalMenu is now integrated into Layout and BuywiserHome hamburger menus
  return null;

  const adminMenuItems = [
    { label: 'Admin Dashboard', icon: LayoutDashboard, path: '/activator-admin' },
    { label: 'Manage Partners', icon: Users, path: '/admin-settings' },
    { label: 'Field Operations', icon: MapPin, path: '/field-rep-dashboard' },
    { label: 'Payments', icon: DollarSign, path: '/activator-admin' },
  ];

  const partnerMenuItems = [
    { label: 'My Opportunities', icon: LayoutDashboard, path: '/partner' },
    { label: 'VTON Dashboard', icon: MapPin, path: '/partner-leads' },
    { label: 'My Leads', icon: Users, path: '/prospects' },
  ];

  const menuItems = userType === 'admin' ? adminMenuItems : partnerMenuItems;

  return (
    <>
      {/* Portal Menu Button - Top Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-40 p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-sm"
        title={userType === 'admin' ? 'Admin Portal' : 'Partner Portal'}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Portal Menu Panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-40 w-64 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100" style={{ background: userType === 'admin' ? '#0B1F3B' : '#f3f4f6' }}>
            <p className={`text-xs font-black uppercase tracking-widest ${userType === 'admin' ? 'text-blue-300' : 'text-slate-600'}`}>
              {userType === 'admin' ? 'Admin Portal' : 'Partner Portal'}
            </p>
            <p className={`text-sm font-bold mt-1 ${userType === 'admin' ? 'text-white' : 'text-slate-900'}`}>
              {user.full_name || user.email}
            </p>
          </div>

          {/* Menu Items */}
          <nav className="py-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition border-l-2 border-transparent hover:border-blue-500"
                >
                  <Icon className="h-4 w-4 text-slate-500" />
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Logout */}
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}

      {/* Overlay - close on click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}