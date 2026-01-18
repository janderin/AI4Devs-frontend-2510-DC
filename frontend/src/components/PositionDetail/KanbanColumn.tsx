import React from 'react';
import { Card } from 'react-bootstrap';
import { useDroppable } from '@dnd-kit/core';
import CandidateCard from './CandidateCard';
import './KanbanColumn.css';

interface Candidate {
  fullName: string;
  averageScore: number;
  currentInterviewStep: string;
  id?: number;
  applicationId?: number;
}

interface KanbanColumnProps {
  step: {
    id: number;
    name: string;
    orderIndex: number;
  };
  candidates: Candidate[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(({ step, candidates }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `step-${step.id}`,
  });

  return (
    <div className="kanban-column">
      <Card className={`h-100 ${isOver ? 'drop-target' : ''}`}>
        <Card.Header className="kanban-column-header">
          <h6 className="mb-0">{step.name}</h6>
          <span className="badge bg-secondary">{candidates.length}</span>
        </Card.Header>
        <Card.Body
          ref={setNodeRef}
          className="kanban-column-body"
          style={{ minHeight: '200px' }}
        >
          {candidates.length === 0 ? (
            <div className="text-muted text-center small py-3">
              Sin candidatos
            </div>
          ) : (
            candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id || candidate.applicationId || candidate.fullName}
                candidate={candidate}
                stepId={step.id}
              />
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
});

KanbanColumn.displayName = 'KanbanColumn';

export default KanbanColumn;
