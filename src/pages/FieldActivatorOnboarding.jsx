import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ChevronRight, ChevronLeft, MapPin, Camera, Save, Star, Shield, DoorOpen, QrCode, BarChart2, ArrowRight } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const STEPS = [
  {
    id: 1,
    icon: Shield,
    title: "Welcome to the Field Activator Program",
    subtitle: "Here's what you need to know before your first door.",
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 text-sm leading-relaxed">
          As a <strong className="text-slate-800">Field Activator</strong>, your job is to visit assigned properties, knock on doors, and introduce homeowners to the <strong className="text-slate-800">Veteran's Next Home™</strong> benefit program.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {[
            { icon: "🚪", title: "Door Attempts", desc: "Visit assigned properties and knock or ring the doorbell." },
            { icon: "📋", title: "Log Every Visit", desc: "Record the outcome of every door attempt in the portal." },
            { icon: "💰", title: "Get Paid", desc: "Earn $15 per verified door + bonuses for in-person scans." },
            { icon: "⭐", title: "Level Up", desc: "Hit promotion criteria to become a Senior Field Activator." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 2,
    icon: MapPin,
    title: "Step 1 — Find Your Assigned Leads",
    subtitle: "Your leads are pre-loaded in the Field Activator Portal.",
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 text-sm leading-relaxed">
          Log into the <strong className="text-slate-800">Field Activator Portal</strong> with your email address. You'll see a list of properties assigned to your rep code.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-black uppercase tracking-wider text-blue-700">How to access your leads</p>
          {[
            "Go to the Field Activator Portal (/field-activator)",
            "Enter your registered email address",
            'Tap "Access Portal" to log in',
            "Your assigned properties appear as a list",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-black flex-shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-sm text-slate-700">{step}</p>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-amber-800">💡 Tip</p>
          <p className="text-xs text-amber-700 mt-1">Each card shows the homeowner's name, property address, and phone number. Leads marked <strong>Pending</strong> have not been visited yet.</p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    icon: DoorOpen,
    title: "Step 2 — Arrive at the Property",
    subtitle: "The visit timer starts the moment you open a door attempt.",
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 text-sm leading-relaxed">
          Tap <strong className="text-slate-800">"+ Log Door Attempt"</strong> on a lead card when you arrive at the property. A live timer will start immediately.
        </p>
        <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-green-50 border-b border-green-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Time at property: 0:52
            </div>
            <span className="text-green-700 text-xs font-bold">✓ Minimum met</span>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-slate-500 leading-relaxed">You must spend at least <strong className="text-slate-700">45 seconds</strong> at the property for your visit to qualify for full payment. Short visits are flagged for admin review.</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">Before you knock, make sure you have:</p>
          {["Your leave-behind packets or door hangers", "Your QR flyer (printable from your dashboard)", "A friendly, professional introduction ready"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 4,
    icon: Save,
    title: "Step 3 — Log the Outcome",
    subtitle: "Every door attempt must be logged with the correct outcome.",
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 text-sm leading-relaxed">
          After knocking, confirm the attempt and select what happened. Be honest — accurate logging is required for payment and promotion.
        </p>
        <div className="space-y-2">
          {[
            { outcome: "🚪 No Answer", note: "Requires a door photo as proof.", color: "bg-slate-50 border-slate-200" },
            { outcome: "👤 Homeowner Answered", note: "Log their name and phone if collected.", color: "bg-green-50 border-green-200" },
            { outcome: "👥 Occupant Answered", note: "Someone other than the owner answered.", color: "bg-blue-50 border-blue-200" },
            { outcome: "❌ Refused / Not Interested", note: "Lead will be marked Closed.", color: "bg-red-50 border-red-200" },
            { outcome: "🚧 Inaccessible", note: "Gated, locked — requires a photo.", color: "bg-amber-50 border-amber-200" },
          ].map((item) => (
            <div key={item.outcome} className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border ${item.color}`}>
              <div>
                <p className="text-xs font-bold text-slate-800">{item.outcome}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-slate-800 rounded-xl px-4 py-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            ✅ <strong className="text-white">Tap "Confirm Knock/Ring"</strong> first, then select the outcome, upload a photo if required, and tap <strong className="text-white">"Submit Door Attempt."</strong>
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    icon: Camera,
    title: "Step 4 — Photo Proof",
    subtitle: "Some outcomes require a photo of the property.",
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 text-sm leading-relaxed">
          For <strong>"No Answer"</strong> and <strong>"Inaccessible"</strong> outcomes, you must upload a photo showing the door, packet placement, or obstruction.
        </p>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Good photo examples</p>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { icon: "✅", text: "Front door with leave-behind packet visible" },
              { icon: "✅", text: "Gate or locked entry preventing access" },
              { icon: "✅", text: "Property address or street sign in frame" },
              { icon: "❌", text: "Blurry or dark photos without visible details" },
              { icon: "❌", text: "Photos of unrelated locations" },
            ].map((item, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center gap-2.5 text-sm">
                <span className="text-base">{item.icon}</span>
                <span className={item.icon === "✅" ? "text-slate-700" : "text-slate-400 line-through"}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          📸 Tap <strong className="text-amber-800">"Take / Upload Photo"</strong> in the door attempt form. You can use your phone's camera directly.
        </p>
      </div>
    ),
  },
  {
    id: 6,
    icon: QrCode,
    title: "Step 5 — In-Person QR Scans",
    subtitle: "Getting a homeowner to scan earns you a bonus.",
    content: (
      <div className="space-y-4">
        <p className="text-slate-600 text-sm leading-relaxed">
          If the homeowner is present and interested, show them your <strong className="text-slate-800">In-Person QR code</strong> and ask them to scan it on their phone.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 text-center">
            <p className="text-xs font-black text-blue-700 uppercase tracking-wider">In-Person</p>
            <p className="text-2xl font-black text-blue-800 mt-1">$50</p>
            <p className="text-xs text-blue-600 mt-0.5">Per verified scan at the door</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-3 text-center">
            <p className="text-xs font-black text-purple-700 uppercase tracking-wider">Leave-Behind</p>
            <p className="text-2xl font-black text-purple-800 mt-1">$0</p>
            <p className="text-xs text-purple-600 mt-0.5">No bonus for packet scans (Tier 1)</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 space-y-2">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">How to find your QR codes</p>
          {[
            "Log into your Field Activator Dashboard (/activator)",
            "Tap the QR code icon in the top-right",
            'Show the BLUE "In-Person Scan" QR to homeowners at the door',
            'Use the PURPLE "Leave-Behind" QR only for packets',
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
              <span className="font-black text-slate-400 flex-shrink-0 w-4">{i + 1}.</span>
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 7,
    icon: BarChart2,
    title: "Your Tier & Promotion Progress",
    subtitle: "Track your journey from Field Activator to Senior FA.",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border-2 border-blue-200 rounded-xl p-3">
            <p className="text-xs font-black uppercase tracking-wider text-blue-600 mb-1">Tier 1</p>
            <p className="text-sm font-bold text-slate-800">Field Activator</p>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <p>✓ $15 / verified door</p>
              <p>✓ $50 / in-person scan</p>
            </div>
          </div>
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3">
            <p className="text-xs font-black uppercase tracking-wider text-amber-600 mb-1">Tier 2 ⭐</p>
            <p className="text-sm font-bold text-slate-800">Senior FA</p>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <p>✓ $15 / verified door</p>
              <p>✓ $150 / scheduled review</p>
              <p>✓ $150 / attended review</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Promotion Criteria (Tier 1 → Tier 2)</p>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { label: "100+ Verified Doors", desc: "Logged and confirmed door attempts" },
              { label: "95%+ Logging Accuracy", desc: "All attempts have outcomes recorded" },
              { label: "15%+ In-Person Scan Rate", desc: "Scans vs. door attempts ratio" },
              { label: "3+ Scheduled Benefit Reviews", desc: "In-person activated homeowners" },
              { label: "Zero compliance issues", desc: "Admin verified — no policy violations" },
              { label: "No homeowner complaints", desc: "Admin verified" },
            ].map((item) => (
              <div key={item.label} className="px-4 py-2.5 flex items-center gap-3">
                <Star className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          📊 Track your real-time progress toward promotion in the <strong className="text-blue-700">Field Activator Dashboard</strong> under "Progress Toward Senior Field Activator."
        </p>
      </div>
    ),
  },
  {
    id: 8,
    icon: CheckCircle,
    title: "You're Ready to Go!",
    subtitle: "Here's a quick reference for your first day in the field.",
    content: (
      <div className="space-y-4">
        <div className="bg-green-50 border-2 border-green-300 rounded-xl px-5 py-4 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <p className="text-sm font-bold text-green-800">You've completed the onboarding guide.</p>
          <p className="text-xs text-green-700 mt-1">You're ready to log your first door attempt.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Quick Reference</p>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { label: "Field Activator Portal", desc: "Log door attempts & view leads", path: "/field-activator" },
              { label: "My Dashboard", desc: "View earnings, QR codes & tier progress", path: "/activator" },
              { label: "Sales Coach", desc: "Get live coaching & objection help", path: "/sales-coach" },
              { label: "Resources", desc: "Scripts, objection handlers & training", path: "/resources" },
            ].map((item) => (
              <Link key={item.path} to={item.path} className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition group">
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export default function FieldActivatorOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;
  const isFirst = currentStep === 0;
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
              alt="BuyWiser"
              className="h-6 w-auto opacity-70"
            />
            <span className="text-xs font-bold text-slate-500 hidden sm:block">Field Activator Onboarding</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              {currentStep + 1} / {STEPS.length}
            </span>
            <Link
              to="/field-activator"
              className="text-xs text-slate-400 hover:text-slate-600 underline transition"
            >
              Skip →
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-200 w-full">
        <div
          className="h-full transition-all duration-500 rounded-r-full"
          style={{
            width: `${((currentStep + 1) / STEPS.length) * 100}%`,
            background: NAVY,
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-lg mx-auto space-y-5">
          {/* Step icon + title */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: NAVY }}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">
                Step {currentStep + 1} of {STEPS.length}
              </p>
              <h1 className="text-lg font-extrabold text-slate-900 leading-tight">{step.title}</h1>
              <p className="text-sm text-slate-500 mt-0.5">{step.subtitle}</p>
            </div>
          </div>

          {/* Step content */}
          <div>{step.content}</div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="border-t border-slate-200 bg-white px-4 py-4 sticky bottom-0">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {!isFirst && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          )}
          {isLast ? (
            <Link
              to="/field-activator"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-base text-white transition hover:opacity-90"
              style={{ background: RED }}
            >
              Go to Field Portal <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-base text-white transition hover:opacity-90"
              style={{ background: NAVY }}
            >
              Continue <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`rounded-full transition-all ${
                i === currentStep
                  ? "w-5 h-2 bg-slate-800"
                  : i < currentStep
                  ? "w-2 h-2 bg-slate-400"
                  : "w-2 h-2 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}