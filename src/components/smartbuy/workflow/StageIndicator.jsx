import { ChevronRight } from "lucide-react";

const STAGES = [
  { id: "search", step: 1, label: "Home Search", icon: "🏠" },
  { id: "tour", step: 2, label: "Tour", icon: "🔑" },
  { id: "consultation", step: 3, label: "Consultation", icon: "💬" },
  { id: "offer", step: 4, label: "Make Offer", icon: "✍️" },
];

export default function StageIndicator({ currentStage }) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {STAGES.map((stage, idx) => {
            const isActive = currentStage === stage.id;
            const isComplete = STAGES.findIndex(s => s.id === currentStage) > idx;
            
            return (
              <div key={stage.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition ${
                    isActive 
                      ? "bg-amber-400 border-amber-500 text-amber-900" 
                      : isComplete 
                      ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                      : "bg-slate-100 border-slate-300 text-slate-500"
                  }`}>
                    {isComplete ? "✓" : stage.step}
                  </div>
                  <span className={`text-[10px] font-bold mt-1 text-center ${
                    isActive ? "text-amber-900" : isComplete ? "text-emerald-700" : "text-slate-500"
                  }`}>
                    {stage.label}
                  </span>
                </div>
                {idx < STAGES.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    isComplete ? "bg-emerald-400" : "bg-slate-200"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}