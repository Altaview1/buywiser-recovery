import { useState, useEffect } from "react";
import { Users, Gift, Copy, CheckCircle, Mail, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

function generateReferralCode(email) {
  const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `REF-${hash}`;
}

export default function ReferralDashboard({ userEmail }) {
  const [referrals, setReferrals] = useState([]);
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

  // Initialize referral code on mount
  useEffect(() => {
    const initReferral = async () => {
      try {
        const existing = await base44.entities.Referral.filter({
          referrer_email: userEmail
        });

        if (existing && existing.length > 0) {
          const code = existing[0].referral_code;
          setReferralCode(code);
          setReferralLink(`${window.location.origin}/?ref=${code}`);
          setReferrals(existing);
        } else {
          // Create new referral record
          const newCode = generateReferralCode(userEmail);
          await base44.entities.Referral.create({
            referrer_email: userEmail,
            referral_code: newCode,
            status: 'pending'
          });
          setReferralCode(newCode);
          setReferralLink(`${window.location.origin}/?ref=${newCode}`);
        }
      } catch (error) {
        console.error('Error initializing referral:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) initReferral();
  }, [userEmail]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async () => {
    if (!inviteEmail) return;
    setInviting(true);

    try {
      await base44.functions.invoke("sendReferralInvite", {
        recipientEmail: inviteEmail,
        referralLink: referralLink,
        referrerName: userEmail.split("@")[0]
      });
      setInviteMessage("✓ Invite sent!");
      setInviteEmail("");
      setTimeout(() => setInviteMessage(""), 2000);
    } catch (error) {
      setInviteMessage("Error sending invite");
    } finally {
      setInviting(false);
    }
  };

  const completedReferrals = referrals.filter(r => r.status === 'completed');
  const bonusTokens = completedReferrals.length * 50;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Gift className="h-5 w-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-black text-emerald-900">Earn Bonus Tokens</h2>
        </div>
        <p className="text-sm text-emerald-800">Share your referral link and earn 50 bonus tokens for each friend who signs up.</p>
      </div>

      {/* Your Referral Link */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <p className="text-xs font-black uppercase tracking-widest text-slate-600 mb-3">Your Referral Link</p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-sm text-slate-700 font-mono"
          />
          <button
            onClick={handleCopyLink}
            className={`px-4 py-3 rounded-xl font-black text-sm transition flex items-center gap-1.5 ${
              copied
                ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                : "bg-slate-900 text-white hover:bg-slate-800 border border-slate-700"
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy
              </>
            )}
          </button>
        </div>

        {/* Share via Email */}
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-widest text-slate-600 mb-2">Or Send an Invite</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="friend@example.com"
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleSendInvite}
              disabled={!inviteEmail || inviting}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition flex items-center gap-1.5 disabled:opacity-40"
            >
              {inviting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              Send
            </button>
          </div>
          {inviteMessage && (
            <p className={`text-xs font-bold ${inviteMessage.includes("✓") ? "text-emerald-600" : "text-red-600"}`}>
              {inviteMessage}
            </p>
          )}
        </div>
      </div>

      {/* Bonus Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-emerald-600">{bonusTokens}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Bonus Tokens</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-slate-900">{completedReferrals.length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Completed</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-slate-900">{referrals.length - completedReferrals.length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Pending</p>
        </div>
      </div>

      {/* Referral History */}
      {referrals.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="text-xs font-black uppercase tracking-widest text-slate-600 mb-4">Referral Activity</p>
          <div className="space-y-2">
            {referrals.map(ref => (
              <div key={ref.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-slate-900">{ref.referred_email || "Pending signup"}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{new Date(ref.created_date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-2 py-1 rounded-full ${
                    ref.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {ref.status === 'completed' ? '✓ Completed' : 'Pending'}
                  </span>
                  {ref.status === 'completed' && (
                    <span className="text-xs font-bold text-emerald-600">+50</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}