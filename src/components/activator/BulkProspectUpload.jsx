import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, X, CheckCircle, AlertCircle, FileSpreadsheet, Download, XCircle, Loader2 } from "lucide-react";

const NAVY = "#0B1F3B";

// Parse CSV text into array of objects
function parseCSV(text) {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.trim().split("\n").filter(l => l.trim() !== "");
  if (lines.length < 2) return [];
  const firstLine = lines[0].replace(/^\uFEFF/, "").replace(/"/g, "");
  const headers = firstLine.split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""));
  console.log("[BulkUpload] Detected CSV headers:", headers);
  return lines.slice(1).map(line => {
    const cols = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQuotes = !inQuotes; continue; }
      if (line[i] === "," && !inQuotes) { cols.push(current.trim()); current = ""; continue; }
      current += line[i];
    }
    cols.push(current.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = cols[i] || ""; });
    return obj;
  }).filter(row => Object.values(row).some(v => v.trim() !== ""));
}

// Detect PropertyRadar format
function isPropertyRadarFormat(headers) {
  return headers.includes("address") && headers.includes("owner");
}

// Parse owner name "LASTNAME,FIRSTNAME" format
function parseOwnerName(owner) {
  if (!owner) return { first_name: "", last_name: "" };
  const firstOwner = owner.split("&")[0].trim();
  const commaIdx = firstOwner.indexOf(",");
  if (commaIdx === -1) {
    return { first_name: firstOwner, last_name: "" };
  }
  const last = firstOwner.slice(0, commaIdx).trim();
  const firstPart = firstOwner.slice(commaIdx + 1).trim().split(" ")[0];
  const tc = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
  return { first_name: tc(firstPart), last_name: tc(last) };
}

// Map PropertyRadar row → VTONOpportunity
function mapPropertyRadarRow(row, partnerEmail) {
  const { first_name, last_name } = parseOwnerName(row.owner);
  const address = (row.address || "").trim();
  const city = (row.city || "").trim();
  const estValue = parseFloat((row.est_value || "0").replace(/[^0-9.-]/g, "")) || null;
  const estEquity = parseFloat((row.est_equity_$ || "0").replace(/[^0-9.-]/g, "")) || null;
  const distressScore = parseFloat(row.distress_score || "0") || null;
  const listingDom = parseFloat(row.listing_dom || "0") || null;
  const propType = (row.type || "").trim() || "SFR";
  const phone = (row.phone || row.phone_number || "").trim();
  const email = (row.email || row.email_address || "").trim();

  return {
    homeowner_name: `${first_name} ${last_name}`.trim(),
    homeowner_phone: phone,
    homeowner_email: email,
    property_address: address,
    city: city,
    state: "CA",
    property_type: propType,
    estimated_price: estValue,
    estimated_equity: estEquity,
    distress_score: distressScore,
    listing_dom: listingDom,
    va_loan_confirmed: true,
    listing_status: "active",
    opportunity_status: "assigned",
    partner_email: partnerEmail || "",
    priority: "medium",
  };
}

// Map standard CSV row → ActivatorLead
function mapActivatorRow(row, repCode, activatorId, csvHeaders) {
  const get = (...keys) => {
    for (const k of keys) {
      const norm = k.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      const val = row[norm] || row[k] || "";
      if (val) return val;
    }
    return "";
  };
  
  const fullName = get("name", "full_name", "fullname");
  const firstName = get("first_name", "firstname", "fname") || (fullName ? fullName.split(" ")[0] : "");
  const lastName = get("last_name", "lastname", "lname") || (fullName ? fullName.split(" ").slice(1).join(" ") : "");
  
  const lead = {
    first_name: firstName,
    last_name: lastName,
    email: get("email", "email_address"),
    phone: get("phone", "phone_number", "mobile", "cell"),
    property_address: get("property_address", "address", "street_address"),
    rep_code: get("rep_code", "repcode") || repCode || "",
    activator_id: activatorId || "",
    status: "SCANNED",
    scan_timestamp: new Date().toISOString(),
  };
  
  // Try to extract qualification fields if present
  const planning = get("planning_to_buy", "planning", "interested");
  if (planning && ["yes", "no", "not_sure"].includes(planning.toLowerCase())) {
    lead.planning_to_buy = planning.toLowerCase();
  }
  
  const timeline = get("timeline", "purchase_timeline", "timeframe");
  if (timeline && ["0-3months", "3-6months", "6plus"].includes(timeline.toLowerCase())) {
    lead.timeline = timeline.toLowerCase();
  }
  
  const homeType = get("next_home_type", "home_type", "property_type");
  if (homeType && ["primary", "investment", "not_sure"].includes(homeType.toLowerCase())) {
    lead.next_home_type = homeType.toLowerCase();
  }
  
  return lead;
}

