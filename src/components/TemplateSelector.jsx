import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronDown, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TemplateSelector({ lead, templateType, onSelect, onClose }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewText, setPreviewText] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.EmailTemplate.filter({ type: templateType, is_active: true }, 'order')
      .then(data => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading templates:', err);
        setLoading(false);
      });
  }, [templateType]);

  const interpolateTemplate = (template) => {
    let text = template.type === 'email' 
      ? `Subject: ${template.subject || ''}\n\n${template.body}`
      : template.body;

    const placeholders = {
      '{{first_name}}': lead.first_name || 'Homeowner',
      '{{last_name}}': lead.last_name || '',
      '{{property_address}}': lead.property_address || '',
      '{{equity}}': lead.estimated_equity ? `$${lead.estimated_equity.toLocaleString()}` : 'your estimated equity',
      '{{phone}}': lead.phone || '',
      '{{email}}': lead.email || '',
      '{{price}}': lead.estimated_price ? `$${lead.estimated_price.toLocaleString()}` : '',
      '{{distress_score}}': lead.distress_score || ''
    };

    Object.entries(placeholders).forEach(([key, value]) => {
      text = text.replace(new RegExp(key, 'g'), value);
    });

    return text;
  };

  const handleSelectTemplate = (template) => {
    const preview = interpolateTemplate(template);
    setSelectedTemplate(template);
    setPreviewText(preview);
  };

  const handleCopyAndClose = () => {
    navigator.clipboard.writeText(previewText);
    setCopied(true);
    setTimeout(() => {
      onSelect(previewText, selectedTemplate);
      onClose();
    }, 800);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-center">
            <div className="w-6 h-6 border-3 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-slate-900">
            {templateType === 'email' ? '📧 Email Templates' : '☎️ Call Scripts'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Select a template to customize and copy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-6">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <p className="font-semibold text-sm text-slate-900">{template.name}</p>
              {template.category && (
                <p className="text-xs text-slate-500 capitalize mt-1">{template.category.replace('_', ' ')}</p>
              )}
            </button>
          ))}
        </div>

        {selectedTemplate && (
          <div className="border-t border-slate-200 p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Preview (personalized)</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-48 overflow-y-auto whitespace-pre-wrap text-xs text-slate-700 leading-relaxed">
                {previewText}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCopyAndClose}
                className="flex-1 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy & Use
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {templates.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">
            No templates available yet. Create some in Admin Settings.
          </div>
        )}
      </div>
    </div>
  );
}