import { api } from './api';
import { StudentResponseDTO } from './api';

// Récupérer tous les étudiants
export const getAllStudents = async (): Promise<StudentResponseDTO[]> => {
  return api.get('/api/students');
};

// Récupérer un étudiant par ID
export const getStudent = async (id: number): Promise<StudentResponseDTO> => {
  return api.get(`/api/students/${id}`);
};

// Récupérer les étudiants d'une classe
export const getStudentsByClass = async (classId: number): Promise<StudentResponseDTO[]> => {
  return api.get(`/api/classes/${classId}/students`);
};