const SAMPLE_CSV = `first_name,last_name,email,phone,property_address
Jane,Smith,jane@email.com,(818) 555-1001,123 Oak St Glendale CA
John,Doe,john@email.com,(818) 555-1002,456 Elm Ave Burbank CA`;

function ImportStatusReport({ rowResults, onClose }) {
  const succeeded = rowResults.filter(r => r.status === "success");
  const failed = rowResults.filter(r => r.status === "error");
  const [filter, setFilter] = useState("all");

  const displayed = filter === "errors" ? failed : filter === "success" ? succeeded : rowResults;

  const downloadErrorCSV = () => {
    const headers = "row,first_name,last_name,email,phone,error";
    const rows = failed.map(r =>
      `${r.rowNum},"${r.data.first_name}","${r.data.last_name}","${r.data.email}","${r.data.phone}","${r.error}"`
    ).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import_errors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
          <p className="text-xl font-black text-slate-800">{rowResults.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total Rows</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-xl font-black text-green-700">{succeeded.length}</p>
          <p className="text-xs text-green-600 mt-0.5">Succeeded</p>
        </div>
        <div className={`rounded-xl p-3 text-center border ${failed.length > 0 ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
          <p className={`text-xl font-black ${failed.length > 0 ? "text-red-700" : "text-slate-400"}`}>{failed.length}</p>
          <p className={`text-xs mt-0.5 ${failed.length > 0 ? "text-red-600" : "text-slate-400"}`}>Failed</p>
        </div>
      </div>

      <div className="flex gap-2">
        {["all", "success", "errors"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition border ${
              filter === f ? "bg-slate-800 text-white border-slate-800" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}>
            {f === "all" ? `All (${rowResults.length})` : f === "success" ? `✓ Succeeded (${succeeded.length})` : `✗ Errors (${failed.length})`}
          </button>
        ))}
        {failed.length > 0 && (
          <button onClick={downloadErrorCSV}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 text-red-600 hover:bg-red-50 transition">
            <Download className="h-3 w-3" /> Error CSV
          </button>
        )}
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left font-bold text-slate-500 w-12">Row</th>
              <th className="px-3 py-2 text-left font-bold text-slate-500">Name</th>
              <th className="px-3 py-2 text-left font-bold text-slate-500">Email</th>
              <th className="px-3 py-2 text-left font-bold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayed.map((r, i) => (
              <tr key={i} className={r.status === "error" ? "bg-red-50" : ""}>
                <td className="px-3 py-2 text-slate-400 font-mono">{r.rowNum}</td>
                <td className="px-3 py-2 text-slate-700">{r.data.homeowner_name || `${r.data.first_name || ""} ${r.data.last_name || ""}`.trim() || "—"}</td>
                <td className="px-3 py-2 text-slate-500">{r.data.property_address || r.data.email || "—"}</td>
                <td className="px-3 py-2">
                  {r.status === "success" ? (
                    <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                      <CheckCircle className="h-3 w-3" /> Imported
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 font-semibold" title={r.error}>
                      <XCircle className="h-3 w-3" /> {r.error?.slice(0, 40) || "Failed"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={onClose}
        className="w-full py-2.5 font-bold text-sm rounded-lg text-white transition"
        style={{ background: NAVY }}>
        Done
      </button>
    </div>
  );
}

export default function BulkProspectUpload({ activators, onImported, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [previewTotal, setPreviewTotal] = useState(0);
  const [errors, setErrors] = useState([]);
  const [selectedActivatorForPropertyRadar, setSelectedActivatorForPropertyRadar] = useState("");
  const [selectedActivator, setSelectedActivator] = useState("");
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [rowResults, setRowResults] = useState(null);
  const [detectedFormat, setDetectedFormat] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setRowResults(null);
    setErrors([]);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      if (rows.length === 0) {
        setErrors([{ rowNum: null, missing: [], row: {}, parseError: true }]);
        setPreview([]);
        setPreviewTotal(0);
        setDetectedFormat(null);
        return;
      }

      const headers = Object.keys(rows[0]);
      const fmt = isPropertyRadarFormat(headers) ? "propertyradar" : "activator";
      setDetectedFormat(fmt);

      const validRows = rows.filter(r => r.address && r.address.trim() !== "");
      setPreview(validRows.slice(0, 5));
      setPreviewTotal(validRows.length);
    };
    reader.readAsText(f);
  };

  const handleImport = async () => {
    if (!file) return;

    // No validation needed for partner selection anymore

    setImporting(true);
    setImportProgress(0);

    const text = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });

    const rows = parseCSV(text);
    if (rows.length === 0) {
      setRowResults([]);
      setImporting(false);
      return;
    }

    let records, entityName;
    if (detectedFormat === "propertyradar") {
      const validRows = rows.filter(r => r.address && r.address.trim() !== "");
      // For PropertyRadar, use the selected field activator's rep_code as the partner identifier
      const selectedActivatorObj = activators.find(a => a.id === selectedActivatorForPropertyRadar);
      const partnerIdentifier = selectedActivatorObj ? selectedActivatorObj.rep_code : "";
      records = validRows.map(r => mapPropertyRadarRow(r, partnerIdentifier));
      entityName = "VTONOpportunity";
    } else {
      const activator = activators.find(a => a.id === selectedActivator);
      const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
      records = rows.map(r => mapActivatorRow(r, activator?.rep_code, activator?.id, headers));
      entityName = "ActivatorLead";
    }

    const results = [];
    const chunkSize = 50;

    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const res = await base44.functions.invoke("bulkCreateOpportunities", {
        records: chunk,
        entityName,
      });
      const chunkResults = res.data?.results || [];
      chunkResults.forEach((r, j) => {
        const rowIndex = i + j;
        results.push({
          rowNum: rowIndex + 2,
          data: records[rowIndex],
          status: r.status,
          error: r.error || null,
        });
      });
      setImportProgress(Math.round(((i + chunk.length) / records.length) * 100));
    }

    const succeeded = results.filter(r => r.status === "success").length;
    setRowResults(results);
    setImporting(false);
    if (succeeded > 0) onImported(succeeded);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vton_prospects_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-auto" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: NAVY }}>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-white/60" />
            <p className="text-sm font-bold text-white">
              {rowResults ? "Import Status Report" : "Bulk Upload Prospects"}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Import progress overlay */}
        {importing && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 rounded-2xl gap-5 px-8">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: NAVY }} />
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm font-semibold text-slate-700">
                <span>Importing prospects…</span>
                <span>{importProgress}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%`, background: NAVY }}
                />
              </div>
              <p className="text-xs text-slate-400 text-center">Please wait, do not close this window</p>
            </div>
          </div>
        )}

        <div className="p-6 space-y-5 relative">

          {/* Show import status report after import */}
          {rowResults ? (
            <ImportStatusReport rowResults={rowResults} onClose={onClose} />
          ) : (
            <>
              {/* File upload */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Upload CSV File</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
                >
                  <Upload className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  {file ? (
                    <p className="text-sm font-semibold text-slate-700">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-500">Click to upload CSV</p>
                      <p className="text-xs text-slate-400 mt-1">PropertyRadar export or standard prospect CSV</p>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept=".csv,.txt,text/csv,text/plain,application/vnd.ms-excel" className="hidden" onChange={handleFile} />
                </div>
              </div>

              {/* Format detected badge */}
              {detectedFormat && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold ${
                  detectedFormat === "propertyradar"
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-green-50 border-green-200 text-green-700"
                }`}>
                  <CheckCircle className="h-3.5 w-3.5" />
                  {detectedFormat === "propertyradar"
                    ? "PropertyRadar format detected → will import as VTON Opportunities"
                    : "Standard prospect format detected → will import as Activator Leads"}
                </div>
              )}

              {/* Field Activator assignment for PropertyRadar */}
              {detectedFormat === "propertyradar" && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Assign to Field Activator <span className="text-slate-400 font-normal normal-case">(optional)</span>
                  </label>
                  <select
                    value={selectedActivatorForPropertyRadar}
                    onChange={e => setSelectedActivatorForPropertyRadar(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">No assignment</option>
                    {activators.map(a => (
                      <option key={a.id} value={a.id}>{a.name} — {a.rep_code}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Activator assignment */}
              {detectedFormat === "activator" && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Assign to Field Activator <span className="text-slate-400 font-normal normal-case">(optional)</span>
                  </label>
                  <select
                    value={selectedActivator}
                    onChange={e => setSelectedActivator(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">No assignment (use rep_code from CSV)</option>
                    {activators.map(a => (
                      <option key={a.id} value={a.id}>{a.name} — {a.rep_code}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Validation errors */}
              {errors.length > 0 && errors[0]?.parseError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> Could not read any rows from this file
                  </p>
                  <p className="text-xs text-red-600 mt-1">Supported: PropertyRadar exports (Address, Owner columns) or standard CSVs (first_name, email, phone).</p>
                </div>
              )}

              {/* Preview */}
              {preview.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Preview — {previewTotal} row{previewTotal !== 1 ? "s" : ""} detected
                  </p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50">
                        <tr>
                          {detectedFormat === "propertyradar"
                            ? ["Type", "Address", "Owner", "Phone", "Email"].map(h => (
                                <th key={h} className="px-3 py-2 text-left font-bold text-slate-500 text-xs">{h}</th>
                              ))
                            : ["First Name", "Last Name", "Email"].map(h => (
                                <th key={h} className="px-3 py-2 text-left font-bold text-slate-500">{h}</th>
                              ))
                          }
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {preview.map((row, i) => (
                          <tr key={i}>
                            {detectedFormat === "propertyradar" ? (
                              <>
                                <td className="px-3 py-2 text-slate-700 font-medium text-xs">{row.type || "—"}</td>
                                <td className="px-3 py-2 text-slate-600 text-xs truncate">{row.address || "—"}</td>
                                <td className="px-3 py-2 text-slate-500 text-xs">{row.owner?.split(',')[0] || "—"}</td>
                                <td className="px-3 py-2 text-slate-500 text-xs">{row.phone || row.phone_number || "—"}</td>
                                <td className="px-3 py-2 text-slate-500 text-xs truncate">{row.email || row.email_address || "—"}</td>
                              </>
                            ) : (
                              <>
                                <td className="px-3 py-2 text-slate-700">{row.first_name || row.firstname || "—"}</td>
                                <td className="px-3 py-2 text-slate-700">{row.last_name || row.lastname || "—"}</td>
                                <td className="px-3 py-2 text-slate-500">{row.email || "—"}</td>
                              </>
                            )}
                          </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  {previewTotal > 5 && (
                    <p className="text-xs text-slate-400 mt-1.5">…and {previewTotal - 5} more rows</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                   onClick={handleImport}
                   disabled={!file || importing}
                   className="flex items-center gap-1.5 px-5 py-2.5 font-bold text-sm rounded-lg text-white transition disabled:opacity-40"
                   style={{ background: NAVY }}
                 >
                   <Upload className="h-4 w-4" />
                   {importing ? `Importing… ${importProgress}%` : `Import ${previewTotal > 0 ? `${previewTotal} Prospects` : ""}`}
                 </button>
                <button onClick={onClose}
                  className="px-5 py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}