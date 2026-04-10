export const INITIAL_CLASSES = [
  {
    id: 1,
    name: "Matematika Dasar",
    subject: "Matematika",
    room: "R-101",
    duration: 90,
    sessionsPerWeek: 3,
    students: 32,
  },
  {
    id: 2,
    name: "Bahasa Indonesia Lanjut",
    subject: "Bahasa Indonesia",
    room: "R-102",
    duration: 60,
    sessionsPerWeek: 2,
    students: 28,
  },
  {
    id: 3,
    name: "Fisika Modern",
    subject: "Fisika",
    room: "Lab-A",
    duration: 120,
    sessionsPerWeek: 2,
    students: 24,
  },
  {
    id: 4,
    name: "Kimia Organik",
    subject: "Kimia",
    room: "Lab-B",
    duration: 120,
    sessionsPerWeek: 2,
    students: 20,
  },
  {
    id: 5,
    name: "Sejarah Dunia",
    subject: "Sejarah",
    room: "R-103",
    duration: 60,
    sessionsPerWeek: 3,
    students: 35,
  },
  {
    id: 6,
    name: "Ekonomi Mikro",
    subject: "Ekonomi",
    room: "R-104",
    duration: 90,
    sessionsPerWeek: 2,
    students: 30,
  },
  {
    id: 7,
    name: "Biologi Sel",
    subject: "Biologi",
    room: "Lab-C",
    duration: 90,
    sessionsPerWeek: 2,
    students: 22,
  },
  {
    id: 8,
    name: "Seni Rupa",
    subject: "Seni",
    room: "Studio",
    duration: 120,
    sessionsPerWeek: 1,
    students: 18,
  },
];

import { GraduationCap, Users, BookOpen, Video } from "lucide-react";

export const INITIAL_STATS = [
  {
    label: "Total Guru",
    value: 24,
    trend: +3,
    trendLabel: "bulan ini",
    icon: GraduationCap,
    color: "#6C63FF",
    bg: "rgba(108,99,255,0.08)",
  },
  {
    label: "Total Siswa",
    value: 1284,
    trend: +48,
    trendLabel: "bulan ini",
    icon: Users,
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
  },
  {
    label: "Kelas",
    value: 38,
    trend: +5,
    trendLabel: "bulan ini",
    icon: BookOpen,
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
  },
  {
    label: "Kelas Hari Ini",
    value: 12,
    trend: -2,
    trendLabel: "vs kemarin",
    icon: Video,
    color: "#F9A8D4",
    bg: "rgba(249,168,212,0.08)",
  },
];

export const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Ujian Akhir Semester",
    desc: "UAS dimulai 15 Juli 2025. Semua kelas diliburkan.",
    priority: "high",
    time: "2 jam lalu",
  },
  {
    id: 2,
    title: "Pembaruan Sistem",
    desc: "Maintenance terjadwal Minggu 06.00–08.00 WIB.",
    priority: "medium",
    time: "5 jam lalu",
  },
  {
    id: 3,
    title: "Pengumuman Penting",
    desc: "Perubahan jadwal pembelajaran untuk minggu depan.",
    priority: "info",
    time: "1 hari lalu",
  },
];

export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
export const TIME_SLOTS = [
  "07:00",
  "08:30",
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
];

export { default as ROOMS } from "./roomData";
export { default as SUBJECT_COLORS } from "./colorData";
