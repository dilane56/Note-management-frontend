import { api } from './api';
import { GradeRequestDTO, GradeResponseDTO, TeacherGradeRequestDTO } from './api';

// Récupérer toutes les notes
export const getAllGrades = async (): Promise<GradeResponseDTO[]> => {
  return api.get('/api/grades');
};

// Récupérer une note par ID
export const getGrade = async (id: number): Promise<GradeResponseDTO> => {
  return api.get(`/api/grades/${id}`);
};

// Ajouter une nouvelle note
export const addGrade = async (gradeData: GradeRequestDTO): Promise<GradeResponseDTO> => {
  return api.post('/api/grades', gradeData);
};

// Modifier une note existante
export const updateGrade = async (id: number, gradeData: GradeRequestDTO): Promise<GradeResponseDTO> => {
  return api.put(`/api/grades/${id}`, gradeData);
};

// Supprimer une note
export const deleteGrade = async (id: number): Promise<string> => {
  return api.delete(`/api/grades/${id}`);
};

// Récupérer les notes d'un étudiant
export const getStudentGrades = async (studentId: number): Promise<GradeResponseDTO[]> => {
  return api.get(`/api/grades/students/${studentId}/grades`);
};

// Ajouter un commentaire à une note
export const addGradeComment = async (gradeId: number, comment: string): Promise<GradeResponseDTO> => {
  return api.patch(`/api/grades/${gradeId}/comment?comment=${encodeURIComponent(comment)}`);
};

// Récupérer les notes d'un étudiant pour une matière
export const getGradesByStudentAndSubject = async (studentId: number, subjectId: number): Promise<GradeResponseDTO[]> => {
  return api.get(`/api/grades/students/${studentId}/subjects/${subjectId}/grades`);
};

// Récupérer les notes d'un étudiant par type d'évaluation
export const getGradesByStudentAndEvaluation = async (studentId: number, typeEvaluation: string): Promise<GradeResponseDTO[]> => {
  return api.get(`/api/grades/student/${studentId}/evaluation/${typeEvaluation}/grades`);
};

// Ajouter une note pour une matière spécifique
export const addGradeForSubject = async (subjectId: number, studentId: number, gradeData: GradeRequestDTO): Promise<GradeResponseDTO> => {
  return api.post(`/api/grades/subjects/${subjectId}/students/${studentId}`, gradeData);
};

// Interface enseignant simplifiée pour ajouter une note
export const addGradeByTeacher = async (subjectId: number, studentId: number, gradeData: TeacherGradeRequestDTO): Promise<GradeResponseDTO> => {
  return api.post(`/api/grades/teacher/subjects/${subjectId}/students/${studentId}`, gradeData);
};

// Récupérer les matières d'un enseignant
export const getSubjectsByTeacher = async (teacherId: number): Promise<any[]> => {
  return api.get(`/api/grades/teacher/${teacherId}/subjects`);
};

// Récupérer les étudiants d'une matière
export const getStudentsBySubject = async (subjectId: number): Promise<any[]> => {
  return api.get(`/api/grades/subjects/${subjectId}/students`);
};

// Ajouter une note pour une matière spécifique
export const addGradeForSubjectAndEvaluation = async (subjectId: number, studentId: number, evaluationId: number, gradeData: { noteValue: number, comment?: string }) => {
  return api.post(`/api/grades/subjects/${subjectId}/students/${studentId}/evaluations/${evaluationId}`, gradeData);
};