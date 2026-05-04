import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Download, QrCode, ExternalLink } from "lucide-react";

const NAVY = "#0B1F3B";
const BASE_URL = window.location.origin;

export default function OpportunityQRGenerator({ opportunities, partner }) {
  const [selected, setSelected] = useState(null);

  const getUrl = (opp) => `${BASE_URL}/b?opp=${opp.id}`;

  const handlePrint = (opp) => {
    const url = getUrl(opp);
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>QR Code — ${opp.homeowner_name || opp.property_address}</title>
          <style>
            body { font-family: Georgia, serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 40px; box-sizing: border-box; }
            .container { text-align: center; border: 2px solid #e2e8f0; border-radius: 16px; padding: 40px; max-width: 400px; }
            .logo { height: 40px; margin-bottom: 16px; }
            .stripe { display: flex; height: 6px; margin: 12px 0; }
            .stripe-red { flex: 1; background: #C62828; }
            .stripe-white { flex: 1; background: #ffffff; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
            .stripe-navy { flex: 1; background: #0B1F3B; }
            h2 { color: #0B1F3B; font-size: 18px; margin: 12px 0 4px; }
            p { color: #64748b; font-size: 13px; margin: 4px 0; }
            .address { font-weight: bold; color: #1e293b; margin: 8px 0; }
            .agent { margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
            .agent strong { color: #1e293b; }
            .scan-text { color: #C62828; font-weight: bold; font-size: 14px; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" class="logo" alt="BuyWiser" />
            <div class="stripe"><div class="stripe-red"></div><div class="stripe-white"></div><div class="stripe-navy"></div></div>
            <div id="qr" style="display:flex;justify-content:center;margin:16px 0;"></div>
            <p class="scan-text">🇺🇸 Scan to See Your Veteran's Benefit 🇺🇸</p>
            ${opp.homeowner_name ? `<h2>${opp.homeowner_name}</h2>` : ""}
            <p class="address">${opp.property_address}${opp.city ? ", " + opp.city : ""}${opp.state ? ", " + opp.state : ""}</p>
            ${opp.estimated_price ? `<p>Estimated benefit: up to <strong>$${Math.round(opp.estimated_price * 0.015).toLocaleString()}</strong></p>` : ""}
            <div class="agent">
              Prepared by <strong>${partner?.name || "Your VTON Representative"}</strong><br/>
              ${partner?.phone ? partner.phone : ""}${partner?.phone && partner?.email ? " · " : ""}${partner?.email ? partner.email : ""}
            </div>
          </div>
          <script src="https://unpkg.com/qrcode/build/qrcode.min.js"></script>
          <script>
            QRCode.toCanvas(document.createElement('canvas'), '${url}', { width: 200 }, function(err, canvas) {
              if (!err) document.getElementById('qr').appendChild(canvas);
              setTimeout(() => window.print(), 800);
            });
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  if (!opportunities?.length) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        No opportunities to generate QR codes for.
      </div>
    );
  }

  return (
    <div>
      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: NAVY }}>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-widest">Personalized QR Code</p>
                <p className="text-blue-300 text-xs mt-0.5 truncate">{selected.homeowner_name || selected.property_address}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center gap-4">
              {/* Red White Blue stripe */}
              <div className="flex w-full" style={{ height: 4 }}>
                <div style={{ flex: 1, background: "#C62828" }} />
                <div style={{ flex: 1, background: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }} />
                <div style={{ flex: 1, background: NAVY }} />
              </div>
              <div className="p-3 bg-white border-2 border-slate-200 rounded-xl">
                <QRCodeSVG value={getUrl(selected)} size={190} bgColor="#ffffff" fgColor={NAVY} level="M" />
              </div>
              <div className="text-center w-full">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">Links directly to</p>
                <p className="text-sm font-bold text-slate-800">{selected.homeowner_name || "Veteran Homeowner"}</p>
                <p className="text-xs text-slate-500">{selected.property_address}{selected.city ? `, ${selected.city}` : ""}</p>
                {selected.estimated_price && (
                  <p className="text-xs text-green-700 font-bold mt-1">Benefit up to ${Math.round(selected.estimated_price * 0.015).toLocaleString()}</p>
                )}
              </div>
              <div className="w-full bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 text-center leading-relaxed">
                When scanned, shows <strong>{selected.homeowner_name || "the homeowner"}</strong>'s personalized benefit page with <strong>your</strong> agent card.
              </div>
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => handlePrint(selected)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl text-white transition"
                  style={{ background: NAVY }}
                >
                  <Download className="h-4 w-4" /> Print QR
                </button>
                <a
                  href={getUrl(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 px-4 py-2.5 text-sm font-bold rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                >
                  <ExternalLink className="h-4 w-4" /> Preview
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Opportunity list */}
      <div className="space-y-2">
        {opportunities.map((opp) => (
          <div key={opp.id} className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:bg-slate-50 transition">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{opp.homeowner_name || "Homeowner"}</p>
              <p className="text-xs text-slate-400 truncate">{opp.property_address}{opp.city ? `, ${opp.city}` : ""}</p>
              {opp.estimated_price && (
                <p className="text-xs text-green-700 font-semibold">Benefit ≈ ${Math.round(opp.estimated_price * 0.015).toLocaleString()}</p>
              )}
            </div>
            <button
              onClick={() => setSelected(opp)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg text-white transition flex-shrink-0"
              style={{ background: "#0B1F3B" }}
            >
              <QrCode className="h-3.5 w-3.5" /> QR Code
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}