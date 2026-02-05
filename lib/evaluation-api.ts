import { api } from './api';
import { EvaluationResponseDTO } from './api';

// Récupérer toutes les évaluations
export const getAllEvaluations = async (): Promise<EvaluationResponseDTO[]> => {
  return api.get('/api/evaluations');
};

// Récupérer une évaluation par ID
export const getEvaluation = async (id: number): Promise<EvaluationResponseDTO> => {
  return api.get(`/api/evaluations/${id}`);
};