import { useState } from "react";

const NODES = {
  // ── Sources ──
  propertyRadar: { id: "propertyRadar", label: "PropertyRadar API", icon: "🛰️", color: "bg-blue-900 border-blue-500 text-blue-200", group: "source", x: 0, y: 0 },
  fieldActivator: { id: "fieldActivator", label: "Field Activator\n(Door Knock)", icon: "🚪", color: "bg-blue-900 border-blue-500 text-blue-200", group: "source", x: 0, y: 1 },
  publicForm: { id: "publicForm", label: "Public Opt-In\n/vton-scan", icon: "📱", color: "bg-blue-900 border-blue-500 text-blue-200", group: "source", x: 0, y: 2 },

  // ── Leads ──
  vtonLead: { id: "vtonLead", label: "VTONLead\nEntity", icon: "🗃️", color: "bg-slate-700 border-slate-400 text-white", group: "entity", x: 1, y: 1 },
  vtonOpportunity: { id: "vtonOpportunity", label: "VTONOpportunity\n(Partner Assigned)", icon: "🤝", color: "bg-slate-700 border-slate-400 text-white", group: "entity", x: 1, y: 0 },

  // ── Scoring & Enrichment ──
  priorityScore: { id: "priorityScore", label: "Priority Score\n(0–100)", icon: "🎯", color: "bg-violet-900 border-violet-500 text-violet-200", group: "logic", x: 2, y: 0 },
  suppression: { id: "suppression", label: "Suppression\nCheck", icon: "🚫", color: "bg-violet-900 border-violet-500 text-violet-200", group: "logic", x: 2, y: 1 },
  approvalQueue: { id: "approvalQueue", label: "Mail Approval\nQueue", icon: "✅", color: "bg-violet-900 border-violet-500 text-violet-200", group: "logic", x: 2, y: 2 },

  // ── Outreach Channels ──
  lob: { id: "lob", label: "Lob Direct Mail\n(Physical Letter)", icon: "✉️", color: "bg-emerald-900 border-emerald-500 text-emerald-200", group: "channel", x: 3, y: 0 },
  resend: { id: "resend", label: "Resend Email\n(Welcome Letter)", icon: "📧", color: "bg-emerald-900 border-emerald-500 text-emerald-200", group: "channel", x: 3, y: 1 },
  twilio: { id: "twilio", label: "Twilio SMS\n(Outbound + Inbound)", icon: "💬", color: "bg-emerald-900 border-emerald-500 text-emerald-200", group: "channel", x: 3, y: 2 },
  meta: { id: "meta", label: "Meta Custom\nAudience Sync", icon: "📣", color: "bg-emerald-900 border-emerald-500 text-emerald-200", group: "channel", x: 3, y: 3 },

  // ── Tracking ──
  lobWebhook: { id: "lobWebhook", label: "Lob Webhook\nDelivery Updates", icon: "🔔", color: "bg-amber-900 border-amber-500 text-amber-200", group: "tracking", x: 4, y: 0 },
  emailLog: { id: "emailLog", label: "VTONEmailLog\nEntity", icon: "📋", color: "bg-amber-900 border-amber-500 text-amber-200", group: "tracking", x: 4, y: 1 },
  smsInbound: { id: "smsInbound", label: "Inbound SMS\n→ Suppression Update", icon: "↩️", color: "bg-amber-900 border-amber-500 text-amber-200", group: "tracking", x: 4, y: 2 },

  // ── Outcomes ──
  booking: { id: "booking", label: "Benefit Review\nBooked", icon: "📅", color: "bg-rose-900 border-rose-500 text-rose-200", group: "outcome", x: 5, y: 0 },
  partnerDash: { id: "partnerDash", label: "Partner Dashboard\n(/partner)", icon: "🧑‍💼", color: "bg-rose-900 border-rose-500 text-rose-200", group: "outcome", x: 5, y: 1 },
  adminDash: { id: "adminDash", label: "Admin Dashboards\n(Mail / Email / Errors)", icon: "🖥️", color: "bg-rose-900 border-rose-500 text-rose-200", group: "outcome", x: 5, y: 2 },
  activatorPay: { id: "activatorPay", label: "Activator Payment\n($15 / verified door)", icon: "💵", color: "bg-rose-900 border-rose-500 text-rose-200", group: "outcome", x: 5, y: 3 },
};

