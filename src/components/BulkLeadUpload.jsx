import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { X, Upload, FileSpreadsheet, CheckCircle, AlertCircle, ChevronDown, Loader2, Download } from "lucide-react";

const REQUIRED_COL = "address_or_link";
const COL_MAP = {
  address_or_link: ["address_or_link", "address", "listing", "property", "url", "link", "property_address"],
  name:            ["name", "lead_name", "homeowner", "homeowner_name", "full_name", "contact"],
  email:           ["email", "email_address"],
  phone:           ["phone", "phone_number", "mobile", "cell"],
  assigned_agent:  ["assigned_agent", "agent", "agent_name", "rep"],
  internal_notes:  ["notes", "internal_notes", "note", "comment"],
};

function guessColumn(headers, fieldAliases) {
  for (const alias of fieldAliases) {
    const match = headers.find(h => h.toLowerCase().trim() === alias);
    if (match) return match;
  }
  return null;
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim());
  const rows = lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.replace(/^"|"$/g, "").trim());
    const row = {};
    headers.forEach((h, i) => { row[h] = vals[i] || ""; });
    return row;
  });
  return { headers, rows };
}

const SAMPLE_CSV = `address_or_link,name,email,phone,assigned_agent,internal_notes
123 Oak St Simi Valley CA,Jane Smith,jane@email.com,(818) 555-1234,Agent Name,VA loan confirmed
456 Maple Ave Oxnard CA,John Doe,john@email.com,(805) 555-9876,Agent Name,Interested in purchase`;

