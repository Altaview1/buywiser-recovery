import { TrendingUp, Zap, Users, Target } from "lucide-react";

export default function LeadsSummaryCard({ leads }) {
  // Calculate key metrics
  const totalLeads = leads.length;
  const activeLeads = leads.filter(l => !["Closed", "Lost"].includes(l.status)).length;
  const contactedLeads = leads.filter(l => l.status === "Contacted").length;
  const qualifiedLeads = leads.filter(l => l.status === "Qualified").length;
  
  // New this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const newThisWeek = leads.filter(l => new Date(l.created_date) > weekAgo).length;
  
  // Contact rate
  const contactRate = totalLeads > 0 ? Math.round((contactedLeads / totalLeads) * 100) : 0;
  
  // Qualification rate
  const qualificationRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Active Leads */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Active Leads</p>
              <p className="text-3xl font-black text-white mt-1">{activeLeads}</p>
            </div>
            <Users className="h-6 w-6 text-blue-400 flex-shrink-0 opacity-70" />
          </div>
          <p className="text-xs text-white/60">{totalLeads} total leads</p>
        </div>

        {/* New This Week */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">New This Week</p>
              <p className="text-3xl font-black text-white mt-1">{newThisWeek}</p>
            </div>
            <Zap className="h-6 w-6 text-amber-400 flex-shrink-0 opacity-70" />
          </div>
          <p className="text-xs text-white/60">Last 7 days</p>
        </div>

        {/* Contact Rate */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Contact Rate</p>
              <p className="text-3xl font-black text-white mt-1">{contactRate}%</p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-400 flex-shrink-0 opacity-70" />
          </div>
          <p className="text-xs text-white/60">{contactedLeads} contacted</p>
        </div>

        {/* Qualification Rate */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Qualification Rate</p>
              <p className="text-3xl font-black text-white mt-1">{qualificationRate}%</p>
            </div>
            <Target className="h-6 w-6 text-purple-400 flex-shrink-0 opacity-70" />
          </div>
          <p className="text-xs text-white/60">{qualifiedLeads} qualified</p>
        </div>
      </div>
    </div>
  );
}