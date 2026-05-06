import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { LogOut, LayoutDashboard, Users, MapPin, Shield, ArrowRight } from "lucide-react";
import VideoTestimonial from "@/components/VideoTestimonial";
import VeteranTestimonials from "@/components/VeteranTestimonials";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const backofficeRoles = [
  {
    id: "partner",
    label: "Partner Dashboard",
    icon: Users,
    description: "Manage opportunities & track payouts",
    path: "/partner",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-700",
    iconBg: "bg-blue-100",
  },
  {
    id: "admin",
    label: "Admin Portal",
    icon: Shield,
    description: "System administration & operations",
    path: "/activator-admin",
    color: "bg-slate-50 border-slate-200",
    textColor: "text-slate-700",
    iconBg: "bg-slate-100",
  },
];

export default function PortalHubPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: NAVY }}>
        <div className="text-white text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto" />
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Hero Section — Veteran Benefits */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center gap-1 mb-5">
            <span className="text-3xl">🇺🇸</span>
            <span className="text-3xl">⭐</span>
            <span className="text-3xl">🇺🇸</span>
          </div>
          <h1 className="text-5xl font-black mb-4 leading-tight" style={{ color: NAVY }}>
            Veteran's Next Home™ Program
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            <span className="text-slate-900 font-bold">You are selling a VA-financed home — you qualify for the Veteran's Next Home™ Program.</span> Up to 1.5% cash back when your next purchase is coordinated through BuyWiser.
          </p>
          <a
            href="/vton-scan"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-lg text-white transition hover:shadow-lg active:scale-95"
            style={{ background: RED }}
          >
            Claim My Veteran Next Home Benefits <ArrowRight className="h-5 w-5" />
          </a>
          <p className="text-xs text-slate-500 mt-4">No obligation. Takes less than 3 minutes.</p>
        </div>

        {/* Video Testimonial */}
        <div className="mt-12 max-w-2xl mx-auto w-full">
          <VideoTestimonial />
          <p className="text-center text-sm font-bold text-slate-700 mt-3 uppercase tracking-wide">Veterans Cody and Frank</p>
        </div>
      </section>

      {/* Veteran Testimonials */}
      <section className="px-4 py-12 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: NAVY }}>Real Veterans Saving With BuyWiser</h2>
          <VeteranTestimonials />
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: NAVY }}>How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "📋", title: "Review Benefits", desc: "Understand your eligibility and potential benefit amount" },
              { icon: "🏠", title: "Plan Your Next Home", desc: "Work with BuyWiser to structure your purchase" },
              { icon: "💰", title: "Claim Your Benefit", desc: "Receive up to 1.5% cash back at closing" },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back-Office Access */}
      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center mb-8">Back-Office Access</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {backofficeRoles.map(role => {
              const Icon = role.icon;
              return (
                <a
                  key={role.id}
                  href={role.path}
                  className={`border-2 rounded-xl p-5 transition hover:shadow-md hover:border-current ${role.color} cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${role.iconBg}`}>
                      <Icon className={`h-5 w-5 ${role.textColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-sm font-bold mb-0.5 ${role.textColor}`}>{role.label}</h3>
                      <p className="text-xs text-slate-600">{role.description}</p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="px-4 py-8 text-center border-t border-slate-200 bg-white">
        <p className="text-xs text-slate-500">
          Veteran's Next Home™ is a private BuyWiser program, not affiliated with the VA.
        </p>
      </div>
    </div>
  );
}