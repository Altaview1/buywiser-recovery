import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ChevronRight } from 'lucide-react';

export default function VTONMailPipeline() {
  const { data: leads, isLoading } = useQuery({
    queryKey: ['vton-leads-pipeline'],
    queryFn: async () => {
      const allLeads = await base44.entities.VTONLead.list();
      return allLeads.filter(lead => 
        lead.direct_mail_sent || 
        lead.lob_letter_id || 
        lead.mail_approval_status === 'pending_approval'
      );
    },
  });

  // Group leads by stage
  const stages = {
    pending_approval: {
      label: '📋 Pending Review',
      color: 'bg-amber-50 border-amber-200',
      leads: []
    },
    approved: {
      label: '✓ Approved',
      color: 'bg-blue-50 border-blue-200',
      leads: []
    },
    sent_to_lob: {
      label: '📧 Sent to Lob',
      color: 'bg-purple-50 border-purple-200',
      leads: []
    },
    processing: {
      label: '🖨️ Printing',
      color: 'bg-indigo-50 border-indigo-200',
      leads: []
    },
    mailed: {
      label: '📦 In Transit',
      color: 'bg-sky-50 border-sky-200',
      leads: []
    },
    delivered: {
      label: '✓ Delivered',
      color: 'bg-green-50 border-green-200',
      leads: []
    },
    failed: {
      label: '✕ Failed',
      color: 'bg-red-50 border-red-200',
      leads: []
    }
  };

  // Categorize leads
  if (leads) {
    leads.forEach(lead => {
      if (lead.mail_approval_status === 'pending_approval' || !lead.mail_approval_status) {
        stages.pending_approval.leads.push(lead);
      } else if (lead.mail_approval_status === 'approved' && !lead.lob_letter_id) {
        stages.approved.leads.push(lead);
      } else if (lead.lob_letter_id && !lead.lob_delivery_status) {
        stages.sent_to_lob.leads.push(lead);
      } else if (lead.lob_delivery_status === 'processing') {
        stages.processing.leads.push(lead);
      } else if (lead.lob_delivery_status === 'mailed') {
        stages.mailed.leads.push(lead);
      } else if (lead.lob_delivery_status === 'delivered') {
        stages.delivered.leads.push(lead);
      } else if (lead.lob_delivery_status === 'failed' || lead.lob_delivery_status === 'returned') {
        stages.failed.leads.push(lead);
      }
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  const stageOrder = ['pending_approval', 'approved', 'sent_to_lob', 'processing', 'mailed', 'delivered', 'failed'];

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {stageOrder.map(stageKey => {
          const stage = stages[stageKey];
          const count = stage.leads.length;
          return (
            <Card key={stageKey} className="p-3">
              <div className="text-center">
                <p className="text-xs font-medium text-slate-600 mb-2">{stage.label}</p>
                <p className="text-2xl font-bold text-slate-900">{count}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {stageOrder.map(stageKey => {
          const stage = stages[stageKey];
          const count = stage.leads.length;

          return (
            <Card key={stageKey} className={`border-2 ${stage.color} min-h-96`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-700">
                    {stage.label}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs font-bold">
                    {count}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {count === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No leads</p>
                ) : (
                  stage.leads.map(lead => (
                    <div
                      key={lead.id}
                      className="p-2 bg-white rounded border border-slate-200 text-xs hover:shadow-md transition"
                    >
                      <div className="font-semibold text-slate-900 truncate">
                        {lead.first_name} {lead.last_name}
                      </div>
                      <div className="text-slate-600 text-[11px] truncate">
                        {lead.city}, {lead.state}
                      </div>
                      {lead.contact_priority_score > 0 && (
                        <div className="mt-1 flex items-center gap-1">
                          <div className="w-8 h-4 rounded text-center bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">{lead.contact_priority_score}</span>
                          </div>
                        </div>
                      )}
                      {lead.lob_letter_id && (
                        <div className="mt-1 text-[10px] text-blue-600 font-mono truncate" title={lead.lob_letter_id}>
                          ID: {lead.lob_letter_id.slice(0, 8)}...
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-4">
          <p className="text-xs font-semibold text-slate-600 mb-3">Pipeline Stages:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600">
            <div>📋 <strong>Pending Review</strong> - Waiting for approval</div>
            <div>✓ <strong>Approved</strong> - Ready to send to Lob</div>
            <div>📧 <strong>Sent to Lob</strong> - In Lob's queue</div>
            <div>🖨️ <strong>Printing</strong> - Being produced</div>
            <div>📦 <strong>In Transit</strong> - Mailed out</div>
            <div>✓ <strong>Delivered</strong> - Successfully received</div>
            <div>✕ <strong>Failed</strong> - Returned or failed</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}