import { DollarSign } from "lucide-react";
import { SERVICE_PRICES, formatPrice } from "./pricing/servicePricing";

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

export default function ServicePriceList() {
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
                  <div key={service.id} className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 mb-1">{service.name}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {SERVICE_DESCRIPTIONS[service.id]}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-baseline gap-1">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                          <span className="text-2xl font-black text-blue-600">{service.price}</span>
                        </div>
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
            { label: "Home Search & AI Guidance", price: "Free" },
            { label: "Single Property Tour", price: "$50" },
            { label: "AI Consultation", price: "Free" },
            { label: "Mortgage Broker Consultation", price: "$800" },
            { label: "Realtor Consultation", price: "$1,000" },
            { label: "Senior Strategist Consultation", price: "$1,500" },
            { label: "Offer Preparation & Negotiation (California Required)", price: "$1,500" },
            { label: "Extended Realtor Time (hourly)", price: "$80/hr" },
          ].map((item, i) => (
            <div key={i} className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-slate-900">{item.label}</p>
              <p className="text-lg font-black text-rose-600 mt-2">{item.price}</p>
            </div>
          ))}
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