import { api, downloadFile } from "./api"
import type { MessageResponse, TranscriptStats } from "./types"

export const transcriptApi = {
  downloadClassZip: (classId: number, evaluationId: number, className: string) =>
    downloadFile(
      `/api/transcripts/class/${classId}/evaluations/${evaluationId}/download-zip`,
      `releves-${className}-evaluation-${evaluationId}.zip`,
    ),

  downloadClassPdf: (classId: number, evaluationId: number, className: string) =>
    downloadFile(
      `/api/transcripts/class/${classId}/evaluations/${evaluationId}/download`,
      `releves-${className}-evaluation-${evaluationId}.pdf`,
    ),

  getClassStats: (classId: number, evaluationId: number) =>
    api.get<TranscriptStats>(`/api/v1/admin/transcripts/classes/${classId}/stats`, { evaluationId }),

  sendByEmail: (studentId: number, evaluationId: number) =>
    api.post<MessageResponse>(`/api/v1/mails/students/${studentId}/send-transcript`, undefined, { evaluationId }),
}

export const exportApi = {
  studentsOfClass: (classId: number, className: string) =>
    downloadFile(`/api/exports/students/class/${classId}`, `etudiants-${className}.xlsx`),

  teachers: () => downloadFile("/api/exports/teachers", "enseignants.xlsx"),

  statistics: (classId: number, evaluationId: number, className: string) =>
    downloadFile(
      `/api/exports/statistics/class/${classId}/evaluation/${evaluationId}`,
      `statistiques-${className}-evaluation-${evaluationId}.xlsx`,
    ),

  complete: (classId: number, evaluationId: number, className: string) =>
    downloadFile(
      `/api/exports/complete/class/${classId}/evaluation/${evaluationId}`,
      `rapport-complet-${className}-evaluation-${evaluationId}.xlsx`,
    ),
}
