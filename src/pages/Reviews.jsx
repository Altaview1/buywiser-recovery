import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { usePageTitle } from "@/lib/usePageTitle";
import { Star, Phone } from "lucide-react";

const reviews = [
  {
    name: "Sandra K.",
    location: "Van Nuys, CA",
    situation: "FHA Streamline Refinance",
    stars: 5,
    text: "I had been paying too much on my FHA loan for years and didn't realize I could refinance so easily. Bennett walked me through the whole process, explained exactly what would happen at each step, and we closed faster than I expected. My payment dropped over $200 a month. Wish I had done it sooner.",
  },
  {
    name: "Marcus & Denise T.",
    location: "Burbank, CA",
    situation: "Cash-Out Refinance",
    stars: 5,
    text: "We had significant equity built up but weren't sure how to use it wisely. Bennett explained our options honestly — including some we weren't considering. He didn't push us toward anything and helped us think through the full picture. We ended up making a decision we feel really good about.",
  },
  {
    name: "Jorge R.",
    location: "Glendale, CA",
    situation: "First-Time Home Purchase",
    stars: 5,
    text: "First-time buyer, completely new to all of this. Bennett explained everything without making me feel stupid. We got preapproved quickly and he helped me understand what I could realistically afford — not just what the max qualification was. Closed in 28 days. Couldn't have asked for a better experience.",
  },
  {
    name: "Patricia L.",
    location: "Pasadena, CA",
    situation: "VA IRRRL Refinance",
    stars: 5,
    text: "As a veteran, I've dealt with a lot of lenders who treat VA loans like a hassle. Bennett was the opposite. He explained the IRRRL process clearly, told me what to expect, and kept the communication going the whole way through. Lowered my rate and my monthly payment with very little paperwork on my end.",
  },
  {
    name: "Raymond & Alicia C.",
    location: "Encino, CA",
    situation: "Rate & Term Refinance",
    stars: 5,
    text: "We'd been thinking about refinancing for over a year but kept second-guessing ourselves. Bennett actually showed us the break-even math — when we'd recoup the closing costs and what the long-term savings looked like. That gave us the clarity to move forward. Great process, professional team.",
  },
  {
    name: "Linda M.",
    location: "Studio City, CA",
    situation: "Home Purchase — Self-Employed",
    stars: 5,
    text: "Self-employed borrowers have a harder time qualifying, and I'd already been turned down once. Bennett knew exactly how to document my income correctly, worked with the right lender for my situation, and got us across the finish line. He never made me feel like it was impossible.",
  },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Reviews() {
  usePageTitle('Client Reviews | BuyWiser Home Loans');
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">Client Reviews</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">What Borrowers Say</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            Real experiences from California homeowners and buyers we've worked with — in their own words.
          </p>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col">
                <StarRating count={review.stars} />
                <p className="text-slate-700 text-sm leading-relaxed my-4 flex-1">"{review.text}"</p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-bold text-slate-900 text-sm">{review.name}</p>
                  <p className="text-slate-500 text-xs">{review.location}</p>
                  <p className="text-green-700 text-xs font-medium mt-0.5">{review.situation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust note */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            Reviews represent the experiences of actual clients. Individual results vary based on each borrower's financial situation, credit, and property. Past loan performance does not guarantee future results.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to See What's Possible?</h2>
          <p className="text-green-100 mb-6">Request a no-obligation mortgage review. We'll look at your situation and give you a straight answer.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('ContactUs')} className="px-8 py-3.5 bg-white text-green-700 rounded-lg font-bold hover:bg-green-50 transition">
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