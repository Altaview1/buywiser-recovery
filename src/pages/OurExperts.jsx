import { useState, useEffect } from "react";
import { Phone, Star, Shield, Award, CheckCircle, ArrowRight, Search, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const EXPERTS = [
  {
    id: "bennett",
    name: "Bennett Liss",
    title: "Lead Mortgage Expert · Founder, BuyWiser Home Loans",
    emoji: "🏦",
    bgColor: "bg-amber-50 border-amber-200",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    category: "Mortgage Services — Statewide",
    experience: "30+ Years",
    since: "1991",
    rating: 5.0,
    reviews: 300,
    certifications: [
      "NMLS #1524446",
      "CA DRE License #01107013",
      "Company NMLS #1887767",
      "CA DFPI CRMLA Licensed",
    ],
    specialties: ["VA Loans", "FHA Streamline", "Conventional", "Jumbo", "Cash-Out Refinance"],
    bio: "Bennett has spent 30 years helping California homebuyers and homeowners navigate the mortgage landscape. As the founder of BuyWiser Home Loans, he brings institutional knowledge of every market cycle since the early 1990s — from first-time buyers to complex jumbo transactions. Our mortgage brokerage is statewide — Bennett's team handles all SmartBuy™ mortgage guidance regardless of your property location.",
    phone: "tel:+18183002642",
    phoneLabel: "(818) 300-2642",
    phases: ["Mortgage", "Pre-Offer"],
    statewide: true,
    available: true,
  },
  {
    id: "buyer-agent",
    name: "Compass Partner Agents",
    title: "Licensed CA Buyer's Agent Network",
    emoji: "🏡",
    bgColor: "bg-slate-50 border-slate-200",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-300",
    category: "Real Estate Services — Market-Specific",
    experience: "12+ Years Avg",
    since: "Top CA Markets",
    rating: 4.8,
    reviews: 214,
    certifications: [
      "CA DRE Licensed",
      "NAR Member",
      "Compass Certified",
      "Local Market Specialist",
    ],
    specialties: ["Offer Negotiation", "Buyer Representation", "Market Analysis", "Tour Scheduling", "Contract Review"],
    bio: "Our Compass partner agents are vetted local market experts available when you choose to unlock buyer agent support on SmartBuy™. Each zip code is served by agents who specialize in that specific neighborhood. They are assigned within 4 hours of an unlock request, matched to your exact property location. All agents are independently licensed and carry full E&O insurance.",
    phone: null,
    phoneLabel: null,
    phases: ["Pre-Offer", "Inspection", "Closing"],
    zipCodeSpecific: true,
    available: true,
  },
  {
    id: "structural",
    name: "Structural Engineering Panel",
    title: "Licensed CA Structural Engineers",
    emoji: "🏗️",
    bgColor: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    category: "Inspection Services — Market-Specific",
    experience: "15+ Years Avg",
    since: "CA PE Licensed",
    rating: 4.9,
    reviews: 61,
    certifications: [
      "CA Professional Engineer (PE)",
      "Licensed Structural Engineer",
      "ASCE Member",
      "Seismic Assessment Certified",
    ],
    specialties: ["Foundation Inspection", "Seismic Risk", "Load-Bearing Review", "Hillside Properties", "Settlement Analysis"],
    bio: "For properties with foundation concerns, hillside exposure, or potential settlement issues, our licensed structural engineering panel provides full PE-stamped reports. Engineers are matched by zip code to specialize in the unique geological and seismic conditions of your specific area — from liquefaction zones and canyon lots to expansive soil sites.",
    phone: null,
    phoneLabel: null,
    phases: ["Inspection"],
    zipCodeSpecific: true,
    available: true,
  },
  {
    id: "appraisers",
    name: "Certified Appraisal Network",
    title: "CA-Certified Real Estate Appraisers",
    emoji: "📊",
    bgColor: "bg-purple-50 border-purple-200",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    category: "Appraisal Services — Market-Specific",
    experience: "12+ Years Avg",
    since: "USPAP Compliant",
    rating: 4.8,
    reviews: 142,
    certifications: [
      "CA Certified Residential Appraiser",
      "USPAP Compliant",
      "FHA/VA Approved",
      "Complex Property Specialist",
    ],
    specialties: ["Standard Appraisal", "Rush Appraisal", "Complex Properties", "Luxury / Estate", "Reconsideration of Value"],
    bio: "Our appraisal panel includes CA-certified general and residential appraisers matched to your zip code and market. All appraisers are FHA and VA approved, carry E&O insurance, and operate fully USPAP-compliant. Appraisers are selected for their expertise in your specific neighborhood to ensure accurate valuations. Rush scheduling (2–3 business days) is available for time-sensitive transactions.",
    phone: null,
    phoneLabel: null,
    phases: ["Pre-Offer", "Appraisal"],
    zipCodeSpecific: true,
    available: true,
  },
  {
    id: "legal",
    name: "RE Law Firm Partner",
    title: "Licensed CA Real Estate Attorneys",
    emoji: "⚖️",
    bgColor: "bg-indigo-50 border-indigo-200",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    category: "Legal Services — Market-Specific",
    experience: "18+ Years Avg",
    since: "CA State Bar",
    rating: 4.9,
    reviews: 77,
    certifications: [
      "CA State Bar Licensed",
      "Real Estate Law Specialist",
      "ABA Member",
      "Title & Escrow Expert",
    ],
    specialties: ["Contract Review", "Title Disputes", "Disclosure Issues", "Easements", "Purchase Agreement Analysis"],
    bio: "Our legal counsel partners are licensed California real estate attorneys matched to your local market, with specialization in purchase transactions, title review, contract disputes, and disclosure compliance. Each market's attorneys are familiar with local HOA regulations, disclosure requirements, and title patterns. Legal review is delivered within 1 business day, and attorneys are available for follow-up calls to walk you through any issues identified.",
    phone: null,
    phoneLabel: null,
    phases: ["Pre-Offer", "Inspection", "Closing"],
    zipCodeSpecific: true,
    available: true,
  },
  {
    id: "inspectors",
    name: "Licensed Home Inspection Panel",
    title: "Multi-Discipline CA Inspectors",
    emoji: "🔬",
    bgColor: "bg-green-50 border-green-200",
    badgeColor: "bg-green-100 text-green-800 border-green-200",
    category: "Inspection Services — Market-Specific",
    experience: "10+ Years Avg",
    since: "CA Licensed",
    rating: 4.7,
    reviews: 312,
    certifications: [
      "CA Licensed Pest Control (CPCO)",
      "NATE Certified (HVAC)",
      "CSIA Certified (Chimney)",
      "ACAC Certified (Mold)",
      "HAAG Certified (Roof)",
    ],
    specialties: ["General Home Inspection", "Pest / WDO", "Roof", "HVAC", "Mold", "Chimney", "Sewer Scope", "Electrical & Plumbing"],
    bio: "Our inspection panel spans every discipline needed in a California real estate transaction — from standard WDO pest inspections (required for most CA transactions) to specialized mold, chimney, and geological assessments. Inspectors are matched to your zip code to understand local building codes, common issues in your market, and neighborhood-specific risks. Every inspector is licensed, insured, and has agreed to the SmartBuy™ Vendor Terms backing the Token Rewind™ guarantee.",
    phone: null,
    phoneLabel: null,
    phases: ["Inspection"],
    zipCodeSpecific: true,
    available: true,
  },
  {
    id: "movers",
    name: "Vetted Moving Partners",
    title: "CA-Licensed Moving Companies",
    emoji: "📦",
    bgColor: "bg-orange-50 border-orange-200",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    category: "Moving Services — Market-Specific",
    experience: "8+ Years Avg",
    since: "AMSA Member",
    rating: 4.6,
    reviews: 187,
    certifications: [
      "CA Licensed Mover (MTR)",
      "AMSA Member",
      "Fully Insured & Bonded",
      "Background Checked Crews",
    ],
    specialties: ["Local Moves", "Full-Service Packing", "White Glove Moving", "Storage Coordination", "Fine Art & Antiques"],
    bio: "All moving partners in the SmartBuy™ network hold California MTR mover licenses, carry full cargo and liability insurance, and are AMSA members. Moving companies are selected for their presence in your specific zip code and neighborhood. We run 3-quote competitive bidding so you always get fair pricing. Premium and white-glove options are available for high-value or luxury property moves.",
    phone: null,
    phoneLabel: null,
    phases: ["Closing", "Post-Close"],
    zipCodeSpecific: true,
    available: true,
  },
  {
    id: "cleaners",
    name: "Professional Cleaning Partners",
    title: "Insured Residential Cleaning Teams",
    emoji: "✨",
    bgColor: "bg-cyan-50 border-cyan-200",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
    category: "Cleaning Services — Market-Specific",
    experience: "6+ Years Avg",
    since: "Background Checked",
    rating: 4.7,
    reviews: 224,
    certifications: [
      "Fully Insured & Bonded",
      "Background Checked",
      "Luxury Home Certified (Premium Tier)",
      "Green Cleaning Certified",
    ],
    specialties: ["Move-In Deep Clean", "Move-Out Clean", "Deep Cleaning", "Luxury Property Cleaning", "Appliance & Cabinet Detail"],
    bio: "Our cleaning partners are background-checked, fully insured, and rated by prior SmartBuy™ clients. Teams are matched to your zip code and neighborhood. Standard move-in and move-out cleans can be scheduled within 1–2 business days of closing. For luxury properties, our white-glove cleaning tier uses specialist materials and a discreet, dedicated team familiar with high-end finishes.",
    phone: null,
    phoneLabel: null,
    phases: ["Closing", "Post-Close"],
    zipCodeSpecific: true,
    available: true,
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
      ))}
    </div>
  );
}

