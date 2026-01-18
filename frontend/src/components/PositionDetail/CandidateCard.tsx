import React from 'react';
import { Card } from 'react-bootstrap';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import './CandidateCard.css';

interface CandidateCardProps {
  candidate: {
    fullName: string;
    averageScore: number;
    id?: number;
    applicationId?: number;
  };
  stepId: number;
}

const CandidateCard: React.FC<CandidateCardProps> = React.memo(({ candidate, stepId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `candidate-${candidate.id || candidate.applicationId || candidate.fullName}`,
    data: {
      candidate,
      stepId,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`candidate-card ${isDragging ? 'dragging' : ''}`}
    >
      <Card.Body className="p-2">
        <Card.Title className="h6 mb-1">{candidate.fullName}</Card.Title>
        <Card.Text className="mb-0 text-muted small">
          Puntuación: {candidate.averageScore.toFixed(1)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
});

CandidateCard.displayName = 'CandidateCard';

export default CandidateCard;
