import React, { useMemo, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { toast } from 'react-hot-toast';
import { InterviewStep, Candidate, updateCandidateStage } from '../../services/positionService';
import KanbanColumn from './KanbanColumn';
import CandidateCard from './CandidateCard';
import './KanbanBoard.css';

interface KanbanBoardProps {
  interviewSteps: InterviewStep[];
  candidates: Candidate[];
  stepNameToIdMap: Map<string, number>;
  onCandidateMove: (candidateId: number, newStepId: number) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  interviewSteps, 
  candidates, 
  stepNameToIdMap,
  onCandidateMove 
}) => {
  const [activeCandidate, setActiveCandidate] = React.useState<Candidate | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requiere 8px de movimiento para activar drag
      },
    })
  );

  // Agrupar candidatos por fase
  const candidatesByStep = useMemo(() => {
    const grouped = new Map<number, Candidate[]>();
    
    // Inicializar todas las fases
    interviewSteps.forEach(step => {
      grouped.set(step.id, []);
    });

    // Agrupar candidatos
    candidates.forEach(candidate => {
      const stepId = stepNameToIdMap.get(candidate.currentInterviewStep);
      if (stepId !== undefined) {
        const stepCandidates = grouped.get(stepId) || [];
        stepCandidates.push({
          ...candidate,
          id: candidate.id || candidate.applicationId,
          applicationId: candidate.applicationId || candidate.id,
        });
        grouped.set(stepId, stepCandidates);
      }
    });

    return grouped;
  }, [candidates, interviewSteps, stepNameToIdMap]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { data } = event.active;
    if (data?.current?.candidate) {
      setActiveCandidate(data.current.candidate);
    }
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveCandidate(null);
    
    const { active, over } = event;

    if (!over) {
      return;
    }

    const candidateData = active.data.current?.candidate as Candidate | undefined;
    const targetStepId = parseInt(over.id.toString().replace('step-', ''));

    if (!candidateData || isNaN(targetStepId)) {
      return;
    }

    const candidateId = candidateData.id || candidateData.applicationId;
    if (!candidateId) {
      toast.error('Error: No se pudo identificar el candidato');
      return;
    }

    // Verificar si el candidato ya está en esta fase
    const currentStepId = stepNameToIdMap.get(candidateData.currentInterviewStep);
    if (currentStepId === targetStepId) {
      return; // No hacer nada si está en la misma fase
    }

    // Actualización optimista
    onCandidateMove(candidateId, targetStepId);

    // Llamada a la API
    try {
      await updateCandidateStage(candidateId.toString(), targetStepId);
      toast.success('Candidato movido exitosamente');
    } catch (error: any) {
      // Rollback en caso de error
      const originalStepId = currentStepId || targetStepId;
      onCandidateMove(candidateId, originalStepId);
      toast.error(error.message || 'Error al mover el candidato');
    }
  }, [onCandidateMove, stepNameToIdMap]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {interviewSteps.map((step) => (
          <KanbanColumn
            key={step.id}
            step={step}
            candidates={candidatesByStep.get(step.id) || []}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCandidate ? (
          <CandidateCard candidate={activeCandidate} stepId={0} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
