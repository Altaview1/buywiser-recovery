import { useState, useEffect } from 'react';
import { X, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const PIPELINE_STAGES = [
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'interested', label: 'Interested' },
  { id: 'meeting_set', label: 'Meeting Set' },
  { id: 'closed', label: 'Closed' },
];

export default function BulkActionToolbar({ selectedLeadIds, leads, onClose, onSuccess }) {
  const [activators, setActivators] = useState([]);
  const [loadingActivators, setLoadingActivators] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showStageMenu, setShowStageMenu] = useState(false);
  const [showActivatorMenu, setShowActivatorMenu] = useState(false);

  useEffect(() => {
    loadActivators();
  }, []);

  const loadActivators = async () => {
    try {
      const data = await base44.entities.FieldActivator.list();
      setActivators(data);
    } catch (err) {
      console.error('Error loading activators:', err);
    } finally {
      setLoadingActivators(false);
    }
  };

  const handleBulkUpdateStage = async (stage) => {
    setUpdating(true);
    try {
      await Promise.all(
        selectedLeadIds.map(leadId =>
          base44.asServiceRole.entities.ActivatorLead.update(leadId, {
            pipeline_stage: stage,
          })
        )
      );
      setShowStageMenu(false);
      onSuccess();
    } catch (err) {
      console.error('Error updating stages:', err);
      alert('Failed to update lead stages');
    } finally {
      setUpdating(false);
    }
  };

  const handleBulkAssignActivator = async (activatorId) => {
    setUpdating(true);
    try {
      await Promise.all(
        selectedLeadIds.map(leadId =>
          base44.asServiceRole.entities.ActivatorLead.update(leadId, {
            activator_id: activatorId,
          })
        )
      );
      setShowActivatorMenu(false);
      onSuccess();
    } catch (err) {
      console.error('Error assigning activators:', err);
      alert('Failed to assign activators');
    } finally {
      setUpdating(false);
    }
  };

  const selectedLeadsData = leads.filter(l => selectedLeadIds.includes(l.id));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">
              {selectedLeadIds.length} lead{selectedLeadIds.length !== 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedLeadsData.map(l => l.first_name).join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Change Stage Button */}
          <div className="relative">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowStageMenu(!showStageMenu)}
              disabled={updating}
            >
              {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Change Status
              <ChevronDown className="h-4 w-4" />
            </Button>
            {showStageMenu && !updating && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg p-2 w-48 z-50">
                {PIPELINE_STAGES.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => handleBulkUpdateStage(stage.id)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition"
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Assign Activator Button */}
          <div className="relative">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowActivatorMenu(!showActivatorMenu)}
              disabled={updating || loadingActivators}
            >
              {updating || loadingActivators ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Assign To
              <ChevronDown className="h-4 w-4" />
            </Button>
            {showActivatorMenu && !updating && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg p-2 w-56 z-50 max-h-64 overflow-y-auto">
                {activators.length > 0 ? (
                  activators.map(activator => (
                    <button
                      key={activator.id}
                      onClick={() => handleBulkAssignActivator(activator.id)}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition"
                    >
                      <p className="font-medium">{activator.name}</p>
                      <p className="text-xs text-slate-500">{activator.assigned_area}</p>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs text-slate-500">No activators available</p>
                )}
              </div>
            )}
          </div>

          {/* Clear Selection Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={updating}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}