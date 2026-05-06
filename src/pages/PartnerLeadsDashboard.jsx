import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { LogOut, RefreshCw, Eye, Phone, Mail, MapPin, CheckCircle, Clock, AlertCircle } from "lucide-react";

const NAVY = "#0B1F3B";

export default function PartnerLeadsDashboard() {
  const [partner, setPartner] = useState(null);
  const [leads, setLeads] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const init = async () => {
      const email = new URLSearchParams(window.location.search).get("email");
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const partners = await base44.entities.PartnerApplication.filter({ email });
        if (partners.length > 0) {
          const p = partners[0];
          setPartner(p);
          const [leadsData, oppsData] = await Promise.all([
            base44.entities.Lead.filter({ assigned_agent: p.name }),
            base44.entities.VTONOpportunity.filter({ partner_email: p.email }),
          ]);
          setLeads(leadsData);
          setOpportunities(oppsData);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
      setLoading(false);
    };

    init();
  }, []);

  const handleLogout = () => {
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: NAVY }}>
        <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-xl">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-bold text-slate-900 mb-2">Access Required</p>
          <p className="text-sm text-slate-600">Please provide your email to access your leads.</p>
        </div>
      </div>
    );
  }

  // Filter leads
  const filteredLeads = leads.filter(l => {
    if (filter === "all") return true;
    if (filter === "new") return l.status === "New";
    if (filter === "contacted") return l.status === "Contacted";
    if (filter === "qualified") return l.status === "Qualified";
    if (filter === "closed") return ["Closed", "Lost"].includes(l.status);
    return true;
  });

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "New").length,
    contacted: leads.filter(l => l.status === "Contacted").length,
    qualified: leads.filter(l => l.status === "Qualified").length,
    closed: leads.filter(l => ["Closed", "Lost"].includes(l.status)).length,
  };

  const statusColor = {
    New: "bg-blue-50 text-blue-700 border-blue-200",
    Contacted: "bg-amber-50 text-amber-700 border-amber-200",
    Qualified: "bg-purple-50 text-purple-700 border-purple-200",
    Closed: "bg-green-50 text-green-700 border-green-200",
    Lost: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <img
              src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
              alt="BuyWiser"
              className="h-5 w-auto opacity-70"
            />
            <p className="text-xs text-slate-400 mt-1">{partner.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Your Leads</h1>
          <p className="text-sm text-slate-600">Track and manage your assigned opportunities</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total", value: stats.total, color: "slate" },
            { label: "New", value: stats.new, color: "blue" },
            { label: "Contacted", value: stats.contacted, color: "amber" },
            { label: "Qualified", value: stats.qualified, color: "purple" },
            { label: "Closed", value: stats.closed, color: "green" },
          ].map(stat => (
            <button
              key={stat.label}
              onClick={() => setFilter(stat.label === "Total" ? "all" : stat.label.toLowerCase())}
              className={`p-3 rounded-lg border transition ${
                filter === (stat.label === "Total" ? "all" : stat.label.toLowerCase())
                  ? `bg-${stat.color}-50 border-${stat.color}-300`
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <p className={`text-lg font-bold ${
                stat.color === "slate" ? "text-slate-900" :
                stat.color === "blue" ? "text-blue-700" :
                stat.color === "amber" ? "text-amber-700" :
                stat.color === "purple" ? "text-purple-700" :
                "text-green-700"
              }`}>
                {stat.value}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">{stat.label}</p>
            </button>
          ))}
        </div>

        {/* Leads List */}
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No leads in this category</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLeads.map(lead => {
              const status = lead.status || "New";
              const colors = statusColor[status] || statusColor.New;

              return (
                <div
                  key={lead.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 truncate">{lead.name || "Unnamed Lead"}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${colors} whitespace-nowrap flex-shrink-0`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 truncate mb-2">{lead.address_or_link}</p>

                      {/* Contact Info */}
                      <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                        {lead.email && (
                          <a href={`mailto:${lead.email}`} className="hover:text-blue-600 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </a>
                        )}
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="hover:text-blue-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition flex-shrink-0"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Agent Notes */}
                  {lead.agent_comment && (
                    <div className="text-xs text-slate-600 italic bg-slate-50 rounded p-2 border-l-2 border-slate-300">
                      {lead.agent_comment}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">{selectedLead.name || "Lead Details"}</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Address</p>
                <p className="text-sm text-slate-900">{selectedLead.address_or_link}</p>
              </div>

              {selectedLead.email && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Email</p>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm text-blue-600 hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
              )}

              {selectedLead.phone && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Phone</p>
                  <a href={`tel:${selectedLead.phone}`} className="text-sm text-blue-600 hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
              )}

              {selectedLead.agent_comment && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Notes</p>
                  <p className="text-sm text-slate-700">{selectedLead.agent_comment}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Status</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${
                    statusColor[selectedLead.status] || statusColor.New
                  }`}
                >
                  {selectedLead.status || "New"}
                </span>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="w-full mt-4 py-2 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}