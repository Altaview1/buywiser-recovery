import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, X, Eye, ChevronDown, Copy, Send } from 'lucide-react';
import { getVariablesByCategory, getVariableSyntax } from '@/lib/vtonTemplateVariables';

const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="margin:0;padding:0;background:#ffffff;font-family:Georgia,serif;color:#1a1a1a;line-height:1.6;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;padding:50px 40px;">
          <!-- Letterhead -->
          <tr><td style="border-top:3px solid #0B1F3B;border-bottom:1px solid #cccccc;padding-bottom:18px;margin-bottom:36px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="vertical-align:middle;">
                  <img src="https://media.base44.com/images/public/6a03e2a66969bf6b43fd5faf/a1ebeee25_BuywiserLogoGoldLighterBlueforFBCircle.jpg" alt="BuyWiser" width="72" height="72" style="display:block;border-radius:6px;" />
                </td>
                <td style="vertical-align:middle;padding-left:16px;">
                  <p style="margin:0 0 2px 0;font-size:18px;font-weight:bold;color:#0B1F3B;letter-spacing:0.5px;">BuyWiser's Veterans GAP NextMove™</p>
                  <p style="margin:0 0 6px 0;font-size:12px;font-weight:600;color:#B8860B;letter-spacing:0.5px;">Benefit Program</p>
                  <span style="display:inline-block;font-size:9px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;color:#ffffff;background:#555555;padding:2px 8px;border-radius:3px;">Private Program · Not a Government Program</span>
                </td>
                <td style="vertical-align:top;text-align:right;">
                  <p style="margin:0;font-size:11px;color:#666666;">May 2026</p>
                </td>
              </tr>
            </table>
          </td></tr>
          <!-- Recipient -->
          <tr><td style="padding-top:30px;padding-bottom:24px;font-size:12px;color:#1a1a1a;">
            \${first_name} \${last_name}<br/>
            \${property_address}<br/>
            \${city}, \${state} \${zip_code}
          </td></tr>
          <!-- Salutation -->
          <tr><td style="padding-bottom:20px;font-size:13px;color:#1a1a1a;">
            Dear \${first_name},
          </td></tr>
          <!-- Body paragraphs -->
          <tr><td style="padding-bottom:16px;font-size:12px;line-height:1.8;color:#1a1a1a;">
            We are reaching out because your home is currently listed for sale — and as a veteran homeowner, you may be eligible for a meaningful financial credit when you purchase your next home.
          </td></tr>
          <tr><td style="padding-bottom:16px;font-size:12px;line-height:1.8;color:#1a1a1a;">
            Our records indicate your property is currently offered for sale:
          </td></tr>
          <!-- Property box -->
          <tr><td style="background:#f5f5f5;border-left:4px solid #0B1F3B;padding:14px 18px;margin:20px 0;">
            <p style="margin:0 0 4px 0;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#666666;">Current Property</p>
            <p style="margin:0 0 6px 0;font-size:13px;font-weight:bold;color:#1a1a1a;">\${property_address}</p>
            <p style="margin:0;font-size:11px;color:#666666;">\${city}, \${state} \${zip_code}</p>
          </td></tr>
          <!-- Program description -->
          <tr><td style="padding-top:16px;padding-bottom:16px;font-size:12px;line-height:1.8;color:#1a1a1a;">
            Through our privately funded program, qualifying veteran homeowners may receive a closing credit applied toward their next home purchase. This credit is funded entirely by BuyWiser's Veterans GAP NextMove™ Benefit Program — not by the VA or any government agency — as our way of honoring those who served.
          </td></tr>
          <!-- Benefit box -->
          <tr><td style="background:#f9f9f9;border:1px solid #dddddd;padding:14px;margin:18px 0;">
            <p style="margin:0 0 6px 0;font-weight:bold;color:#0B1F3B;font-size:12px;">What You May Qualify For</p>
            <p style="margin:0;font-size:12px;line-height:1.7;color:#1a1a1a;">Qualifying veteran homeowners may receive up to 1.5% of their next home's purchase price as a credit applied at closing. The final amount depends on your individual situation and purchase structure.</p>
          </td></tr>
          <!-- Timing -->
          <tr><td style="padding-top:16px;padding-bottom:16px;font-size:12px;line-height:1.8;color:#1a1a1a;">
            <strong>Timing matters.</strong> This opportunity is available during your transition window — while your current home is listed. Understanding your options now ensures you do not miss a credit that may not be available after you have already moved.
          </td></tr>
          <!-- CTA -->
          <tr><td style="padding-top:10px;padding-bottom:16px;">
            <p style="margin:0 0 10px 0;font-size:13px;font-weight:bold;color:#0B1F3B;">Schedule Your Complimentary Review</p>
            <p style="margin:0;font-size:12px;line-height:1.8;color:#1a1a1a;">We invite you to schedule a brief, no-obligation consultation. Our team will walk through your specific situation and confirm exactly what you qualify for — at no cost to you.</p>
          </td></tr>
          <!-- Contact info -->
          <tr><td style="padding-bottom:8px;font-size:12px;color:#1a1a1a;">
            <p style="margin:0 0 6px 0;"><strong>Phone:</strong> (818) 300-2642</p>
            <p style="margin:0 0 6px 0;"><strong>Web:</strong> buywiser.com/vton</p>
            <p style="margin:0;"><strong>Personalized Benefit Page:</strong> buywiser.com/b</p>
          </td></tr>
          <!-- Closing -->
          <tr><td style="padding-top:28px;padding-bottom:8px;font-size:12px;color:#1a1a1a;">
            Thank you for your service. We look forward to supporting your next chapter.
          </td></tr>
          <!-- Signature -->
          <tr><td style="padding-top:20px;padding-bottom:28px;font-size:11px;color:#1a1a1a;">
            Sincerely,<br/><br/>
            <span style="font-weight:bold;color:#0B1F3B;">Bennett Liss</span><br/>
            <span style="color:#666666;">Founder | Buywiser Home Loans</span><br/>
            <span style="color:#999999;font-size:10px;">NMLS #1524446 | CA RE License #01107013</span>
          </td></tr>
          <!-- Disclosure box -->
          <tr><td style="border:1px solid #cccccc;border-radius:4px;padding:10px 14px;background:#fafafa;font-size:10px;color:#666666;line-height:1.6;">
            <strong>PRIVATE PROGRAM DISCLOSURE:</strong> The BuyWiser's Veterans GAP NextMove™ Benefit Program is privately funded and operated exclusively by Buywiser Technology, Inc. DBA Buywiser Home Loans (NMLS #1887767). It is not affiliated with, endorsed by, or connected to the U.S. Department of Veterans Affairs, any military branch, or any government agency. All amounts are privately funded, qualification-based, and subject to final loan approval.
          </td></tr>
          <!-- Legal disclaimer -->
          <tr><td style="padding-top:24px;border-top:1px solid #dddddd;margin-top:32px;font-size:10px;color:#999999;line-height:1.6;">
            BuyWiser's Veterans GAP NextMove™ Benefit Program · Buywiser Technology, Inc. DBA Buywiser Home Loans. Company NMLS #1887767. Individual NMLS #1524446. Licensed by the California DFPI under the California Residential Mortgage Lending Act. This is not a commitment to lend. All programs subject to borrower qualification. Equal Housing Opportunity.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

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
      if (config.length > 0 && config[0].letter_html) {
        setTemplate(config[0].letter_html);
        setIsApproved(config[0].is_approved || false);
      } else {
        setTemplate(DEFAULT_TEMPLATE);
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

  const saveTemplateToDB = async (approve) => {
    const config = await base44.entities.VTONMailConfig.list();
    const data = { letter_html: template };
    if (approve !== undefined) data.is_approved = approve;
    if (config.length > 0) {
      await base44.entities.VTONMailConfig.update(config[0].id, data);
    } else {
      await base44.entities.VTONMailConfig.create({ ...data, is_approved: approve === true });
    }
  };

  const handleSaveTemplate = async () => {
    try {
      setSaving(true);
      await saveTemplateToDB(null);
      setMessage('✓ Template saved to database');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error saving template: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    try {
      setSaving(true);
      await saveTemplateToDB(true);
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

  const handleSendTestEmail = async () => {
    if (!testEmail || !template.trim()) return;
    try {
      setSendingTest(true);
      await base44.functions.invoke('sendVTONTestEmail', {
        toEmail: testEmail,
        leadId: selectedLeadId || null,
      });
      setMessage(`✓ Test email sent to ${testEmail}`);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('❌ Error: ' + (err?.response?.data?.error || err.message));
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
            {message && <span className="text-sm font-medium text-slate-800">{message}</span>}
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
                  {!isApproved && (
                    <button
                      onClick={() => setTemplate(DEFAULT_TEMPLATE)}
                      className="text-xs px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-800 transition"
                    >
                      Load Default Template
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
            <>
              <button
                onClick={handleSaveTemplate}
                disabled={saving || !template.trim()}
                className="px-6 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
              >
                {saving ? 'Saving...' : 'Save Template'}
              </button>
              <button
                onClick={handleApprove}
                disabled={saving || !template.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
              >
                {saving ? 'Approving...' : 'Approve & Activate'}
              </button>
            </>
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
              disabled={sendingTest || !testEmail}
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