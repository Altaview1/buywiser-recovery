import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, Clock, X } from "lucide-react";

export default function AppointmentScheduler({ contact, property, onSuccess, onCancel }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSchedule = async () => {
    if (!date || !time) {
      setError("Please select both date and time.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const appointmentDateTime = new Date(`${date}T${time}`).toISOString();
      
      const res = await base44.functions.invoke("issueCouponWithAppointment", {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        propertyAddress: property.address,
        propertyPrice: property.price,
        appointmentDate: appointmentDateTime,
      });

      onSuccess(res.data.couponValue);
    } catch (e) {
      setError("Failed to schedule appointment. Please try again.");
    }

    setLoading(false);
  };

  // Min date is today, max is 30 days out
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <div className="overflow-hidden rounded-sm" style={{ border: "2px solid #003366", borderRadius: 2 }}>
      <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: "#003366" }}>
        <Calendar className="h-4 w-4" style={{ color: "#c9a84c" }} />
        <p style={{ color: "#c9a84c", fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.15em" }} className="font-black uppercase">
          Step 2 — Schedule Your Property Showing
        </p>
      </div>
      <div style={{ height: 2, background: "linear-gradient(90deg, #c9a84c, #e8c050, #c9a84c)" }} />

      <div className="p-4 space-y-3" style={{ background: "#f5f5f0" }}>
        <p style={{ fontSize: 12, color: "#444", fontFamily: "sans-serif", lineHeight: 1.5 }}>
          Select a date and time for your property showing. Bennett will contact you to confirm.
        </p>

        <div>
          <label style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", fontFamily: "sans-serif" }} className="block font-bold uppercase mb-1">
            Preferred Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setError(""); }}
            min={today}
            max={maxDate}
            className="w-full px-3 py-2.5 text-sm transition"
            style={{ border: "2px solid #003366", borderRadius: 2, fontFamily: "sans-serif", outline: "none", background: "white" }}
            onFocus={(e) => e.target.style.borderColor = "#c9a84c"}
            onBlur={(e) => e.target.style.borderColor = "#003366"}
          />
        </div>

        <div>
          <label style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", fontFamily: "sans-serif" }} className="block font-bold uppercase mb-1">
            Preferred Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => { setTime(e.target.value); setError(""); }}
            className="w-full px-3 py-2.5 text-sm transition"
            style={{ border: "2px solid #003366", borderRadius: 2, fontFamily: "sans-serif", outline: "none", background: "white" }}
            onFocus={(e) => e.target.style.borderColor = "#c9a84c"}
            onBlur={(e) => e.target.style.borderColor = "#003366"}
          />
          <p style={{ fontSize: 10, color: "#777", fontFamily: "sans-serif" }} className="mt-1">
            Business hours: 9 AM - 6 PM Pacific Time
          </p>
        </div>

        {error && <p style={{ color: "#b22234", fontSize: 12, fontFamily: "sans-serif" }} className="font-semibold">{error}</p>}

        <button
          onClick={handleSchedule}
          disabled={loading || !date || !time}
          className="w-full py-3.5 font-bold transition"
          style={{
            background: !date || !time ? "#ccc" : "#003366",
            color: !date || !time ? "#999" : "white",
            border: `2px solid ${!date || !time ? "#ccc" : "#c9a84c"}`,
            borderRadius: 2,
            fontFamily: "sans-serif",
            letterSpacing: "0.08em",
            fontSize: 13,
            cursor: !date || !time ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />Scheduling...</span>
            : "Schedule & Get My Coupon →"}
        </button>

        <button
          onClick={onCancel}
          style={{ background: "none", border: "none", color: "#777", fontSize: 12, fontFamily: "sans-serif", cursor: "pointer", padding: 0, textDecoration: "underline" }}
        >
          ← Back to contact information
        </button>
      </div>
    </div>
  );
}