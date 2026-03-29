import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

const INITIAL_TEACHERS = [
  {
    id: "ywZBTG1OInjSYi6eN3eT",
    name: "Mr. Rizky Pratama",
    subject: "Computer Science",
    email: "rizky.p@skillset.id",
    phone: "+62 817-6789-0124",
    status: "Active",
    rating: 4.9,
    students: 189,
    courses: 8,
    joinDate: "Feb 2021",
  },
  {
    id: "rmsAVrg4zhcE32wQQ4Jn",
    name: "Ms. Dewi Lestari",
    subject: "History",
    email: "dewi.l@skillset.id",
    phone: "+62 818-7890-1235",
    status: "Inactive",
    rating: 4.3,
    students: 63,
    courses: 3,
    joinDate: "Jul 2023",
  },
  {
    id: "QWD2eoeoNRFF8WuOdozQ",
    name: "Dr. Lisa Huang",
    subject: "Biology",
    email: "lisa.h@skillset.id",
    phone: "+62 816-5678-9013",
    status: "Active",
    rating: 4.6,
    students: 145,
    courses: 6,
    joinDate: "Dec 2021",
  },
  {
    id: "LSjuUKm5RpSg5klzHh8a",
    name: "Prof. Michael Chen",
    subject: "Physics",
    email: "m.chen@skillset.id",
    phone: "+62 813-2345-6789",
    status: "Active",
    rating: 4.7,
    students: 98,
    courses: 4,
    joinDate: "Mar 2022",
  },
  {
    id: "FDj93KS1b72jFArUbCfF",
    name: "Dr. Sarah Johnson",
    subject: "Mathematics",
    email: "sarah.johnson@skillset.id",
    phone: "+62 812-3456-7890",
    status: "Active",
    rating: 4.9,
    students: 124,
    courses: 5,
    joinDate: "Jan 2022",
  },
  {
    id: "BcSS4HQ1u81rnlx9N60B",
    name: "Ms. Ayu Rahmawati",
    subject: "English Literature",
    email: "ayu.r@skillset.id",
    phone: "+62 814-3456-7891",
    status: "Active",
    rating: 4.8,
    students: 210,
    courses: 7,
    joinDate: "Jun 2021",
  },
  {
    id: "0wRPfJBM09nFab2eauZp",
    name: "Mr. Budi Santoso",
    subject: "Chemistry",
    email: "budi.s@skillset.id",
    phone: "+62 815-4567-8902",
    status: "On Leave",
    rating: 4.5,
    students: 76,
    courses: 3,
    joinDate: "Sep 2022",
  },
  {
    id: "0dPB8n6bT5eC9sJvWIIT",
    name: "Prof. Ahmad Fauzi",
    subject: "Economics",
    email: "ahmad.f@skillset.id",
    phone: "+62 819-8901-2346",
    status: "Active",
    rating: 4.7,
    students: 112,
    courses: 5,
    joinDate: "Apr 2022",
  },
];

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