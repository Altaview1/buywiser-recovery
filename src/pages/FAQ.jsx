import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const FAQS = [
  {
    category: "VTON Agent Execution Protocol (3-Strike Door-Knock Rule)",
    items: [
      {
        q: "What is the 3-Strike Door-Knock Protocol?",
        a: "It's a systematic approach to lead follow-up: Visit 1 (leave packet), Visit 2 (leave packet again), Visit 3 (final attempt or conversation). After 3 strikes, the opportunity is considered worked. Each visit must be logged in the CRM with date and outcome. This ensures disciplined execution and proof of activity.",
      },
      {
        q: "How does the 3-Strike Rule work exactly?",
        a: "Visit 1: No answer — leave benefit packet at door with QR code. Log date & schedule Visit 2. Visit 2: Still no answer — leave another packet. Schedule Visit 3. Visit 3: Final packet drop or, if homeowner is home, have a conversation about the benefit. If conversation happens on ANY visit, log it immediately — this counts as a verified action.",
      },
      {
        q: "What counts as a 'verified action' that earns deposit credit?",
        a: "Three things earn $200 deposit earn-back credit: (1) Direct conversation with homeowner about the Veteran's Next Home™ benefit, (2) Homeowner scans QR code from packet and views personalized benefit page, (3) Homeowner schedules consultation appointment. Only ONE of these is required per opportunity to earn the credit.",
      },
      {
        q: "Can I stop after fewer than 3 visits?",
        a: "Yes. If you have a conversation on Visit 1 or 2, log it immediately and you've completed the protocol for that opportunity. The $200 credit is earned at that point. However, if you get no answer, you must complete all 3 visits or log a conversation to fulfill the commitment.",
      },
      {
        q: "What if I connect with the homeowner on Visit 1 or 2?",
        a: "Immediately log the conversation with detailed notes about what was discussed and the homeowner's reaction. This is your $200 earn-back trigger. You do NOT need to return for additional visits. Update the opportunity status to reflect the engagement level.",
      },
      {
        q: "How do I log the packets and visits in the CRM?",
        a: "When you click 'Log Update' on an opportunity, use the Door-Knock Outcome Logger. Select the visit number (Packet Visit 1/2/3) or conversation/QR scan. Set your follow-up date for the next visit. The system tracks your visits and ensures you stay accountable to the 3-strike rule.",
      },
      {
        q: "What happens after 3 packet drops with no conversation?",
        a: "The opportunity is marked as 'worked.' If a QR code from one of your packets is scanned later, you still earn the $200 credit retroactively. The packet is your sales tool — it contains the benefit amount, rep code, and QR link. Make sure it's professional and visible.",
      },
      {
        q: "Can I set calendar reminders for follow-up visits?",
        a: "Yes. When you log a packet visit, you can set a follow-up date and time. The system will prompt you to add it to your calendar. This keeps you disciplined and ensures you show up on schedule.",
      },
    ],
  },
  {
    category: "Deposit Earn-Back Mechanics",
    items: [
      {
        q: "How exactly do I earn the $2,000 deposit back?",
        a: "You earn $200 for each verified action (conversation, QR scan, or consultation booking). 10 verified actions = $2,000 deposit fully earned back. The rebate is completed when you hit $2,000 total or 10 qualifying actions — whichever comes first.",
      },
      {
        q: "Does every conversation count as $200?",
        a: "Yes. Any direct conversation with the homeowner about the Veteran's Next Home™ benefit counts as one $200 credit. It doesn't matter if it happens on Visit 1, 2, 3, or later — if you talk to them, log it.",
      },
      {
        q: "If a homeowner scans the QR code from my packet, do I get credit?",
        a: "Yes. When they scan the QR code and view their personalized benefit page, that counts as one verified action. The system tracks QR scans, so you get the credit automatically.",
      },
      {
        q: "What if I drop off 10 packets but only 1 gets scanned?",
        a: "You earn $200 for that 1 scan. The other 9 packets didn't result in verified actions. The deposit incentive is built around verification — the homeowner taking action (conversation, scan, or booking), not just your effort.",
      },
    ],
  },
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
    category: "Reporting & Accountability",
    items: [
      {
        q: "Why is detailed CRM documentation so critical?",
        a: "Documentation proves execution. Every visit, conversation, and outcome must be logged with date, time, and details. This creates accountability, prevents disputes, and ensures the office can verify that the protocol was followed. It's your defense if questions arise.",
      },
      {
        q: "What should I include in my visit notes?",
        a: "For packet visits: date, time, address, whether anyone answered, condition of door/property. For conversations: date, time, homeowner name, key points discussed, their reaction (interested/not interested/callback needed), next steps. This detail demonstrates disciplined execution.",
      },
      {
        q: "What happens if I don't log visits?",
        a: "Unlogged visits don't count. The CRM is the single source of truth. If your work isn't documented, it didn't happen from the office perspective. You won't earn deposit credit, and you lose proof of your effort.",
      },
      {
        q: "Can the homeowner's QR scan happen weeks after I drop the packet?",
        a: "Yes. The packet is designed to work long-term. If you drop a packet on Visit 1 and the homeowner scans the QR code 3 weeks later after reviewing it, you still earn the $200 credit. That's why the packet design is critical.",
      },
      {
        q: "How do I know if my QR code was scanned?",
        a: "When a homeowner scans the QR code, the system logs it immediately and marks the opportunity as 'QR scanned.' You'll see this in your dashboard. Congratulations — you've earned your $200 earn-back credit.",
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