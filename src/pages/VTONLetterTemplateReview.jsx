import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, X, Eye } from 'lucide-react';

export default function VTONLetterTemplateReview() {
  const [template, setTemplate] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Sample lead for preview
  const sampleLead = {
    first_name: 'John',
    last_name: 'Smith',
    property_address: '1234 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zip_code: '90001',
  };

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const config = await base44.entities.VTONMailConfig.list();
      if (config.length > 0) {
        setTemplate(config[0].letter_html);
        setIsApproved(config[0].is_approved || false);
      } else {
        // No template yet, start with empty
        setTemplate('');
      }
    } catch (err) {
      console.error('Failed to load template:', err);
      setMessage('Error loading template: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePreview = (html, lead) => {
    return html
      .replace(/\$\{first_name\}/g, lead.first_name)
      .replace(/\$\{last_name\}/g, lead.last_name)
      .replace(/\$\{property_address\}/g, lead.property_address)
      .replace(/\$\{city\}/g, lead.city)
      .replace(/\$\{state\}/g, lead.state)
      .replace(/\$\{zip_code\}/g, lead.zip_code);
  };

  const handleApprove = async () => {
    try {
      setSaving(true);
      const config = await base44.asServiceRole.entities.VTONMailConfig.list();
      
      if (config.length > 0) {
        await base44.asServiceRole.entities.VTONMailConfig.update(config[0].id, {
          letter_html: template,
          is_approved: true,
        });
      } else {
        await base44.asServiceRole.entities.VTONMailConfig.create({
          letter_html: template,
          is_approved: true,
        });
      }
      
      setIsApproved(true);
      setMessage('✓ Letter template approved and activated');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error approving template');
    } finally {
      setSaving(false);
    }
  };

  const handleUnapprove = async () => {
    try {
      setSaving(true);
      const config = await base44.asServiceRole.entities.VTONMailConfig.list();
      
      if (config.length > 0) {
        await base44.asServiceRole.entities.VTONMailConfig.update(config[0].id, {
          is_approved: false,
        });
      }
      
      setIsApproved(false);
      setMessage('Letter template unapproved');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating template');
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

  if (message.includes('Error')) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p className="font-semibold">Error loading template:</p>
            <p className="text-sm">{message}</p>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-semibold text-slate-900">Edit HTML</h2>
                <p className="text-xs text-slate-500 mt-1">Use ${'{first_name}'}, ${'{last_name}'}, ${'{property_address}'}, ${'{city}'}, ${'{state}'}, ${'{zip_code}'} for personalization</p>
              </div>
              <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                disabled={isApproved}
                className="w-full h-96 p-4 font-mono text-xs border-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Paste your HTML letter template here..."
              />
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-semibold text-slate-900">Preview</h2>
                <p className="text-xs text-slate-500 mt-1">Sample with demo data</p>
              </div>
              <div className="h-96 overflow-y-auto p-4 bg-white">
                <iframe
                  srcDoc={generatePreview(template, sampleLead)}
                  className="w-full h-full border-0"
                  title="Letter Preview"
                />
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
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>How it works:</strong> Once approved, this letter template will automatically be sent to all new VTONLead records that have a complete address. Each letter is personalized with the lead's information.
          </p>
        </div>
      </div>
    </div>
  );
}