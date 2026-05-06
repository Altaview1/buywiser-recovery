import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function QRScansList({ scans, payments }) {
  const [sortBy, setSortBy] = useState("created_date");
  const [sortDir, setSortDir] = useState("desc");

  const paymentMap = useMemo(
    () => Object.fromEntries(payments.map(p => [p.lead_id, p.status])),
    [payments]
  );

  const statusColors = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    APPROVED: "bg-green-50 text-green-700 border-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
  };

  const sorted = useMemo(() => {
    const copy = [...scans];
    copy.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "created_date") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDir === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
    return copy;
  }, [scans, sortBy, sortDir]);

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const SortHeader = ({ col, label }) => (
    <button
      onClick={() => handleSort(col)}
      className="flex items-center gap-1 hover:text-slate-900 transition"
    >
      {label}
      {sortBy === col && (
        sortDir === "asc"
          ? <ChevronUp className="h-3.5 w-3.5" />
          : <ChevronDown className="h-3.5 w-3.5" />
      )}
    </button>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                <SortHeader col="created_date" label="Timestamp" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                <SortHeader col="first_name" label="Homeowner" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                <SortHeader col="property_address" label="Property" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                <SortHeader col="rep_code" label="Rep Code" />
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No scans today
                </td>
              </tr>
            ) : (
              sorted.map((scan) => {
                const paymentStatus = paymentMap[scan.id] || "PENDING";
                const fullName = `${scan.first_name || ""} ${scan.last_name || ""}`.trim();
                const timestamp = new Date(scan.created_date).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                );

                return (
                  <tr key={scan.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                      {timestamp}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {fullName || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="text-sm truncate">
                        {scan.property_address}
                      </div>
                      {scan.estimated_price && (
                        <div className="text-xs text-slate-400">
                          ~${(scan.estimated_price / 1000).toFixed(0)}K
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                        {scan.rep_code || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                          statusColors[paymentStatus] || statusColors.PENDING
                        }`}
                      >
                        {paymentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
        <p>
          Showing {sorted.length} scan{sorted.length !== 1 ? "s" : ""} today —
          Updates appear in real-time
        </p>
      </div>
    </div>
  );
}