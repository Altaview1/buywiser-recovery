import { useState } from "react";
import { ChevronDown, ChevronUp, ShieldCheck, Brain, DollarSign, Scale, Users, Zap } from "lucide-react";
import ComparisonTable from "./ComparisonTable";

const TRUST_PILLARS = [
  {
    icon: Brain,
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconColor: "text-blue-600",
    title: "AI Handles the Administrative Work",
    desc: "Document management, scheduling, coordination, communication tracking — AI eliminates the operational burden that historically required large teams and significant overhead."
  },
  {
    icon: DollarSign,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconColor: "text-emerald-600",
    title: "Savings Pass Directly to You",
    desc: "When operational costs drop, we pass those savings back as SmartBuy Cash™ — real money preserved from the buyer-side commission that you selectively allocate toward the services you actually need."
  },
  {
    icon: Users,
    color: "bg-amber-50 border-amber-200 text-amber-700",
    iconColor: "text-amber-600",
    title: "Licensed Experts, Exactly When Needed",
    desc: "Offer negotiation, contract review, loan structuring — these require licensed professionals. SmartBuy™ deploys top-rated California Realtors and mortgage experts precisely at the stages where their expertise creates real value."
  },
  {
    icon: ShieldCheck,
    color: "bg-violet-50 border-violet-200 text-violet-700",
    iconColor: "text-violet-600",
    title: "Full Legal & Compliance Oversight",
    desc: "Every transaction is supervised by licensed California real estate and mortgage professionals. SmartBuy™ is not a loophole. It is a structurally smarter way to execute a compliant, professional real estate transaction."
  },
];

