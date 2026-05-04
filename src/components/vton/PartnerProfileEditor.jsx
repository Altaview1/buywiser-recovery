import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Save, Upload, User, Phone, Mail, MapPin, Shield, Loader2, CheckCircle } from "lucide-react";

const NAVY = "#0B1F3B";

export default function PartnerProfileEditor({ partner, onSaved }) {
  const [form, setForm] = useState({
    name: partner.name || "",
    phone: partner.phone || "",
    title: partner.title || "",
    license_number: partner.license_number || "",
    photo_url: partner.photo_url || "",
    territory: partner.territory || "",
    calendar_url: partner.calendar_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, photo_url: file_url }));
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.PartnerApplication.update(partner.id, {
      name: form.name,
      phone: form.phone,
      title: form.title,
      license_number: form.license_number,
      photo_url: form.photo_url,
      calendar_url: form.calendar_url,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    onSaved({ ...partner, ...form });
  };

  const inputCls = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white transition";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 flex items-center gap-2" style={{ background: NAVY }}>
        <User className="h-4 w-4 text-white/60" />
        <p className="text-sm font-black text-white uppercase tracking-widest">My Agent Profile</p>
      </div>

      <div className="p-5">
        {/* Preview */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          {form.photo_url ? (
            <img src={form.photo_url} alt={form.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-2xl font-black text-slate-400">
              {form.name?.charAt(0) || "A"}
            </div>
          )}
          <div>
            <p className="font-black text-slate-900">{form.name || "Your Name"}</p>
            {form.title && <p className="text-xs text-slate-500">{form.title}</p>}
            {form.territory && <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="h-3 w-3" />{form.territory}</p>}
            {form.phone && <p className="text-xs text-blue-700 font-semibold">{form.phone}</p>}
            {partner.email && <p className="text-xs text-slate-500">{partner.email}</p>}
          </div>
          <div className="ml-auto text-xs text-slate-400 italic hidden sm:block">
            This is how your profile appears on homeowner benefit pages
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Photo upload */}
          <div>
            <label className={labelCls}>Profile Photo</label>
            <div className="flex items-center gap-3">
              {form.photo_url && (
                <img src={form.photo_url} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0" />
              )}
              <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading…" : "Upload Photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
              {form.photo_url && (
                <button type="button" onClick={() => setForm(f => ({ ...f, photo_url: "" }))}
                  className="text-xs text-red-500 hover:text-red-700 underline">Remove</button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Or paste a URL below</p>
            <input type="url" className={`${inputCls} mt-1`} placeholder="https://..."
              value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input required className={inputCls} placeholder="Jane Smith" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input type="tel" className={inputCls} placeholder="(818) 555-1234" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title / Designation</label>
              <input className={inputCls} placeholder="e.g. VTON Partner Agent" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>RE License Number</label>
              <input className={inputCls} placeholder="e.g. 01234567" value={form.license_number}
                onChange={e => setForm(f => ({ ...f, license_number: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Booking / Calendar Link</label>
            <input type="url" className={inputCls} placeholder="https://calendly.com/your-link"
              value={form.calendar_url} onChange={e => setForm(f => ({ ...f, calendar_url: e.target.value }))} />
            <p className="text-xs text-slate-400 mt-1">Paste your Calendly, Cal.com, or any booking URL — leads will see a "Book My Appointment" button on their benefit page.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500 flex items-start gap-2">
            <Shield className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
            <span>Your name, photo, phone, email, title, and license number will appear on personalized homeowner benefit pages when they scan your QR codes.</span>
          </div>

          <button type="submit" disabled={saving || uploading}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl text-white transition disabled:opacity-50"
            style={{ background: NAVY }}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : saved ? "Saved!" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}