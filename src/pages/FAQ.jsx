import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const FAQS = [
  {
    category: "VTON Door-Knock Protocol (For Partner Agents)",
    items: [
      {
        q: "What is the 3-Strike Door-Knock Protocol?",
        a: "The 3-Strike Protocol governs how you execute door-to-door outreach for VTON opportunities. You have exactly 3 attempts to contact the homeowner. Each visit must be logged with a specific outcome. The protocol ensures disciplined execution and clear documentation for rebate completion. Think of it as a military operation plan: clear objectives, precise timing, documented execution.",
      },
      {
        q: "What happens on Visit 1 (First Knock)?",
        a: "Knock on the door and attempt contact. If the homeowner answers → have a conversation immediately about the Veteran's Next Home™ benefit. Show the QR code. Log 'Had Conversation' outcome and earn $200 immediately. If no answer → leave the benefit packet at the door with your rep code and QR code printed on it. Log 'Visit 1: Left Packet' with a scheduled follow-up date and set a calendar reminder.",
      },
      {
        q: "What happens on Visit 2 (Second Knock)?",
        a: "Return on your scheduled follow-up date from Visit 1 (set a calendar reminder when you log Visit 1). Again, attempt contact. If homeowner answers → log 'Had Conversation' and earn $200. If no answer → leave another packet. Log 'Visit 2: Left Packet' with a new follow-up date for Visit 3.",
      },
      {
        q: "What happens on Visit 3 (Final Knock)?",
        a: "This is your final opportunity. Return on the scheduled date from Visit 2. If homeowner answers → have a conversation and log the outcome. If no answer → leave the final packet. Log 'Visit 3: Left Packet (Final).' After 3 strikes, the opportunity is complete. If the homeowner later scans the QR code from any packet, you still earn the $200 credit.",
      },
      {
        q: "How do I earn the $200 deposit earn-back credit?",
        a: "You earn $200 per verified action. A verified action is: (1) A direct conversation logged in the system, OR (2) A homeowner QR code scan from a packet you left. You need only ONE verified action OR three complete visits to earn the deposit credit. The QR scan can happen weeks after you leave the packet—it still counts.",
      },
      {
        q: "What counts as a 'Had Conversation' outcome?",
        a: "When you reach the homeowner at the door and discuss the Veteran's Next Home™ benefit program. You show them the QR code, explain the estimated benefit amount for their property, answer initial questions, and provide your contact info. This immediately triggers a $200 deposit earn-back credit. Log detailed notes: homeowner reaction, questions asked, next steps discussed.",
      },
      {
        q: "What if the homeowner scans the QR code from a packet?",
        a: "When a homeowner scans the QR code from a packet you left, they see their personalized benefit page with estimated benefit amount, your profile card, and contact details. This scan automatically counts as a verified action earning $200 deposit credit. The system tracks the scan. You don't need to do anything—the QR scan triggers the credit automatically.",
      },
      {
        q: "What if the homeowner schedules a consultation after the conversation or QR scan?",
        a: "If they schedule an appointment with you or a Buywiser representative, the opportunity moves to 'Consultation Scheduled.' This is the highest outcome and indicates serious interest. Document the appointment date/time in your CRM notes. You've earned the $200 credit, and the opportunity is now in active qualification.",
      },
      {
        q: "How do I use calendar reminders for follow-ups?",
        a: "When you log 'Visit 1: Left Packet' or 'Visit 2: Left Packet,' the system asks for a follow-up date and time. Click 'Add to Calendar' immediately to create a calendar reminder on your phone or system. This ensures you return on schedule for the next visit. Disciplined follow-up separates high performers from poor performers.",
      },
      {
        q: "What happens if I don't follow the 3-Strike Protocol?",
        a: "The protocol exists to ensure consistent, professional execution. Skipping visits or missing follow-up dates breaks accountability. These opportunities remain incomplete and don't count toward your rebate completion rate. Your dashboard shows your Protocol Completion Rate (target: 85%). Stay disciplined.",
      },
    ],
  },
  {
    category: "Rebate Completion & Accountability",
    items: [
      {
        q: "How do I complete the rebate requirement on an opportunity?",
        a: "You complete the rebate requirement in ONE of two ways: (1) Execute all three door-knock visits (logged in the system), OR (2) Earn one verified action (conversation or QR scan). After completion, the opportunity moves to 'Completed' status and your $200 deposit earn-back credit is applied immediately. Track progress on your dashboard.",
      },
      {
        q: "What is 'Protocol Completion Rate' and why does it matter?",
        a: "Your Protocol Completion Rate measures the percentage of accepted opportunities where you executed the full protocol and earned the deposit credit. The VTON benchmark is 85% completion rate. This metric reflects your discipline and professional execution. High performers maintain 85%+ completion rates. Poor performers below 60% show lack of commitment.",
      },
      {
        q: "What happens if I forfeit an opportunity?",
        a: "If you decline an opportunity during the 48-hour decision window, it's marked 'Forfeited' and reassigned to another partner. Forfeited opportunities do NOT count toward your rebate metrics or completion rate. Accept opportunities strategically based on your territory and capacity to execute.",
      },
      {
        q: "How do I track my deposit earn-back progress?",
        a: "Your dashboard shows 'Deposit Earn-Back Progress' with a progress bar. Each verified action (conversation or QR scan) earns $200. Your maximum refund is $2,000 (10 verified actions). Track progress in real-time. Set targets: if you have 5 opportunities, aim for 5 verified actions to hit $1,000.",
      },
      {
        q: "What is the 1-in-10 Benchmark?",
        a: "Historically, approximately 1 in 10 meaningful veteran benefit conversations becomes a closed opportunity (consultation booked). This is not a guarantee—it's a framework for disciplined execution. If you execute properly on 10 opportunities, expect roughly 1 to convert to a scheduled consultation. Focus on execution, not conversion rates.",
      },
    ],
  },
  {
    category: "The Benefit",
    items: [
      {
        q: "What is the Buywiser 1.5 GAP Benefit™?",
        a: "It's a private Buywiser program that provides up to 1.5% back to qualifying veteran homeowners when their next home purchase is coordinated through Buywiser. It is not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency.",
      },
      {
        q: "How much can I receive?",
        a: "Up to 1.5% of your next home's purchase price. For example, on a $700,000 home that's up to $10,500. The exact amount depends on how the transaction is structured through Buywiser.",
      },
      {
        q: "Is this a government VA program?",
        a: "No. The Buywiser 1.5 GAP Benefit™ and Veteran's Next Home™ are private programs offered through Buywiser. They are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency.",
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
          Everything you need to know about the Veteran's Next Home™ program, the Buywiser 1.5 GAP Benefit™, and VTON partner execution requirements.
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
          Veteran's Next Home™ and the Buywiser 1.5 GAP Benefit™ are private programs offered through Buywiser. Not affiliated with or endorsed by the U.S. Department of Veterans Affairs.{" "}
          <Link to="/Disclosures" className="underline hover:text-slate-600">Licensing &amp; Disclosures</Link>
        </p>
      </section>
    </div>
  );
}