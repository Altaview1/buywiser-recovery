import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function BulkLeadImportModal({ partner, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const fileRef = useRef();

  const parseCSV = (text) => {
    const lines = text.split("\n").filter(l => l.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, ""));
    return lines.slice(1).map(line => {
      const cols = line.split(",").map(c => c.trim().replace(/"/g, ""));
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = cols[i] || "";
      });
      return obj;
    }).filter(r => r.address || r.email);
  };

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResults(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      setPreview(rows.slice(0, 3));
    };
    reader.readAsText(f);
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setProgress(0);

    const text = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });

    const rows = parseCSV(text);
    const successCount = await Promise.all(
      rows.map(async (row, i) => {
        try {
          await base44.entities.Lead.create({
            name: row.name || row.first_name || "",
            email: row.email || "",
            phone: row.phone || "",
            address_or_link: row.address || row.property_address || "",
            assigned_agent: partner.name,
            status: "New",
            internal_notes: row.notes || "",
          });
          setProgress(Math.round(((i + 1) / rows.length) * 100));
          return true;
        } catch (err) {
          console.error("Import error:", err);
          return false;
        }
      })
    ).then(results => results.filter(Boolean).length);

    setResults({ total: rows.length, success: successCount, failed: rows.length - successCount });
    setImporting(false);
    if (successCount > 0) onSuccess();
  };

  if (results) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-sm w-full shadow-xl">
          <div className="p-6 text-center space-y-4">
            {results.failed === 0 ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <h2 className="text-lg font-bold text-slate-900">Import Complete</h2>
                <p className="text-sm text-slate-600">{results.success} leads imported successfully</p>
              </>
            ) : (
              <>
                <AlertCircle className="h-12 w-12 text-amber-600 mx-auto" />
                <h2 className="text-lg font-bold text-slate-900">Import Partial</h2>
                <p className="text-sm text-slate-600">{results.success} of {results.total} leads imported</p>
                {results.failed > 0 && <p className="text-xs text-red-600">{results.failed} failed</p>}
              </>
            )}
            <button onClick={onClose} className="w-full py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition">
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Import Leads from CSV</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* File upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">CSV or Excel File</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">
                {file ? file.name : "Click to select file or drag & drop"}
              </p>
              <p className="text-xs text-slate-500 mt-1">CSV or Excel format • Required columns: address, email</p>
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileSelect} />
            </div>
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase mb-2">Preview ({preview.length} rows shown)</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      {Object.keys(preview[0]).map(k => (
                        <th key={k} className="border border-slate-200 px-2 py-1 text-left font-semibold text-slate-600">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        {Object.values(row).map((v, j) => (
                          <td key={j} className="border border-slate-200 px-2 py-1 text-slate-700 truncate">{v || "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Required columns info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-900 mb-1">📋 Required Columns</p>
            <p className="text-xs text-blue-800">Your CSV must have at least: <strong>address</strong> and <strong>email</strong></p>
            <p className="text-xs text-blue-700 mt-1">Optional: name, phone, notes</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
            >
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {importing ? `Importing... ${progress}%` : "Import Leads"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}