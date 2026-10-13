import type { Evaluation, EvaluationSummary, Role, StudentRanking, TypeEvaluation } from "./types"

export const PASS_AVERAGE = 10

export const EVALUATION_TYPES: { value: TypeEvaluation; label: string }[] = [
  { value: "SEQUENCE1", label: "Séquence 1" },
  { value: "SEQUENCE2", label: "Séquence 2" },
  { value: "SEQUENCE3", label: "Séquence 3" },
  { value: "TRIMESTRE1", label: "Trimestre 1" },
  { value: "TRIMESTRE2", label: "Trimestre 2" },
  { value: "TRIMESTRE3", label: "Trimestre 3" },
  { value: "SEMESTRE1", label: "Semestre 1" },
  { value: "SEMESTRE2", label: "Semestre 2" },
  { value: "ANNUAL", label: "Annuel" },
]

/** Même règle que le backend : AAAA-AAAA (ou AAAA/AAAA). */
export const ACADEMIC_YEAR_PATTERN = /^\d{4}\s*[-/]\s*\d{4}$/

export const evaluationTypeLabel = (type: string | null | undefined): string =>
  EVALUATION_TYPES.find((t) => t.value === type)?.label || type || "-"

/** Libellé complet d'une évaluation, ex. « Séquence 1 — 2025-2026 ». */
export const evaluationLabel = (evaluation: Evaluation | EvaluationSummary | null | undefined): string => {
  if (!evaluation) return "-"
  const type = "typeEvaluation" in evaluation ? evaluation.typeEvaluation : evaluation.type
  return evaluation.anneeAcademique
    ? `${evaluationTypeLabel(type)} — ${evaluation.anneeAcademique}`
    : evaluationTypeLabel(type)
}

/** Tri : année la plus récente d'abord, puis ordre des types. */
export const sortEvaluations = <T extends Evaluation>(evaluations: T[]): T[] => {
  const order = (type: string) => EVALUATION_TYPES.findIndex((t) => t.value === type)
  return [...evaluations].sort(
    (a, b) =>
      (b.anneeAcademique || "").localeCompare(a.anneeAcademique || "") ||
      order(a.typeEvaluation) - order(b.typeEvaluation),
  )
}

export const roleLabel = (role: Role | string | null | undefined): string => {
  switch ((role || "").toUpperCase()) {
    case "ADMIN":
      return "Administrateur"
    case "TEACHER":
      return "Enseignant"
    case "STUDENT":
      return "Étudiant"
    default:
      return "Non défini"
  }
}

const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value)

export const round = (value: number, digits = 2) => {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

/** Note ramenée sur 20 (même calcul que le backend). */
export const toTwenty = (value: number, noteMaximale: number | null | undefined): number => {
  const max = isNumber(noteMaximale) && noteMaximale > 0 ? noteMaximale : 20
  return (value * 20) / max
}

const formatNumber = (value: number, digits = 2) =>
  round(value, digits).toLocaleString("fr-FR", { maximumFractionDigits: digits })

/** « 15/40 » — la note telle que saisie, sur le barème de la matière. */
export const formatRawGrade = (value: number, noteMaximale: number | null | undefined) =>
  `${formatNumber(value)}/${isNumber(noteMaximale) && noteMaximale > 0 ? noteMaximale : 20}`

/** « 12,5/20 », ou « - » si la valeur est absente. */
export const formatOn20 = (value: number | null | undefined, digits = 2) =>
  isNumber(value) ? `${formatNumber(value, digits)}/20` : "-"

export const formatPercent = (value: number | null | undefined) =>
  isNumber(value) ? `${formatNumber(value, 1)} %` : "-"

/** Rang « 3/25 », ou « - » tant que l'étudiant n'a pas de note (rang 0). */
export const formatRank = (ranking: StudentRanking | null | undefined) =>
  ranking && ranking.studentRank > 0 ? `${ranking.studentRank}/${ranking.totalStudents}` : "-"

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

/** Couleur d'une note exprimée sur 20. */
export const gradeVariant = (valueOn20: number): BadgeVariant =>
  valueOn20 >= 16 ? "default" : valueOn20 >= PASS_AVERAGE ? "secondary" : "destructive"

export const gradeColor = (valueOn20: number): string =>
  valueOn20 >= 16 ? "#16a34a" : valueOn20 >= 12 ? "#2563eb" : valueOn20 >= PASS_AVERAGE ? "#d97706" : "#dc2626"

export const fullName = (person: { firstName?: string; lastName?: string } | null | undefined) =>
  person ? `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim() : ""

export const normalize = (text: string | null | undefined) =>
  (text || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
