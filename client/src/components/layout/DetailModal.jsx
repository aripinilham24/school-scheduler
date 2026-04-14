import { Users, MapPin, Clock, Calendar } from "lucide-react";
import SUBJECT_COLORS from "@/assets/data/colorData";
import Modal from "./Modal";
import { BookOpen } from "lucide-react";

export default function DetailModal({ mapel, onClose }) {
  const color = SUBJECT_COLORS[mapel.name] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-400",
  };

  return (
    <Modal title="Detail Mata Pelajaran" onClose={onClose}>
      <div className="space-y-4">
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${color.bg}`}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/60">
            <BookOpen size={18} className={color.text} />
          </div>
          <div>
            <p className={`font-semibold text-[15px] ${color.text}`}>{mapel.name}</p>
            <p className={`text-xs ${color.text} opacity-70`}>{mapel.code}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: MapPin, label: "Guru", value: mapel.teacher || "-" },
            { icon: Users, label: "SKS", value: `${mapel.credits ?? 0} SKS` },
            { icon: Clock, label: "Jam", value: `${mapel.hours ?? 0} jam` },
            { icon: Calendar, label: "Status", value: mapel.status || "-" },
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

        {mapel.description ? (
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
            <p className="text-[13px] text-[#6b6375]">Deskripsi</p>
            <p className="mt-2 text-sm text-[#08060d]">{mapel.description}</p>
          </div>
        ) : null}

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
