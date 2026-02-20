import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-green-700 to-green-900 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Get Started with your Digital Mortgage
        </h2>
        <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
          Answer a few quick questions. No Hassle, No Obligation.
        </p>
        <Link
          to={createPageUrl("ApplyNow")}
          className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-8 py-3.5 rounded-full hover:bg-green-50 transition-colors text-lg shadow-xl"
        >
          Get Started
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}