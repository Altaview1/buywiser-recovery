import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, Mail, Phone, MapPin } from "lucide-react";

const NAVY = "#0B1F3B";

export default function AdminPartnerApprovals() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPartners = async () => {
    setLoading(true);
    const data = await base44.entities.PartnerApplication.list("-created_date", 200);
    setPartners(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleApprove = async (partnerId) => {
    setActionLoading(partnerId);
    await base44.entities.PartnerApplication.update(partnerId, { status: "approved" });
    setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, status: "approved" } : p));
    setActionLoading(null);
  };

  const handleSuspend = async (partnerId) => {
    setActionLoading(partnerId);
    await base44.entities.PartnerApplication.update(partnerId, { status: "suspended" });
    setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, status: "suspended" } : p));
    setActionLoading(null);
  };

  const handleReactivate = async (partnerId) => {
    setActionLoading(partnerId);
    await base44.entities.PartnerApplication.update(partnerId, { status: "approved" });
    setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, status: "approved" } : p));
    setActionLoading(null);
  };

  const pending = partners.filter(p => p.status === "pending");
  const approved = partners.filter(p => p.status === "approved");
  const suspended = partners.filter(p => p.status === "suspended");

  const displayed = activeTab === "pending" ? pending : activeTab === "approved" ? approved : suspended;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-2xl font-black text-amber-700">{pending.length}</p>
          <p className="text-xs text-amber-600 mt-0.5">Pending Review</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-2xl font-black text-green-700">{approved.length}</p>
          <p className="text-xs text-green-600 mt-0.5">Approved</p>
        </div>
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
          <p className="text-2xl font-black text-slate-600">{suspended.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Suspended</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "pending", label: `Pending (${pending.length})` },
          { id: "approved", label: `Approved (${approved.length})` },
          { id: "suspended", label: `Suspended (${suspended.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition ${
              activeTab === tab.id
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={fetchPartners}
          className="ml-auto p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Partner list */}
      <div className="space-y-3">
        {displayed.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Clock className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No {activeTab} applications.</p>
          </div>
        ) : (
          displayed.map(partner => (
            <div
              key={partner.id}
              className={`border rounded-xl p-4 transition ${
                activeTab === "pending"
                  ? "bg-white border-amber-200 hover:shadow-md"
                  : activeTab === "approved"
                  ? "bg-white border-green-200 hover:shadow-md"
                  : "bg-slate-50 border-slate-200 opacity-75"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900">{partner.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <a
                          href={`mailto:${partner.email}`}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition"
                        >
                          <Mail className="h-3 w-3" /> {partner.email}
                        </a>
                        {partner.phone && (
                          <a
                            href={`tel:${partner.phone}`}
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition"
                          >
                            <Phone className="h-3 w-3" /> {partner.phone}
                          </a>
                        )}
                      </div>
                    </div>
                    {activeTab === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap flex-shrink-0">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                    {activeTab === "approved" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 whitespace-nowrap flex-shrink-0">
                        <CheckCircle className="h-3 w-3" /> Approved
                      </span>
                    )}
                    {activeTab === "suspended" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 border border-slate-300 whitespace-nowrap flex-shrink-0">
                        <XCircle className="h-3 w-3" /> Suspended
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-500 mb-2">
                    {partner.market && (
                      <div>
                        <p className="font-semibold text-slate-600">Market</p>
                        <p>{partner.market}</p>
                      </div>
                    )}
                    {partner.territory && (
                      <div className="flex items-start gap-1">
                        <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5 text-slate-400" />
                        <div>
                          <p className="font-semibold text-slate-600">Territory</p>
                          <p>{partner.territory}</p>
                        </div>
                      </div>
                    )}
                    {partner.quiz_passed && (
                      <div>
                        <p className="font-semibold text-green-600">✓ Quiz Passed</p>
                      </div>
                    )}
                  </div>

                  {/* Created date */}
                  <p className="text-xs text-slate-400">
                    Applied:{" "}
                    {new Date(partner.created_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {activeTab === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(partner.id)}
                        disabled={actionLoading === partner.id}
                        className="px-4 py-2 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 whitespace-nowrap"
                      >
                        {actionLoading === partner.id ? "Approving…" : "Approve"}
                      </button>
                      <button
                        onClick={() => handleSuspend(partner.id)}
                        disabled={actionLoading === partner.id}
                        className="px-4 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition disabled:opacity-50 whitespace-nowrap"
                      >
                        {actionLoading === partner.id ? "Suspending…" : "Decline"}
                      </button>
                    </>
                  )}
                  {activeTab === "approved" && (
                    <button
                      onClick={() => handleSuspend(partner.id)}
                      disabled={actionLoading === partner.id}
                      className="px-4 py-2 text-xs font-bold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50 whitespace-nowrap"
                    >
                      {actionLoading === partner.id ? "Suspending…" : "Suspend"}
                    </button>
                  )}
                  {activeTab === "suspended" && (
                    <button
                      onClick={() => handleReactivate(partner.id)}
                      disabled={actionLoading === partner.id}
                      className="px-4 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-lg hover:bg-white transition disabled:opacity-50 whitespace-nowrap"
                    >
                      {actionLoading === partner.id ? "Reactivating…" : "Reactivate"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}