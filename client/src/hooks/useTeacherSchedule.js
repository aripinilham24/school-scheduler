import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

// Hook ini mengambil data teachers dan schedules sekaligus,
// lalu menggabungkannya — setiap teacher akan punya array schedules
export function useTeacherSchedules() {
  const [teachers,  setTeachers]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch teachers dan schedules secara paralel
      const [teachersRes, schedulesRes] = await Promise.all([
        api.get("/teachers"),
        api.get("/schedules"),
      ]);

      const teacherList  = teachersRes.data;
      const scheduleList = schedulesRes.data;

      // Gabungkan: setiap teacher dapat array schedules miliknya
      const merged = teacherList.map((teacher) => ({
        ...teacher,
        schedules: scheduleList.filter((s) => s.teacherId === teacher.id),
      }));

      setTeachers(merged);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Schedule CRUD ────────────────────────────────────────

  const addSchedule = async (data) => {
    await api.post("/schedules", data);
    await fetchAll();
  };

  const updateSchedule = async (id, data) => {
    await api.put(`/schedules/${id}`, data);
    await fetchAll();
  };

  const deleteSchedule = async (id) => {
    await api.delete(`/schedules/${id}`);
    await fetchAll();
  };

  return {
    teachers,
    loading,
    error,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    refetch: fetchAll,
  };
}