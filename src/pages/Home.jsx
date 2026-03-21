import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle, ArrowRight, Shield, Award, Clock, Users, Phone, Star, TrendingDown, DollarSign, Key, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const services = [
  {
    icon: TrendingDown,
    title: "Refinance",
    desc: "Lower your monthly payment or change your loan term. We evaluate whether refinancing actually improves your situation.",
    path: "Refinance",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "FHA Streamline",
    desc: "Already have an FHA loan? A streamlined refinance may reduce your payment with less documentation.",
    path: "FHAStreamline",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Award,
    title: "VA Streamline",
    desc: "Eligible VA borrowers may qualify for a simplified IRRRL refinance with reduced documentation requirements.",
    path: "VAStreamline",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: DollarSign,
    title: "Cash-Out Options",
    desc: "Your equity can work for you. We help you compare cash-out refinance vs. home equity options strategically.",
    path: "CashOut",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Key,
    title: "Home Purchase",
    desc: "Preapproval guidance and loan strategy for buyers who want clear answers before making an offer.",
    path: "Purchase",
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
];

const whyPoints = [
  { icon: CheckCircle, text: "Clear explanations in plain language — no jargon" },
  { icon: CheckCircle, text: "Personalized guidance based on your actual numbers" },
  { icon: CheckCircle, text: "Experience with complex scenarios, self-employed borrowers, and equity situations" },
  { icon: CheckCircle, text: "Responsive communication — you get real answers, not voicemail" },
  { icon: CheckCircle, text: "California-focused expertise across purchase and refinance" },
];

const testimonials = [
  {
    name: "Sandra K.",
    situation: "FHA Streamline Refinance",
    text: "I had been paying too much on my FHA loan for years and didn't realize I could refinance so easily. Bennett walked me through the whole process and we closed faster than I expected. My payment dropped over $200 a month.",
    stars: 5,
  },
  {
    name: "Marcus & Denise T.",
    situation: "Cash-Out Refinance",
    text: "We had a lot of equity built up but weren't sure what to do with it. Bennett explained our options honestly — including some we weren't considering. He didn't push us toward anything and we ended up making the right call.",
    stars: 5,
  },
  {
    name: "Jorge R.",
    situation: "Home Purchase",
    text: "First-time buyer, and I had no idea where to start. Bennett got us preapproved quickly and explained what we actually qualified for and why. We closed in 28 days. Couldn't have asked for better guidance.",
    stars: 5,
  },
];

const steps = [
  { num: "1", title: "Request a Mortgage Review", desc: "Share some basic details about your situation — current loan, goals, and property info." },
  { num: "2", title: "We Analyze Your Options", desc: "We run the actual numbers and present the scenarios that make sense — and the ones that don't." },
  { num: "3", title: "You Decide With Confidence", desc: "No pressure, no confusion. You'll have the information to make the right move for your situation." },
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

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wide">
              California Mortgage Experts
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Lower Your Payment.<br />
              <span className="text-green-400">Access Your Equity.</span><br />
              Get Straight Answers.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              California mortgage guidance for refinancing, FHA and VA Streamlines, cash-out options, and home purchase financing. We tell you what actually makes sense for your situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl('ContactUs')} className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-lg text-base">
                Request a Mortgage Review <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to={createPageUrl('Refinance')} className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-600 text-slate-200 rounded-lg font-semibold hover:bg-white/10 hover:border-slate-400 transition text-base">
                Explore Refinance Options
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-green-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "California Mortgage Expertise" },
              { label: "Personalized Guidance" },
              { label: "Responsive Communication" },
              { label: "Real Human Help" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4 text-green-200 flex-shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Help With */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">What We Help With</h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">Whether you're looking to refinance or buy, we help you evaluate your options clearly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <Link key={s.path} to={createPageUrl(s.path)} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-md transition-all">
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <s.icon className={`h-6 w-6 ${s.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-green-700 transition">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">{s.desc}</p>
                <span className="text-green-600 text-sm font-semibold flex items-center gap-1">Learn more <ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why BuyWiser */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Borrowers Choose BuyWiser</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Most borrowers don't need more confusing options. They need someone who can look at their specific situation and tell them what actually makes sense. That's what we do.
              </p>
              <div className="space-y-4">
                {whyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{point.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to={createPageUrl('About')} className="inline-flex items-center gap-1 text-green-700 font-semibold hover:text-green-800 transition">
                  Learn about our approach <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: "NMLS Licensed", sub: "California Regulated", icon: Shield },
                  { label: "Experience", sub: "Complex Scenarios Welcome", icon: Award },
                  { label: "Response Time", sub: "Real Answers, Not Voicemail", icon: Clock },
                  { label: "Borrower-First", sub: "No Pressure, Ever", icon: Users },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-xl p-4">
                    <item.icon className="h-5 w-5 text-green-600 mb-2" />
                    <p className="font-bold text-slate-900 text-sm">{item.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-gray-100 text-xs text-slate-500">
                <p>NMLS Company: 1887767 · Personal: 1524446</p>
                <p className="mt-0.5">Licensed in California — DFPI / CRMLA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refinance Honest Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Not Every Refinance Makes Sense.<br />
              <span className="text-green-600">We'll Tell You Honestly.</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Some borrowers should refinance now. Some should wait for rates to move. Others are better served using their equity strategically rather than chasing a rate reduction alone.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              We run the actual numbers for your situation — break-even timelines, total cost comparison, payment impact — so you can make an informed decision rather than guessing.
            </p>
            <Link to={createPageUrl('Refinance')} className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition">
              Review My Refinance Options <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-600">Three straightforward steps from inquiry to decision.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 relative">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">{step.num}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-9 -right-4 z-10 text-slate-300">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">What Borrowers Say</h2>
            <Link to={createPageUrl('Reviews')} className="text-green-600 text-sm font-semibold hover:underline">View all reviews →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.situation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Request a Mortgage Review</h2>
            <p className="text-slate-600">No obligation. No pressure. Just a clear conversation about your options.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-10">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You</h3>
                <p className="text-slate-600">We'll be in touch shortly — typically within one business day.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); submitMutation.mutate(formData); }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name *</label>
                    <Input required value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} placeholder="First name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name *</label>
                    <Input required value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} placeholder="Last name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                    <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone *</label>
                    <Input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="(818) 555-0100" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">What are you looking to do?</label>
                  <Textarea value={formData.comments} onChange={(e) => setFormData({ ...formData, comments: e.target.value })} placeholder="Tell us briefly about your current situation and what you're hoping to accomplish." rows={3} />
                </div>
                <Button type="submit" disabled={submitMutation.isPending} className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base font-semibold">
                  {submitMutation.isPending ? "Sending..." : "Request My Mortgage Review"}
                </Button>
                <p className="text-xs text-slate-500 text-center">By submitting, you agree to be contacted regarding your mortgage inquiry. No spam, ever.</p>
              </form>
            )}
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
            <div><p className="font-semibold text-slate-900 mb-0.5">Call Direct</p><a href="tel:+18183002642" className="text-slate-600 hover:text-green-600">(818) 300-2642</a></div>
            <div><p className="font-semibold text-slate-900 mb-0.5">Email</p><a href="mailto:bennett@buywiser.com" className="text-slate-600 hover:text-green-600">bennett@buywiser.com</a></div>
            <div><p className="font-semibold text-slate-900 mb-0.5">Office</p><p className="text-slate-600">North Hollywood, CA 91601</p></div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="bg-green-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to Review Your Options?</h2>
          <p className="text-green-100 mb-6 text-lg">No pressure. No obligation. Just a direct conversation about what makes sense for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('ContactUs')} className="px-8 py-3.5 bg-white text-green-700 rounded-lg font-bold hover:bg-green-50 transition shadow-md">
              Request a Mortgage Review
            </Link>
            <a href="tel:+18183002642" className="px-8 py-3.5 border-2 border-green-400 text-white rounded-lg font-bold hover:bg-green-500 transition flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />(818) 300-2642
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}