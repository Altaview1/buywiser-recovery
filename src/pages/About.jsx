import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { ArrowRight } from "lucide-react";
import QuickQuoteForm from "../components/QuickQuoteForm";

export default function About() {
  return (
    <div>
      {/* Banner */}
      <div
        className="h-56 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-800/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* About Text */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">About Us</h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Our mission is to serve our customers with honesty, integrity and competence. 
            Our goal is to provide home loans to our clients while providing them with the 
            lowest interest rates and closing costs possible. Furthermore, we pledge to help 
            borrowers overcome roadblocks that can arise while securing a loan.
          </p>
        </div>

        {/* Team */}
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Meet Your Team</h2>

        <div className="space-y-8 mb-16">
          {/* Bennett */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
            <img
              src="https://d2vfmc14ehtaht.cloudfront.net/29152e5340aa01eac5/3feb5823aee904e39fec55140046c6b36eb7427a.jpg"
              alt="Bennett Liss"
              className="w-32 h-32 rounded-2xl object-cover flex-shrink-0"
            />
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Bennett Liss</h3>
              <p className="text-green-600 font-semibold mb-3">CEO & Broker</p>
              <p className="text-slate-600 leading-relaxed">
                Innovator and seasoned veteran in the real estate industry, Bennett brings a wealth 
                of knowledge and experience to BuyWiser. Bennett invented the U.S. Emergency Communications 
                System (PACE), now a 3.2 Billion Dollar company called Blackboard. With over 35 years of 
                mortgage and real estate experience, Bennett has encountered virtually every scenario in 
                the industry. Bennett's expertise in ensuring that all our clients find the best solution 
                for their needs establishes him as an invaluable resource to our team and clients alike.
              </p>
            </div>
          </div>

          {/* Isaac */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
            <img
              src="https://d2vfmc14ehtaht.cloudfront.net/29152e5340aa01eac5/52dfe5e0a6c252b63aff166dc122041b095b659b.jpg"
              alt="Isaac Wilf"
              className="w-32 h-32 rounded-2xl object-cover flex-shrink-0"
            />
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Isaac Wilf</h3>
              <p className="text-green-600 font-semibold mb-3">COO</p>
              <p className="text-slate-600 leading-relaxed">
                Isaac brings a track record of financial technology, marketing, and operational expertise 
                to BuyWiser's real estate solutions. As founding salesperson and principal architect for 
                Go-To-Market operations at Tapcheck, revenue increased by 1,600% in just 21 months, 
                smashing growth records as the fastest growing company in VC portfolio history. Isaac has 
                deep expertise in building onboarding, training programs, financial modeling, and building 
                automations for key business processes.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Quote Form */}
        <QuickQuoteForm />
      </div>
    </div>
  );
}