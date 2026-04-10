import ROOMS from "@/assets/data/roomData";
import SUBJECT_COLORS from "@/assets/data/colorData";
import { DAYS } from "@/assets/data";
import { useState, useMemo } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Search,
  ChevronDown,
  Clock,
  MapPin,
  Calendar,
} from "lucide-react";

export default function ScheduleTab({ schedule, onRegenerate }) {
  const [filterDay, setFilterDay] = useState("Semua");
  const [filterRoom, setFilterRoom] = useState("Semua");
  const [search, setSearch] = useState("");

  const conflicts = schedule.filter((s) => s.conflict).length;

  const filtered = useMemo(
    () =>
      schedule.filter((s) => {
        const dayOk = filterDay === "Semua" || s.day === filterDay;
        const roomOk = filterRoom === "Semua" || s.room === filterRoom;
        const searchOk =
          !search || s.className.toLowerCase().includes(search.toLowerCase());
        return dayOk && roomOk && searchOk;
      }),
    [schedule, filterDay, filterRoom, search],
  );

  const grouped = useMemo(() => {
    const map = {};
    for (const s of filtered) {
      if (!map[s.classId])
        map[s.classId] = {
          className: s.className,
          subject: s.subject,
          sessions: [],
        };
      map[s.classId].sessions.push(s);
    }
    return Object.values(map);
  }, [filtered]);

  const handleExport = () => {
    const rows = ["Kelas,Mata Pelajaran,Ruangan,Hari,Jam,Durasi,Status"];
    schedule.forEach((s) =>
      rows.push(
        `"${s.className}","${s.subject}","${s.room}","${s.day}","${s.time}","${s.duration} menit","${s.conflict ? "BENTROK" : "OK"}"`,
      ),
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jadwal-kelas.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (schedule.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(108,99,255,0.08)] flex items-center justify-center">
          <Calendar size={28} className="text-[#6C63FF]" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-[#08060d] text-sm">
            Jadwal belum di-generate
          </p>
          <p className="text-xs text-[#9ca3af] mt-1">
            Klik tombol "Generate Jadwal" di kanan atas untuk mulai
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Status bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(108,99,255,0.08)] border border-[rgba(108,99,255,0.2)]">
          <CheckCircle2 size={14} className="text-[#6C63FF]" />
          <span className="text-xs font-medium text-[#6C63FF]">
            {schedule.length - conflicts} sesi berhasil
          </span>
        </div>
        {conflicts > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200">
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-xs font-medium text-red-600">
              {conflicts} bentrok terdeteksi
            </span>
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#6b6375] border border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors"
          >
            <RefreshCw size={13} /> Generate Ulang
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6C63FF,#8A7BFF)" }}
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex items-center h-9 px-3 gap-2 rounded-xl border border-[#E5E7EB] bg-white flex-1 min-w-40 max-w-65 focus-within:border-[#6C63FF] transition-all">
          <Search size={13} className="text-[#9ca3af] shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kelas..."
            className="flex-1 bg-transparent text-sm text-[#08060d] placeholder:text-[#9ca3af] outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-xl border border-[#E5E7EB] text-sm text-[#6b6375] bg-white focus:outline-none focus:border-[#6C63FF] appearance-none cursor-pointer"
          >
            <option value="Semua">Semua Hari</option>
            {DAYS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
          />
        </div>
        <div className="relative">
          <select
            value={filterRoom}
            onChange={(e) => setFilterRoom(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-xl border border-[#E5E7EB] text-sm text-[#6b6375] bg-white focus:outline-none focus:border-[#6C63FF] appearance-none cursor-pointer"
          >
            <option value="Semua">Semua Ruangan</option>
            {ROOMS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
          />
        </div>
      </div>

      {/* Grouped list */}
      <div className="space-y-3">
        {grouped.length === 0 ? (
          <div className="text-center py-12 text-sm text-[#9ca3af]">
            Tidak ada jadwal sesuai filter
          </div>
        ) : (
          grouped.map((group) => {
            const color = SUBJECT_COLORS[group.subject] || {
              bg: "bg-gray-50",
              text: "text-gray-700",
              dot: "bg-gray-400",
            };
            const hasConflict = group.sessions.some((s) => s.conflict);
            return (
              <div
                key={group.className}
                className={`bg-white rounded-2xl border overflow-hidden ${hasConflict ? "border-red-200" : "border-[#E5E7EB]"}`}
              >
                <div
                  className={`flex items-center gap-3 px-5 py-3 border-b ${color.bg} ${hasConflict ? "border-red-100" : "border-[#E5E7EB]"}`}
                >
                  <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                  <span className={`text-sm font-semibold ${color.text}`}>
                    {group.className}
                  </span>
                  {hasConflict && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-red-500 ml-1">
                      <AlertTriangle size={11} /> Ada bentrok
                    </span>
                  )}
                  <span className={`text-xs ${color.text} opacity-60 ml-auto`}>
                    {group.sessions.length} sesi
                  </span>
                </div>
                <div className="divide-y divide-[#F1F5F9]">
                  {group.sessions
                    .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day))
                    .map((s) => (
                      <div
                        key={s.id}
                        className={`flex items-center gap-4 px-5 py-3 transition-colors ${s.conflict ? "bg-red-50 hover:bg-red-50" : "hover:bg-[#F8FAFC]"}`}
                      >
                        <span className="text-xs font-semibold text-[#08060d] w-16 shrink-0">
                          {s.day}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-[#6b6375] w-20 shrink-0">
                          <Clock size={11} className="text-[#9ca3af]" />
                          {s.time}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#6b6375] flex-1">
                          <MapPin size={11} className="text-[#9ca3af]" />
                          {s.room}
                        </div>
                        <span className="text-xs text-[#9ca3af]">
                          {s.duration} mnt
                        </span>
                        {s.conflict ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-100 px-2.5 py-1 rounded-lg">
                            <AlertTriangle size={11} /> Bentrok
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 size={11} /> OK
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
