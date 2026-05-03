import { CheckCircle, Clock, Award, Target, TrendingUp } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

export default function PartnerProgressTracker({ partner }) {
  const verifiedCount = partner?.verified_conversations || 0;
  const depositBalance = partner?.deposit_balance || 2000;
  const refundEarned = verifiedCount * 200;
  const refundProgress = Math.min(100, (refundEarned / depositBalance) * 100);
  const isFullyRefunded = refundEarned >= depositBalance;

  const steps = [
    { id: "application", label: "Application Submitted", completed: !!partner?.id },
    { id: "quiz", label: "Pre-Screening Passed", completed: partner?.quiz_passed === true },
    { id: "interview", label: "Accountability Review Completed", completed: partner?.interview_scheduled === true },
    { id: "verified", label: "Cycle 1 Active", completed: partner?.status === "approved" },
    { id: "cycle_complete", label: "Deposit Fully Refunded", completed: isFullyRefunded },
  ];

  const currentStep = steps.findIndex(s => !s.completed);
  const onboardingComplete = steps.slice(0, 4).every(s => s.completed);

  return (
    <div className="space-y-4">
      {/* Refund Progress — Primary metric */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-2" style={{ background: NAVY }}>
          <TrendingUp className="h-4 w-4 text-green-400" />
          <p className="text-xs font-black uppercase tracking-widest text-white/80">Refund Progress — Cycle 1</p>
          {isFullyRefunded && (
            <span className="ml-auto text-xs font-bold text-green-300">Deposit Fully Refunded</span>
          )}
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Big progress bar */}
          <div>
            <div className="flex items-end justify-between mb-1.5">
              <p className="text-xs text-slate-500 font-semibold">Refund Earned</p>
              <p className="text-sm font-black" style={{ color: isFullyRefunded ? "#10b981" : NAVY }}>
                ${Math.min(refundEarned, depositBalance).toLocaleString()} / ${depositBalance.toLocaleString()}
              </p>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${refundProgress}%`, background: isFullyRefunded ? "#10b981" : RED }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{verifiedCount} verified accountability action{verifiedCount !== 1 ? "s" : ""} × $200 refund each</p>
          </div>

          {/* Score tiles */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-slate-800">{verifiedCount}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">Verified Actions</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-black" style={{ color: RED }}>{Math.max(0, 10 - verifiedCount)}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">Actions to Full Refund</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-black" style={{ color: isFullyRefunded ? "#10b981" : NAVY }}>
                {Math.round(refundProgress)}%
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">Refund Progress</p>
            </div>
          </div>

          {isFullyRefunded ? (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
              <Award className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-green-800 uppercase tracking-wide">Deposit Fully Refunded</p>
                <p className="text-xs text-green-700 mt-0.5">Your VTON Performance Score is now being evaluated for continued or expanded territory participation.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <Target className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Complete <strong>{Math.max(0, 10 - verifiedCount)} more verified accountability action{Math.max(0, 10 - verifiedCount) !== 1 ? "s" : ""}</strong> to earn back your full deposit and unlock your VTON Performance Score review.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Onboarding steps */}
      {!onboardingComplete && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-2" style={{ background: NAVY }}>
            <Clock className="h-4 w-4 text-slate-300" />
            <p className="text-xs font-black uppercase tracking-widest text-white/80">Onboarding Checklist</p>
          </div>
          <div className="px-5 py-4 space-y-3">
            {steps.slice(0, 4).map((step, idx) => {
              const isActive = currentStep === idx;
              return (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
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
                  <p className={`text-sm font-semibold mt-0.5 ${step.completed ? "text-green-700" : isActive ? "text-slate-900" : "text-slate-400"}`}>
                    {step.label}
                    {isActive && <span className="ml-2 text-xs font-normal text-amber-500">← current</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}