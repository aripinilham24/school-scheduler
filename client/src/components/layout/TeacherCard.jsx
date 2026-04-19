import { useState } from "react";
import { AVATAR_COLORS } from "@/assets/data";
import { getInitials } from "@/utils/getInitials";
import { getStatusClasses } from "@/utils/getStatusCLasses";
import { Edit2, Star, BookOpen, MoreVertical, Users, Trash2 } from "lucide-react";

export function TeacherCard({ teacher, index, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div className="group bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#c4c0ff] hover:shadow-[0_4px_20px_rgba(108,99,255,0.1)] transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${c.bg} ${c.text} flex items-center justify-center text-[13px] font-semibold shrink-0`}
          >
            {getInitials(teacher.name)}
          </div>
          <div>
            <p className="font-semibold text-[14px] text-[#08060d] leading-snug">
              {teacher.name}
            </p>
            <p className="text-xs text-[#9ca3af] mt-0.5">
              {teacher.subject ?? "-"}
            </p>
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
                    onEdit(teacher);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6b6375] hover:bg-[#F8FAFC] hover:text-[#08060d] transition-colors"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(teacher);
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
        className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold mb-4 ${getStatusClasses(teacher.status)}`}
      >
        {teacher.status ?? "Unknown"}
      </span>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <Star size={12} className="text-[#9ca3af] shrink-0" />
          <span>Rating {Number(teacher.rating ?? 0).toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <Users size={12} className="text-[#9ca3af] shrink-0" />
          <span>{teacher.students ?? 0} siswa</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <BookOpen size={12} className="text-[#9ca3af] shrink-0" />
          <span>{teacher.courses ?? 0} kelas</span>
        </div>
        {teacher.grades && teacher.grades.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {teacher.grades.map((grade) => (
              <span key={grade} className="text-[10px] px-2 py-1 rounded bg-blue-50 text-blue-700 font-medium">
                Kelas {grade}
              </span>
            ))}
          </div>
        )}
        {teacher.majors && teacher.majors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {teacher.majors.map((major) => (
              <span key={major} className="text-[10px] px-2 py-1 rounded bg-purple-50 text-purple-700 font-medium">
                {major}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
