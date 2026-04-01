import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { usePageTitle } from "@/lib/usePageTitle";
import { CheckCircle, Phone, Award, Shield, Users } from "lucide-react";

const values = [
  {
    icon: CheckCircle,
    title: "Honest Analysis",
    desc: "We tell you when refinancing doesn't make sense. We're not building a transaction — we're building a relationship.",
  },
  {
    icon: Shield,
    title: "Regulatory Seriousness",
    desc: "Fully licensed in California under the DFPI. We take compliance, disclosure, and borrower protection seriously.",
  },
  {
    icon: Award,
    title: "Experience With Complexity",
    desc: "Self-employed income, prior credit events, unique property types, large equity positions — we've navigated them all.",
  },
  {
    icon: Users,
    title: "Direct Communication",
    desc: "You deal with the person working on your loan. No handoffs to a processing center, no unanswered calls.",
  },
];

export default function About() {
  usePageTitle('About BuyWiser Home Loans | California Mortgage');
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">About BuyWiser Home Loans</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Boutique Mortgage Expertise Since 1991</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            Over three decades of serving California homeowners and buyers — with a personal advisor model, 40+ competing lenders, and a commitment to straight talk over sales pressure.
          </p>
        </div>
      </section>

      {/* About Bennett */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About Bennett Liss — Broker &amp; CEO</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Few people remember — and even fewer ever experienced — a time when you pulled into a gas station and an attendant came out, filled your tank, wiped your windshield, and checked your oil without you even having to ask. It sounds almost hard to believe today. And now, with AI replacing more and more of the human touch, it's fair to ask: where is the experienced person who will actually guide you, look out for your interests, and take care of your needs? At BuyWiser, that person is still here.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Bennett Liss has been working in California mortgage lending since 1991 — over three decades of helping homeowners and buyers navigate decisions that have a lasting impact on their finances. That longevity isn't just a number. It means he's personally lived through multiple rate cycles, market crashes, and regulatory overhauls. He knows what works — and he knows what doesn't.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                At BuyWiser, the model is simple but powerful: you get Bennett personally assigned to your loan. Not a call center. Not a rotating team. One expert who knows your file, knows your goals, and shops your loan against over 40 competing banks and lenders to find the best rate and structure available to you.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                That's the difference between going directly to a bank and working with a mortgage broker. A bank offers you their one rate. As your broker, Bennett shops your loan across 40+ competing lenders to find the market's best rate — then rolls up his sleeves and gets it done.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                He's worked with clients across a wide range of situations — first-time buyers, long-term homeowners considering their first refinance, self-employed borrowers with complex income documentation, and homeowners with significant equity who needed help thinking through whether and how to access it.
              </p>
              <p className="text-slate-600 leading-relaxed">
                If you've been told no elsewhere, had a confusing experience with a large lender, or simply want someone who will actually pick up the phone and give you a straight answer — that's exactly what BuyWiser is here for.
              </p>
            </div>
            <div>
              <div className="bg-slate-50 rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4">Licensing & Credentials</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Company NMLS</p>
                      <p className="text-slate-600">#1887767</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Personal NMLS</p>
                      <p className="text-slate-600">#1524446</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">State License</p>
                      <p className="text-slate-600">California — DFPI / CRMLA</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">CA RE License</p>
                      <p className="text-slate-600">#01107013</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-slate-600">
                  <a href="tel:+18183002642" className="block mt-1 text-green-700 font-medium">(818) 300-2642</a>
                  <a href="mailto:bennett@buywiser.com" className="block mt-0.5 text-green-700 font-medium">bennett@buywiser.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">How We Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((val) => (
              <div key={val.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <val.icon className="h-5 w-5 text-green-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{val.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-3">Let's Talk About Your Situation</h2>
          <p className="text-green-100 mb-6">No obligation. We'll tell you honestly what we see and what options make sense.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Contact')} className="px-8 py-3.5 bg-white text-green-700 rounded-lg font-bold hover:bg-green-50 transition">
              Request a Mortgage Review
            </Link>
            <a href="tel:+18183002642" className="px-8 py-3.5 border-2 border-green-400 text-white rounded-lg font-bold hover:bg-green-500 transition flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />(818) 300-2642
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}