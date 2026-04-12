import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export function useSchedule(filters = {}) {
  const [schedules, setSchedules] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.grade)     params.append("grade",     filters.grade);
      if (filters.classId)   params.append("classId",   filters.classId);
      if (filters.teacherId) params.append("teacherId", filters.teacherId);
      if (filters.day)       params.append("day",       filters.day);

      const res = await api.get(`/schedules?${params.toString()}`);
      setSchedules(res.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.grade, filters.classId, filters.teacherId, filters.day]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Generate jadwal otomatis
  const generateSchedule = async (clearExisting = true) => {
    const res = await api.post("/schedules/generate", { clearExisting });
    await fetchSchedules();
    return res;
  };

  // Hapus semua jadwal
  const clearAllSchedules = async () => {
    await api.delete("/schedules");
    await fetchSchedules();
  };

  const deleteSchedule = async (id) => {
    await api.delete(`/schedules/${id}`);
    await fetchSchedules();
  };

  return {
    schedules,
    loading,
    error,
    generateSchedule,
    clearAllSchedules,
    deleteSchedule,
    refetch: fetchSchedules,
  };
}