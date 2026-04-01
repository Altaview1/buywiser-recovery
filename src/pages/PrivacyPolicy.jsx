import { usePageTitle } from "@/lib/usePageTitle";

export default function PrivacyPolicy() {
  usePageTitle('Privacy Policy | BuyWiser Home Loans');
  return (
    <div className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: March 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Introduction</h2>
            <p>BuyWiser Technology, Inc. DBA BuyWiser Home Loans ("Company," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and protect information you provide when you contact us or submit a form on our website.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Information We Collect</h2>
            <p>We collect information you voluntarily provide when you submit a contact form or inquiry, including your name, email address, phone number, property location, and any details you share about your mortgage situation. We may also collect basic information about how you interact with our website (such as pages visited).</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">How We Use Your Information</h2>
            <p>Information you provide is used to respond to your mortgage inquiry, provide guidance and analysis relevant to your situation, and communicate with you about your request. We do not sell your personal information to third parties. We may share information with third-party lenders or service providers as necessary to evaluate or process your loan application, in accordance with applicable law.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Communication Consent</h2>
            <p>By submitting a form on this website, you consent to being contacted by phone, email, or text message regarding your mortgage inquiry. Standard message and data rates may apply to text messages. You may opt out of communications at any time by replying STOP to a text message or contacting us directly.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Data Security</h2>
            <p>We implement reasonable technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal information by contacting us at the information below. California residents have additional rights under the California Consumer Privacy Act (CCPA).</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Contact</h2>
            <div className="space-y-1">
              <p>BuyWiser Technology, Inc. DBA BuyWiser Home Loans</p>
              <p>Phone: (818) 300-2642</p>
              <p>Email: bennett@buywiser.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}