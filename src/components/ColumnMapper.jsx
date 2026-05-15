import { useState, useEffect } from 'react';
import { ChevronDown, AlertCircle, CheckCircle, Save, Trash2, Download, Loader } from 'lucide-react';

const MAPPING_STORAGE_KEY = 'vton_column_mappings';

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
  
  const [savedMappings, setSavedMappings] = useState(() => {
    try {
      const stored = localStorage.getItem(MAPPING_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const requiredFields = VTON_FIELDS.filter(f => f.required);
  const mappedRequired = requiredFields.filter(f => mapping[f.name]);
  const isValid = mappedRequired.length === requiredFields.length;

  const handleMappingChange = (fieldName, csvColumn) => {
    setMapping(prev => ({
      ...prev,
      [fieldName]: csvColumn
    }));
  };

  const saveMapping = (name) => {
    const updated = {
      ...savedMappings,
      [name]: { ...mapping, saved_at: new Date().toISOString() }
    };
    setSavedMappings(updated);
    localStorage.setItem(MAPPING_STORAGE_KEY, JSON.stringify(updated));
    setShowSaveModal(false);
    setSaveName('');
  };

  const loadMapping = (name) => {
    const profile = savedMappings[name];
    if (profile) {
      const { saved_at, ...mappingData } = profile;
      setMapping(mappingData);
      setSelectedProfile(name);
    }
  };

  const deleteMapping = (name) => {
    const updated = { ...savedMappings };
    delete updated[name];
    setSavedMappings(updated);
    localStorage.setItem(MAPPING_STORAGE_KEY, JSON.stringify(updated));
    if (selectedProfile === name) setSelectedProfile(null);
  };

  const categories = [...new Set(VTON_FIELDS.map(f => f.category))];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-4xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Map CSV Columns</h3>
          <p className="text-sm text-slate-500">Match your CSV columns to VTON lead fields. Required fields marked with *</p>
        </div>
        {selectedProfile && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            Loaded: {selectedProfile}
          </span>
        )}
      </div>

      {/* Saved Mappings */}
      {Object.keys(savedMappings).length > 0 && (
        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-slate-600 mb-3">Saved Profiles</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(savedMappings).map(name => (
              <div key={name} className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                <button
                  onClick={() => loadMapping(name)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                >
                  {name}
                </button>
                <button
                  onClick={() => deleteMapping(name)}
                  className="p-1 text-slate-400 hover:text-red-600 transition"
                  title="Delete mapping"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
          disabled={isImporting}
          className="px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => setShowSaveModal(true)}
          disabled={!isValid || isImporting}
          className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 transition"
          title="Save this mapping for future imports"
        >
          <Save className="h-4 w-4" />
          Save Mapping
        </button>
        <button
          onClick={async () => {
            setIsImporting(true);
            setImportProgress(0);
            const progressInterval = setInterval(() => {
              setImportProgress(prev => Math.min(prev + Math.random() * 25, 90));
            }, 300);
            try {
              await onMappingConfirm(mapping);
            } finally {
              clearInterval(progressInterval);
              setImportProgress(100);
              setIsImporting(false);
            }
          }}
          disabled={!isValid || isImporting}
          className="flex-1 relative overflow-hidden px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition"
        >
          {isImporting && (
            <div className="absolute inset-0 bg-blue-400/30 transition-all" style={{ width: `${importProgress}%` }} />
          )}
          <span className="relative flex items-center justify-center gap-2">
            {isImporting && <Loader className="h-4 w-4 animate-spin" />}
            {isImporting ? 'Importing...' : 'Confirm & Import'}
          </span>
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h4 className="text-lg font-bold text-slate-900 mb-4">Save Column Mapping</h4>
            <p className="text-sm text-slate-500 mb-4">Name this mapping so you can reuse it next time</p>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="e.g. PropertyRadar Menifee 2024"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setSaveName('');
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => saveName && saveMapping(saveName)}
                disabled={!saveName.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-slate-300 transition"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}