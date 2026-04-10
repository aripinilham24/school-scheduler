import { Users, MapPin, Clock, Calendar } from "lucide-react";
import SUBJECT_COLORS from "@/assets/data/colorData";
import Modal from "./Modal";
import { BookOpen } from "lucide-react";

export default function DetailModal({ cls, onClose }) {
  const color = SUBJECT_COLORS[cls.subject] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-400",
  };
  return (
    <Modal title="Detail Kelas" onClose={onClose}>
      <div className="space-y-4">
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${color.bg}`}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/60">
            <BookOpen size={18} className={color.text} />
          </div>
          <div>
            <p className={`font-semibold text-[15px] ${color.text}`}>
              {cls.name}
            </p>
            <p className={`text-xs ${color.text} opacity-70`}>{cls.subject}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: MapPin, label: "Ruangan", value: cls.room },
            { icon: Users, label: "Siswa", value: `${cls.students} orang` },
            { icon: Clock, label: "Durasi", value: `${cls.duration} menit` },
            {
              icon: Calendar,
              label: "Pertemuan",
              value: `${cls.sessionsPerWeek}x / minggu`,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[#F8FAFC] rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[#9ca3af] mb-1">
                <Icon size={12} />
                <span className="text-xs">{label}</span>
              </div>
              <p className="text-sm font-semibold text-[#08060d]">{value}</p>
            </div>
          ))}
        </div>
        <div className="bg-[rgba(108,99,255,0.06)] rounded-xl p-3">
          <p className="text-xs text-[#6b6375]">Total jam per minggu</p>
          <p className="text-lg font-bold text-[#6C63FF]">
            {((cls.duration * cls.sessionsPerWeek) / 60).toFixed(1)} jam
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full h-10 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#6b6375] hover:bg-[#F8FAFC] transition-colors"
        >
          Tutup
        </button>
      </div>
    </Modal>
  );
}
