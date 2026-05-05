import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const NAVY = "#0B1F3B";

export default function BulkLeadImport({ repCode, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview([]);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const csv = evt.target.result;
      const lines = csv.split("\n").slice(0, 6); // Preview first 5 rows
      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1).map((line) =>
        line.split(",").reduce((acc, val, i) => {
          acc[headers[i] || `col${i}`] = val.trim();
          return acc;
        }, {})
      );
      setPreview(rows.filter((r) => Object.values(r).some((v) => v)));
    };
    reader.readAsText(f);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const csv = evt.target.result;
        const lines = csv.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

        const leads = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(",").map((v) => v.trim());
          const row = {};
          headers.forEach((h, idx) => {
            row[h] = values[idx] || "";
          });

          if (!row.first_name || !row.email || !row.property_address) {
            console.warn(`Row ${i} missing required fields, skipping`);
            continue;
          }

          leads.push({
            first_name: row.first_name,
            last_name: row.last_name || "",
            email: row.email,
            phone: row.phone || "",
            property_address: row.property_address,
            property_type: row.property_type || "SFR",
            estimated_price: parseFloat(row.estimated_price) || 0,
            estimated_equity: parseFloat(row.estimated_equity) || 0,
            distress_score: parseFloat(row.distress_score) || 50,
            listing_dom: parseInt(row.listing_dom) || 0,
            rep_code: repCode,
            status: "SCANNED",
            lat: parseFloat(row.lat) || 34.1515,
            lng: parseFloat(row.lng) || -118.2548,
          });
        }

        if (leads.length === 0) {
          alert("No valid leads found in CSV");
          setUploading(false);
          return;
        }

        // Bulk create
        await base44.entities.ActivatorLead.bulkCreate(leads);
        setResult({ success: true, count: leads.length });
        onSuccess();
      };
      reader.readAsText(file);
    } catch (err) {
      setResult({ success: false, error: err.message });
    }
    setUploading(false);
  };

  if (result?.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <p className="text-sm font-bold text-green-800 mb-1">✓ Imported {result.count} leads</p>
        <button
          onClick={() => {
            setFile(null);
            setResult(null);
            setPreview([]);
          }}
          className="text-xs text-green-600 hover:text-green-800 underline"
        >
          Import more
        </button>
      </div>
    );
  }

  if (result?.success === false) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <AlertCircle className="h-5 w-5 text-red-600 mb-2" />
        <p className="text-xs text-red-800">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Bulk Import Leads (CSV)
        </p>
        <p className="text-xs text-slate-600 mb-3">
          Required columns: first_name, email, property_address. Optional: last_name, phone, property_type, estimated_price, estimated_equity, distress_score, listing_dom, lat, lng
        </p>
      </div>

      <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
        <Upload className="h-4 w-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-600">
          {file ? file.name : "Choose CSV file"}
        </span>
        <input type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
      </label>

      {preview.length > 0 && (
        <div className="bg-slate-50 rounded-lg p-3 max-h-48 overflow-y-auto">
          <p className="text-xs font-bold text-slate-600 mb-2">Preview ({preview.length} rows)</p>
          <table className="w-full text-xs">
            <tbody>
              {preview.map((row, i) => (
                <tr key={i} className="border-b border-slate-200 last:border-0">
                  <td className="py-1 px-1 text-slate-700 font-semibold">
                    {row.first_name} {row.last_name}
                  </td>
                  <td className="py-1 px-1 text-slate-600 truncate">{row.property_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-3 rounded-lg font-bold text-sm text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ background: uploading ? "#888" : NAVY }}
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {uploading ? "Importing…" : "Import Leads"}
      </button>
    </div>
  );
}