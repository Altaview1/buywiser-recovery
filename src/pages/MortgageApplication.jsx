import { useEffect } from "react";

export default function MortgageApplication() {
  useEffect(() => {
    window.location.href = "https://www.blink.mortgage/app/signup/p/Buywiser/bennettliss?campaign=BennettLiss";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-slate-600">Redirecting to mortgage application...</p>
    </div>
  );
}