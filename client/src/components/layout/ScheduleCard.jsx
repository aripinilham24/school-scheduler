import { ChevronRight, BookOpen, Clock, RefreshCw } from "lucide-react";

export function ScheduleCard({ scheduleData, teachersData, loading }) {
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
                <div className="flex flex-col items-center shrink-0 w-11.5 gap-0.5">
                  <span className="text-[12px] font-bold text-[#08060d]">
                    {s.start}
                  </span>
                  <div className="w-px h-3 bg-[#E5E7EB]" />
                  <span className="text-[11px] text-[#9ca3af]">{s.end}</span>
                </div>

                <div
                  className="w-0.75 h-10 rounded-full shrink-0"
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
