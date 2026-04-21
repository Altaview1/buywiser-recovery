import { useState, useEffect } from "react";
import { usePageTitle } from "@/lib/usePageTitle";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Loader2, ChevronLeft, ChevronRight, Key, RefreshCw, DollarSign, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";

const purchaseSteps = [
  { id: "loan_type", title: "SELECT A LOAN TYPE", type: "choice", options: ["Purchase", "Refinance", "Home Equity"], icons: [Key, RefreshCw, DollarSign] },
  { id: "property_type", title: "SELECT PROPERTY TYPE", type: "choice", options: ["Single Family", "Multi-Family", "Condominium", "Townhouse", "Manufactured Home"] },
  { id: "property_use", title: "WHAT IS THE PROPERTY USE?", type: "choice", options: ["Primary Residence", "Vacation Home", "Investment Property"] },
  { id: "credit_score", title: "HOW IS YOUR CREDIT?", type: "choice", options: ["Excellent", "Very Good", "Good", "Fair", "Poor"] },
  { id: "found_home", title: "HAVE YOU ALREADY FOUND A HOME?", type: "choice", options: ["Yes", "No"] },
  { id: "purchase_price", title: "Purchase Price", type: "slider", min: 50000, max: 2000000, step: 5000, default: 275000 },
  { id: "military", title: "MILITARY SERVICE?", type: "choice", options: ["Yes", "No"] },
  { id: "timeline", title: "YOU EXPECT TO BUY WITHIN?", type: "choice", options: ["Soon", "Next 60 days", "Next 6 months", "Not very soon"] },
  { id: "first_time", title: "First time home buyer?", type: "choice", options: ["Yes", "No"] },
  { id: "bankruptcy", title: "Bankruptcy in last 7 years?", type: "choice", options: ["Yes", "No"] },
  { id: "income", title: "Annual Household Income?", type: "slider", min: 0, max: 500000, step: 5000, default: 75000 },
  { id: "debt", title: "Monthly Debt Payments", type: "slider", min: 0, max: 10000, step: 100, default: 0 },
  { id: "employment", title: "Employment status", type: "select", options: ["Employed", "Self Employed", "Retired", "Unemployed"] },
  { id: "contact", title: "TELL US ABOUT YOURSELF", type: "form" },
];

