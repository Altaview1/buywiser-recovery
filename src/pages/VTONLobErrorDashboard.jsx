import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, RefreshCw, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function VTONLobErrorDashboard() {
  const [deleting, setDeleting] = useState(null);

  // Fetch leads with failed Lob submissions
  const { data: errorLeads = [], isLoading, refetch } = useQuery({
    queryKey: ['vton-lob-errors'],
    queryFn: async () => {
      const leads = await base44.entities.VTONLead.list();
      return leads.filter(lead => 
        lead.lob_delivery_status === 'failed' || 
        lead.lob_delivery_status === 'returned' ||
        (lead.mail_approval_status === 'approved' && !lead.lob_letter_id && lead.created_date)
      ).sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));
    },
  });

  const handleDeleteLead = async (leadId) => {
    if (!confirm('Remove this lead from the error list? It will delete the lead record.')) return;
    
    setDeleting(leadId);
    try {
      await base44.entities.VTONLead.delete(leadId);
      refetch();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const handleRetry = async (leadId) => {
    if (!confirm('Retry sending this lead to Lob?')) return;
    
    try {
      await base44.functions.invoke('approveVTONMail', {
        lead_id: leadId,
        action: 'send_to_lob'
      });
      refetch();
      alert('✓ Lead resubmitted to Lob!');
    } catch (err) {
      alert(`Retry failed: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600">Loading error logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-red-600" />
                Lob Submission Errors
              </h1>
              <p className="text-slate-600 text-sm mt-1">Leads that failed to send or were returned. Fix the address and retry.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <Badge variant="outline" className="text-base px-3 py-1">
            {errorLeads.length} Error{errorLeads.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Error Table */}
        <Card>
          <CardContent className="pt-6">
            {errorLeads.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium">No errors found</p>
                <p className="text-sm">All Lob submissions are processing normally.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead Name</TableHead>
                      <TableHead>Property Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Failed Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {errorLeads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">
                          <div className="text-base">{lead.first_name} {lead.last_name}</div>
                          {lead.spouse_name && (
                            <div className="text-xs text-slate-500">& {lead.spouse_name}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {lead.property_address || '(Missing Address)'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {lead.city && lead.state && lead.zip_code ? (
                              `${lead.city}, ${lead.state} ${lead.zip_code}`
                            ) : (
                              <span className="text-red-600 font-medium">⚠️ Incomplete address</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead.lob_delivery_status === 'failed' && (
                            <Badge className="bg-red-100 text-red-800">
                              ✕ Failed
                            </Badge>
                          )}
                          {lead.lob_delivery_status === 'returned' && (
                            <Badge className="bg-orange-100 text-orange-800">
                              ↩️ Returned
                            </Badge>
                          )}
                          {!lead.lob_delivery_status && lead.mail_approval_status === 'approved' && (
                            <Badge className="bg-amber-100 text-amber-800">
                              ⏳ Never sent
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {lead.lob_estimated_cost ? `$${lead.lob_estimated_cost.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {lead.lob_last_updated 
                            ? new Date(lead.lob_last_updated).toLocaleDateString()
                            : new Date(lead.created_date).toLocaleDateString()
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {lead.lob_letter_id && (
                              <a
                                href={`https://dashboard.lob.com/#/mail/${lead.lob_letter_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="View in Lob dashboard"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-sm text-blue-600 hover:bg-blue-50 border-blue-200"
                              onClick={() => handleRetry(lead.id)}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Retry
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-red-600 hover:bg-red-50 border-red-200"
                              onClick={() => handleDeleteLead(lead.id)}
                              disabled={deleting === lead.id}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        {errorLeads.length > 0 && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-blue-900">💡 Troubleshooting Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 space-y-2">
              <p>• <strong>Incomplete addresses:</strong> Add missing city, state, or zip code</p>
              <p>• <strong>Address validation:</strong> Check for typos or formatting issues in street address</p>
              <p>• <strong>Address not found:</strong> Use Google Maps to verify the address exists</p>
              <p>• <strong>After fixing:</strong> Click "Retry" to resubmit to Lob</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}