import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles } from "lucide-react";

export default function StickyBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-2.5 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm font-medium">
        <Sparkles className="h-4 w-4 text-yellow-300 flex-shrink-0" />
        <span>
          Apply through{" "}
          <Link to="/MortgageAI" className="font-bold underline underline-offset-2 hover:text-yellow-200 transition">
            Mortgage AI
          </Link>{" "}
          and save up to{" "}
          <span className="font-bold text-yellow-300">$5,000</span> on closing costs
        </span>
        <Link
          to="/MortgageAI"
          className="hidden sm:inline-flex ml-2 px-3 py-1 bg-amber-400 text-blue-900 rounded-full text-xs font-bold hover:bg-amber-300 transition flex-shrink-0"
        >
          Start Now →
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}