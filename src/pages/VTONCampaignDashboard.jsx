import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, MessageSquare, Users, TrendingUp, Eye, Calendar, Search, Filter } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

export default function VTONCampaignDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    booked: 0,
    sms_sent: 0,
    email_sent: 0
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const allLeads = await base44.entities.VTONLead.list();
      setLeads(allLeads);

      // Calculate stats
      const stats = {
        total: allLeads.length,
        active: allLeads.filter(l => l.suppression_status === 'active').length,
        booked: allLeads.filter(l => l.appointment_booked).length,
        sms_sent: allLeads.filter(l => l.sms_status === 'sent' || l.sms_status === 'opened').length,
        email_sent: allLeads.filter(l => l.email_status === 'sent' || l.email_status === 'opened').length
      };
      setStats(stats);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load leads:", err);
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.property_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStage === 'all' || lead.campaign_stage === filterStage;
    
    return matchesSearch && matchesFilter;
  });

  const campaignStages = [
    { value: 'initial_outreach', label: 'Initial Outreach', color: 'bg-blue-100 text-blue-800' },
    { value: 'engagement', label: 'Engagement', color: 'bg-purple-100 text-purple-800' },
    { value: 'nurture', label: 'Nurture', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'booked', label: 'Booked', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-slate-100 text-slate-800' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading VTON campaign data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div style={{ background: NAVY }} className="text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">VTON™ Campaign Dashboard</h1>
          <p className="text-blue-300">Veteran Transition Opportunity Network — Rapid Response Management</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Leads</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-slate-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Active</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.active}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-slate-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">SMS Sent</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.sms_sent}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-slate-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Email Sent</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.email_sent}</p>
              </div>
              <Mail className="h-8 w-8 text-slate-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Booked</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.booked}</p>
              </div>
              <Calendar className="h-8 w-8 text-slate-300" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Stages</option>
              {campaignStages.map(stage => (
                <option key={stage.value} value={stage.value}>{stage.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: '#f8fafc' }}>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Property</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Benefit</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Stage</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">SMS</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Visits</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const stage = campaignStages.find(s => s.value === lead.campaign_stage);
                  return (
                    <tr key={lead.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{lead.first_name} {lead.last_name}</p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-700 text-xs">{lead.property_address}</p>
                        <p className="text-xs text-slate-500">{lead.city}, {lead.state}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-green-600">${(lead.estimated_benefit || 0).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stage?.color || 'bg-slate-100'}`}>
                          {stage?.label || lead.campaign_stage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          lead.sms_status === 'opened' ? 'bg-green-100 text-green-800' :
                          lead.sms_status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {lead.sms_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          lead.email_status === 'opened' ? 'bg-green-100 text-green-800' :
                          lead.email_status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {lead.email_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-slate-400" />
                          <span className="font-semibold text-slate-700">{lead.site_visits || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          lead.suppression_status === 'active' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {lead.suppression_status === 'active' ? 'Active' : 'Suppressed'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p>No leads found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}