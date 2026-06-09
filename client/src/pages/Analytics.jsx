import { useMemo } from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  ClipboardList,
  RefreshCw,
  TrendingUp,
  Clock,
  BarChart3,
  PieChart,
} from "lucide-react";
import { useTeachers } from "@/hooks/useTeachers";
import { useClasses } from "@/hooks/useClasses";
import { useMapel } from "@/hooks/useMapel";
import { useSchedule } from "@/hooks/useSchedule";
import StatCard from "@/components/layout/StatCard";
import { DAYS, INITIAL_STATS } from "@/assets/data";

const COLORS = ["#6C63FF", "#34D399", "#60A5FA", "#F97316", "#EC4899", "#A78BFA", "#FBBF24", "#14B8A6"];
const SECTION_STYLES = "bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-4";

function BarChart({ data, labelKey, valueKey, maxValue, color, height = 180, unit = "" }) {
  const max = maxValue ?? Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div className="flex items-end gap-2 flex-1 pt-2" style={{ height }}>
      {data.map((item, i) => {
        const h = (item[valueKey] / max) * 100;
        return (
          <div key={item[labelKey] + i} className="flex flex-col items-center gap-1.5 flex-1 group">
            <span className="text-[11px] font-semibold text-[#6b6375] opacity-0 group-hover:opacity-100 transition-opacity">
              {item[valueKey]}{unit}
            </span>
            <div className="w-full rounded-lg overflow-hidden flex-1 self-end" style={{ background: `${color}15` }}>
              <div
                className="w-full rounded-lg transition-all duration-700 self-end"
                style={{
                  height: `${h}%`,
                  marginTop: `${100 - h}%`,
                  background: `linear-gradient(180deg, ${color}, ${color}88)`,
                }}
              />
            </div>
            <span className="text-[10px] text-[#9ca3af] text-center leading-tight max-w-[60px] truncate">
              {item[labelKey]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function HorizontalBar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] text-[#6b6375] w-24 shrink-0 truncate text-right">{label}</span>
      <div className="flex-1 h-5 rounded-lg overflow-hidden" style={{ background: `${color}12` }}>
        <div
          className="h-full rounded-lg transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[12px] font-semibold text-[#08060d] w-10 text-right">{value}</span>
    </div>
  );
}

function DayScheduleChart({ schedules }) {
  const dayData = useMemo(() => {
    const counts = { Senin: 0, Selasa: 0, Rabu: 0, Kamis: 0, Jumat: 0 };
    (schedules || []).forEach((s) => {
      if (counts[s.day] !== undefined) counts[s.day]++;
    });
    return DAYS.map((d) => ({ label: d.slice(0, 3), value: counts[d] }));
  }, [schedules]);

  const max = Math.max(...dayData.map((d) => d.value), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-[#08060d]">Distribusi Jadwal per Hari</h3>
        <span className="text-[11px] text-[#9ca3af]">Total: {schedules?.length || 0}</span>
      </div>
      <BarChart data={dayData} labelKey="label" valueKey="value" maxValue={max} color="#6C63FF" height={140} />
    </div>
  );
}

function TeacherSubjectChart({ teachers }) {
  const subjectCounts = useMemo(() => {
    const map = {};
    (teachers || []).forEach((t) => {
      const subj = t.subject || t.mapel || "Lainnya";
      map[subj] = (map[subj] || 0) + 1;
    });
    return Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [teachers]);

  if (subjectCounts.length === 0) return null;

  const max = Math.max(...subjectCounts.map((d) => d.value), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-[#08060d]">Guru per Mata Pelajaran</h3>
        <span className="text-[11px] text-[#9ca3af]">Total: {teachers?.length || 0} guru</span>
      </div>
      <div className="space-y-2">
        {subjectCounts.map((item, i) => (
          <HorizontalBar
            key={item.label}
            label={item.label}
            value={item.value}
            max={max}
            color={COLORS[i % COLORS.length]}
          />
        ))}
      </div>
    </div>
  );
}

function ClassStudentsChart({ classes }) {
  const classData = useMemo(() => {
    return (classes || [])
      .map((c) => ({
        label: c.name || c.classCode || c.id,
        value: c.students || 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [classes]);

  if (classData.length === 0) return null;

  const max = Math.max(...classData.map((d) => d.value), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-semibold text-[#08060d]">Siswa per Kelas</h3>
        <span className="text-[11px] text-[#9ca3af]">
          Total: {classData.reduce((s, c) => s + c.value, 0)} siswa
        </span>
      </div>
      <BarChart
        data={classData.slice(0, 10)}
        labelKey="label"
        valueKey="value"
        maxValue={max}
        color="#34D399"
        height={160}
        unit=""
      />
    </div>
  );
}

function ScheduleSummary({ schedules }) {
  const daysPresent = useMemo(() => {
    const unique = new Set((schedules || []).map((s) => s.day));
    return unique.size;
  }, [schedules]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[rgba(108,99,255,0.06)]">
        <div className="w-8 h-8 rounded-lg bg-[rgba(108,99,255,0.1)] flex items-center justify-center">
          <ClipboardList size={15} className="text-[#6C63FF]" />
        </div>
        <div>
          <p className="text-lg font-bold text-[#08060d]">{schedules?.length || 0}</p>
          <p className="text-[10px] text-[#9ca3af]">Total Jadwal</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[rgba(52,211,153,0.06)]">
        <div className="w-8 h-8 rounded-lg bg-[rgba(52,211,153,0.1)] flex items-center justify-center">
          <Clock size={15} className="text-[#34D399]" />
        </div>
        <div>
          <p className="text-lg font-bold text-[#08060d]">{daysPresent}/5</p>
          <p className="text-[10px] text-[#9ca3af]">Hari Aktif</p>
        </div>
      </div>
    </div>
  );
}

function StatGrid({ data, title, subtitle }) {
  return (
    <div className={SECTION_STYLES}>
      <div>
        <h2 className="text-[15px] font-semibold text-[#08060d]">{title}</h2>
        <p className="text-[12px] text-[#9ca3af] mt-0.5">{subtitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {data.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { teachers, loading: teachersLoading, error: teachersError } = useTeachers();
  const { classes, loading: classesLoading, error: classesError } = useClasses();
  const { mapel, loading: mapelLoading, error: mapelError } = useMapel();
  const { schedules, loading: scheduleLoading, error: scheduleError } = useSchedule();

  const loading = teachersLoading || classesLoading || mapelLoading || scheduleLoading;
  const error = teachersError || classesError || mapelError || scheduleError;

  const totalStudents = useMemo(
    () => classes.reduce((sum, c) => sum + (c.students || 0), 0),
    [classes]
  );

  const summaryStats = useMemo(
    () => [
      { label: "Total Guru", value: teachers.length, icon: GraduationCap, color: "#6C63FF", bg: "rgba(108,99,255,0.08)" },
      { label: "Total Siswa", value: totalStudents, icon: Users, color: "#34D399", bg: "rgba(52,211,153,0.08)" },
      { label: "Total Kelas", value: classes.length, icon: BookOpen, color: "#60A5FA", bg: "rgba(96,165,250,0.08)" },
      { label: "Mata Pelajaran", value: mapel.length, icon: BarChart3, color: "#F97316", bg: "rgba(249,115,22,0.08)" },
      { label: "Jadwal Aktif", value: schedules.length, icon: ClipboardList, color: "#A78BFA", bg: "rgba(167,139,250,0.08)" },
    ],
    [teachers, totalStudents, classes, mapel, schedules]
  );

  const ratioData = useMemo(
    () => [
      {
        label: "Rasio Guru/Siswa",
        value: teachers.length > 0 ? (totalStudents / teachers.length).toFixed(1) : "0",
        icon: TrendingUp,
        color: "#6C63FF",
        bg: "rgba(108,99,255,0.08)",
      },
      {
        label: "Siswa per Kelas",
        value: classes.length > 0 ? (totalStudents / classes.length).toFixed(0) : "0",
        icon: Users,
        color: "#34D399",
        bg: "rgba(52,211,153,0.08)",
      },
      {
        label: "Mapel per Guru",
        value: teachers.length > 0 ? (mapel.length / teachers.length).toFixed(1) : "0",
        icon: BookOpen,
        color: "#60A5FA",
        bg: "rgba(96,165,250,0.08)",
      },
      {
        label: "Jam per Hari",
        value: "—",
        icon: Clock,
        color: "#F97316",
        bg: "rgba(249,115,22,0.08)",
      },
    ],
    [teachers, totalStudents, classes, mapel]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="text-[#6C63FF] animate-spin" />
          <p className="text-[#6b6375]">Memuat data analitik...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-center">
          <p className="font-semibold text-[#08060d] text-sm">Gagal memuat data</p>
          <p className="text-xs text-[#9ca3af] mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-6 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-[#08060d] tracking-tight">
          Analitik & Statistik
        </h1>
        <p className="text-[13px] text-[#9ca3af] mt-0.5">
          Ringkasan data dan metrik sekolah secara menyeluruh
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryStats.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} />
        ))}
      </div>

      {/* Ratio Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ratioData.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={SECTION_STYLES}>
          <TeacherSubjectChart teachers={teachers} />
        </div>
        <div className={SECTION_STYLES}>
          <ClassStudentsChart classes={classes} />
        </div>
      </div>

      {/* Schedule Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={SECTION_STYLES}>
          <DayScheduleChart schedules={schedules} />
        </div>
        <div className={SECTION_STYLES}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-[#08060d]">Ringkasan Jadwal</h3>
          </div>
          <ScheduleSummary schedules={schedules} />
          <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#9ca3af]">Jadwal per Kelas</span>
              <span className="font-semibold text-[#08060d]">
                {classes.length > 0 ? (schedules.length / classes.length).toFixed(1) : "0"}
              </span>
            </div>
          </div>
        </div>
        <div className={SECTION_STYLES}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-[#08060d]">Distribusi Guru</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#6b6375]">Total Guru</span>
              <span className="font-semibold text-[#08060d]">{teachers.length}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#6b6375]">Dengan Jadwal</span>
              <span className="font-semibold text-[#08060d]">
                {new Set((schedules || []).map((s) => s.teacherId)).size}
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#6b6375]">Tanpa Jadwal</span>
              <span className="font-semibold text-[#E11D48]">
                {teachers.length - new Set((schedules || []).map((s) => s.teacherId)).size}
              </span>
            </div>
            <div className="pt-3 border-t border-[#F1F5F9]">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#6b6375]">Total Kelas</span>
                <span className="font-semibold text-[#08060d]">{classes.length}</span>
              </div>
              <div className="flex items-center justify-between text-[13px] mt-2">
                <span className="text-[#6b6375]">Total Mapel</span>
                <span className="font-semibold text-[#08060d]">{mapel.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
