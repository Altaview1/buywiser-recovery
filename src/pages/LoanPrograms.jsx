import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Lock, Settings, TrendingDown, TrendingUp, Home, FileText, Shield, Landmark, ArrowRight } from "lucide-react";

const rateOptions = [
  {
    icon: Lock,
    title: "Fixed Rate",
    desc: "The most common type of loan option, the traditional fixed-rate mortgage includes monthly principal and interest payments which never change during the loan's lifetime.",
  },
  {
    icon: Settings,
    title: "Adjustable ARM",
    desc: "Adjustable-rate mortgages include interest payments which shift during the loan's term, depending on current market conditions.",
  },
  {
    icon: TrendingDown,
    title: "Interest Only",
    desc: "Interest only mortgages are home loans in which borrowers make monthly payments solely toward the interest accruing on the loan, rather than the principal.",
  },
  {
    icon: TrendingUp,
    title: "Graduated Payments",
    desc: "Graduated Payment Mortgages are loans in which mortgage payments increase annually for a predetermined period of time.",
  },
];

const loanPrograms = [
  {
    icon: Home,
    title: "Conventional Loans",
    desc: "A conventional loan is a type of loan that is not insured by the government. Conventional loans offer more flexibility and fewer restrictions for borrowers, especially those borrowers with good credit and steady income.",
    color: "blue",
  },
  {
    icon: FileText,
    title: "FHA Home Loans",
    desc: "FHA home loans are mortgages which are insured by the Federal Housing Administration (FHA), allowing borrowers to get low mortgage rates with a minimal down payment.",
    color: "indigo",
  },
  {
    icon: Shield,
    title: "VA Loans",
    desc: "VA loans are mortgages guaranteed by the Department of Veteran Affairs. These loans offer military veterans exceptional benefits, including low interest rates and no down payment.",
    color: "green",
  },
  {
    icon: Landmark,
    title: "Jumbo Loans",
    desc: "A jumbo loan is a mortgage used to finance properties that are too expensive for a conventional conforming loan. The maximum amount for a conforming loan is $766,550.",
    color: "amber",
  },
];

export default function LoanPrograms() {
  return (
    <div>
      {/* Banner */}
      <div
        className="h-56 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1600&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-800/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Intro */}
        <div className="flex flex-col lg:flex-row items-start gap-12 mb-16">
          <div className="flex-1">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Loan Programs</p>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Which Mortgage is Right for You?</h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              There are a number of different types of home loans available to you, and it can pay to 
              familiarize yourself with them. Luckily we're here to help you choose the best type of 
              home loan for your needs.
            </p>
            <Link
              to={createPageUrl("ApplyNow")}
              className="inline-flex items-center gap-2 border-2 border-green-600 text-green-600 font-semibold px-6 py-2.5 rounded-full hover:bg-green-50 transition-colors"
            >
              GET STARTED
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
              alt="Loan consultation"
              className="rounded-2xl shadow-xl w-full max-w-md mx-auto border-4 border-green-100"
            />
          </div>
        </div>

        {/* Mortgage Rate Options */}
        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">Mortgage Rate Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rateOptions.map((option) => (
              <div key={option.title} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <option.icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{option.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{option.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Loan Program Options */}
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">Loan Program Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loanPrograms.map((prog) => (
            <div key={prog.title} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <prog.icon className="h-7 w-7 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-1">{prog.title}</h3>
                  <div className="h-0.5 w-12 bg-green-500 mb-3" />
                  <p className="text-slate-500 text-sm leading-relaxed">{prog.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}