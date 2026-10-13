import { filiereApi } from "@/lib/filiere-api"
import type { Filiere } from "@/lib/types"
import { runAction, useAsync } from "./useAsync"

export const useFilieres = () => {
  const { data, loading, error, reload } = useAsync<Filiere[]>(() => filiereApi.getFilieres(), [], [])

  const mutate = async (action: () => Promise<unknown>, success: string, failure: string) => {
    const { ok } = await runAction(action, success, failure)
    if (ok) await reload()
    return ok
  }

  return {
    filieres: data,
    loading,
    error,
    reload,
    createFiliere: (name: string) =>
      mutate(() => filiereApi.create({ name }), "Filière créée", "Erreur lors de la création"),
    updateFiliere: (id: number, name: string) =>
      mutate(() => filiereApi.update(id, { name }), "Filière modifiée", "Erreur lors de la modification"),
    deleteFiliere: (id: number) =>
      mutate(() => filiereApi.delete(id), "Filière supprimée", "Erreur lors de la suppression"),
  }
}
