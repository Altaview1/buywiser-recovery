import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, X, Eye, ChevronDown, Copy } from 'lucide-react';
import { getVariablesByCategory, getVariableSyntax } from '@/lib/vtonTemplateVariables';

export default function VTONLetterTemplateReview() {
  const [template, setTemplate] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      
      // Try to load config
      try {
        const config = await base44.entities.VTONMailConfig.list();
        if (config.length > 0) {
          setTemplate(config[0].letter_html);
          setIsApproved(config[0].is_approved || false);
        } else {
          setTemplate('');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setMessage('Sign in required to access template');
        } else {
          console.error('Failed to load config:', err);
        }
      }
      
      // Try to load leads
      try {
        const allLeads = await base44.entities.VTONLead.list();
        setLeads(allLeads);
        if (allLeads.length > 0) {
          setSelectedLeadId(allLeads[0].id);
          setSelectedLead(allLeads[0]);
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error('Failed to load leads:', err);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSelect = (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    setSelectedLeadId(leadId);
    setSelectedLead(lead);
  };

  const generatePreview = (html, lead) => {
    if (!lead || !html) return '';
    
    let preview = html;
    // Personalization fields
    preview = preview.replace(/\$\{first_name\}/g, lead.first_name || 'Veteran');
    preview = preview.replace(/\$\{last_name\}/g, lead.last_name || '');
    preview = preview.replace(/\$\{property_address\}/g, lead.property_address || '');
    preview = preview.replace(/\$\{city\}/g, lead.city || '');
    preview = preview.replace(/\$\{state\}/g, lead.state || '');
    preview = preview.replace(/\$\{zip_code\}/g, lead.zip_code || '');
    
    // Benefit-related fields
    preview = preview.replace(/\$\{estimated_benefit\}/g, 
      lead.estimated_benefit ? `$${lead.estimated_benefit.toLocaleString()}` : '$0');
    preview = preview.replace(/\$\{estimated_equity\}/g, 
      lead.estimated_equity ? `$${lead.estimated_equity.toLocaleString()}` : '$0');
    preview = preview.replace(/\$\{listing_price\}/g, 
      lead.listing_price ? `$${lead.listing_price.toLocaleString()}` : '$0');
    
    return preview;
  };

  const handleApprove = async () => {
    try {
      setSaving(true);
      const config = await base44.entities.VTONMailConfig.list();
      
      if (config.length > 0) {
        await base44.entities.VTONMailConfig.update(config[0].id, {
          letter_html: template,
          is_approved: true,
        });
      } else {
        await base44.entities.VTONMailConfig.create({
          letter_html: template,
          is_approved: true,
        });
      }
      
      setIsApproved(true);
      setMessage('✓ Letter template approved and activated');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error approving:', err);
      setMessage('Error approving template: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUnapprove = async () => {
    try {
      setSaving(true);
      const config = await base44.entities.VTONMailConfig.list();
      
      if (config.length > 0) {
        await base44.entities.VTONMailConfig.update(config[0].id, {
          is_approved: false,
        });
      }
      
      setIsApproved(false);
      setMessage('Letter template unapproved');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating:', err);
      setMessage('Error updating template: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">VTON™ Letter Template</h1>
          <p className="text-slate-600">Customize and approve the letter that will be sent to all new veteran leads.</p>
        </div>

        {/* Status Banner */}
        {template && (
          <div className={`rounded-lg p-4 mb-6 flex items-center justify-between ${isApproved ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-center gap-2">
              {isApproved ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-semibold">Template Approved & Active</span>
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-semibold">Template Pending Approval</span>
                </>
              )}
            </div>
            {message && <span className={`text-sm ${isApproved ? 'text-green-700' : 'text-slate-700'}`}>{message}</span>}
          </div>
        )}

        {!template && leads.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-blue-800">No template or leads found. Start by pasting an HTML template below to get started.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-semibold text-slate-900 mb-3">Edit HTML Template</h2>
                <p className="text-xs text-slate-500 mb-2">Click a variable to insert it:</p>
                <div className="space-y-2">
                  {Object.entries(getVariablesByCategory()).map(([category, variables]) => (
                    <div key={category}>
                      <p className="text-xs font-semibold text-slate-600 mb-1">{category}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {variables.map((v) => (
                          <button
                            key={v.name}
                            onClick={() => {
                              const syntax = getVariableSyntax(v.name);
                              navigator.clipboard.writeText(syntax);
                              setMessage(`Copied ${syntax}`);
                              setTimeout(() => setMessage(''), 2000);
                            }}
                            title={v.placeholder}
                            className="text-xs font-mono bg-white hover:bg-blue-50 px-2 py-1.5 rounded border border-slate-200 hover:border-blue-300 transition flex items-center justify-between group"
                          >
                            <span className="text-slate-700 group-hover:text-blue-700">${'{' + v.name + '}'}</span>
                            <Copy className="h-3 w-3 text-slate-400 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                disabled={isApproved}
                className="flex-1 p-4 font-mono text-xs border-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Paste your HTML letter template here..."
              />
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-semibold text-slate-900">Live Preview</h2>
                <p className="text-xs text-slate-500 mt-1 mb-3">Select a veteran to preview their personalized letter:</p>
                <select
                  value={selectedLeadId || ''}
                  onChange={(e) => handleLeadSelect(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">-- Select a veteran --</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.first_name} {lead.last_name} · {lead.property_address}
                    </option>
                  ))}
                </select>
              </div>
              <div className="h-80 overflow-y-auto p-4 bg-white">
                {selectedLead ? (
                  <iframe
                    srcDoc={generatePreview(template, selectedLead)}
                    className="w-full h-full border-0"
                    title="Letter Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <p className="text-sm">Select a veteran to see preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          {!isApproved ? (
            <button
              onClick={handleApprove}
              disabled={saving || !template.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
            >
              {saving ? 'Approving...' : 'Approve & Activate'}
            </button>
          ) : (
            <button
              onClick={handleUnapprove}
              disabled={saving}
              className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-400 disabled:cursor-not-allowed transition"
            >
              {saving ? 'Updating...' : 'Unapprove for Editing'}
            </button>
          )}
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition"
          >
            Back
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>How it works:</strong> Once approved, this letter template will automatically be sent to all new VTONLead records that have a complete address. Each letter is personalized with the lead's information.
            </p>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 font-semibold mb-2">Available Personalization Fields:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-amber-700">
              <div><span className="font-mono bg-white px-2 py-1 rounded">first_name</span> - Veteran's first name</div>
              <div><span className="font-mono bg-white px-2 py-1 rounded">last_name</span> - Veteran's last name</div>
              <div><span className="font-mono bg-white px-2 py-1 rounded">property_address</span> - Home address</div>
              <div><span className="font-mono bg-white px-2 py-1 rounded">city</span> - City</div>
              <div><span className="font-mono bg-white px-2 py-1 rounded">state</span> - State code</div>
              <div><span className="font-mono bg-white px-2 py-1 rounded">zip_code</span> - Zip code</div>
              <div><span className="font-mono bg-blue-100 px-2 py-1 rounded">estimated_benefit</span> - GAP benefit amount</div>
              <div><span className="font-mono bg-blue-100 px-2 py-1 rounded">estimated_equity</span> - Home equity</div>
              <div><span className="font-mono bg-blue-100 px-2 py-1 rounded">listing_price</span> - Property listing price</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}