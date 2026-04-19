// Empty initial classes - data should come from API
export const INITIAL_CLASSES = [];

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

export const AVATAR_COLORS = [
  { bg: "bg-[rgba(108,99,255,0.12)]", text: "text-[#534AB7]" },
  { bg: "bg-[rgba(29,158,117,0.12)]", text: "text-[#0F6E56]" },
  { bg: "bg-[rgba(216,90,48,0.12)]", text: "text-[#993C1D]" },
  { bg: "bg-[rgba(212,83,126,0.12)]", text: "text-[#993556]" },
];

import { AlertTriangle, Bell, Info } from "lucide-react";
export const SUBJECT_COLORS_MAPEL = [
  {
    bg: "bg-[rgba(108,99,255,0.12)]",
    text: "text-[#534AB7]",
    dot: "bg-[#6C63FF]",
  },
  {
    bg: "bg-[rgba(29,158,117,0.12)]",
    text: "text-[#0F6E56]",
    dot: "bg-[#10B981]",
  },
  {
    bg: "bg-[rgba(216,90,48,0.12)]",
    text: "text-[#993C1D]",
    dot: "bg-[#F97316]",
  },
  {
    bg: "bg-[rgba(212,83,126,0.12)]",
    text: "text-[#993556]",
    dot: "bg-[#EC4899]",
  },
  {
    bg: "bg-[rgba(59,130,246,0.12)]",
    text: "text-[#1E40AF]",
    dot: "bg-[#3B82F6]",
  },
];
export const PRIORITY_CONFIG = {
  high: {
    icon: AlertTriangle,
    color: "#E11D48",
    bg: "rgba(225,29,72,0.08)",
    label: "Penting",
  },
  medium: {
    icon: Bell,
    color: "#D97706",
    bg: "rgba(217,119,6,0.08)",
    label: "Sedang",
  },
  info: {
    icon: Info,
    color: "#2563EB",
    bg: "rgba(37,99,235,0.08)",
    label: "Info",
  },
};
export { default as ROOMS } from "./roomData";
export { default as SUBJECT_COLORS } from "./colorData";
