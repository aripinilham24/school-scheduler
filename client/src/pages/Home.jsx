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
import { INITIAL_STATS } from "@/assets/data";
import StatCard from "@/components/layout/StatCard";
import { AttendanceChart } from "@/components/layout/AttendanceChart";
import { AnnouncementCard } from "@/components/layout/AnnouncementCard";
import { ScheduleCard } from "@/components/layout/ScheduleCard";

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
