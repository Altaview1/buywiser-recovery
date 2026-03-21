import { useState, useEffect } from "react";
import { usePageTitle } from "@/lib/usePageTitle";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Loader2, ChevronLeft, ChevronRight, Home, RefreshCw, DollarSign, Key } from "lucide-react";

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

export default function ApplyNow() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialType = urlParams.get("type");

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contact, setContact] = useState({ first_name: "", last_name: "", email: "", phone: "" });
  const [agreed, setAgreed] = useState(false);

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

  const goNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };
  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

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
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center max-w-md">
          <CheckCircle className="h-14 w-14 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Application Submitted!</h3>
          <p className="text-slate-600">Thank you! A member of our team will contact you shortly.</p>
        </div>
      </div>
    );
  }

  usePageTitle('Request a Mortgage Review | BuyWiser Home Loans');
  return (
    <div>
      {/* Banner */}
      <div
        className="h-56 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-800/50" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500">Step {step + 1} of {totalSteps}</span>
            <span className="text-xs text-slate-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 min-h-[320px] flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 text-center mb-6">{currentStep.title}</h2>

          {currentStep.type === "choice" && (
            <div className="flex flex-wrap justify-center gap-3 flex-1 items-center">
              {currentStep.options.map((option, i) => (
                <button
                  key={option}
                  onClick={() => { selectAnswer(option); goNext(); }}
                  className={`px-6 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    answers[currentStep.id] === option
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-slate-200 text-slate-600 hover:border-green-300 hover:bg-green-50/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentStep.type === "slider" && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-green-600 mb-6">
                ${(answers[currentStep.id] || currentStep.default).toLocaleString()}
              </p>
              <input
                type="range"
                min={currentStep.min}
                max={currentStep.max}
                step={currentStep.step}
                value={answers[currentStep.id] || currentStep.default}
                onChange={(e) => selectAnswer(Number(e.target.value))}
                className="w-full max-w-md accent-green-600"
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
                <SelectTrigger className="w-64"><SelectValue placeholder="Select an option" /></SelectTrigger>
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
                  <Label>First Name *</Label>
                  <Input required value={contact.first_name} onChange={(e) => setContact({...contact, first_name: e.target.value})} />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input required value={contact.last_name} onChange={(e) => setContact({...contact, last_name: e.target.value})} />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" required value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input type="tel" required value={contact.phone} onChange={(e) => setContact({...contact, phone: e.target.value})} />
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

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {currentStep.type === "form" ? (
              <Button
                onClick={handleSubmit}
                disabled={loading || !agreed || !contact.first_name || !contact.email || !contact.phone}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
              </Button>
            ) : currentStep.type !== "choice" ? (
              <Button onClick={goNext} className="bg-green-600 hover:bg-green-700 text-white px-8">
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}