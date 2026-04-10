import { useMemo } from "react";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useTeachers } from "@/hooks/useTeachers";
import { INITIAL_STATS, ANNOUNCEMENTS } from "@/assets/data";

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
          {isUp ? "+" : ""}
          {stat.trend}
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
  // Generate attendance data for this week
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const attendanceData = days.map(() => ({
    day: days[Math.floor(Math.random() * days.length)],
    value: Math.floor(Math.random() * (95 - 65 + 1)) + 65,
    total: 100,
  }));

  const max = Math.max(...attendanceData.map((d) => d.value));
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-[#08060d]">
            Kehadiran Minggu Ini
          </h2>
          <p className="text-[12px] text-[#9ca3af] mt-0.5">
            Persentase kehadiran siswa harian
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6C63FF] inline-block" />
          <span className="text-[12px] text-[#6b6375]">Kehadiran (%)</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2.5 flex-1 pt-2">
        {attendanceData.map((d, i) => {
          const heightPct = (d.value / max) * 100;
          const isToday = i === (today === 0 ? 6 : today - 1);
          return (
            <div
              key={d.day + i}
              className="flex flex-col items-center gap-2 flex-1 group"
            >
              <div className="relative flex flex-col items-center w-full">
                {/* Tooltip */}
                <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[11px] font-semibold text-[#6C63FF] bg-[rgba(108,99,255,0.08)] px-2 py-0.5 rounded-md whitespace-nowrap">
                  {d.value}%
                </span>
                {/* Bar background */}
                <div
                  className="w-full rounded-xl overflow-hidden"
                  style={{
                    height: "140px",
                    background: "rgba(108,99,255,0.06)",
                  }}
                >
                  {/* Bar fill */}
                  <div
                    className="w-full rounded-xl transition-all duration-700 mt-auto"
                    style={{
                      height: `${heightPct}%`,
                      marginTop: `${100 - heightPct}%`,
                      background: isToday
                        ? "linear-gradient(180deg, #6C63FF, #8A7BFF)"
                        : "linear-gradient(180deg, #A5A0FF, #C4C1FF)",
                      boxShadow: isToday
                        ? "0 4px 12px rgba(108,99,255,0.3)"
                        : "none",
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
          {Math.round(
            attendanceData.reduce((s, d) => s + d.value, 0) /
              attendanceData.length,
          )}
          %
        </span>
      </div>
    </div>
  );
}

const PRIORITY_CONFIG = {
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

function AnnouncementCard() {
  const announcements = ANNOUNCEMENTS;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-[#08060d]">
            Pengumuman
          </h2>
          <p className="text-[12px] text-[#9ca3af] mt-0.5">
            Notifikasi & info penting
          </p>
        </div>
        <button className="text-[12px] text-[#6C63FF] font-medium hover:underline flex items-center gap-0.5">
          Lihat semua <ChevronRight size={13} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
        {announcements.map((a) => {
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
                  <p className="text-[13px] font-semibold text-[#08060d] truncate">
                    {a.title}
                  </p>
                  <span
                    className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ color: cfg.color, background: cfg.bg }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="text-[12px] text-[#6b6375] leading-snug line-clamp-1">
                  {a.desc}
                </p>
                <p className="text-[11px] text-[#9ca3af] mt-1">{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScheduleCard({ scheduleData, teachersData, loading }) {
  const colors = [
    "#6C63FF",
    "#60A5FA",
    "#A78BFA",
    "#34D399",
    "#FBBF24",
    "#F9A8D4",
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-4 h-full items-center justify-center">
        <RefreshCw size={24} className="text-[#6C63FF] animate-spin" />
        <p className="text-sm text-[#9ca3af]">Memuat jadwal...</p>
      </div>
    );
  }

  const schedule =
    scheduleData && scheduleData.length > 0
      ? scheduleData.map((s, idx) => ({
          id: s.id,
          subject: s.name || s.classCode || "Kelas",
          teacher: s.teacher || "Guru",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.teacher || idx}`,
          room: s.room || "Ruang",
          start: s.schedule?.split(" ")[1]?.slice(0, 5) || "07.30",
          end: "09.00",
          status: "upcoming",
          color: colors[idx % colors.length],
        }))
      : [];

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-[#08060d]">
            Jadwal Hari Ini
          </h2>
          <p className="text-[12px] text-[#9ca3af] mt-0.5">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <button className="text-[12px] text-[#6C63FF] font-medium hover:underline flex items-center gap-0.5">
          Lihat semua <ChevronRight size={13} />
        </button>
      </div>

      {schedule.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center py-8">
          <div>
            <BookOpen
              size={32}
              className="text-[#9ca3af] mx-auto mb-2 opacity-50"
            />
            <p className="text-sm text-[#9ca3af]">Tidak ada jadwal hari ini</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {schedule.slice(0, 5).map((s) => {
            const STATUS_CONFIG = {
              done: {
                label: "Selesai",
                color: "#059669",
                bg: "rgba(5,150,105,0.08)",
              },
              ongoing: {
                label: "Berlangsung",
                color: "#6C63FF",
                bg: "rgba(108,99,255,0.1)",
              },
              upcoming: {
                label: "Upcoming",
                color: "#D97706",
                bg: "rgba(217,119,6,0.08)",
              },
            };
            const cfg = STATUS_CONFIG[s.status];
            const isOngoing = s.status === "ongoing";
            return (
              <div
                key={s.id}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-[#F8FAFC] cursor-pointer"
                style={{
                  border: isOngoing
                    ? `1.5px solid ${s.color}30`
                    : "1.5px solid transparent",
                  background: isOngoing ? `${s.color}05` : undefined,
                }}
              >
                <div className="flex flex-col items-center shrink-0 w-[46px] gap-0.5">
                  <span className="text-[12px] font-bold text-[#08060d]">
                    {s.start}
                  </span>
                  <div className="w-px h-3 bg-[#E5E7EB]" />
                  <span className="text-[11px] text-[#9ca3af]">{s.end}</span>
                </div>

                <div
                  className="w-[3px] h-10 rounded-full shrink-0"
                  style={{ background: s.color }}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#08060d] truncate">
                    {s.subject}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <img
                      src={s.avatar}
                      alt={s.teacher}
                      className="w-4 h-4 rounded-full object-cover"
                      style={{ background: `${s.color}20` }}
                    />
                    <span className="text-[11px] text-[#6b6375] truncate">
                      {s.teacher}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock size={10} className="text-[#9ca3af]" />
                    <span className="text-[11px] text-[#9ca3af]">{s.room}</span>
                  </div>
                </div>

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
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────

export default function HomePage() {
  const { teachers, loading: teachersLoading } = useTeachers();
  // const { schedule, loading: scheduleLoading } = useTeacherSchedule();
  const { classes, loading: classesLoading } = useClasses();

  const hour = new Date().getHours();
  const greeting =
    hour < 11
      ? "Selamat pagi"
      : hour < 15
        ? "Selamat siang"
        : hour < 18
          ? "Selamat sore"
          : "Selamat malam";

  // Compute stats from real data
  const stats = useMemo(() => {
    const totalTeachers = teachers.length || 0;
    const totalClasses = classes.length || 0;
    const totalStudents =
      classes.reduce((sum, c) => sum + (c.students || 0), 0) || 0;

    return [
      { ...INITIAL_STATS[0], value: totalTeachers },
      { ...INITIAL_STATS[1], value: totalStudents },
      { ...INITIAL_STATS[2], value: totalClasses },
      INITIAL_STATS[3],
    ];
  }, [teachers, classes]);

  if (teachersLoading || classesLoading /* || scheduleLoading */) {
    return (
      <div className="flex items-center justify-center h-full bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="text-[#6C63FF] animate-spin" />
          <p className="text-[#6b6375]">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-6 min-h-full">
      {/* ── Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#08060d] tracking-tight leading-tight">
            {greeting}, Admin 👋
          </h1>
          <p className="text-[13px] text-[#9ca3af] mt-0.5">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(108,99,255,0.08)] border border-[rgba(108,99,255,0.15)]">
          <CheckCircle2 size={15} className="text-[#6C63FF]" />
          <span className="text-[13px] font-medium text-[#6C63FF]">
            Sistem berjalan normal
          </span>
        </div>
      </div>

      {/* ── Baris 1: Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} />
        ))}
      </div>

      {/* ── Baris 2: Chart + Announcements */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        style={{ minHeight: "280px" }}
      >
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>
        <div>
          <AnnouncementCard />
        </div>
      </div>

      {/* ── Baris 3: Schedule */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        style={{ minHeight: "360px" }}
      >
        <div className="lg:col-span-2">
          <ScheduleCard
            scheduleData={classes}
            teachersData={teachers}
            loading={classesLoading}
          />
        </div>
      </div>
    </div>
  );
}
