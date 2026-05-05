import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Phone, Trash2, Loader2, CheckCircle, AlertCircle, Send } from "lucide-react";

export default function AdminSMSSettings() {
  const [partners, setPartners] = useState([]);
  const [adminPhone, setAdminPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testSMS, setTestSMS] = useState(false);
  const [testResult, setTestResult] = useState(null); // null | "success" | "error"
  const [testError, setTestError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const approved = await base44.entities.PartnerApplication.filter({ status: "approved" }, "-created_date", 100);
    setPartners(approved);
    
    // Get admin phone from local storage
    const stored = localStorage.getItem("admin_sms_phone") || "";
    setAdminPhone(stored);
    setLoading(false);
  };

  const handleSaveAdminPhone = async () => {
    setSaving(true);
    localStorage.setItem("admin_sms_phone", adminPhone);
    setSaving(false);
  };

  const handleRemovePartnerSMS = async (partnerId) => {
    setSaving(true);
    await base44.entities.PartnerApplication.update(partnerId, { phone: "" });
    fetchData();
    setSaving(false);
  };

  const handleTestSMS = async () => {
    setTestSMS(true);
    setTestResult(null);
    setTestError("");
    try {
      // No phone arg — sendSMS will fall back to BENNETT_PHONE secret
      const res = await base44.functions.invoke("sendSMS", {
        message: `🧪 BuyWiser SMS test — ${new Date().toLocaleTimeString("en-US")}. If you see this, Twilio is connected!`,
      });
      if (res.data?.sid) {
        setTestResult("success");
      } else {
        setTestResult("error");
        setTestError(res.data?.error || "No SID returned");
      }
    } catch (err) {
      setTestResult("error");
      setTestError(err?.response?.data?.error || err.message || "Unknown error");
    }
    setTestSMS(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Manual SMS Test */}
      <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Send className="h-5 w-5 text-slate-600" />
              <h3 className="text-base font-bold text-slate-900">Manual SMS Connection Test</h3>
            </div>
            <p className="text-xs text-slate-500">Sends a test SMS directly to your <strong>BENNETT_PHONE</strong> number to verify Twilio is working.</p>
          </div>
          <button
            onClick={handleTestSMS}
            disabled={testSMS}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-white bg-blue-700 hover:bg-blue-800 transition disabled:opacity-50 flex-shrink-0"
          >
            {testSMS ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {testSMS ? "Sending…" : "Send Test SMS Now"}
          </button>
        </div>

        {testResult === "success" && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-semibold">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            ✅ SMS sent successfully! Check your phone. If it doesn't arrive within 30 seconds, verify your number is confirmed in Twilio console.
          </div>
        )}
        {testResult === "error" && (
          <div className="mt-4 flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">SMS failed to send</p>
              {testError && <p className="text-xs mt-0.5 text-red-600">{testError}</p>}
              <p className="text-xs mt-1 text-red-500">Check that TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER secrets are correct.</p>
            </div>
          </div>
        )}
      </div>

      {/* Admin Phone */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="h-5 w-5 text-slate-600" />
          <h3 className="text-base font-bold text-slate-900">Your Admin Phone Number</h3>
        </div>
        <p className="text-xs text-slate-500 mb-3">Receive SMS notifications for all emails sent out (leads, opportunities, etc.)</p>
        <div className="flex gap-2">
          <input
            type="tel"
            value={adminPhone}
            onChange={(e) => setAdminPhone(e.target.value)}
            placeholder="+1 (818) 300-2642"
            className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSaveAdminPhone}
            disabled={saving}
            className="px-4 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={handleTestSMS}
            disabled={!adminPhone || testSMS}
            className="px-4 py-2.5 text-sm font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
          >
            {testSMS ? <Loader2 className="h-4 w-4 animate-spin inline mr-1" /> : "Test"}
          </button>
        </div>
      </div>

      {/* Partner SMS List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-base font-bold text-slate-900 mb-1">Partner SMS Recipients</h3>
        <p className="text-xs text-slate-500 mb-4">Partners with phone numbers will receive SMS notifications for new opportunities</p>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          </div>
        ) : partners.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No approved partners yet</p>
        ) : (
          <div className="space-y-2">
            {partners.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                  {p.phone ? (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-green-600" /> SMS enabled: {p.phone}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="h-3 w-3 text-amber-500" /> No phone number on file
                    </p>
                  )}
                </div>
                {p.phone && (
                  <button
                    onClick={() => handleRemovePartnerSMS(p.id)}
                    disabled={saving}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700 leading-relaxed">
        <p className="font-bold mb-1">How it works:</p>
        <p>• New Leads: You receive SMS immediately. Partner assigned to lead also receives SMS if they have a phone number.</p>
        <p>• New Opportunities: You receive SMS. Partner assigned to opportunity receives SMS if they have a phone number.</p>
        <p>• To remove a partner from SMS: Click the trash icon next to their name (removes their phone from our system).</p>
        <p>• To reassign SMS to a different partner: Go to their profile and update their phone number.</p>
      </div>
    </div>
  );
}