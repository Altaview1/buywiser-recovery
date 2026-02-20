import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Home, DollarSign, TrendingUp, BarChart3, Receipt, Percent, Building2, Coins, Wallet, TrendingDown } from 'lucide-react';

export default function Calculators() {
  const calculators = [
    { icon: Calculator, title: "Mortgage Calculator", color: "text-green-600" },
    { icon: Home, title: "Refinance Calculator", color: "text-green-600" },
    { icon: DollarSign, title: "Extra Payment Calculator", color: "text-green-600" },
    { icon: Building2, title: "How much home can I afford?", color: "text-green-600" },
    { icon: BarChart3, title: "Principal Calculator", color: "text-green-600" },
    { icon: Receipt, title: "Tax Benefits of Buying", color: "text-green-600" },
    { icon: Percent, title: "What's my APR?", color: "text-green-600" },
    { icon: TrendingUp, title: "Interest-Only Calculator", color: "text-green-600" },
    { icon: Coins, title: "Should I pay Points?", color: "text-green-600" },
    { icon: Wallet, title: "How much income to qualify?", color: "text-green-600" },
    { icon: TrendingDown, title: "Buydown Calculator", color: "text-green-600" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-64 bg-gradient-to-r from-blue-400 to-purple-300">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/20" />
      </section>

      {/* Calculators Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Mortgage Calculators
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc, index) => (
              <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <calc.icon className={`h-16 w-16 ${calc.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-lg font-semibold text-gray-900">{calc.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Disclaimer</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Information and interactive calculators are made available to you as self-help tools for your independent use and are not intended to provide investment advice. We cannot and do not guarantee their applicability or accuracy in regards to your individual circumstances. All examples are hypothetical and are for illustrative purposes. We encourage you to seek personalized advice from qualified professionals regarding all personal finance issues.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}