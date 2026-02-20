import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, TrendingUp, DollarSign, TrendingDown } from 'lucide-react';

export default function LoanPrograms() {
  const rateOptions = [
    {
      icon: Lock,
      title: "Fixed Rate",
      description: "The most common type of loan option, the traditional fixed-rate mortgage includes monthly principal and interest payments which never change during the loan's lifetime."
    },
    {
      icon: TrendingUp,
      title: "Adjustable ARM",
      description: "Adjustable-rate mortgages include interest payments which shift during the loan's term, depending on current market conditions. Typically, these loans carry a fixed-interest rate for a set period."
    },
    {
      icon: DollarSign,
      title: "Interest Only",
      description: "Interest only mortgages are home loans in which borrowers make monthly payments solely toward the interest accruing on the loan, rather than the principle, for a specified period of time."
    },
    {
      icon: TrendingDown,
      title: "Graduated Payments",
      description: "Graduated Payment Mortgages are loans in which mortgage payments increase annually for a predetermined period of time (e.g. five or ten years)."
    }
  ];

  const loanPrograms = [
    {
      title: "Conventional Loans",
      description: "A conventional loan is a type of loan that is not insured by the government. Conventional loans offer more flexibility and fewer restrictions for borrowers, especially those borrowers with good credit and steady income.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"
    },
    {
      title: "FHA Home Loans",
      description: "FHA home loans are mortgages which are insured by the Federal Housing Administration (FHA), allowing borrowers to get low mortgage rates with a minimal down payment.",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop"
    },
    {
      title: "VA Loans",
      description: "VA loans are mortgages guaranteed by the Department of Veteran Affairs. These loans offer military veterans exceptional benefits, including low interest rates and no down payment requirements.",
      image: "https://images.unsplash.com/photo-1541795795328-f073b763494e?w=400&h=300&fit=crop"
    },
    {
      title: "Jumbo Loans",
      description: "A jumbo loan is a mortgage used to finance properties that are too expensive for a conventional conforming loan. The maximum amount for a conforming loan is $766,550 in most counties.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-64 bg-gradient-to-r from-blue-400 to-purple-300">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20" />
      </section>

      {/* Header Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-green-600 font-semibold text-lg mb-2">LOAN PROGRAMS</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Which Mortgage is Right for You?
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              There are a number of different types of home loans available to you, and it can pay to familiarize yourself with them. Luckily we're here to help you choose the best type of home loan for your needs.
            </p>
            <Link to={createPageUrl('Purchase')}>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                GET STARTED
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mortgage Rate Options */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Mortgage Rate Options
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rateOptions.map((option, index) => (
              <Card key={index} className="border-t-4 border-t-green-600 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <option.icon className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{option.title}</h3>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Program Options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Loan Program Options
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loanPrograms.map((program, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-green-500 overflow-hidden">
                  <img 
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h3>
                  <hr className="border-green-600 border-t-2 w-16 mb-4" />
                  <p className="text-gray-700 leading-relaxed">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}