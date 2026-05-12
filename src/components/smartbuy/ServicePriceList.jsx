import { useState } from "react";
import { DollarSign, HelpCircle, X, BadgeCheck, Star, Briefcase, GraduationCap } from "lucide-react";
import { SERVICE_PRICES, formatPrice } from "./pricing/servicePricing";

const EXPERT_PROFILES = {
  "Mortgage Broker Consultation": {
    emoji: "🏦",
    title: "Licensed Mortgage Broker",
    credential: "NMLS Licensed · CA DFPI Regulated",
    experience: "10–30 years",
    valueAdd: "A licensed mortgage broker shops your loan across dozens of lenders simultaneously — something a single bank can't do. They identify the lowest rate, best terms, and right loan program (VA, FHA, Conventional, Jumbo) for your specific financial profile.",
    delivers: [
      "Rate comparison across 20+ lenders",
      "Pre-approval letter within 24–48 hours",
      "Loan program recommendation with cost-benefit breakdown",
      "Debt-to-income optimization strategy",
    ],
    credentials: ["NMLS Federal Registration", "CA DFPI Licensed", "RESPA Compliant"],
  },
  "Realtor Consultation": {
    emoji: "🏡",
    title: "Licensed California Realtor",
    credential: "CA DRE Licensed · NAR Member",
    experience: "8–20 years",
    valueAdd: "A licensed California Realtor brings hyperlocal market expertise, negotiation skill, and fiduciary responsibility to your transaction. In the SmartBuy™ model, you only pay for their expertise when you need it — not a blanket commission.",
    delivers: [
      "Market positioning and competitive offer strategy",
      "Local neighborhood and micro-market intelligence",
      "Negotiation tactics and seller psychology insights",
      "Contract review and contingency guidance",
    ],
    credentials: ["CA DRE License", "NAR Member", "California Association of Realtors"],
  },
  "Senior Strategist Consultation": {
    emoji: "🎯",
    title: "Senior Real Estate Strategist",
    credential: "30+ Years California Experience",
    experience: "30+ years",
    valueAdd: "Our Senior Strategists have navigated every California market cycle since the early 1990s. They specialize in complex, high-stakes transactions where standard advice isn't enough — competitive bidding wars, contingency waiver decisions, and multi-offer dynamics.",
    delivers: [
      "High-stakes offer strategy in competitive markets",
      "Contingency waiver risk assessment",
      "Off-market and pocket listing intelligence",
      "Portfolio-level investment perspective",
    ],
    credentials: ["CA DRE License", "30+ Years Licensed", "Designated Expert Advisor"],
  },
  "Offer Preparation & Negotiation (California Required)": {
    emoji: "📝",
    title: "Licensed Offer Specialist",
    credential: "CA DRE Licensed · Transaction Coordinator",
    experience: "5–15 years",
    valueAdd: "California law requires a licensed agent to prepare and submit residential purchase offers. Our Offer Specialists are trained exclusively in contract preparation, counter-offer management, and closing the gap between you and the seller — efficiently.",
    delivers: [
      "California Residential Purchase Agreement (RPA) preparation",
      "Counter-offer drafting and response management",
      "Contingency structuring to protect your deposit",
      "Coordination with seller's agent through acceptance",
    ],
    credentials: ["CA DRE License", "C.A.R. Certified", "Transaction Law Compliant"],
  },
  "Single Property Tour": {
    emoji: "🗝️",
    title: "Licensed Showing Agent",
    credential: "CA DRE Licensed · Local Market Expert",
    experience: "3–15 years",
    valueAdd: "A licensed showing agent does far more than open a door. They evaluate the property's condition, flag visible issues, assess neighborhood context, and provide real-time market insight during your tour — so you walk away informed, not just impressed.",
    delivers: [
      "Property condition walkthrough and red-flag identification",
      "Neighborhood comparable sales context",
      "On-site Q&A with sellers' agent",
      "Post-tour summary notes and recommendation",
    ],
    credentials: ["CA DRE License", "Local MLS Access", "NAR Member"],
  },
  "Extended Realtor Time (hourly)": {
    emoji: "⏱️",
    title: "Licensed California Realtor",
    credential: "CA DRE Licensed · Hourly Advisory",
    experience: "8–20 years",
    valueAdd: "When your transaction requires more time than the included consultation — extended negotiations, multiple counter-offers, or a complex multi-party deal — you can activate additional licensed Realtor hours at a flat hourly rate. No surprise bills.",
    delivers: [
      "Continued negotiation support beyond initial session",
      "Multi-offer strategy in competitive bidding",
      "Escrow issue resolution and vendor coordination",
      "Extended contract and addendum management",
    ],
    credentials: ["CA DRE License", "NAR Member", "California Association of Realtors"],
  },
};

