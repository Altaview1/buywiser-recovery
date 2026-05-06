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

// Parse a single CSV line respecting quoted fields
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

// Normalize a header string to a safe key
function normalizeHeader(h) {
  return h.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

// Auto-guess a system field for a given CSV column
function guessMapping(colKey) {
  const guesses = {
    first_name: ["first_name", "firstname", "fname", "first"],
    last_name: ["last_name", "lastname", "lname", "last"],
    email: ["email", "email_address", "e_mail"],
    phone: ["phone", "phone_number", "mobile", "cell", "telephone"],
    property_address: ["property_address", "address", "street_address", "situs_address", "prop_address", "street"],
    property_type: ["property_type", "type", "prop_type", "land_use"],
    estimated_price: ["estimated_price", "est_value", "estimated_value", "value", "price", "avm", "estimated_avm"],
    estimated_equity: ["estimated_equity", "est_equity", "est_equity_$", "equity"],
    distress_score: ["distress_score", "distress", "score"],
    listing_dom: ["listing_dom", "dom", "days_on_market", "days_listed"],
  };
  for (const [sysField, aliases] of Object.entries(guesses)) {
    if (aliases.includes(colKey)) return sysField;
  }
  return "__skip__";
}

// Parse "LASTNAME, FIRSTNAME MIDDLE" format
function parseOwnerName(owner) {
  if (!owner) return { first_name: "", last_name: "" };
  const primary = owner.split("&")[0].trim();
  const commaIdx = primary.indexOf(",");
  const tc = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
  if (commaIdx === -1) return { first_name: tc(primary), last_name: "" };
  const last = primary.slice(0, commaIdx).trim();
  const first = primary.slice(commaIdx + 1).trim().split(" ")[0];
  return { first_name: tc(first), last_name: tc(last) };
}

export default function BulkLeadImport({ repCode, onSuccess }) {
  const [step, setStep] = useState("upload"); // upload | map | preview | done
  const [file, setFile] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvRows, setCsvRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [hasOwnerCol, setHasOwnerCol] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setStep("upload");
    setResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.trim());
      const headerLine = lines[0].replace(/^\uFEFF/, "");
      const rawHeaders = parseCSVLine(headerLine);
      const normalizedHeaders = rawHeaders.map(normalizeHeader);

      // Parse up to 5 preview rows
      const rows = lines.slice(1, 6).map(line => {
        const vals = parseCSVLine(line);
        const row = {};
        normalizedHeaders.forEach((h, i) => { row[h] = vals[i] || ""; });
        return row;
      });

      // Auto-build initial mapping
      const autoMapping = {};
      const ownerExists = normalizedHeaders.includes("owner");
      setHasOwnerCol(ownerExists);

      normalizedHeaders.forEach(h => {
        if (ownerExists && h === "owner") {
          // Will be split into first/last during import
          autoMapping[h] = "__owner__";
        } else {
          autoMapping[h] = guessMapping(h);
        }
      });

      setCsvHeaders(normalizedHeaders);
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
      const headerLine = lines[0].replace(/^\uFEFF/, "");
      const normalizedHeaders = parseCSVLine(headerLine).map(normalizeHeader);

      const leads = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = parseCSVLine(lines[i]);
        const row = {};
        normalizedHeaders.forEach((h, idx) => { row[h] = vals[idx] || ""; });

        const lead = { rep_code: repCode, status: "SCANNED" };

        // Apply user mapping
        for (const [csvCol, sysField] of Object.entries(mapping)) {
          if (sysField === "__skip__" || !sysField) continue;
          const val = row[csvCol] || "";
          if (sysField === "__owner__") {
            const { first_name, last_name } = parseOwnerName(val);
            if (!lead.first_name) lead.first_name = first_name || "Owner";
            if (!lead.last_name) lead.last_name = last_name;
          } else if (["estimated_price", "estimated_equity", "distress_score"].includes(sysField)) {
            lead[sysField] = parseFloat(val.replace(/[^0-9.-]/g, "")) || null;
          } else if (sysField === "listing_dom") {
            lead[sysField] = parseInt(val) || null;
          } else {
            lead[sysField] = val;
          }
        }

        // Skip footer/empty rows
        if (!lead.property_address && !lead.first_name) continue;
        if ((lead.property_address || "").toLowerCase().includes("propertyradar")) continue;
        if ((lead.property_address || "").toLowerCase().includes("information contained")) continue;

        // Ensure required fields
        if (!lead.first_name) lead.first_name = "Owner";
        if (!lead.email) {
          const slug = (lead.property_address || "lead").toLowerCase().replace(/\s+/g, "").slice(0, 12);
          lead.email = `lead+${slug}@placeholder.local`;
        }

        // Append city/state if property_address looks short
        if (lead.property_address && !lead.property_address.includes(",")) {
          const cityCol = csvHeaders.find(h => mapping[h] === "__city__");
          if (cityCol && row[cityCol]) lead.property_address += `, ${row[cityCol]}, CA`;
          else lead.property_address += ", CA";
        }

        if (lead.property_address || lead.first_name) leads.push(lead);
      }

      if (leads.length === 0) {
        setResult({ success: false, error: "No valid rows found after applying your mapping. Make sure Property Address or First Name columns are mapped." });
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

  // ── STEP: Upload ──────────────────────────────────────────────
  if (step === "upload" || !file) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Bulk Import Leads</p>
          <p className="text-xs text-slate-500">Upload any CSV — you'll map your columns to our fields on the next screen.</p>
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

  // ── STEP: Map columns ─────────────────────────────────────────
  if (step === "map") {
    const mappedSystemFields = Object.values(mapping).filter(v => v && v !== "__skip__");
    const hasAddress = mappedSystemFields.includes("property_address") || mappedSystemFields.includes("__owner__");
    const missingRequired = SYSTEM_FIELDS.filter(f => f.required && !mappedSystemFields.includes(f.key));

    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between" style={{ background: NAVY }}>
          <div>
            <p className="text-xs font-black text-white uppercase tracking-wider">Map Your Columns</p>
            <p className="text-xs text-blue-300 mt-0.5">{file.name} — {csvHeaders.length} columns found</p>
          </div>
          <button onClick={() => { setFile(null); setStep("upload"); }}
            className="text-xs text-blue-300 hover:text-white underline">Change file</button>
        </div>

        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {/* Validation banner */}
          {missingRequired.length > 0 ? (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span className="text-amber-700">
                Still need: <strong>{missingRequired.map(f => f.label).join(", ")}</strong>. Map these columns or import will fail.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs">
              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
              <span className="text-green-700 font-semibold">Required fields mapped — ready to import!</span>
            </div>
          )}

          {/* Column mapping rows */}
          <div className="space-y-2">
            {csvHeaders.map(col => {
              const sampleVals = csvRows.map(r => r[col]).filter(Boolean).slice(0, 2);
              return (
                <div key={col} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                  {/* CSV column */}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 font-mono truncate">{col}</p>
                    <p className="text-xs text-slate-400 truncate">{sampleVals.join(" · ") || "—"}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
                  {/* System field select */}
                  <select
                    value={mapping[col] || "__skip__"}
                    onChange={e => setMapping(m => ({ ...m, [col]: e.target.value }))}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="__skip__">— Skip —</option>
                    {hasOwnerCol && <option value="__owner__">Owner Name (split first/last)</option>}
                    <option value="__city__">City (append to address)</option>
                    {SYSTEM_FIELDS.map(f => (
                      <option key={f.key} value={f.key}>{f.label}{f.required ? " *" : ""}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          {/* Preview of first row after mapping */}
          {csvRows.length > 0 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-600">Preview — First Row Result</p>
              </div>
              <div className="p-3 grid grid-cols-2 gap-x-4 gap-y-1">
                {SYSTEM_FIELDS.filter(f => {
                  const mappedCol = Object.keys(mapping).find(c => mapping[c] === f.key);
                  return mappedCol && csvRows[0]?.[mappedCol];
                }).map(f => {
                  const mappedCol = Object.keys(mapping).find(c => mapping[c] === f.key);
                  return (
                    <div key={f.key} className="text-xs">
                      <span className="text-slate-400">{f.label}: </span>
                      <span className="font-semibold text-slate-700 truncate">{csvRows[0]?.[mappedCol]}</span>
                    </div>
                  );
                })}
                {/* Owner field preview */}
                {Object.keys(mapping).find(c => mapping[c] === "__owner__") && (() => {
                  const ownerCol = Object.keys(mapping).find(c => mapping[c] === "__owner__");
                  const { first_name, last_name } = parseOwnerName(csvRows[0]?.[ownerCol] || "");
                  return (
                    <>
                      <div className="text-xs"><span className="text-slate-400">First Name: </span><span className="font-semibold text-slate-700">{first_name}</span></div>
                      <div className="text-xs"><span className="text-slate-400">Last Name: </span><span className="font-semibold text-slate-700">{last_name}</span></div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
          <button
            onClick={handleImport}
            disabled={uploading || missingRequired.length > 0}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm text-white transition disabled:opacity-40"
            style={{ background: NAVY }}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {uploading ? "Importing…" : `Import ${csvRows.length > 0 ? "Leads" : ""}`}
          </button>
          <button onClick={() => { setFile(null); setStep("upload"); }}
            className="px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
        </div>

        {result?.success === false && (
          <div className="mx-4 mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            {result.error}
          </div>
        )}
      </div>
    );
  }

  // ── STEP: Done ────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-2" />
        <p className="text-sm font-bold text-green-800 mb-1">✓ Imported {result?.count} leads successfully</p>
        <button onClick={() => { setFile(null); setStep("upload"); setResult(null); }}
          className="text-xs text-green-600 hover:text-green-800 underline flex items-center gap-1 mx-auto mt-2">
          <RefreshCw className="h-3 w-3" /> Import another file
        </button>
      </div>
    );
  }

  return null;
}