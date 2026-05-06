import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { LogOut, Lock, LayoutDashboard, Users, MapPin, Shield } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const roles = [
  {
    id: "partner",
    label: "VTON Partner",
    icon: Users,
    description: "Manage veteran transition opportunities",
    path: "/partner",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-700",
  },
  {
    id: "field-activator",
    label: "Field Activator",
    icon: MapPin,
    description: "Track door-knock activities & earn payouts",
    path: "/field-activator",
    color: "bg-green-50 border-green-200",
    textColor: "text-green-700",
  },
  {
    id: "admin",
    label: "Admin Dashboard",
    icon: Shield,
    description: "Manage partners, leads & operations",
    path: "/activator-admin",
    color: "bg-slate-50 border-slate-200",
    textColor: "text-slate-700",
  },
  {
    id: "home",
    label: "Public Site",
    icon: LayoutDashboard,
    description: "Browse programs & request a review",
    path: "/",
    color: "bg-amber-50 border-amber-200",
    textColor: "text-amber-600",
  },
];

export default function PortalHub() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: NAVY }}>
        <div className="text-white text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: NAVY }}>
      {/* Header */}
      <div className="px-4 py-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto opacity-80" />
          <div>
            <p className="text-white font-bold text-sm">BuyWiser Portal Hub</p>
            {user && <p className="text-blue-300 text-xs">{user.full_name || user.email}</p>}
          </div>
        </div>
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-white/30 text-white rounded-lg hover:bg-white/10 transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-3">Welcome to BuyWiser</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Select your role to access your portal or explore the public site.
          </p>
          {user && <p className="text-blue-400 text-sm mt-2">Logged in as <strong>{user.full_name || user.email}</strong></p>}
        </div>

        {/* Portal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {roles.map(role => {
            const Icon = role.icon;
            return (
              <a
                key={role.id}
                href={role.path}
                className={`border-2 rounded-2xl p-6 transition hover:shadow-lg hover:scale-105 ${role.color}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${role.textColor}`} style={{ background: role.textColor.replace("text-", "bg-") + "/10" }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold mb-1 ${role.textColor}`}>{role.label}</h3>
                    <p className="text-sm text-slate-600">{role.description}</p>
                  </div>
                  <span className="text-2xl">→</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <p className="text-sm text-blue-200 leading-relaxed">
            This is a unified access point for all BuyWiser portals. Each role has its own dashboard and permissions.
          </p>
          <p className="text-xs text-blue-400 mt-3">
            Not registered yet? Contact BuyWiser to request portal access.
          </p>
        </div>
      </div>
    </div>
  );
}