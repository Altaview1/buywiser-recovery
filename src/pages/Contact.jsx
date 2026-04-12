import { useState } from "react";
import { usePageTitle } from "@/lib/usePageTitle";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2, Phone, Mail, Shield, Zap, ArrowRight } from "lucide-react";

const loanGoals = [
  "Lower my monthly payment",
  "FHA Streamline refinance",
  "VA Streamline / IRRRL",
  "Cash-out / access home equity",
  "Home purchase / preapproval",
  "Rate-and-term refinance",
  "Not sure — need guidance",
];

const trustItems = [
  "No cost, no obligation to proceed",
  "Straight answers — we tell you if it doesn't make sense",
  "Respond within one business day",
  "No pressure, ever",
];

export default function Contact() {
  usePageTitle('Contact BuyWiser | BuyWiser Home Loans');
  const [form, setForm] = useState({
    first_name: "", last_name: "", phone: "", email: "",
    loan_type: "", comments: "",
  });
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.ContactSubmission.create({
      ...form,
      form_type: "contact",
      status: "new",
      comments: `Property City: ${city || "Not provided"}\nLoan Goal: ${form.loan_type || "Not specified"}\n\n${form.comments}`,
    });
    await base44.integrations.Core.SendEmail({
      to: "bennett@buywiser.com",
      from_name: "BuyWiser Home Loans",
      subject: `New Mortgage Review Request — ${form.first_name} ${form.last_name}`,
      body: `A new mortgage review request was submitted.\n\nName: ${form.first_name} ${form.last_name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCity: ${city || "Not provided"}\nLoan Goal: ${form.loan_type || "Not specified"}\n\nComments:\n${form.comments}`,
    });
    await base44.functions.invoke('sendSMS', {
      message: `New BuyWiser inquiry: ${form.first_name} ${form.last_name} | ${form.phone} | ${form.email} | ${form.loan_type || 'No goal specified'}`,
    }).catch(() => {});
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-white">
      <section className="bg-slate-950 text-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            Straight Answers · No Pressure
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Request a Mortgage Review
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            Tell us about your situation. We'll review it and come back with a direct, honest assessment of your options — no sales pitch, no obligation.
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4">What to Expect</h2>
                <div className="space-y-3">
                  {trustItems.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle className="h-4 w-4 text-blue-700 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4">Contact Directly</h2>
                <div className="space-y-4">
                  <a href="tel:+18183002642" className="flex items-start gap-3 group">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="h-4 w-4 text-blue-700" /></div>
                    <div><p className="text-xs text-slate-500 font-medium mb-0.5">Phone</p><p className="text-sm font-bold text-blue-700 group-hover:text-blue-800 transition">(818) 300-2642</p></div>
                  </a>
                  <a href="mailto:bennett@buywiser.com" className="flex items-start gap-3 group">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="h-4 w-4 text-blue-700" /></div>
                    <div><p className="text-xs text-slate-500 font-medium mb-0.5">Email</p><p className="text-sm font-bold text-blue-700 group-hover:text-blue-800 transition">bennett@buywiser.com</p></div>
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-1.5 mb-3"><Shield className="h-4 w-4 text-blue-700" /><p className="font-bold text-slate-900 text-xs uppercase tracking-widest">Licensing</p></div>
                <div className="space-y-1 text-xs text-slate-600">
                  <p>BuyWiser Technology, Inc.</p>
                  <p>DBA BuyWiser Home Loans</p>
                  <p className="mt-1.5">Company NMLS: <span className="font-semibold text-slate-800">1887767</span></p>
                  <p>Personal NMLS: <span className="font-semibold text-slate-800">1524446</span></p>
                  <p className="mt-1.5 text-slate-500">Licensed in California — DFPI / CRMLA</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-blue-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received</h3>
                  <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                    Thank you. We'll review your information and follow up within one business day with a clear, honest response about your options.
                  </p>
                  <p className="text-sm text-slate-500 mt-4">Questions in the meantime? Call <a href="tel:+18183002642" className="text-blue-700 font-semibold">(818) 300-2642</a></p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 md:px-8 pt-6 md:pt-8 pb-5 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-1"><Zap className="h-4 w-4 text-blue-700" /><p className="text-xs font-bold text-blue-700 uppercase tracking-widest">No Cost · No Obligation</p></div>
                    <h2 className="text-xl font-bold text-slate-900">Your Mortgage Review Request</h2>
                  </div>
                  <div className="px-6 md:px-8 py-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">First Name *</label>
                        <Input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="First name" className="h-11" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Last Name *</label>
                        <Input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Last name" className="h-11" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address *</label>
                        <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" className="h-11" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Phone Number *</label>
                        <Input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(818) 555-0100" className="h-11" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Property City</label>
                        <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Glendale, Burbank, Pasadena" className="h-11" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">What Are You Looking to Do?</label>
                        <Select value={form.loan_type} onValueChange={(v) => setForm({ ...form, loan_type: v })}>
                          <SelectTrigger className="h-11"><SelectValue placeholder="Select your goal" /></SelectTrigger>
                          <SelectContent>{loanGoals.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Anything Else We Should Know?</label>
                      <Textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} placeholder="Current loan type, approximate balance, how long you've been in the home, or any questions you have." rows={4} className="resize-none" />
                    </div>
                    <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 flex items-start gap-2">
                      <Shield className="h-4 w-4 text-blue-700 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-500 leading-relaxed">Your information is used only to respond to your inquiry. We don't sell data. By submitting, you consent to be contacted about your mortgage request.</p>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-blue-800 hover:bg-blue-900 text-white py-5 text-base font-bold rounded-xl">
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending...</> : <>Request a Mortgage Review <ArrowRight className="h-4 w-4 ml-2" /></>}
                    </Button>
                    <p className="text-xs text-slate-400 text-center pb-1">No cost. No obligation. Straight answers.</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}