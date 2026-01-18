import React, { useMemo } from 'react';
import { Card } from 'react-bootstrap';
import { Star, StarFill, StarHalf } from 'react-bootstrap-icons';
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

  // Convertir puntuación de 1-10 a estrellas (0-5)
  // Dividir entre 2: 10 = 5 estrellas, 5 = 2.5 estrellas, etc.
  const stars = useMemo(() => {
    const scoreOutOf5 = candidate.averageScore / 2;
    const fullStars = Math.floor(scoreOutOf5);
    const hasHalfStar = scoreOutOf5 % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return { fullStars, hasHalfStar, emptyStars };
  }, [candidate.averageScore]);

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
        <div className="d-flex align-items-center gap-1">
          {Array.from({ length: stars.fullStars }).map((_, i) => (
            <StarFill key={`full-${i}`} className="text-warning" size={14} />
          ))}
          {stars.hasHalfStar && (
            <StarHalf className="text-warning" size={14} />
          )}
          {Array.from({ length: stars.emptyStars }).map((_, i) => (
            <Star key={`empty-${i}`} className="text-warning" size={14} />
          ))}
          <span className="text-muted small ms-1">({candidate.averageScore.toFixed(1)})</span>
        </div>
      </Card.Body>
    </Card>
  );
});

CandidateCard.displayName = 'CandidateCard';

export default CandidateCard;
