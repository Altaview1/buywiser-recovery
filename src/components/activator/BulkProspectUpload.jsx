import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, X, CheckCircle, AlertCircle, FileSpreadsheet, Download } from "lucide-react";

const NAVY = "#0B1F3B";

// Parse CSV text into array of objects
function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""));
  return lines.slice(1).map(line => {
    // Handle quoted fields
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
  }).filter(row => row.first_name || row.email); // skip empty rows
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

export default function BulkProspectUpload({ activators, onImported, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState([]);
  const [selectedActivator, setSelectedActivator] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      const errs = [];
      rows.forEach((r, i) => {
        if (!r.first_name && !r.email) errs.push(`Row ${i + 2}: missing first_name and email`);
      });
      setPreview(rows.slice(0, 5));
      setErrors(errs);
    };
    reader.readAsText(f);
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);

    const activator = activators.find(a => a.id === selectedActivator);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const rows = parseCSV(ev.target.result);
      const records = rows.map(r => mapRow(r, activator?.rep_code, activator?.id));

      let success = 0;
      let failed = 0;
      // Batch create in chunks of 20
      const chunkSize = 20;
      for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);
        const results = await Promise.allSettled(
          chunk.map(r => base44.entities.ActivatorLead.create(r))
        );
        results.forEach(r => r.status === "fulfilled" ? success++ : failed++);
      }

      setResult({ success, failed, total: records.length });
      setImporting(false);
      if (success > 0) onImported(success);
    };
    reader.readAsText(file);
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
            <p className="text-sm font-bold text-white">Bulk Upload Prospects</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">

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
              <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-1">
              <p className="text-xs font-bold text-red-700 flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" /> Warnings</p>
              {errors.slice(0, 5).map((e, i) => (
                <p key={i} className="text-xs text-red-600">{e}</p>
              ))}
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && !result && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Preview (first 5 rows)</p>
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
                    {preview.map((row, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-slate-700">{row.first_name || row.firstname || "—"}</td>
                        <td className="px-3 py-2 text-slate-700">{row.last_name || row.lastname || "—"}</td>
                        <td className="px-3 py-2 text-slate-500">{row.email || "—"}</td>
                        <td className="px-3 py-2 text-slate-500">{row.phone || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`rounded-xl p-4 flex items-start gap-3 ${result.failed === 0 ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
              <CheckCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${result.failed === 0 ? "text-green-600" : "text-amber-600"}`} />
              <div>
                <p className={`text-sm font-bold ${result.failed === 0 ? "text-green-800" : "text-amber-800"}`}>
                  Import Complete
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {result.success} of {result.total} prospects imported successfully.
                  {result.failed > 0 && ` ${result.failed} failed.`}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {!result ? (
              <button
                onClick={handleImport}
                disabled={!file || importing || errors.length > preview.length}
                className="flex items-center gap-1.5 px-5 py-2.5 font-bold text-sm rounded-lg text-white transition disabled:opacity-40"
                style={{ background: NAVY }}
              >
                <Upload className="h-4 w-4" />
                {importing ? "Importing…" : `Import ${preview.length > 0 ? "Prospects" : ""}`}
              </button>
            ) : (
              <button onClick={onClose}
                className="flex items-center gap-1.5 px-5 py-2.5 font-bold text-sm rounded-lg text-white transition"
                style={{ background: NAVY }}>
                Done
              </button>
            )}
            {!result && (
              <button onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}