const SERVICE_DESCRIPTIONS = {
  // Pre-Offer
  market_analysis: "Recent comparable sales in your neighborhood, market trends, and competitive analysis to help you price your offer correctly.",
  property_details: "County records, property tax history, lot size, square footage, zoning, utilities, and any structural modifications on file.",
  comps_sale: "Deep-dive analysis of recently sold comparable properties filtered by size, age, and condition to justify your offer price.",
  
  // Inspection
  general_inspection: "Complete professional inspection covering structure, systems, roof, foundation, HVAC, plumbing, and electrical.",
  foundation_inspection: "Specialized structural inspection focusing on foundation, basement, crawl space, and any visible settling or cracks.",
  roof_inspection: "Professional roof assessment including shingles, flashing, gutters, ventilation, and estimated remaining life.",
  pool_spa_inspection: "Pool and spa system evaluation including pump, filter, heater, plumbing, and safety features.",
  sewer_scope: "Video camera inspection of sewer lines to detect cracks, clogs, root intrusion, or misalignment issues.",
  pest_inspection: "Professional pest and termite inspection covering interior, exterior, foundation, and attic for infestation or damage.",
  mold_inspection: "Air quality testing and visual inspection for mold, moisture, and indoor air quality issues.",
  hvac_inspection: "HVAC system evaluation including furnace, AC, ductwork, refrigerant levels, and efficiency rating.",
  
  // Appraisal
  appraisal_standard: "Coordination of lender-ordered appraisal, scheduling, and value verification to ensure property valuation is fair.",
  appraisal_rush: "Expedited appraisal scheduling when standard timelines won't work due to closing date constraints.",
  appraisal_rov: "Challenge low appraisals with additional comparable sales data and rebuttal arguments to the appraiser.",
  
  // Mortgage
  mortgage_guidance: "Direct consultation with licensed mortgage professional on loan programs, rates, terms, and financing strategy.",
  rate_shop: "Shop your rate with multiple lenders to ensure you're getting the best terms available for your situation.",
  loan_comparison: "Analysis of available loan programs (Conventional, FHA, VA, Jumbo) with cost-benefit comparisons over your holding period.",
  
  // Offer
  offer_strategy: "Expert review of your offer price, contingencies, financing terms, and negotiation approach before submission.",
  
  // Closing
  closing_coordination: "Coordination of final walkthrough, closing appointment scheduling, and last-minute issue resolution.",
  final_walkthrough: "Professional final walkthrough to verify agreed repairs are complete and property condition matches contract.",
  title_insurance: "Title company coordination, title insurance policy, and escrow account setup and management.",
  
  // Post-Close
  moving_standard: "Coordination with vetted moving companies, scheduling, and logistics for your relocation.",
  moving_premium: "Full-service moving including packing, loading, transport, unloading, and unpacking at your new home.",
  packing_assist: "Professional packing services to organize belongings, label boxes, and prepare for moving day.",
  
  // Cleaning
  cleaning_move_in: "Professional deep cleaning of your new home before move-in, including all surfaces, appliances, and fixtures.",
  cleaning_move_out: "Professional move-out cleaning to maximize security deposit return or prepare for sale.",
  cleaning_deep: "Comprehensive deep cleaning covering all rooms, baseboards, cabinets, windows, and appliances.",
};

const SERVICE_PHASES = {
  pre_offer: "Before You Offer",
  inspection: "After Offer Accepted",
  appraisal: "After Loan Submission",
  mortgage: "Mortgage Planning",
  closing: "Closing Preparation",
  post_close: "Moving & Cleanup",
};

