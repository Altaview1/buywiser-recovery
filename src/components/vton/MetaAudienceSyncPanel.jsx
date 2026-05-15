import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function MetaAudienceSyncPanel() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncCount, setSyncCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Load last sync from localStorage (demo - in production use DB)
  useEffect(() => {
    const stored = localStorage.getItem('vton_meta_last_sync');
    if (stored) {
      const data = JSON.parse(stored);
      setLastSync(data.timestamp);
      setSyncCount(data.count);
    }
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncStatus('syncing');
    setErrorMessage('');

    try {
      const response = await base44.functions.invoke('syncMetaCustomAudience', {
        manual_trigger: true,
        filters: {
          min_priority_score: 40,
          exclude_suppressed: true
        }
      });

      if (response.data.success) {
        setSyncStatus('success');
        setSyncCount(response.data.leads_synced);
        setLastSync(new Date());
        
        // Store in localStorage
        localStorage.setItem('vton_meta_last_sync', JSON.stringify({
          timestamp: new Date().toISOString(),
          count: response.data.leads_synced
        }));

        setTimeout(() => setSyncStatus('idle'), 3000);
      } else {
        setSyncStatus('error');
        setErrorMessage(response.data.message || 'Sync failed');
      }
    } catch (error) {
      setSyncStatus('error');
      setErrorMessage(error.message);
    } finally {
      setSyncing(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return 'Never';
    const d = new Date(date);
    return d.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-lg">📱</span> Meta Custom Audience Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status */}
          <div>
            <p className="text-xs text-slate-600 uppercase font-semibold mb-2">Status</p>
            <div className="flex items-center gap-2">
              {syncStatus === 'syncing' && (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-600 font-medium">Syncing...</span>
                </>
              )}
              {syncStatus === 'success' && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Synced</span>
                </>
              )}
              {syncStatus === 'error' && (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Error</span>
                </>
              )}
              {syncStatus === 'idle' && (
                <>
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Ready</span>
                </>
              )}
            </div>
          </div>

          {/* Last Sync */}
          <div>
            <p className="text-xs text-slate-600 uppercase font-semibold mb-2">Last Sync</p>
            <p className="text-sm font-mono text-slate-700">{formatTime(lastSync)}</p>
            <p className="text-xs text-slate-500 mt-1">Daily at 03:00 UTC</p>
          </div>

          {/* Count */}
          <div>
            <p className="text-xs text-slate-600 uppercase font-semibold mb-2">Leads Synced</p>
            <p className="text-sm font-bold text-blue-700">{syncCount} veteran leads</p>
            <p className="text-xs text-slate-500 mt-1">Email + phone hashed</p>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-300 rounded p-3">
            <p className="text-xs text-red-700"><strong>Error:</strong> {errorMessage}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={handleManualSync}
            disabled={syncing}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Manual Sync Now'}
          </Button>
          <a
            href="https://business.facebook.com/audiences"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View in Meta Ads Manager →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}