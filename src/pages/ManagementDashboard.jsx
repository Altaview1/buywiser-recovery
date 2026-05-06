import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";
import { TrendingUp, MapPin, Phone, Clock, CheckCircle, LogOut, RefreshCw } from "lucide-react";

const NAVY = "#0B1F3B";

export default function ManagementDashboard() {
  const [user, setUser] = useState(null);
  const [activators, setActivators] = useState([]);
  const [leads, setLeads] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const me = await base44.auth.me();
      if (!me || me.role !== "admin") {
        base44.auth.redirectToLogin();
        return;
      }
      setUser(me);
      fetchData();
    };
    checkAuth();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [a, l, v] = await Promise.all([
      base44.entities.FieldActivator.filter({ status: "active" }, "-created_date", 100),
      base44.entities.ActivatorLead.list("-created_date", 500),
      base44.entities.Visit.list("-visit_date", 500),
    ]);
    setActivators(a);
    setLeads(l);
    setVisits(v);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // Build rep performance data
  const repStats = activators.map(a => {
    const repLeads = leads.filter(l => l.rep_code === a.rep_code);
    const repVisits = visits.filter(v => v.activator_id === a.id);
    const contactedLeads = repLeads.filter(l => l.status !== "SCANNED");
    const scheduledLeads = repLeads.filter(l => ["SCHEDULED", "COMPLETED", "CLOSED"].includes(l.status));
    const contactRate = repLeads.length > 0 ? Math.round((contactedLeads.length / repLeads.length) * 100) : 0;
    
    return {
      name: a.name,
      rep_id: a.id,
      total_leads: repLeads.length,
      contacted: contactedLeads.length,
      scheduled: scheduledLeads.length,
      contact_rate: contactRate,
      total_visits: repVisits.length,
      today_visits: repVisits.filter(v => new Date(v.visit_date).toDateString() === new Date().toDateString()).length,
    };
  });

  // Visit outcomes summary
  const visitOutcomes = {
    no_answer: visits.filter(v => v.status === "no_answer").length,
    spoke_homeowner: visits.filter(v => v.status === "spoke_homeowner").length,
    code_scanned: visits.filter(v => v.status === "code_scanned").length,
    not_interested: visits.filter(v => v.status === "not_interested").length,
    callback_scheduled: visits.filter(v => v.status === "callback_scheduled").length,
  };

  // Daily visits trend (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const count = visits.filter(v => new Date(v.visit_date).toDateString() === dateStr).length;
    return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), visits: count };
  });

  const totalLeads = leads.length;
  const totalVisits = visits.length;
  const avgVisitsPerRep = repStats.length > 0 ? Math.round(totalVisits / repStats.length) : 0;
  const conversionRate = totalVisits > 0 ? Math.round(((visitOutcomes.spoke_homeowner + visitOutcomes.code_scanned) / totalVisits) * 100) : 0;

  // Lead type analytics
  const leadTypeStats = ["MORTGAGE", "FULL_STACK", "UNDECIDED"].map(type => {
    const typeLeads = leads.filter(l => l.lead_type === type);
    const booked = typeLeads.filter(l => l.appointment_scheduled).length;
    const closed = typeLeads.filter(l => l.status === "COMPLETED" || l.status === "CLOSED").length;
    return {
      type,
      count: typeLeads.length,
      booking_rate: typeLeads.length > 0 ? Math.round((booked / typeLeads.length) * 100) : 0,
      close_rate: typeLeads.length > 0 ? Math.round((closed / typeLeads.length) * 100) : 0,
    };
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Field Activation</p>
            <h1 className="text-lg font-bold text-slate-800 mt-0.5">Management Dashboard</h1>
          </div>
          <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-slate-800">{totalLeads}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Leads</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-blue-700">{totalVisits}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Visits</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-green-700">{conversionRate}%</p>
            <p className="text-xs text-slate-500 mt-0.5">Conversation Rate</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-purple-700">{avgVisitsPerRep}</p>
            <p className="text-xs text-slate-500 mt-0.5">Avg Visits/Rep</p>
          </div>
        </div>

        {/* Lead Type Analytics */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Lead Type Performance</h3>
            <p className="text-xs text-slate-400 mt-0.5">Booking & close rates by classification</p>
          </div>
          <div className="divide-y divide-slate-100">
            {leadTypeStats.map(({ type, count, booking_rate, close_rate }) => {
              const colors = {
                MORTGAGE: { bg: "bg-blue-50", text: "text-blue-700", tag: "bg-blue-100 text-blue-700" },
                FULL_STACK: { bg: "bg-green-50", text: "text-green-700", tag: "bg-green-100 text-green-700" },
                UNDECIDED: { bg: "bg-amber-50", text: "text-amber-700", tag: "bg-amber-100 text-amber-700" },
              }[type];
              return (
                <div key={type} className="px-5 py-4 flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black ${colors.tag} w-28 text-center flex-shrink-0`}>{type}</span>
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-lg font-black text-slate-800">{count}</p>
                      <p className="text-xs text-slate-400">Total</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-black ${colors.text}`}>{booking_rate}%</p>
                      <p className="text-xs text-slate-400">Booking Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-purple-700">{close_rate}%</p>
                      <p className="text-xs text-slate-400">Close Rate</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Visits Trend */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Visits Over Time (7 days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={last7Days}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Line type="monotone" dataKey="visits" stroke={NAVY} strokeWidth={2} dot={{ fill: NAVY, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Visit Outcomes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Visit Outcomes</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: "No Answer", value: visitOutcomes.no_answer, fill: "#cbd5e1" },
                { name: "Spoke", value: visitOutcomes.spoke_homeowner, fill: "#3b82f6" },
                { name: "Code Scanned", value: visitOutcomes.code_scanned, fill: "#10b981" },
                { name: "Not Interested", value: visitOutcomes.not_interested, fill: "#ef4444" },
                { name: "Callback", value: visitOutcomes.callback_scheduled, fill: "#8b5cf6" },
              ]}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {[
                    { name: "No Answer", value: visitOutcomes.no_answer, fill: "#cbd5e1" },
                    { name: "Spoke", value: visitOutcomes.spoke_homeowner, fill: "#3b82f6" },
                    { name: "Code Scanned", value: visitOutcomes.code_scanned, fill: "#10b981" },
                    { name: "Not Interested", value: visitOutcomes.not_interested, fill: "#ef4444" },
                    { name: "Callback", value: visitOutcomes.callback_scheduled, fill: "#8b5cf6" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rep Performance Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Field Activator Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Rep Name</th>
                  <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">Total Leads</th>
                  <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">Contacted</th>
                  <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">Contact %</th>
                  <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">Scheduled</th>
                  <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">Total Visits</th>
                  <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">Today</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {repStats.map((rep, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4 font-semibold text-slate-900">{rep.name}</td>
                    <td className="px-5 py-4 text-center font-bold text-slate-800">{rep.total_leads}</td>
                    <td className="px-5 py-4 text-center font-bold text-blue-700">{rep.contacted}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        rep.contact_rate >= 50 ? "bg-green-100 text-green-700" :
                        rep.contact_rate >= 25 ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>{rep.contact_rate}%</span>
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-purple-700">{rep.scheduled}</td>
                    <td className="px-5 py-4 text-center font-bold text-slate-800">{rep.total_visits}</td>
                    <td className="px-5 py-4 text-center">
                      {rep.today_visits > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3" /> {rep.today_visits}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Visits */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Recent Visits (Last 10)</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {visits.slice(0, 10).map((v, i) => {
              const lead = leads.find(l => l.id === v.lead_id);
              const rep = activators.find(a => a.id === v.activator_id);
              return (
                <div key={i} className="px-5 py-3 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{lead?.first_name} {lead?.last_name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="h-3 w-3 flex-shrink-0" /> {lead?.property_address}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 ${
                      v.status === "spoke_homeowner" || v.status === "code_scanned" 
                        ? "bg-green-100 text-green-700"
                        : v.status === "callback_scheduled"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>{v.status.replace(/_/g, " ")}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                    <p>{rep?.name}</p>
                    <p>{new Date(v.visit_date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  {v.notes && <p className="text-xs text-slate-600 mt-1 truncate">{v.notes}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}