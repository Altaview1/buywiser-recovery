import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

export default function MetaAudienceStatus() {
  const [qualifiedLeads, setQualifiedLeads] = useState(0);
  const [estimatedMatches, setEstimatedMatches] = useState(0);
  const [loading, setLoading] = useState(true);

  const META_MINIMUM = 1000;
  const MATCH_RATE = 0.68; // Conservative 68% match rate

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const leads = await base44.entities.VTONLead.list();
        // Filter: priority ≥40, not suppressed
        const qualified = leads.filter(
          l => (l.contact_priority_score || 0) >= 40 && l.suppression_status === 'active'
        );
        
        const count = qualified.length;
        const estimated = Math.floor(count * MATCH_RATE);
        
        setQualifiedLeads(count);
        setEstimatedMatches(estimated);
      } catch (err) {
        console.error('Failed to fetch leads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const meetsMinimum = estimatedMatches >= META_MINIMUM;
  const percentageOfGoal = Math.round((estimatedMatches / META_MINIMUM) * 100);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-600">Meta Audience Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-8 bg-blue-200 rounded w-24"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 transition-colors ${
      meetsMinimum 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
        : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-700">Meta Audience Readiness</CardTitle>
          {meetsMinimum ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status Badge */}
        <div>
          {meetsMinimum ? (
            <Badge className="bg-green-600 text-white">✓ Ready for Meta Ads</Badge>
          ) : (
            <Badge className="bg-amber-600 text-white">⚠ Below Minimum</Badge>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-white rounded-lg p-2 border border-slate-200">
            <div className="text-xs text-slate-600 font-medium">Qualified</div>
            <div className="text-lg font-bold text-slate-900">{qualifiedLeads.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200">
            <div className="text-xs text-slate-600 font-medium">Est. Matched</div>
            <div className="text-lg font-bold text-slate-900">{estimatedMatches.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg p-2 border border-slate-200">
            <div className="text-xs text-slate-600 font-medium">Needed</div>
            <div className={`text-lg font-bold ${meetsMinimum ? 'text-green-600' : 'text-amber-600'}`}>
              {Math.max(0, META_MINIMUM - estimatedMatches).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">Progress to 1,000 minimum</span>
            <span className={`text-xs font-bold ${meetsMinimum ? 'text-green-600' : 'text-amber-600'}`}>
              {percentageOfGoal}%
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-2 border border-slate-200 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                meetsMinimum ? 'bg-green-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, percentageOfGoal)}%` }}
            />
          </div>
        </div>

        {/* Message */}
        <div className="bg-white rounded-lg p-2.5 border border-slate-200">
          {meetsMinimum ? (
            <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />
              You have enough matched contacts to launch Meta ads! 🎯
            </p>
          ) : (
            <p className="text-xs text-amber-700 font-medium">
              Need {META_MINIMUM - estimatedMatches} more matched contacts. Continue importing leads to reach minimum.
            </p>
          )}
        </div>

        {/* Note */}
        <p className="text-xs text-slate-500 italic">
          Based on {(MATCH_RATE * 100).toFixed(0)}% Meta match rate for email hashes
        </p>
      </CardContent>
    </Card>
  );
}