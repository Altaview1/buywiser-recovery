import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Phone, QrCode, Calendar, Eye, Share2, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function UnifiedActivityTimeline({ leadId }) {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadLead = async () => {
      try {
        const leads = await base44.entities.VTONLead.filter({ id: leadId });
        if (leads.length) {
          setLead(leads[0]);
          parseActivitiesFromLead(leads[0]);
        }
      } catch (err) {
        console.error('Failed to load lead:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadLead();
  }, [leadId]);

  const parseActivitiesFromLead = (lead) => {
    const timeline = [];

    // Lead created
    if (lead.created_date) {
      timeline.push({
        type: 'lead_created',
        timestamp: lead.created_date,
        label: 'Lead Created',
        icon: 'FileText',
        description: `Lead created in system`
      });
    }

    // SMS sent
    if (lead.sms_status && lead.sms_status !== 'pending') {
      timeline.push({
        type: 'sms',
        timestamp: lead.updated_date,
        label: 'SMS Sent',
        icon: 'MessageSquare',
        description: `SMS status: ${lead.sms_status}`,
        status: lead.sms_status
      });
    }

    // Email sent
    if (lead.email_status && lead.email_status !== 'pending') {
      timeline.push({
        type: 'email',
        timestamp: lead.updated_date,
        label: 'Email Sent',
        icon: 'Mail',
        description: `Email status: ${lead.email_status}`,
        status: lead.email_status
      });
    }

    // Site visits tracked
    if (lead.site_visits && lead.site_visits > 0) {
      timeline.push({
        type: 'site_visit',
        timestamp: lead.last_engagement,
        label: `Site Visits (${lead.site_visits})`,
        icon: 'Eye',
        description: `Visited benefit page ${lead.site_visits} time(s)`
      });
    }

    // Appointment booked
    if (lead.appointment_booked) {
      timeline.push({
        type: 'appointment_booked',
        timestamp: lead.appointment_date,
        label: 'Benefit Review Booked',
        icon: 'Calendar',
        description: `Appointment scheduled for ${new Date(lead.appointment_date).toLocaleDateString()}`,
        status: 'booked'
      });
    }

    // Parse notes for additional activities
    if (lead.notes) {
      const noteLines = lead.notes.split('\n').filter(Boolean);
      noteLines.forEach(line => {
        const match = line.match(/\[(.+?)\]\s(.+?):\s(.+)/);
        if (match) {
          timeline.push({
            type: 'note',
            timestamp: match[1],
            label: match[2],
            description: match[3],
            icon: 'MessageSquare'
          });
        }
      });
    }

    // Sort by timestamp descending (newest first)
    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setActivities(timeline);
  };

  const iconMap = {
    Mail: <Mail className="h-4 w-4" />,
    MessageSquare: <MessageSquare className="h-4 w-4" />,
    Phone: <Phone className="h-4 w-4" />,
    QrCode: <QrCode className="h-4 w-4" />,
    Calendar: <Calendar className="h-4 w-4" />,
    Eye: <Eye className="h-4 w-4" />,
    Share2: <Share2 className="h-4 w-4" />,
    FileText: <FileText className="h-4 w-4" />
  };

  const statusColors = {
    sent: 'bg-blue-100 text-blue-800',
    opened: 'bg-green-100 text-green-800',
    clicked: 'bg-purple-100 text-purple-800',
    booked: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return <div className="text-center text-slate-500">Loading timeline...</div>;
  }

  if (!lead || activities.length === 0) {
    return <div className="text-center text-slate-500">No activity yet</div>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex gap-4 pb-4 border-b border-slate-200 last:border-b-0">
          {/* Timeline icon */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              {iconMap[activity.icon]}
            </div>
          </div>

          {/* Activity details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-slate-900">{activity.label}</p>
              {activity.status && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusColors[activity.status] || 'bg-slate-100'}`}>
                  {activity.status}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-1">{activity.description}</p>
            <p className="text-xs text-slate-400">
              {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}