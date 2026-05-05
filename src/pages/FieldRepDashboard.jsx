import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { LogOut, AlertCircle } from "lucide-react";
import FieldRepLoginGate from "@/components/field-rep/FieldRepLoginGate";
import FieldRepHeader from "@/components/field-rep/FieldRepHeader";
import AssignedLeadsList from "@/components/field-rep/AssignedLeadsList";
import LeadDetailView from "@/components/field-rep/LeadDetailView";
import DailyChecklist from "@/components/field-rep/DailyChecklist";

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <FieldRepHeader rep={rep} onLogout={handleLogout} />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-200 bg-white rounded-t-lg px-4">
            {[
              { id: "leads", label: "Assigned Leads" },
              { id: "checklist", label: "Daily Checklist" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-bold rounded-t-lg transition ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 border-b-2"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                style={
                  activeTab === tab.id
                    ? { borderBottomColor: NAVY }
                    : undefined
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="bg-white rounded-b-lg p-4">
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
            ) : (
              <DailyChecklist leads={leads} rep={rep} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}