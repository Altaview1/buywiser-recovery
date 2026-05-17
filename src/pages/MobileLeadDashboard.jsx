import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Phone, MessageCircle, MapPin, CheckCircle, Clock, X, Loader2, ChevronLeft, Map, Download } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const NAVY = '#0B1F3B';
const STATUSES = ['new', 'contacted', 'interested', 'meeting_set', 'closed'];
const STATUS_COLORS = {
  new: { bg: 'bg-slate-100', text: 'text-slate-700', label: '🆕 New', color: '#64748b' },
  contacted: { bg: 'bg-blue-100', text: 'text-blue-700', label: '📞 Contacted', color: '#3b82f6' },
  interested: { bg: 'bg-green-100', text: 'text-green-700', label: '✨ Interested', color: '#22c55e' },
  meeting_set: { bg: 'bg-amber-100', text: 'text-amber-700', label: '📅 Meeting Set', color: '#f59e0b' },
  closed: { bg: 'bg-purple-100', text: 'text-purple-700', label: '✅ Closed', color: '#a855f7' },
};

// Custom map markers by status
const createStatusMarker = (status) => {
  const color = STATUS_COLORS[status]?.color || '#64748b';
  return L.divIcon({
    html: `<div style="width: 32px; height: 32px; background-color: ${color}; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">📍</div>`,
    iconSize: [32, 32],
    className: 'custom-marker',
  });
};

