import { useState } from "react";
import { usePageTitle } from "@/lib/usePageTitle";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  CheckCircle, ArrowRight, Phone, Star,
  TrendingDown, DollarSign, Key, Shield, Award, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const refinanceOptions = [
  {
    icon: TrendingDown,
    title: "Lower Your Monthly Payment",
    desc: "We calculate your actual break-even, model your real savings, and tell you whether the numbers make sense before you commit to anything.",
    path: "Refinance",
    badge: "Most Requested",
  },
  {
    icon: Shield,
    title: "FHA Streamline Refinance",
    desc: "Already have an FHA loan? You may qualify to reduce your payment with minimal documentation — no appraisal required in most cases.",
    path: "FHAStreamline",
    badge: "Fast Path",
  },
  {
    icon: Award,
    title: "VA Streamline / IRRRL",
    desc: "Eligible veterans may be able to lower their rate with a simplified process. Less paperwork, no appraisal in most cases.",
    path: "VAStreamline",
    badge: "Veteran Benefit",
  },
  {
    icon: DollarSign,
    title: "Cash-Out / Equity Access",
    desc: "Your equity can work for you — remodeling, debt consolidation, reserves. We compare options and explain the trade-offs honestly.",
    path: "CashOut",
    badge: null,
  },
  {
    icon: Key,
    title: "Home Purchase",
    desc: "Preapproval guidance and loan strategy for California buyers who want clear answers before making an offer.",
    path: "Purchase",
    badge: null,
  },
];

const trustPoints = [
  "No pressure, ever",
  "Straight answers in plain language",
  "Real numbers, not estimates",
  "NMLS Licensed in California",
];

const testimonials = [
  {
    name: "Sandra K.",
    situation: "FHA Streamline — Van Nuys, CA",
    stars: 5,
    text: "My payment dropped over $200 a month. Bennett walked me through every step and we closed faster than I expected. Wish I had done it sooner.",
  },
  {
    name: "Patricia L.",
    situation: "VA IRRRL — Burbank, CA",
    stars: 5,
    text: "As a veteran I've dealt with lenders who treat VA loans like a hassle. Bennett was the opposite — clear, direct, and got it done with minimal paperwork.",
  },
  {
    name: "Marcus & Denise T.",
    situation: "Cash-Out Refinance — Encino, CA",
    stars: 5,
    text: "He didn't push us toward anything. Explained our options, showed us the math, and helped us make a decision we feel really good about.",
  },
];

const refiBrief = [
  {
    q: "Rates are higher than when I bought. Should I refinance?",
    a: "Probably not for a rate reduction — but you may still have options worth reviewing, including equity access or loan restructuring.",
  },
  {
    q: "I have an FHA loan I haven't touched in years.",
    a: "If you haven't reviewed it recently, there's a real chance a Streamline refinance could lower your payment with minimal documentation.",
  },
  {
    q: "I'm a veteran with a VA loan. Should I look at an IRRRL?",
    a: "If your current rate is above market, the answer is likely yes — and the process is simpler than most people expect.",
  },
  {
    q: "I have a lot of equity. Should I cash-out?",
    a: "That depends on what you'd use it for and what it would cost you. We'll walk through the actual numbers, not a sales pitch.",
  },
];

const steps = [
  { num: "1", title: "Request a Review", desc: "Share your situation — current loan, goals, property city." },
  { num: "2", title: "We Run the Numbers", desc: "Real analysis: break-even, monthly savings, total cost. No estimates." },
  { num: "3", title: "You Decide", desc: "No pressure. You'll have everything you need to make the right call." },
];

