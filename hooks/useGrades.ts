import { useState, useEffect } from 'react';
import { GradeResponseDTO, TeacherGradeRequestDTO } from '@/lib/api';
import * as gradeApi from '@/lib/grade-api';

export const useGrades = () => {
  const [grades, setGrades] = useState<GradeResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await gradeApi.getAllGrades();
      setGrades(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentGrades = async (studentId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await gradeApi.getStudentGrades(studentId);
      setGrades(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des notes de l\'étudiant');
    } finally {
      setLoading(false);
    }
  };

  const fetchGradesBySubject = async (studentId: number, subjectId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await gradeApi.getGradesByStudentAndSubject(studentId, subjectId);
      setGrades(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const addGradeForSubject = async (subjectId: number, studentId: number, evaluationId: number, gradeData: { gradeValue: number, comment?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const newGrade = await gradeApi.addGradeForSubjectAndEvaluation(subjectId, studentId, evaluationId, gradeData);
      setGrades(prev => [...prev, newGrade]);
      return newGrade;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout de la note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherSubjects = async (teacherId: number) => {
    setLoading(true);
    setError(null);
    try {
      return await gradeApi.getSubjectsByTeacher(teacherId);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des matières');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsBySubject = async (subjectId: number) => {
    setLoading(true);
    setError(null);
    try {
      return await gradeApi.getStudentsBySubject(subjectId);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des étudiants');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGradeComment = async (gradeId: number, comment: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedGrade = await gradeApi.addGradeComment(gradeId, comment);
      setGrades(prev => prev.map(grade => 
        grade.id === gradeId ? updatedGrade : grade
      ));
      return updatedGrade;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du commentaire');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    grades,
    loading,
    error,
    fetchGrades,
    fetchStudentGrades,
    fetchGradesBySubject,
    addGradeForSubject,
    fetchTeacherSubjects,
    fetchStudentsBySubject,
    updateGrade: async (id: number, gradeData: any) => {
      setLoading(true);
      setError(null);
      try {
        const updatedGrade = await gradeApi.updateGrade(id, gradeData);
        setGrades(prev => prev.map(grade => 
          grade.id === id ? updatedGrade : grade
        ));
        return updatedGrade;
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la mise à jour de la note');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    updateGradeComment,
  };
};