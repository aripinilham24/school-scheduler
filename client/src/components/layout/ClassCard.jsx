import { useState } from "react";
import SUBJECT_COLORS from "@/assets/data/colorData";
import {
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Users,
  MoreVertical,
} from "lucide-react";

export default function ClassCard({ cls, onEdit, onDelete, onView }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const color = SUBJECT_COLORS[cls.subject] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-400",
  };

  return (
    <div
      className="group bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#c4c0ff] hover:shadow-[0_4px_20px_rgba(108,99,255,0.1)] transition-all duration-200 cursor-pointer"
      onClick={() => onView(cls)}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${color.bg} ${color.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
          {cls.subject}
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
                    onEdit(cls);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6b6375] hover:bg-[#F8FAFC] hover:text-[#08060d] transition-colors"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(cls.id);
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

      <h3 className="font-semibold text-[#08060d] text-[15px] leading-snug mb-3 line-clamp-2">
        {cls.name}
      </h3>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <MapPin size={12} className="text-[#9ca3af] shrink-0" />
          <span>{cls.room}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <Clock size={12} className="text-[#9ca3af] shrink-0" />
          <span>
            {cls.duration} menit · {cls.sessionsPerWeek}x/minggu
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <Users size={12} className="text-[#9ca3af] shrink-0" />
          <span>{cls.students} siswa</span>
        </div>
      </div>
    </div>
  );
}
