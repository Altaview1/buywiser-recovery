import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-64 bg-gradient-to-r from-blue-400 to-purple-300">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20" />
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Us</h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our mission is to serve our customers with honesty, integrity and competence. Our goal is to provide home loans to our clients while providing them with the lowest interest rates and closing costs possible. Furthermore, we pledge to help borrowers overcome roadblocks that can arise while securing a loan.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Meet Your Team</h2>

          <div className="space-y-12">
            {/* Bennett Liss */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 overflow-hidden">
                    <img 
                      src="https://d2vfmc14ehtaht.cloudfront.net/29152e5340aa01eac5/3feb5823aee904e39fec55140046c6b36eb7427a.jpg"
                      alt="Bennett Liss"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Bennett Liss</h3>
                    <p className="text-lg text-green-600 font-semibold mb-4">CEO & Broker</p>
                    <p className="text-gray-700 leading-relaxed">
                      Innovator and seasoned veteran in the real estate industry, Bennett brings a wealth of knowledge and experience to BuyWiser. Bennett invented the U.S. Emergency Communications System (PACE), now a 3.2 Billion Dollar company called Blackboard. With over 35 years of mortgage and real estate experience, Bennett has encountered virtually every scenario in the industry. Bennett's expertise in ensuring that all our clients find the best solution for their needs establishes him as an invaluable resource to our team and clients alike.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Isaac Wilf */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex-shrink-0 overflow-hidden">
                    <img 
                      src="https://d2vfmc14ehtaht.cloudfront.net/29152e5340aa01eac5/52dfe5e0a6c252b63aff166dc122041b095b659b.jpg"
                      alt="Isaac Wilf"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Isaac Wilf</h3>
                    <p className="text-lg text-green-600 font-semibold mb-4">COO</p>
                    <p className="text-gray-700 leading-relaxed">
                      Isaac brings a track record of financial technology, marketing, and operational expertise to BuyWiser's real estate solutions. As founding salesperson and principal architect for Go-To-Market operations at Tapcheck, revenue increased by 1,600% in just 21 months, smashing growth records as the fastest growing company in VC portfolio history. Isaac has deep expertise in building onboarding, training programs, financial modeling, and building automations for key business processes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}