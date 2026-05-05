import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Camera, MapPin, Phone, Mail, QrCode, Loader2 } from "lucide-react";
import LeadCheckIn from "./LeadCheckIn";
import VisitLogger from "./VisitLogger";

const NAVY = "#0B1F3B";
const RED = "#C62828";

export default function LeadDetailView({ lead, rep, visits, onBack, onRefresh }) {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showVisitLog, setShowVisitLog] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [generatingQr, setGeneratingQr] = useState(false);

  const fullName = `${lead.first_name || ""} ${lead.last_name || ""}`.trim();
  const leadVisits = visits.filter((v) => v.lead_id === lead.id).sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));
  const lastVisit = leadVisits[0];

  const handleGenerateQR = async () => {
    setGeneratingQr(true);
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        `https://buywiser.com/b?rep=${rep.rep_code}&lead=${lead.id}`
      )}`;
      setQrCode(qrUrl);
    } catch (err) {
      alert("Failed to generate QR code");
    }
    setGeneratingQr(false);
  };

  if (showCheckIn) {
    return (
      <LeadCheckIn
        lead={lead}
        rep={rep}
        onBack={() => setShowCheckIn(false)}
        onComplete={() => {
          setShowCheckIn(false);
          onRefresh();
        }}
      />
    );
  }

  if (showVisitLog) {
    return (
      <VisitLogger
        lead={lead}
        rep={rep}
        onBack={() => setShowVisitLog(false)}
        onComplete={() => {
          setShowVisitLog(false);
          onRefresh();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Lead Details</p>
            <p className="text-sm font-bold text-slate-800 truncate">{fullName}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Address */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Property Address</p>
                <p className="text-sm font-semibold text-slate-900">{lead.property_address}</p>
                {lead.property_type && <p className="text-xs text-slate-500 mt-1">{lead.property_type}</p>}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg p-4 border border-slate-200 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</p>
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 transition"
              >
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{lead.phone}</span>
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 transition"
              >
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{lead.email}</span>
              </a>
            )}
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">QR Code</p>
            {qrCode ? (
              <div className="space-y-3">
                <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
                <div className="flex gap-2 flex-wrap justify-center">
                  <a
                    href={qrCode}
                    download="lead-qr.png"
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition"
                  >
                    Print
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleGenerateQR}
                disabled={generatingQr}
                className="w-full py-3 rounded-lg font-bold text-sm text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: generatingQr ? "#888" : NAVY }}
              >
                {generatingQr ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
                {generatingQr ? "Generating…" : "Generate QR Code"}
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowCheckIn(true)}
              className="py-3 rounded-lg font-bold text-sm text-white transition"
              style={{ background: NAVY }}
            >
              📍 Check In
            </button>
            <button
              onClick={() => setShowVisitLog(true)}
              className="py-3 rounded-lg font-bold text-sm text-white transition"
              style={{ background: RED }}
            >
              📝 Log Visit
            </button>
          </div>

          {/* Visit History */}
          {leadVisits.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Visit History</p>
              <div className="space-y-3">
                {leadVisits.map((v, i) => (
                  <div key={i} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <p className="text-xs font-bold text-slate-700 mb-1">
                      {new Date(v.visit_date).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-slate-600 font-semibold mb-1 capitalize">
                      {v.status.replace(/_/g, " ")}
                    </p>
                    {v.notes && <p className="text-xs text-slate-500">{v.notes}</p>}
                    {v.door_photo_url && (
                      <img src={v.door_photo_url} alt="Property" className="mt-2 rounded-lg h-32 w-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}