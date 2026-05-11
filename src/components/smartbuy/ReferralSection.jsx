import { useState } from "react";
import { Users, Gift, Copy, CheckCircle, Mail, Share2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SocialPostGenerator from "./SocialPostGenerator";

const REFERRAL_BONUS = 500; // Cash bonus earned per successful referral

export default function ReferralSection({ userEmail, savingsPool }) {
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sending, setSending] = useState(false);

  const referralLink = `https://buywiser.com/smartbuy?ref=${encodeURIComponent(userEmail || "user")}`;
  const bonusCash = referrals.filter(r => r.status === "completed").length * REFERRAL_BONUS;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async () => {
    if (!recipientEmail) return;
    setSending(true);

    try {
      await base44.functions.invoke("sendReferralInvite", {
        senderEmail: userEmail,
        recipientEmail,
        referralLink,
      }).catch(() => {});

      setReferrals(prev => [...prev, { email: recipientEmail, status: "invited", date: new Date().toISOString() }]);
      setRecipientEmail("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="px-4 sm:px-6 py-16 border-t border-slate-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-300 mb-3">
            <Gift className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Earn Bonus Cash</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Refer Friends & Earn Rewards</h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            Share your referral link with friends. When they complete their first transaction, you both earn bonus cash added to your savings pools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Referral Link */}
          <div className="lg:col-span-2 space-y-4">
            {/* Share Link Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Your Referral Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono text-slate-600 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-4 py-3 rounded-xl font-black text-sm transition whitespace-nowrap ${
                    copied
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : "bg-slate-900 text-white hover:bg-slate-800 border border-slate-700"
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Share this link to invite friends to SmartBuy™</p>
            </div>

            {/* Invite Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 text-white font-black rounded-xl text-sm hover:bg-blue-700 transition"
              >
                <Mail className="h-4 w-4" /> Send Invite
              </button>
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out SmartBuy™ from BuyWiser - AI-guided home buying with real experts. ${referralLink}`)}`, "_blank")}
                className="flex items-center justify-center gap-2 px-5 py-3.5 border-2 border-blue-600 text-blue-600 font-black rounded-xl text-sm hover:bg-blue-50 transition"
              >
                <Share2 className="h-4 w-4" /> Share on X
              </button>
            </div>

            {/* Social Media Posts */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-xs font-black uppercase tracking-widest text-slate-600 mb-3">📱 Share on Social</p>
              <SocialPostGenerator userEmail={userEmail} referralLink={referralLink} />
            </div>

            {/* Referral Activity */}
            {referrals.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-xs font-black uppercase tracking-widest text-slate-600 mb-3">Recent Invites</p>
                <div className="space-y-2">
                  {referrals.map((ref, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Users className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{ref.email}</p>
                          <p className="text-[10px] text-slate-500">
                            {new Date(ref.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap ml-2 ${
                        ref.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {ref.status === "completed" ? "Completed ✓" : "Invited"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Bonus Summary */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-300 rounded-2xl p-6 h-fit">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-3">Referral Rewards</p>
            <div className="mb-5">
              <p className="text-[10px] text-slate-600 mb-2">Bonus per referral</p>
              <p className="text-3xl font-black text-emerald-600">${REFERRAL_BONUS.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 mt-1">cash per completed transaction</p>
            </div>

            <div className="border-t-2 border-emerald-200 pt-5">
              <p className="text-[10px] text-slate-600 mb-1">Your earned bonus</p>
              <p className="text-2xl font-black text-emerald-700">${bonusCash.toLocaleString()}</p>
              <p className="text-[10px] text-slate-600 mt-2">from {referrals.filter(r => r.status === "completed").length} completed referral{referrals.filter(r => r.status === "completed").length !== 1 ? "s" : ""}</p>
            </div>

            <div className="mt-5 p-3 bg-white rounded-xl border border-emerald-200">
              <p className="text-xs font-semibold text-slate-800 mb-1">Total Pool + Bonus</p>
              <p className="text-xl font-black text-slate-900">
                ${(savingsPool + bonusCash).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Available at closing</p>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-blue-100 border border-blue-300">
              <p className="text-[10px] font-bold text-blue-900 leading-relaxed">
                ✓ No caps on referral bonuses · Unlimited earning potential · Cash applied at closing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Send Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-black text-slate-900 mb-1">Send Referral Invite</h3>
            <p className="text-xs text-slate-500 mb-4">Share the SmartBuy™ opportunity with a friend</p>

            <div className="mb-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">
                Friend's Email
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="friend@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-black text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                disabled={!recipientEmail || sending}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-black text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-3.5 w-3.5" /> Send Invite
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}