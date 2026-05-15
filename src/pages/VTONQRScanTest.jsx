import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, QrCode, ExternalLink } from 'lucide-react';

export default function VTONQRScanTest() {
  const [leadId, setLeadId] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState('');

  const handleGenerateQR = async () => {
    if (!leadId.trim()) {
      setError('Please enter a lead ID');
      return;
    }

    setLoading(true);
    setError('');
    setQrData(null);

    try {
      const result = await base44.functions.invoke('testVTONQRCode', {
        lead_id: leadId
      });
      
      if (result.data) {
        setQrData(result.data);
      } else {
        setError('Failed to generate QR code');
      }
    } catch (err) {
      setError(err.message || 'Error generating QR code');
      console.error('QR generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-6 w-6" />
              VTON QR Code Scanner Test
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">Generate a QR code for a lead to test the scan flow</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Lead ID Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lead ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                  placeholder="Paste a VTONLead ID here"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  disabled={loading}
                />
                <Button
                  onClick={handleGenerateQR}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate QR'
                  )}
                </Button>
              </div>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>

            {/* QR Code Display */}
            {qrData && (
              <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-900">
                  {qrData.lead_name}'s Personalized Page
                </h3>

                {/* QR Code */}
                {qrData.qr_code_url && (
                  <div className="flex justify-center bg-white p-4 rounded-lg border border-slate-300">
                    <img
                      src={qrData.qr_code_url}
                      alt="QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                )}

                {/* Live Link */}
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Or click to test the link:</p>
                  {qrData.personalized_url && (
                    <a
                      href={qrData.personalized_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Personalized Page
                    </a>
                  )}
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-blue-800">
                  <p className="font-semibold mb-1">Testing Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Use your phone to scan the QR code above, or click the button to open the link</li>
                    <li>The personalized landing page should load with {qrData.lead_name}'s property details</li>
                    <li>Check your email for a notification (bennett@buywiser.com)</li>
                    <li>The site_visits counter should increment in the dashboard</li>
                  </ol>
                </div>

                {/* Debug Info */}
                <div className="bg-slate-100 p-3 rounded text-xs font-mono text-slate-600 space-y-1">
                  <p><strong>Lead ID:</strong> {qrData.lead_id}</p>
                  <p><strong>Lead Name:</strong> {qrData.lead_name}</p>
                  <p><strong>Property:</strong> {qrData.property_address}</p>
                  <p><strong>Personalized URL:</strong> {qrData.personalized_url}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}