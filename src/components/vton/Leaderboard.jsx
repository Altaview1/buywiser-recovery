import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Trophy, Medal } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const MEDAL_COLORS = ["#F59E0B", "#94A3B8", "#B45309"]; // gold, silver, bronze

export default function Leaderboard({ currentPartnerEmail, currentPartnerVerified }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const partners = await base44.entities.PartnerApplication.filter({ status: "approved" }, "-verified_conversations", 50);
      setLeaders(partners);
      setLoading(false);
    };
    load();
  }, []);

  const myRank = leaders.findIndex(p => p.email === currentPartnerEmail) + 1;
  const topCount = leaders[0]?.verified_conversations || 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-2" style={{ background: NAVY }}>
        <Trophy className="h-4 w-4 text-amber-400" />
        <p className="text-xs font-black uppercase tracking-widest text-white/80">Top Performers</p>
        <span className="ml-auto text-xs text-white/40">Verified Conversations</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-5 h-5 border-4 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
        </div>
      ) : leaders.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-8">No data yet.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {leaders.slice(0, 10).map((partner, i) => {
            const isMe = partner.email === currentPartnerEmail;
            const count = partner.verified_conversations || 0;
            const barPct = topCount > 0 ? Math.round((count / topCount) * 100) : 0;
            const medal = i < 3 ? MEDAL_COLORS[i] : null;

            return (
              <div key={partner.id}
                className={`px-5 py-3 flex items-center gap-3 transition ${isMe ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                {/* Rank */}
                <div className="w-6 flex-shrink-0 text-center">
                  {medal ? (
                    <Medal className="h-4 w-4 mx-auto" style={{ color: medal }} />
                  ) : (
                    <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                  )}
                </div>

                {/* Name + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm font-semibold truncate ${isMe ? "text-blue-700" : "text-slate-800"}`}>
                      {isMe ? "You" : partner.name}
                      {isMe && <span className="ml-1.5 text-xs font-normal text-blue-500">← you</span>}
                    </p>
                    <span className={`text-sm font-black ml-2 flex-shrink-0 ${isMe ? "text-blue-700" : "text-slate-700"}`}>
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${barPct}%`, background: isMe ? "#3B82F6" : medal ? medal : "#CBD5E1" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Current partner rank if outside top 10 */}
      {myRank > 10 && (
        <div className="border-t-2 border-dashed border-slate-200 px-5 py-3 flex items-center gap-3 bg-blue-50">
          <div className="w-6 flex-shrink-0 text-center">
            <span className="text-xs font-bold text-blue-500">#{myRank}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-blue-700">You</p>
              <span className="text-sm font-black text-blue-700">{currentPartnerVerified}</span>
            </div>
            <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-blue-400"
                style={{ width: `${topCount > 0 ? Math.round((currentPartnerVerified / topCount) * 100) : 0}%` }} />
            </div>
          </div>
        </div>
      )}

      {myRank > 0 && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-500 text-center">
            You're ranked <strong className="text-slate-700">#{myRank}</strong> out of <strong className="text-slate-700">{leaders.length}</strong> active partners
          </p>
        </div>
      )}
    </div>
  );
}