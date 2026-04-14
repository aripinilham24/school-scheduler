import { useState } from "react";
import { getStatusClasses } from "@/utils/getStatusCLasses";
import { MoreVertical, Edit2, Trash2, GraduationCap, Code, BookOpen, Clock } from "lucide-react";
import { SUBJECT_COLORS_MAPEL } from "@/assets/data";


export function MapelCard({ mapel, index, onEdit, onDelete, onView }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const c = SUBJECT_COLORS_MAPEL[index % SUBJECT_COLORS_MAPEL.length];

  return (
    <div
      className="group bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#c4c0ff] hover:shadow-[0_4px_20px_rgba(108,99,255,0.1)] transition-all duration-200 cursor-pointer"
      onClick={() => onView(mapel)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${c.bg} ${c.text} flex items-center justify-center text-[13px] font-semibold shrink-0`}
          >
            {mapel.code?.slice(0, 2).toUpperCase() || "M"}
          </div>
          <div>
            <p className="font-semibold text-[14px] text-[#08060d] leading-snug">
              {mapel.name}
            </p>
            <p className="text-xs text-[#9ca3af] mt-0.5">{mapel.code ?? "-"}</p>
          </div>
        </div>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-[#9ca3af] hover:bg-[#F1F5F9] hover:text-[#08060d] transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={14} />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 w-36 bg-white rounded-xl border border-[#E5E7EB] shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => {
                    onEdit(mapel);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6b6375] hover:bg-[#F8FAFC] hover:text-[#08060d] transition-colors"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(mapel);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#FF4757] hover:bg-[#FFF1F2] transition-colors"
                >
                  <Trash2 size={13} /> Hapus
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <span
        className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold mb-4 ${getStatusClasses(mapel.status)}`}
      >
        {mapel.status ?? "Unknown"}
      </span>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <GraduationCap size={12} className="text-[#9ca3af] shrink-0" />
          <span className="font-medium">Guru: {mapel.teacher ?? "-"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <Code size={12} className="text-[#9ca3af] shrink-0" />
          <span>Level: {mapel.level ?? "-"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <BookOpen size={12} className="text-[#9ca3af] shrink-0" />
          <span>{mapel.credits ?? 0} SKS</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <Clock size={12} className="text-[#9ca3af] shrink-0" />
          <span>{mapel.hours ?? 0} jam</span>
        </div>
      </div>
    </div>
  );
}
