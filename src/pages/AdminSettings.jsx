import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Settings, LogOut, AlertCircle } from "lucide-react";
import AdminSMSSettings from "@/components/AdminSMSSettings";

export default function AdminSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const me = await base44.auth.me();
      if (!me || me.role !== "admin") {
        base44.auth.redirectToLogin();
        return;
      }
      setUser(me);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img
                src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
                alt="BuyWiser"
                className="h-8 w-auto opacity-80"
              />
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-600" />
              <h1 className="text-lg font-bold text-slate-800">Admin Settings</h1>
            </div>
          </div>
          <button
            onClick={() => base44.auth.logout()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-start gap-3 mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-bold mb-1">Admin Settings</p>
            <p>Configure SMS notifications, partner assignments, and system-wide settings.</p>
          </div>
        </div>

        {/* SMS Settings Section */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">📱 SMS Notifications</h2>
          <AdminSMSSettings />
        </div>
      </div>
    </div>
  );
}