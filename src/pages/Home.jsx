import { Home, Award, Clock, Shield, CheckCircle, Star, ArrowRight, Mail, Phone as PhoneIcon, MapPin } from "lucide-react";

export default function HomePage() {
  const mailtoLink = `mailto:bennett@buywiser.com?subject=Mortgage Inquiry from Website`;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your Dream Home Starts Here
              </h1>
              <p className="text-xl md:text-2xl text-green-50 mb-8 leading-relaxed">
                Expert mortgage guidance to help you buy, refinance, or consolidate with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition shadow-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Expert Team</p>
                      <p className="text-green-100 text-sm">Licensed & Experienced</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Fast Approval</p>
                      <p className="text-green-100 text-sm">Quick Processing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Trusted Service</p>
                      <p className="text-green-100 text-sm">NMLS Licensed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Buy Wiser?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've been helping customers afford the home of their dreams for many years. Our commitment to excellence and personalized service sets us apart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Guidance</h3>
              <p className="text-gray-600">
                Our experienced team provides personalized advice tailored to your unique financial situation and goals.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Competitive Rates</h3>
              <p className="text-gray-600">
                We work with multiple lenders to find you the best rates and terms for your mortgage.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Processing</h3>
              <p className="text-gray-600">
                Streamlined application process ensures quick approvals so you can close on your dream home faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mortgage Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're buying your first home, refinancing, or consolidating debt, we have the right solution for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <Home className="h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Home Purchase</h3>
              <p className="text-gray-600 text-sm">
                Conventional, FHA, VA, and USDA loans for first-time and experienced buyers.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <Shield className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Refinancing</h3>
              <p className="text-gray-600 text-sm">
                Lower your rate, reduce your term, or tap into your home's equity.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <Award className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Debt Consolidation</h3>
              <p className="text-gray-600 text-sm">
                Simplify your finances by consolidating high-interest debts into one payment.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <CheckCircle className="h-10 w-10 text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Home Equity</h3>
              <p className="text-gray-600 text-sm">
                Access your home's equity for renovations, education, or other needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it — hear from satisfied homeowners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Bennett made the entire mortgage process smooth and stress-free. His expertise and attention to detail were exceptional!"
              </p>
              <p className="font-semibold text-gray-900">Sarah M.</p>
              <p className="text-sm text-gray-600">First-Time Homebuyer</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "We refinanced our home and saved hundreds each month. The team was professional, responsive, and truly cared about our needs."
              </p>
              <p className="font-semibold text-gray-900">Michael & Lisa T.</p>
              <p className="text-sm text-gray-600">Refinance Clients</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Outstanding service! They found us a great rate and walked us through every step. Highly recommend Buy Wiser!"
              </p>
              <p className="font-semibold text-gray-900">David R.</p>
              <p className="text-sm text-gray-600">Home Purchase</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600">
              Contact us today for a free consultation. Let's make your homeownership dreams a reality.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <a
                href={mailtoLink}
                className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition group"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 text-sm">bennett@buywiser.com</p>
              </a>

              <a
                href="tel:+18183002642"
                className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition group"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
                  <PhoneIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 text-sm">(818) 300-2642</p>
              </a>

              <div className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600 text-sm">5115 Lankershim Blvd #705<br />North Hollywood, CA 91601</p>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* Credentials */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            <span className="font-semibold">Licensed & Regulated</span> • Company NMLS: 1887767 • Personal NMLS: 1524446
          </p>
        </div>
      </section>
    </div>
  );
}