import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "What is the Veteran's Next Home™ benefit?",
    a: "It's a private BuyWiser program (not affiliated with the VA) that provides up to 1.5% cash back when you purchase your next home after selling a VA-financed property. The benefit is only available through BuyWiser."
  },
  {
    q: "Who qualifies for the Veteran's Next Home™ benefit?",
    a: "You must be selling a home financed with a VA loan and planning to purchase another home. The benefit applies to veterans and active-duty service members. You don't need to stay with your current real estate agent."
  },
  {
    q: "How much can I get back?",
    a: "The benefit is based on your next home purchase price: up to 1.5% when Buywiser coordinates both real estate and financing. Partial benefits (up to 1.0% for real estate only, up to 0.5% for financing only) may apply depending on how the purchase is structured. For example, a $700,000 home could qualify for up to $10,500."
  },
  {
    q: "Do I have to use BuyWiser for everything?",
    a: "No. You can keep your current real estate agent and just use BuyWiser for financing (up to 0.5% benefit). Or you can use BuyWiser for real estate only (up to 1.0% benefit). For the full 1.5%, BuyWiser coordinates both pieces."
  },
  {
    q: "Is this affiliated with the VA?",
    a: "No. Veteran's Next Home™ and the Red White & Blue Purchase Benefit are private BuyWiser programs. They are not affiliated with or endorsed by the U.S. Department of Veterans Affairs."
  },
  {
    q: "When can I start my Benefit Review?",
    a: "You can start right now — it takes less than 3 minutes. You'll answer a few questions about your next-home plans, and a BuyWiser specialist will follow up with your personalized benefit estimate and options."
  },
  {
    q: "What if I'm underwater on my current home?",
    a: "You can still qualify. The Veteran's Next Home™ benefit is about your *next* purchase, not your current sale. If you're selling at a loss, that doesn't disqualify you from next-home benefits."
  },
  {
    q: "How is the benefit paid?",
    a: "The benefit is typically delivered as a credit at closing on your next home purchase — reducing your out-of-pocket costs at closing or available as a cash credit depending on the loan program."
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