import { useState } from "react";
import { Calendar, Clock, AlertCircle, CheckCircle, MapPin, Phone } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const DOOR_KNOCK_OUTCOMES = [
  {
    value: "packet_left_visit_1",
    label: "Visit 1: Left Packet",
    description: "Left benefit packet at door. Homeowner not home.",
    requiresDate: true,
    strikeCount: 1,
    earnBack: false,
  },
  {
    value: "packet_left_visit_2",
    label: "Visit 2: Left Packet",
    description: "Second visit — left packet again. Homeowner not home.",
    requiresDate: true,
    strikeCount: 2,
    earnBack: false,
  },
  {
    value: "packet_left_visit_3",
    label: "Visit 3: Left Packet (Final)",
    description: "Third and final visit. Left packet. Packet contains QR code — if scanned, counts as verification.",
    requiresDate: true,
    strikeCount: 3,
    earnBack: false,
  },
  {
    value: "had_conversation",
    label: "Had Conversation",
    description: "Spoke with homeowner directly about Veteran's Next Home™ benefit. QR code shown/discussed.",
    requiresDate: false,
    strikeCount: 0,
    earnBack: true,
  },
  {
    value: "qr_scanned",
    label: "QR Code Scanned",
    description: "Homeowner scanned QR code from packet and viewed personalized benefit page.",
    requiresDate: false,
    strikeCount: 0,
    earnBack: true,
  },
  {
    value: "consultation_booked",
    label: "Consultation Scheduled",
    description: "Homeowner scheduled appointment after conversation or QR scan.",
    requiresDate: false,
    strikeCount: 0,
    earnBack: true,
  },
];

export default function DoorKnockOutcomeLogger({ opp, onOutcomeSelect }) {
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [followUpDate, setFollowUpDate] = useState("");
  const [reminderTime, setReminderTime] = useState("09:00");
  const [showCalendarOption, setShowCalendarOption] = useState(false);

  const currentOutcome = DOOR_KNOCK_OUTCOMES.find(o => o.value === selectedOutcome);
  const visitsLogged = [
    opp.crm_notes?.includes("Visit 1") ? 1 : 0,
    opp.crm_notes?.includes("Visit 2") ? 1 : 0,
    opp.crm_notes?.includes("Visit 3") ? 1 : 0,
  ].reduce((a, b) => a + b, 0);
  const strikeStatus = visitsLogged >= 3 ? "three-strikes" : visitsLogged > 0 ? `${visitsLogged}-of-3` : "no-visits";

  const handleOutcomeSelect = (outcomeValue) => {
    setSelectedOutcome(outcomeValue);
    if (!DOOR_KNOCK_OUTCOMES.find(o => o.value === outcomeValue).requiresDate) {
      setFollowUpDate("");
      setShowCalendarOption(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOutcome) return;

    const outcome = DOOR_KNOCK_OUTCOMES.find(o => o.value === selectedOutcome);
    const timestamp = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
    
    let noteEntry = `[${timestamp}] ${outcome.label}\n${outcome.description}`;
    if (followUpDate) {
      noteEntry += `\nScheduled follow-up: ${followUpDate}`;
      if (reminderTime) noteEntry += ` @ ${reminderTime}`;
    }

    // Call parent with outcome data
    onOutcomeSelect({
      outcome: selectedOutcome,
      notes: noteEntry,
      qrScanned: selectedOutcome === "qr_scanned",
      followUpDate: followUpDate || null,
      reminderTime: reminderTime || null,
    });

    // Reset
    setSelectedOutcome(null);
    setFollowUpDate("");
    setReminderTime("09:00");
    setShowCalendarOption(false);
  };

  return (
    <div className="space-y-4 bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-700">
          <p className="font-bold">3-Strike Door-Knock Protocol</p>
          <p className="mt-0.5 leading-relaxed">Three visits permitted. Conversations or QR scans count as verified actions earning $200 deposit credit.</p>
          <p className="mt-1 text-blue-600 font-semibold">Visits logged: {visitsLogged} of 3</p>
        </div>
      </div>

      {/* Door knock visits progress */}
      <div className="flex gap-2">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={`flex-1 py-2 px-3 rounded-lg text-center text-xs font-bold ${
              visitsLogged >= i
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-slate-100 text-slate-500 border border-slate-200"
            }`}
          >
            Visit {i}
          </div>
        ))}
      </div>

      {/* Outcome options */}
      <div className="space-y-2">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Log Outcome</label>
        <div className="grid grid-cols-1 gap-2">
          {DOOR_KNOCK_OUTCOMES.map(outcome => {
            // Disable subsequent packet visits if already at 3 strikes
            const isDisabled = strikeStatus === "three-strikes" && outcome.strikeCount > 0;
            
            return (
              <button
                key={outcome.value}
                onClick={() => handleOutcomeSelect(outcome.value)}
                disabled={isDisabled}
                className={`text-left p-3 rounded-lg border transition ${
                  selectedOutcome === outcome.value
                    ? "bg-slate-800 text-white border-slate-800"
                    : isDisabled
                    ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-bold">{outcome.label}</p>
                    <p className="text-xs mt-0.5 opacity-75">{outcome.description}</p>
                  </div>
                  {outcome.earnBack && (
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold whitespace-nowrap">
                      $200 ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Follow-up date if selected outcome requires it */}
      {selectedOutcome && currentOutcome?.requiresDate && (
        <div className="space-y-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <label className="block text-xs font-bold text-amber-900">Schedule Follow-Up Visit</label>
          <input
            type="date"
            value={followUpDate}
            onChange={e => setFollowUpDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
          />
          {followUpDate && (
            <div className="flex gap-2">
              <input
                type="time"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
              />
              <button
                onClick={() => setShowCalendarOption(!showCalendarOption)}
                className="px-3 py-2 text-xs font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-1"
              >
                <Calendar className="h-3 w-3" /> Add to Calendar
              </button>
            </div>
          )}
          {showCalendarOption && (
            <p className="text-xs text-amber-700 font-semibold">📅 Calendar reminder will be created when you save this outcome.</p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSubmit}
          disabled={!selectedOutcome}
          className="flex-1 px-4 py-2.5 text-xs font-bold rounded-lg text-white transition disabled:opacity-40"
          style={{ background: selectedOutcome ? RED : "#999" }}
        >
          <CheckCircle className="h-3 w-3 inline mr-1" /> Log Outcome
        </button>
      </div>

      {/* Mission-critical rules */}
      <div className="text-xs text-slate-600 space-y-1 border-t border-slate-100 pt-3 mt-3">
        <p className="font-bold text-slate-700">🎯 Execution Rules:</p>
        <ul className="space-y-0.5 ml-2 text-slate-600">
          <li>✓ 3 packet drops allowed (visits 1-3)</li>
          <li>✓ If home on any visit → log conversation immediately</li>
          <li>✓ Conversation OR QR scan = $200 earn-back credit</li>
          <li>✓ Consultation booking after conversation = full rebate completion</li>
          <li>✓ Calendar reminders keep you on schedule</li>
        </ul>
      </div>
    </div>
  );
}