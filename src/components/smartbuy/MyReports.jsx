import { useState, useEffect } from "react";
import { Download, Trash2, Plus, FileText, MapPin, Calendar, Zap, Search, Filter } from "lucide-react";
import { base44 } from "@/api/base44Client";

const REPORT_TYPES = {
  property_valuation: { label: "Property Valuation", icon: "📊", color: "emerald" },
  market_intelligence: { label: "Market Intelligence", icon: "📈", color: "blue" },
  risk_assessment: { label: "Risk Assessment", icon: "⚠️", color: "amber" },
  investment_analysis: { label: "Investment Analysis", icon: "💰", color: "violet" }
};

function ReportCard({ report, onDelete }) {
  const typeInfo = REPORT_TYPES[report.report_type];
  const colorMap = {
    emerald: "border-emerald-200 bg-emerald-50",
    blue: "border-blue-200 bg-blue-50",
    amber: "border-amber-200 bg-amber-50",
    violet: "border-violet-200 bg-violet-50"
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this report?")) {
      await base44.entities.Report.delete(report.id);
      onDelete(report.id);
    }
  };

  return (
    <div className={`rounded-xl border p-4 ${colorMap[typeInfo.color]} hover:shadow-md transition`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl">{typeInfo.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-slate-900">{typeInfo.label}</p>
            <p className="text-xs text-slate-600 truncate mt-0.5">{report.property_address}</p>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-xs font-bold text-slate-600">{report.tokens_spent}</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-600 mb-4 pb-3 border-t border-slate-200/50 pt-3">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(report.purchase_date).toLocaleDateString()}
        </div>
        <span className="text-slate-400">•</span>
        <span className={`px-2 py-0.5 rounded-full font-semibold ${
          report.status === "completed" ? "bg-green-100 text-green-700" :
          report.status === "pending" ? "bg-yellow-100 text-yellow-700" :
          "bg-red-100 text-red-700"
        }`}>
          {report.status}
        </span>
      </div>

      {/* Notes */}
      {report.notes && (
        <p className="text-xs text-slate-600 mb-3 italic">"{report.notes}"</p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {report.report_url && report.status === "completed" && (
          <a
            href={report.report_url}
            download
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        )}
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 font-bold text-xs hover:bg-red-100 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function MyReports({ userEmail }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      if (!userEmail) return;
      setLoading(true);
      const data = await base44.entities.Report.filter({ user_email: userEmail }, "-purchase_date", 100);
      setReports(data || []);
      setLoading(false);
    };
    fetchReports();
  }, [userEmail]);

  const filtered = reports.filter(r => {
    const matchesSearch = r.property_address.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || r.report_type === filterType;
    return matchesSearch && matchesType;
  });

  const totalTokensSpent = reports.reduce((sum, r) => sum + r.tokens_spent, 0);
  const completedReports = reports.filter(r => r.status === "completed").length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900">My Reports</h3>
          <p className="text-sm text-slate-600 mt-1">HouseCanary evaluations you've purchased</p>
        </div>
        <a href="/marketplace"
          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-black rounded-lg text-sm hover:bg-emerald-700 transition whitespace-nowrap">
          <Plus className="h-4 w-4" /> Buy Report
        </a>
      </div>

      {/* Stats */}
      {reports.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 pb-6 border-b border-slate-200">
          <div className="bg-slate-50 rounded-lg px-3 py-2.5">
            <p className="text-[10px] text-slate-600 font-semibold uppercase mb-0.5">Total Reports</p>
            <p className="text-xl font-black text-slate-900">{reports.length}</p>
          </div>
          <div className="bg-emerald-50 rounded-lg px-3 py-2.5">
            <p className="text-[10px] text-emerald-700 font-semibold uppercase mb-0.5">Completed</p>
            <p className="text-xl font-black text-emerald-700">{completedReports}</p>
          </div>
          <div className="bg-amber-50 rounded-lg px-3 py-2.5">
            <p className="text-[10px] text-amber-700 font-semibold uppercase mb-0.5">Tokens Spent</p>
            <div className="flex items-baseline gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-600" />
              <p className="text-xl font-black text-amber-700">{totalTokensSpent}</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg px-3 py-2.5">
            <p className="text-[10px] text-blue-700 font-semibold uppercase mb-0.5">Avg per Report</p>
            <p className="text-xl font-black text-blue-700">{Math.round(totalTokensSpent / reports.length)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      {reports.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by address..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="all">All Types</option>
              {Object.entries(REPORT_TYPES).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-sm text-slate-600 mt-3">Loading reports...</p>
        </div>
      )}

      {/* Reports Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onDelete={(id) => setReports(r => r.filter(x => x.id !== id))}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && reports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold mb-1">No reports yet</p>
          <p className="text-sm text-slate-500 mb-4">Purchase HouseCanary evaluations to view them here</p>
          <a href="/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-black rounded-lg text-sm hover:bg-emerald-700 transition">
            <Plus className="h-4 w-4" /> Get Started
          </a>
        </div>
      )}

      {/* No Results */}
      {!loading && reports.length > 0 && filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-600 text-sm">No reports match your search</p>
        </div>
      )}
    </div>
  );
}