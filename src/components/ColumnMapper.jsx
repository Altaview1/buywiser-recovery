import { useState } from 'react';
import { ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';

const VTON_FIELDS = [
  { name: 'first_name', label: 'First Name', required: true, category: 'Owner' },
  { name: 'last_name', label: 'Last Name', required: false, category: 'Owner' },
  { name: 'phone', label: 'Phone', required: false, category: 'Contact' },
  { name: 'email', label: 'Email', required: false, category: 'Contact' },
  { name: 'property_address', label: 'Property Address', required: true, category: 'Property' },
  { name: 'city', label: 'City', required: false, category: 'Property' },
  { name: 'state', label: 'State', required: false, category: 'Property' },
  { name: 'zip_code', label: 'Zip Code', required: false, category: 'Property' },
  { name: 'listing_price', label: 'Listing Price / Est Value', required: false, category: 'Financial' },
  { name: 'estimated_equity', label: 'Estimated Equity', required: false, category: 'Financial' },
  { name: 'likely_va_loan_indicator', label: 'Likely VA Loan', required: false, category: 'Indicators' },
];

export default function ColumnMapper({ csvHeaders, onMappingConfirm, onCancel }) {
  const [mapping, setMapping] = useState(() => {
    // Auto-detect mappings
    const initialMapping = {};
    VTON_FIELDS.forEach(field => {
      const match = csvHeaders.find(h => 
        h.toLowerCase().includes(field.name.toLowerCase()) ||
        h.toLowerCase().includes(field.label.toLowerCase().replace(/\s+/g, ''))
      );
      initialMapping[field.name] = match || '';
    });
    return initialMapping;
  });

  const requiredFields = VTON_FIELDS.filter(f => f.required);
  const mappedRequired = requiredFields.filter(f => mapping[f.name]);
  const isValid = mappedRequired.length === requiredFields.length;

  const handleMappingChange = (fieldName, csvColumn) => {
    setMapping(prev => ({
      ...prev,
      [fieldName]: csvColumn
    }));
  };

  const categories = [...new Set(VTON_FIELDS.map(f => f.category))];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-4xl">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Map CSV Columns</h3>
        <p className="text-sm text-slate-500">Match your CSV columns to VTON lead fields. Required fields marked with *</p>
      </div>

      {/* Validation Status */}
      <div className="mb-6 flex items-start gap-2 p-3 rounded-lg" style={{
        background: isValid ? '#f0fdf4' : '#fef2f2',
        border: `1px solid ${isValid ? '#bbf7d0' : '#fecaca'}`
      }}>
        {isValid ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">All required fields mapped ✓</p>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">Map all required fields (*) to proceed</p>
          </>
        )}
      </div>

      {/* Mapping Grid by Category */}
      <div className="space-y-6 mb-6">
        {categories.map(category => (
          <div key={category}>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">{category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {VTON_FIELDS.filter(f => f.category === category).map(field => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    {field.label} {field.required && <span className="text-red-600">*</span>}
                  </label>
                  <select
                    value={mapping[field.name]}
                    onChange={(e) => handleMappingChange(field.name, e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="">— No mapping —</option>
                    {csvHeaders.map(header => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Table */}
      {csvHeaders.length > 0 && (
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-600 mb-3">CSV Columns Found</p>
          <div className="flex flex-wrap gap-2">
            {csvHeaders.map(header => (
              <span key={header} className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700">
                {header}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => onMappingConfirm(mapping)}
          disabled={!isValid}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition"
        >
          Confirm Mapping & Import
        </button>
      </div>
    </div>
  );
}