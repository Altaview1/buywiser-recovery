import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Home, TrendingUp, RefreshCw, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyRadarDashboard() {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [latest, setLatest] = useState(null);

  const loadSnapshots = async () => {
    const data = await base44.entities.PropertyRadarDailySnapshot.list('-snapshot_date', 30);
    const sorted = [...data].sort((a, b) => new Date(a.snapshot_date) - new Date(b.snapshot_date));
    setSnapshots(sorted);
    if (sorted.length > 0) setLatest(sorted[sorted.length - 1]);
    setLoading(false);
  };

  useEffect(() => { loadSnapshots(); }, []);

  const handleRefreshNow = async () => {
    setRefreshing(true);
    await base44.functions.invoke('dailyPropertyRadarCount', {});
    await loadSnapshots();
    setRefreshing(false);
  };

  const chartData = snapshots.map(s => ({
    date: new Date(s.snapshot_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Total Pool': s.total_pool_count || 0,
    'New Today': s.new_listings_count || 0,
  }));

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
              <Home className="h-6 w-6 text-blue-600" /> CA VA Listings Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">Active CA properties with VA loans · Updated daily</p>
          </div>
          <Button onClick={handleRefreshNow} disabled={refreshing} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Fetching...' : 'Refresh Now'}
          </Button>
        </div>

        {/* Today's Stats */}
        {latest && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide mb-2">
                <Calendar className="h-3.5 w-3.5" /> Latest Snapshot
              </div>
              <div className="text-2xl font-bold text-slate-800">
                {new Date(latest.snapshot_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
              <div className="flex items-center gap-2 text-blue-500 text-xs uppercase tracking-wide mb-2">
                <TrendingUp className="h-3.5 w-3.5" /> New Listings Today
              </div>
              <div className="text-4xl font-bold text-blue-700">{latest.new_listings_count ?? '—'}</div>
              <div className="text-xs text-blue-400 mt-1">0–1 days on market</div>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-100 p-5">
              <div className="flex items-center gap-2 text-green-500 text-xs uppercase tracking-wide mb-2">
                <Home className="h-3.5 w-3.5" /> Total Active Pool
              </div>
              <div className="text-4xl font-bold text-green-700">{(latest.total_pool_count || 0).toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">1–90 days on market</div>
            </div>
          </div>
        )}

        {/* Chart */}
        {chartData.length > 1 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">30-Day Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPool" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Total Pool" stroke="#16a34a" fill="url(#colorPool)" strokeWidth={2} />
                <Area type="monotone" dataKey="New Today" stroke="#2563eb" fill="url(#colorNew)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400 mb-6">
            Chart will appear after a few days of data. Come back tomorrow!
          </div>
        )}

        {/* History Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-800">Daily History</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">New Listings</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Total Pool</th>
              </tr>
            </thead>
            <tbody>
              {[...snapshots].reverse().map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-6 py-3 text-slate-700">
                    {new Date(s.snapshot_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-blue-700">{s.new_listings_count ?? '—'}</td>
                  <td className="px-6 py-3 text-right font-semibold text-green-700">{(s.total_pool_count || 0).toLocaleString()}</td>
                </tr>
              ))}
              {snapshots.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400">No snapshots yet. Click "Refresh Now" to capture today's data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400 text-center mt-4">Filters: CA · VA Loan · Active Listings · Preview mode (no charge to PropertyRadar)</p>
      </div>
    </div>
  );
}