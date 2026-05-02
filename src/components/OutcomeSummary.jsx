import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

const STATUS_COLORS = {
  New:       "#3B82F6",
  Contacted: "#F59E0B",
  Qualified: "#9333EA",
  Closed:    "#16A34A",
  Lost:      "#94A3B8",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const total = payload[0].payload.total;
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow px-3 py-2 text-xs">
      <p className="font-bold text-slate-800">{name}</p>
      <p className="text-slate-500">{value} lead{value !== 1 ? "s" : ""} · {pct}%</p>
    </div>
  );
}

function PieCard({ title, subtitle, data, totalKey }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const enriched = data.map((d) => ({ ...d, total }));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mb-3">{subtitle}</p>}
      {total === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">No data yet</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={enriched}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {enriched.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="space-y-1.5 mt-1">
            {data.map((d) => {
              const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
              return (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-slate-700 flex-1 truncate">{d.name}</span>
                  <span className="text-xs font-bold text-slate-500">{d.value} · {pct}%</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function OutcomeSummary({ leads }) {
  const closedLeads = leads.filter((l) => l.status === "Closed");
  const total = closedLeads.length;

  // Pie 1: Close outcome breakdown
  const outcomeData = CLOSE_REASONS
    .map((r) => ({
      name: r,
      value: closedLeads.filter((l) => (l.close_reason || "Other") === r).length,
      color: REASON_COLORS[r],
    }))
    .filter((d) => d.value > 0);

  // Pie 2: All leads by status
  const statusData = Object.entries(STATUS_COLORS).map(([status, color]) => ({
    name: status,
    value: leads.filter((l) => (l.status || "New") === status).length,
    color,
  })).filter((d) => d.value > 0);

  // Per-agent close rate table
  const agentMap = {};
  for (const lead of leads) {
    const agent = lead.assigned_agent || "Unassigned";
    if (!agentMap[agent]) agentMap[agent] = { total: 0, closed: 0, reasons: {} };
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

  return (
    <div className="space-y-4">
      {/* Two pie charts side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PieCard
          title="Close Outcome Breakdown"
          subtitle={`${total} closed lead${total !== 1 ? "s" : ""}`}
          data={outcomeData}
        />
        <PieCard
          title="All Leads by Status"
          subtitle={`${leads.length} total lead${leads.length !== 1 ? "s" : ""}`}
          data={statusData}
        />
      </div>

      {/* Per-agent close rate */}
      <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Close Rate by Agent</p>
        {agentRows.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No agent data yet</p>
        ) : (
          <div className="space-y-3">
            {agentRows.map(([agent, stats]) => {
              const closeRate = stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0;
              const topReason = Object.entries(stats.reasons).sort((a, b) => b[1] - a[1])[0];
              return (
                <div key={agent}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-800 truncate">{agent}</span>
                    <span className="text-xs text-slate-400 ml-2 flex-shrink-0">
                      {stats.closed}/{stats.total} · {closeRate}%
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}