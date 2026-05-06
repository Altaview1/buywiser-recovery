import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { LogOut, RefreshCw, Eye, Phone, Mail, MapPin, CheckCircle, Clock, AlertCircle, Upload, Map, BarChart3, Users, DollarSign, TrendingUp, Filter, Search, X } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const statusColor = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Contacted: "bg-amber-50 text-amber-700 border-amber-200",
  Qualified: "bg-purple-50 text-purple-700 border-purple-200",
  Closed: "bg-green-50 text-green-700 border-green-200",
  Lost: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function PartnerLeadsDashboard() {
  const [partner, setPartner] = useState(null);
  const [leads, setLeads] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("leads");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mapView, setMapView] = useState(false);

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
        console.error("Error:", err);
      }
      setLoading(false);
    };

    init();
  }, []);

  const handleLogout = () => {
    window.location.href = "/";
  };

  const filteredLeads = leads.filter(l => {
    const matchStatus = filter === "all" || (l.status || "New") === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || 
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.address_or_link?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => (l.status || "New") === "New").length,
    contacted: leads.filter(l => l.status === "Contacted").length,
    qualified: leads.filter(l => l.status === "Qualified").length,
    closed: leads.filter(l => ["Closed", "Lost"].includes(l.status)).length,
  };

  const opportunityStats = {
    assigned: opportunities.filter(o => o.opportunity_status === "assigned").length,
    contacted: opportunities.filter(o => o.opportunity_status === "contacted").length,
    qualified: opportunities.filter(o => o.opportunity_status === "conversation_verified").length,
    scheduled: opportunities.filter(o => o.opportunity_status === "consultation_scheduled").length,
    closed: opportunities.filter(o => ["closed_won", "closed_lost"].includes(o.opportunity_status)).length,
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
          <p className="text-sm text-slate-600">Please provide your email to access your portal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <img
              src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
              alt="BuyWiser"
              className="h-5 w-auto opacity-70"
            />
            <p className="text-xs text-slate-400 mt-1">{partner.name} • {partner.territory || "Unassigned Territory"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Upload className="h-3.5 w-3.5" /> Import Leads
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Partner Dashboard</h1>
          <p className="text-sm text-slate-600">Manage your leads and opportunities</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "leads", label: "My Leads", icon: "📋" },
            { id: "opportunities", label: "VTON Opportunities", icon: "🎯" },
            { id: "map", label: "Map View", icon: "🗺️" },
            { id: "analytics", label: "Analytics", icon: "📈" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? "border-blue-600 text-slate-900"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Lead Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "Total", value: stats.total, color: "slate" },
                  { label: "New", value: stats.new, color: "blue" },
                  { label: "Contacted", value: stats.contacted, color: "amber" },
                  { label: "Qualified", value: stats.qualified, color: "purple" },
                  { label: "Closed", value: stats.closed, color: "green" },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                    <p className={`text-2xl font-bold ${
                      stat.color === "slate" ? "text-slate-900" :
                      stat.color === "blue" ? "text-blue-700" :
                      stat.color === "amber" ? "text-amber-700" :
                      stat.color === "purple" ? "text-purple-700" :
                      "text-green-700"
                    }`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">VTON Opportunities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "Assigned", value: opportunityStats.assigned },
                  { label: "Contacted", value: opportunityStats.contacted },
                  { label: "Qualified", value: opportunityStats.qualified },
                  { label: "Scheduled", value: opportunityStats.scheduled },
                  { label: "Closed", value: opportunityStats.closed },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                    <p className="text-2xl font-bold text-purple-700">{stat.value}</p>
                    <p className="text-xs text-slate-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {partner.deposit_balance > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-lg font-bold text-green-900 mb-2">Rolling Deposit Balance</h2>
                <p className="text-3xl font-black text-green-700">${partner.deposit_balance.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-2">Earned back through completed actions</p>
              </div>
            )}
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-white"
              >
                <option value="all">All Leads</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Closed">Closed/Lost</option>
              </select>
            </div>

            {/* Leads List */}
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">No leads found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLeads.map(lead => (
                  <div key={lead.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-900 truncate">{lead.name || "Unnamed"}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-semibold border ${statusColor[lead.status] || statusColor.New} whitespace-nowrap flex-shrink-0`}>
                            {lead.status || "New"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 truncate mb-2 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          {lead.address_or_link}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="hover:text-blue-600 flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {lead.email}
                            </a>
                          )}
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="hover:text-blue-600 flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {lead.phone}
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition flex-shrink-0"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* OPPORTUNITIES TAB */}
        {activeTab === "opportunities" && (
          <div className="space-y-2">
            {opportunities.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">No VTON opportunities assigned yet</p>
              </div>
            ) : (
              opportunities.map(opp => (
                <div key={opp.id} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{opp.homeowner_name}</h3>
                      <p className="text-sm text-slate-600 truncate">{opp.property_address}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded whitespace-nowrap bg-blue-100 text-blue-700">
                      {opp.opportunity_status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs text-slate-600">
                    <div>Est. Value: ${(opp.estimated_price/1000).toFixed(0)}K</div>
                    <div>Est. Equity: ${(opp.estimated_equity/1000).toFixed(0)}K</div>
                    {opp.distress_score && <div>Distress: {opp.distress_score}</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === "map" && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden h-96">
            <MapContainer center={[34.0522, -118.2437]} zoom={10} style={{ width: "100%", height: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {leads
                .filter(l => l.lat && l.lng)
                .map(l => (
                  <Marker key={l.id} position={[l.lat, l.lng]}>
                    <Popup>
                      <div className="text-xs">
                        <p className="font-bold">{l.first_name} {l.last_name}</p>
                        <p className="text-slate-600">{l.property_address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" /> Conversion Metrics
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Contact Rate</span>
                  <span className="font-bold">{stats.total > 0 ? Math.round((stats.contacted / stats.total) * 100) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Qualification Rate</span>
                  <span className="font-bold">{stats.total > 0 ? Math.round((stats.qualified / stats.total) * 100) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Close Rate</span>
                  <span className="font-bold">{stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}%</span>
                </div>
              </div>
            </div>

            {partner.total_earnings > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-5">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Earnings
                </h3>
                <p className="text-3xl font-black text-green-700">${partner.total_earnings.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-2">Lifetime earnings</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">{selectedLead.name || "Lead Details"}</h2>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedLead.address_or_link && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Address</p>
                  <p className="text-sm text-slate-900">{selectedLead.address_or_link}</p>
                </div>
              )}
              {selectedLead.email && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Email</p>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm text-blue-600 hover:underline">{selectedLead.email}</a>
                </div>
              )}
              {selectedLead.phone && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Phone</p>
                  <a href={`tel:${selectedLead.phone}`} className="text-sm text-blue-600 hover:underline">{selectedLead.phone}</a>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Status</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${statusColor[selectedLead.status] || statusColor.New}`}>
                  {selectedLead.status || "New"}
                </span>
              </div>
              <button onClick={() => setSelectedLead(null)} className="w-full mt-4 py-2 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}