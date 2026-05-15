import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, MessageSquare, Users, TrendingUp, Eye, Calendar, Search, X, StickyNote, Download, Trash2 } from "lucide-react";
import VTONBulkImportUI from "../components/VTONBulkImportUI";
import LeadNotesPanel from "../components/vton/LeadNotesPanel";

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
  const [showImport, setShowImport] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [notesLead, setNotesLead] = useState(null);
  const [filterContactStatus, setFilterContactStatus] = useState("all");
  const [addingLead, setAddingLead] = useState(false);
  const [addLeadResult, setAddLeadResult] = useState(null);
  const [showDeleteImport, setShowDeleteImport] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
      if (vals.every(v => !v)) continue;
      const row = {};
      headers.forEach((h, idx) => { row[h] = vals[idx] || ''; });
      rows.push(row);
    }
    return rows;
  };

  const mapPropertyRadarRow = (row) => {
    // Support both PropertyRadar export columns and standard column names
    const firstName = row['Primary First'] || row['first_name'] || row['First Name'] || '';
    const lastName = row['Primary Last'] || row['last_name'] || row['Last Name'] || '';
    const address = row['Address'] || row['property_address'] || row['Mail Address'] || '';
    const city = row['City'] || row['city'] || row['Mail City'] || '';
    const state = row['State'] || row['state'] || row['Mail State'] || 'CA';
    const zip = row['ZIP'] || row['zip_code'] || row['Mail ZIP'] || row['Zip'] || '';
    const email = row['Email'] || row['email'] || '';
    const phone = row['Phone'] || row['phone'] || '';

    // Skip disclaimer/footer rows
    if (!firstName && !address) return null;
    if (firstName.length > 60 && !address) return null; // disclaimer row

    return { first_name: firstName, last_name: lastName, email, phone, property_address: address, city, state, zip_code: zip };
  };

  const handleSingleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAddingLead(true);
    setAddLeadResult(null);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      const leads = rows.map(mapPropertyRadarRow).filter(Boolean);

      if (leads.length === 0) {
        setAddLeadResult({ success: false, message: 'No valid leads found in file. Check that it has Address and name columns.' });
        return;
      }

      let created = 0;
      for (const lead of leads) {
        await base44.entities.VTONLead.create({
          ...lead,
          veteran_indicator: true,
          campaign_stage: 'initial_outreach',
          sms_status: 'pending',
          email_status: 'pending',
          suppression_status: 'active',
          facebook_audience_synced: false,
          direct_mail_sent: false,
          appointment_booked: false,
        });
        created++;
      }
      setAddLeadResult({ success: true, message: `✓ ${created} lead${created !== 1 ? 's' : ''} imported successfully` });
      await loadLeads();
    } catch (err) {
      setAddLeadResult({ success: false, message: 'Error: ' + err.message });
    } finally {
      setAddingLead(false);
      e.target.value = '';
    }
  };

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
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term ||
      (lead.first_name || '').toLowerCase().includes(term) ||
      (lead.property_address || '').toLowerCase().includes(term) ||
      (lead.email || '').toLowerCase().includes(term);
    
    const matchesFilter = filterStage === 'all' || lead.campaign_stage === filterStage;
    const matchesContactStatus = filterContactStatus === 'all' || (lead.contact_status || 'New') === filterContactStatus;
    
    return matchesSearch && matchesFilter && matchesContactStatus;
  });

  const campaignStages = [
    { value: 'initial_outreach', label: 'Initial Outreach', color: 'bg-blue-100 text-blue-800' },
    { value: 'engagement', label: 'Engagement', color: 'bg-purple-100 text-purple-800' },
    { value: 'nurture', label: 'Nurture', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'booked', label: 'Booked', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-slate-100 text-slate-800' }
  ];

  const contactStatuses = [
    { value: 'New', label: 'New', color: 'bg-slate-100 text-slate-700' },
    { value: 'Contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
    { value: 'Qualified', label: 'Qualified', color: 'bg-green-100 text-green-800' }
  ];

  const downloadCSV = () => {
    const headers = [
      'First Name', 'Last Name', 'Email', 'Phone', 'Property Address', 'City', 'State', 'Zip',
      'Listing Price', 'Estimated Equity', 'Estimated Benefit', 'Veteran', 'VA Loan',
      'Campaign Stage', 'Contact Status', 'SMS Status', 'Email Status',
      'Appointment Booked', 'Appointment Date', 'Suppression Status',
      'Site Visits', 'Notes', 'Created Date'
    ];
    const rows = leads.map(l => [
      l.first_name, l.last_name, l.email, l.phone, l.property_address, l.city, l.state, l.zip_code,
      l.listing_price || '', l.estimated_equity || '', l.estimated_benefit || '',
      l.veteran_indicator ? 'Yes' : 'No', l.likely_va_loan_indicator ? 'Yes' : 'No',
      l.campaign_stage, l.contact_status || 'New', l.sms_status, l.email_status,
      l.appointment_booked ? 'Yes' : 'No', l.appointment_date || '',
      l.suppression_status, l.site_visits || 0,
      (l.notes || '').replace(/,/g, ';').replace(/\n/g, ' '),
      l.created_date ? new Date(l.created_date).toLocaleDateString() : ''
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vton-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleContactStatusChange = async (leadId, newStatus) => {
    await base44.entities.VTONLead.update(leadId, { contact_status: newStatus });
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, contact_status: newStatus } : l));
  };

  const pipelineCounts = contactStatuses.map(s => ({
    ...s,
    count: leads.filter(l => (l.contact_status || 'New') === s.value).length
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading VTON campaign data...</div>
      </div>
    );
  }

  const handleNotesSaved = (leadId, newNotes) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, notes: newNotes } : l));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {notesLead && (
        <LeadNotesPanel
          lead={notesLead}
          onClose={() => setNotesLead(null)}
          onSaved={(id, notes) => { handleNotesSaved(id, notes); setNotesLead(null); }}
        />
      )}
      {/* Header */}
      <div style={{ background: NAVY }} className="text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">VTON™ Campaign Dashboard</h1>
          <p className="text-blue-300">Veteran Transition Opportunity Network — Rapid Response Management</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Bulk Import Section */}
        {showImport && (
          <div className="mb-8">
            <button
              onClick={() => setShowImport(false)}
              className="mb-4 text-sm text-slate-500 hover:text-slate-700 transition"
            >
              ← Back to Dashboard
            </button>
            <VTONBulkImportUI onImportComplete={() => {
              setShowImport(false);
              loadLeads();
            }} />
          </div>
        )}

        {!showImport && (
          <>
            {/* Action Buttons */}
            <div className="mb-6 flex justify-end gap-3">
              <a
                href="/vton-email-history"
                className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition text-sm flex items-center gap-2"
              >
                <Mail className="h-4 w-4" /> Email History
              </a>
              <button
                onClick={() => setShowDeleteImport(true)}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition text-sm flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" /> Delete Import
              </button>
              <button
                onClick={() => setShowAddLead(true)}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-sm"
              >
                + Add Single Lead
              </button>
              <button
                onClick={() => setShowImport(true)}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm"
              >
                + Import PropertyRadar CSV
              </button>
              <button
                onClick={downloadCSV}
                className="px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition text-sm flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>

            {/* Add Single Lead Modal */}
            {showAddLead && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-900">Upload Lead File</h2>
                    <button onClick={() => { setShowAddLead(false); setAddLeadResult(null); }} className="text-slate-400 hover:text-slate-700"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600">Upload a CSV or Excel file with one or more leads. Column headers can be in any PropertyRadar or standard format.</p>
                    
                    <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition ${addingLead ? 'border-slate-200 bg-slate-50' : 'border-green-300 bg-green-50 hover:bg-green-100'}`}>
                      {addingLead ? (
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                          <span className="text-sm font-medium">Importing...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-green-700">
                          <span className="text-3xl">📂</span>
                          <span className="text-sm font-semibold">Click to select file</span>
                          <span className="text-xs text-green-600">CSV or Excel (.xlsx)</span>
                        </div>
                      )}
                      <input type="file" accept=".csv,.xlsx,.xls" className="hidden" disabled={addingLead} onChange={handleSingleFileUpload} />
                    </label>

                    {addLeadResult && (
                      <div className={`px-4 py-3 rounded-lg text-sm font-medium ${addLeadResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {addLeadResult.message}
                      </div>
                    )}

                    <button onClick={() => { setShowAddLead(false); setAddLeadResult(null); }} className="w-full px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition">
                      {addLeadResult?.success ? 'Done' : 'Cancel'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Import Modal */}
            {showDeleteImport && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-red-200">
                    <h2 className="text-lg font-bold text-red-700">Delete Recent Import</h2>
                    <button onClick={() => { setShowDeleteImport(false); setDeleteResult(null); }} className="text-slate-400 hover:text-slate-700"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-700 font-medium">This will delete all leads imported in the current session (today). This action cannot be undone.</p>
                    
                    {deleteResult && (
                      <div className={`px-4 py-3 rounded-lg text-sm font-medium ${deleteResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {deleteResult.message}
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => { setShowDeleteImport(false); setDeleteResult(null); }} 
                        className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
                        disabled={deleting}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={async () => {
                          setDeleting(true);
                          try {
                            const res = await base44.functions.invoke('deleteVTONImport', { delete_all_today: true });
                            setDeleteResult({ success: true, message: `✓ Deleted ${res.data.deleted_count} leads` });
                            await loadLeads();
                          } catch (err) {
                            setDeleteResult({ success: false, message: 'Error: ' + err.message });
                          } finally {
                            setDeleting(false);
                          }
                        }} 
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:bg-slate-300 transition flex items-center justify-center gap-2"
                        disabled={deleting}
                      >
                        {deleting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" /> Delete All
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pipeline Summary */}
            <div className="mb-6 bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Pipeline at a Glance</h2>
              <div className="grid grid-cols-3 gap-4">
                {pipelineCounts.map(s => (
                  <div
                    key={s.value}
                    onClick={() => setFilterContactStatus(filterContactStatus === s.value ? 'all' : s.value)}
                    className={`rounded-xl p-4 text-center cursor-pointer transition border-2 ${filterContactStatus === s.value ? 'border-blue-500' : 'border-transparent'} ${s.color}`}
                  >
                    <p className="text-3xl font-bold">{s.count}</p>
                    <p className="text-xs font-semibold mt-1 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

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
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Pipeline</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Notes</th>
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
                      <td className="px-6 py-4">
                        <select
                          value={lead.contact_status || 'New'}
                          onChange={(e) => handleContactStatusChange(lead.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            (lead.contact_status || 'New') === 'Qualified' ? 'bg-green-100 text-green-800' :
                            (lead.contact_status || 'New') === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setNotesLead(lead)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            lead.notes ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                          title={lead.notes || "Add notes"}
                        >
                          <StickyNote className="h-3.5 w-3.5" />
                          {lead.notes ? "View" : "Add"}
                        </button>
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
          </>
        )}
      </div>
    </div>
  );
}