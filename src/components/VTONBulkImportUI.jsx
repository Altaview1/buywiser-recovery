import { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Loader, Database } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ColumnMapper from './ColumnMapper';

export default function VTONBulkImportUI({ onImportComplete }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [duplicateCheck, setDuplicateCheck] = useState(null);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [addressDuplicates, setAddressDuplicates] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
      setCsvHeaders(null);
      setCsvData(null);
      setMapping(null);
    }
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = values[i];
      });
      return obj;
    });
    return data;
  };

  const parseJSON = (text) => {
    return JSON.parse(text);
  };

  const handlePreviewAndMap = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      const fileContent = await file.text();
      await checkDuplicates(fileContent, file.name.endsWith('.csv'));
    } catch (err) {
      setError(err.message);
      setCsvData(null);
      setCsvHeaders(null);
    }
  };

  const checkDuplicates = async (fileContent, isCsv) => {
    setCheckingDuplicates(true);
    setDuplicateCheck(null);
    
    try {
      let data = [];
      let headers = [];

      if (isCsv) {
        data = parseCSV(fileContent);
        headers = Object.keys(data[0] || {});
      } else {
        const parsed = parseJSON(fileContent);
        data = Array.isArray(parsed) ? parsed : parsed.leads || [];
        headers = Object.keys(data[0] || {});
      }

      if (data.length === 0) {
        throw new Error('No leads found in file');
      }

      // Extract emails, phones, and addresses for duplicate check
      const uploadEmails = data.filter(r => r.email).map(r => r.email.toLowerCase().trim());
      const uploadPhones = data.filter(r => r.phone).map(r => r.phone.replace(/\D/g, ''));
      const uploadAddresses = data.filter(r => r.property_address).map(r => {
        const addr = r.property_address.toLowerCase().trim();
        const city = (r.city || '').toLowerCase().trim();
        const state = (r.state || '').toUpperCase().trim();
        const zip = (r.zip_code || '').replace(/\D/g, '').trim();
        return `${addr}|${city}|${state}|${zip}`;
      });

      // Get existing leads
      const existingLeads = await base44.entities.VTONLead.list(undefined, 10000);
      
      const existingEmails = new Set(existingLeads.map(l => l.email?.toLowerCase().trim()).filter(Boolean));
      const existingPhones = new Set(existingLeads.map(l => l.phone?.replace(/\D/g, '')).filter(Boolean));
      const existingAddresses = new Map(
        existingLeads
          .filter(l => l.property_address)
          .map(l => {
            const addr = l.property_address.toLowerCase().trim();
            const city = (l.city || '').toLowerCase().trim();
            const state = (l.state || '').toUpperCase().trim();
            const zip = (l.zip_code || '').replace(/\D/g, '').trim();
            return [`${addr}|${city}|${state}|${zip}`, l];
          })
      );

      // Find email and phone duplicates
      const emailDuplicates = data.filter(r => r.email && existingEmails.has(r.email.toLowerCase().trim()));
      const phoneDuplicates = data.filter(r => r.phone && existingPhones.has(r.phone.replace(/\D/g, '')));
      
      // Find address duplicates
      const addressDuplicateRecords = [];
      data.forEach((record, index) => {
        const addr = record.property_address?.toLowerCase().trim();
        const city = (record.city || '').toLowerCase().trim();
        const state = (record.state || '').toUpperCase().trim();
        const zip = (record.zip_code || '').replace(/\D/g, '').trim();
        const key = `${addr}|${city}|${state}|${zip}`;
        
        if (addr && existingAddresses.has(key)) {
          addressDuplicateRecords.push({
            row: index + 2,
            address: record.property_address,
            city: record.city,
            state: record.state,
            zip: record.zip_code,
            existingLead: existingAddresses.get(key)
          });
        }
      });

      setAddressDuplicates(addressDuplicateRecords);
      
      // Combine all duplicates (avoid counting same record twice)
      const allDuplicates = new Set([...emailDuplicates, ...phoneDuplicates, ...addressDuplicateRecords.map(d => data[d.row - 2])]);

      setDuplicateCheck({
        total: data.length,
        duplicates: allDuplicates.size,
        newRecords: data.length - allDuplicates.size,
        emailDuplicates: emailDuplicates.length,
        phoneDuplicates: phoneDuplicates.length,
        addressDuplicates: addressDuplicateRecords.length,
        duplicateRecords: [...allDuplicates].slice(0, 10) // First 10 for preview
      });

      setCsvData(data);
      setCsvHeaders(headers);
    } catch (err) {
      setError(err.message);
      setCsvData(null);
      setCsvHeaders(null);
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const handleMappingConfirm = async (columnMapping) => {
    setLoading(true);
    setError(null);

    try {
      // Remap CSV data based on column mapping
      const remappedLeads = csvData.map(row => {
        const remapped = {};
        Object.entries(columnMapping).forEach(([vtonField, csvColumn]) => {
          if (csvColumn && row[csvColumn] !== undefined) {
            remapped[vtonField] = row[csvColumn];
          }
        });
        return remapped;
      });

      // Call backend import function with remapped data
      const response = await base44.functions.invoke('vtonBulkImportPropertyRadar', {
        leads: remappedLeads
      });

      setResult(response.data);
      setFile(null);
      setCsvHeaders(null);
      setCsvData(null);
      setMapping(null);
      setDuplicateCheck(null);
      setAddressDuplicates(null);

      // Trigger refresh if callback provided
      setTimeout(() => {
        if (onImportComplete) onImportComplete();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-4xl">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Bulk Import PropertyRadar Data</h3>
        <p className="text-sm text-slate-500">Upload CSV or JSON file with lead data. Map columns, then campaigns auto-trigger on import.</p>
      </div>

      {csvHeaders && !result ? (
        <>
          {/* Duplicate Check Results */}
          {duplicateCheck && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <Database className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900">Duplicate Check Complete</h4>
                  <p className="text-sm text-blue-700">Scanned {duplicateCheck.total} records against existing database</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600 font-semibold">New Records</p>
                  <p className="text-2xl font-black text-green-600">{duplicateCheck.newRecords}</p>
                </div>
                <div className="bg-white border border-yellow-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-yellow-600 font-semibold">Duplicates</p>
                  <p className="text-2xl font-black text-yellow-600">{duplicateCheck.duplicates}</p>
                </div>
                <div className="bg-white border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600 font-semibold">Total Upload</p>
                  <p className="text-2xl font-black text-blue-700">{duplicateCheck.total}</p>
                </div>
              </div>

              {duplicateCheck.duplicates > 0 && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-xs font-semibold text-blue-700 mb-2">Duplicate Breakdown:</p>
                  <div className="text-xs text-blue-600 space-y-1">
                    <p>• {duplicateCheck.emailDuplicates} records with matching email</p>
                    <p>• {duplicateCheck.phoneDuplicates} records with matching phone</p>
                    {duplicateCheck.addressDuplicates > 0 && (
                      <p>• {duplicateCheck.addressDuplicates} records with matching address</p>
                    )}
                  </div>
                  
                  {duplicateCheck.duplicateRecords.length > 0 && (
                    <div className="mt-3 max-h-32 overflow-y-auto bg-white border border-blue-100 rounded-lg p-2">
                      <p className="text-xs font-semibold text-blue-700 mb-1">Sample duplicates:</p>
                      {duplicateCheck.duplicateRecords.map((rec, i) => (
                        <p key={i} className="text-xs text-blue-600 truncate">
                          • {rec.first_name} {rec.last_name} - {rec.email || rec.phone || rec.property_address}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Address Duplicates Detail */}
              {addressDuplicates && addressDuplicates.length > 0 && (
                <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-orange-900">Address Duplicates Detected</h4>
                      <p className="text-sm text-orange-700">These properties already exist in your database</p>
                    </div>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto bg-white border border-orange-100 rounded-lg p-3">
                    <table className="w-full text-xs">
                      <thead className="text-orange-700 font-semibold border-b border-orange-200">
                        <tr>
                          <th className="text-left py-2">Row</th>
                          <th className="text-left py-2">Address</th>
                          <th className="text-left py-2">Existing Lead</th>
                        </tr>
                      </thead>
                      <tbody>
                        {addressDuplicates.slice(0, 10).map((dup, i) => (
                          <tr key={i} className="border-b border-orange-100 last:border-0">
                            <td className="py-2 text-orange-600 font-medium">{dup.row}</td>
                            <td className="py-2 text-orange-700">
                              {dup.address}<br/>
                              <span className="text-orange-500">{dup.city}, {dup.state} {dup.zip}</span>
                            </td>
                            <td className="py-2 text-orange-600">
                              {dup.existingLead.first_name} {dup.existingLead.last_name}<br/>
                              <span className="text-orange-500">{dup.existingLead.email || dup.existingLead.phone}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {addressDuplicates.length > 10 && (
                      <p className="text-xs text-orange-600 text-center py-2">
                        + {addressDuplicates.length - 10} more address duplicates
                      </p>
                    )}
                  </div>
                  
                  <p className="text-xs text-orange-700 mt-3 font-medium">
                    ⚠️ These {addressDuplicates.length} records will be skipped during import to prevent duplicates
                  </p>
                </div>
              )}
            </div>
          )}

          <ColumnMapper
            csvHeaders={csvHeaders}
            onMappingConfirm={handleMappingConfirm}
            onCancel={() => {
              setCsvHeaders(null);
              setCsvData(null);
              setFile(null);
              setDuplicateCheck(null);
              setAddressDuplicates(null);
            }}
          />
        </>
      ) : !result ? (
        <div className="space-y-4">
          {/* File upload */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition" onClick={() => document.getElementById('fileInput').click()}>
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">
              {file ? file.name : 'Click or drag to upload CSV/JSON'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Supports: CSV, JSON</p>
            <input
              id="fileInput"
              type="file"
              accept=".csv,.json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Format guide */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-slate-600 mb-2">Expected CSV/JSON Columns:</p>
            <div className="text-xs text-slate-500 space-y-1">
              <p>• first_name, last_name, phone, email</p>
              <p>• property_address, city, state, zip_code</p>
              <p>• listing_date, listing_price, estimated_equity</p>
              <p>• likely_va_loan (true/false)</p>
            </div>
          </div>

          {/* Preview & Map button */}
          <button
            onClick={handlePreviewAndMap}
            disabled={!file || loading || checkingDuplicates}
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition flex items-center justify-center gap-2"
          >
            {checkingDuplicates ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Checking Duplicates...
              </>
            ) : loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Check Duplicates & Map
              </>
            )}
          </button>
        </div>
      ) : (
        /* Results */
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Import Complete</p>
              <p className="text-sm text-green-700">{result.import_summary.created} leads imported, {result.import_summary.campaign_triggered} campaigns triggered</p>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-semibold">Created</p>
              <p className="text-2xl font-black text-blue-700">{result.import_summary.created}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-600 font-semibold">Duplicates</p>
              <p className="text-2xl font-black text-yellow-700">{result.import_summary.duplicates}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-600 font-semibold">Campaigns</p>
              <p className="text-2xl font-black text-green-700">{result.import_summary.campaign_triggered}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-600 font-semibold">Errors</p>
              <p className="text-2xl font-black text-red-700">{result.import_summary.errors.length}</p>
            </div>
          </div>

          {/* Error details */}
          {result.import_summary.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-y-auto">
              <p className="text-xs font-semibold text-red-700 mb-2">Import Errors</p>
              {result.import_summary.errors.slice(0, 3).map((err, i) => (
                <p key={i} className="text-xs text-red-600 mb-1">• {err.error}</p>
              ))}
              {result.import_summary.errors.length > 3 && (
                <p className="text-xs text-red-600">+ {result.import_summary.errors.length - 3} more errors</p>
              )}
            </div>
          )}

          {/* Reset button */}
          <button
            onClick={() => {
              setResult(null);
              setFile(null);
            }}
            className="w-full px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
          >
            Import Another File
          </button>
        </div>
      )}
    </div>
  );
}