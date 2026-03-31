import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

const INITIAL_CLASSES = [
  { id: 1, name: "Matematika Dasar", classCode: "MTK-X-01", level: "X", schedule: "Senin 07:00", capacity: 32, students: 32, teacher: "Budi Santoso", room: "R-101", status: "Active", startDate: "2024-01-01", duration: 90, sessionsPerWeek: 3 },
  { id: 2, name: "Bahasa Indonesia Lanjut", classCode: "BI-X-02", level: "X", schedule: "Selasa 08:30", capacity: 28, students: 28, teacher: "Siti Nurhaliza", room: "R-102", status: "Active", startDate: "2024-01-01", duration: 60, sessionsPerWeek: 2 },
  { id: 3, name: "Fisika Modern", classCode: "FIS-XI-01", level: "XI", schedule: "Rabu 10:00", capacity: 24, students: 24, teacher: "Ahmad Wijaya", room: "Lab-A", status: "Active", startDate: "2024-01-01", duration: 120, sessionsPerWeek: 2 },
  { id: 4, name: "Kimia Organik", classCode: "KIM-XI-02", level: "XI", schedule: "Kamis 11:30", capacity: 20, students: 20, teacher: "Rina Dewi", room: "Lab-B", status: "Active", startDate: "2024-01-01", duration: 120, sessionsPerWeek: 2 },
];

export function useClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/classes");
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setClasses(data.length > 0 ? data : INITIAL_CLASSES);
      setError(null);
    } catch (err) {
      setError(err.message);
      setClasses(INITIAL_CLASSES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const addClass = async (data) => {
    await api.post("/classes", data);
    await fetchClasses();
  };

  const updateClass = async (id, data) => {
    await api.put(`/classes/${id}`, data);
    await fetchClasses();
  };

  const deleteClass = async (id) => {
    await api.delete(`/classes/${id}`);
    await fetchClasses();
  };

  return { classes, loading, error, addClass, updateClass, deleteClass, refetch: fetchClasses };
}
