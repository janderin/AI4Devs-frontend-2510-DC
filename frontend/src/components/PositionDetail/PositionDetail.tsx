import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Toaster } from 'react-hot-toast';
import { getInterviewFlow, getCandidates, InterviewStep, Candidate } from '../../services/positionService';
import './PositionDetail.css';

// Lazy loading de componentes secundarios
const KanbanBoard = lazy(() => import('./KanbanBoard'));
const SearchBar = lazy(() => import('./SearchBar'));

interface PositionDetailState {
  positionName: string;
  interviewSteps: InterviewStep[];
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
}

const PositionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<PositionDetailState>({
    positionName: '',
    interviewSteps: [],
    candidates: [],
    loading: true,
    error: null,
  });
  
  const [searchName, setSearchName] = useState('');
  const [minScore, setMinScore] = useState<number | ''>('');
  const [maxScore, setMaxScore] = useState<number | ''>('');

  // Crear mapa de nombre de paso a ID
  const stepNameToIdMap = useMemo(() => {
    const map = new Map<string, number>();
    state.interviewSteps.forEach(step => {
      map.set(step.name, step.id);
    });
    return map;
  }, [state.interviewSteps]);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setState(prev => ({ ...prev, error: 'ID de posición no válido', loading: false }));
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        // Cargar datos en paralelo
        const [interviewFlowData, candidatesData] = await Promise.all([
          getInterviewFlow(id),
          getCandidates(id),
        ]);

        setState({
          positionName: interviewFlowData.positionName,
          interviewSteps: interviewFlowData.interviewFlow.interviewSteps.sort(
            (a, b) => a.orderIndex - b.orderIndex
          ),
          candidates: candidatesData,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          error: error.message || 'Error al cargar los datos',
          loading: false,
        }));
      }
    };

    loadData();
  }, [id]);

  // Filtrar candidatos según búsqueda y puntuación
  const filteredCandidates = useMemo(() => {
    return state.candidates.filter(candidate => {
      // Filtro por nombre
      const matchesName = searchName === '' || 
        candidate.fullName.toLowerCase().includes(searchName.toLowerCase());
      
      // Filtro por puntuación mínima
      const matchesMinScore = minScore === '' || candidate.averageScore >= minScore;
      
      // Filtro por puntuación máxima
      const matchesMaxScore = maxScore === '' || candidate.averageScore <= maxScore;

      return matchesName && matchesMinScore && matchesMaxScore;
    });
  }, [state.candidates, searchName, minScore, maxScore]);

  // Función para actualizar candidato después de drag and drop
  const handleCandidateMove = (candidateId: number, newStepId: number) => {
    setState(prev => ({
      ...prev,
      candidates: prev.candidates.map(candidate => {
        // Encontrar el nombre del nuevo step
        const newStepName = prev.interviewSteps.find(step => step.id === newStepId)?.name || '';
        if (candidate.id === candidateId || candidate.applicationId === candidateId) {
          return {
            ...candidate,
            currentInterviewStep: newStepName,
            id: candidateId,
            applicationId: candidateId,
          };
        }
        return candidate;
      }),
    }));
  };

  if (state.loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (state.error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{state.error}</p>
          <Button variant="primary" onClick={() => navigate('/positions')}>
            Volver a Posiciones
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="position-detail-container mt-3">
      <Toaster position="top-right" />
      
      {/* Header con flecha de volver y título */}
      <div className="d-flex align-items-center mb-4">
        <Button
          variant="link"
          onClick={() => navigate('/positions')}
          className="me-3 p-0"
          aria-label="Volver a posiciones"
        >
          <ArrowLeft size={24} />
        </Button>
        <h2 className="mb-0">{state.positionName}</h2>
      </div>

      {/* Barra de búsqueda */}
      <Suspense fallback={<div className="text-center mb-4"><Spinner animation="border" size="sm" /></div>}>
        <SearchBar
          searchName={searchName}
          minScore={minScore}
          maxScore={maxScore}
          onSearchNameChange={setSearchName}
          onMinScoreChange={setMinScore}
          onMaxScoreChange={setMaxScore}
        />
      </Suspense>

      {/* Tablero Kanban */}
      <Suspense fallback={
        <div className="text-center mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando tablero...</span>
          </Spinner>
        </div>
      }>
        <KanbanBoard
          interviewSteps={state.interviewSteps}
          candidates={filteredCandidates}
          stepNameToIdMap={stepNameToIdMap}
          onCandidateMove={handleCandidateMove}
        />
      </Suspense>
    </Container>
  );
};

export default PositionDetail;