export default function HomePage() {
  const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "", phone: "", comments: "" });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: (data) => base44.entities.ContactSubmission.create({ ...data, form_type: "contact", status: "new" }),
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ first_name: "", last_name: "", email: "", phone: "", comments: "" });
    },
  });

  usePageTitle('BuyWiser Home Loans | California Mortgage Guidance');

  return (
    <div className="bg-white">
      {/* ── HERO ── */}
      <section className="bg-slate-950 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1800&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/80" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            {/* Left: Copy */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                California Mortgage · Straight Answers · No Pressure
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none tracking-tight mb-5">
                Lower Your Payment.<br />
                <span className="text-green-400">Access Your Equity.</span><br />
                Get a Straight Answer.
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-4 max-w-xl">
                We help California homeowners evaluate refinance options — FHA Streamline, VA Streamline, rate-and-term, and cash-out — with real numbers and no sales pressure.
              </p>
              <p className="text-sm text-slate-400 mb-8">
                Not sure if refinancing makes sense? That's exactly why we're here. We'll tell you honestly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={createPageUrl('ContactUs')}
                  className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition shadow-lg text-base"
                >
                  Request a Mortgage Review <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="tel:+18183002642"
                  className="inline-flex items-center justify-center px-8 py-4 border border-slate-600 text-slate-200 rounded-xl font-semibold hover:bg-white/5 transition text-base gap-2"
                >
                  <Phone className="h-4 w-4" /> (818) 300-2642
                </a>
              </div>
            </div>

            {/* Right: Trust Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-6">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4">Why borrowers choose us</p>
                <div className="space-y-3">
                  {trustPoints.map((point) => (
                    <div key={point} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-slate-200 text-sm font-medium">{point}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                    <span className="text-xs text-slate-400 ml-1">California borrowers</span>
                  </div>
                  <p className="text-xs text-slate-400 italic">"He told us honestly when it didn't make sense and helped us when it did."</p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-500 space-y-0.5">
                  <p>Company NMLS: 1887767 · Personal NMLS: 1524446</p>
                  <p>Licensed · California DFPI / CRMLA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> FHA Streamline Specialist</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> VA IRRRL Eligible Lender</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> California Cash-Out Options</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> NMLS #1887767 · Licensed in CA</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-500" /> No Pressure · No Obligation</span>
          </div>
        </div>
      </section>

      {/* ── SHOULD YOU REFINANCE? ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-green-700 uppercase tracking-widest mb-3">
              <Zap className="h-3.5 w-3.5" /> Straight Answers
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Should You Refinance Right Now?
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Depends on your loan type, current rate, how long you'll stay, and what you're trying to accomplish. Here's a quick read on common situations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {refiBrief.map((item, i) => (
              <div key={i} className="bg-slate-50 border border-gray-200 rounded-2xl p-5 hover:border-green-300 transition">
                <p className="font-bold text-slate-900 text-sm mb-2">{item.q}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link to={createPageUrl('ContactUs')} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition text-sm">
              Request a Mortgage Review <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── LOAN OPTIONS ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Refinance & Loan Options</h2>
            <p className="text-slate-600 max-w-xl mx-auto">We specialize in helping California homeowners find the right path — whether that's a rate reduction, streamline refinance, equity access, or a new purchase.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {refinanceOptions.map((opt) => (
              <Link
                key={opt.path}
                to={createPageUrl(opt.path)}
                className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:border-green-400 hover:shadow-lg transition-all"
              >
                {opt.badge && (
                  <span className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                    {opt.badge}
                  </span>
                )}
                <div className="w-11 h-11 bg-slate-100 group-hover:bg-green-100 rounded-xl flex items-center justify-center mb-4 transition">
                  <opt.icon className="h-5 w-5 text-slate-500 group-hover:text-green-700 transition" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-base group-hover:text-green-700 transition">{opt.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{opt.desc}</p>
                <span className="text-green-700 text-sm font-semibold flex items-center gap-1">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">How a Mortgage Review Works</h2>
            <p className="text-slate-600 text-sm">Three steps. No fluff.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-extrabold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to={createPageUrl('ContactUs')} className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-md">
              Request a Mortgage Review <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-1">What Borrowers Say</h2>
              <p className="text-slate-500 text-sm">Real California homeowners. Real results.</p>
            </div>
            <Link to={createPageUrl('Reviews')} className="text-green-700 text-sm font-semibold hover:underline flex items-center gap-1">
              All reviews <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="pt-3 border-t border-gray-100">
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-green-700 text-xs font-medium mt-0.5">{t.situation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section id="request" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Copy */}
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-green-700 uppercase tracking-widest mb-3">
                <Zap className="h-3.5 w-3.5" /> No Obligation
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Request a Mortgage Review</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">
                Tell us about your situation and what you're trying to accomplish. We'll review it and come back with a straight answer — what makes sense, what doesn't, and why.
              </p>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" /> No cost, no obligation</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" /> Respond within one business day</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" /> Real numbers, not estimates</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" /> No pressure, ever</div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-slate-500 font-semibold mb-2">Prefer to call?</p>
                <a href="tel:+18183002642" className="flex items-center gap-2 text-green-700 font-bold hover:text-green-800 transition">
                  <Phone className="h-4 w-4" /> (818) 300-2642
                </a>
                <a href="mailto:bennett@buywiser.com" className="block text-xs text-slate-500 mt-1 hover:text-slate-700">bennett@buywiser.com</a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received</h3>
                  <p className="text-slate-600 text-sm">We'll review your information and follow up within one business day with a clear, direct response.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); submitMutation.mutate(formData); }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">First Name *</label>
                      <Input required value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} placeholder="First name" className="h-11" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Last Name *</label>
                      <Input required value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} placeholder="Last name" className="h-11" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email *</label>
                      <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@email.com" className="h-11" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Phone *</label>
                      <Input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="(818) 555-0100" className="h-11" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">What are you looking to accomplish?</label>
                    <Textarea
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      placeholder="e.g. I have an FHA loan and want to know if I can lower my payment. Or: I have equity and want to explore cash-out options."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" disabled={submitMutation.isPending} className="w-full bg-green-600 hover:bg-green-500 text-white py-5 text-base font-bold rounded-xl">
                    {submitMutation.isPending ? "Sending..." : "Request a Mortgage Review →"}
                  </Button>
                  <p className="text-xs text-slate-400 text-center">No cost. No obligation. No pressure. Ever.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ── */}
      <section className="bg-slate-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">Straight Answers · No Pressure · No Obligation</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Ready to See What Your Options Look Like?</h2>
          <p className="text-slate-400 mb-7 text-lg max-w-xl mx-auto">
            We look at real numbers and tell you honestly what makes sense — whether that's refinancing now, waiting, or using your equity differently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('ContactUs')} className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition shadow-md text-base">
              Request a Mortgage Review
            </Link>
            <a href="tel:+18183002642" className="px-8 py-4 border border-slate-700 text-slate-200 rounded-xl font-bold hover:bg-white/5 transition flex items-center justify-center gap-2 text-base">
              <Phone className="h-4 w-4" /> (818) 300-2642
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}