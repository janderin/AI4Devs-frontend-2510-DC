import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

export interface InterviewStep {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
}

export interface InterviewFlow {
  id: number;
  description: string;
  interviewSteps: InterviewStep[];
}

export interface InterviewFlowResponse {
  positionName: string;
  interviewFlow: InterviewFlow;
}

export interface Candidate {
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
  applicationId?: number; // Necesario para el PUT
  id?: number; // ID del candidato para el PUT
}

export interface UpdateStageRequest {
  applicationId: string;
  currentInterviewStep: string;
}

export interface UpdateStageResponse {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes: string | null;
    interviews: any[];
  };
}

/**
 * Datos mock para el flujo de entrevistas
 */
const mockInterviewFlows: Record<string, InterviewFlowResponse> = {
  '1': {
    positionName: 'Senior Backend Engineer',
    interviewFlow: {
      id: 1,
      description: 'Standard development interview process',
      interviewSteps: [
        {
          id: 1,
          interviewFlowId: 1,
          interviewTypeId: 1,
          name: 'Initial Screening',
          orderIndex: 1
        },
        {
          id: 2,
          interviewFlowId: 1,
          interviewTypeId: 2,
          name: 'Technical Interview',
          orderIndex: 2
        },
        {
          id: 3,
          interviewFlowId: 1,
          interviewTypeId: 3,
          name: 'Manager Interview',
          orderIndex: 3
        }
      ]
    }
  },
  '2': {
    positionName: 'Junior Android Engineer',
    interviewFlow: {
      id: 2,
      description: 'Mobile development interview process',
      interviewSteps: [
        {
          id: 4,
          interviewFlowId: 2,
          interviewTypeId: 1,
          name: 'Initial Screening',
          orderIndex: 1
        },
        {
          id: 5,
          interviewFlowId: 2,
          interviewTypeId: 2,
          name: 'Technical Interview',
          orderIndex: 2
        },
        {
          id: 6,
          interviewFlowId: 2,
          interviewTypeId: 3,
          name: 'Manager Interview',
          orderIndex: 3
        }
      ]
    }
  },
  '3': {
    positionName: 'Product Manager',
    interviewFlow: {
      id: 3,
      description: 'Product management interview process',
      interviewSteps: [
        {
          id: 7,
          interviewFlowId: 3,
          interviewTypeId: 1,
          name: 'Initial Screening',
          orderIndex: 1
        },
        {
          id: 8,
          interviewFlowId: 3,
          interviewTypeId: 2,
          name: 'Product Case Study',
          orderIndex: 2
        },
        {
          id: 9,
          interviewFlowId: 3,
          interviewTypeId: 3,
          name: 'Manager Interview',
          orderIndex: 3
        }
      ]
    }
  }
};

/**
 * Obtiene el flujo de entrevistas para una posición específica
 */
export const getInterviewFlow = async (positionId: string): Promise<InterviewFlowResponse> => {
  // Mock: retornar datos mockeados
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = mockInterviewFlows[positionId] || mockInterviewFlows['1'];
      resolve(mockData);
    }, 300); // Simular delay de red
  });

  /* TODO: Descomentar cuando el backend esté listo
  try {
    const response = await axios.get<InterviewFlowResponse>(
      `${API_BASE_URL}/positions/${positionId}/interviewFlow`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al obtener el flujo de entrevistas: ${error.response?.data?.message || error.message}`);
  }
  */
};

/**
 * Datos mock para candidatos por posición
 */
const mockCandidates: Record<string, Candidate[]> = {
  '1': [
    {
      fullName: 'Jane Smith',
      currentInterviewStep: 'Technical Interview',
      averageScore: 1, // Caso de prueba: 1
      id: 1,
      applicationId: 1
    },
    {
      fullName: 'Carlos García',
      currentInterviewStep: 'Initial Screening',
      averageScore: 5, // Caso de prueba: 5
      id: 2,
      applicationId: 2
    },
    {
      fullName: 'John Doe',
      currentInterviewStep: 'Manager Interview',
      averageScore: 6, // Caso de prueba: 6
      id: 3,
      applicationId: 3
    },
    {
      fullName: 'María López',
      currentInterviewStep: 'Initial Screening',
      averageScore: 7, // Caso de prueba: 7
      id: 4,
      applicationId: 4
    },
    {
      fullName: 'Robert Johnson',
      currentInterviewStep: 'Technical Interview',
      averageScore: 10, // Caso de prueba: 10
      id: 5,
      applicationId: 5
    }
  ],
  '2': [
    {
      fullName: 'Ana Martínez',
      currentInterviewStep: 'Initial Screening',
      averageScore: 5,
      id: 6,
      applicationId: 6
    },
    {
      fullName: 'David Wilson',
      currentInterviewStep: 'Technical Interview',
      averageScore: 7,
      id: 7,
      applicationId: 7
    }
  ],
  '3': [
    {
      fullName: 'Emma Brown',
      currentInterviewStep: 'Initial Screening',
      averageScore: 6,
      id: 8,
      applicationId: 8
    },
    {
      fullName: 'Michael Davis',
      currentInterviewStep: 'Product Case Study',
      averageScore: 10,
      id: 9,
      applicationId: 9
    },
    {
      fullName: 'Sarah Miller',
      currentInterviewStep: 'Manager Interview',
      averageScore: 1,
      id: 10,
      applicationId: 10
    }
  ]
};

/**
 * Obtiene todos los candidatos para una posición específica
 */
export const getCandidates = async (positionId: string): Promise<Candidate[]> => {
  // Mock: retornar datos mockeados
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = mockCandidates[positionId] || mockCandidates['1'];
      resolve(mockData);
    }, 300); // Simular delay de red
  });

  /* TODO: Descomentar cuando el backend esté listo
  try {
    const response = await axios.get<Candidate[]>(
      `${API_BASE_URL}/positions/${positionId}/candidates`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al obtener candidatos: ${error.response?.data?.message || error.message}`);
  }
  */
};

/**
 * Actualiza la etapa (fase) de un candidato
 * NOTA: Comentado mientras el backend no esté disponible
 */
export const updateCandidateStage = async (
  candidateId: string,
  interviewStepId: number
): Promise<UpdateStageResponse> => {
  // Mock: solo retornar éxito para que funcione la UI (actualización optimista)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'Candidate stage updated successfully',
        data: {
          id: parseInt(candidateId),
          positionId: 1,
          candidateId: parseInt(candidateId),
          applicationDate: new Date().toISOString(),
          currentInterviewStep: interviewStepId,
          notes: null,
          interviews: []
        }
      });
    }, 200);
  });

  /* TODO: Descomentar cuando el backend esté listo
  try {
    const response = await axios.put<UpdateStageResponse>(
      `${API_BASE_URL}/candidates/${candidateId}/stage`,
      {
        applicationId: candidateId,
        currentInterviewStep: interviewStepId.toString()
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al actualizar etapa del candidato: ${error.response?.data?.message || error.message}`);
  }
  */
};