function ExpertProfileModal({ profile, label, onClose }) {
  if (!profile) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition">
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-2xl flex-shrink-0">
            {profile.emoji}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">{profile.title}</h3>
            <p className="text-xs text-amber-700 font-semibold mt-0.5 flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5" /> {profile.credential}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <Briefcase className="h-3 w-3" /> {profile.experience} experience
            </p>
          </div>
        </div>

        {/* Value-add */}
        <p className="text-sm text-slate-700 leading-relaxed mb-5">{profile.valueAdd}</p>

        {/* What they deliver */}
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
            <Star className="h-3 w-3 text-amber-500" /> What You Get
          </p>
          <ul className="space-y-1.5">
            {profile.delivers.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Credentials */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-blue-500" /> Credentials
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.credentials.map((c, i) => (
              <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tooltip({ text }) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1.5 flex-shrink-0">
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="text-slate-400 hover:text-slate-600 transition"
        type="button"
        aria-label="More info"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      {visible && (
        <span className="absolute left-5 top-1/2 -translate-y-1/2 z-50 w-60 bg-slate-900 text-white text-xs leading-relaxed rounded-xl px-3 py-2.5 shadow-xl pointer-events-none">
          {text}
          <span className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-slate-900" />
        </span>
      )}
    </span>
  );
}

export default function ServicePriceList() {
  const [activeExpert, setActiveExpert] = useState(null);

  // Group services by phase
  const grouped = {};
  Object.entries(SERVICE_PRICES).forEach(([id, service]) => {
    const phase = service.phase;
    if (!grouped[phase]) grouped[phase] = [];
    grouped[phase].push({ id, ...service });
  });

  const phaseOrder = ["pre_offer", "inspection", "appraisal", "mortgage", "closing", "post_close"];

  return (
    <div className="max-w-4xl mx-auto">
      <ExpertProfileModal
        profile={activeExpert ? EXPERT_PROFILES[activeExpert] : null}
        label={activeExpert}
        onClose={() => setActiveExpert(null)}
      />
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-2">SmartBuy™ Service Pricing</h2>
        <p className="text-slate-600">Clear, transparent pricing for professional services. Only pay for what you use.</p>
      </div>

      <div className="space-y-8">
        {phaseOrder.map((phase) => {
          const services = grouped[phase];
          if (!services) return null;

          return (
            <div key={phase}>
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                {SERVICE_PHASES[phase]}
              </h3>

              <div className="space-y-3">
                {services.map((service) => (
                  <div key={service.id} className="bg-white rounded-lg border border-slate-200 px-4 py-3 hover:border-slate-300 transition">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 leading-snug">{service.name}</h4>
                        {SERVICE_DESCRIPTIONS[service.id] && (
                          <Tooltip text={SERVICE_DESCRIPTIONS[service.id]} />
                        )}
                      </div>
                      <div className="flex-shrink-0 flex items-baseline gap-0.5">
                        <DollarSign className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-lg font-black text-blue-600">{service.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Savings vs Costs */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* Total Credit / Savings Pool */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-2">Your SmartBuy™ Credit</p>
            <p className="text-4xl font-black text-emerald-600 mb-1">$18,750+</p>
            <p className="text-sm text-emerald-700 font-semibold">2.5% buyer commission savings pool</p>
            <p className="text-xs text-slate-600 mt-3">Available on a $750K purchase. Actual amount based on final property price.</p>
          </div>

          {/* Max Potential Costs */}
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6">
            <p className="text-xs font-black uppercase tracking-widest text-rose-700 mb-2">Maximum Potential Costs</p>
            <p className="text-4xl font-black text-rose-600 mb-1">~$8,530</p>
            <p className="text-sm text-rose-700 font-semibold">If you use all guided services</p>
            <p className="text-xs text-slate-600 mt-3">Most buyers spend 25-40% of their credit. The rest goes to your rate, costs, or closing cash.</p>
          </div>
        </div>
      </div>

      {/* Workflow Costs */}
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          Guided Workflow Costs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Home Search & AI Guidance", price: "Free", tip: "AI-powered property search, neighborhood insights, price trend analysis, and school ratings — all at no cost." },
            { label: "Single Property Tour", price: "$50", tip: "A licensed showing agent accompanies you to tour one specific property. Includes access coordination and on-site Q&A." },
            { label: "AI Consultation", price: "Free", tip: "Unlimited AI chat for offer strategy questions, market research, document explanations, and timeline planning." },
            { label: "Mortgage Broker Consultation", price: "$800", tip: "30–60 min session with a licensed mortgage broker to review loan programs, rate scenarios, and pre-approval strategy." },
            { label: "Realtor Consultation", price: "$1,000", tip: "60–90 min strategy session with a licensed California Realtor covering market positioning, offer approach, and negotiation." },
            { label: "Senior Strategist Consultation", price: "$1,500", tip: "Deep-dive strategy session with a senior advisor covering complex scenarios, competitive markets, or high-stakes negotiation." },
            { label: "Offer Preparation & Negotiation (California Required)", price: "$1,500", tip: "California law requires a licensed Realtor to prepare and submit purchase offers. Includes contract review, counter-offer handling, and negotiation." },
            { label: "Extended Realtor Time (hourly)", price: "$80/hr", tip: "Additional licensed Realtor hours beyond the included consultation block — for complex negotiations or extended property searches." },
          ].map((item, i) => {
            const hasProfile = !!EXPERT_PROFILES[item.label];
            return (
              <div key={i} className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center min-w-0">
                  {hasProfile ? (
                    <button
                      onClick={() => setActiveExpert(item.label)}
                      className="text-sm font-semibold text-rose-700 hover:text-rose-900 underline decoration-dotted underline-offset-2 leading-snug text-left transition"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 leading-snug">{item.label}</p>
                  )}
                  <Tooltip text={item.tip} />
                </div>
                <p className="text-base font-black text-rose-600 flex-shrink-0">{item.price}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Note */}
      <div className="mt-8 p-5 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="font-bold text-blue-900 mb-2">💡 How This Works</p>
        <p className="text-sm text-blue-800 leading-relaxed">
          You're not locked into paying all these services upfront. Use AI for free first to reduce professional service needs. Only activate licensed professionals when you're serious about a property. Most buyers save 40-60% compared to traditional agent commissions by being selective about when they pay for expertise.
        </p>
      </div>
    </div>
  );
}