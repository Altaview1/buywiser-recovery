import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, CheckCircle, XCircle, AlertCircle, Search, Download, Eye, Send, Package, X, ExternalLink } from "lucide-react";

const NAVY = "#0B1F3B";

export default function VTONEmailHistory() {
  const [tab, setTab] = useState("emails");
  const [logs, setLogs] = useState([]);
  const [lobLeads, setLobLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLobLead, setSelectedLobLead] = useState(null);
  const [stats, setStats] = useState({ total: 0, sent: 0, delivered: 0, failed: 0, bounced: 0, thisWeek: 0 });
  const [lobStats, setLobStats] = useState({ total: 0, mailed: 0, delivered: 0, failed: 0 });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [allLogs, allLeads] = await Promise.all([
        base44.entities.VTONEmailLog.list('-sent_date', 500),
        base44.entities.VTONLead.list('-updated_date', 1000)
      ]);

      setLogs(allLogs);

      const withLob = allLeads.filter(l => l.lob_letter_id);
      setLobLeads(withLob);

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      setStats({
        total: allLogs.length,
        sent: allLogs.filter(l => l.status === 'sent').length,
        delivered: allLogs.filter(l => l.status === 'delivered').length,
        failed: allLogs.filter(l => l.status === 'failed').length,
        bounced: allLogs.filter(l => l.status === 'bounced').length,
        thisWeek: allLogs.filter(l => new Date(l.sent_date) > weekAgo).length
      });

      setLobStats({
        total: withLob.length,
        mailed: withLob.filter(l => l.lob_delivery_status === 'mailed').length,
        delivered: withLob.filter(l => l.lob_delivery_status === 'delivered').length,
        failed: withLob.filter(l => ['failed', 'returned', 'cancelled'].includes(l.lob_delivery_status)).length
      });

      setLoading(false);
    } catch (err) {
      console.error("Failed to load data:", err);
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term ||
      (log.lead_name || '').toLowerCase().includes(term) ||
      (log.lead_email || '').toLowerCase().includes(term) ||
      (log.subject || '').toLowerCase().includes(term);
    const matchesType = filterType === 'all' || log.email_type === filterType;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredLobLeads = lobLeads.filter(l => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term ||
      (l.first_name || '').toLowerCase().includes(term) ||
      (l.last_name || '').toLowerCase().includes(term) ||
      (l.property_address || '').toLowerCase().includes(term) ||
      (l.lob_letter_id || '').toLowerCase().includes(term);
    const matchesStatus = filterStatus === 'all' || l.lob_delivery_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const emailTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'lead_confirmation', label: 'Lead Confirmation' },
    { value: 'test_email', label: 'Test Email' },
    { value: 'consultation_booking', label: 'Consultation Booking' },
    { value: 'welcome_letter', label: 'Welcome Letter' },
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'other', label: 'Other' }
  ];

  const emailTypeColors = {
    lead_confirmation: 'bg-blue-100 text-blue-800',
    test_email: 'bg-purple-100 text-purple-800',
    consultation_booking: 'bg-green-100 text-green-800',
    welcome_letter: 'bg-amber-100 text-amber-800',
    follow_up: 'bg-pink-100 text-pink-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const lobStatusColor = (status) => {
    if (!status) return 'bg-slate-100 text-slate-600';
    if (status === 'delivered') return 'bg-green-100 text-green-800';
    if (status === 'mailed') return 'bg-blue-100 text-blue-800';
    if (status === 'processing') return 'bg-yellow-100 text-yellow-800';
    if (['failed', 'returned', 'cancelled'].includes(status)) return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-600';
  };

  const downloadEmailCSV = () => {
    const headers = ['Sent Date', 'Lead Name', 'Lead Email', 'Email Type', 'Subject', 'Status', 'Error'];
    const rows = logs.map(l => [
      new Date(l.sent_date).toLocaleString(), l.lead_name || '', l.lead_email || '',
      l.email_type, (l.subject || '').replace(/,/g, ';'), l.status, (l.error_message || '').replace(/,/g, ';')
    ]);
    exportCSV(headers, rows, 'vton-email-history');
  };

  const downloadLobCSV = () => {
    const headers = ['Name', 'Address', 'City', 'State', 'Lob Letter ID', 'Mail Status', 'Delivery Date', 'Cost'];
    const rows = lobLeads.map(l => [
      `${l.first_name} ${l.last_name}`, l.property_address || '', l.city || '', l.state || '',
      l.lob_letter_id || '', l.lob_delivery_status || 'processing',
      l.lob_delivery_date ? new Date(l.lob_delivery_date).toLocaleDateString() : '',
      l.lob_estimated_cost ? `$${l.lob_estimated_cost.toFixed(2)}` : ''
    ]);
    exportCSV(headers, rows, 'vton-lob-letters');
  };

  const exportCSV = (headers, rows, name) => {
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading outreach history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div style={{ background: NAVY }} className="text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">VTON™ Outreach History</h1>
          <p className="text-blue-300">Track all email and direct mail sent to veterans</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setTab("emails"); setFilterStatus("all"); setSearchTerm(""); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition ${tab === "emails" ? "bg-white border-2 border-blue-500 text-blue-700 shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}
          >
            <Mail className="h-4 w-4" /> Emails
            <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{stats.total}</span>
          </button>
          <button
            onClick={() => { setTab("letters"); setFilterStatus("all"); setSearchTerm(""); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition ${tab === "letters" ? "bg-white border-2 border-amber-500 text-amber-700 shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}
          >
            <Send className="h-4 w-4" /> Lob Letters
            <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">{lobStats.total}</span>
          </button>
        </div>

        {/* EMAIL TAB */}
        {tab === "emails" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total', value: stats.total, color: 'text-slate-900' },
                { label: 'Sent', value: stats.sent, color: 'text-blue-600' },
                { label: 'Delivered', value: stats.delivered, color: 'text-green-600' },
                { label: 'Failed', value: stats.failed, color: 'text-red-600' },
                { label: 'Bounced', value: stats.bounced, color: 'text-orange-600' },
                { label: 'This Week', value: stats.thisWeek, color: 'text-purple-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{s.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Search by name, email, or subject..." value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 outline-none text-sm" />
                </div>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none">
                  {emailTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none">
                  <option value="all">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                  <option value="bounced">Bounced</option>
                </select>
                <button onClick={downloadEmailCSV}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition text-sm flex items-center gap-2">
                  <Download className="h-4 w-4" /> Export
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Date</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Recipient</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Type</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Subject</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900 text-xs">{new Date(log.sent_date).toLocaleDateString()}</p>
                          <p className="text-xs text-slate-500">{new Date(log.sent_date).toLocaleTimeString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900 text-xs">{log.lead_name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">{log.lead_email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${emailTypeColors[log.email_type] || 'bg-slate-100 text-slate-700'}`}>
                            {log.email_type?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-700 max-w-xs truncate" title={log.subject}>{log.subject || 'No subject'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            log.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            log.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>{log.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          {log.error_message
                            ? <p className="text-xs text-red-600 max-w-xs truncate" title={log.error_message}>{log.error_message}</p>
                            : <span className="text-xs text-slate-400">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredLogs.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-sm">No email logs found.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* LOB LETTERS TAB */}
        {tab === "letters" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Letters', value: lobStats.total, color: 'text-slate-900' },
                { label: 'Mailed', value: lobStats.mailed, color: 'text-blue-600' },
                { label: 'Delivered', value: lobStats.delivered, color: 'text-green-600' },
                { label: 'Failed/Returned', value: lobStats.failed, color: 'text-red-600' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{s.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Search by name, address, or Lob ID..." value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 outline-none text-sm" />
                </div>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none">
                  <option value="all">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="mailed">Mailed</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                  <option value="returned">Returned</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={downloadLobCSV}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition text-sm flex items-center gap-2">
                  <Download className="h-4 w-4" /> Export
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Veteran</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Property Address</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Lob Letter ID</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Last Updated</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Est. Cost</th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-700">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLobLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-slate-200 hover:bg-amber-50 transition cursor-pointer"
                        onClick={() => setSelectedLobLead(lead)}
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{lead.first_name} {lead.last_name}</p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-700">{lead.property_address}</p>
                          <p className="text-xs text-slate-500">{lead.city}, {lead.state} {lead.zip_code}</p>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-700">
                            {lead.lob_letter_id}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${lobStatusColor(lead.lob_delivery_status)}`}>
                            {lead.lob_delivery_status || 'processing'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-600">
                            {lead.lob_last_updated ? new Date(lead.lob_last_updated).toLocaleDateString() : '—'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-semibold text-slate-700">
                            {lead.lob_estimated_cost ? `$${lead.lob_estimated_cost.toFixed(2)}` : '—'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedLobLead(lead); }}
                            className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 transition"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredLobLeads.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-sm">No Lob letters found.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Lob Letter Detail Modal */}
      {selectedLobLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Lob Letter Detail</h2>
                <p className="text-xs text-slate-500">{selectedLobLead.first_name} {selectedLobLead.last_name}</p>
              </div>
              <button onClick={() => setSelectedLobLead(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Recipient</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedLobLead.first_name} {selectedLobLead.last_name}</p>
                  {selectedLobLead.email && <p className="text-xs text-slate-500">{selectedLobLead.email}</p>}
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Delivery Status</p>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full capitalize ${lobStatusColor(selectedLobLead.lob_delivery_status)}`}>
                    {selectedLobLead.lob_delivery_status || 'processing'}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Mailing Address</p>
                  <p className="text-sm text-slate-800">{selectedLobLead.property_address}</p>
                  <p className="text-sm text-slate-800">{selectedLobLead.city}, {selectedLobLead.state} {selectedLobLead.zip_code}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Lob Letter ID</p>
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-700 block">
                    {selectedLobLead.lob_letter_id}
                  </code>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Estimated Cost</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedLobLead.lob_estimated_cost ? `$${selectedLobLead.lob_estimated_cost.toFixed(2)}` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Last Status Update</p>
                  <p className="text-sm text-slate-800">
                    {selectedLobLead.lob_last_updated ? new Date(selectedLobLead.lob_last_updated).toLocaleString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Delivery Date</p>
                  <p className="text-sm text-slate-800">
                    {selectedLobLead.lob_delivery_date ? new Date(selectedLobLead.lob_delivery_date).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Mail Approval</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    selectedLobLead.mail_approval_status === 'approved' || selectedLobLead.mail_approval_status === 'sent'
                      ? 'bg-green-100 text-green-800'
                      : selectedLobLead.mail_approval_status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedLobLead.mail_approval_status || 'pending'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Direct Mail Sent</p>
                  <p className="text-sm text-slate-800">{selectedLobLead.direct_mail_sent ? '✓ Yes' : '✗ No'}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`https://dashboard.lob.com/letters/${selectedLobLead.lob_letter_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition"
                >
                  <ExternalLink className="h-4 w-4" /> View on Lob
                </a>
                <button
                  onClick={() => setSelectedLobLead(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}