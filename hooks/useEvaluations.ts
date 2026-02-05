import { useState, useEffect } from 'react';
import { EvaluationResponseDTO } from '@/lib/api';
import * as evaluationApi from '@/lib/evaluation-api';

export const useEvaluations = () => {
  const [evaluations, setEvaluations] = useState<EvaluationResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationApi.getAllEvaluations();
      setEvaluations(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des évaluations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  return {
    evaluations,
    loading,
    error,
    fetchEvaluations,
  };
};