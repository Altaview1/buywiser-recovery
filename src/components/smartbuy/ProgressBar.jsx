import { ChevronRight, Lock, CheckCircle2, Circle } from "lucide-react";

const JOURNEY_STAGES = [
  { id: "search", step: 1, label: "Home Search", icon: "🏠", description: "Browse & Research" },
  { id: "tour", step: 2, label: "Tour", icon: "🔑", description: "Schedule & Visit" },
  { id: "consultation", step: 3, label: "Consultation", icon: "💬", description: "Get Expert Guidance" },
  { id: "offer", step: 4, label: "Make Offer", icon: "✍️", description: "Submit Contract" },
];

export default function ProgressBar({ currentStage = "search" }) {
  const currentIndex = JOURNEY_STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Main Progress */}
        <div className="flex items-center justify-between mb-6">
          {JOURNEY_STAGES.map((stage, idx) => {
            const isActive = idx === currentIndex;
            const isComplete = idx < currentIndex;
            const isFuture = idx > currentIndex;

            return (
              <div key={stage.id} className="flex items-center flex-1">
                {/* Stage Node */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl border-3 transition shadow-sm ${
                      isActive
                        ? "bg-amber-400 border-amber-600 text-amber-900 scale-110"
                        : isComplete
                        ? "bg-emerald-500 border-emerald-600 text-white"
                        : "bg-slate-200 border-slate-300 text-slate-500"
                    }`}
                  >
                    {isComplete ? <CheckCircle2 className="h-7 w-7" /> : stage.icon}
                  </div>
                  <div className="text-center mt-2">
                    <p
                      className={`text-xs font-black uppercase tracking-widest ${
                        isActive ? "text-amber-900" : isComplete ? "text-emerald-700" : "text-slate-500"
                      }`}
                    >
                      {stage.label}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{stage.description}</p>
                  </div>
                </div>

                {/* Connector Line */}
                {idx < JOURNEY_STAGES.length - 1 && (
                  <div className="flex-1 h-1 mx-3 relative -top-8">
                    <div
                      className={`h-full transition ${
                        isComplete ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Status Message */}
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-amber-200">
          <div>
            <p className="text-sm font-black text-slate-900">
              {currentIndex === 0
                ? "🔍 Start by searching for homes and understanding your savings potential"
                : currentIndex === 1
                ? "🎯 Schedule tours to see properties in person"
                : currentIndex === 2
                ? "💡 Consult with professionals before making your offer"
                : "✅ Ready to make an offer? Let's prepare your contract"}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Step {currentIndex + 1} of {JOURNEY_STAGES.length}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate-500">Next Step</p>
              <p className="text-lg font-black text-amber-600">
                {currentIndex < JOURNEY_STAGES.length - 1 ? JOURNEY_STAGES[currentIndex + 1].label : "Complete!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}