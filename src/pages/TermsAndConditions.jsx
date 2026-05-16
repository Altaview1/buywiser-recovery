import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

const NAVY = "#0B1F3B";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div style={{ background: NAVY }} className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm mb-6 transition">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-7 w-7 text-blue-300" />
            <h1 className="text-2xl font-bold text-white">Terms &amp; Conditions</h1>
          </div>
          <p className="text-blue-300 text-sm">BuyWiser Technology, Inc. / VTON™</p>
          <p className="text-blue-400 text-xs mt-1">Effective Date: May 1, 2025 · Last Updated: May 2025</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8 text-slate-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing myrebate.house or submitting any form on this website, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use this site or submit your information.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">2. SMS Consent &amp; Communications</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="font-semibold text-blue-900 mb-2">Important SMS Notice</p>
            <p className="text-blue-800 leading-relaxed">
              By checking the SMS consent checkbox on any VTON™ form, you expressly consent to receive SMS text messages from BuyWiser Technology, Inc. / VTON™ at the mobile number you provide.
            </p>
          </div>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Message Types:</strong> Appointment reminders, benefit review scheduling confirmations, follow-up communications, and informational messages related to the Veteran NextHome GAP Benefit program.</li>
            <li><strong>Message Frequency:</strong> Message frequency varies. You may receive messages related to scheduling, confirmations, and follow-up outreach.</li>
            <li><strong>To Opt Out:</strong> Reply <strong>STOP</strong> to any SMS message at any time to unsubscribe. You will receive one final confirmation message and then no further messages.</li>
            <li><strong>For Assistance:</strong> Reply <strong>HELP</strong> to any SMS message or contact us at (818) 300-2642.</li>
            <li><strong>Message &amp; Data Rates:</strong> Standard message and data rates may apply depending on your mobile carrier and plan. BuyWiser is not responsible for any charges incurred by your carrier.</li>
            <li><strong>Consent is Voluntary:</strong> Consent to receive SMS is not a condition of purchasing any product or service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">3. Services Description</h2>
          <p className="mb-3">
            VTON™ (Veteran Transition Opportunity Network) is a program operated by BuyWiser Technology, Inc. that connects eligible veterans with educational benefit review consultations related to the Buywiser 1.5 GAP Benefit™ program.
          </p>
          <p>
            <strong>No Guarantee of Services:</strong> Submission of a form on this website does not guarantee eligibility for any benefit, program, or service. All benefit reviews are subject to qualification review and availability. Results vary by individual circumstance.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">4. Not a Government Program</h2>
          <p>
            BuyWiser Technology, Inc. and VTON™ are <strong>not affiliated with the U.S. Department of Veterans Affairs</strong> or any government agency. References to VA financing reflect eligibility criteria only and do not imply government endorsement or affiliation.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">5. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, BuyWiser Technology, Inc. shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or participation in any VTON™ program. The information on this site is provided for educational purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">6. Privacy</h2>
          <p>
            Your use of this site is also governed by our{" "}
            <Link to="/privacy" className="text-blue-600 underline hover:text-blue-800">Privacy Policy</Link>,
            which is incorporated into these Terms by reference.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">7. Changes to These Terms</h2>
          <p>
            We reserve the right to update these Terms &amp; Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of the site following any changes constitutes your acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">8. Contact Information</h2>
          <div className="bg-slate-100 rounded-xl p-4 space-y-1">
            <p><strong>BuyWiser Technology, Inc.</strong></p>
            <p>NMLS #1887767 · CA RE License #01107013</p>
            <p>Phone: <a href="tel:+18183002642" className="text-blue-600 hover:underline">(818) 300-2642</a></p>
            <p>Email: <a href="mailto:bennett@buywiser.com" className="text-blue-600 hover:underline">bennett@buywiser.com</a></p>
            <p>Website: <a href="https://myrebate.house" className="text-blue-600 hover:underline">myrebate.house</a></p>
          </div>
        </section>

        <p className="text-xs text-slate-400 pt-4 border-t border-slate-200">
          VTON™ is a trademark of BuyWiser Technology, Inc. Not affiliated with the U.S. Department of Veterans Affairs.
        </p>
      </div>
    </div>
  );
}