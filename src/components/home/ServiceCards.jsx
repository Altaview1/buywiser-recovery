import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Home, RefreshCw, FileText, Calculator, BookOpen, MapPin } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Purchase",
    desc: "Whether you're buying your first home or your dream home, we have a mortgage solution for you. Get your custom rate quote today.",
    link: createPageUrl("ApplyNow") + "?type=purchase",
  },
  {
    icon: RefreshCw,
    title: "Refinance",
    desc: "We're committed to helping you refinance with the lowest rates and fees in the industry today.",
    link: createPageUrl("ApplyNow") + "?type=refinance",
  },
  {
    icon: FileText,
    title: "Apply Now",
    desc: "Our Secure Application takes about 7-10 minutes to complete, and is required for a \"Pre-Approval.\"",
    link: createPageUrl("ApplyNow"),
  },
  {
    icon: Calculator,
    title: "Mortgage Calculators",
    desc: "Our mortgage calculators help you hone in on the loan options that are best for you.",
    link: createPageUrl("MortgageCalculators"),
  },
  {
    icon: BookOpen,
    title: "Loan Programs",
    desc: "Explore various loan program options to find the right fit for you and your family.",
    link: createPageUrl("LoanPrograms"),
  },
  {
    icon: MapPin,
    title: "Step by Step Guide",
    desc: "Learn about the Loan Process end to end. We have made it our mission to help you at every step.",
    link: createPageUrl("About"),
  },
];

export default function ServiceCards() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Helping You Find the Right Mortgage Option
          </h2>
          <p className="text-slate-500 text-lg">Tools to help you get started</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              to={service.link}
              className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-green-200 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                <service.icon className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-green-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}