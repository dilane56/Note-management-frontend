import { describe, expect, it } from "vitest"
import {
  ACADEMIC_YEAR_PATTERN,
  evaluationLabel,
  formatOn20,
  formatRank,
  formatRawGrade,
  gradeVariant,
  roleLabel,
  sortEvaluations,
  toTwenty,
} from "./format"
import type { Evaluation } from "./types"

describe("toTwenty", () => {
  it("ramène une note sur 20 selon la note maximale de la matière", () => {
    expect(toTwenty(15, 40)).toBe(7.5)
    expect(toTwenty(8, 10)).toBe(16)
    expect(toTwenty(12, 20)).toBe(12)
  })

  it("considère un barème absent ou nul comme un barème sur 20", () => {
    expect(toTwenty(12, 0)).toBe(12)
    expect(toTwenty(12, null)).toBe(12)
  })
})

describe("formatage", () => {
  it("affiche la note brute sur son barème", () => {
    expect(formatRawGrade(15, 40)).toBe("15/40")
  })

  it("affiche « - » pour une valeur absente", () => {
    expect(formatOn20(undefined)).toBe("-")
    expect(formatOn20(Number.NaN)).toBe("-")
  })

  it("affiche « - » pour le rang 0 (aucune note)", () => {
    expect(formatRank({ studentRank: 0, totalStudents: 30, classAverage: 0, studentAverage: 0 })).toBe("-")
    expect(formatRank({ studentRank: 3, totalStudents: 30, classAverage: 11, studentAverage: 14 })).toBe("3/30")
  })

  it("choisit la couleur selon la note sur 20", () => {
    expect(gradeVariant(17)).toBe("default")
    expect(gradeVariant(10)).toBe("secondary")
    expect(gradeVariant(9.99)).toBe("destructive")
  })

  it("traduit les rôles", () => {
    expect(roleLabel("TEACHER")).toBe("Enseignant")
    expect(roleLabel("admin")).toBe("Administrateur")
  })
})

describe("évaluations", () => {
  const evaluations: Evaluation[] = [
    { id: 1, typeEvaluation: "SEQUENCE2", anneeAcademique: "2024-2025" },
    { id: 2, typeEvaluation: "SEQUENCE1", anneeAcademique: "2025-2026" },
    { id: 3, typeEvaluation: "SEQUENCE1", anneeAcademique: "2024-2025" },
  ]

  it("affiche le type et l'année", () => {
    expect(evaluationLabel(evaluations[1])).toBe("Séquence 1 — 2025-2026")
    expect(evaluationLabel({ id: 9, type: "TRIMESTRE2", anneeAcademique: "2025-2026" })).toBe("Trimestre 2 — 2025-2026")
  })

  it("trie de l'année la plus récente à la plus ancienne, puis par type", () => {
    expect(sortEvaluations(evaluations).map((e) => e.id)).toEqual([2, 3, 1])
  })

  it("valide le format d'année académique comme le backend", () => {
    expect(ACADEMIC_YEAR_PATTERN.test("2025-2026")).toBe(true)
    expect(ACADEMIC_YEAR_PATTERN.test("2025/2026")).toBe(true)
    expect(ACADEMIC_YEAR_PATTERN.test("2025")).toBe(false)
    expect(ACADEMIC_YEAR_PATTERN.test("25-26")).toBe(false)
  })
})
