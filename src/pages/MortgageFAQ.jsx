import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { usePageTitle } from "@/lib/usePageTitle";

const FAQS = [
  {
    q: "What documents do I need to apply for a mortgage?",
    a: "Typically, lenders require: recent pay stubs and W-2s (last 2 years), tax returns (last 2 years), bank statements (last 2 months), proof of employment, ID verification, and details about your property. Self-employed borrowers may need additional documentation like profit/loss statements."
  },
  {
    q: "What is the difference between pre-qualification and pre-approval?",
    a: "Pre-qualification is an informal estimate based on self-reported information about your finances. Pre-approval is a formal process where the lender verifies your documents and commits to lending you a specific amount. Pre-approval carries more weight when making an offer."
  },
  {
    q: "How long does the mortgage approval process take?",
    a: "Typically 30-45 days from application to closing, though it can vary. The timeline depends on how quickly you provide documents, property appraisal completion, and underwriting review. Having all documents ready upfront can speed up the process significantly."
  },
  {
    q: "What is APR and how is it different from interest rate?",
    a: "The interest rate is the cost of borrowing the principal loan amount. APR (Annual Percentage Rate) includes the interest rate plus other costs and fees involved in procuring the loan, expressed as a yearly rate. APR gives a more complete picture of the true cost of borrowing."
  },
  {
    q: "Can I get a mortgage with a lower credit score?",
    a: "Yes, mortgages are available for borrowers with lower credit scores, though typically with higher interest rates. Most conventional loans require a score of 620+. FHA loans are more flexible. We can review your specific situation and discuss available options."
  },
  {
    q: "What does it mean to 'lock in' an interest rate?",
    a: "Rate locking means the lender guarantees a specific interest rate for a set period (typically 30-60 days). This protects you if rates rise during your loan processing. You pay a lock-in fee, but it ensures your rate won't change even if market rates increase."
  },
  {
    q: "What are closing costs and what do they include?",
    a: "Closing costs are fees paid at closing (typically 2-5% of loan amount) and include: appraisal fees, title insurance, attorney fees, loan origination fees, property taxes, and homeowners insurance. Your lender must provide a detailed breakdown at least 3 days before closing."
  },
  {
    q: "What is PMI and can I avoid it?",
    a: "PMI (Private Mortgage Insurance) is required when your down payment is less than 20%. It protects the lender if you default. You can avoid PMI by making a 20% down payment, or you can request it be removed once you reach 20% equity in your home."
  },
  {
    q: "Is it better to get a 15-year or 30-year mortgage?",
    a: "A 15-year mortgage has higher monthly payments but you pay less interest overall. A 30-year mortgage has lower monthly payments but costs more in total interest. Choose based on your budget and long-term financial goals. We can calculate scenarios for you."
  },
  {
    q: "What is a good debt-to-income ratio for mortgage approval?",
    a: "Most lenders want a debt-to-income ratio below 43%, meaning your total monthly debt payments shouldn't exceed 43% of your gross monthly income. Some lenders may go up to 50% for well-qualified borrowers. Lower ratios improve approval odds and may qualify you for better rates."
  },
  {
    q: "Can I refinance my mortgage after I get it?",
    a: "Yes, refinancing allows you to replace your current mortgage with a new one, typically to get a better interest rate, change the loan term, or switch to a fixed rate. Refinancing involves new closing costs and fees, so it's best when you can save money or achieve a financial goal."
  },
  {
    q: "What is an ARM and should I consider it?",
    a: "An ARM (Adjustable Rate Mortgage) has a lower initial rate that adjusts after a set period (e.g., 5/1 ARM adjusts after 5 years). ARMs can save money initially but carry risk if rates rise. Fixed-rate mortgages provide stability. ARMs work best for borrowers planning to sell or refinance before the rate adjusts."
  }
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition"
      >
        <span className="text-sm font-semibold text-slate-800">{q}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white pt-2">
          <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function MortgageFAQ() {
  usePageTitle('Mortgage FAQ | BuyWiser Home Loans');
  
  return (
    <div className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Mortgage FAQs</h1>
          <p className="text-lg text-slate-600">Common questions homeowners ask about mortgages and the lending process.</p>
        </div>

        <div className="space-y-3 mb-12">
          {FAQS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-slate-700 font-semibold mb-4">Didn't find your answer?</p>
          <p className="text-slate-600 mb-6">Our team is ready to discuss your specific situation and answer any questions you have.</p>
          <a
            href="/Contact"
            className="inline-block px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition"
          >
            Request a Mortgage Review
          </a>
        </div>
      </div>
    </div>
  );
}