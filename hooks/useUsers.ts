import { classApi } from "@/lib/class-api"
import { userApi } from "@/lib/user-api"
import type { Role, SchoolClass, StudentPayload, UserPayload, UserResponse } from "@/lib/types"
import { runAction, useAsync } from "./useAsync"

export const useUsers = () => {
  const { data, loading, error, reload } = useAsync<{ users: UserResponse[]; classes: SchoolClass[] }>(
    async () => {
      const [users, classes] = await Promise.all([userApi.getUsers(), classApi.getClasses()])
      return { users, classes }
    },
    [],
    { users: [], classes: [] },
  )

  const mutate = async (action: () => Promise<unknown>, success: string, failure: string) => {
    const { ok } = await runAction(action, success, failure)
    if (ok) await reload()
    return ok
  }

  return {
    users: data.users,
    classes: data.classes,
    loading,
    error,
    reload,
    createUser: (role: Role, payload: UserPayload | StudentPayload) =>
      mutate(() => userApi.create(role, payload), "Utilisateur créé", "Erreur lors de la création"),
    updateUser: (role: Role, id: number, payload: UserPayload | StudentPayload) =>
      mutate(() => userApi.update(role, id, payload), "Utilisateur modifié", "Erreur lors de la modification"),
    deleteUser: (id: number) =>
      mutate(() => userApi.delete(id), "Utilisateur supprimé", "Erreur lors de la suppression"),
  }
}
