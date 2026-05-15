import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Mail, CheckCircle, Clock, AlertCircle, Package, FileText, ThumbsUp, ThumbsDown, Eye, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function VTONMailDashboard() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLead, setPreviewLead] = useState(null);
  const [letterTemplate, setLetterTemplate] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [scoringLeads, setScoringLeads] = useState(false);
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

  // Load approved letter template
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const configs = await base44.entities.VTONMailConfig.list();
        console.log('VTONMailConfig loaded:', configs.length, configs.length > 0 ? 'has HTML' : 'no configs');
        if (configs.length > 0 && configs[0].letter_html) {
          setLetterTemplate(configs[0].letter_html);
        } else {
          console.warn('No letter template found in config');
        }
      } catch (err) {
        console.error('Failed to load template:', err);
      }
    };
    loadTemplate();
  }, []);

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

  // Filter leads by status and search query
  let filteredLeads = leads?.filter(lead => {
    // Status filter
    if (statusFilter !== 'all' && lead.lob_delivery_status !== statusFilter) return false;
    
    // Search filter (name or address)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const fullName = `${lead.first_name} ${lead.last_name} ${lead.spouse_name || ''}`.toLowerCase();
      const fullAddress = `${lead.property_address} ${lead.city} ${lead.state} ${lead.zip_code}`.toLowerCase();
      
      return fullName.includes(query) || fullAddress.includes(query);
    }
    
    return true;
  }) || [];

  // Sort by priority score (default) or date
  if (sortBy === 'priority') {
    filteredLeads = [...filteredLeads].sort((a, b) => (b.contact_priority_score || 0) - (a.contact_priority_score || 0));
  } else if (sortBy === 'recent') {
    filteredLeads = [...filteredLeads].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: '🖨️ Printing' },
      mailed: { color: 'bg-purple-100 text-purple-800', icon: Package, label: '📦 In Transit' },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: '✓ Delivered' },
      failed: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: '✕ Failed' },
      returned: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle, label: '↩️ Returned' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: '⊘ Cancelled' },
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

  const handlePreviewLetter = (lead) => {
    console.log('Opening preview for lead:', lead.id, lead.first_name);
    setPreviewLead(lead);
    setPreviewOpen(true);
  };

  const generateLetterPreview = (lead, template) => {
    if (!lead || !template) return '';
    
    let preview = template;
    // Personalization fields
    preview = preview.replace(/\$\{first_name\}/g, lead.first_name || 'Veteran');
    preview = preview.replace(/\$\{last_name\}/g, lead.last_name || '');
    preview = preview.replace(/\$\{property_address\}/g, lead.property_address || '');
    preview = preview.replace(/\$\{city\}/g, lead.city || '');
    preview = preview.replace(/\$\{state\}/g, lead.state || '');
    preview = preview.replace(/\$\{zip_code\}/g, lead.zip_code || '');
    
    // Benefit-related fields
    preview = preview.replace(/\$\{estimated_benefit\}/g, 
      lead.estimated_benefit ? `$${lead.estimated_benefit.toLocaleString()}` : 'TBD');
    preview = preview.replace(/\$\{estimated_equity\}/g, 
      lead.estimated_equity ? `$${lead.estimated_equity.toLocaleString()}` : 'TBD');
    preview = preview.replace(/\$\{listing_price\}/g, 
      lead.listing_price ? `$${lead.listing_price.toLocaleString()}` : 'TBD');
    
    // Add QR code URL pointing to testimonials page
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://buywiser.com/vton-testimonials`)}`;
    preview = preview.replace(/\$\{qrUrl\}/g, qrUrl);
    
    return preview;
  };

  const getSelectableLeads = (leadsArray) => {
    return leadsArray.filter(l => !l.lob_letter_id);
  };

  const handleSelectAll = (e) => {
    const selectableIds = getSelectableLeads(paginatedLeads).map(l => l.id);
    if (e.target.checked) {
      setSelectedLeads([...selectableIds]);
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => {
      return prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId];
    });
  };

  const isAllSelected = () => {
    const selectableIds = getSelectableLeads(paginatedLeads).map(l => l.id);
    return selectableIds.length > 0 && selectableIds.every(id => selectedLeads.includes(id));
  };

  const isSomeSelected = () => {
    const selectableIds = getSelectableLeads(paginatedLeads).map(l => l.id);
    return selectedLeads.length > 0 && selectedLeads.some(id => selectableIds.includes(id));
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

  const handleBulkSendToLob = async () => {
   if (selectedLeads.length === 0) return;

   if (!confirm(`Send ${selectedLeads.length} letters to Lob?`)) return;

   setBulkProcessing(true);
   const results = { sent: 0, failed: 0, errors: [] };

   for (const leadId of selectedLeads) {
     try {
       await base44.functions.invoke('approveVTONMail', {
         lead_id: leadId,
         action: 'send_to_lob'
       });
       results.sent++;
     } catch (error) {
       results.failed++;
       results.errors.push(error.message);
     }
   }

   setBulkProcessing(false);
   setSelectedLeads([]);
   refetch();

   let message = `Bulk Lob send: ${results.sent} sent`;
   if (results.failed > 0) {
     message += `, ${results.failed} failed`;
     if (results.errors.length > 0) {
       message += `\n\nErrors:\n${results.errors.slice(0, 3).join('\n')}`;
     }
   }
   alert(message);
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
          <div className="mt-3 flex items-center gap-4 text-sm flex-wrap">
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
            <span className="text-slate-400">|</span>
            <span className="text-slate-600">
              Status: <strong className="text-green-600">{leads?.filter(l => l.mail_approval_status === 'approved').length || 0} Approved</strong>, <strong className="text-amber-600">{stats.pendingApproval} Pending</strong>, <strong className="text-red-600">{leads?.filter(l => l.mail_approval_status === 'rejected').length || 0} Rejected</strong>
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
              <div className="flex items-center gap-4 flex-wrap flex-1">
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
                
                <label className="text-sm font-medium text-slate-700">Sort by:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priority">🎯 Priority Score</SelectItem>
                    <SelectItem value="recent">📅 Recently Added</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={async () => {
                    setScoringLeads(true);
                    try {
                      await base44.functions.invoke('calculateLeadPriorityScore', {});
                      refetch();
                    } catch (err) {
                      console.error('Scoring error:', err);
                    }
                    setScoringLeads(false);
                  }}
                  disabled={scoringLeads}
                >
                  {scoringLeads ? 'Calculating...' : '📊 Recalculate Scores'}
                </Button>

                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Refresh
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or address..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="h-9 w-72 rounded-md border border-slate-300 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Bulk Action Buttons */}
              {selectedLeads.length > 0 && (
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <span className="text-sm font-semibold text-blue-800">
                    {selectedLeads.length} selected
                  </span>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleBulkSendToLob}
                    disabled={bulkProcessing}
                  >
                    {bulkProcessing ? 'Sending...' : `📧 Send to Lob (${selectedLeads.length})`}
                  </Button>
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
              {searchQuery && (
                <Badge variant="outline" className="text-xs font-normal">
                  Searching: "{searchQuery}"
                </Badge>
              )}
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
                        checked={isAllSelected()}
                        indeterminate={isSomeSelected() && !isAllSelected()}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </TableHead>
                    <TableHead className="w-40">Lead ID</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Veteran Name</TableHead>
                    <TableHead>Property Address</TableHead>
                    <TableHead>Approval Status</TableHead>
                    <TableHead>Lob Letter ID</TableHead>
                    <TableHead>Mail Status</TableHead>
                    <TableHead>Site Visits</TableHead>
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
                          disabled={!lead.lob_letter_id ? false : true}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(lead.id);
                            alert('ID copied!');
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition truncate block w-full text-left"
                          title="Click to copy"
                        >
                          {lead.id}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-6 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{lead.contact_priority_score || 0}</span>
                          </div>
                          {lead.veteran_indicator && <span className="text-lg">🎖️</span>}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <button
                          type="button"
                          onClick={() => {
                            console.log('Name button clicked:', lead.first_name, lead.last_name, lead.id);
                            handlePreviewLetter(lead);
                          }}
                          className="text-left text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer block w-full text-base"
                        >
                          {lead.first_name} {lead.last_name}
                          {lead.spouse_name && (
                            <div className="text-xs text-slate-500">& {lead.spouse_name}</div>
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{lead.property_address}</div>
                        <div className="text-xs text-slate-500">
                          {lead.city}, {lead.state} {lead.zip_code}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(lead.mail_approval_status === 'pending_approval' || !lead.mail_approval_status) && (
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
                      <TableCell>
                        {lead.site_visits > 0 ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {lead.site_visits} visit{lead.site_visits !== 1 ? 's' : ''}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400">No visits</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-700">
                        {lead.lob_estimated_cost ? `$${lead.lob_estimated_cost.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        {(lead.mail_approval_status === 'pending_approval' || !lead.mail_approval_status) && !lead.lob_letter_id && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-slate-600 hover:bg-slate-50 border-slate-200"
                              onClick={() => window.open(`/vton-personalized/${lead.id}`, '_blank')}
                              title="Preview personalized landing page"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Landing
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-blue-600 hover:bg-blue-50 border-blue-200"
                              onClick={() => handlePreviewLetter(lead)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Letter
                            </Button>
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
                        {lead.mail_approval_status === 'approved' && !lead.lob_letter_id && (
                          <Button
                            size="sm"
                            className="h-8 bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => {
                              if (window.confirm(`Send ${lead.first_name} ${lead.last_name}'s letter to Lob?`)) {
                                handleApprove(lead.id, 'send_to_lob');
                              }
                            }}
                          >
                            📧 Send to Lob
                          </Button>
                        )}
                        {lead.lob_letter_id && (
                          <span className="text-xs text-slate-500 font-medium">In Lob Queue</span>
                        )}
                        {lead.mail_approval_status === 'rejected' && (
                          <span className="text-xs text-red-600 font-medium">Rejected</span>
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

        {/* Letter Preview Modal */}
        <Dialog open={previewOpen} onOpenChange={(open) => {
          console.log('Dialog open changed:', open);
          setPreviewOpen(open);
        }}>
          <DialogContent className="max-w-4xl h-[90vh]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Letter Preview - {previewLead?.first_name} {previewLead?.last_name}</DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('Closing dialog');
                    setPreviewOpen(false);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            {previewLead && letterTemplate && (
              <div className="flex-1 overflow-y-auto border rounded-lg">
                <iframe
                  srcDoc={generateLetterPreview(previewLead, letterTemplate)}
                  className="w-full h-[calc(90vh-200px)] border-0"
                  title="Letter Preview"
                />
              </div>
            )}
            {previewLead && !letterTemplate && (
              <div className="text-center py-8 text-slate-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No letter template found. Please approve a template first.</p>
              </div>
            )}
            {!previewLead && (
              <div className="text-center py-8 text-slate-500">
                <p>Loading preview...</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}