import { useState, useEffect } from "react";
import { User, Gift, Users, Zap, Calendar, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { usePageTitle } from "@/lib/usePageTitle";

const REFERRAL_BONUS = 500; // Tokens earned per successful referral

export default function MyProfile() {
  usePageTitle("My Profile | BuyWiser SmartBuy™");

  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Get current user
        const currentUser = await base44.auth.me();
        if (!currentUser) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }
        setUser(currentUser);

        // Fetch referrals where user is the referrer
        const userReferrals = await base44.entities.Referral.filter(
          { referrer_email: currentUser.email },
          "-completed_date",
          100
        );
        setReferrals(userReferrals || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const completedReferrals = referrals.filter(r => r.status === "completed");
  const pendingReferrals = referrals.filter(r => r.status === "pending");
  const totalTokensEarned = completedReferrals.length * REFERRAL_BONUS;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-amber-900">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border-2 border-red-300 p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-black text-red-700">Error Loading Profile</h2>
          </div>
          <p className="text-sm text-red-600">{error || "Please sign in to view your profile."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-3 border-amber-400 flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-amber-700" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-amber-900">{user.full_name}</h1>
              <p className="text-sm text-amber-700 mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Tokens Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-emerald-600" />
              <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Tokens Earned</p>
            </div>
            <p className="text-4xl font-black text-emerald-700">{totalTokensEarned.toLocaleString()}</p>
            <p className="text-[10px] text-emerald-600 mt-1">{completedReferrals.length} completed referral{completedReferrals.length !== 1 ? "s" : ""}</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <p className="text-xs font-black uppercase tracking-widest text-blue-700">Pending Referrals</p>
            </div>
            <p className="text-4xl font-black text-blue-700">{pendingReferrals.length}</p>
            <p className="text-[10px] text-blue-600 mt-1">Awaiting signup completion</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-violet-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="h-5 w-5 text-violet-600" />
              <p className="text-xs font-black uppercase tracking-widest text-violet-700">Potential Bonus</p>
            </div>
            <p className="text-4xl font-black text-violet-700">{(pendingReferrals.length * REFERRAL_BONUS).toLocaleString()}</p>
            <p className="text-[10px] text-violet-600 mt-1">If all pending convert</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Referral History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border-2 border-yellow-300 p-6">
              <h2 className="text-xl font-black text-amber-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" /> Referral History
              </h2>

              {referrals.length === 0 ? (
                <div className="text-center py-10">
                  <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-semibold mb-1">No referrals yet</p>
                  <p className="text-sm text-slate-500 mb-4">Start sharing your SmartBuy™ link to earn bonus tokens.</p>
                  <a href="/smartbuy" className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-amber-900 font-black rounded-lg hover:bg-yellow-300 transition text-sm">
                    View SmartBuy™
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {referrals.map(ref => (
                    <div
                      key={ref.id}
                      className={`rounded-xl border-2 p-4 ${
                        ref.status === "completed"
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-amber-200 bg-amber-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{ref.referred_email}</p>
                          <p className="text-xs text-slate-600 mt-1">
                            Referral Code: <span className="font-mono font-semibold">{ref.referral_code}</span>
                          </p>
                        </div>
                        <span
                          className={`flex-shrink-0 text-[10px] font-black uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${
                            ref.status === "completed"
                              ? "bg-emerald-200 text-emerald-800"
                              : "bg-amber-200 text-amber-800"
                          }`}
                        >
                          {ref.status === "completed" ? "✓ Completed" : "Pending"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(ref.created_date).toLocaleDateString()}
                        </div>
                        {ref.completed_date && (
                          <>
                            <span className="text-slate-400">•</span>
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">{ref.tokens_awarded} tokens awarded</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links Sidebar */}
          <div className="space-y-4">
            {/* Token Tutorial Link */}
            <div className="bg-white rounded-2xl border-2 border-purple-300 p-6">
              <h3 className="text-lg font-black text-purple-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">📚</span> Learn More
              </h3>
              <a
                href="/token-rewind"
                className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50 border border-purple-200 hover:border-purple-400 hover:bg-purple-100 transition mb-3"
              >
                <span className="text-sm font-bold text-purple-900">Token Rewind™ Guarantee</span>
                <ExternalLink className="h-4 w-4 text-purple-600" />
              </a>

              <a
                href="/marketplace"
                className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-400 hover:bg-blue-100 transition"
              >
                <span className="text-sm font-bold text-blue-900">Services Marketplace</span>
                <ExternalLink className="h-4 w-4 text-blue-600" />
              </a>
            </div>

            {/* Referral Link Card */}
            <div className="bg-white rounded-2xl border-2 border-green-300 p-6">
              <h3 className="text-sm font-black text-green-900 mb-3 flex items-center gap-2">
                <Gift className="h-4 w-4" /> Share & Earn
              </h3>
              <p className="text-[10px] text-slate-600 mb-2">Invite friends and earn 500 tokens per successful referral.</p>
              <a
                href="/smartbuy"
                className="inline-block w-full px-4 py-2.5 bg-green-500 text-white font-black rounded-lg hover:bg-green-600 transition text-center text-sm"
              >
                View Referral Links
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}