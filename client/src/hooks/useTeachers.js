import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export function useTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/teachers");
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setTeachers(data.length > 0 ? data : INITIAL_TEACHERS);
      setError(null);
    } catch (err) {
      setError(err.message);
      // Fallback ke sample data agar UI tetap tampak di dev mode.
      setTeachers(INITIAL_TEACHERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const addTeacher = async (data) => {
    await api.post("/teachers", data);
    await fetchTeachers();
  };

  const updateTeacher = async (id, data) => {
    await api.put(`/teachers/${id}`, data);
    await fetchTeachers();
  };

  const deleteTeacher = async (id) => {
    await api.delete(`/teachers/${id}`);
    await fetchTeachers();
  };

  return { teachers, loading, error, addTeacher, updateTeacher, deleteTeacher, refetch: fetchTeachers };
}