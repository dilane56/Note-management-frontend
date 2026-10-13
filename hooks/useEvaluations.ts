import { evaluationApi } from "@/lib/evaluation-api"
import { sortEvaluations } from "@/lib/format"
import type { Evaluation, EvaluationPayload } from "@/lib/types"
import { runAction, useAsync } from "./useAsync"

export const useEvaluations = () => {
  const { data, loading, error, reload } = useAsync<Evaluation[]>(
    async () => sortEvaluations(await evaluationApi.getEvaluations()),
    [],
    [],
  )

  const mutate = async (action: () => Promise<unknown>, success: string, failure: string) => {
    const { ok } = await runAction(action, success, failure)
    if (ok) await reload()
    return ok
  }

  return {
    evaluations: data,
    loading,
    error,
    reload,
    createEvaluation: (payload: EvaluationPayload) =>
      mutate(() => evaluationApi.create(payload), "Évaluation créée", "Erreur lors de la création"),
    updateEvaluation: (id: number, payload: EvaluationPayload) =>
      mutate(() => evaluationApi.update(id, payload), "Évaluation modifiée", "Erreur lors de la modification"),
    deleteEvaluation: (id: number) =>
      mutate(() => evaluationApi.delete(id), "Évaluation supprimée", "Erreur lors de la suppression"),
  }
}
