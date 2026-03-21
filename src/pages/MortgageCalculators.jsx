import { useState } from "react";
import { Calculator, DollarSign, Percent, TrendingDown, Home, BarChart, PiggyBank, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const calculatorTypes = [
  { id: "mortgage", icon: Calculator, label: "Mortgage Calculator" },
  { id: "refinance", icon: TrendingDown, label: "Refinance Calculator" },
  { id: "afford", icon: Home, label: "How much home can I afford?" },
  { id: "extra", icon: DollarSign, label: "Extra Payment Calculator" },
  { id: "principal", icon: BarChart, label: "Principal Calculator" },
  { id: "apr", icon: Percent, label: "What's my APR?" },
];

function MortgageCalc() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState("30");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = rate / 100 / 12;
    const numPayments = parseInt(term) * 12;
    const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    setResult({
      monthly: monthly.toFixed(2),
      total: (monthly * numPayments).toFixed(2),
      totalInterest: (monthly * numPayments - principal).toFixed(2),
      principal: principal.toFixed(2),
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label>Home Price ($)</Label>
          <Input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} />
        </div>
        <div>
          <Label>Down Payment ($)</Label>
          <Input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} />
        </div>
        <div>
          <Label>Interest Rate (%)</Label>
          <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </div>
        <div>
          <Label>Loan Term</Label>
          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 Years</SelectItem>
              <SelectItem value="20">20 Years</SelectItem>
              <SelectItem value="15">15 Years</SelectItem>
              <SelectItem value="10">10 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={calculate} className="bg-green-600 hover:bg-green-700 text-white px-8">Calculate</Button>
      {result && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Monthly Payment</p>
            <p className="text-2xl font-bold text-green-700">${Number(result.monthly).toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Loan Amount</p>
            <p className="text-lg font-bold text-slate-700">${Number(result.principal).toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Total Interest</p>
            <p className="text-lg font-bold text-slate-700">${Number(result.totalInterest).toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Total Cost</p>
            <p className="text-lg font-bold text-slate-700">${Number(result.total).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AffordabilityCalc() {
  const [income, setIncome] = useState(100000);
  const [debt, setDebt] = useState(500);
  const [down, setDown] = useState(50000);
  const [rate, setRate] = useState(6.5);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const monthlyIncome = income / 12;
    const maxPayment = monthlyIncome * 0.28 - debt;
    const monthlyRate = rate / 100 / 12;
    const numPayments = 360;
    const maxLoan = maxPayment * (Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
    setResult({
      maxHome: (maxLoan + down).toFixed(0),
      maxPayment: maxPayment.toFixed(2),
      maxLoan: maxLoan.toFixed(0),
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label>Annual Household Income ($)</Label>
          <Input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
        </div>
        <div>
          <Label>Monthly Debt Payments ($)</Label>
          <Input type="number" value={debt} onChange={(e) => setDebt(Number(e.target.value))} />
        </div>
        <div>
          <Label>Down Payment ($)</Label>
          <Input type="number" value={down} onChange={(e) => setDown(Number(e.target.value))} />
        </div>
        <div>
          <Label>Interest Rate (%)</Label>
          <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </div>
      </div>
      <Button onClick={calculate} className="bg-green-600 hover:bg-green-700 text-white px-8">Calculate</Button>
      {result && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Max Home Price</p>
            <p className="text-2xl font-bold text-green-700">${Number(result.maxHome).toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Max Monthly Payment</p>
            <p className="text-lg font-bold text-slate-700">${Number(result.maxPayment).toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Max Loan Amount</p>
            <p className="text-lg font-bold text-slate-700">${Number(result.maxLoan).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MortgageCalculators() {
  // Title set via document title below
  const [activeCalc, setActiveCalc] = useState("mortgage");

  return (
    <div>
      {/* Banner */}
      <div
        className="h-56 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-800/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-800 text-center mb-10">Mortgage Calculators</h1>

        {/* Calculator Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {calculatorTypes.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveCalc(calc.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                activeCalc === calc.id
                  ? "bg-green-50 border-green-300 shadow-sm"
                  : "bg-white border-slate-200 hover:border-green-200 hover:bg-green-50/50"
              }`}
            >
              <calc.icon className={`h-7 w-7 ${activeCalc === calc.id ? "text-green-600" : "text-slate-400"}`} />
              <span className={`text-xs text-center font-medium ${activeCalc === calc.id ? "text-green-700" : "text-slate-600"}`}>
                {calc.label}
              </span>
            </button>
          ))}
        </div>

        {/* Calculator Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {calculatorTypes.find((c) => c.id === activeCalc)?.label}
          </h2>
          {(activeCalc === "mortgage" || activeCalc === "refinance" || activeCalc === "extra" || activeCalc === "principal" || activeCalc === "apr") && <MortgageCalc />}
          {activeCalc === "afford" && <AffordabilityCalc />}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>Disclaimer:</strong> Information and interactive calculators are made available to you as self-help tools 
            for your independent use and are not intended to provide investment advice. We cannot and do not guarantee their 
            applicability or accuracy in regards to your individual circumstances. All examples are hypothetical and are for 
            illustrative purposes. We encourage you to seek personalized advice from qualified professionals regarding all 
            personal finance issues.
          </p>
        </div>
      </div>
    </div>
  );
}