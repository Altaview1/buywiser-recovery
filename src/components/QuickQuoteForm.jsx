import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Loader2 } from "lucide-react";

const loanAmounts = [
  "Less than $75,000", "$75,000 - $100,000", "$100,000 - $150,000", "$150,000 - $200,000",
  "$200,000 - $300,000", "$300,000 - $400,000", "$400,000 - $500,000", "$500,000 - $750,000",
  "$750,000 - $1,000,000", "$1,000,000 - $1,500,000", "$1,500,000 - $2,000,000", "$2,000,000+"
];

export default function QuickQuoteForm() {
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    loan_amount: "", property_value: "", loan_type: "", credit_score: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    await base44.entities.ContactSubmission.create({
      ...form,
      form_type: "quick_quote",
    });
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h3>
        <p className="text-slate-600">We'll get back to you shortly with your custom quote.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Get a Quick Quote</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>First Name *</Label>
          <Input required value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} />
        </div>
        <div>
          <Label>Last Name *</Label>
          <Input required value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} />
        </div>
        <div>
          <Label>Email *</Label>
          <Input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
        </div>
        <div>
          <Label>Phone *</Label>
          <Input type="tel" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
        </div>
        <div>
          <Label>Loan Amount</Label>
          <Select value={form.loan_amount} onValueChange={(v) => setForm({...form, loan_amount: v})}>
            <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
            <SelectContent>
              {loanAmounts.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Property Value</Label>
          <Select value={form.property_value} onValueChange={(v) => setForm({...form, property_value: v})}>
            <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
            <SelectContent>
              {loanAmounts.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Loan Type</Label>
          <Select value={form.loan_type} onValueChange={(v) => setForm({...form, loan_type: v})}>
            <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
            <SelectContent>
              {["Purchase", "Refinance", "Debt Consolidation", "Home Equity"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Credit Score</Label>
          <Select value={form.credit_score} onValueChange={(v) => setForm({...form, credit_score: v})}>
            <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
            <SelectContent>
              {["Excellent", "Good", "Fair", "Poor"].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 flex items-start gap-2 mt-2">
          <Checkbox checked={agreed} onCheckedChange={setAgreed} id="consent" />
          <label htmlFor="consent" className="text-xs text-slate-500 leading-relaxed">
            I agree to receive marketing and customer service calls and text messages from BuyWiser. 
            Msg/data rates may apply. Msg frequency varies. Reply STOP to unsubscribe.
          </label>
        </div>
        <div className="md:col-span-2 text-xs text-slate-400 leading-relaxed">
          By providing your phone number and/or email and clicking "Submit" you agree to our 
          Terms of Service and Privacy Policy and consent to receive marketing communications from 
          Buywiser Technology Inc via text, call, or email, including automated messages.
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={loading || !agreed} className="bg-green-600 hover:bg-green-700 text-white px-8">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}