const FAQS = [
  {
    category: "Understanding the Savings",
    icon: DollarSign,
    color: "text-emerald-600",
    items: [
      {
        q: "Where does the money actually come from?",
        a: "Traditional home buying bundles a 2.5–3% buyer-side commission into every transaction. That commission historically compensated agents for an enormous amount of repetitive administrative work — scheduling, paperwork, coordination, follow-up, document handling — in addition to the skilled work of negotiation and legal compliance. AI and automation now handle most of that administrative layer efficiently. SmartBuy™ restructures how that commission is allocated, directing the administrative savings back to you while ensuring licensed professionals are still deployed for the skilled work that genuinely requires their expertise."
      },
      {
        q: "Is this too good to be true?",
        a: "We understand why that question comes up — the numbers are significant. On a $750,000 home, your SmartBuy Cash™ pool is approximately $18,750. That's real money that has always existed in the transaction. It was simply absorbed by the traditional bundled commission model. The change is not magic — it's structural. AI handles workflow. You direct the process. Licensed professionals step in where their expertise is genuinely required. The savings come from operational efficiency, not from cutting corners on the services that matter."
      },
      {
        q: "Why was this not possible before AI?",
        a: "Before AI, every buyer needed a full-service agent to manage the entire transaction — not because buyers lacked intelligence, but because the administrative complexity was genuinely overwhelming. Document collection, deadline tracking, lender coordination, escrow communication, disclosure management — this required dedicated human management at every step. AI now handles that coordination layer reliably and continuously. That frees the buyer to self-direct the process intelligently, with licensed professionals available on demand for the decisions that require real expertise."
      },
      {
        q: "How is SmartBuy Cash™ different from a rebate?",
        a: "A traditional rebate returns a portion of the agent commission after closing — often with conditions, caps, and lender approval requirements. SmartBuy Cash™ is different in structure: it is a pre-authorized savings pool that you allocate throughout your transaction toward professional services you choose to use. What you don't spend is credited at closing. The key difference is control — you decide in advance how your transaction economics are allocated, rather than receiving a check afterward."
      },
    ]
  },
  {
    category: "Professional Standards & Quality",
    icon: Scale,
    color: "text-amber-600",
    items: [
      {
        q: "Is SmartBuy™ 'cheap real estate'?",
        a: "Absolutely not. SmartBuy™ uses top-rated local California Realtors, experienced mortgage professionals, and licensed transaction coordinators — the same caliber of professionals you would find in any high-quality traditional transaction. The difference is not the quality of the professionals. The difference is that you only pay for their involvement at the stages where that involvement actually creates value. You are not cutting quality. You are eliminating operational overhead."
      },
      {
        q: "What happens if I need a Realtor to write my offer?",
        a: "Writing and negotiating an offer is a mandatory professional stage in SmartBuy™. When you're ready to write an offer, a licensed California Realtor reviews the market, prepares the contract, handles negotiations, and manages the counteroffer process. This is non-negotiable and built into the platform. California law requires licensed Realtor supervision for compliant contract preparation — SmartBuy™ fully honors that requirement."
      },
      {
        q: "Who are the licensed professionals in the network?",
        a: "Our professional network includes licensed California Realtors (including Compass and Keller Williams affiliates), Bennett Liss and the BuyWiser mortgage team (NMLS #1524446, CA DRE #01107013, 30 years of California mortgage experience), licensed transaction coordinators, and real estate attorneys for complex situations. All professionals in the network have agreed to the SmartBuy™ Vendor Terms, which include performance standards and the SmartBuy Savings Guarantee™."
      },
      {
        q: "What if the transaction becomes complicated?",
        a: "Complexity is where SmartBuy™ shines. The platform is specifically designed to escalate intelligently — meaning that as the transaction becomes more complex, licensed professionals engage more deeply. If an appraisal comes in low, if inspection findings are significant, if the loan scenario is unusual — the platform surfaces the appropriate expert immediately. You are never left without support. The professionals available through SmartBuy™ have decades of experience handling exactly these situations."
      },
    ]
  },
  {
    category: "How the Process Works",
    icon: Zap,
    color: "text-blue-600",
    items: [
      {
        q: "How does the SmartBuy™ process actually work, step by step?",
        a: "The process follows the natural flow of a home purchase: (1) Get qualified — AI helps you understand buying power, payment scenarios, and financing options. (2) Search homes — Use Zillow, Redfin, or AI-powered property search with AI analysis. (3) Tour homes — Schedule showings with licensed showing agents. (4) Write an offer — A licensed Realtor prepares, reviews, and negotiates on your behalf. (5) Open escrow — A personal transaction coordinator manages all coordination. (6) Inspection — A licensed inspector evaluates the property; your Realtor guides findings. (7) Secure financing — AI-assisted comparison with optional mortgage broker support. (8) Close — Licensed professionals manage signing, wire coordination, and recording. At every stage, AI handles the administrative layer and licensed professionals handle the decisions."
      },
      {
        q: "Am I expected to do everything myself?",
        a: "No. SmartBuy™ is not a 'do it yourself' real estate platform. It is a guided, AI-assisted platform that handles the coordination work on your behalf, while giving you transparency and control over how your transaction economics are allocated. You make the decisions that matter. The platform and its professional network handle the execution. You are more empowered — not more burdened."
      },
      {
        q: "What if I want full-service agent support for the entire transaction?",
        a: "SmartBuy™ can accommodate that preference. If you determine at any stage that you want comprehensive licensed agent involvement throughout the transaction, that option is available. The platform is designed to match your level of engagement — from highly self-directed to fully supported. Your SmartBuy Cash™ pool funds the services you choose."
      },
      {
        q: "Is this available everywhere in California?",
        a: "SmartBuy™ is currently focused on California. Our professional network is strongest in Southern California markets, with expanding coverage statewide. Availability of specific services may vary by geography. Contact the BuyWiser team at (818) 300-2642 to confirm coverage in your target area."
      },
    ]
  },
  {
    category: "Trust, Compliance & Legitimacy",
    icon: ShieldCheck,
    color: "text-violet-600",
    items: [
      {
        q: "Is SmartBuy™ legal and properly licensed?",
        a: "Yes. SmartBuy™ is operated under BuyWiser Technology, Inc. DBA BuyWiser Home Loans. Company NMLS #1887767. Bennett Liss, NMLS #1524446, CA DRE #01107013. Licensed by the California Department of Financial Protection and Innovation (DFPI) under the California Residential Mortgage Lending Act (CRMLA). All real estate transaction activities are supervised by licensed California real estate professionals."
      },
      {
        q: "Is the savings estimate guaranteed?",
        a: "The SmartBuy Cash™ estimate is based on 2.5% of your target purchase price — a standard representation of the buyer-side commission structure. Final savings depend on your transaction structure, the services you use, lender requirements, and applicable rules. Estimates are not guaranteed outcomes. They represent your potential maximum cash preservation if you complete the process using AI-guided self-direction at the stages where that is appropriate."
      },
      {
        q: "Is SmartBuy™ anti-agent or anti-Realtor?",
        a: "No. SmartBuy™ respects and relies on licensed real estate professionals — they are an essential part of every transaction. The platform is not designed to eliminate Realtors. It is designed to restructure how their time and expertise is deployed. Instead of paying a bundled commission that covers everything including administrative work now handled by AI, buyers pay for specific high-value professional services. The professionals in the SmartBuy™ network support this model because it focuses their expertise on the work that genuinely requires their skill."
      },
    ]
  }
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${open ? "border-slate-300 shadow-sm" : "border-slate-200"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-slate-50 transition"
      >
        <p className="flex-1 text-sm font-semibold text-slate-900 leading-relaxed">{q}</p>
        <div className="flex-shrink-0 mt-0.5 text-slate-400">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 bg-slate-50 border-t border-slate-200">
          <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function SmartBuyFAQ() {
  const [activeCategory, setActiveCategory] = useState(null);

  const displayed = activeCategory
    ? FAQS.filter(s => s.category === activeCategory)
    : FAQS;

  return (
    <section className="px-4 sm:px-6 py-20 bg-white border-t border-slate-100">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">Understanding SmartBuy™</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
            The Questions Every Smart Buyer Asks
          </h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
            SmartBuy™ is a new model. It's disruptive. The concept is worth understanding completely — because the financial implications for your transaction are significant.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <div className="text-center mb-6">
            <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-1">Side-by-Side</p>
            <h3 className="text-xl font-black text-slate-900">Traditional vs. SmartBuy™ Cash-Preservation Model</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">The same home purchase. A fundamentally different financial outcome for the buyer.</p>
          </div>
          <ComparisonTable />
        </div>

        {/* Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {TRUST_PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className={`rounded-2xl border p-5 ${p.color}`}>
                <Icon className={`h-6 w-6 mb-3 ${p.iconColor}`} />
                <p className="text-sm font-black text-slate-900 mb-2 leading-snug">{p.title}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
              activeCategory === null
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
            }`}
          >
            All Questions
          </button>
          {FAQS.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.category}
                onClick={() => setActiveCategory(activeCategory === s.category ? null : s.category)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                  activeCategory === s.category
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                }`}
              >
                <Icon className={`h-3 w-3 ${activeCategory === s.category ? "text-white" : s.color}`} />
                {s.category}
              </button>
            );
          })}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {displayed.map(section => {
            const Icon = section.icon;
            return (
              <div key={section.category}>
                <div className="flex items-center gap-2.5 mb-5">
                  <Icon className={`h-5 w-5 ${section.color}`} />
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">{section.category}</h3>
                </div>
                <div className="space-y-3">
                  {section.items.map((item, i) => (
                    <FAQItem key={i} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 bg-slate-900 rounded-2xl px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-black text-lg mb-1">Still have questions?</p>
            <p className="text-slate-400 text-sm">Speak directly with Bennett Liss — 30 years of California mortgage and real estate experience.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a href="tel:+18183002642"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 text-slate-900 font-black rounded-xl text-sm hover:bg-amber-300 transition whitespace-nowrap">
              📞 (818) 300-2642
            </a>
            <a href="/smartbuy#form"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white font-black rounded-xl text-sm hover:bg-emerald-400 transition whitespace-nowrap">
              Calculate My Savings →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}