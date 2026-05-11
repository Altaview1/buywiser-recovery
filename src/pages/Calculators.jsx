import { useState } from "react";
import { usePageTitle } from "@/lib/usePageTitle";
import { Calculator, DollarSign, Percent, TrendingDown, Home, BarChart, Zap, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const calculatorTypes = [
  { id: "mortgage", icon: Calculator, label: "Mortgage Calculator" },
  { id: "refinance", icon: TrendingDown, label: "Refinance Calculator" },
  { id: "afford", icon: Home, label: "How much can I afford?" },
  { id: "extra", icon: DollarSign, label: "Extra Payment Calculator" },
  { id: "principal", icon: BarChart, label: "Principal Calculator" },
  { id: "apr", icon: Percent, label: "What's my APR?" },
  { id: "smartbuy", icon: Zap, label: "SmartBuy™ Savings" },
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
        <div><Label>Home Price ($)</Label><Input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} /></div>
        <div><Label>Down Payment ($)</Label><Input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} /></div>
        <div><Label>Interest Rate (%)</Label><Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></div>
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
          <div className="bg-green-50 rounded-xl p-4 text-center"><p className="text-xs text-slate-500 mb-1">Monthly Payment</p><p className="text-2xl font-bold text-green-700">${Number(result.monthly).toLocaleString()}</p></div>
          <div className="bg-slate-50 rounded-xl p-4 text-center"><p className="text-xs text-slate-500 mb-1">Loan Amount</p><p className="text-lg font-bold text-slate-700">${Number(result.principal).toLocaleString()}</p></div>
          <div className="bg-slate-50 rounded-xl p-4 text-center"><p className="text-xs text-slate-500 mb-1">Total Interest</p><p className="text-lg font-bold text-slate-700">${Number(result.totalInterest).toLocaleString()}</p></div>
          <div className="bg-slate-50 rounded-xl p-4 text-center"><p className="text-xs text-slate-500 mb-1">Total Cost</p><p className="text-lg font-bold text-slate-700">${Number(result.total).toLocaleString()}</p></div>
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
    setResult({ maxHome: (maxLoan + down).toFixed(0), maxPayment: maxPayment.toFixed(2), maxLoan: maxLoan.toFixed(0) });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div><Label>Annual Household Income ($)</Label><Input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} /></div>
        <div><Label>Monthly Debt Payments ($)</Label><Input type="number" value={debt} onChange={(e) => setDebt(Number(e.target.value))} /></div>
        <div><Label>Down Payment ($)</Label><Input type="number" value={down} onChange={(e) => setDown(Number(e.target.value))} /></div>
        <div><Label>Interest Rate (%)</Label><Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></div>
      </div>
      <Button onClick={calculate} className="bg-green-600 hover:bg-green-700 text-white px-8">Calculate</Button>
      {result && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-xl p-4 text-center"><p className="text-xs text-slate-500 mb-1">Max Home Price</p><p className="text-2xl font-bold text-green-700">${Number(result.maxHome).toLocaleString()}</p></div>
          <div className="bg-slate-50 rounded-xl p-4 text-center"><p className="text-xs text-slate-500 mb-1">Max Monthly Payment</p><p className="text-lg font-bold text-slate-700">${Number(result.maxPayment).toLocaleString()}</p></div>
          <div className="bg-slate-50 rounded-xl p-4 text-center"><p className="text-xs text-slate-500 mb-1">Max Loan Amount</p><p className="text-lg font-bold text-slate-700">${Number(result.maxLoan).toLocaleString()}</p></div>
        </div>
      )}
    </div>
  );
}

// Token costs as % of savings pool
const SMARTBUY_SERVICES = [
  { id: "appraisal_standard", label: "Standard Appraisal Coordination", category: "Appraisal", pct: 0.035 },
  { id: "appraisal_rush", label: "Rush Appraisal Coordination", category: "Appraisal", pct: 0.05 },
  { id: "appraisal_rov", label: "Reconsideration of Value", category: "Appraisal", pct: 0.02 },
  { id: "inspection_pool", label: "Pool & Spa Inspection", category: "Inspection", pct: 0.02 },
  { id: "inspection_foundation", label: "Foundation Inspection", category: "Inspection", pct: 0.025 },
  { id: "inspection_sewer", label: "Sewer Scope", category: "Inspection", pct: 0.02 },
  { id: "inspection_roof", label: "Roof Inspection", category: "Inspection", pct: 0.02 },
  { id: "inspection_pest", label: "Pest Inspection", category: "Inspection", pct: 0.015 },
  { id: "inspection_hvac", label: "HVAC Inspection", category: "Inspection", pct: 0.015 },
  { id: "inspection_mold", label: "Mold Inspection", category: "Inspection", pct: 0.02 },
  { id: "moving_standard", label: "Moving Service Coordination", category: "Moving", pct: 0.02 },
  { id: "moving_premium", label: "Premium Movers", category: "Moving", pct: 0.035 },
  { id: "moving_packing", label: "Packing Assistance", category: "Moving", pct: 0.02 },
  { id: "cleaning_move_in", label: "Move-In Cleaning", category: "Cleaning", pct: 0.015 },
  { id: "cleaning_move_out", label: "Move-Out Cleaning", category: "Cleaning", pct: 0.015 },
  { id: "cleaning_deep", label: "Deep Cleaning Service", category: "Cleaning", pct: 0.025 },
  { id: "mortgage_guidance", label: "Mortgage Consultation (Bennett)", category: "Mortgage", pct: 0.08 },
  { id: "offer_strategy", label: "Offer Strategy Review", category: "Strategy", pct: 0.10 },
  { id: "legal_review", label: "Real Estate Legal Review", category: "Legal", pct: 0.09 },
  { id: "buyer_agent", label: "Buyer Agent Support", category: "Agent", pct: 0.12 },
];