const EDGES = [
  // Sources → Lead entities
  { from: "propertyRadar", to: "vtonOpportunity", label: "importPropertyRadarOpportunities\n(round-robin partner assign)" },
  { from: "propertyRadar", to: "vtonLead", label: "vtonBulkImportPropertyRadar\n(batch w/ import_batch_id)" },
  { from: "fieldActivator", to: "vtonLead", label: "QR scan → /vton-scan\nmulti-step wizard" },
  { from: "publicForm", to: "vtonLead", label: "VTONPublicOptIn\ndirect form capture" },

  // Lead → Logic
  { from: "vtonLead", to: "priorityScore", label: "calculateLeadPriorityScore\non create" },
  { from: "vtonLead", to: "suppression", label: "check before every\noutreach action" },
  { from: "vtonLead", to: "approvalQueue", label: "mail_approval_status\n= pending_approval" },
  { from: "vtonOpportunity", to: "partnerDash", label: "notifyPartnerNewOpportunity\n→ partner sees it" },

  // Logic → Channels
  { from: "approvalQueue", to: "lob", label: "admin approves →\nvtonDirectMailQueue" },
  { from: "suppression", to: "resend", label: "if active →\nsendVTONWelcomeLetter" },
  { from: "suppression", to: "twilio", label: "if active →\nsendSMS" },
  { from: "vtonLead", to: "meta", label: "syncMetaCustomAudience\n(email hash push)" },

  // Channels → Tracking
  { from: "lob", to: "lobWebhook", label: "Lob delivery webhook\n→ lobWebhookHandler" },
  { from: "resend", to: "emailLog", label: "every send logged\nto VTONEmailLog" },
  { from: "twilio", to: "smsInbound", label: "STOP reply →\nttwilioInboundSMS" },

  // Tracking → Lead update
  { from: "lobWebhook", to: "vtonLead", label: "updates lob_delivery_status\nlob_delivery_date" },
  { from: "smsInbound", to: "vtonLead", label: "updates suppression_status\n= unsubscribed" },

  // → Outcomes
  { from: "vtonLead", to: "booking", label: "/vton-benefit booking page\nappointment_booked = true" },
  { from: "lob", to: "adminDash", label: "error dashboard\n/vton-lob-errors" },
  { from: "emailLog", to: "adminDash", label: "/vton-email-history\nstatus view" },
  { from: "fieldActivator", to: "activatorPay", label: "createVerifiedDoorPayment\n$15 per verified door" },
];

const GROUP_LABELS = {
  source: { label: "Data Sources", color: "text-blue-400" },
  entity: { label: "Core Entities", color: "text-slate-300" },
  logic: { label: "Logic / Gates", color: "text-violet-400" },
  channel: { label: "Outreach Channels", color: "text-emerald-400" },
  tracking: { label: "Tracking / Webhooks", color: "text-amber-400" },
  outcome: { label: "Outcomes", color: "text-rose-400" },
};

const COL_WIDTH = 220;
const ROW_HEIGHT = 110;
const NODE_W = 180;
const NODE_H = 72;
const PADDING_X = 40;
const PADDING_Y = 60;

function nodeCenter(node) {
  return {
    cx: PADDING_X + node.x * COL_WIDTH + NODE_W / 2,
    cy: PADDING_Y + node.y * ROW_HEIGHT + NODE_H / 2,
  };
}

