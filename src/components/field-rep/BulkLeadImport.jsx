import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, CheckCircle, AlertCircle, Loader2, ArrowRight, RefreshCw } from "lucide-react";

const NAVY = "#0B1F3B";

const SYSTEM_FIELDS = [
  { key: "first_name", label: "First Name", required: true },
  { key: "last_name", label: "Last Name", required: false },
  { key: "email", label: "Email", required: false },
  { key: "phone", label: "Phone", required: false },
  { key: "property_address", label: "Property Address", required: true },
  { key: "property_type", label: "Property Type", required: false },
  { key: "estimated_price", label: "Estimated Value", required: false },
  { key: "estimated_equity", label: "Estimated Equity", required: false },
  { key: "distress_score", label: "Distress Score", required: false },
  { key: "listing_dom", label: "Days on Market", required: false },
];

function parseCSVLine(line) {
  const cols = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') { inQuotes = !inQuotes; continue; }
    if (line[i] === ',' && !inQuotes) { cols.push(current.trim()); current = ""; continue; }
    current += line[i];
  }
  cols.push(current.trim());
  return cols;
}

function normalizeHeader(h) {
  return h.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

// Build the initial auto-mapping for a normalized header key
function guessMapping(key) {
  // Special virtual fields
  if (key === "owner") return "__owner__";
  if (key === "city") return "__city__";

  const map = {
    // address variants
    address: "property_address",
    property_address: "property_address",
    street_address: "property_address",
    situs_address: "property_address",
    // type variants
    type: "property_type",
    property_type: "property_type",
    prop_type: "property_type",
    land_use: "property_type",
    // value variants — "Est Value" → "est_value"
    est_value: "estimated_price",
    estimated_price: "estimated_price",
    estimated_value: "estimated_price",
    value: "estimated_price",
    price: "estimated_price",
    avm: "estimated_price",
    // equity variants — "Est Equity $" → "est_equity_"
    est_equity_: "estimated_equity",
    est_equity: "estimated_equity",
    estimated_equity: "estimated_equity",
    equity: "estimated_equity",
    // distress — "Distress Score" → "distress_score"
    distress_score: "distress_score",
    distress: "distress_score",
    // DOM — "Listing DOM" → "listing_dom"
    listing_dom: "listing_dom",
    dom: "listing_dom",
    days_on_market: "listing_dom",
    // name
    first_name: "first_name", firstname: "first_name", fname: "first_name",
    last_name: "last_name", lastname: "last_name", lname: "last_name",
    email: "email", email_address: "email",
    phone: "phone", phone_number: "phone", mobile: "phone", cell: "phone",
  };
  return map[key] || "__skip__";
}

// "LASTNAME,FIRSTNAME MIDDLE" → { first_name, last_name }
function parseOwnerName(owner) {
  if (!owner) return { first_name: "", last_name: "" };
  const primary = owner.split("&")[0].trim();
  const commaIdx = primary.indexOf(",");
  const tc = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
  if (commaIdx === -1) return { first_name: tc(primary), last_name: "" };
  const last = primary.slice(0, commaIdx).trim();
  const first = primary.slice(commaIdx + 1).trim().split(/\s+/)[0];
  return { first_name: tc(first) || "Owner", last_name: tc(last) };
}

function isFooterRow(row) {
  const allVals = Object.values(row).join(" ").toLowerCase();
  return (
    allVals.includes("information contained") ||
    allVals.includes("propertyradar") ||
    allVals.includes("user agreement") ||
    allVals.includes("license restriction")
  );
}

export default function BulkLeadImport({ repCode, onSuccess }) {
  const [step, setStep] = useState("upload");
  const [file, setFile] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvRows, setCsvRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [rowLog, setRowLog] = useState([]);

  const reset = () => { setFile(null); setStep("upload"); setResult(null); setRowLog([]); };

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.trim());
      const rawHeaders = parseCSVLine(lines[0].replace(/^\uFEFF/, ""));
      const headers = rawHeaders.map(normalizeHeader);

      const rows = lines.slice(1, 6).map(line => {
        const vals = parseCSVLine(line);
        const row = {};
        headers.forEach((h, i) => { row[h] = vals[i] || ""; });
        return row;
      });

      const autoMapping = {};
      headers.forEach(h => { autoMapping[h] = guessMapping(h); });

      setCsvHeaders(headers);
      setCsvRows(rows);
      setMapping(autoMapping);
      setStep("map");
    };
    reader.readAsText(f);
  };

  const handleImport = async () => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target.result;
      const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.trim());
      const headers = parseCSVLine(lines[0].replace(/^\uFEFF/, "")).map(normalizeHeader);

      const leads = [];
      const log = [];

      for (let i = 1; i < lines.length; i++) {
        const rowNum = i + 1;
        const vals = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((h, idx) => { row[h] = vals[idx] || ""; });

        // Skip empty or footer rows
        if (Object.values(row).every(v => !v.trim())) {
          log.push({ rowNum, status: "skipped", reason: "Empty row" });
          continue;
        }
        if (isFooterRow(row)) {
          log.push({ rowNum, status: "skipped", reason: "Footer/disclaimer row" });
          continue;
        }

        const lead = { rep_code: repCode || "", status: "SCANNED" };

        // Apply mapping
        for (const [csvCol, sysField] of Object.entries(mapping)) {
          if (!sysField || sysField === "__skip__") continue;
          const val = (row[csvCol] || "").trim();
          if (!val) continue;

          if (sysField === "__owner__") {
            const { first_name, last_name } = parseOwnerName(val);
            lead.first_name = lead.first_name || first_name;
            lead.last_name = lead.last_name || last_name;
          } else if (sysField === "__city__") {
            // store city for address building below
            lead.__city__ = val;
          } else if (["estimated_price", "estimated_equity", "distress_score"].includes(sysField)) {
            const n = parseFloat(val.replace(/[^0-9.-]/g, ""));
            if (!isNaN(n)) lead[sysField] = n;
          } else if (sysField === "listing_dom") {
            const n = parseInt(val);
            if (!isNaN(n)) lead[sysField] = n;
          } else {
            lead[sysField] = val;
          }
        }

        // Fallbacks for required fields
        if (!lead.first_name) lead.first_name = "Owner";
        if (!lead.email) {
          const slug = (lead.property_address || "lead").toLowerCase().replace(/\W+/g, "").slice(0, 12);
          lead.email = `lead+${slug}@placeholder.local`;
        }

        // Build full address with city
        if (lead.property_address && !lead.property_address.includes(",")) {
          const city = lead.__city__ || "";
          lead.property_address = city
            ? `${lead.property_address}, ${city}, CA`
            : `${lead.property_address}, CA`;
        }
        delete lead.__city__;

        if (!lead.property_address) {
          log.push({ rowNum, status: "skipped", reason: "No property address after mapping" });
          continue;
        }

        log.push({ rowNum, status: "ok", preview: `${lead.first_name} ${lead.last_name || ""} — ${lead.property_address}` });
        leads.push(lead);
      }

      setRowLog(log);

      if (leads.length === 0) {
        const reasons = [...new Set(log.filter(r => r.status === "skipped").map(r => r.reason))];
        setResult({ success: false, error: `No valid rows found. Reasons: ${reasons.join("; ")}` });
        setUploading(false);
        return;
      }

      try {
        await base44.entities.ActivatorLead.bulkCreate(leads);
        setResult({ success: true, count: leads.length });
        setStep("done");
        onSuccess();
      } catch (err) {
        setResult({ success: false, error: err.message });
      }
      setUploading(false);
    };
    reader.readAsText(file);
  };

  // ── UPLOAD STEP ───────────────────────────────────────────────
  if (step === "upload" || !file) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Bulk Import Leads</p>
          <p className="text-xs text-slate-500">Upload any CSV — columns are mapped automatically.</p>
        </div>
        <label className="flex flex-col items-center gap-3 px-6 py-8 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
          <Upload className="h-8 w-8 text-slate-300" />
          <span className="text-sm font-bold text-slate-500">Click to choose a CSV file</span>
          <span className="text-xs text-slate-400">PropertyRadar exports or any custom CSV</span>
          <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileSelect} />
        </label>
      </div>
    );
  }

  // ── MAP STEP ──────────────────────────────────────────────────
  if (step === "map") {
    const vals = Object.values(mapping);
    const hasName = vals.includes("first_name") || vals.includes("__owner__");
    const hasAddress = vals.includes("property_address");
    const missing = [
      ...(!hasName ? ["First Name or Owner"] : []),
      ...(!hasAddress ? ["Property Address"] : []),
    ];

    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between" style={{ background: NAVY }}>
          <div>
            <p className="text-xs font-black text-white uppercase tracking-wider">Map Your Columns</p>
            <p className="text-xs text-blue-300 mt-0.5">{file.name} — {csvHeaders.length} columns</p>
          </div>
          <button onClick={reset} className="text-xs text-blue-300 hover:text-white underline">Change file</button>
        </div>

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {missing.length > 0 ? (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span className="text-amber-700">Still need: <strong>{missing.join(", ")}</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs">
              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
              <span className="text-green-700 font-semibold">All required fields mapped — ready to import!</span>
            </div>
          )}

          <div className="space-y-2">
            {csvHeaders.map(col => {
              const samples = csvRows.map(r => r[col]).filter(Boolean).slice(0, 2);
              return (
                <div key={col} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 font-mono truncate">{col}</p>
                    <p className="text-xs text-slate-400 truncate">{samples.join(" · ") || "—"}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
                  <select
                    value={mapping[col] || "__skip__"}
                    onChange={e => setMapping(m => ({ ...m, [col]: e.target.value }))}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="__skip__">— Skip —</option>
                    <option value="__owner__">Owner Name (split first/last)</option>
                    <option value="__city__">City (append to address)</option>
                    {SYSTEM_FIELDS.map(f => (
                      <option key={f.key} value={f.key}>{f.label}{f.required ? " *" : ""}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          {/* Live preview of first row */}
          {csvRows.length > 0 && (() => {
            const previewLead = {};
            for (const [col, sysField] of Object.entries(mapping)) {
              if (!sysField || sysField === "__skip__") continue;
              const val = csvRows[0]?.[col] || "";
              if (sysField === "__owner__") {
                const { first_name, last_name } = parseOwnerName(val);
                previewLead["First Name"] = first_name;
                previewLead["Last Name"] = last_name;
              } else if (sysField === "__city__") {
                previewLead["City"] = val;
              } else {
                const label = SYSTEM_FIELDS.find(f => f.key === sysField)?.label || sysField;
                previewLead[label] = val;
              }
            }
            const entries = Object.entries(previewLead).filter(([, v]) => v);
            if (entries.length === 0) return null;
            return (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-600">Preview — First Row</p>
                </div>
                <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-1">
                  {entries.map(([label, val]) => (
                    <div key={label} className="text-xs">
                      <span className="text-slate-400">{label}: </span>
                      <span className="font-semibold text-slate-700">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
          <button
            onClick={handleImport}
            disabled={uploading || missing.length > 0}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm text-white transition disabled:opacity-40"
            style={{ background: NAVY }}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {uploading ? "Importing…" : "Import Leads"}
          </button>
          <button onClick={reset}
            className="px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
        </div>

        {result?.success === false && (
          <div className="mx-4 mb-4 space-y-2">
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              {result.error}
            </div>
            {rowLog.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <p className="px-3 py-2 text-xs font-bold text-slate-500 bg-slate-50 border-b border-slate-100">Row Log</p>
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-slate-100">
                    {rowLog.map((r, i) => (
                      <tr key={i} className={r.status === "skipped" ? "bg-amber-50" : ""}>
                        <td className="px-3 py-1.5 text-slate-400 font-mono w-12">{r.rowNum}</td>
                        <td className="px-3 py-1.5 w-16">
                          {r.status === "ok" ? <span className="text-green-600 font-bold">✓ OK</span> : <span className="text-amber-600 font-bold">⚠ Skip</span>}
                        </td>
                        <td className="px-3 py-1.5 text-slate-600 truncate max-w-[200px]">
                          {r.status === "skipped" ? <span className="text-amber-700">{r.reason}</span> : r.preview}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── DONE STEP ─────────────────────────────────────────────────
  if (step === "done") {
    const skipped = rowLog.filter(r => r.status === "skipped");
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-green-50 border-b border-green-200 px-5 py-4 text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-1" />
          <p className="text-sm font-bold text-green-800">✓ Imported {result?.count} leads successfully</p>
          {skipped.length > 0 && <p className="text-xs text-amber-600 mt-1">{skipped.length} rows skipped</p>}
        </div>
        {rowLog.length > 0 && (
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-bold text-slate-500 w-12">Row</th>
                  <th className="px-3 py-2 text-left font-bold text-slate-500 w-20">Status</th>
                  <th className="px-3 py-2 text-left font-bold text-slate-500">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rowLog.map((r, i) => (
                  <tr key={i} className={r.status === "skipped" ? "bg-amber-50" : ""}>
                    <td className="px-3 py-1.5 text-slate-400 font-mono">{r.rowNum}</td>
                    <td className="px-3 py-1.5">
                      {r.status === "ok" ? <span className="text-green-600 font-bold">✓ OK</span> : <span className="text-amber-600 font-bold">⚠ Skipped</span>}
                    </td>
                    <td className="px-3 py-1.5 text-slate-600 truncate max-w-[200px]">
                      {r.status === "skipped" ? <span className="text-amber-700">{r.reason}</span> : r.preview}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-slate-100">
          <button onClick={reset} className="text-xs text-slate-500 hover:text-slate-700 underline flex items-center gap-1">
            <RefreshCw className="h-3 w-3" /> Import another file
          </button>
        </div>
      </div>
    );
  }

  return null;
}