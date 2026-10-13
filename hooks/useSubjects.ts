import { classApi } from "@/lib/class-api"
import { subjectApi } from "@/lib/subject-api"
import { userApi } from "@/lib/user-api"
import type { SchoolClass, Subject, SubjectPayload, UserResponse } from "@/lib/types"
import { runAction, useAsync } from "./useAsync"

export const useSubjects = () => {
  const { data, loading, error, reload } = useAsync<{
    subjects: Subject[]
    classes: SchoolClass[]
    teachers: UserResponse[]
  }>(
    async () => {
      const [subjects, classes, users] = await Promise.all([
        subjectApi.getSubjects(),
        classApi.getClasses(),
        userApi.getUsers(),
      ])
      return { subjects, classes, teachers: users.filter((u) => u.role === "TEACHER") }
    },
    [],
    { subjects: [], classes: [], teachers: [] },
  )

  const mutate = async (action: () => Promise<unknown>, success: string, failure: string) => {
    const { ok } = await runAction(action, success, failure)
    if (ok) await reload()
    return ok
  }

  return {
    subjects: data.subjects,
    classes: data.classes,
    teachers: data.teachers,
    loading,
    error,
    reload,
    createSubject: (payload: SubjectPayload) =>
      mutate(() => subjectApi.create(payload), "Matière créée", "Erreur lors de la création"),
    updateSubject: (id: number, payload: SubjectPayload) =>
      mutate(() => subjectApi.update(id, payload), "Matière modifiée", "Erreur lors de la modification"),
    deleteSubject: (id: number) =>
      mutate(() => subjectApi.delete(id), "Matière supprimée", "Erreur lors de la suppression"),
    assignTeacher: (teacherId: number, subjectId: number) =>
      mutate(() => subjectApi.assignTeacher(teacherId, subjectId), "Enseignant assigné", "Erreur lors de l'assignation"),
  }
}