function EdgePath({ edge, nodes, activeEdge, onHover }) {
  const from = nodes[edge.from];
  const to = nodes[edge.to];
  if (!from || !to) return null;

  const fc = nodeCenter(from);
  const tc = nodeCenter(to);

  const dx = tc.cx - fc.cx;
  const dy = tc.cy - fc.cy;

  // Bezier control points
  const cp1x = fc.cx + dx * 0.5;
  const cp1y = fc.cy;
  const cp2x = tc.cx - dx * 0.5;
  const cp2y = tc.cy;

  const isActive = activeEdge === edge.from + edge.to;

  return (
    <g
      onMouseEnter={() => onHover(edge.from + edge.to)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      <path
        d={`M ${fc.cx} ${fc.cy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${tc.cx} ${tc.cy}`}
        fill="none"
        stroke={isActive ? "#f59e0b" : "#334155"}
        strokeWidth={isActive ? 2.5 : 1.5}
        strokeDasharray={isActive ? "none" : "5,3"}
        markerEnd="url(#arrow)"
        opacity={isActive ? 1 : 0.5}
      />
      {isActive && (
        <foreignObject
          x={(fc.cx + tc.cx) / 2 - 90}
          y={(fc.cy + tc.cy) / 2 - 28}
          width="180"
          height="56"
        >
          <div className="bg-slate-900 border border-amber-500 rounded-lg px-2 py-1.5 text-[9px] text-amber-300 leading-snug text-center shadow-xl whitespace-pre-line">
            {edge.label}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

function NodeBox({ node, isActive, onClick, isHighlighted }) {
  const cx = PADDING_X + node.x * COL_WIDTH;
  const cy = PADDING_Y + node.y * ROW_HEIGHT;

  return (
    <foreignObject x={cx} y={cy} width={NODE_W} height={NODE_H}>
      <div
        onClick={() => onClick(node.id)}
        className={`w-full h-full rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 px-2 cursor-pointer transition-all duration-150 select-none
          ${node.color}
          ${isActive ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-950 scale-105 shadow-lg" : ""}
          ${isHighlighted === false ? "opacity-30" : "opacity-100"}
        `}
        style={{ fontSize: 10 }}
      >
        <span className="text-lg leading-none">{node.icon}</span>
        <span className="font-bold text-center leading-tight whitespace-pre-line" style={{ fontSize: 9 }}>{node.label}</span>
      </div>
    </foreignObject>
  );
}

export default function VTONArchitectureMap() {
  const [activeNode, setActiveNode] = useState(null);
  const [activeEdge, setActiveEdge] = useState(null);
  const [filterGroup, setFilterGroup] = useState(null);

  const handleNodeClick = (id) => {
    setActiveNode(prev => prev === id ? null : id);
    setActiveEdge(null);
  };

  // Find connected edges for active node
  const connectedEdgeIds = activeNode
    ? EDGES.filter(e => e.from === activeNode || e.to === activeNode).map(e => e.from + e.to)
    : [];

  const connectedNodeIds = activeNode
    ? new Set(EDGES.filter(e => e.from === activeNode || e.to === activeNode).flatMap(e => [e.from, e.to]))
    : null;

  const totalW = PADDING_X * 2 + 6 * COL_WIDTH;
  const totalH = PADDING_Y * 2 + 4 * ROW_HEIGHT + 20;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">VTON Architecture Map</h1>
            <p className="text-slate-400 text-sm mt-0.5">Click any node to trace its connections. Hover edges to see function names.</p>
          </div>
          <a href="/vton-campaign" className="px-4 py-2 text-xs font-bold bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition text-slate-300">
            ← VTON Dashboard
          </a>
        </div>

        {/* Group Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setFilterGroup(null)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition border ${!filterGroup ? "bg-white text-slate-900 border-white" : "border-slate-600 text-slate-400 hover:border-slate-400"}`}
          >
            All Layers
          </button>
          {Object.entries(GROUP_LABELS).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => setFilterGroup(prev => prev === key ? null : key)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition border ${filterGroup === key ? "bg-slate-700 border-amber-400 text-amber-300" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}
            >
              <span className={color}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto mb-4 flex flex-wrap gap-3">
        {Object.entries(GROUP_LABELS).map(([key, { label, color }]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${
              key === "source" ? "bg-blue-500" :
              key === "entity" ? "bg-slate-400" :
              key === "logic" ? "bg-violet-500" :
              key === "channel" ? "bg-emerald-500" :
              key === "tracking" ? "bg-amber-500" :
              "bg-rose-500"
            }`} />
            <span className={`text-[10px] font-bold ${color}`}>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-4">
          <div className="w-6 border-t-2 border-dashed border-slate-500" />
          <span className="text-[10px] text-slate-500">data flow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 border-t-2 border-amber-500" />
          <span className="text-[10px] text-slate-500">active path</span>
        </div>
      </div>

      {/* SVG Graph */}
      <div className="max-w-7xl mx-auto overflow-x-auto">
        <div style={{ minWidth: totalW }}>
          <svg
            width={totalW}
            height={totalH}
            className="block"
            style={{ background: "transparent" }}
          >
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#475569" />
              </marker>
            </defs>

            {/* Column labels */}
            {["Sources", "Entities", "Logic / Gates", "Outreach Channels", "Tracking / Webhooks", "Outcomes"].map((label, i) => (
              <text
                key={i}
                x={PADDING_X + i * COL_WIDTH + NODE_W / 2}
                y={24}
                textAnchor="middle"
                fill="#64748b"
                fontSize={10}
                fontWeight="700"
                fontFamily="monospace"
                textTransform="uppercase"
              >
                {label}
              </text>
            ))}

            {/* Edges */}
            {EDGES.map((edge, i) => {
              const fromNode = NODES[edge.from];
              const toNode = NODES[edge.to];
              if (!fromNode || !toNode) return null;
              if (filterGroup && fromNode.group !== filterGroup && toNode.group !== filterGroup) return null;
              const isHighlighted = activeNode
                ? connectedEdgeIds.includes(edge.from + edge.to)
                : true;

              return (
                <EdgePath
                  key={i}
                  edge={edge}
                  nodes={NODES}
                  activeEdge={activeEdge}
                  onHover={setActiveEdge}
                />
              );
            })}

            {/* Nodes */}
            {Object.values(NODES).map(node => {
              if (filterGroup && node.group !== filterGroup) return null;
              const isActive = activeNode === node.id;
              const isHighlighted = activeNode
                ? connectedNodeIds?.has(node.id) || activeNode === node.id
                : true;

              return (
                <NodeBox
                  key={node.id}
                  node={node}
                  isActive={isActive}
                  onClick={handleNodeClick}
                  isHighlighted={isHighlighted ? null : false}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Active node detail panel */}
      {activeNode && (
        <div className="max-w-7xl mx-auto mt-6">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{NODES[activeNode]?.icon}</span>
              <div>
                <h2 className="text-base font-black text-white">{NODES[activeNode]?.label?.replace(/\n/g, " ")}</h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{GROUP_LABELS[NODES[activeNode]?.group]?.label}</span>
              </div>
              <button onClick={() => setActiveNode(null)} className="ml-auto text-slate-500 hover:text-white transition text-sm">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Outgoing */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">→ Sends to</p>
                {EDGES.filter(e => e.from === activeNode).length === 0 && (
                  <p className="text-xs text-slate-500 italic">No outgoing connections</p>
                )}
                {EDGES.filter(e => e.from === activeNode).map((e, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">{NODES[e.to]?.label?.replace(/\n/g, " ")}</p>
                      <p className="text-[10px] text-slate-400 leading-snug whitespace-pre-line">{e.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Incoming */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">← Receives from</p>
                {EDGES.filter(e => e.to === activeNode).length === 0 && (
                  <p className="text-xs text-slate-500 italic">No incoming connections</p>
                )}
                {EDGES.filter(e => e.to === activeNode).map((e, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">{NODES[e.from]?.label?.replace(/\n/g, " ")}</p>
                      <p className="text-[10px] text-slate-400 leading-snug whitespace-pre-line">{e.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!activeNode && (
        <div className="max-w-7xl mx-auto mt-6 text-center">
          <p className="text-xs text-slate-600">Click any node to see its connections · Hover edges to see backend function names · Use layer filters to focus a section</p>
        </div>
      )}
    </div>
  );
}