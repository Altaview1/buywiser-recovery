import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { LogOut, AlertCircle } from "lucide-react";
import FieldRepLoginGate from "@/components/field-rep/FieldRepLoginGate";
import FieldRepHeader from "@/components/field-rep/FieldRepHeader";
import AssignedLeadsList from "@/components/field-rep/AssignedLeadsList";
import LeadDetailView from "@/components/field-rep/LeadDetailView";
import DailyChecklist from "@/components/field-rep/DailyChecklist";
import BulkLeadImport from "@/components/field-rep/BulkLeadImport";

const NAVY = "#0B1F3B";

export default function FieldRepDashboard() {
  const [rep, setRep] = useState(null);
  const [leads, setLeads] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeTab, setActiveTab] = useState("leads");

  useEffect(() => {
    const init = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        setLoading(false);
        return;
      }

      const user = await base44.auth.me();
      const activators = await base44.entities.FieldActivator.filter({
        email: user.email,
        status: "active",
      });

      if (activators.length > 0) {
        const a = activators[0];
        setRep(a);
        fetchData(a);
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchData = async (activator) => {
    setLoading(true);
    const [leadsData, visitsData] = await Promise.all([
      base44.entities.ActivatorLead.filter(
        { rep_code: activator.rep_code },
        "-created_date",
        100
      ),
      base44.entities.Visit.filter(
        { activator_id: activator.id },
        "-visit_date",
        100
      ),
    ]);
    setLeads(leadsData);
    setVisits(visitsData);
    setLoading(false);
  };

  const handleLogout = () => {
    setRep(null);
    setLeads([]);
    setVisits([]);
    setSelectedLead(null);
  };

  if (!rep) {
    return <FieldRepLoginGate onSuccess={setRep} isLoading={loading} />;
  }

  if (selectedLead) {
    return (
      <LeadDetailView
        lead={selectedLead}
        rep={rep}
        visits={visits}
        onBack={() => setSelectedLead(null)}
        onRefresh={() => rep && fetchData(rep)}
      />
    );
  }

  const unvisitedCount = leads.filter(l => !visits.some(v => v.lead_id === l.id)).length;
  const todayCount = visits.filter(v => new Date(v.visit_date).toDateString() === new Date().toDateString()).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <FieldRepHeader rep={rep} onLogout={handleLogout} />

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Quick Stats Bar - Mobile Prominent */}
          <div className="grid grid-cols-3 gap-2 bg-white rounded-xl p-3 border border-slate-200 sticky top-0 z-10">
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800">{unvisitedCount}</p>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Unvisited</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-green-700">{todayCount}</p>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-blue-700">{leads.length}</p>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Assigned</p>
            </div>
          </div>

          {/* Tabs - Full Width on Mobile */}
          <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1 overflow-x-auto">
            {[
              { id: "leads", label: "📍 Leads", emoji: true },
              { id: "checklist", label: "✅ Checklist", emoji: true },
              { id: "import", label: "📥 Import", emoji: true },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-800"
                }`}
                style={
                  activeTab === tab.id
                    ? { background: NAVY }
                    : undefined
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
              </div>
            ) : activeTab === "leads" ? (
              <AssignedLeadsList
                leads={leads}
                visits={visits}
                onSelectLead={setSelectedLead}
              />
            ) : activeTab === "checklist" ? (
              <DailyChecklist
                leads={leads}
                rep={rep}
                selectedLead={selectedLead}
                onChecklistComplete={() => {
                  // After completing, show next lead hint
                  alert("Great job! Move to the next property when ready.");
                }}
              />
            ) : (
              <BulkLeadImport repCode={rep.rep_code} onSuccess={() => fetchData(rep)} />
            )}
          </div>
        </div>
      </div>

      {/* Floating CTA for Leads Tab */}
      {activeTab === "leads" && unvisitedCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-20 px-4 py-3 rounded-full bg-red-500 text-white font-bold text-sm shadow-lg text-center">
          🔴 {unvisitedCount} unvisited — start logging
        </div>
      )}
    </div>
  );
}