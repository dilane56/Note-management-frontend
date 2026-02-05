import { useState, useEffect } from 'react';
import { StudentResponseDTO } from '@/lib/api';
import * as studentApi from '@/lib/student-api';

export const useStudents = () => {
  const [students, setStudents] = useState<StudentResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentsByClass = async (classId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentApi.getStudentsByClass(classId);
      setStudents(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

  return {
    students,
    loading,
    error,
    fetchStudentsByClass,
  };
};