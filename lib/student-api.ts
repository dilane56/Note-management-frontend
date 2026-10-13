import { api, downloadFile } from "./api"
import type { StudentRanking, Transcript } from "./types"

export const studentApi = {
  /** Classement toutes évaluations confondues. */
  getRanking: (studentId: number) => api.get<StudentRanking>(`/api/students/${studentId}/ranking`),

  /** Relevé (moyenne, rang, notes) pour une évaluation ; 404 tant qu'aucune note n'est saisie. */
  previewTranscript: (studentId: number, evaluationId: number) =>
    api.get<Transcript>(`/api/transcripts/students/${studentId}/evaluations/${evaluationId}/preview`),

  downloadTranscript: (studentId: number, evaluationId: number) =>
    downloadFile(
      `/api/transcripts/students/${studentId}/evaluations/${evaluationId}/download`,
      `releve-${studentId}-evaluation-${evaluationId}.pdf`,
    ),

  exportGrades: (studentId: number) =>
    downloadFile(`/api/students/${studentId}/export-excel`, `notes-${studentId}.xlsx`),
}