const CATEGORY_COLORS = {
  Appraisal: "bg-purple-100 text-purple-700",
  Inspection: "bg-blue-100 text-blue-700",
  Moving: "bg-orange-100 text-orange-700",
  Cleaning: "bg-cyan-100 text-cyan-700",
  Mortgage: "bg-amber-100 text-amber-700",
  Strategy: "bg-emerald-100 text-emerald-700",
  Legal: "bg-indigo-100 text-indigo-700",
  Agent: "bg-rose-100 text-rose-700",
};

function SmartBuySavingsCalc() {
  const [price, setPrice] = useState(750000);
  const [selected, setSelected] = useState([]);

  const savingsPool = Math.round(price * 0.025);
  const totalTokenCost = selected.reduce((sum, id) => {
    const svc = SMARTBUY_SERVICES.find(s => s.id === id);
    return sum + Math.round(savingsPool * (svc?.pct || 0));
  }, 0);
  const netSavings = savingsPool - totalTokenCost;

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const fmt = (n) => Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div>
      {/* Price slider */}
      <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-700">Purchase Price</label>
          <span className="text-xl font-black text-slate-900">{fmt(price)}</span>
        </div>
        <input type="range" min={300000} max={3000000} step={25000} value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="w-full" style={{ accentColor: "#059669" }} />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>$300K</span><span>$3M</span></div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
          <span className="text-xs text-slate-500">SmartBuy™ Savings Pool (2.5% of price)</span>
          <span className="text-lg font-black text-emerald-700">{fmt(savingsPool)}</span>
        </div>
      </div>

      {/* Service selector */}
      <p className="text-sm font-semibold text-slate-700 mb-3">Select the services you plan to use:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {SMARTBUY_SERVICES.map(svc => {
          const cost = Math.round(savingsPool * svc.pct);
          const isOn = selected.includes(svc.id);
          return (
            <button key={svc.id} onClick={() => toggle(svc.id)}
              className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl border text-left transition ${isOn ? "bg-emerald-50 border-emerald-400" : "bg-white border-slate-200 hover:border-emerald-200"}`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${isOn ? "bg-emerald-500 border-emerald-500" : "border-slate-300"}`}>
                  {isOn && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 leading-tight truncate">{svc.label}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${CATEGORY_COLORS[svc.category]}`}>{svc.category}</span>
                </div>
              </div>
              <span className={`text-xs font-black flex-shrink-0 ${isOn ? "text-emerald-700" : "text-slate-400"}`}>
                {isOn ? `−${fmt(cost)}` : fmt(cost)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">Total Savings Pool</p>
          <p className="text-2xl font-black text-slate-800">{fmt(savingsPool)}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">Services Cost ({selected.length} selected)</p>
          <p className="text-2xl font-black text-amber-700">−{fmt(totalTokenCost)}</p>
        </div>
        <div className={`rounded-xl p-4 text-center border ${netSavings >= 0 ? "bg-emerald-50 border-emerald-300" : "bg-red-50 border-red-200"}`}>
          <p className="text-xs text-slate-500 mb-1">Net to You at Closing</p>
          <p className={`text-2xl font-black ${netSavings >= 0 ? "text-emerald-700" : "text-red-600"}`}>{fmt(netSavings)}</p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <a href="/smartbuy" className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm rounded-xl transition">
          <Zap className="h-3.5 w-3.5" /> Activate My SmartBuy™ Account
        </a>
      </div>
    </div>
  );
}

export default function Calculators() {
  usePageTitle('Mortgage Calculators | BuyWiser Home Loans');
  const [activeCalc, setActiveCalc] = useState("mortgage");

  return (
    <div>
      <div className="h-56 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-800/50" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-800 text-center mb-10">Mortgage Calculators</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          {calculatorTypes.map((calc) => (
            <button key={calc.id} onClick={() => setActiveCalc(calc.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${activeCalc === calc.id ? "bg-green-50 border-green-300 shadow-sm" : "bg-white border-slate-200 hover:border-green-200 hover:bg-green-50/50"}`}>
              <calc.icon className={`h-7 w-7 ${activeCalc === calc.id ? "text-green-600" : "text-slate-400"}`} />
              <span className={`text-xs text-center font-medium ${activeCalc === calc.id ? "text-green-700" : "text-slate-600"}`}>{calc.label}</span>
            </button>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">{calculatorTypes.find((c) => c.id === activeCalc)?.label}</h2>
          {(activeCalc === "mortgage" || activeCalc === "refinance" || activeCalc === "extra" || activeCalc === "principal" || activeCalc === "apr") && <MortgageCalc />}
          {activeCalc === "afford" && <AffordabilityCalc />}
          {activeCalc === "smartbuy" && <SmartBuySavingsCalc />}
        </div>
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong>Disclaimer:</strong> Information and interactive calculators are made available as self-help tools for your independent use and are not intended to provide investment advice. All examples are hypothetical and for illustrative purposes. We encourage you to seek personalized advice from qualified professionals.
          </p>
        </div>
      </div>
    </div>
  );
}