import { useState } from 'react';
import { X, Phone, Mail, MapPin, Clock, DollarSign, TrendingUp, Send, Copy, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function LeadDetailModal({ lead, onClose }) {
  const [actionInProgress, setActionInProgress] = useState(null);
  const [copied, setCopied] = useState(null);
  const [sent, setSent] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState(lead.interaction_notes || []);

  const handleCopyPhone = async () => {
    if (lead.phone) {
      await navigator.clipboard.writeText(lead.phone);
      setCopied('phone');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleCopyEmail = async () => {
    if (lead.email) {
      await navigator.clipboard.writeText(lead.email);
      setCopied('email');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleSendEmail = async () => {
    if (!lead.email) return;
    setActionInProgress('email');
    try {
      await base44.integrations.Core.SendEmail({
        to: lead.email,
        subject: `Your Property Review - ${lead.address}`,
        body: `Hello,\n\nWe noticed your property at ${lead.address} in ${lead.city}, ${lead.state} is listed with VA financing. We'd like to discuss refinance options that could benefit you.\n\nBest regards`
      });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error('Email send error:', err);
      alert('Failed to send email');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleCall = async () => {
    if (!lead.phone) return;
    window.location.href = `tel:${lead.phone}`;
  };

  const handleAddNote = async (type = 'note') => {
    if (!noteText.trim()) return;
    setSaving(true);
    try {
      const newNote = {
        timestamp: new Date().toISOString(),
        type,
        content: noteText
      };
      const updatedNotes = [...notes, newNote];
      await base44.asServiceRole.entities.ActivatorLead.update(lead.id, {
        interaction_notes: updatedNotes
      });
      setNotes(updatedNotes);
      setNoteText('');
      if (type !== 'note') setSent(true);
      setTimeout(() => setSent(false), 2000);
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
          <X className="h-5 w-5" />
        </button>

        {/* Lead Info with DOM Badge */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
            {lead.domDays !== undefined && (
              <div className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 whitespace-nowrap ${
                lead.domDays <= 7 ? 'bg-blue-100 text-blue-800' :
                lead.domDays <= 14 ? 'bg-green-100 text-green-800' :
                lead.domDays <= 30 ? 'bg-amber-100 text-amber-800' :
                'bg-slate-100 text-slate-700'
              }`}>
                {lead.domDays <= 7 ? '🔥 HOT' : lead.domDays <= 14 ? '✨ NEW' : `${lead.domDays}d`}
              </div>
            )}
          </div>
          <p className="text-sm text-slate-600 flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {lead.address}
          </p>
          <p className="text-sm text-slate-600 mt-1">{lead.city}, {lead.state}</p>
        </div>

        {/* Quick Stats */}
        <div className="space-y-2 mb-6 pb-6 border-b border-slate-100">
          {lead.domDays !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" /> Days on Market
              </span>
              <span className="font-semibold text-slate-900">{lead.domDays} days</span>
            </div>
          )}
          {lead.listing_price && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" /> Listing Price
              </span>
              <span className="font-semibold text-slate-900">${(lead.listing_price / 1000).toFixed(0)}K</span>
            </div>
          )}
          {lead.estimated_equity && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" /> Est. Equity
              </span>
              <span className="font-semibold text-slate-900">${(lead.estimated_equity / 1000).toFixed(0)}K</span>
            </div>
          )}
          {lead.distress_score && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Distress Score</span>
              <span className="font-semibold text-slate-900">{lead.distress_score}</span>
            </div>
          )}
        </div>

        {/* Contact Actions */}
        <div className="space-y-2 mb-6">
          {lead.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-mono text-slate-700 flex-1">{lead.phone}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyPhone}
                className={`px-2 py-1 h-auto text-xs ${copied === 'phone' ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
              >
                {copied === 'phone' ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCall}
                className="px-2 py-1 h-auto text-xs"
              >
                Call
              </Button>
            </div>
          )}
          {lead.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-slate-700 flex-1 truncate">{lead.email}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyEmail}
                className={`px-2 py-1 h-auto text-xs ${copied === 'email' ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
              >
                {copied === 'email' ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          )}
        </div>

        {/* Send Email Button */}
        {lead.email && (
          <Button
            onClick={handleSendEmail}
            disabled={actionInProgress === 'email'}
            className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4" />
            {sent ? 'Email Sent!' : actionInProgress === 'email' ? 'Sending...' : 'Send Email'}
          </Button>
        )}

        {/* Status */}
        {lead.status && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Status</p>
            <p className="text-sm font-semibold text-slate-900 mt-1">{lead.status}</p>
          </div>
        )}

        {/* Interaction History */}
        <div className="mt-6 border-t border-slate-200 pt-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Follow-up History</h3>
          
          {/* Notes List */}
          {notes.length > 0 && (
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {[...notes].reverse().map((note, idx) => (
                <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      note.type === 'call' ? 'bg-blue-500' :
                      note.type === 'email' ? 'bg-amber-500' :
                      'bg-slate-400'
                    }`} />
                    <span className="font-semibold text-slate-700 capitalize">{note.type}</span>
                    <span className="text-slate-400 ml-auto">
                      {new Date(note.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600">{note.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Note Input */}
          <div className="space-y-2">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a follow-up note..."
              className="w-full text-xs p-2 border border-slate-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows="2"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddNote('note')}
                disabled={!noteText.trim() || saving}
                className="flex-1 text-xs h-auto py-1"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Note
              </Button>
              <Button
                size="sm"
                onClick={() => handleAddNote('call')}
                disabled={!noteText.trim() || saving}
                className="flex-1 text-xs h-auto py-1 bg-blue-600 hover:bg-blue-700"
              >
                <Phone className="h-3 w-3 mr-1" /> Log Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}