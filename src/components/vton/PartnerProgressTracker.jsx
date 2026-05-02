import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

export default function PartnerProgressTracker({ partner }) {
  const steps = [
    {
      id: "application",
      label: "Application Submitted",
      completed: !!partner?.id,
    },
    {
      id: "quiz",
      label: "Pre-Screening Quiz Passed",
      completed: partner?.quiz_passed === true,
    },
    {
      id: "interview",
      label: "Interview Scheduled",
      completed: partner?.interview_scheduled === true,
    },
    {
      id: "verified",
      label: "Partner Verified",
      completed: partner?.status === "approved",
    },
  ];

  const currentStep = steps.findIndex(s => !s.completed);
  const isComplete = steps.every(s => s.completed);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-2" style={{ background: NAVY }}>
        <Clock className="h-4 w-4 text-slate-300" />
        <p className="text-xs font-black uppercase tracking-widest text-white/80">Onboarding Progress</p>
        {isComplete && (
          <span className="ml-auto text-xs font-bold text-green-300">100% Complete</span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-5 pt-4">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%`,
              background: isComplete ? "#10b981" : RED,
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="px-5 py-5 space-y-3">
        {steps.map((step, idx) => {
          const isActive = currentStep === idx;
          const isPast = idx < currentStep;

          return (
            <div key={step.id} className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {step.completed ? (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#10b981" }}>
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                ) : isActive ? (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-400 animate-pulse">
                    <div className="w-2 h-2 rounded-full" style={{ background: RED }} />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-400">{idx + 1}</span>
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${
                    step.completed
                      ? "text-green-700"
                      : isActive
                      ? "text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
                {step.completed && (
                  <p className="text-xs text-slate-400 mt-0.5">✓ Complete</p>
                )}
                {isActive && (
                  <p className="text-xs text-amber-600 mt-0.5">← You are here</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Message */}
      <div className="px-5 pb-5">
        {isComplete ? (
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-green-800">Onboarding Complete</p>
              <p className="text-xs text-green-700 mt-0.5">You're now a verified VTON partner. Territory opportunities will be assigned to your dashboard.</p>
            </div>
          </div>
        ) : currentStep >= 0 && currentStep < steps.length ? (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <Clock className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800">Next Step: {steps[currentStep].label}</p>
              <p className="text-xs text-amber-700 mt-0.5">
                {currentStep === 0 && "Your application is being reviewed. You'll hear from us within 1 business day."}
                {currentStep === 1 && "Complete the pre-screening quiz to advance."}
                {currentStep === 2 && "Interview booking is in progress. Check your email for calendar confirmation."}
                {currentStep === 3 && "Finalizing your verification. You'll be notified when approved."}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}