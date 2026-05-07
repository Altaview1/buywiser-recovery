import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowRight, Phone, Mail, MapPin, Shield, CheckCircle, Calendar } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

function formatCurrency(val) {
  if (!val) return "$0";
  return Number(val).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function formatWritten(val) {
  const n = Math.round(val);
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)} Million Dollars`;
  if (n >= 1000) return `${Math.floor(n / 1000)},${String(n % 1000).padStart(3, "0")} Dollars`;
  return `${n} Dollars`;
}

function RWBStripe() {
  return (
    <div className="flex" style={{ height: 5 }}>
      <div style={{ flex: 1, background: RED }} />
      <div style={{ flex: 1, background: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }} />
      <div style={{ flex: 1, background: NAVY }} />
    </div>
  );
}

function PersonalizedCheck({ homeownerName, address, price }) {
  const [sliderPrice, setSliderPrice] = useState(price || 700000);
  const benefit = sliderPrice * 0.015;
  const payee = homeownerName || "The Veteran Homebuyer";

  return (
    <div>
      <div className="mb-3 text-center">
        <p className="text-sm font-bold text-slate-700">Estimated next home purchase price</p>
        <p className="text-lg font-black text-slate-900 mt-0.5">{formatCurrency(sliderPrice)}</p>
      </div>
      <div className="flex items-center gap-3 mb-5 px-1">
        <span className="text-xs font-semibold text-slate-400 w-12 text-right">$100K</span>
        <input
          type="range" min={100000} max={2000000} step={25000}
          value={sliderPrice}
          onChange={(e) => setSliderPrice(Number(e.target.value))}
          className="flex-1"
          style={{ accentColor: "#16a34a" }}
        />
        <span className="text-xs font-semibold text-slate-400 w-8">$2M</span>
      </div>

      {/* The Check */}
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{
        background: "#f7f2e4",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(100,120,80,0.07) 28px, rgba(100,120,80,0.07) 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(100,120,80,0.04) 28px, rgba(100,120,80,0.04) 29px)",
        fontFamily: "'Georgia', serif",
        border: "1px solid #c9bfa0",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)"
      }}>
        {/* Header band */}
        <div className="flex items-center justify-between px-5 py-2.5" style={{ background: NAVY, borderBottom: "3px solid #C62828" }}>
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-6 w-auto brightness-0 invert opacity-90" />
          <div className="text-right">
            <div className="text-white/40 text-[9px] uppercase tracking-widest">Check No.</div>
            <div className="text-white text-sm font-bold tracking-widest">0001</div>
          </div>
        </div>

        <div className="px-6 pt-4 pb-3">
          {/* Date row */}
          <div className="flex justify-end mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</span>
              <div className="border-b border-slate-400 pb-0.5 min-w-[120px] text-center">
                <span className="text-xs font-semibold text-slate-600">Upon Closing</span>
              </div>
            </div>
          </div>

          {/* Pay to line */}
          <div className="flex items-end gap-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap pb-1">Pay to the<br/>Order of</span>
            <div className="flex-1 relative">
              <div className="border-b-2 border-slate-500 pb-1 min-h-[28px] flex items-end">
                <span className={`text-lg leading-tight ${homeownerName ? "font-bold text-slate-900" : "italic text-slate-400"}`} style={{ fontFamily: "Georgia, serif" }}>
                  {payee}
                </span>
              </div>
            </div>
            {/* Amount box */}
            <div className="flex-shrink-0 ml-2" style={{
              border: "2px solid #1a3a6b",
              borderRadius: "4px",
              background: "linear-gradient(135deg, #eef6ff 0%, #dbeafe 100%)",
              minWidth: "140px",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(255,255,255,0.8)"
            }}>
              <div className="px-1 pt-0.5 text-center" style={{ borderBottom: "1px solid #93c5fd" }}>
                <span className="text-[8px] font-bold uppercase tracking-widest text-blue-400">$ Amount</span>
              </div>
              <div className="px-3 py-2 text-center">
                <span className="text-2xl font-black tabular-nums" style={{ color: "#15803d", fontFamily: "Georgia, serif", textShadow: "0 1px 0 rgba(255,255,255,0.8)" }}>
                  {formatCurrency(benefit)}
                </span>
              </div>
            </div>
          </div>

          {/* Written amount line */}
          <div className="flex items-end gap-2 mb-3">
            <div className="flex-1 border-b border-slate-400 pb-1">
              <span className="text-xs text-slate-500 italic">{formatWritten(benefit)}&nbsp;&nbsp;and&nbsp;&nbsp;00/100&nbsp;–––––––––––––––––––</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap pb-1 ml-2">Dollars</span>
          </div>

          {/* Memo + Signature row */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Memo</div>
              <div className="border-b border-slate-400 pb-1">
                <span className="text-xs text-slate-600">Qualifying Property: {address || `${formatCurrency(sliderPrice)} home`}</span>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Authorized Signature</div>
              <div className="border-b border-slate-400 min-w-[130px] pb-1">
                <span className="text-sm text-slate-400 italic" style={{ fontFamily: "cursive, Georgia, serif" }}>BuyWiser Home Loans</span>
              </div>
            </div>
          </div>

          {/* MICR strip */}
          <div className="flex items-center justify-between pt-2.5" style={{ borderTop: "1px dashed #c9bfa0" }}>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-300 font-mono tracking-widest">⑆ 1221 05045 ⑆</span>
              <span className="text-[11px] text-slate-300 font-mono tracking-widest">0001887767 ⑈</span>
              <span className="text-[11px] text-slate-300 font-mono">0001</span>
            </div>
            <div className="text-[9px] text-slate-300 font-mono">MP · CRMLA · NMLS 1887767</div>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 text-center mt-3">Estimate only. Final benefit depends on transaction structure and qualifying details.</p>
    </div>
  );
}

function AgentCard({ agent }) {
  if (!agent) return null;
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-3 flex items-center gap-2" style={{ background: NAVY }}>
        <Shield className="h-4 w-4 text-white/60" />
        <p className="text-xs font-black uppercase tracking-widest text-white/80">Your VTON Benefit Representative</p>
      </div>
      <div className="p-5 flex items-center gap-4">
        {agent.photo_url ? (
          <img
            src={agent.photo_url}
            alt={agent.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-2xl font-black text-slate-400">
            {agent.name?.charAt(0) || "A"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-base font-black text-slate-900">{agent.name}</p>
          {agent.title && <p className="text-xs text-slate-500 mb-1">{agent.title}</p>}
          {agent.territory && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
              <MapPin className="h-3 w-3" /> {agent.territory}
            </p>
          )}
          <div className="space-y-1">
            {agent.phone && (
              <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition">
                <Phone className="h-3.5 w-3.5" /> {agent.phone}
              </a>
            )}
            {agent.email && (
              <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition truncate">
                <Mail className="h-3.5 w-3.5" /> {agent.email}
              </a>
            )}
          </div>
        </div>
      </div>
      {agent.license_number && (
        <div className="px-5 pb-3">
          <p className="text-xs text-slate-400">License #: {agent.license_number}</p>
        </div>
      )}
    </div>
  );
}

export default function PersonalizedBenefit() {
  const [opp, setOpp] = useState(null);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [ctaSubmitted, setCtaSubmitted] = useState(false);
  const [ctaEmail, setCtaEmail] = useState("");
  const [ctaPhone, setCtaPhone] = useState("");
  const [ctaLoading, setCtaLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oppId = params.get("opp");
    if (!oppId) { setNotFound(true); setLoading(false); return; }

    const load = async () => {
      const opps = await base44.entities.VTONOpportunity.filter({ id: oppId });
      if (!opps.length) { setNotFound(true); setLoading(false); return; }
      const o = opps[0];
      setOpp(o);

      // Mark QR as scanned
      if (!o.qr_scanned) {
        base44.entities.VTONOpportunity.update(o.id, { qr_scanned: true });
      }

      // Load agent profile
      if (o.partner_email) {
        const agents = await base44.entities.PartnerApplication.filter({ email: o.partner_email, status: "approved" });
        if (agents.length) setAgent(agents[0]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleCTASubmit = async (e) => {
    e.preventDefault();
    setCtaLoading(true);
    try {
      // Create contact submission for CRM tracking
      await base44.entities.ContactSubmission.create({
        first_name: opp?.homeowner_name || "Veteran",
        email: ctaEmail,
        phone: ctaPhone,
        form_type: "contact",
        status: "new",
        how_heard: "vton_qr",
        comments: `Scanned QR from opportunity ${opp?.id}. Property: ${opp?.property_address}. Agent: ${agent?.name || opp?.partner_email}`,
      });

      // If the homeowner is ready to schedule, trigger consultation booking
      if (opp?.id) {
        // Find the corresponding lead if one exists
        const leads = await base44.entities.ActivatorLead.filter({ 
          email: ctaEmail,
          property_address: opp.property_address 
        }, "-created_date", 1);

        if (leads.length > 0) {
          // Schedule consultation for the lead
          await base44.functions.invoke("scheduleHomeownerConsultation", { 
            lead_id: leads[0].id 
          });
        }
      }
    } catch (err) {
      console.error("CTA submission error:", err);
    }
    setCtaLoading(false);
    setCtaSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: NAVY }}>
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: NAVY }}>
        <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto mb-6 opacity-60" />
        <p className="text-white font-bold text-lg mb-2">Benefit Package Not Found</p>
        <p className="text-blue-300 text-sm">Please contact your Buywiser representative for a valid link.</p>
        <a href="tel:+18183002642" className="mt-6 text-sm font-bold text-white underline">(818) 300-2642</a>
      </div>
    );
  }

  const price = opp?.estimated_price || 700000;
  const homeownerName = opp?.homeowner_name || null;
  const address = opp?.property_address ? `${opp.property_address}${opp.city ? ", " + opp.city : ""}${opp.state ? ", " + opp.state : ""}` : null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <header className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-40 shadow-sm">
        <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto opacity-70" />
        {agent ? (
          <div className="flex items-center gap-3">
            {agent.photo_url ? (
              <img src={agent.photo_url} alt={agent.name} className="w-9 h-9 rounded-full object-cover border-2 border-slate-200 flex-shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-black text-slate-500 flex-shrink-0">
                {agent.name?.charAt(0) || "A"}
              </div>
            )}
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-800 leading-tight">{agent.name}</p>
              {agent.title && <p className="text-xs text-slate-400 leading-tight">{agent.title}</p>}
            </div>
            {agent.phone && (
              <a href={`tel:${agent.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition flex-shrink-0"
                style={{ background: "#0B1F3B" }}>
                <Phone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{agent.phone}</span>
                <span className="sm:hidden">Call</span>
              </a>
            )}
          </div>
        ) : loading ? null : (
          <a href="tel:+18183002642" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition">(818) 300-2642</a>
        )}
      </header>

      <RWBStripe />

      {/* Hero — personalized */}
      <section style={{ background: NAVY }} className="px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-white/20 bg-white/10">
            <span className="text-xs font-black uppercase tracking-widest text-white/80">Veteran's Next Home™ by Buywiser</span>
          </div>
          {homeownerName ? (
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              {homeownerName},<br />
              <span style={{ color: "#ef9a9a" }}>Your Buywiser 1.5 GAP Benefit™ is Ready.</span>
            </h1>
          ) : (
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Your Buywiser 1.5 GAP Benefit™ —{" "}
              <span style={{ color: "#ef9a9a" }}>Up to 1.5% at Closing.</span>
            </h1>
          )}
          {address && (
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 mb-4">
              <MapPin className="h-4 w-4 text-white/60 flex-shrink-0" />
              <p className="text-sm text-blue-100 font-medium">{address}</p>
            </div>
          )}
          <p className="text-blue-200 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6">
            As a veteran homeowner with an active VA loan, you may qualify for up to <strong className="text-white">1.5% cash back</strong> on your next home purchase — coordinated through Buywiser.
          </p>
          <button
            onClick={() => document.querySelector('[style*="C62828"]')?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition hover:opacity-90"
            style={{ background: RED, color: "#fff" }}>
            Ready to Claim Your Benefit <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <RWBStripe />

      {/* Agent Card */}
      {agent && (
        <section className="px-4 py-8 bg-white">
          <div className="max-w-lg mx-auto">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center mb-4">Prepared Exclusively For You By</p>
            <AgentCard agent={agent} />
          </div>
        </section>
      )}

      {/* Personalized Check Estimator */}
      <section className="px-4 py-10 bg-slate-100">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">🇺🇸</span>
              <span className="text-xl">⭐</span>
              <span className="text-xl">🇺🇸</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wide leading-tight" style={{ color: NAVY }}>
              Estimate Your
            </h2>
            <h2 className="text-2xl font-black tracking-wide leading-tight" style={{ color: NAVY }}>
              Buywiser 1.5 GAP Benefit™
            </h2>
            <div className="mt-2 h-1 w-32 mx-auto rounded-full" style={{ background: `linear-gradient(to right, ${RED}, #ffffff, ${NAVY})` }} />
          </div>
          <PersonalizedCheck homeownerName={homeownerName} address={address} price={price} />
        </div>
      </section>

      {/* Book Appointment CTA — appears right after check */}
      {(agent?.calendar_url || agent?.phone) && (
        <section className="px-4 py-8 bg-white">
          <div className="max-w-lg mx-auto">
            <div className="rounded-2xl overflow-hidden border-2 shadow-sm" style={{ borderColor: NAVY }}>
              <div className="px-5 py-4 flex items-center gap-3" style={{ background: NAVY }}>
                <Calendar className="h-5 w-5 text-white/70 flex-shrink-0" />
                <div>
                  <p className="text-white font-black text-sm uppercase tracking-widest">Ready to Claim Your Benefit?</p>
                  <p className="text-blue-300 text-xs mt-0.5">Schedule your free 15-minute consultation</p>
                </div>
              </div>
              <div className="px-5 py-5 bg-white space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  See your personalized benefit estimate above? {agent?.name || 'Your BuyWiser specialist'} will walk you through your exact benefit and next steps.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {agent?.calendar_url && (
                    <a
                      href={agent.calendar_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white transition hover:opacity-90"
                      style={{ background: RED }}
                    >
                      <Calendar className="h-4 w-4" /> Book Now
                    </a>
                  )}
                  {agent?.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border-2 transition"
                      style={{ borderColor: RED, color: RED }}
                    >
                      ☎️ Call {agent.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Qualification checklist */}
      <section className="px-4 py-10 bg-white">
        <div className="max-w-lg mx-auto">
          <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Why You Were Selected</p>
          <div className="space-y-2.5">
            {[
              "You have (or had within the last 7 years) a VA loan on the home you're selling",
              "You or a spouse/significant other served in the U.S. military (any branch)",
              "You plan to purchase another home",
              "Your next purchase will be in a qualifying market",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5">
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                <p className="text-sm text-slate-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12" style={{ background: NAVY }}>
        <div className="max-w-lg mx-auto">
          {ctaSubmitted ? (
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-white font-black text-lg mb-1">You're Connected!</p>
              <p className="text-blue-200 text-sm">
                {agent?.name || "Your Buywiser representative"} will be in touch shortly to walk you through your benefit.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-white font-black text-lg mb-1">Ready to Claim Your Benefit?</p>
                <p className="text-blue-200 text-sm">
                  {agent ? `Connect with ${agent.name} today — no cost, no obligation.` : "Start your Veteran's Next Home™ Benefit Review — no cost, no obligation."}
                </p>
              </div>
              <form onSubmit={handleCTASubmit} className="space-y-3">
                <input
                  type="email" required value={ctaEmail} onChange={e => setCtaEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 text-sm border-2 border-white/20 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition"
                />
                <input
                  type="tel" required value={ctaPhone} onChange={e => setCtaPhone(e.target.value)}
                  placeholder="Your phone number"
                  className="w-full px-4 py-3 text-sm border-2 border-white/20 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition"
                />
                <button type="submit" disabled={ctaLoading}
                  className="w-full py-4 font-bold text-base rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
                  style={{ background: RED, color: "#fff" }}>
                  {ctaLoading ? "Submitting..." : <>Connect With My Representative <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>
              {agent?.phone && (
                <p className="text-center text-blue-300 text-sm mt-4">
                  Or call directly: <a href={`tel:${agent.phone}`} className="text-white font-bold underline">{agent.phone}</a>
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-slate-100 bg-white">
        <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto mx-auto mb-3 opacity-40" />
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Veteran's Next Home™ and the Buywiser 1.5 GAP Benefit™ are private programs offered through Buywiser. Not affiliated with or endorsed by the U.S. Department of Veterans Affairs.{" "}
          <a href="/Disclosures" className="underline hover:text-slate-600">Licensing &amp; Disclosures</a>
        </p>
        <p className="text-xs text-slate-300 mt-2">BuyWiser Technology, Inc. NMLS #1887767 · CA DRE #01107013</p>
      </footer>
    </div>
  );
}