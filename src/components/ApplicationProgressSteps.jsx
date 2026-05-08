const STEPS = [
  { n: "1", label: "Benefit Review", sub: "Submit your info" },
  { n: "2", label: "Strategy Call", sub: "1 business day" },
  { n: "3", label: "Purchase Plan", sub: "Buywiser coordinates" },
  { n: "4", label: "GAP at Closing", sub: "Up to 1.5% back" },
];

const NAVY = "#0B1F3B";
const RED = "#C62828";

export default function ApplicationProgressSteps() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-start justify-between relative">
        {/* Connector line */}
        <div
          className="absolute top-5 left-0 right-0 h-0.5 z-0"
          style={{ background: "rgba(255,255,255,0.15)", margin: "0 40px" }}
        />

        {STEPS.map((step, i) => (
          <div key={i} className="flex flex-col items-center flex-1 relative z-10">
            {/* Circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 mb-2"
              style={{
                background: i === 0 ? RED : "transparent",
                borderColor: i === 0 ? RED : "rgba(255,255,255,0.3)",
                color: "#fff",
              }}
            >
              {step.n}
            </div>
            <p className="text-white text-xs font-bold text-center leading-tight">{step.label}</p>
            <p className="text-blue-300 text-[10px] text-center mt-0.5 leading-tight">{step.sub}</p>
          </div>
        ))}
      </div>
      <p className="text-blue-300 text-[10px] text-center mt-4 opacity-70">
        You are here — Step 1 of 4
      </p>
    </div>
  );
}