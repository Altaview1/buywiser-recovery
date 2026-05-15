import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, X, Eye, ChevronDown, Copy, Send } from 'lucide-react';
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
  const [authenticated, setAuthenticated] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      // Verify authentication BEFORE loading any data
      const isAuthed = await base44.auth.isAuthenticated();
      if (!isAuthed) {
        window.location.href = '/admin-login';
        return;
      }
      
      // Only NOW set authenticated and load data
      setAuthenticated(true);
      
      // Load template data only after auth is confirmed
      await loadTemplate();
    } catch (err) {
      console.error('Auth check failed:', err);
      window.location.href = '/admin-login';
    } finally {
      setLoading(false);
    }
  };

  const loadTemplate = async () => {
    try {
      // Only load data after auth is confirmed
      const config = await base44.entities.VTONMailConfig.list();
      if (config.length > 0) {
        setTemplate(config[0].letter_html);
        setIsApproved(config[0].is_approved || false);
      } else {
        setTemplate('');
      }
      
      // Load leads for preview
      const allLeads = await base44.entities.VTONLead.list();
      setLeads(allLeads);
      if (allLeads.length > 0) {
        setSelectedLeadId(allLeads[0].id);
        setSelectedLead(allLeads[0]);
      }
    } catch (err) {
      console.error('Failed to load template:', err);
      if (err.response?.status === 401) {
        setMessage('Sign in required to access template');
        window.location.href = '/admin-login';
      } else {
        setMessage('Error loading template: ' + err.message);
      }
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

  const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html>
  <head>
    <style>
      * { margin: 0; padding: 0; }
      body { font-family: 'Georgia', serif; color: #1a1a1a; line-height: 1.6; }
      .wrapper { width: 100%; max-width: 850px; margin: 0 auto; padding: 60px 50px; }
      .letterhead { border-top: 3px solid #0B1F3B; border-bottom: 1px solid #ccc; padding-bottom: 20px; margin-bottom: 40px; }
      .logo { font-size: 18px; font-weight: bold; color: #0B1F3B; letter-spacing: 1px; }
      .date { font-size: 11px; color: #666; margin-top: 8px; }
      .recipient { margin-bottom: 30px; font-size: 12px; }
      .salutation { margin-bottom: 25px; font-size: 13px; }
      .body-text { margin-bottom: 18px; font-size: 12px; line-height: 1.8; text-align: justify; }
      .property-box { background: #f5f5f5; border-left: 4px solid #0B1F3B; padding: 15px 18px; margin: 25px 0; font-size: 12px; }
      .property-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; margin-bottom: 4px; }
      .property-address { font-size: 13px; font-weight: bold; color: #1a1a1a; }
      .benefit-highlight { background: #f9f9f9; border: 1px solid #ddd; padding: 15px; margin: 22px 0; font-size: 12px; line-height: 1.7; }
      .benefit-title { font-weight: bold; color: #0B1F3B; font-size: 12px; margin-bottom: 6px; }
      .cta-section { margin: 35px 0; }
      .primary-cta { font-size: 13px; font-weight: bold; color: #0B1F3B; margin-bottom: 12px; }
      .qr-container { display: inline-block; margin: 15px 0; text-align: center; }
      .qr-label { font-size: 10px; color: #666; margin-top: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
      .contact-info { margin: 20px 0; font-size: 12px; }
      .contact-line { margin: 6px 0; }
      .closing { margin-top: 35px; font-size: 12px; }
      .signature { margin-top: 25px; font-size: 11px; }
      .signature-name { font-weight: bold; color: #0B1F3B; }
      .signature-title { color: #666; font-size: 11px; }
      .disclaimer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; color: #999; line-height: 1.6; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="letterhead">
        <div class="logo">VETERAN TRANSITION OPPORTUNITY NETWORK™</div>
        <div class="date">May 2026</div>
      </div>
      <div class="recipient">
        \${first_name} \${last_name}<br/>
        \${property_address}<br/>
        \${city}, \${state} \${zip_code}
      </div>
      <div class="salutation">Dear \${first_name},</div>
      <div class="body-text">
        We are writing to inform you of a significant opportunity that may be available to you during this important transition period.
      </div>
      <div class="body-text">
        Our records indicate that your property is currently being offered for sale:
      </div>
      <div class="property-box">
        <div class="property-label">Current Property</div>
        <div class="property-address">\${property_address}</div>
        <div style="margin-top: 8px; font-size: 11px; color: #666;">\${city}, \${state} \${zip_code}</div>
      </div>
      <div class="body-text">
        Based on your homeownership history, you may qualify for the VTON™ Veteran Homeowner Transition Benefit—a qualification-based financial benefit designed specifically for veterans purchasing their next home. This benefit recognizes the unique financial position of veteran homeowners navigating the transition from one property to the next.
      </div>
      <div class="benefit-highlight">
        <div class="benefit-title">Your Potential Qualification</div>
        <div style="font-size: 12px;">
          Qualifying veteran homeowners may receive up to 1.5% in transition benefits applied at closing on their next home purchase. The actual benefit depends on how your next purchase is structured and your specific circumstances.
        </div>
      </div>
      <div class="body-text">
        <strong>Timing is important.</strong> As you prepare to transition from your current home, understanding your available benefits before making next-home decisions will ensure you capture opportunities that may not be available later.
      </div>
      <div class="cta-section">
        <div class="primary-cta">Schedule a Confidential Benefit Review</div>
        <div class="body-text" style="margin-bottom: 0;">
          We invite you to schedule a brief, no-obligation benefit review consultation. Our team will assess your specific situation and clarify exactly what you may qualify for.
        </div>
      </div>
      <div class="contact-info">
        <div class="contact-line"><strong>Phone:</strong> (818) 300-2642</div>
        <div class="contact-line"><strong>Web:</strong> buywiser.com/vton</div>
        <div class="contact-line"><strong>Personalized Benefit Page:</strong> buywiser.com/b</div>
      </div>
      <div class="closing">
        Thank you for your service. We look forward to discussing how we can support your next home transition.
      </div>
      <div class="signature">
        Sincerely,<br/><br/>
        <span class="signature-name">Bennett Liss</span><br/>
        <span class="signature-title">Founder, VTON™ | Buywiser Home Loans</span><br/>
        <span style="color: #999; font-size: 10px;">NMLS #1524446 | CA RE License #01107013</span>
      </div>
      <div class="disclaimer">
        <strong>Important Notice:</strong> This communication is being sent to provide information about programs available to qualifying veteran homeowners. The VTON™ Veteran Homeowner Transition Benefit is a private program operated by Buywiser Home Loans and is not affiliated with, endorsed by, or connected to the United States Department of Veterans Affairs or any government agency. All benefit amounts are qualification-based and subject to final verification and loan approval.
      </div>
    </div>
  </body>
</html>`;

  const handleSendTestEmail = async () => {
    if (!testEmail || !template.trim()) return;
    try {
      setSendingTest(true);
      await base44.functions.invoke('sendVTONTestEmail', {
        toEmail: testEmail,
        templateHtml: template,
        leadId: selectedLeadId || null,
      });
      setMessage(`✓ Test email sent to ${testEmail}`);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Error sending test email: ' + err.message);
    } finally {
      setSendingTest(false);
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

  // Show loading while checking authentication
  if (loading || !authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Loading...</p>
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto"></div>
        </div>
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
                <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-slate-900">Edit HTML Template</h2>
                {!template && (
                  <button
                    onClick={() => setTemplate(DEFAULT_TEMPLATE)}
                    className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Load Default Template
                  </button>
                )}
                {template && !isApproved && (
                  <button
                    onClick={() => { if (window.confirm('Reset to default template?')) setTemplate(DEFAULT_TEMPLATE); }}
                    className="text-xs px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-300 transition"
                  >
                    Reset to Default
                  </button>
                )}
              </div>
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
        <div className="flex flex-wrap gap-3 mt-6 items-center">
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

          {/* Send Test Email */}
          <div className="flex items-center gap-2 ml-auto bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <Send className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your@email.com"
              className="text-sm border-0 bg-transparent focus:outline-none w-48 placeholder-blue-300 text-blue-900"
            />
            <button
              onClick={handleSendTestEmail}
              disabled={sendingTest || !testEmail || !template.trim()}
              className="px-3 py-1 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition whitespace-nowrap"
            >
              {sendingTest ? 'Sending...' : 'Send Test'}
            </button>
          </div>

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