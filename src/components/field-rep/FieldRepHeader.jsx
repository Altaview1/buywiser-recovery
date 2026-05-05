import { LogOut, MapPin } from "lucide-react";

const NAVY = "#0B1F3B";

export default function FieldRepHeader({ rep, onLogout }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Field Activator
          </p>
          <p className="text-sm font-bold text-slate-800">{rep.name}</p>
          {rep.assigned_area && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" /> {rep.assigned_area}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 mb-2">{today}</p>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}