export default function MortgageReview() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialType = urlParams.get("type");

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contact, setContact] = useState({ first_name: "", last_name: "", email: "", phone: "" });
  const [agreed, setAgreed] = useState(false);

  usePageTitle('Request a Mortgage Review | BuyWiser Home Loans');

  useEffect(() => {
    if (initialType === "purchase") {
      setAnswers((prev) => ({ ...prev, loan_type: "Purchase" }));
    } else if (initialType === "refinance") {
      setAnswers((prev) => ({ ...prev, loan_type: "Refinance" }));
    }
  }, [initialType]);

  const currentStep = purchaseSteps[step];
  const totalSteps = purchaseSteps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const selectAnswer = (value) => {
    setAnswers({ ...answers, [currentStep.id]: value });
  };

  const goNext = () => { if (step < totalSteps - 1) setStep(step + 1); };
  const goBack = () => { if (step > 0) setStep(step - 1); };

  const handleSubmit = async () => {
    if (!agreed) return;
    setLoading(true);
    await base44.entities.ContactSubmission.create({
      ...contact,
      form_type: "application",
      loan_type: answers.loan_type || "",
      credit_score: answers.credit_score || "",
      comments: JSON.stringify(answers),
    });
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 text-center max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-9 w-9 text-blue-700" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
          <p className="text-slate-600 mb-6">Thank you. A member of our team will contact you within one business day.</p>
          <Link to="/" className="inline-block px-6 py-3 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-900 transition text-sm">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-blue-950">
        {/* Decorative stripes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-3 bg-red-600" />
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-red-600" />
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5 bg-white" style={{ transform: "translate(30%, -30%)" }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">

            {/* Left: Copy */}
            <div className="flex-1 text-center lg:text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                <Shield className="h-3.5 w-3.5" /> Exclusive Veteran Next Home Benefit
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                A New Homebuying Benefit<br className="hidden sm:block" />
                <span className="text-red-400"> Exclusively for Veterans</span>
              </h1>

              <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-6 max-w-2xl">
                If you're a veteran selling your current home, you may qualify for <strong className="text-white">up to 1.5% back on your next purchase</strong> — a BuyWiser benefit available only when you buy and finance through us. This is not a VA program. It's a private advantage we've created for veterans making their next move.
              </p>

              {/* Benefit callout pill */}
              <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 mb-6">
                <div className="text-left">
                  <p className="text-xs text-blue-300 font-semibold uppercase tracking-wider mb-0.5">Example Benefit</p>
                  <p className="text-white font-bold text-lg">$700K purchase = <span className="text-amber-400">up to $10,500 back</span></p>
                </div>
              </div>

              {/* Key bullets */}
              <ul className="space-y-2 text-sm text-blue-200 text-left max-w-md mx-auto lg:mx-0">
                {[
                  "Available to eligible veterans selling their current home",
                  "Works with VA or conventional financing on the next purchase",
                  "Not affiliated with the VA or any government program",
                  "Only available through BuyWiser — California's boutique mortgage experts",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Badge */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <div className="relative w-44 h-44 rounded-full flex items-center justify-center shadow-2xl"
                style={{ background: "radial-gradient(circle at 40% 35%, #1e3a8a, #172554)" }}>
                {/* Red ring */}
                <div className="absolute inset-0 rounded-full border-4 border-red-600" />
                {/* White ring */}
                <div className="absolute inset-2 rounded-full border-2 border-white/30" />
                <div className="text-center z-10 px-4">
                  <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">Up to</p>
                  <p className="text-amber-400 text-4xl font-black leading-none">1.5%</p>
                  <p className="text-white text-xs font-bold uppercase tracking-widest mt-1">Back</p>
                  <p className="text-blue-300 text-[10px] mt-1 leading-tight">on your next purchase</p>
                </div>
              </div>
              <p className="text-xs text-blue-400 text-center max-w-[160px] leading-snug">
                Exclusive BuyWiser veteran benefit. Not a government program.
              </p>
            </div>

          </div>
        </div>

        {/* Red-white-blue bottom stripe */}
        <div className="flex h-2">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-blue-600" />
        </div>
      </div>

      {/* ── Wizard ── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Step {step + 1} of {totalSteps}</span>
            <span className="text-xs font-bold text-blue-700">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #1d4ed8, #b91c1c)" }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-lg overflow-hidden min-h-[340px] flex flex-col">

          {/* Card header accent */}
          <div className="flex h-1.5">
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-white border-y border-slate-200" />
            <div className="flex-1 bg-blue-800" />
          </div>

          <div className="p-6 md:p-8 flex flex-col flex-1">
            <h2 className="text-xl font-extrabold text-slate-900 text-center mb-6 uppercase tracking-wide">{currentStep.title}</h2>

            {currentStep.type === "choice" && (
              <div className="flex flex-wrap justify-center gap-3 flex-1 items-center">
                {currentStep.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => { selectAnswer(option); goNext(); }}
                    className={`px-6 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                      answers[currentStep.id] === option
                        ? "border-blue-700 bg-blue-50 text-blue-800 shadow-md"
                        : "border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50/50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentStep.type === "slider" && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-4xl font-black text-blue-800 mb-6">
                  ${(answers[currentStep.id] || currentStep.default).toLocaleString()}
                </p>
                <input
                  type="range"
                  min={currentStep.min}
                  max={currentStep.max}
                  step={currentStep.step}
                  value={answers[currentStep.id] || currentStep.default}
                  onChange={(e) => selectAnswer(Number(e.target.value))}
                  className="w-full max-w-md accent-blue-700"
                />
                <div className="flex justify-between w-full max-w-md mt-2">
                  <span className="text-xs text-slate-400">${currentStep.min.toLocaleString()}</span>
                  <span className="text-xs text-slate-400">${currentStep.max.toLocaleString()}</span>
                </div>
              </div>
            )}

            {currentStep.type === "select" && (
              <div className="flex-1 flex items-center justify-center">
                <Select value={answers[currentStep.id] || ""} onValueChange={(v) => selectAnswer(v)}>
                  <SelectTrigger className="w-64 h-12 border-2 border-slate-200">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentStep.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentStep.type === "form" && (
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-1 block">First Name *</Label>
                    <Input className="h-11 border-2" required value={contact.first_name} onChange={(e) => setContact({...contact, first_name: e.target.value})} />
                  </div>
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-1 block">Last Name *</Label>
                    <Input className="h-11 border-2" required value={contact.last_name} onChange={(e) => setContact({...contact, last_name: e.target.value})} />
                  </div>
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-1 block">Email *</Label>
                    <Input className="h-11 border-2" type="email" required value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} />
                  </div>
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wide text-slate-600 mb-1 block">Phone *</Label>
                    <Input className="h-11 border-2" type="tel" required value={contact.phone} onChange={(e) => setContact({...contact, phone: e.target.value})} />
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-4">
                  <Checkbox checked={agreed} onCheckedChange={setAgreed} id="apply-consent" />
                  <label htmlFor="apply-consent" className="text-xs text-slate-500 leading-relaxed">
                    I agree to receive marketing and customer service calls and text messages from BuyWiser.
                    Msg/data rates may apply. Reply STOP to unsubscribe.
                  </label>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  By providing your phone number and/or email and clicking "Submit" you agree to our
                  Terms of Service and Privacy Policy.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              {currentStep.type === "form" ? (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !agreed || !contact.first_name || !contact.email || !contact.phone}
                  className="bg-blue-800 hover:bg-blue-900 text-white px-10 h-12 font-bold text-sm rounded-xl"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit My Review →"}
                </Button>
              ) : currentStep.type !== "choice" ? (
                <Button onClick={goNext} className="bg-blue-800 hover:bg-blue-900 text-white px-8 h-11 font-bold rounded-xl">
                  Continue <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-slate-400">
          {["No cost. No obligation.", "California licensed — NMLS #1887767", "Veteran benefit exclusive to BuyWiser"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-blue-600" /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Veteran Benefit Callout Bar ── */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <Shield className="h-3.5 w-3.5" /> New — Only Through BuyWiser
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            The Veteran Next Home Benefit
          </h2>
          <p className="text-red-100 max-w-2xl mx-auto text-base leading-relaxed mb-6">
            This is not a VA program. It is a BuyWiser-created benefit for eligible veterans who are <strong className="text-white">selling their current home</strong> and buying another. When you buy and finance your next home through BuyWiser, you may receive <strong className="text-white">up to 1.5% of the purchase price back</strong> at closing.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-red-700 font-extrabold rounded-xl hover:bg-red-50 transition text-sm shadow-lg"
          >
            Check My Veteran Benefit Estimate →
          </Link>
          <p className="text-red-200 text-xs mt-4">Only available to eligible veterans buying and financing through BuyWiser in California.</p>
        </div>
      </div>

    </div>
  );
}