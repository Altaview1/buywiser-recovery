import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Home, TrendingUp, RefreshCw, Calendar, X, Loader2, ChevronRight, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeadDetailModal from '@/components/LeadDetailModal';

const COLOR_MAP = {
  blue:   { bar: 'bg-blue-500',   text: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  indigo: { bar: 'bg-indigo-500', text: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  green:  { bar: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-100' },
  amber:  { bar: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-100' },
  red:    { bar: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-100' },
};

function DOMBucketModal({ bucket, onClose }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    base44.functions.invoke('getVALoanListingsByDOM', { domBucket: bucket })
      .then(res => { 
        setLeads(res.data.leads || []); 
        setLoading(false); 
      })
      .catch(err => { 
        setError(err.message); 
        setLoading(false); 
      });
  }, [bucket]);

  if (selectedLead) {
    return <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 sticky top-4">
          <X className="h-5 w-5" />
        </button>

        {loading && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
            <p className="text-slate-500 text-sm">Loading leads...</p>
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-red-500 text-sm">{error}</div>
        )}

        {!loading && (
          <>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">VA Listings</h2>
              <p className="text-xs text-slate-500 mt-0.5">{leads.length} properties · Click to view details</p>
            </div>

            <div className="space-y-2">
              {leads.map((lead) => {
                const getDOMBadge = (days) => {
                  if (days <= 7) return { bg: 'bg-blue-100', text: 'text-blue-800', label: '🔥 HOT' };
                  if (days <= 14) return { bg: 'bg-green-100', text: 'text-green-800', label: '✨ NEW' };
                  if (days <= 30) return { bg: 'bg-amber-100', text: 'text-amber-800', label: days + 'd' };
                  return { bg: 'bg-slate-100', text: 'text-slate-700', label: days + 'd' };
                };
                const badge = getDOMBadge(lead.domDays);
                return (
                  <button
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">{lead.name}</p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {lead.address}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-1 flex-shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>

            {leads.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-sm">No leads in this bucket</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function PropertyRadarDashboard() {
  const [domSummary, setDomSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState(null);

  useEffect(() => {
    base44.functions.invoke('getVALoanListingsByDOM', {})
      .then(res => { 
        setDomSummary(res.data); 
        setLoading(false); 
      })
      .catch(err => { 
        console.error(err);
        setLoading(false); 
      });
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await base44.functions.invoke('getVALoanListingsByDOM', {})
      .then(res => setDomSummary(res.data))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Home className="h-6 w-6 text-blue-600" /> CA VA Loan Listings
            </h1>
            <p className="text-slate-500 text-sm mt-1">Properties with actual VA financing · Organized by Days on Market</p>
          </div>
          <Button onClick={handleRefresh} disabled={loading} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Total Count */}
        {domSummary && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-700">{domSummary.total_va_listings}</div>
              <p className="text-slate-500 text-sm mt-2">Active VA Loan Listings (0-90 days on market)</p>
            </div>
          </div>
        )}

        {/* DOM Buckets */}
        {domSummary && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Breakdown by Days on Market</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {domSummary.summary.map((bucket) => {
                const colorMap = {
                  blue: 'bg-blue-50 border-blue-200 hover:border-blue-400',
                  indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
                  green: 'bg-green-50 border-green-200 hover:border-green-400',
                  amber: 'bg-amber-50 border-amber-200 hover:border-amber-400',
                  red: 'bg-red-50 border-red-200 hover:border-red-400',
                };
                const textMap = {
                  blue: 'text-blue-700',
                  indigo: 'text-indigo-700',
                  green: 'text-green-700',
                  amber: 'text-amber-700',
                  red: 'text-red-700',
                };
                return (
                  <button
                    key={bucket.bucket}
                    onClick={() => setSelectedBucket(bucket.bucket)}
                    className={`rounded-xl border p-5 text-left transition-all cursor-pointer group ${colorMap[bucket.color]}`}
                  >
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">{bucket.label}</p>
                    <div className={`text-3xl font-bold ${textMap[bucket.color]}`}>{bucket.count}</div>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      {bucket.percentage}% of total <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-xs text-slate-400 text-center mt-8">Key Criteria: CA State · VA Loan Present · Listing Status Active</p>
      </div>

      {/* DOM Bucket drill-down modal */}
      {selectedBucket && (
        <DOMBucketModal bucket={selectedBucket} onClose={() => setSelectedBucket(null)} />
      )}
    </div>
  );
}