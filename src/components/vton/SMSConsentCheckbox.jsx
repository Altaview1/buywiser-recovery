import { Link } from "react-router-dom";

export default function SMSConsentCheckbox({ checked, onChange, error }) {
  return (
    <div className="mt-2">
      <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border-2 transition ${
        error ? "border-red-400 bg-red-50" : checked ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
      }`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-blue-600 cursor-pointer"
        />
        <span className="text-xs text-slate-700 leading-relaxed">
          By checking this box, you agree to receive SMS messages related to Veteran NextHome GAP Benefits, appointment reminders, benefit review scheduling, and related communications from Buywiser/VTON™. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for assistance.
        </span>
      </label>
      {error && <p className="text-red-500 text-xs mt-1 pl-1">{error}</p>}
    </div>
  );
}

export function FormFooter() {
  return (
    <div className="mt-4 space-y-3">
      <p className="text-xs text-slate-500 text-center leading-relaxed">
        By submitting this form, you acknowledge and agree to our{" "}
        <Link to="/terms" className="underline text-blue-600 hover:text-blue-800">Terms &amp; Conditions</Link>
        {" "}and{" "}
        <Link to="/privacy" className="underline text-blue-600 hover:text-blue-800">Privacy Policy</Link>.
      </p>
    </div>
  );
}

export function SubmissionSuccess() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
      <div className="text-3xl mb-3">🎖️</div>
      <h3 className="font-bold text-green-800 text-base mb-2">Request Received</h3>
      <p className="text-green-700 text-sm leading-relaxed">
        Thank you. Your request has been received. A VTON™ representative may contact you regarding your Veteran NextHome GAP Benefit Review. Reply STOP at any time to opt out of SMS communications.
      </p>
    </div>
  );
}