import { useState } from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  Video,
  TrendingUp,
  TrendingDown,
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ChevronRight,
  UserPlus,
  BookPlus,
  CreditCard,
  CalendarCheck,
} from "lucide-react";

// ── Dummy Data ───────────────────────────────────────────────

const STATS = [
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
    label: "Kursus Aktif",
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

const ATTENDANCE = [
  { day: "Sen", value: 87, total: 100 },
  { day: "Sel", value: 92, total: 100 },
  { day: "Rab", value: 78, total: 100 },
  { day: "Kam", value: 95, total: 100 },
  { day: "Jum", value: 88, total: 100 },
  { day: "Sab", value: 65, total: 100 },
  { day: "Min", value: 45, total: 100 },
];

const ANNOUNCEMENTS = [
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
    title: "Pendaftaran Kursus Baru",
    desc: "Kursus Data Science batch 3 resmi dibuka.",
    priority: "info",
    time: "1 hari lalu",
  },
  {
    id: 4,
    title: "Pembayaran SPP",
    desc: "Tenggat pembayaran SPP bulan Juli: 10 Juli 2025.",
    priority: "high",
    time: "1 hari lalu",
  },
];

const SCHEDULE = [
  {
    id: 1,
    subject: "Mathematics",
    teacher: "Dr. Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    room: "Ruang A1",
    start: "07.30",
    end: "09.00",
    status: "done",
    color: "#6C63FF",
  },
  {
    id: 2,
    subject: "Physics",
    teacher: "Prof. Michael Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    room: "Lab Fisika",
    start: "09.15",
    end: "10.45",
    status: "ongoing",
    color: "#60A5FA",
  },
  {
    id: 3,
    subject: "Computer Science",
    teacher: "Mr. Rizky Pratama",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rizky",
    room: "Lab Komputer",
    start: "11.00",
    end: "12.30",
    status: "upcoming",
    color: "#A78BFA",
  },
  {
    id: 4,
    subject: "English Literature",
    teacher: "Ms. Ayu Rahmawati",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ayu",
    room: "Ruang B2",
    start: "13.30",
    end: "15.00",
    status: "upcoming",
    color: "#34D399",
  },
  {
    id: 5,
    subject: "Biology",
    teacher: "Dr. Lisa Huang",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    room: "Lab Biologi",
    start: "15.15",
    end: "16.45",
    status: "upcoming",
    color: "#FBBF24",
  },
];

const ACTIVITIES = [
  {
    id: 1,
    icon: UserPlus,
    color: "#6C63FF",
    bg: "rgba(108,99,255,0.08)",
    text: "Siswa baru **Budi Santoso** mendaftar ke kursus Mathematics",
    time: "5 menit lalu",
  },
  {
    id: 2,
    icon: BookPlus,
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    text: "Kursus baru **Data Science Batch 3** berhasil ditambahkan",
    time: "32 menit lalu",
  },
  {
    id: 3,
    icon: CreditCard,
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    text: "Pembayaran SPP dari **Dewi Lestari** telah dikonfirmasi",
    time: "1 jam lalu",
  },
  {
    id: 4,
    icon: UserPlus,
    color: "#6C63FF",
    bg: "rgba(108,99,255,0.08)",
    text: "Guru baru **Prof. Ahmad Fauzi** berhasil ditambahkan",
    time: "2 jam lalu",
  },
  {
    id: 5,
    icon: CalendarCheck,
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    text: "Jadwal kelas **Physics** diperbarui untuk minggu depan",
    time: "3 jam lalu",
  },
  {
    id: 6,
    icon: CreditCard,
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    text: "Pembayaran SPP dari **Rizky Pratama** telah dikonfirmasi",
    time: "4 jam lalu",
  },
];

// ── Sub Components ───────────────────────────────────────────

