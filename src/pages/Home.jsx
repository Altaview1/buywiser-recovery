import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Key, DollarSign, MessageSquare, CheckCircle2, Calculator, FileText, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const testimonials = [
    {
      text: "I can't thank Bennett enough for making my dream of homeownership come true. His team was incredibly supportive throughout the entire process, explaining every step and ensuring I got the best possible rate. I'm now a proud homeowner and couldn't be happier!",
      author: "Sarah J.",
      location: "Oak Park, CA"
    },
    {
      text: "Bennett is amazing. He will get you a great deal and is so incredibly easy to work with. Bennett spent so much time with me, making sure I was comfortable and understood all steps in the process. Bennett is exceptionally knowledgable and was able to save my deal multiple times because of his expertise.",
      author: "Christina G.",
      location: "Mission Viejo, CA"
    },
    {
      text: "Our experience with Bennett was exceptional. From the moment we applied for our mortgage, he provided expert guidance and kept us informed at every turn. Thanks to his dedication, we're now living in our dream home. Highly recommended!",
      author: "John M.",
      location: "Encino, CA"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&h=900&fit=crop)' }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Ideal Mortgage Solution
          </h1>
          <p className="text-xl text-gray-200 mb-8">Tell us about your goals</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <Link to={createPageUrl('Purchase')}>
              <Card className="bg-white hover:shadow-xl transition-all cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <Key className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Purchase</h3>
                  <p className="text-gray-600 text-sm">I want to buy a home</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl('Refinance')}>
              <Card className="bg-white hover:shadow-xl transition-all cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Refinance</h3>
                  <p className="text-gray-600 text-sm">I'm ready to refinance</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl('Contact')}>
              <Card className="bg-white hover:shadow-xl transition-all cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Talk with Us</h3>
                  <p className="text-gray-600 text-sm">I want to see if I qualify to buy my first home</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Start Your Home Loan Journey Today!
          </h2>
          <p className="text-center text-gray-600 mb-12">A Simple 3-Step Process</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Answer a few questions</h3>
              <p className="text-gray-600">Tell us what you're looking for so we can match you with the perfect mortgage</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Find your lender</h3>
              <p className="text-gray-600">We'll search for the top rates from our network of lenders in your area</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lock in your rate</h3>
              <p className="text-gray-600">Your lender will contact you shortly so you get more info or lock in your rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            What our clients say about us!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">- {testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Helping You Find the Right Mortgage Option
          </h2>
          <p className="text-center text-gray-600 mb-12">Tools to help you get started</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to={createPageUrl('Purchase')}>
              <Card className="hover:shadow-lg transition-all h-full cursor-pointer">
                <CardContent className="p-6">
                  <Key className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Purchase</h3>
                  <p className="text-gray-600 text-sm">Whether you're buying your first home or your dream home, we have a mortgage solution for you. Get your custom rate quote today.</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl('Refinance')}>
              <Card className="hover:shadow-lg transition-all h-full cursor-pointer">
                <CardContent className="p-6">
                  <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Refinance</h3>
                  <p className="text-gray-600 text-sm">We're committed to helping you refinance with the lowest rates and fees in the industry today. Check out our Low Rates, Calculate your Payment, or Start the Process Today!</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl('Purchase')}>
              <Card className="hover:shadow-lg transition-all h-full cursor-pointer">
                <CardContent className="p-6">
                  <FileText className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Apply Now</h3>
                  <p className="text-gray-600 text-sm">Our Secure Application takes about 7-10 minutes to complete, and is required for a "Pre-Approval." You will be contacted once your application is submitted.</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl('Calculators')}>
              <Card className="hover:shadow-lg transition-all h-full cursor-pointer">
                <CardContent className="p-6">
                  <Calculator className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Mortgage Calculators</h3>
                  <p className="text-gray-600 text-sm">Our mortgage calculators help you hone in on the loan options that are best for you. Calculate your mortgage payments, affordability, and more.</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl('LoanPrograms')}>
              <Card className="hover:shadow-lg transition-all h-full cursor-pointer">
                <CardContent className="p-6">
                  <BookOpen className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Loan Programs</h3>
                  <p className="text-gray-600 text-sm">Explore various loan program options to find the right fit for you and your family. We support everything from fixed rate to adjustable rate mortgages.</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl('About')}>
              <Card className="hover:shadow-lg transition-all h-full cursor-pointer">
                <CardContent className="p-6">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Step by Step Guide</h3>
                  <p className="text-gray-600 text-sm">Learn about the Loan Process end to end. We have made it our mission to help you at every step of the way so you get the best loan option available to you.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Started with your Digital Mortgage
          </h2>
          <p className="text-xl text-green-50 mb-8">Answer a few quick questions, No Hassle, No Obligation</p>
          <Link to={createPageUrl('Purchase')}>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}