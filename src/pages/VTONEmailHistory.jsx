import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Mail, CheckCircle, XCircle, AlertCircle, Search, Filter, Download, Eye } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

export default function VTONEmailHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    delivered: 0,
    opened: 0,
    failed: 0,
    bounced: 0,
    thisWeek: 0
  });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const allLogs = await base44.asServiceRole.entities.VTONEmailLog.list('-sent_date', 500);
      setLogs(allLogs);

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats = {
        total: allLogs.length,
        sent: allLogs.filter(l => l.status === 'sent').length,
        delivered: allLogs.filter(l => l.status === 'delivered').length,
        opened: allLogs.filter(l => l.status === 'opened').length,
        failed: allLogs.filter(l => l.status === 'failed').length,
        bounced: allLogs.filter(l => l.status === 'bounced').length,
        thisWeek: allLogs.filter(l => new Date(l.sent_date) > weekAgo).length
      };
      setStats(stats);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load email logs:", err);
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

  const emailTypes = [
    { value: 'all', label: 'All Types', color: 'bg-slate-100 text-slate-700' },
    { value: 'lead_confirmation', label: 'Lead Confirmation', color: 'bg-blue-100 text-blue-800' },
    { value: 'test_email', label: 'Test Email', color: 'bg-purple-100 text-purple-800' },
    { value: 'consultation_booking', label: 'Consultation Booking', color: 'bg-green-100 text-green-800' },
    { value: 'welcome_letter', label: 'Welcome Letter', color: 'bg-amber-100 text-amber-800' },
    { value: 'follow_up', label: 'Follow Up', color: 'bg-pink-100 text-pink-800' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  const statusConfig = {
    sent: { color: 'bg-blue-100 text-blue-800', icon: Mail, label: 'Sent' },
    delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
    opened: { color: 'bg-purple-100 text-purple-800', icon: Eye, label: 'Opened' },
    failed: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Failed' },
    bounced: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Bounced' }
  };

  const downloadCSV = () => {
    const headers = [
      'Sent Date', 'Lead Name', 'Lead Email', 'Email Type', 'Subject', 'Status', 'Error Message', 'Notes'
    ];
    const rows = logs.map(l => [
      new Date(l.sent_date).toLocaleString(),
      l.lead_name || '',
      l.lead_email || '',
      l.email_type,
      (l.subject || '').replace(/,/g, ';'),
      l.status,
      (l.error_message || '').replace(/,/g, ';'),
      (l.notes || '').replace(/,/g, ';')
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vton-email-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading email history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div style={{ background: NAVY }} className="text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">VTON™ Email History</h1>
          <p className="text-blue-300">Track all automated email deliveries to veterans and homeowners</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Emails</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <Mail className="h-8 w-8 text-slate-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Sent</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.sent}</p>
              </div>
              <Mail className="h-8 w-8 text-slate-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Delivered</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-slate-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Opened</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.opened}</p>
              </div>
              <Eye className="h-8 w-8 text-slate-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Failed</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.failed}</p>
              </div>
              <XCircle className="h-8 w-8 text-slate-300" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">This Week</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.thisWeek}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-slate-300" />
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
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              {emailTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="opened">Opened</option>
              <option value="failed">Failed</option>
              <option value="bounced">Bounced</option>
            </select>
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition text-sm flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>

        {/* Email Logs Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: '#f8fafc' }}>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Date & Time</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Recipient</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Subject</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Error</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const StatusIcon = statusConfig[log.status]?.icon || AlertCircle;
                  return (
                    <tr key={log.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900 text-xs">
                            {new Date(log.sent_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(log.sent_date).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900 text-xs">{log.lead_name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">{log.lead_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          emailTypes.find(t => t.value === log.email_type)?.color || 'bg-slate-100 text-slate-700'
                        }`}>
                          {log.email_type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-700 max-w-xs truncate" title={log.subject}>
                          {log.subject || 'No subject'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${
                            log.status === 'sent' || log.status === 'delivered' ? 'text-green-600' : 'text-red-600'
                          }`} />
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            statusConfig[log.status]?.color || 'bg-slate-100 text-slate-700'
                          }`}>
                            {statusConfig[log.status]?.label || log.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {log.error_message ? (
                          <p className="text-xs text-red-600 max-w-xs truncate" title={log.error_message}>
                            {log.error_message}
                          </p>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Mail className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-sm">No email logs found matching your search.</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ About Email Logging:</strong> Every automated email sent through the VTON system is logged here for tracking and verification. This includes lead confirmations, test emails, consultation booking notifications, and welcome letters. Failed deliveries include error messages for troubleshooting.
          </p>
        </div>
      </div>
    </div>
  );
}