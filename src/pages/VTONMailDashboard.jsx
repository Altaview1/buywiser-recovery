import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Mail, CheckCircle, Clock, AlertCircle, Package, FileText, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VTONMailDashboard() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const itemsPerPage = 20;

  // Fetch all VTON leads with mail data (including pending approvals)
  const { data: leads, isLoading, refetch } = useQuery({
    queryKey: ['vton-leads-mail'],
    queryFn: async () => {
      const allLeads = await base44.entities.VTONLead.list();
      return allLeads.filter(lead => 
        lead.direct_mail_sent || 
        lead.lob_letter_id || 
        lead.mail_approval_status === 'pending_approval'
      );
    },
  });

  // Calculate statistics
  const stats = {
    total: leads?.length || 0,
    pendingApproval: leads?.filter(l => l.mail_approval_status === 'pending_approval').length || 0,
    processing: leads?.filter(l => l.lob_delivery_status === 'processing').length || 0,
    mailed: leads?.filter(l => l.lob_delivery_status === 'mailed').length || 0,
    delivered: leads?.filter(l => l.lob_delivery_status === 'delivered').length || 0,
    failed: leads?.filter(l => l.lob_delivery_status === 'failed' || l.lob_delivery_status === 'returned').length || 0,
    totalCost: leads?.reduce((sum, l) => sum + (l.lob_estimated_cost || 0), 0) || 0,
  };

  // Filter leads by status
  const filteredLeads = leads?.filter(lead => {
    if (statusFilter === 'all') return true;
    return lead.lob_delivery_status === statusFilter;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Processing' },
      mailed: { color: 'bg-purple-100 text-purple-800', icon: Package, label: 'Mailed' },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
      failed: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Failed' },
      returned: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle, label: 'Returned' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: FileText, label: status || 'Unknown' };
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApprove = async (leadId, action) => {
    try {
      await base44.functions.invoke('approveVTONMail', {
        lead_id: leadId,
        action: action
      });
      refetch();
    } catch (error) {
      console.error('Approval error:', error);
      alert(`Failed to ${action} mail: ${error.message}`);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads(paginatedLeads.filter(l => l.mail_approval_status === 'pending_approval').map(l => l.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  const handleBulkApprove = async () => {
    if (selectedLeads.length === 0) return;
    
    setBulkProcessing(true);
    const results = { approved: 0, failed: 0, errors: [] };
    
    for (const leadId of selectedLeads) {
      try {
        await base44.functions.invoke('approveVTONMail', {
          lead_id: leadId,
          action: 'approve'
        });
        results.approved++;
      } catch (error) {
        results.failed++;
        results.errors.push({ leadId, error: error.message });
      }
    }
    
    setBulkProcessing(false);
    setSelectedLeads([]);
    refetch();
    
    if (results.failed > 0) {
      alert(`Bulk approval complete: ${results.approved} approved, ${results.failed} failed`);
    } else {
      alert(`Successfully approved ${results.approved} mailers!`);
    }
  };

  const handleBulkReject = async () => {
    if (selectedLeads.length === 0) return;
    
    if (!confirm(`Reject ${selectedLeads.length} selected mailers? This cannot be undone.`)) return;
    
    setBulkProcessing(true);
    const results = { rejected: 0, failed: 0 };
    
    for (const leadId of selectedLeads) {
      try {
        await base44.functions.invoke('approveVTONMail', {
          lead_id: leadId,
          action: 'reject'
        });
        results.rejected++;
      } catch (error) {
        results.failed++;
      }
    }
    
    setBulkProcessing(false);
    setSelectedLeads([]);
    refetch();
    
    alert(`Bulk rejection complete: ${results.rejected} rejected, ${results.failed} failed`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600">Loading mail data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">VTON Direct Mail Dashboard</h1>
          <p className="text-slate-600">Track Lob letter delivery status, costs, and mailing progress</p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <a 
              href="https://dashboard.lob.com/#/settings/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              💳 View Lob Billing
            </a>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600">
              Avg. cost per letter: <strong className="text-slate-900">${leads && leads.length > 0 ? (stats.totalCost / leads.length).toFixed(2) : '0.00'}</strong>
            </span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-amber-600">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700">{stats.pendingApproval}</div>
              <p className="text-xs text-slate-500 mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Letters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
              <p className="text-xs text-slate-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-600">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">{stats.processing}</div>
              <p className="text-xs text-slate-500 mt-1">In queue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-600">Mailed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700">{stats.mailed}</div>
              <p className="text-xs text-slate-500 mt-1">In transit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{stats.delivered}</div>
              <p className="text-xs text-slate-500 mt-1">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-600">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">{stats.failed}</div>
              <p className="text-xs text-slate-500 mt-1">Returned/failed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-amber-600">Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700">${stats.totalCost.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Est. printing + postage</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Bulk Actions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 flex-wrap">
                <label className="text-sm font-medium text-slate-700">Filter by status:</label>
                <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending_approval">Pending Approval</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="mailed">Mailed</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Refresh
                </Button>
              </div>

              {/* Bulk Action Buttons */}
              {selectedLeads.length > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                  <span className="text-sm font-semibold text-amber-800">
                    {selectedLeads.length} selected
                  </span>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleBulkApprove}
                    disabled={bulkProcessing}
                  >
                    {bulkProcessing ? 'Processing...' : `Approve ${selectedLeads.length}`}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 border-red-200"
                    onClick={handleBulkReject}
                    disabled={bulkProcessing}
                  >
                    Reject {selectedLeads.length}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedLeads([])}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mail Queue Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Mail Queue ({paginatedLeads.length} of {filteredLeads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paginatedLeads.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No letters found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={paginatedLeads.filter(l => l.mail_approval_status === 'pending_approval').length > 0 && 
                                paginatedLeads.filter(l => l.mail_approval_status === 'pending_approval').every(l => selectedLeads.includes(l.id))}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </TableHead>
                    <TableHead>Veteran Name</TableHead>
                    <TableHead>Property Address</TableHead>
                    <TableHead>Approval Status</TableHead>
                    <TableHead>Lob Letter ID</TableHead>
                    <TableHead>Mail Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLeads.map((lead) => (
                    <TableRow key={lead.id} className={selectedLeads.includes(lead.id) ? 'bg-blue-50' : ''}>
                      <TableCell>
                        <input
                          type="checkbox"
                          onChange={() => handleSelectLead(lead.id)}
                          checked={selectedLeads.includes(lead.id)}
                          disabled={lead.mail_approval_status !== 'pending_approval'}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {lead.first_name} {lead.last_name}
                        {lead.spouse_name && (
                          <div className="text-xs text-slate-500">& {lead.spouse_name}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{lead.property_address}</div>
                        <div className="text-xs text-slate-500">
                          {lead.city}, {lead.state} {lead.zip_code}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.mail_approval_status === 'pending_approval' && (
                          <Badge className="bg-amber-100 text-amber-800">
                            <Eye className="h-3 w-3 mr-1" />
                            Pending Review
                          </Badge>
                        )}
                        {lead.mail_approval_status === 'approved' && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        )}
                        {lead.mail_approval_status === 'rejected' && (
                          <Badge className="bg-red-100 text-red-800">
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            Rejected
                          </Badge>
                        )}
                        {lead.mail_approval_status === 'sent' && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Sent
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {lead.lob_letter_id ? (
                          <a
                            href={`https://dashboard.lob.com/#/mail/${lead.lob_letter_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline font-mono"
                          >
                            {lead.lob_letter_id}
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {lead.lob_delivery_status ? getStatusBadge(lead.lob_delivery_status) : (
                          <span className="text-xs text-slate-400">Not sent</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-700">
                        {lead.lob_estimated_cost ? `$${lead.lob_estimated_cost.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        {lead.mail_approval_status === 'pending_approval' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-green-600 hover:bg-green-50 border-green-200"
                              onClick={() => handleApprove(lead.id, 'approve')}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-red-600 hover:bg-red-50 border-red-200"
                              onClick={() => handleApprove(lead.id, 'reject')}
                            >
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {lead.mail_approval_status !== 'pending_approval' && (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-slate-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} letters
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}