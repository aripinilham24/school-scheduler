import { PRIORITY_CONFIG } from "@/assets/data";
import { ANNOUNCEMENTS } from "@/assets/data";
import { ChevronRight } from "lucide-react";

export function AnnouncementCard() {
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