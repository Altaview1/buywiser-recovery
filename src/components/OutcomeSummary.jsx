import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { PieChart, Pie, Legend } from "recharts";

const CLOSE_REASONS = [
  "No Answer",
  "Not Interested",
  "Reserved Consultation",
  "Current Agent Loyalty",
  "Not Moving",
  "Other",
];

const REASON_COLORS = {
  "No Answer":              "#94A3B8",
  "Not Interested":         "#F87171",
  "Reserved Consultation":  "#34D399",
  "Current Agent Loyalty":  "#60A5FA",
  "Not Moving":             "#FBBF24",
  "Other":                  "#C084FC",
};

export default function OutcomeSummary({ leads }) {
  const closedLeads = leads.filter((l) => l.status === "Closed");
  const total = closedLeads.length;

  // Per-agent breakdown
  const agentMap = {};
  for (const lead of leads) {
    const agent = lead.assigned_agent || "Unassigned";
    if (!agentMap[agent]) {
      agentMap[agent] = { total: 0, closed: 0, reasons: {} };
    }
    agentMap[agent].total++;
    if (lead.status === "Closed") {
      agentMap[agent].closed++;
      const r = lead.close_reason || "Other";
      agentMap[agent].reasons[r] = (agentMap[agent].reasons[r] || 0) + 1;
    }
  }

  const agentRows = Object.entries(agentMap)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);

  // Overall outcome breakdown chart data
  const outcomeData = CLOSE_REASONS.map((r) => ({
    name: r,
    count: closedLeads.filter((l) => (l.close_reason || "Other") === r).length,
  })).filter((d) => d.count > 0);

  if (total === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl px-5 py-8 text-center">
        <p className="text-sm font-semibold text-slate-500">No closed leads yet</p>
        <p className="text-xs text-slate-400 mt-1">Outcome data will appear here once agents close leads.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall outcome breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Close Outcome Breakdown</p>
        <p className="text-xs text-slate-400 mb-4">{total} closed lead{total !== 1 ? "s" : ""} total</p>

        <div className="space-y-2.5">
          {CLOSE_REASONS.map((r) => {
            const count = closedLeads.filter((l) => (l.close_reason || "Other") === r).length;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            if (count === 0) return null;
            return (
              <div key={r}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{r}</span>
                  <span className="text-xs font-bold text-slate-500">{count} · {pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: REASON_COLORS[r] || "#94A3B8" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-agent breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Close Rate by Agent</p>
        <div className="space-y-3">
          {agentRows.map(([agent, stats]) => {
            const closeRate = stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0;
            const topReason = Object.entries(stats.reasons).sort((a, b) => b[1] - a[1])[0];
            return (
              <div key={agent} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-800 truncate">{agent}</span>
                    <span className="text-xs text-slate-400 ml-2 flex-shrink-0">
                      {stats.closed}/{stats.total} closed · {closeRate}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${closeRate}%`, background: "#16A34A" }}
                    />
                  </div>
                  {topReason && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Top reason: <span className="font-medium" style={{ color: REASON_COLORS[topReason[0]] || "#94A3B8" }}>{topReason[0]}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}