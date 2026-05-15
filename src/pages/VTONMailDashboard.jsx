import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Mail, CheckCircle, Clock, AlertCircle, Package, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VTONMailDashboard() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch all VTON leads with mail data
  const { data: leads, isLoading, refetch } = useQuery({
    queryKey: ['vton-leads-mail'],
    queryFn: async () => {
      const allLeads = await base44.entities.VTONLead.list();
      return allLeads.filter(lead => lead.direct_mail_sent || lead.lob_letter_id);
    },
  });

  // Calculate statistics
  const stats = {
    total: leads?.length || 0,
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

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700">Filter by status:</label>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
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
                    <TableHead>Veteran Name</TableHead>
                    <TableHead>Property Address</TableHead>
                    <TableHead>Lob Letter ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Delivery Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLeads.map((lead) => (
                    <TableRow key={lead.id}>
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
                          <span className="text-xs text-slate-400">Queued</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(lead.lob_delivery_status)}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-700">
                        {lead.lob_estimated_cost ? `$${lead.lob_estimated_cost.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {formatDate(lead.lob_last_updated)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {lead.lob_delivery_date ? formatDate(lead.lob_delivery_date) : '-'}
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