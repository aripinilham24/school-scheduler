import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export function useClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/classes");
      // Handle both response formats: direct array or {data: array}
      const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setClasses(data.length > 0 ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setClasses([]); // No fallback data
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