function StatCard({ stat, index }) {
  const isUp = stat.trend >= 0;
  return (
    <div
      className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-4 hover:shadow-[0_8px_24px_rgba(108,99,255,0.1)] transition-all duration-300 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl"
          style={{ background: stat.bg }}
        >
          <stat.icon size={20} style={{ color: stat.color }} strokeWidth={2} />
        </div>
        <span
          className="flex items-center gap-1 text-[12px] font-semibold px-2 py-1 rounded-lg"
          style={{
            color: isUp ? "#059669" : "#E11D48",
            background: isUp ? "rgba(52,211,153,0.1)" : "rgba(225,29,72,0.08)",
          }}
        >
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isUp ? "+" : ""}{stat.trend}
        </span>
      </div>
      <div>
        <p className="text-[26px] font-bold text-[#08060d] leading-none tracking-tight">
          {stat.value.toLocaleString()}
        </p>
        <p className="text-[13px] text-[#6b6375] mt-1.5">{stat.label}</p>
        <p className="text-[11px] text-[#9ca3af] mt-0.5">{stat.trendLabel}</p>
      </div>
    </div>
  );
}

function AttendanceChart() {
  const max = Math.max(...ATTENDANCE.map((d) => d.value));
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-[#08060d]">Kehadiran Minggu Ini</h2>
          <p className="text-[12px] text-[#9ca3af] mt-0.5">Persentase kehadiran siswa harian</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6C63FF] inline-block" />
          <span className="text-[12px] text-[#6b6375]">Kehadiran (%)</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2.5 flex-1 pt-2">
        {ATTENDANCE.map((d, i) => {
          const heightPct = (d.value / max) * 100;
          const isToday = i === 1; // Selasa = hari ini (dummy)
          return (
            <div key={d.day} className="flex flex-col items-center gap-2 flex-1 group">
              <div className="relative flex flex-col items-center w-full">
                {/* Tooltip */}
                <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[11px] font-semibold text-[#6C63FF] bg-[rgba(108,99,255,0.08)] px-2 py-0.5 rounded-md whitespace-nowrap">
                  {d.value}%
                </span>
                {/* Bar background */}
                <div className="w-full rounded-xl overflow-hidden" style={{ height: "140px", background: "rgba(108,99,255,0.06)" }}>
                  {/* Bar fill */}
                  <div
                    className="w-full rounded-xl transition-all duration-700 mt-auto"
                    style={{
                      height: `${heightPct}%`,
                      marginTop: `${100 - heightPct}%`,
                      background: isToday
                        ? "linear-gradient(180deg, #6C63FF, #8A7BFF)"
                        : "linear-gradient(180deg, #A5A0FF, #C4C1FF)",
                      boxShadow: isToday ? "0 4px 12px rgba(108,99,255,0.3)" : "none",
                    }}
                  />
                </div>
              </div>
              <span
                className="text-[11px] font-medium"
                style={{ color: isToday ? "#6C63FF" : "#9ca3af" }}
              >
                {d.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Average */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
        <span className="text-[12px] text-[#9ca3af]">Rata-rata minggu ini</span>
        <span className="text-[14px] font-bold text-[#6C63FF]">
          {Math.round(ATTENDANCE.reduce((s, d) => s + d.value, 0) / ATTENDANCE.length)}%
        </span>
      </div>
    </div>
  );
}

const PRIORITY_CONFIG = {
  high:   { icon: AlertTriangle, color: "#E11D48", bg: "rgba(225,29,72,0.08)",   label: "Penting" },
  medium: { icon: Bell,          color: "#D97706", bg: "rgba(217,119,6,0.08)",   label: "Sedang" },
  info:   { icon: Info,          color: "#2563EB", bg: "rgba(37,99,235,0.08)",   label: "Info" },
};

function AnnouncementCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-[#08060d]">Pengumuman</h2>
          <p className="text-[12px] text-[#9ca3af] mt-0.5">Notifikasi & info penting</p>
        </div>
        <button className="text-[12px] text-[#6C63FF] font-medium hover:underline flex items-center gap-0.5">
          Lihat semua <ChevronRight size={13} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
        {ANNOUNCEMENTS.map((a) => {
          const cfg = PRIORITY_CONFIG[a.priority];
          return (
            <div
              key={a.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] cursor-pointer transition-colors duration-150 group"
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5"
                style={{ background: cfg.bg }}
              >
                <cfg.icon size={14} style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[13px] font-semibold text-[#08060d] truncate">{a.title}</p>
                  <span
                    className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ color: cfg.color, background: cfg.bg }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="text-[12px] text-[#6b6375] leading-snug line-clamp-1">{a.desc}</p>
                <p className="text-[11px] text-[#9ca3af] mt-1">{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  done:     { label: "Selesai",    color: "#059669", bg: "rgba(5,150,105,0.08)" },
  ongoing:  { label: "Berlangsung", color: "#6C63FF", bg: "rgba(108,99,255,0.1)" },
  upcoming: { label: "Upcoming",   color: "#D97706", bg: "rgba(217,119,6,0.08)" },
};

function ScheduleCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-[#08060d]">Jadwal Hari Ini</h2>
          <p className="text-[12px] text-[#9ca3af] mt-0.5">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <button className="text-[12px] text-[#6C63FF] font-medium hover:underline flex items-center gap-0.5">
          Lihat semua <ChevronRight size={13} />
        </button>
      </div>

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {SCHEDULE.map((s) => {
          const cfg = STATUS_CONFIG[s.status];
          const isOngoing = s.status === "ongoing";
          return (
            <div
              key={s.id}
              className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-[#F8FAFC] cursor-pointer"
              style={{
                border: isOngoing ? `1.5px solid ${s.color}30` : "1.5px solid transparent",
                background: isOngoing ? `${s.color}05` : undefined,
              }}
            >
              {/* Time */}
              <div className="flex flex-col items-center shrink-0 w-[46px] gap-0.5">
                <span className="text-[12px] font-bold text-[#08060d]">{s.start}</span>
                <div className="w-px h-3 bg-[#E5E7EB]" />
                <span className="text-[11px] text-[#9ca3af]">{s.end}</span>
              </div>

              {/* Color accent */}
              <div className="w-[3px] h-10 rounded-full shrink-0" style={{ background: s.color }} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#08060d] truncate">{s.subject}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <img
                    src={s.avatar}
                    alt={s.teacher}
                    className="w-4 h-4 rounded-full object-cover"
                    style={{ background: `${s.color}20` }}
                  />
                  <span className="text-[11px] text-[#6b6375] truncate">{s.teacher}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock size={10} className="text-[#9ca3af]" />
                  <span className="text-[11px] text-[#9ca3af]">{s.room}</span>
                </div>
              </div>

              {/* Status */}
              <span
                className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{ color: cfg.color, background: cfg.bg }}
              >
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ── Main Page 

export default function HomePage() {
  const hour = new Date().getHours();
  const greeting =
    hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <div className="flex flex-col gap-5 p-6 min-h-full">

      {/* ── Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#08060d] tracking-tight leading-tight">
            {greeting}, Admin 👋
          </h1>
          <p className="text-[13px] text-[#9ca3af] mt-0.5">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(108,99,255,0.08)] border border-[rgba(108,99,255,0.15)]">
          <CheckCircle2 size={15} className="text-[#6C63FF]" />
          <span className="text-[13px] font-medium text-[#6C63FF]">Sistem berjalan normal</span>
        </div>
      </div>

      {/* ── Baris 1: Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} />
        ))}
      </div>

      {/* ── Baris 2: Chart + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: "280px" }}>
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>
        <div>
          <AnnouncementCard />
        </div>
      </div>

      {/* ── Baris 3: Schedule + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: "360px" }}>
        <div className="lg:col-span-2">
            <ScheduleCard />
        </div>
        {/* <ActivityCard /> */}
      </div>

    </div>
  );
}