import { useState } from "react";
import { ArrowRight, Heart } from "lucide-react";

const SAMPLE_HOMES = [
  { id: 1, address: "456 Oak Ave, Los Angeles CA", price: 750000, beds: 3, baths: 2, sqft: 2100 },
  { id: 2, address: "789 Maple St, Los Angeles CA", price: 825000, beds: 4, baths: 3, sqft: 2500 },
  { id: 3, address: "321 Cedar Ln, Los Angeles CA", price: 695000, beds: 3, baths: 2, sqft: 1950 },
];

export default function PropertySearchStage({ purchasePrice, savingsPool, onNext }) {
  const [saved, setSaved] = useState([]);
  const [selectedHome, setSelectedHome] = useState(null);

  const toggleSave = (id) => {
    setSaved(saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]);
  };

  return (
    <div className="min-h-screen bg-white p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-8 rounded-full bg-slate-300 text-white flex items-center justify-center text-xs font-black">✓</div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">2</div>
            <span className="text-xs font-black uppercase text-slate-600">Property Search</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Find Your Home</h1>
          <p className="text-base text-slate-600">Browse homes within your budget. Save properties to compare.</p>
        </div>

        {/* Homes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {SAMPLE_HOMES.map(home => (
            <div
              key={home.id}
              onClick={() => setSelectedHome(home.id)}
              className={`border rounded-lg p-4 cursor-pointer transition ${selectedHome === home.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-black text-slate-900">{home.address}</p>
                  <p className="text-xs text-slate-500 mt-1">{home.beds} bed · {home.baths} bath · {home.sqft.toLocaleString()} sqft</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); toggleSave(home.id); }}
                  className={`${saved.includes(home.id) ? 'text-red-500' : 'text-slate-300'}`}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </button>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-900">${(home.price / 1000000).toFixed(1)}M</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">SmartBuy Pool</p>
                  <p className="text-sm font-black text-emerald-600">${(home.price * 0.025).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
          <p className="text-sm text-amber-900">
            <span className="font-black">📌 Smart Searching:</span> Touring fewer, more qualified homes may preserve more SmartBuy™ savings. Use AI guidance to prioritize.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => selectedHome && onNext({ selectedHome: SAMPLE_HOMES.find(h => h.id === selectedHome) })}
          disabled={!selectedHome}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700 transition disabled:opacity-40"
        >
          Schedule Tour <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}