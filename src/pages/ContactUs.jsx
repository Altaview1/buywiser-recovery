import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2, MapPin, Phone, Mail, Shield, Clock } from "lucide-react";

const loanGoals = [
  "Lower my monthly payment",
  "FHA Streamline refinance",
  "VA Streamline / IRRRL",
  "Cash-out / equity access",
  "Home purchase / preapproval",
  "Other / not sure yet",
];

export default function ContactUs() {
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
      comments: `Property City: ${city}\n\n${form.comments}`,
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">Contact Us</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Request a Mortgage Review</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            No obligation. No pressure. Share your situation and we'll come back with a clear, honest assessment of your options.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-green-700" />
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="font-medium text-slate-800 mb-0.5">Office Address</p>
                      <p>5115 Lankershim Blvd #705</p>
                      <p>North Hollywood, CA 91601</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-green-700" />
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="font-medium text-slate-800 mb-0.5">Phone</p>
                      <a href="tel:+18183002642" className="hover:text-green-700 transition">(818) 300-2642</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-green-700" />
                    </div>
                    <div className="text-sm text-slate-600">
                      <p className="font-medium text-slate-800 mb-0.5">Email</p>
                      <a href="mailto:bennett@buywiser.com" className="hover:text-green-700 transition">bennett@buywiser.com</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-slate-900 mb-3 text-sm">Licensing & Compliance</h3>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-green-600" />Company NMLS: 1887767</div>
                  <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-green-600" />Personal NMLS: 1524446</div>
                  <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-green-600" />Licensed in California — DFPI / CRMLA</div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-green-700" />
                  <p className="font-semibold text-green-900 text-sm">Response Time</p>
                </div>
                <p className="text-sm text-green-800">We typically respond within one business day. For urgent questions, call directly at (818) 300-2642.</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received</h3>
                  <p className="text-slate-600">Thank you. We'll review your information and follow up within one business day with a clear, direct response about your situation.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Your Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-slate-700">First Name *</Label>
                      <Input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} placeholder="First name" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-slate-700">Last Name *</Label>
                      <Input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="Last name" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-slate-700">Email *</Label>
                      <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-slate-700">Phone *</Label>
                      <Input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(818) 555-0100" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-slate-700">Property City</Label>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Burbank, Glendale, Pasadena" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-slate-700">Loan Goal</Label>
                      <Select value={form.loan_type} onValueChange={(v) => setForm({ ...form, loan_type: v })}>
                        <SelectTrigger><SelectValue placeholder="Select what you're looking to do" /></SelectTrigger>
                        <SelectContent>
                          {loanGoals.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mb-5">
                    <Label className="mb-1.5 block text-sm font-medium text-slate-700">Message (optional)</Label>
                    <Textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} placeholder="Tell us briefly about your current situation, what you're hoping to accomplish, or any questions you have." rows={4} />
                  </div>

                  <div className="flex items-start gap-2 mb-5 bg-slate-50 rounded-xl p-3 border border-gray-200">
                    <Shield className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600">
                      Your information is kept private and used only to respond to your inquiry. By submitting, you consent to be contacted about your mortgage request. You can opt out at any time.
                    </p>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base font-semibold">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending...</> : "Request My Mortgage Review"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}