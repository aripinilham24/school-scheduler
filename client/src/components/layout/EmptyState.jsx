import { GraduationCap } from "lucide-react";

export function EmptyState({ message, dataIdentity}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(108,99,255,0.08)] flex items-center justify-center">
        <GraduationCap size={28} className="text-[#6C63FF]" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-[#08060d] text-sm">{message}</p>
        <p className="text-xs text-[#9ca3af] mt-1">
          Klik tombol "Tambah {dataIdentity}" untuk mulai menambahkan data
        </p>
      </div>
    </div>
  );
}