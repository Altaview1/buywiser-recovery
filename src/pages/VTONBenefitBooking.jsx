import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, CheckCircle2, Award, Phone, Shield, Clock } from "lucide-react";
import SMSConsentCheckbox, { FormFooter } from "../components/vton/SMSConsentCheckbox";
import VTONPublicOptIn from "../components/vton/VTONPublicOptIn";

const NAVY = "#0B1F3B";
const RED = "#C62828";

export default function VTONBenefitBooking() {
  const urlParams = new URLSearchParams(window.location.search);
  const leadId = urlParams.get("lead");
  
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!leadId) {
      setLoading(false);
      return;
    }
    const trackVisit = async () => {
      base44.functions.invoke("vtonEngagementTracker", {
        lead_id: leadId,
        event_type: "visit"
      }).catch(err => console.error("Engagement tracking failed:", err));

      const leads = await base44.entities.VTONLead.filter({ id: leadId });
      if (leads.length) {
        setLead(leads[0]);
      }
      setLoading(false);
    };
    trackVisit();
  }, [leadId]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!appointmentDate || !appointmentTime) return;
    if (!smsConsent) {
      setConsentError("You must agree to receive SMS communications to confirm your appointment.");
      return;
    }
    setConsentError("");

    setSubmitting(true);
    try {
      const appointmentDateTime = `${appointmentDate}T${appointmentTime}:00`;
      
      await base44.entities.VTONLead.update(leadId, {
        appointment_booked: true,
        appointment_date: appointmentDateTime,
        campaign_stage: "booked"
      });

      // Send confirmation email
      base44.integrations.Core.SendEmail({
        to: lead.email,
        from_name: "Veteran Transition Opportunity Network",
        subject: `Your Benefit Review Is Confirmed - ${lead.property_address}`,
        body: `Hi ${lead.first_name},

Your Veteran Transition Benefit Review is confirmed!

APPOINTMENT DETAILS:
Date: ${new Date(appointmentDateTime).toLocaleDateString()}
Time: ${appointmentTime}
Duration: 15 minutes

WHAT TO EXPECT:
• Review of your veteran transition situation
• Personalized benefit estimate
• Next home purchase strategy overview
• No pressure, no obligation

Your estimated buyer benefit: $${(lead.estimated_benefit || 0).toLocaleString()}

A specialist will call you at ${lead.phone} on the scheduled date.

Questions? Reply to this email or call us.

Regards,
The Veteran Transition Opportunity Network`
      }).catch(err => console.error("Confirmation email failed:", err));

      setStep(3);
    } catch (err) {
      console.error("Booking failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: NAVY }}>
        <div className="text-white text-center">Loading your benefit information...</div>
      </div>
    );
  }

  if (!lead) {
    return <VTONPublicOptIn />;
  }

  // STEP 1: Benefit Overview
  if (step === 1) {
    return (
      <div className="min-h-screen" style={{ background: NAVY }}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/10 border border-white/20">
              <span className="text-xs font-black uppercase tracking-widest text-blue-200">Veteran Transition Opportunity Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Your Benefit Review</h1>
            <p className="text-blue-300 text-lg">{lead.property_address}</p>
          </div>

          {/* Benefit Highlight */}
          <div className="bg-white rounded-2xl p-8 mb-8 text-center">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-2">Your Estimated Buyer Benefit</p>
            <p className="text-5xl font-black text-green-600 mb-2">${(lead.estimated_benefit || 0).toLocaleString()}</p>
            <p className="text-slate-600 text-sm">Applied as a credit at closing on your next home purchase</p>
          </div>

          {/* Why This Matters */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 text-white space-y-4">
            <div className="flex gap-3">
              <Award className="h-5 w-5 flex-shrink-0 text-blue-300 mt-1" />
              <div>
                <p className="font-bold mb-1">You Served</p>
                <p className="text-sm text-blue-200">As a veteran selling a VA-financed home, you qualify for substantial next-home benefits.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="h-5 w-5 flex-shrink-0 text-blue-300 mt-1" />
              <div>
                <p className="font-bold mb-1">Timing Matters</p>
                <p className="text-sm text-blue-200">Your current home sale creates a qualification window. These benefits are available now.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Shield className="h-5 w-5 flex-shrink-0 text-blue-300 mt-1" />
              <div>
                <p className="font-bold mb-1">No Obligation</p>
                <p className="text-sm text-blue-200">A 15-minute review. Learn exactly how much you qualify for. Make your own decision.</p>
              </div>
            </div>
          </div>

          {/* What Happens in the Review */}
          <div className="bg-white rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">What Happens In Your 15-Minute Review</h2>
            <div className="space-y-3">
              {[
                { n: "1", title: "Confirm Your Transition Timeline", desc: "Understand when you're ready to purchase your next home" },
                { n: "2", title: "Review Your Estimated Benefit", desc: "See exactly how much you could receive" },
                { n: "3", title: "Explore Your Next-Home Options", desc: "Understand how Veteran Transition benefits apply to your situation" },
                { n: "4", title: "No Pressure Decision Time", desc: "You decide what's next. We answer your questions." }
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {n}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="text-sm text-slate-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => setStep(2)}
            className="w-full py-4 rounded-2xl font-bold text-lg text-white transition hover:opacity-90"
            style={{ background: RED }}
          >
            Schedule Your Benefit Review <Calendar className="h-5 w-5 inline ml-2" />
          </button>

          <p className="text-center text-blue-300 text-xs mt-4">
            15 minutes · Free · No obligation
          </p>
        </div>
      </div>
    );
  }

  // STEP 2: Appointment Booking
  if (step === 2) {
    return (
      <div className="min-h-screen" style={{ background: NAVY }}>
        <div className="max-w-md mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-white mb-2">Schedule Your Review</h1>
          <p className="text-blue-300 mb-8">Choose a time that works for you</p>

          <form onSubmit={handleBookAppointment} className="bg-white rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Time</label>
              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">Select a time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-2">
              <p className="text-sm text-blue-800">
                We'll call you at <strong>{lead.phone}</strong> on your scheduled date and time.
              </p>
            </div>

            <SMSConsentCheckbox
              checked={smsConsent}
              onChange={setSmsConsent}
              error={consentError}
            />

            <button
              type="submit"
              disabled={submitting || !appointmentDate || !appointmentTime}
              className="w-full py-3 rounded-xl font-bold text-white transition disabled:opacity-50"
              style={{ background: submitting ? "#666" : RED }}
            >
              {submitting ? "Confirming..." : "Confirm Appointment"}
            </button>

            <FormFooter />

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 text-slate-600 hover:text-slate-800 transition"
            >
              ← Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  // STEP 3: Confirmation
  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: NAVY }}>
        <div className="text-center text-white max-w-md">
          <div className="mb-6 text-6xl">🎖️</div>
          <h1 className="text-3xl font-bold mb-3">Your Review Is Confirmed</h1>
          <p className="text-blue-300 text-lg mb-6">
            One of our veteran transition specialists will call you at <strong>{lead.phone}</strong> on {appointmentDate} at {appointmentTime}.
          </p>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 text-left">
            <p className="text-sm text-blue-300 mb-3">Your benefit details:</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-300">Property:</span>
                <span className="font-semibold">{lead.property_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-300">Estimated Benefit:</span>
                <span className="font-semibold text-green-400">${(lead.estimated_benefit || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="text-blue-400 text-sm mb-3">
            A confirmation email has been sent to {lead.email}
          </p>
          <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 mb-6 text-left">
            <p className="text-blue-200 text-xs leading-relaxed">
              Thank you. Your request has been received. A VTON™ representative may contact you regarding your Veteran NextHome GAP Benefit Review. Reply <strong className="text-white">STOP</strong> at any time to opt out of SMS communications.
            </p>
          </div>

          <a
            href="/"
            className="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }
}