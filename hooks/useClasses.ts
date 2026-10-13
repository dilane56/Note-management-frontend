import { classApi } from "@/lib/class-api"
import { filiereApi } from "@/lib/filiere-api"
import type { ClassPayload, Filiere, SchoolClass } from "@/lib/types"
import { runAction, useAsync } from "./useAsync"

export const useClasses = () => {
  const { data, loading, error, reload } = useAsync<{ classes: SchoolClass[]; filieres: Filiere[] }>(
    async () => {
      const [classes, filieres] = await Promise.all([classApi.getClasses(), filiereApi.getFilieres()])
      return { classes, filieres }
    },
    [],
    { classes: [], filieres: [] },
  )

  const mutate = async (action: () => Promise<unknown>, success: string, failure: string) => {
    const { ok } = await runAction(action, success, failure)
    if (ok) await reload()
    return ok
  }

  return {
    classes: data.classes,
    filieres: data.filieres,
    loading,
    error,
    reload,
    createClass: (payload: ClassPayload) =>
      mutate(() => classApi.create(payload), "Classe créée", "Erreur lors de la création"),
    updateClass: (id: number, payload: ClassPayload) =>
      mutate(() => classApi.update(id, payload), "Classe modifiée", "Erreur lors de la modification"),
    deleteClass: (id: number) => mutate(() => classApi.delete(id), "Classe supprimée", "Erreur lors de la suppression"),
  }
}
