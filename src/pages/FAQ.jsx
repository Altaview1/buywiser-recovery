import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const FAQS = [
  {
    category: "The Benefit",
    items: [
      {
        q: "What is the Red White & Blue Purchase Benefit?",
        a: "It's a private Buywiser program that provides up to 1.5% cash back to qualifying veteran homeowners when their next home purchase is coordinated through Buywiser. It is not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency.",
      },
      {
        q: "How much can I receive?",
        a: "Up to 1.5% of your next home's purchase price. For example, on a $700,000 home that's up to $10,500. The exact amount depends on how the transaction is structured through Buywiser.",
      },
      {
        q: "Is this a government VA program?",
        a: "No. The Red White & Blue Purchase Benefit and Veteran's Next Home™ are private programs offered through Buywiser. They are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency.",
      },
      {
        q: "When do I receive the benefit?",
        a: "The benefit is applied at closing on your next home purchase, when the transaction has been properly structured through Buywiser.",
      },
    ],
  },
  {
    category: "Eligibility",
    items: [
      {
        q: "Who qualifies for the program?",
        a: "To qualify, you generally need to: (1) have an active VA loan on the home you're currently selling, (2) have served in the U.S. military, (3) be planning to purchase another home, and (4) be purchasing in a qualifying market.",
      },
      {
        q: "Do I need a Personal Benefit Code?",
        a: "No. A code helps personalize your review if you received a mailer, but you can start your Veteran's Next Home™ Benefit Review without one.",
      },
      {
        q: "What if I only use Buywiser for financing?",
        a: "A partial benefit of up to 0.5% may be available when Buywiser handles only the financing side of your next purchase.",
      },
      {
        q: "What if I only use Buywiser for the real estate side?",
        a: "A partial benefit of up to 1.0% may be available when Buywiser handles only the real estate coordination.",
      },
    ],
  },
  {
    category: "The Process",
    items: [
      {
        q: "How does the home search process work?",
        a: "Many buyers already find homes online. Buywiser supports that modern approach while coordinating the professional pieces that matter: touring access, offer preparation, negotiation strategy, financing, transaction support, and the benefit structure.",
      },
      {
        q: "Can I still find homes myself?",
        a: "Yes. You can find homes on Zillow, Realtor.com, or anywhere else. Buywiser coordinates the evaluation, offer, financing, and closing process — while still applying your benefit.",
      },
      {
        q: "How does Buywiser handle showings?",
        a: "Buywiser coordinates touring access as part of the next-home process so you don't need to manage it alone.",
      },
      {
        q: "How long does the review take?",
        a: "Most initial benefit reviews are completed within one business day. The full transaction timeline depends on your specific situation and market.",
      },
    ],
  },
  {
    category: "Costs & Commitments",
    items: [
      {
        q: "Is there any cost to start a review?",
        a: "No. The initial Veteran's Next Home™ Benefit Review is completely free with no obligation.",
      },
      {
        q: "Are there any hidden fees?",
        a: "No. Buywiser's approach is transparent. Standard transaction costs (like closing costs) apply as they would in any real estate transaction, but there are no hidden fees for the benefit program itself.",
      },
      {
        q: "What happens if I decide not to move forward?",
        a: "There is no obligation. You are free to decide at any point that the program isn't right for you.",
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition"
      >
        <span className="text-sm font-semibold text-slate-800 pr-4">{q}</span>
        {open
          ? <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
          : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 pt-1 bg-white border-t border-slate-100">
          <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section style={{ background: NAVY }} className="px-4 py-14 sm:py-20 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-blue-300 mb-3">Help Center</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-blue-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Everything you need to know about the Veteran's Next Home™ program and the Red White &amp; Blue Purchase Benefit.
        </p>
      </section>

      {/* FAQ Sections */}
      <section className="px-4 py-12 max-w-2xl mx-auto space-y-10">
        {FAQS.map((section) => (
          <div key={section.category}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-slate-100" />
              <p className="text-xs font-black uppercase tracking-widest px-3" style={{ color: RED }}>
                {section.category}
              </p>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <div className="space-y-2">
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 max-w-2xl mx-auto">
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="px-6 py-5 text-center" style={{ background: NAVY }}>
            <p className="text-white font-black text-base uppercase tracking-widest">Still Have Questions?</p>
            <p className="text-blue-300 text-xs mt-1">We're here to help — no cost, no obligation</p>
          </div>
          <div className="p-6 bg-white flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm text-white transition hover:opacity-90"
              style={{ background: RED }}
            >
              Start My Benefit Review
            </Link>
            <a
              href="tel:+18183002642"
              className="flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            >
              Call (818) 300-2642
            </a>
          </div>
        </div>
        <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
          Veteran's Next Home™ and the Red White &amp; Blue Purchase Benefit are private programs offered through Buywiser. Not affiliated with or endorsed by the U.S. Department of Veterans Affairs.{" "}
          <Link to="/Disclosures" className="underline hover:text-slate-600">Licensing &amp; Disclosures</Link>
        </p>
      </section>
    </div>
  );
}