import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, X, CheckCircle, AlertCircle, FileSpreadsheet, Download, XCircle } from "lucide-react";

const NAVY = "#0B1F3B";

// Parse CSV text into array of objects
function parseCSV(text) {
  // Normalize line endings (Windows \r\n, old Mac \r, Unix \n)
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.trim().split("\n").filter(l => l.trim() !== "");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""));
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
  }).filter(row => row.first_name || row.email);
}

// Map CSV row to ActivatorLead fields
function mapRow(row, repCode, activatorId) {
  return {
    first_name: row.first_name || row.firstname || row.name?.split(" ")[0] || "",
    last_name: row.last_name || row.lastname || row.name?.split(" ").slice(1).join(" ") || "",
    email: row.email || "",
    phone: row.phone || row.phone_number || "",
    property_address: row.property_address || row.address || row.street_address || "",
    rep_code: row.rep_code || repCode || "",
    activator_id: activatorId || "",
    status: "SCANNED",
    scan_timestamp: new Date().toISOString(),
  };
}

const SAMPLE_CSV = `first_name,last_name,email,phone,property_address
Jane,Smith,jane@email.com,(818) 555-1001,123 Oak St Glendale CA
John,Doe,john@email.com,(818) 555-1002,456 Elm Ave Burbank CA
Maria,Garcia,maria@email.com,(818) 555-1003,789 Pine Rd Pasadena CA`;

function ImportStatusReport({ rowResults, onClose }) {
  const [filter, setFilter] = useState("all");
  const succeeded = rowResults.filter(r => r.status === "success");
  const failed = rowResults.filter(r => r.status === "error");

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
      {/* Summary */}
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

      {/* Filter tabs */}
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

      {/* Row-by-row results */}
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
                <td className="px-3 py-2 text-slate-700">{r.data.first_name} {r.data.last_name}</td>
                <td className="px-3 py-2 text-slate-500">{r.data.email || "—"}</td>
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
  const [selectedActivator, setSelectedActivator] = useState("");
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [rowResults, setRowResults] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setRowResults(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      if (rows.length === 0) {
        setErrors([{ rowNum: null, missing: [], row: {}, parseError: true }]);
        setPreview([]);
        setPreviewTotal(0);
        return;
      }
      const errs = [];
      rows.forEach((r, i) => {
        const missing = [];
        if (!r.first_name && !r.firstname && !r.name) missing.push("first_name");
        if (!r.email) missing.push("email");
        if (!r.phone && !r.phone_number) missing.push("phone");
        if (missing.length > 0) errs.push({ rowNum: i + 2, missing, row: r });
      });
      setPreview(rows.slice(0, 5));
      setPreviewTotal(rows.length);
      setErrors(errs);
    };
    reader.readAsText(f);
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setImportProgress(0);

    const activator = activators.find(a => a.id === selectedActivator);

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
    const records = rows.map(r => mapRow(r, activator?.rep_code, activator?.id));

    const results = [];
    const chunkSize = 20;

    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const chunkResults = await Promise.allSettled(
        chunk.map(r => base44.entities.ActivatorLead.create(r))
      );
      chunkResults.forEach((r, j) => {
        const rowIndex = i + j;
        results.push({
          rowNum: rowIndex + 2, // +2 for header row + 1-based
          data: records[rowIndex],
          status: r.status === "fulfilled" ? "success" : "error",
          error: r.status === "rejected" ? (r.reason?.message || "Unknown error") : null,
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

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

        <div className="p-6 space-y-5">

          {/* Show import status report after import */}
          {rowResults ? (
            <ImportStatusReport rowResults={rowResults} onClose={onClose} />
          ) : (
            <>
              {/* Sample download */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <div>
                  <p className="text-xs font-bold text-slate-700">CSV Template</p>
                  <p className="text-xs text-slate-400">Columns: first_name, last_name, email, phone, property_address</p>
                </div>
                <button onClick={downloadSample}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 transition">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>

              {/* Assign to activator */}
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
                      <p className="text-xs text-slate-400 mt-1">or drag and drop</p>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept=".csv,.txt,text/csv,text/plain,application/vnd.ms-excel" className="hidden" onChange={handleFile} />
                </div>
              </div>

              {/* Validation errors */}
              {errors.length > 0 && errors[0]?.parseError ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> Could not read any rows from this file
                  </p>
                  <p className="text-xs text-red-600 mt-1">Make sure the file is a valid CSV with headers: <strong>first_name, last_name, email, phone, property_address</strong>. Try opening in Excel and re-saving as CSV (UTF-8).</p>
                </div>
              ) : errors.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> {errors.length} row{errors.length !== 1 ? "s" : ""} with missing fields — will still be imported
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {errors.map((e, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-amber-700 font-bold w-12 flex-shrink-0">Row {e.rowNum}</span>
                        <span className="text-amber-600">
                          Missing: {e.missing.map(f => (
                            <span key={f} className="inline-block bg-amber-200 text-amber-800 font-bold px-1.5 py-0.5 rounded mr-1">{f}</span>
                          ))}
                        </span>
                        <span className="text-amber-500 truncate">{e.row.first_name || e.row.firstname || e.row.email || "unknown"}</span>
                      </div>
                    ))}
                  </div>
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
                          {["First Name", "Last Name", "Email", "Phone"].map(h => (
                            <th key={h} className="px-3 py-2 text-left font-bold text-slate-500">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {preview.map((row, i) => {
                          const rowErr = errors.find(e => e.rowNum === i + 2);
                          return (
                            <tr key={i} className={rowErr ? "bg-amber-50" : ""}>
                              <td className={`px-3 py-2 ${rowErr?.missing.includes("first_name") ? "text-amber-600 font-bold" : "text-slate-700"}`}>
                                {row.first_name || row.firstname || <span className="italic text-amber-500">missing</span>}
                              </td>
                              <td className="px-3 py-2 text-slate-700">{row.last_name || row.lastname || "—"}</td>
                              <td className={`px-3 py-2 ${rowErr?.missing.includes("email") ? "text-amber-600 font-bold" : "text-slate-500"}`}>
                                {row.email || <span className="italic text-amber-500">missing</span>}
                              </td>
                              <td className={`px-3 py-2 ${rowErr?.missing.includes("phone") ? "text-amber-600 font-bold" : "text-slate-500"}`}>
                                {row.phone || <span className="italic text-amber-500">missing</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {previewTotal > 5 && (
                    <p className="text-xs text-slate-400 mt-1.5">…and {previewTotal - 5} more rows</p>
                  )}
                </div>
              )}

              {/* Progress bar while importing */}
              {importing && (
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Importing…</span>
                    <span>{importProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300 bg-blue-600" style={{ width: `${importProgress}%` }} />
                  </div>
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