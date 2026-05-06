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

  // Parse quoted CSV line correctly
  const parseCSVLine = (line) => {
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
  };

  // Parse "LASTNAME,FIRSTNAME MIDDLE" owner format
  const parseOwner = (owner) => {
    if (!owner) return { first_name: "", last_name: "" };
    const primary = owner.split("&")[0].trim();
    const commaIdx = primary.indexOf(",");
    const tc = s => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
    if (commaIdx === -1) return { first_name: tc(primary), last_name: "" };
    const last = primary.slice(0, commaIdx).trim();
    const first = primary.slice(commaIdx + 1).trim().split(" ")[0];
    return { first_name: tc(first), last_name: tc(last) };
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
        const rawLines = csv.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
        const headerLine = rawLines[0].replace(/^\uFEFF/, "");
        const headers = parseCSVLine(headerLine).map(h => h.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""));

        // Detect PropertyRadar format (has 'address' and 'owner' columns)
        const isPropertyRadar = headers.includes("address") && headers.includes("owner");

        const leads = [];
        for (let i = 1; i < rawLines.length; i++) {
          if (!rawLines[i].trim()) continue;
          const values = parseCSVLine(rawLines[i]);
          const row = {};
          headers.forEach((h, idx) => { row[h] = values[idx] || ""; });

          if (isPropertyRadar) {
            const address = (row.address || "").trim();
            const city = (row.city || "").trim();
            if (!address) continue;
            // Skip footer/disclaimer lines
            if (address.toLowerCase().includes("information contained") || address.toLowerCase().includes("propertyradar")) continue;

            const { first_name, last_name } = parseOwner(row.owner);
            const slug = address.toLowerCase().replace(/\s+/g, "").slice(0, 12);
            leads.push({
              first_name: first_name || "Owner",
              last_name,
              email: `lead+${slug}@placeholder.local`,
              phone: "",
              property_address: city ? `${address}, ${city}, CA` : `${address}, CA`,
              property_type: row.type || "SFR",
              estimated_price: parseFloat((row.est_value || "0").replace(/[^0-9.-]/g, "")) || null,
              estimated_equity: parseFloat((row.est_equity_$ || row.est_equity || "0").replace(/[^0-9.-]/g, "")) || null,
              distress_score: parseFloat(row.distress_score) || null,
              listing_dom: parseInt(row.listing_dom) || null,
              rep_code: repCode,
              status: "SCANNED",
            });
          } else {
            if (!row.first_name || !row.property_address) continue;
            leads.push({
              first_name: row.first_name,
              last_name: row.last_name || "",
              email: row.email || `lead+${row.property_address.slice(0,8).replace(/\s/g,"")}@placeholder.local`,
              phone: row.phone || "",
              property_address: row.property_address,
              property_type: row.property_type || "SFR",
              estimated_price: parseFloat(row.estimated_price) || null,
              estimated_equity: parseFloat(row.estimated_equity) || null,
              distress_score: parseFloat(row.distress_score) || null,
              listing_dom: parseInt(row.listing_dom) || null,
              rep_code: repCode,
              status: "SCANNED",
              lat: parseFloat(row.lat) || null,
              lng: parseFloat(row.lng) || null,
            });
          }
        }

        if (leads.length === 0) {
          alert("No valid leads found in CSV. For PropertyRadar exports, ensure the file has Address and Owner columns.");
          setUploading(false);
          return;
        }

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
          Accepts <strong>PropertyRadar exports</strong> (Address, Owner, City, Est Value columns) or standard CSVs (first_name, property_address). Email is not required for PropertyRadar files.
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