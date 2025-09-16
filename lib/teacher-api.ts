import { api } from './api';
import { ClassResponseDTO } from './class-api';
import { SubjectResponseDTO } from './subject-api';


export const getTeacherClasses = async (teacherId: number): Promise<ClassResponseDTO[]> => {
  return api.get(`/api/teachers/${teacherId}/classes`);
};

export const getTeacherSubjects = async (teacherId: number): Promise<SubjectResponseDTO[]> => {
    return api.get(`/api/teachers/${teacherId}/subjects`);
};
