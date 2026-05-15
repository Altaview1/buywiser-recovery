import { useState } from 'react';
import { Upload, File, AlertCircle, CheckCircle, Loader, Download, Trash2, Copy } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function DuplicateScanner({ onScanComplete }) {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
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

  const scanForDuplicates = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setScanning(true);
    setError(null);

    try {
      const fileContent = await file.text();
      let data = [];

      if (file.name.endsWith('.csv')) {
        data = parseCSV(fileContent);
      } else if (file.name.endsWith('.json')) {
        const parsed = parseJSON(fileContent);
        data = Array.isArray(parsed) ? parsed : parsed.leads || [];
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.');
      }

      if (data.length === 0) {
        throw new Error('No records found in file');
      }

      // Get existing leads from database
      const existingLeads = await base44.entities.VTONLead.list(undefined, 10000);
      
      // Create lookup sets for existing records
      const existingEmails = new Map();
      const existingPhones = new Map();
      
      existingLeads.forEach(lead => {
        if (lead.email) {
          existingEmails.set(lead.email.toLowerCase().trim(), lead);
        }
        if (lead.phone) {
          existingPhones.set(lead.phone.replace(/\D/g, ''), lead);
        }
      });

      // Scan uploaded records for duplicates
      const emailDuplicates = [];
      const phoneDuplicates = [];
      const internalEmailDuplicates = [];
      const internalPhoneDuplicates = [];
      
      const seenEmails = new Map();
      const seenPhones = new Map();

      data.forEach((record, index) => {
        // Check email duplicates
        if (record.email) {
          const email = record.email.toLowerCase().trim();
          
          // Check against existing database
          if (existingEmails.has(email)) {
            emailDuplicates.push({
              row: index + 2, // +2 for header and 0-index
              email: email,
              name: `${record.first_name || ''} ${record.last_name || ''}`.trim(),
              existingLead: existingEmails.get(email)
            });
          }
          
          // Check for internal duplicates (within the upload itself)
          if (seenEmails.has(email)) {
            internalEmailDuplicates.push({
              row: index + 2,
              email: email,
              name: `${record.first_name || ''} ${record.last_name || ''}`.trim(),
              firstOccurrence: seenEmails.get(email)
            });
          } else {
            seenEmails.set(email, index + 2);
          }
        }

        // Check phone duplicates
        if (record.phone) {
          const phone = record.phone.replace(/\D/g, '');
          
          // Check against existing database
          if (existingPhones.has(phone)) {
            phoneDuplicates.push({
              row: index + 2,
              phone: record.phone,
              phoneNormalized: phone,
              name: `${record.first_name || ''} ${record.last_name || ''}`.trim(),
              existingLead: existingPhones.get(phone)
            });
          }
          
          // Check for internal duplicates
          if (seenPhones.has(phone)) {
            internalPhoneDuplicates.push({
              row: index + 2,
              phone: record.phone,
              name: `${record.first_name || ''} ${record.last_name || ''}`.trim(),
              firstOccurrence: seenPhones.get(phone)
            });
          } else {
            seenPhones.set(phone, index + 2);
          }
        }
      });

      const scanResult = {
        totalRecords: data.length,
        uniqueRecords: data.length - emailDuplicates.length - phoneDuplicates.length + internalEmailDuplicates.length + internalPhoneDuplicates.length,
        emailDuplicates: {
          count: emailDuplicates.length,
          records: emailDuplicates
        },
        phoneDuplicates: {
          count: phoneDuplicates.length,
          records: phoneDuplicates
        },
        internalEmailDuplicates: {
          count: internalEmailDuplicates.length,
          records: internalEmailDuplicates
        },
        internalPhoneDuplicates: {
          count: internalPhoneDuplicates.length,
          records: internalPhoneDuplicates
        },
        totalDuplicates: emailDuplicates.length + phoneDuplicates.length,
        cleanRecords: data.length - emailDuplicates.length - phoneDuplicates.length
      };

      setResult(scanResult);
      
      if (onScanComplete) {
        onScanComplete(scanResult);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  const exportDuplicates = () => {
    if (!result) return;

    const allDuplicates = [
      ...result.emailDuplicates.records.map(d => ({
        Type: 'Email Duplicate',
        Row: d.row,
        Name: d.name,
        Email: d.email,
        Phone: '',
        Matched_Existing: d.existingLead?.email || d.existingLead?.phone
      })),
      ...result.phoneDuplicates.records.map(d => ({
        Type: 'Phone Duplicate',
        Row: d.row,
        Name: d.name,
        Email: '',
        Phone: d.phone,
        Matched_Existing: d.existingLead?.email || d.existingLead?.phone
      }))
    ];

    const headers = ['Type', 'Row', 'Name', 'Email', 'Phone', 'Matched_Existing'];
    const csv = [
      headers.join(','),
      ...allDuplicates.map(row => 
        headers.map(h => `"${row[h] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duplicates-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Duplicate Scanner</h3>
        <p className="text-sm text-slate-500">Upload a file to scan for duplicate emails and phone numbers before importing</p>
      </div>

      {!result ? (
        <div className="space-y-4">
          {/* File upload */}
          <div 
            className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
            onClick={() => document.getElementById('scannerFileInput').click()}
          >
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">
              {file ? file.name : 'Click or drag to upload CSV/JSON'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Supports: CSV, JSON</p>
            <input
              id="scannerFileInput"
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

          {/* Scan button */}
          <button
            onClick={scanForDuplicates}
            disabled={!file || scanning}
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition flex items-center justify-center gap-2"
          >
            {scanning ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Scanning for Duplicates...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Scan for Duplicates
              </>
            )}
          </button>
        </div>
      ) : (
        /* Results */
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-600 font-semibold">Total Records</p>
              <p className="text-2xl font-black text-blue-700">{result.totalRecords}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-xs text-green-600 font-semibold">Clean Records</p>
              <p className="text-2xl font-black text-green-700">{result.cleanRecords}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <p className="text-xs text-yellow-600 font-semibold">Email Duplicates</p>
              <p className="text-2xl font-black text-yellow-700">{result.emailDuplicates.count}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
              <p className="text-xs text-orange-600 font-semibold">Phone Duplicates</p>
              <p className="text-2xl font-black text-orange-700">{result.phoneDuplicates.count}</p>
            </div>
          </div>

          {/* Internal Duplicates Warning */}
          {(result.internalEmailDuplicates.count > 0 || result.internalPhoneDuplicates.count > 0) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-900">Internal Duplicates Detected</h4>
                  <p className="text-sm text-red-700">These records appear multiple times within your upload</p>
                </div>
              </div>
              
              {result.internalEmailDuplicates.count > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-red-700 mb-2">Duplicate Emails ({result.internalEmailDuplicates.count}):</p>
                  <div className="max-h-32 overflow-y-auto bg-white border border-red-100 rounded p-2 space-y-1">
                    {result.internalEmailDuplicates.records.slice(0, 5).map((dup, i) => (
                      <p key={i} className="text-xs text-red-600">
                        • Row {dup.row}: {dup.email} (first seen at row {dup.firstOccurrence})
                      </p>
                    ))}
                    {result.internalEmailDuplicates.records.length > 5 && (
                      <p className="text-xs text-red-600">+ {result.internalEmailDuplicates.records.length - 5} more</p>
                    )}
                  </div>
                </div>
              )}

              {result.internalPhoneDuplicates.count > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-700 mb-2">Duplicate Phones ({result.internalPhoneDuplicates.count}):</p>
                  <div className="max-h-32 overflow-y-auto bg-white border border-red-100 rounded p-2 space-y-1">
                    {result.internalPhoneDuplicates.records.slice(0, 5).map((dup, i) => (
                      <p key={i} className="text-xs text-red-600">
                        • Row {dup.row}: {dup.phone} (first seen at row {dup.firstOccurrence})
                      </p>
                    ))}
                    {result.internalPhoneDuplicates.records.length > 5 && (
                      <p className="text-xs text-red-600">+ {result.internalPhoneDuplicates.records.length - 5} more</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Email Duplicates List */}
          {result.emailDuplicates.count > 0 && (
            <div className="border border-slate-200 rounded-lg">
              <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <h4 className="font-bold text-yellow-900">Email Duplicates ({result.emailDuplicates.count})</h4>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto p-4">
                <table className="w-full text-xs">
                  <thead className="text-slate-500 font-semibold border-b">
                    <tr>
                      <th className="text-left py-2">Row</th>
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Matched Existing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.emailDuplicates.records.slice(0, 10).map((dup, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 text-slate-600">{dup.row}</td>
                        <td className="py-2 text-slate-700">{dup.name || '—'}</td>
                        <td className="py-2 text-blue-600 font-medium">{dup.email}</td>
                        <td className="py-2 text-slate-500">{dup.existingLead?.email || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.emailDuplicates.records.length > 10 && (
                  <p className="text-xs text-slate-500 text-center py-2">
                    + {result.emailDuplicates.records.length - 10} more duplicates
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Phone Duplicates List */}
          {result.phoneDuplicates.count > 0 && (
            <div className="border border-slate-200 rounded-lg">
              <div className="bg-orange-50 border-b border-orange-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <h4 className="font-bold text-orange-900">Phone Duplicates ({result.phoneDuplicates.count})</h4>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto p-4">
                <table className="w-full text-xs">
                  <thead className="text-slate-500 font-semibold border-b">
                    <tr>
                      <th className="text-left py-2">Row</th>
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Phone</th>
                      <th className="text-left py-2">Matched Existing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.phoneDuplicates.records.slice(0, 10).map((dup, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 text-slate-600">{dup.row}</td>
                        <td className="py-2 text-slate-700">{dup.name || '—'}</td>
                        <td className="py-2 text-orange-600 font-medium">{dup.phone}</td>
                        <td className="py-2 text-slate-500">{dup.existingLead?.phone || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.phoneDuplicates.records.length > 10 && (
                  <p className="text-xs text-slate-500 text-center py-2">
                    + {result.phoneDuplicates.records.length - 10} more duplicates
                  </p>
                )}
              </div>
            </div>
          )}

          {/* No duplicates found */}
          {result.totalDuplicates === 0 && result.internalEmailDuplicates.count === 0 && result.internalPhoneDuplicates.count === 0 && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">No Duplicates Found!</p>
                <p className="text-sm text-green-700">All {result.totalRecords} records are unique</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={exportDuplicates}
              disabled={result.totalDuplicates === 0}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 transition"
            >
              <Download className="h-4 w-4" />
              Export Duplicates
            </button>
            <button
              onClick={() => {
                setResult(null);
                setFile(null);
              }}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Scan Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}