import { CheckCircle, Search, FileText, Phone, Home } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Enter a Listing",
    desc: "Paste any Zillow, Redfin, or Realtor.com link to get started.",
  },
  {
    icon: FileText,
    title: "See Your Benefit",
    desc: "We calculate your Veteran Home Transition Benefit estimate instantly.",
  },
  {
    icon: Phone,
    title: "Talk to Bennett",
    desc: "Schedule a quick call — no pressure, just straight answers about your options.",
  },
  {
    icon: Home,
    title: "Move With Confidence",
    desc: "Receive up to 1.5% toward your next home purchase, structured correctly.",
  },
];

export default function ProcessSteps({ activeStep = 0 }) {
  return (
    <div className="w-full">
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-start justify-between relative">
        {/* Connector line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0" style={{ marginLeft: "10%", marginRight: "10%" }} />

        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i < activeStep;
          const active = i === activeStep;

          return (
            <div key={i} className="flex flex-col items-center text-center z-10 flex-1 px-2">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 border-2 transition-all ${
                  done
                    ? "bg-green-500 border-green-500"
                    : active
                    ? "border-red-600 bg-white"
                    : "border-slate-200 bg-white"
                }`}
                style={active ? { boxShadow: "0 0 0 4px rgba(204,0,0,0.12)" } : {}}
              >
                {done ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <Icon
                    className={`h-5 w-5 ${active ? "text-red-600" : "text-slate-300"}`}
                  />
                )}
              </div>

              {/* Step number */}
              <p
                className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                  done ? "text-green-600" : active ? "text-red-600" : "text-slate-400"
                }`}
              >
                Step {i + 1}
              </p>

              {/* Title */}
              <p
                className={`text-sm font-bold mb-1 ${
                  done || active ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {step.title}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed max-w-[130px]">{step.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="flex sm:hidden flex-col gap-0">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i < activeStep;
          const active = i === activeStep;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={i} className="flex gap-4">
              {/* Left: circle + connector */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                    done
                      ? "bg-green-500 border-green-500"
                      : active
                      ? "border-red-600 bg-white"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {done ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : (
                    <Icon className={`h-4 w-4 ${active ? "text-red-600" : "text-slate-300"}`} />
                  )}
                </div>
                {!isLast && <div className="w-0.5 flex-1 bg-slate-200 my-1" style={{ minHeight: 24 }} />}
              </div>

              {/* Right: content */}
              <div className="pb-5">
                <p
                  className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${
                    done ? "text-green-600" : active ? "text-red-600" : "text-slate-400"
                  }`}
                >
                  Step {i + 1}
                </p>
                <p className={`text-sm font-bold mb-0.5 ${done || active ? "text-slate-900" : "text-slate-400"}`}>
                  {step.title}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}