function LeadCard({ lead, onStatusChange, onCall, onSMS }) {
  const [updating, setUpdating] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const currentStatus = lead.pipeline_stage || 'new';
  const statusInfo = STATUS_COLORS[currentStatus];

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await base44.asServiceRole.entities.ActivatorLead.update(lead.id, {
        pipeline_stage: newStatus,
      });
      setShowStatusMenu(false);
      onStatusChange();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900">{lead.first_name} {lead.last_name}</p>
          <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
            <MapPin className="h-4 w-4" /> {lead.property_address}
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.text}`}>
          {statusInfo.label}
        </div>
      </div>

      {/* Contact Info */}
      {lead.phone && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-2">Phone</p>
          <p className="text-base font-bold text-slate-800 mb-2">{lead.phone}</p>
        </div>
      )}

      {lead.email && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-2">Email</p>
          <p className="text-sm font-bold text-slate-800 truncate">{lead.email}</p>
        </div>
      )}

      {/* Equity Info */}
      {lead.estimated_equity && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 uppercase tracking-wide font-bold">Equity</p>
          <p className="text-2xl font-black text-blue-700">${(lead.estimated_equity / 1000).toFixed(0)}K</p>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {lead.phone && (
          <button
            onClick={() => onCall(lead.phone)}
            className="flex items-center justify-center gap-2 py-4 px-3 rounded-xl font-bold text-sm text-white transition active:scale-95"
            style={{ background: NAVY }}
          >
            <Phone className="h-5 w-5" /> Call
          </button>
        )}
        {lead.phone && (
          <button
            onClick={() => onSMS(lead.phone)}
            className="flex items-center justify-center gap-2 py-4 px-3 rounded-xl font-bold text-sm bg-green-500 text-white hover:bg-green-600 transition active:scale-95"
          >
            <MessageCircle className="h-5 w-5" /> SMS
          </button>
        )}
      </div>

      {/* Status Menu */}
      <div className="relative">
        <button
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          disabled={updating}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm border-2 border-slate-300 bg-white transition ${updating ? 'opacity-50' : ''}`}
        >
          {updating ? <Loader2 className="h-4 w-4 inline animate-spin mr-2" /> : null}
          Change Status
        </button>

        {showStatusMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-300 rounded-xl shadow-lg z-10">
            {STATUSES.map(status => {
              const info = STATUS_COLORS[status];
              return (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating}
                  className={`w-full text-left px-4 py-3 font-bold text-sm border-b border-slate-100 last:border-b-0 transition active:bg-slate-50 ${
                    status === currentStatus ? info.bg : ''
                  }`}
                >
                  {info.label}
                  {status === currentStatus && <CheckCircle className="h-4 w-4 float-right mt-0.5" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Notes if available */}
      {lead.interaction_notes?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
          <p className="font-bold mb-1">Last note:</p>
          <p className="line-clamp-2">{lead.interaction_notes[lead.interaction_notes.length - 1].content}</p>
        </div>
      )}
    </div>
  );
}

export default function MobileLeadDashboard() {
  const [rep, setRep] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    initRep();
  }, []);

  const initRep = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        setLoading(false);
        return;
      }
      const user = await base44.auth.me();
      const activators = await base44.entities.FieldActivator.filter({
        email: user.email,
        status: 'active',
      });
      if (activators.length > 0) {
        setRep(activators[0]);
        await fetchLeads(activators[0]);
      }
    } catch (err) {
      console.error('Error initializing:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async (activator) => {
    try {
      const data = await base44.entities.ActivatorLead.filter(
        { rep_code: activator.rep_code },
        '-created_date',
        100
      );
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeads(rep);
    setRefreshing(false);
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleSMS = (phone) => {
    window.location.href = `sms:${phone}`;
  };

  const handleExportCSV = () => {
    if (leadsWithCoords.length === 0) {
      alert('No leads with location data to export');
      return;
    }

    // CSV header
    const headers = ['Name', 'Address', 'Phone', 'Email', 'Status', 'Latitude', 'Longitude', 'Equity'];
    
    // CSV rows
    const rows = leadsWithCoords.map(lead => [
      `${lead.first_name} ${lead.last_name}`,
      lead.property_address,
      lead.phone || '',
      lead.email || '',
      lead.pipeline_stage || 'new',
      lead.lat,
      lead.lng,
      lead.estimated_equity || '',
    ]);

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-slate-600" />
          <p className="text-slate-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!rep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Please sign in to access mobile dashboard</p>
          <button
            onClick={() => base44.auth.redirectToLogin()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const unvisitedCount = leads.filter(l => !l.knock_attempt_confirmed).length;
  const filteredLeads =
    filter === 'all'
      ? leads
      : leads.filter(l => (l.pipeline_stage || 'new') === filter);
  const leadsWithCoords = filteredLeads.filter(l => l.lat && l.lng);
  const centerLat = leadsWithCoords.length > 0 
    ? leadsWithCoords.reduce((sum, l) => sum + l.lat, 0) / leadsWithCoords.length
    : 34.0522;
  const centerLng = leadsWithCoords.length > 0 
    ? leadsWithCoords.reduce((sum, l) => sum + l.lng, 0) / leadsWithCoords.length
    : -118.2437;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b-2 border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">Field Activator</p>
            <p className="text-base font-bold text-slate-900">{rep.name}</p>
          </div>
          <button
            onClick={() => {
              base44.auth.logout();
              setRep(null);
            }}
            className="px-3 py-2 text-xs font-bold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
          >
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-red-100 rounded-lg px-3 py-2.5 text-center">
            <p className="text-lg font-black text-red-700">{unvisitedCount}</p>
            <p className="text-xs font-bold text-red-600">To Visit</p>
          </div>
          <div className="bg-blue-100 rounded-lg px-3 py-2.5 text-center">
            <p className="text-lg font-black text-blue-700">{leads.length}</p>
            <p className="text-xs font-bold text-blue-600">Total Leads</p>
          </div>
        </div>

        {/* View Tabs & Export */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setView('list')}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition ${
              view === 'list'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-300 text-slate-600'
            }`}
          >
            📋 List
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition ${
              view === 'map'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-300 text-slate-600'
            }`}
          >
            🗺️ Map
          </button>
          {view === 'map' && (
            <button
              onClick={handleExportCSV}
              disabled={leadsWithCoords.length === 0}
              className="px-3 py-2.5 rounded-lg font-bold text-sm bg-green-500 text-white hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        {view === 'list' && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scroll-smooth">
            {['all', 'new', 'contacted', 'interested', 'meeting_set', 'closed'].map(status => {
              const info = STATUS_COLORS[status];
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                    filter === status
                      ? `${info.bg} ${info.text} ring-2 ring-offset-2 ring-slate-300`
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {status === 'all' ? 'All' : info.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Content */}
      {view === 'list' ? (
        // List View
        <div className="px-4 py-4 space-y-3 pb-8">
          {refreshing && (
            <div className="text-center py-2">
              <Loader2 className="h-4 w-4 animate-spin inline text-slate-500" />
            </div>
          )}

          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-semibold">No leads in this status</p>
              <button
                onClick={() => setFilter('all')}
                className="text-xs text-blue-600 font-bold mt-2"
              >
                View all leads
              </button>
            </div>
          ) : (
            filteredLeads.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onStatusChange={() => fetchLeads(rep)}
                onCall={handleCall}
                onSMS={handleSMS}
              />
            ))
          )}
        </div>
      ) : (
        // Map View
        <div className="h-[calc(100vh-280px)] relative">
          {leadsWithCoords.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold">No leads with location data</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={[centerLat, centerLng]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              className="z-10"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {leadsWithCoords.map(lead => (
                <Marker
                  key={lead.id}
                  position={[lead.lat, lead.lng]}
                  icon={createStatusMarker(lead.pipeline_stage || 'new')}
                >
                  <Popup className="text-xs">
                    <div className="min-w-48">
                      <p className="font-bold text-sm mb-1">{lead.first_name} {lead.last_name}</p>
                      <p className="text-slate-600 text-xs mb-2">{lead.property_address}</p>
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="block px-2 py-1.5 bg-blue-600 text-white rounded text-xs font-bold text-center mb-1"
                        >
                          Call
                        </a>
                      )}
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${STATUS_COLORS[lead.pipeline_stage || 'new'].bg} ${STATUS_COLORS[lead.pipeline_stage || 'new'].text}`}>
                        {STATUS_COLORS[lead.pipeline_stage || 'new'].label}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      )}
    </div>
  );
}