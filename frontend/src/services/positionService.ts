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
 * Obtiene el flujo de entrevistas para una posición específica
 */
export const getInterviewFlow = async (positionId: string): Promise<InterviewFlowResponse> => {
  try {
    const response = await axios.get<InterviewFlowResponse>(
      `${API_BASE_URL}/positions/${positionId}/interviewFlow`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al obtener el flujo de entrevistas: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Obtiene todos los candidatos para una posición específica
 */
export const getCandidates = async (positionId: string): Promise<Candidate[]> => {
  try {
    const response = await axios.get<Candidate[]>(
      `${API_BASE_URL}/positions/${positionId}/candidates`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Error al obtener candidatos: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Actualiza la etapa (fase) de un candidato
 */
export const updateCandidateStage = async (
  candidateId: string,
  interviewStepId: number
): Promise<UpdateStageResponse> => {
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
};
