/**
 * SmartBuy™ Service Pricing
 * Real dollar amounts for all professional services
 */

export const SERVICE_PRICES = {
  // Pre-Offer Services
  market_analysis: { name: "Market Analysis & Comps", price: 350, phase: "pre_offer" },
  property_details: { name: "Property Details & Records Search", price: 200, phase: "pre_offer" },
  comps_sale: { name: "Comp Analysis: Recent Sales", price: 400, phase: "pre_offer" },
  
  // Inspection Services
  general_inspection: { name: "General Home Inspection", price: 450, phase: "inspection" },
  foundation_inspection: { name: "Foundation & Structural Inspection", price: 350, phase: "inspection" },
  roof_inspection: { name: "Roof Inspection & Report", price: 250, phase: "inspection" },
  pool_spa_inspection: { name: "Pool & Spa Inspection", price: 200, phase: "inspection" },
  sewer_scope: { name: "Sewer Scope / Plumbing Line Inspection", price: 220, phase: "inspection" },
  pest_inspection: { name: "Pest & Termite Inspection", price: 150, phase: "inspection" },
  mold_inspection: { name: "Mold Inspection & Air Quality Test", price: 280, phase: "inspection" },
  hvac_inspection: { name: "HVAC System Inspection & Report", price: 200, phase: "inspection" },
  
  // Appraisal Services
  appraisal_standard: { name: "Standard Appraisal Coordination", price: 300, phase: "appraisal" },
  appraisal_rush: { name: "Rush Appraisal Coordination", price: 450, phase: "appraisal" },
  appraisal_rov: { name: "Reconsideration of Value (ROV)", price: 200, phase: "appraisal" },
  
  // Mortgage Services
  mortgage_guidance: { name: "Mortgage Consultation with Bennett Liss", price: 800, phase: "mortgage" },
  rate_shop: { name: "Rate Comparison & Shopping", price: 500, phase: "mortgage" },
  loan_comparison: { name: "Loan Program Comparison & Analysis", price: 600, phase: "mortgage" },
  
  // Offer Services
  offer_strategy: { name: "Offer Strategy & Negotiation Review", price: 1000, phase: "pre_offer" },
  
  // Closing Services
  closing_coordination: { name: "Closing Coordination & Walkthrough", price: 550, phase: "closing" },
  final_walkthrough: { name: "Final Walkthrough & Punch List", price: 300, phase: "closing" },
  title_insurance: { name: "Title Insurance & Escrow Management", price: 400, phase: "closing" },
  
  // Moving/Post-Close
  moving_standard: { name: "Moving Service Coordination", price: 200, phase: "post_close" },
  moving_premium: { name: "Premium Moving & Packing Service", price: 350, phase: "post_close" },
  packing_assist: { name: "Packing Assistance & Organization", price: 200, phase: "post_close" },
  
  // Cleaning
  cleaning_move_in: { name: "Move-In Cleaning & Deep Clean", price: 150, phase: "post_close" },
  cleaning_move_out: { name: "Move-Out Cleaning & Deposit Protection", price: 150, phase: "post_close" },
  cleaning_deep: { name: "Deep Cleaning Service", price: 250, phase: "post_close" },
};

export const WORKFLOW_COSTS = {
  search: 0, // Free with AI
  tour: 50, // Per property
  consultation_ai: 0, // Free
  consultation_broker: 800, // Professional consultation
  consultation_realtor: 1000,
  consultation_strategist: 1500,
  offer_package: 1500, // Mandatory for California offer
};

export const formatPrice = (price) => {
  return Number(price).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
};