import { Shield } from "lucide-react";

export default function Disclosures() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-green-700" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Licensing & Disclosures</h1>
        </div>
        <p className="text-sm text-slate-500 mb-8">Required regulatory and licensing information</p>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="bg-slate-50 rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">Company Information</h2>
            <div className="space-y-1.5">
              <p><span className="font-medium text-slate-800">Legal Name:</span> BuyWiser Technology, Inc.</p>
              <p><span className="font-medium text-slate-800">DBA:</span> BuyWiser Home Loans</p>
              <p><span className="font-medium text-slate-800">Address:</span> 5115 Lankershim Blvd #705, North Hollywood, CA 91601</p>
              <p><span className="font-medium text-slate-800">Phone:</span> (818) 300-2642</p>
              <p><span className="font-medium text-slate-800">Email:</span> bennett@buywiser.com</p>
            </div>
          </section>

          <section className="bg-slate-50 rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">NMLS Information</h2>
            <div className="space-y-1.5">
              <p><span className="font-medium text-slate-800">Company NMLS ID:</span> 1887767</p>
              <p><span className="font-medium text-slate-800">Personal NMLS ID:</span> 1524446</p>
              <p className="mt-3 text-xs text-slate-500">
                You can verify licensing information at the Nationwide Multistate Licensing System (NMLS) consumer access portal at{" "}
                <a href="https://www.nmlsconsumeraccess.org" target="_blank" rel="noopener noreferrer" className="text-green-700 underline hover:text-green-800">nmlsconsumeraccess.org</a>.
              </p>
            </div>
          </section>

          <section className="bg-slate-50 rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">California Licensing</h2>
            <p>BuyWiser Technology, Inc. is licensed by the California Department of Financial Protection and Innovation (DFPI) under the California Residential Mortgage Lending Act (CRMLA). Mortgage services provided by this company are regulated by the DFPI.</p>
          </section>

          <section className="bg-slate-50 rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">General Disclosures</h2>
            <div className="space-y-3">
              <p>This website does not constitute an offer to lend or a commitment to lend. All loan applications are subject to credit approval, underwriting review, property appraisal (where applicable), and satisfaction of all applicable conditions.</p>
              <p>Interest rates and loan terms referenced in any marketing materials or on this website are subject to change without notice and are based on market conditions at the time of application. Actual rates and terms will be determined at the time a loan application is submitted and approved.</p>
              <p>All loan programs, eligibility requirements, and terms are subject to lender guidelines and may not be available in all circumstances. Not all applicants will qualify.</p>
              <p>Information provided on this website, including calculator results, is for general educational purposes only and should not be relied upon as financial or legal advice. We encourage borrowers to consult with qualified financial and legal professionals regarding their specific situations.</p>
            </div>
          </section>

          <section className="bg-slate-50 rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">Equal Housing Opportunity</h2>
            <p>BuyWiser Technology, Inc. is an equal housing opportunity lender. We do not discriminate based on race, color, religion, national origin, sex, handicap, familial status, or any other characteristic protected by applicable law.</p>
          </section>

          <section className="bg-slate-50 rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3">Privacy</h2>
            <p>For information about how we collect and use your personal information, please review our{" "}
              <a href="/PrivacyPolicy" className="text-green-700 underline hover:text-green-800">Privacy Policy</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}