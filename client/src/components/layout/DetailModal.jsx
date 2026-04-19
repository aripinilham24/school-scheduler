import { Users, MapPin, GraduationCap, BookOpen } from "lucide-react";
import Modal from "./Modal";

const gradeNames = {
  10: "Kelas X",
  11: "Kelas XI",
  12: "Kelas XII",
};

const majorColors = {
  IPA: { bg: "bg-blue-50", text: "text-blue-700" },
  IPS: { bg: "bg-purple-50", text: "text-purple-700" },
  Bahasa: { bg: "bg-green-50", text: "text-green-700" },
  Teknologi: { bg: "bg-orange-50", text: "text-orange-700" },
};

export default function DetailModal({ cls, onClose }) {
  const color = majorColors[cls.major] || { bg: "bg-gray-50", text: "text-gray-700" };
  const gradeLabel = gradeNames[cls.grade] || `Grade ${cls.grade}`;

  return (
    <Modal title="Detail Kelas" onClose={onClose}>
      <div className="space-y-4">
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${color.bg}`}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/60">
            <GraduationCap size={18} className={color.text} />
          </div>
          <div>
            <p className={`font-semibold text-[15px] ${color.text}`}>{cls.name}</p>
            <p className={`text-xs ${color.text} opacity-70`}>{cls.code}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: GraduationCap, label: "Tahun", value: gradeLabel },
            { icon: BookOpen, label: "Jurusan", value: cls.major || "Umum" },
            { icon: MapPin, label: "Ruangan", value: cls.room || "-" },
            { icon: Users, label: "Siswa", value: `${cls.students || 0} / ${cls.capacity || 40}` },
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

        {cls.description ? (
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
            <p className="text-[13px] text-[#6b6375]">Deskripsi</p>
            <p className="mt-2 text-sm text-[#08060d]">{cls.description}</p>
          </div>
        ) : null}

        <div className="bg-[#F8FAFC] rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-[#9ca3af] mb-1">
            <BookOpen size={12} />
            <span className="text-xs">Status</span>
          </div>
          <p className="text-sm font-semibold text-[#08060d]">{cls.status || "Active"}</p>
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