function ExpertCard({ expert }) {
  return (
    <div className={`rounded-2xl border ${expert.bgColor} p-6 flex flex-col h-full`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl shadow-sm flex-shrink-0">
            {expert.emoji}
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">{expert.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{expert.title}</p>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <StarRating rating={expert.rating} />
          <span className="text-xs font-bold text-slate-700">{expert.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({expert.reviews} reviews)</span>
        </div>
        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${expert.badgeColor}`}>
          {expert.category}
        </span>
        {expert.statewide && (
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300 bg-emerald-100 text-emerald-800">
            🌎 Statewide
          </span>
        )}
        {expert.zipCodeSpecific && (
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-300 bg-blue-100 text-blue-800">
            📍 Matched to Your Area
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="text-center bg-white/70 rounded-xl px-3 py-2 border border-white">
          <p className="text-sm font-black text-slate-900">{expert.experience}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Experience</p>
        </div>
        <div className="text-center bg-white/70 rounded-xl px-3 py-2 border border-white">
          <p className="text-sm font-black text-slate-900">{expert.since}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Licensed</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-xs text-slate-600 leading-relaxed mb-4 flex-1">{expert.bio}</p>

      {/* Certifications */}
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
          <Shield className="h-3 w-3" /> Certifications
        </p>
        <div className="flex flex-wrap gap-1.5">
          {expert.certifications.map(cert => (
            <div key={cert} className="flex items-center gap-1 text-[10px] text-slate-600 bg-white border border-slate-200 rounded-full px-2.5 py-0.5">
              <CheckCircle className="h-2.5 w-2.5 text-emerald-500" /> {cert}
            </div>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-5">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
          <Award className="h-3 w-3" /> Specialties
        </p>
        <div className="flex flex-wrap gap-1.5">
          {expert.specialties.map(s => (
            <span key={s} className="text-[10px] text-slate-500 bg-white/80 border border-slate-200 rounded-full px-2.5 py-0.5">{s}</span>
          ))}
        </div>
      </div>

      {/* Phases */}
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active In</p>
        <div className="flex flex-wrap gap-1.5">
          {expert.phases.map(p => (
            <span key={p} className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">{p}</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      {expert.phone ? (
        <a href={expert.phone}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm bg-amber-400 hover:bg-amber-300 text-slate-900 transition">
          <Phone className="h-4 w-4" /> {expert.phoneLabel}
        </a>
      ) : (
        <a href="/smartbuy"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm bg-slate-900 hover:bg-slate-800 text-white transition">
          Unlock via SmartBuy™ <ArrowRight className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

export default function OurExperts() {
  const [zipCode, setZipCode] = useState("");
  const [availableExpertIds, setAvailableExpertIds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearchZip = async () => {
    if (!zipCode.trim()) return;
    setLoading(true);
    try {
      const response = await base44.functions.invoke("getExpertsByZipCode", { zipCode: zipCode.trim() });
      setAvailableExpertIds(response.data.availableExperts || []);
    } catch (err) {
      console.error("Error fetching experts:", err);
      setAvailableExpertIds([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const filteredExperts = availableExpertIds ? EXPERTS.filter(e => availableExpertIds.includes(e.id)) : EXPERTS;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Nav */}
      <header className="px-4 sm:px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/smartbuy">
              <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto" />
            </a>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Our Experts</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/marketplace" className="hidden sm:block text-xs font-black text-slate-600 hover:text-slate-900 transition">Marketplace</a>
            <a href="/token-rewind" className="hidden sm:block text-xs font-black text-violet-600 hover:text-violet-700 transition">Token Rewind™</a>
            <a href="/smartbuy" className="px-5 py-2 bg-emerald-400 text-slate-900 text-sm font-black rounded-xl hover:bg-emerald-300 transition">
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Zip Code Search */}
      <section className="px-4 sm:px-6 py-12 bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-slate-200">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-black uppercase tracking-widest text-slate-600 text-center mb-3">Find Local Experts</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchZip()}
                placeholder="Enter property zip code..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearchZip}
              disabled={loading || !zipCode.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </button>
          </div>
          {searched && zipCode && (
            <p className="text-xs text-slate-600 mt-2 text-center">
              {availableExpertIds?.length || 0} expert{availableExpertIds?.length !== 1 ? 's' : ''} available in {zipCode}
            </p>
          )}
        </div>
      </section>

      {/* Hero */}
      <section className="px-4 sm:px-6 py-16 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 mb-5">
            <Award className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-xs font-black text-amber-700 uppercase tracking-widest">SmartBuy™ Professional Network</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 leading-tight">
            Your Experts
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-6 max-w-2xl mx-auto">
            Every professional in the SmartBuy™ network is independently licensed, insured, and bound by the Token Rewind™ guarantee. You unlock the expert you need, when you need them — no retainers, no pressure. <span className="font-semibold">Experts are matched to your zip code</span> so you get local market specialists — except our mortgage broker, which serves all of California.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <span className="text-lg">📍</span> <strong>Market-Specific Partners</strong> — matched by zip code for local expertise
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <span className="text-lg">🌎</span> <strong>Statewide Mortgage Broker</strong> — Bennett & BuyWiser serve all CA
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            {["All Independently Licensed", "Token Rewind™ Guaranteed", "Local Specialists", "Vetted & Insured"].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Grid */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {searched && availableExpertIds && availableExpertIds.length === 0 && (
            <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <p className="text-sm text-amber-900 font-semibold">No experts currently available in zip code {zipCode}</p>
              <p className="text-xs text-amber-700 mt-1">Check back soon as our partner network expands</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExperts.map(expert => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        </div>
      </section>

      {/* Token Rewind trust bar */}
      <section className="px-4 sm:px-6 py-12 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center flex-shrink-0 text-2xl">
              🔁
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 mb-0.5">Token Rewind™ — Every Expert, Every Service</p>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                All professionals in this network have signed the SmartBuy™ Vendor Terms & Conditions. If a service falls short, we replace the provider at no additional token cost — or refund your tokens in full.
              </p>
            </div>
          </div>
          <a href="/token-rewind"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl text-sm transition whitespace-nowrap">
            Learn More <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-8 border-t border-slate-200 bg-slate-50 text-center">
        <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
          BuyWiser Technology, Inc. DBA BuyWiser Home Loans · NMLS #1887767 · CA DRE #01107013 · CA DFPI CRMLA Licensed. Partner professionals are independently licensed and insured. SmartBuy™ is a private program — not a government benefit.{" "}
          <a href="/Disclosures" className="underline hover:text-slate-600 transition">Disclosures</a>
          {" · "}
          <a href="/PrivacyPolicy" className="underline hover:text-slate-600 transition">Privacy Policy</a>
        </p>
        <p className="text-[10px] text-slate-400 mt-2">© {new Date().getFullYear()} BuyWiser Technology, Inc. · All rights reserved.</p>
      </footer>
    </div>
  );
}