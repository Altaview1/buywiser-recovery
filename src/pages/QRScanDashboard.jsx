import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { RefreshCw, AlertCircle, MapPin, List } from "lucide-react";
import QRScansMap from "@/components/QRScansMap";
import QRScansList from "@/components/QRScansList";

const NAVY = "#0B1F3B";

export default function QRScanDashboard() {
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [activeTab, setActiveTab] = useState("map");
  const [scans, setScans] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) {
          setAuthError("Not authenticated");
          setLoading(false);
          return;
        }
        if (user.role !== "admin") {
          setAuthError("Admin access required");
          setLoading(false);
          return;
        }
        await fetchAll();
      } catch (err) {
        console.error("Error loading data:", err);
        setAuthError(err.message || "Auth error");
      }
      setLoading(false);
    };
    init();
  }, []);

  const fetchAll = async () => {
    // Get today's scans
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const leads = await base44.entities.ActivatorLead.list("-created_date", 500);
    const todaysScans = leads.filter(l => new Date(l.created_date) >= today);
    setScans(todaysScans);

    // Get all payments
    const allPayments = await base44.entities.ActivatorPayment.list("-created_date", 500);
    setPayments(allPayments);

    // Subscribe to real-time updates
    const unsubscribeLeads = base44.entities.ActivatorLead.subscribe((event) => {
      if (event.type === "create" || event.type === "update") {
        if (new Date(event.data.created_date) >= today) {
          setScans(prev => {
            const exists = prev.find(l => l.id === event.data.id);
            if (exists) return prev.map(l => l.id === event.data.id ? event.data : l);
            return [event.data, ...prev];
          });
        }
      }
    });

    const unsubscribePayments = base44.entities.ActivatorPayment.subscribe((event) => {
      setPayments(prev => {
        const exists = prev.find(p => p.id === event.id);
        if (event.type === "create") return [event.data, ...prev];
        if (event.type === "update") return prev.map(p => p.id === event.id ? event.data : p);
        if (event.type === "delete") return prev.filter(p => p.id !== event.id);
        return prev;
      });
    });

    return () => {
      unsubscribeLeads();
      unsubscribePayments();
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white border-2 border-red-300 rounded-2xl p-8 max-w-sm w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
          <p className="text-lg font-bold text-red-700 mb-2">Access Denied</p>
          <p className="text-sm text-red-600">{authError}</p>
          <a href="/" className="text-sm font-semibold text-blue-600 hover:text-blue-800 mt-4 block">← Return Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Live QR Scan Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Today's field activator activity ({scans.length} scans)</p>
          </div>
          <button
            onClick={fetchAll}
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex gap-2 border-b border-slate-200 mb-4">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-lg transition ${
              activeTab === "map"
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <MapPin className="h-4 w-4" /> Map View
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-t-lg transition ${
              activeTab === "list"
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <List className="h-4 w-4" /> List View
          </button>
        </div>

        {/* Map View */}
        {activeTab === "map" && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-[600px]">
            <QRScansMap scans={scans} payments={payments} />
          </div>
        )}

        {/* List View */}
        {activeTab === "list" && (
          <QRScansList scans={scans} payments={payments} />
        )}
      </div>
    </div>
  );
}