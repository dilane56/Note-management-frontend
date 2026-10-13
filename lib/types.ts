// Types alignés sur les DTO renvoyés par le backend Spring Boot.

export type Role = "ADMIN" | "TEACHER" | "STUDENT"

export type TypeEvaluation =
  | "SEQUENCE1"
  | "SEQUENCE2"
  | "SEQUENCE3"
  | "TRIMESTRE1"
  | "TRIMESTRE2"
  | "TRIMESTRE3"
  | "SEMESTRE1"
  | "SEMESTRE2"
  | "ANNUAL"

export interface ErrorResponse {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  path?: string
  errorCode?: string
  fieldErrors?: Record<string, string>
}

export interface MessageResponse {
  message: string
}

// --- Authentification / utilisateurs ---

export interface LoginRequest {
  email: string
  password: string
}

export interface UserResponse {
  id: number
  firstName: string
  lastName: string
  email: string
  role: Role
}

export interface LoginResponse {
  token: string
  user: UserResponse
}

export interface TokenInfo {
  valid?: boolean
  id: number
  username: string
  role: Role
}

/** Corps envoyé pour créer ou modifier un utilisateur (mot de passe facultatif en modification). */
export interface UserPayload {
  firstName: string
  lastName: string
  email: string
  password?: string
}

export interface StudentPayload extends UserPayload {
  studentClassId: number
  matricule?: string
}

// --- Évaluations ---

export interface Evaluation {
  id: number
  anneeAcademique: string
  typeEvaluation: TypeEvaluation
}

/** Évaluation incluse dans une note ou un relevé. */
export interface EvaluationSummary {
  id: number
  type: TypeEvaluation
  anneeAcademique: string
}

export interface EvaluationPayload {
  type: TypeEvaluation
  anneeAcademique: string
}

// --- Filières / classes ---

export interface Filiere {
  id: number
  name: string
}

export interface StudentInClass {
  studentId: number
  studentFirstName: string
  studentLastName: string
  studentMatricule: string | null
}

export interface SchoolClass {
  id: number
  className: string
  filiereId: number
  filiereName: string
  students: StudentInClass[]
}

export interface ClassPayload {
  className: string
  filiereId: number
}

// --- Matières ---

export interface TeacherInSubject {
  teacherId: number
  teacherFirstName: string
  teacherLastName: string
}

export interface Subject {
  id: number
  name: string
  noteMaximale: number
  coefficient: number
  classId: number | null
  className: string | null
  teachers: TeacherInSubject[]
}

export interface SubjectPayload {
  name: string
  noteMaximale: number
  coefficient: number
  classId: number
}

// --- Étudiants / notes ---

export interface NoteInStudent {
  noteId: number
  noteValue: number
  comment: string | null
  subjectName: string
  subjectId: number
  subjectCoefficient: number
  evaluationReponse: EvaluationSummary
}

export interface StudentResponse extends UserResponse {
  matricule: string | null
  studentClass: { classId: number; className: string; filiereName: string } | null
  notes: NoteInStudent[] | null
}

export interface Grade {
  gradeId: number
  noteValue: number
  comment: string | null
  student: StudentInClass
  subjectId: number
  subjectName: string
  noteMaximale: number
  coefficient: number
  evaluation: EvaluationSummary
}

export interface GradePayload {
  studentId: number
  subjectId: number
  evaluationId: number
  noteValue: number
  comment?: string
}

export interface StudentRanking {
  /** 0 lorsque l'étudiant n'a encore aucune note. */
  studentRank: number
  totalStudents: number
  classAverage: number
  studentAverage: number
}

// --- Relevés ---

export interface GradeInTranscript {
  id: number
  noteValue: number
  noteMaximale: number
  coefficient: number
  comment: string | null
  subjectName: string
}

export interface Transcript {
  id: number
  average: number
  student: StudentInClass
  grades: GradeInTranscript[]
  generateDate: string
  updateDate: string
  evaluation: EvaluationSummary
  ranking: StudentRanking | null
  anneeAcademique: string
}

export interface TranscriptStats {
  classId: number
  className: string
  totalStudents: number
  studentsWithTranscripts: number
  classAverage: number
  highestAverage: number
  lowestAverage: number
  passedStudents: number
  failedStudents: number
  passRate: number
}

// --- Statistiques ---

export interface ClassStatistics {
  classAverage: number
  highestGrade: number
  lowestGrade: number
  totalStudents: number
  studentsAboveAverage: number
  studentsBelowAverage: number
  className: string
  evaluationName: string
}

export interface SubjectStatistics {
  subjectName: string
  average: number
  highestGrade: number
  lowestGrade: number
  totalGrades: number
  coefficient: number
  noteMaximale: number
}

export interface StudentPerformance {
  studentId: number
  studentName: string
  average: number
  rank: number
  totalSubjects: number
  passedSubjects: number
}

export interface TeacherDashboard {
  totalClasses: number
  totalStudents: number
  globalAverage: number
  successRate: number
}
