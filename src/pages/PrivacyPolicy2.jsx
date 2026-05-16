import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

const NAVY = "#0B1F3B";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div style={{ background: NAVY }} className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm mb-6 transition">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-7 w-7 text-blue-300" />
            <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-blue-300 text-sm">BuyWiser Technology, Inc. / VTON™</p>
          <p className="text-blue-400 text-xs mt-1">Effective Date: May 1, 2025 · Last Updated: May 2025</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8 text-slate-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">1. Information We Collect</h2>
          <p className="mb-3">When you interact with the VTON™ website (myrebate.house) or submit a benefit review request, we may collect the following information:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Contact Information:</strong> Full name, email address, and mobile phone number.</li>
            <li><strong>Property Information:</strong> Property address and related real estate data you provide.</li>
            <li><strong>Usage Data:</strong> Pages visited, time on site, and interaction events (used to improve your experience).</li>
            <li><strong>Appointment Data:</strong> Preferred dates and times you select for benefit review scheduling.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">2. How We Use Your Information</h2>
          <p className="mb-3">We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Contact you regarding your Veteran NextHome GAP Benefit Review</li>
            <li>Send appointment reminders and benefit review scheduling communications</li>
            <li>Deliver SMS messages related to VTON™ veteran benefit programs (with your explicit consent)</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Improve our services and website functionality</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">3. SMS Communications</h2>
          <p className="mb-3">
            <strong>Your phone number may be used for SMS communications</strong>, including appointment reminders, benefit review scheduling, and follow-up messages related to the VTON™ Veteran NextHome GAP Benefit program.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>SMS consent is collected via an unchecked checkbox on our forms — you must actively opt in.</li>
            <li>We will not send you SMS messages without your explicit consent.</li>
            <li><strong>You may opt out at any time</strong> by replying <strong>STOP</strong> to any SMS message you receive from us.</li>
            <li>Reply <strong>HELP</strong> for assistance or contact us directly at (818) 300-2642.</li>
            <li><strong>Message and data rates may apply</strong> depending on your carrier plan.</li>
            <li>Message frequency varies based on your engagement and appointment status.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">4. We Do Not Sell Your Information</h2>
          <p>
            BuyWiser Technology, Inc. does <strong>not sell, rent, or trade your personal information</strong> to third parties for marketing purposes. Your information is used solely to facilitate your Veteran NextHome benefit review and related communications.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">5. Information Sharing</h2>
          <p className="mb-3">We may share your information with:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Service Providers:</strong> Trusted third-party tools (e.g., email delivery, SMS messaging, scheduling) used to operate our services.</li>
            <li><strong>Authorized VTON™ Partner Agents:</strong> Licensed real estate professionals assigned to your market area who will conduct your benefit review.</li>
            <li><strong>Legal Compliance:</strong> If required by law or to protect the rights and safety of our users or the public.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">6. Data Retention</h2>
          <p>We retain your information for as long as necessary to fulfill the purposes outlined in this policy or as required by applicable law. You may request deletion of your information by contacting us directly.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">7. Your Rights</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Request access to the personal information we hold about you</li>
            <li>Request correction or deletion of your personal information</li>
            <li>Opt out of SMS communications at any time by replying STOP</li>
            <li>Contact us to withdraw any consent previously given</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">8. Security</h2>
          <p>We use commercially reasonable measures to protect your personal information from unauthorized access, disclosure, or misuse. All data is transmitted over encrypted connections (SSL/TLS).</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">9. Contact Us</h2>
          <div className="bg-slate-100 rounded-xl p-4 space-y-1">
            <p><strong>BuyWiser Technology, Inc.</strong></p>
            <p>NMLS #1887767 · CA RE License #01107013</p>
            <p>Phone: <a href="tel:+18183002642" className="text-blue-600 hover:underline">(818) 300-2642</a></p>
            <p>Email: <a href="mailto:bennett@buywiser.com" className="text-blue-600 hover:underline">bennett@buywiser.com</a></p>
            <p>Website: <a href="https://myrebate.house" className="text-blue-600 hover:underline">myrebate.house</a></p>
          </div>
        </section>

        <p className="text-xs text-slate-400 pt-4 border-t border-slate-200">
          Not affiliated with the U.S. Department of Veterans Affairs. VTON™ is a trademark of BuyWiser Technology, Inc.
        </p>
      </div>
    </div>
  );
}