import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "What exactly is the Buywiser 1.5 GAP Benefit™?",
    a: "It's a private financial benefit — up to 1.5% of your next home's purchase price — delivered as a credit at closing. It's part of the Veteran's Next Home™ Program, designed specifically to help qualifying veteran homeowners bridge the transition costs between selling their current home and buying their next one. It is not a government program and is not affiliated with the VA."
  },
  {
    q: "Do I qualify?",
    a: "You likely qualify if: (1) your current or recently sold home was financed with a VA loan within the last 7 years, (2) you or your spouse/significant other served in any branch of the U.S. military, and (3) you're planning to purchase another home. Both the veteran and their spouse or significant other may qualify."
  },
  {
    q: "How much money is the benefit? Give me a real example.",
    a: "The benefit is up to 1.5% of your next home's purchase price. On a $700,000 home, that's up to $10,500. On a $900,000 home, up to $13,500. The exact amount depends on how your purchase is structured through Buywiser."
  },
  {
    q: "What does '1.5%' depend on — when do I get the full amount?",
    a: "The full 1.5% is available when Buywiser coordinates both the real estate side and the financing on your next home purchase. If you only use Buywiser for financing, the benefit is up to 0.5%. If you only use Buywiser for the real estate side, it's up to 1.0%. For the full benefit, Buywiser handles both."
  },
  {
    q: "Can I keep my current real estate agent?",
    a: "Yes. If you're committed to your current agent, you can still use Buywiser for financing and receive up to 0.5% back. However, the full 1.5% requires Buywiser to coordinate the real estate process as well."
  },
  {
    q: "Where does the money go — is it cash in my pocket?",
    a: "The benefit is delivered as a credit at closing on your next home purchase. This reduces your out-of-pocket closing costs or can be applied toward your purchase depending on the loan program structure. Buywiser will explain exactly how it's applied based on your situation."
  },
  {
    q: "What does Buywiser actually do as part of this program?",
    a: "Buywiser coordinates your entire next-home process: strategy review, touring access, offer preparation, negotiation support, financing, transaction coordination, and benefit structure at closing. You can still find homes yourself — Buywiser handles the professional pieces around it."
  },
  {
    q: "My home was financed with a VA loan but I'm selling at a loss. Do I still qualify?",
    a: "Yes. The GAP Benefit is about your next purchase, not your current sale. Selling at a loss or being underwater on your current home does not disqualify you from the Veteran's Next Home™ Benefit Review."
  },
  {
    q: "Is this a government benefit or VA program?",
    a: "No. The Veteran's Next Home™ Program and the Buywiser 1.5 GAP Benefit™ are private programs offered exclusively through Buywiser. They are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency."
  },
  {
    q: "How do I get started?",
    a: "Start your Veteran's Next Home™ Benefit Review on this page — it takes less than 3 minutes. Enter your contact info and a Buywiser specialist will follow up within one business day with your personalized benefit estimate and next steps. No cost, no obligation."
  },
];

export default function VeteransNextHomeFAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="px-4 py-14 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Questions?</p>
          <h2 className="text-2xl font-bold text-slate-900">Veteran's Next Home™ — FAQs</h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((item, i) => (
            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition"
              >
                <span className="text-sm font-semibold text-slate-900">{item.q}</span>
                {open === i ? (
                  <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {open === i && (
                <div className="px-5 pb-4 bg-slate-50 border-t border-slate-200">
                  <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}