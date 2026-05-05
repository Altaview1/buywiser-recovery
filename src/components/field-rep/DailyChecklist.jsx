import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Circle } from "lucide-react";

const TASKS = [
  { id: "knock", label: "🚪 Knock on door", completed: false },
  { id: "spoke", label: "👤 Spoke with homeowner", completed: false },
  { id: "left_flyer", label: "📄 Left flyer/materials", completed: false },
  { id: "photo", label: "📸 Took property photo", completed: false },
  { id: "qr_scan", label: "📱 QR code scanned", completed: false },
  { id: "notes", label: "📝 Logged visit notes", completed: false },
];

export default function DailyChecklist({ leads, rep }) {
  const [tasks, setTasks] = useState(TASKS);
  const [dailyStats, setDailyStats] = useState({
    propertiesVisited: 0,
    propertiesRemaining: 0,
    completionPercent: 0,
  });

  useEffect(() => {
    updateStats();
  }, [leads]);

  const updateStats = () => {
    const today = new Date().toDateString();
    const todayLeads = leads.filter((l) => {
      const leadDate = new Date(l.created_date).toDateString();
      return leadDate === today;
    });
    const remaining = leads.filter((l) => l.status === "SCANNED").length;
    const completed = Math.round((tasks.filter((t) => t.completed).length / TASKS.length) * 100);

    setDailyStats({
      propertiesVisited: todayLeads.length,
      propertiesRemaining: remaining,
      completionPercent: completed,
    });
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Daily Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
          <p className="text-2xl font-black text-blue-700">{dailyStats.propertiesVisited}</p>
          <p className="text-xs text-blue-600 font-semibold mt-1">Visited Today</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 text-center border border-amber-200">
          <p className="text-2xl font-black text-amber-700">{dailyStats.propertiesRemaining}</p>
          <p className="text-xs text-amber-600 font-semibold mt-1">Still To Visit</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200">
          <p className="text-2xl font-black text-green-700">{completedCount}/{TASKS.length}</p>
          <p className="text-xs text-green-600 font-semibold mt-1">Tasks Done</p>
        </div>
      </div>

      {/* Checklist Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-slate-900">Daily Checklist</p>
          <span className="text-xs font-bold text-slate-500">
            {completedCount}/{TASKS.length}
          </span>
        </div>
        <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 rounded-full transition-all duration-300"
            style={{ width: `${dailyStats.completionPercent}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-left border-2 transition ${
              task.completed
                ? "bg-green-50 border-green-200"
                : "bg-white border-slate-200 hover:border-blue-300"
            }`}
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-slate-300 flex-shrink-0" />
            )}
            <span
              className={`text-sm font-semibold ${
                task.completed ? "text-green-700 line-through" : "text-slate-700"
              }`}
            >
              {task.label}
            </span>
          </button>
        ))}
      </div>

      {/* Daily Goal */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
        <p className="text-xs font-black uppercase tracking-widest mb-1 text-blue-100">Today's Goal</p>
        <p className="text-sm font-bold mb-3">Visit all assigned properties and complete your checklist</p>
        <div className="flex items-center gap-2 text-xs text-blue-100">
          <span>✓</span>
          <span>Focus on quality interactions, not just speed</span>
        </div>
      </div>
    </div>
  );
}