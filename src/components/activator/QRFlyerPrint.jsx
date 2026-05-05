import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Printer, X } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

export default function QRFlyerPrint({ activator, onClose }) {
  const flyerRef = useRef(null);

  const qrUrl = `${window.location.origin}/vton-scan?rep=${activator.rep_code}`;

  const handlePrint = () => {
    const printContent = flyerRef.current.innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>VTON Field Activator QR Flyer — ${activator.rep_code}</title>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; background: white; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${printContent}
        <script>
          window.onload = function() { window.print(); window.close(); }
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-auto" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: NAVY }}>
          <p className="text-white font-black text-sm uppercase tracking-widest">Print QR Flyer</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white border border-white/30 hover:bg-white/10 transition"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Flyer Preview */}
        <div className="p-6 bg-slate-100 overflow-auto max-h-[70vh]">
          <div ref={flyerRef}>
            <div style={{
              width: "100%",
              maxWidth: "560px",
              margin: "0 auto",
              background: "#ffffff",
              border: "2px solid #0B1F3B",
              borderRadius: "16px",
              overflow: "hidden",
              fontFamily: "Arial, sans-serif",
            }}>
              {/* RWB Stripe */}
              <div style={{ display: "flex", height: "8px" }}>
                <div style={{ flex: 1, background: RED }} />
                <div style={{ flex: 1, background: "#ffffff", borderTop: "1px solid #e2e8f0" }} />
                <div style={{ flex: 1, background: NAVY }} />
              </div>

              {/* Header */}
              <div style={{ background: NAVY, padding: "24px 32px", textAlign: "center" }}>
                <p style={{ color: "#93c5fd", fontSize: "10px", fontWeight: 900, letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 6px" }}>
                  Veteran's Next Home™
                </p>
                <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 900, margin: "0 0 4px" }}>
                  Your VA Home Benefit
                </h1>
                <p style={{ color: "#93c5fd", fontSize: "13px", margin: 0 }}>
                  Up to 1.5% Cash Back on Your Next Purchase
                </p>
              </div>

              {/* Body */}
              <div style={{ padding: "28px 32px" }}>

                {/* Intro text */}
                <p style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6, textAlign: "center", margin: "0 0 20px" }}>
                  As a <strong>veteran homeowner with an active VA loan</strong>, you may qualify for the Red White &amp; Blue Purchase Benefit when you buy your next home.
                </p>

                {/* Benefit bullets */}
                <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "16px 20px", marginBottom: "24px" }}>
                  {[
                    "Up to 1.5% of your next purchase price — cash back at closing",
                    "Works with your existing VA loan eligibility",
                    "Free benefit review — no cost, no obligation",
                    "$50 donation to a veteran charity of your choice",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: i < 3 ? "10px" : 0 }}>
                      <span style={{ color: "#16a34a", fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>✓</span>
                      <p style={{ color: "#1e3a5f", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>{item}</p>
                    </div>
                  ))}
                </div>

                {/* QR Code */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <p style={{ color: "#374151", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 12px" }}>
                    Scan to Start Your Free Benefit Review
                  </p>
                  <div style={{ display: "inline-block", padding: "16px", border: "3px solid #0B1F3B", borderRadius: "12px", background: "#fff" }}>
                    <QRCodeSVG value={qrUrl} size={160} bgColor="#ffffff" fgColor="#0B1F3B" level="M" />
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ color: "#64748b", fontSize: "11px", margin: "0 0 4px" }}>Rep Code</p>
                    <p style={{ color: NAVY, fontSize: "24px", fontWeight: 900, letterSpacing: "6px", margin: 0 }}>{activator.rep_code}</p>
                  </div>
                </div>

                {/* Agent info */}
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px", textAlign: "center" }}>
                  <p style={{ color: "#64748b", fontSize: "11px", margin: "0 0 4px" }}>Presented by</p>
                  <p style={{ color: "#1e293b", fontSize: "15px", fontWeight: 700, margin: "0 0 2px" }}>{activator.name}</p>
                  {activator.assigned_area && (
                    <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 4px" }}>{activator.assigned_area}</p>
                  )}
                  {activator.phone && (
                    <p style={{ color: "#3b82f6", fontSize: "13px", margin: "0 0 2px" }}>{activator.phone}</p>
                  )}
                  {activator.email && (
                    <p style={{ color: "#3b82f6", fontSize: "12px", margin: 0 }}>{activator.email}</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "12px 24px", textAlign: "center" }}>
                <p style={{ color: "#94a3b8", fontSize: "10px", margin: 0, lineHeight: 1.5 }}>
                  Veteran's Next Home™ is a private program by BuyWiser. Not affiliated with the U.S. Dept. of Veterans Affairs.<br />
                  BuyWiser Technology, Inc. NMLS #1887767 · CA DRE #01107013
                </p>
              </div>

              {/* RWB Stripe bottom */}
              <div style={{ display: "flex", height: "8px" }}>
                <div style={{ flex: 1, background: NAVY }} />
                <div style={{ flex: 1, background: "#ffffff", borderTop: "1px solid #e2e8f0" }} />
                <div style={{ flex: 1, background: RED }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}