export default function BulkLeadUpload({ onClose, onImported }) {
  const [agents, setAgents] = useState([]);
  const [step, setStep] = useState("upload"); // upload | preview | done
  const [parsedRows, setParsedRows] = useState([]);
  const [columnMap, setColumnMap] = useState({});
  const [globalAgent, setGlobalAgent] = useState("");
  const [rowAgents, setRowAgents] = useState({});
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState({ success: 0, failed: 0 });
  const [errors, setErrors] = useState([]);
  const fileRef = useRef();

  useEffect(() => {
    base44.entities.FieldActivator.list("name", 100).then(activators => {
      setAgents(activators);
      const barry = activators.find(a => a.name === "Barry Mendoza");
      const byron = activators.find(a => a.name === "Byron Mendoza");
      const defaultActivator = barry || byron || activators[0];
      if (defaultActivator) setGlobalAgent(defaultActivator.name);
    });
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const { headers, rows } = parseCSV(e.target.result);
      const map = {};
      Object.entries(COL_MAP).forEach(([field, aliases]) => {
        const found = guessColumn(headers, aliases);
        if (found) map[field] = found;
      });
      setColumnMap(map);
      setParsedRows(rows.filter(r => r[map[REQUIRED_COL]])); // skip blank address rows
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const getMapped = (row, field) => {
    const col = columnMap[field];
    return col ? (row[col] || "") : "";
  };

  const handleImport = async () => {
    setImporting(true);
    let success = 0;
    const failedRows = [];

    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      const agent = rowAgents[i] || globalAgent || getMapped(row, "assigned_agent");
      const lead = {
        address_or_link: getMapped(row, "address_or_link"),
        name:            getMapped(row, "name"),
        email:           getMapped(row, "email"),
        phone:           getMapped(row, "phone"),
        assigned_agent:  agent,
        internal_notes:  getMapped(row, "internal_notes"),
        utm_source:      "bulk_upload",
        status:          "New",
      };
      try {
        await base44.entities.Lead.create(lead);
        success++;
      } catch {
        failedRows.push(i + 1);
      }
    }

    setResults({ success, failed: failedRows.length });
    setErrors(failedRows);
    setImporting(false);
    setStep("done");
    if (success > 0) onImported(success);
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "leads_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-slate-900 flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-white/60" />
            <p className="text-sm font-bold text-white">Bulk Lead Upload</p>
            {step === "preview" && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs">{parsedRows.length} rows detected</span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step: Upload */}
        {step === "upload" && (
          <div className="p-6 space-y-5 overflow-y-auto">
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <Upload className="h-10 w-10 mx-auto mb-3 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">Drop your CSV file here, or click to browse</p>
              <p className="text-xs text-slate-400 mt-1">Supports .csv files. Excel users: File → Save As → CSV.</p>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Columns</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                <span><strong>address_or_link</strong> — required</span>
                <span>name</span>
                <span>email</span>
                <span>phone</span>
                <span>assigned_agent</span>
                <span>internal_notes</span>
              </div>
              <button onClick={downloadSample} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
                <Download className="h-3.5 w-3.5" /> Download sample CSV template
              </button>
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {step === "preview" && (
          <div className="flex flex-col overflow-hidden flex-1">
            <div className="px-6 pt-5 pb-3 flex-shrink-0 space-y-3">
               <div className="space-y-2">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                   Assign ALL rows to Field Activator
                 </label>
                 <div className="flex gap-2 flex-wrap items-center">
                   {agents.filter(a => a.name === "Barry Mendoza" || a.name === "Byron Mendoza").map(a => (
                     <button
                       key={a.id}
                       onClick={() => setGlobalAgent(a.name)}
                       className={`px-4 py-2 text-xs font-bold rounded-lg border-2 transition ${
                         globalAgent === a.name
                           ? "bg-blue-600 text-white border-blue-600"
                           : "bg-white text-slate-700 border-slate-200 hover:border-blue-400"
                       }`}
                     >
                       {a.name}
                     </button>
                   ))}
                   <div className="relative flex-1 min-w-48">
                     <select
                       value={globalAgent}
                       onChange={e => setGlobalAgent(e.target.value)}
                       className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                     >
                       <option value="">— More options —</option>
                       {agents.map(a => (
                         <option key={a.id} value={a.name}>{a.name}{a.assigned_area ? ` — ${a.assigned_area}` : ""}</option>
                       ))}
                     </select>
                     <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                   </div>
                 </div>
               </div>
             </div>

            {/* Table */}
            <div className="flex-1 overflow-auto px-6 pb-4">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 sticky top-0">
                    <th className="text-left px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">#</th>
                    <th className="text-left px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">Address / URL</th>
                    <th className="text-left px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-3 py-2 font-bold text-slate-500 uppercase tracking-wider min-w-40">Assign to Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((row, i) => {
                    const effectiveAgent = rowAgents[i] !== undefined ? rowAgents[i] : getMapped(row, "assigned_agent");
                    const missingAgent = !globalAgent && !effectiveAgent;
                    return (
                      <tr key={i} className={`border-b border-slate-100 ${missingAgent ? "bg-amber-50" : "hover:bg-slate-50"}`}>
                        <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                        <td className="px-3 py-2 text-slate-700 max-w-xs truncate">{getMapped(row, "address_or_link")}</td>
                        <td className="px-3 py-2 text-slate-600">{getMapped(row, "name") || <span className="text-slate-300">—</span>}</td>
                        <td className="px-3 py-2 text-slate-600">{getMapped(row, "phone") || <span className="text-slate-300">—</span>}</td>
                        <td className="px-3 py-2">
                          {globalAgent ? (
                            <span className="text-green-700 font-semibold">{globalAgent}</span>
                          ) : (
                            <select
                              value={rowAgents[i] !== undefined ? rowAgents[i] : getMapped(row, "assigned_agent")}
                              onChange={e => setRowAgents(prev => ({ ...prev, [i]: e.target.value }))}
                              className={`w-full text-xs border rounded px-1.5 py-1 focus:outline-none ${missingAgent ? "border-amber-400 bg-amber-50" : "border-slate-200 bg-white"}`}
                            >
                              <option value="">— select agent —</option>
                              {agents.map(a => (
                                <option key={a.id} value={a.name}>{a.name}</option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3 flex-shrink-0 bg-white">
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition"
              >
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {importing ? `Importing…` : `Import ${parsedRows.length} Lead${parsedRows.length !== 1 ? "s" : ""}`}
              </button>
              <button onClick={() => setStep("upload")} className="px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                ← Back
              </button>
              {parsedRows.some((_, i) => !globalAgent && !rowAgents[i] && !getMapped(_, "assigned_agent")) && (
                <p className="text-xs text-amber-600 font-medium">⚠ Some rows have no agent assigned</p>
              )}
            </div>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div className="p-8 text-center space-y-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${results.failed === 0 ? "bg-green-100" : "bg-amber-100"}`}>
              {results.failed === 0
                ? <CheckCircle className="h-7 w-7 text-green-600" />
                : <AlertCircle className="h-7 w-7 text-amber-600" />}
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Import Complete</p>
              <p className="text-sm text-slate-500 mt-1">
                <span className="text-green-700 font-semibold">{results.success} lead{results.success !== 1 ? "s" : ""} imported</span>
                {results.failed > 0 && <span className="text-red-600 font-semibold"> · {results.failed} failed (rows: {errors.join(", ")})</span>}
              </p>
            </div>
            <button onClick={onClose} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}