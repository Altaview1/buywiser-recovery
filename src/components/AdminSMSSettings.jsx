import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Phone, Trash2, Plus, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminSMSSettings() {
  const [partners, setPartners] = useState([]);
  const [adminPhone, setAdminPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testSMS, setTestSMS] = useState(false);

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
    if (!adminPhone) return;
    setTestSMS(true);
    try {
      await base44.functions.invoke("sendSMS", {
        message: "🧪 Test SMS from BuyWiser notification system — working!",
        phone: adminPhone
      });
    } catch (err) {
      console.error("Test SMS error:", err);
    }
    setTestSMS(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
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