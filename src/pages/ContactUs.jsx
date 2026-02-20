import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Loader2, MapPin, Phone, Mail } from "lucide-react";

export default function ContactUs() {
  const [form, setForm] = useState({
    first_name: "", last_name: "", phone: "", email: "", comments: "", how_heard: "",
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
      form_type: "contact",
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div>
      {/* Banner */}
      <div
        className="h-56 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-800/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-800 mb-8 text-center">Contact Us</h1>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-slate-700 text-sm font-medium">5115 Lankershim Blvd #705</p>
            <p className="text-slate-500 text-sm">North Hollywood, CA 91601</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-slate-700 text-sm font-medium">(818) 300-2642</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-slate-700 text-sm font-medium">bennett@buywiser.com</p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center max-w-xl mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h3>
            <p className="text-slate-600">We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input required value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input required value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} />
              </div>
              <div>
                <Label>Mobile Phone *</Label>
                <Input type="tel" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
              </div>
              <div className="md:col-span-1">
                <Label>Your Comments *</Label>
                <Textarea required value={form.comments} onChange={(e) => setForm({...form, comments: e.target.value})} rows={4} />
              </div>
              <div className="md:col-span-1">
                <Label>How did you hear about us?</Label>
                <Textarea value={form.how_heard} onChange={(e) => setForm({...form, how_heard: e.target.value})} rows={4} />
              </div>
            </div>
            <div className="flex items-start gap-2 mt-4">
              <Checkbox checked={agreed} onCheckedChange={setAgreed} id="consent-contact" />
              <label htmlFor="consent-contact" className="text-xs text-slate-500 leading-relaxed">
                I agree to receive marketing and customer service calls and text messages from BuyWiser. 
                Msg/data rates may apply. Msg frequency varies. Reply STOP to unsubscribe.
              </label>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              By providing your phone number and/or email and clicking "Submit" you agree to our 
              Terms of Service and Privacy Policy and consent to receive marketing communications.
            </p>
            <Button type="submit" disabled={loading || !agreed} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-8">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}