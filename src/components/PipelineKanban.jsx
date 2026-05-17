import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Loader2 } from 'lucide-react';
import LeadDetailModal from './LeadDetailModal';

const PIPELINE_STAGES = [
  { id: 'new', label: 'New', color: 'bg-slate-50 border-slate-200' },
  { id: 'contacted', label: 'Contacted', color: 'bg-blue-50 border-blue-200' },
  { id: 'interested', label: 'Interested', color: 'bg-green-50 border-green-200' },
  { id: 'meeting_set', label: 'Meeting Set', color: 'bg-amber-50 border-amber-200' },
  { id: 'closed', label: 'Closed', color: 'bg-purple-50 border-purple-200' },
];

function KanbanCard({ lead, index, isDragging }) {
  return (
    <div
      className={`p-3 bg-white rounded-lg border-2 border-slate-200 cursor-move transition-all ${
        isDragging ? 'opacity-50 shadow-lg' : 'hover:shadow-md'
      }`}
    >
      <p className="font-semibold text-sm text-slate-900">{lead.first_name} {lead.last_name || ''}</p>
      <p className="text-xs text-slate-500 mt-1">{lead.property_address}</p>
      {lead.estimated_equity && (
        <p className="text-xs text-slate-600 mt-1">Equity: ${(lead.estimated_equity / 1000).toFixed(0)}K</p>
      )}
      {lead.interaction_notes?.length > 0 && (
        <p className="text-xs text-blue-600 mt-2">
          {lead.interaction_notes.length} interaction{lead.interaction_notes.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

export default function PipelineKanban() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [updatingLead, setUpdatingLead] = useState(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await base44.entities.ActivatorLead.list();
      setLeads(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading leads:', err);
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { draggableId, destination } = result;

    if (!destination) return;

    const leadId = draggableId.replace('lead-', '');
    const lead = leads.find(l => l.id === leadId);

    if (!lead || lead.pipeline_stage === destination.droppableId) return;

    setUpdatingLead(leadId);

    try {
      await base44.asServiceRole.entities.ActivatorLead.update(leadId, {
        pipeline_stage: destination.droppableId
      });
      
      setLeads(leads.map(l => 
        l.id === leadId ? { ...l, pipeline_stage: destination.droppableId } : l
      ));
    } catch (err) {
      console.error('Error updating lead:', err);
      alert('Failed to update lead stage');
    } finally {
      setUpdatingLead(null);
    }
  };

  const leadsByStage = {};
  PIPELINE_STAGES.forEach(stage => {
    leadsByStage[stage.id] = leads.filter(l => (l.pipeline_stage || 'new') === stage.id);
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-500 text-sm">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  if (selectedLead) {
    return (
      <LeadDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Lead Pipeline</h1>
          <p className="text-slate-600 text-sm mt-2">Drag cards to move leads through stages</p>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PIPELINE_STAGES.map(stage => (
              <Droppable key={stage.id} droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-lg border-2 p-4 min-h-[600px] ${stage.color} ${
                      snapshot.isDraggingOver ? 'bg-opacity-50 ring-2 ring-blue-400' : ''
                    }`}
                  >
                    <h2 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">
                      {stage.label}
                      <span className="ml-2 text-xs font-normal text-slate-500">
                        ({leadsByStage[stage.id].length})
                      </span>
                    </h2>

                    <div className="space-y-3">
                      {leadsByStage[stage.id].map((lead, index) => (
                        <Draggable
                          key={lead.id}
                          draggableId={`lead-${lead.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedLead(lead)}
                              className="cursor-pointer"
                            >
                              <KanbanCard
                                lead={lead}
                                index={index}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}