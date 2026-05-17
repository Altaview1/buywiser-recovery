import { useState } from "react";
import { Copy, CheckCircle, Gift, Linkedin, Share2, Mail, ArrowRight, DollarSign, Users, Home, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SmartBuyNavMenu from "@/components/SmartBuyNavMenu";

const STEPS = [
  {
    n: "01",
    icon: "🔗",
    title: "Share Your Referral Link",
    desc: "Copy your unique link below and share it with anyone buying a home in California.",
  },
  {
    n: "02",
    icon: "🏠",
    title: "They Start SmartBuy™",
    desc: "Your friend submits a property, gets pre-qualified, and begins the SmartBuy guided workflow.",
  },
  {
    n: "03",
    icon: "💵",
    title: "You Both Earn $500",
    desc: "When their transaction closes, $500 is added to YOUR closing credit pool — and they get $500 too.",
  },
];

const SHARE_GUIDELINES = [
  { icon: "✍️", text: "Write at least 200 characters about your experience with Buywiser SmartBuy™" },
  { icon: "📸", text: "Add a screenshot or video of your savings estimate (optional but recommended)" },
  { icon: "🔗", text: "Include your referral link in the post" },
  { icon: "♾️", text: "No cap — refer as many friends as you want. Every closed deal earns you $500." },
];

export default function ReferralProgram() {
  const [email, setEmail] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [sending, setSending] = useState(false);

  const generateLink = () => {
    if (!email) return;
    const link = `https://buywiser.com/smartbuy?ref=${encodeURIComponent(email)}`;
    setReferralLink(link);
    setGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const linkedInText = encodeURIComponent(
    `I've been using SmartBuy™ by BuyWiser to navigate buying a home in California — and the savings potential is real. They coordinate mortgage, real estate, and closing costs together so buyers actually keep more money. If you're buying in CA, check it out: ${referralLink}`
  );
  const twitterText = encodeURIComponent(
    `Buying a home in California? Check out SmartBuy™ by @BuyWiser — AI-guided home buying designed to save buyers thousands at closing. ${referralLink}`
  );

  const handleSendInvite = async () => {
    if (!inviteEmail || !email) return;
    setSending(true);
    try {
      await base44.functions.invoke("sendReferralInvite", {
        senderEmail: email,
        recipientEmail: inviteEmail,
        referralLink,
      }).catch(() => {});
      setInviteSent(true);
      setInviteEmail("");
      setTimeout(() => setInviteSent(false), 3000);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <SmartBuyNavMenu />

      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/">
            <img
              src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
              alt="BuyWiser"
              className="h-8 w-auto"
            />
          </a>
          <a href="/smartbuy" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition">
            ← Back to SmartBuy™
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-b border-slate-100 py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-300 mb-5">
            <Gift className="h-4 w-4 text-emerald-700" />
            <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">Buywiser Referral Program</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-4">
            Share Buywiser.<br />
            <span className="text-emerald-600">Earn $500</span> at Closing.
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Refer a friend who buys a home through SmartBuy™ and <strong>you both receive a $500 closing credit</strong> — automatically added to your savings pool. No limits. No expiration.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Simple Process</p>
            <h2 className="text-2xl font-black text-slate-900">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map(({ n, icon, title, desc }) => (
              <div key={n} className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">{n}</div>
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-sm font-black text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward callout */}
      <section className="py-10 px-4 sm:px-6 bg-emerald-600">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="text-emerald-100 text-sm font-semibold mb-1">Per successful referral</p>
            <p className="text-white text-5xl font-black">$500</p>
            <p className="text-emerald-200 text-sm mt-1">Added as a closing credit to your SmartBuy™ pool</p>
          </div>
          <div className="h-px sm:h-16 sm:w-px bg-emerald-500 w-full sm:w-auto" />
          <div>
            <p className="text-emerald-100 text-sm font-semibold mb-1">Your friend also earns</p>
            <p className="text-white text-5xl font-black">$500</p>
            <p className="text-emerald-200 text-sm mt-1">When their transaction closes</p>
          </div>
          <div className="h-px sm:h-16 sm:w-px bg-emerald-500 w-full sm:w-auto" />
          <div>
            <p className="text-emerald-100 text-sm font-semibold mb-1">Maximum referrals</p>
            <p className="text-white text-5xl font-black">∞</p>
            <p className="text-emerald-200 text-sm mt-1">No cap. Refer as many as you want.</p>
          </div>
        </div>
      </section>

      {/* Get Your Link */}
      <section className="py-14 px-4 sm:px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Step 1</p>
            <h2 className="text-2xl font-black text-slate-900">Get Your Referral Link</h2>
            <p className="text-slate-500 text-sm mt-1">Enter your email to generate your unique shareable link.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            {!generated ? (
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  onClick={generateLink}
                  disabled={!email}
                  className="px-6 py-3 bg-emerald-600 text-white font-black rounded-xl text-sm hover:bg-emerald-700 transition disabled:opacity-40"
                >
                  Generate <ArrowRight className="inline h-3.5 w-3.5 ml-1" />
                </button>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Your Unique Link</p>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-600 focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-4 py-3 rounded-xl font-black text-sm transition whitespace-nowrap ${
                      copied
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {copied ? <><CheckCircle className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                  </button>
                </div>

                {/* Share buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}&summary=${linkedInText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0077b5] text-white font-black rounded-xl text-sm hover:bg-[#006399] transition"
                  >
                    <Linkedin className="h-4 w-4" /> Share on LinkedIn
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${twitterText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white font-black rounded-xl text-sm hover:bg-slate-700 transition"
                  >
                    <Share2 className="h-4 w-4" /> Share on X
                  </a>
                </div>

                {/* Send direct invite */}
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Or Send a Direct Invite</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="friend@email.com"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <button
                      onClick={handleSendInvite}
                      disabled={!inviteEmail || sending}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white font-black rounded-xl text-sm hover:bg-emerald-700 transition disabled:opacity-40"
                    >
                      {inviteSent ? <><CheckCircle className="h-3.5 w-3.5" /> Sent!</> : <><Mail className="h-3.5 w-3.5" /> Send</>}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Sharing Guidelines */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Guidelines</p>
            <h2 className="text-2xl font-black text-slate-900">Sharing Guidelines</h2>
            <p className="text-slate-500 text-sm mt-1">To qualify for the $500 closing credit, referrals must result in a closed transaction through Buywiser.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SHARE_GUIDELINES.map(({ icon, text }, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14 px-4 sm:px-6 bg-slate-900 text-white text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-3">Start Earning Today</p>
          <h2 className="text-3xl font-black mb-4">Every Referral = $500 at Closing</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Share SmartBuy™ with anyone considering buying a home in California. There's no better time — and no better reward.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl text-base transition"
          >
            Get My Referral Link <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-xs text-slate-500 mt-5">
            BuyWiser Technology, Inc. · NMLS #1887767 · CA DRE #01107013<br />
            Closing credit applied at settlement. Subject to transaction terms. No cash equivalent.
          </p>
        </div>
      </section>
    </div>
  );
}