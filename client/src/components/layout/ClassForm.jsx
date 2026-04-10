import { useState } from "react";
import ROOMS from "@/assets/data/roomData";

const FORM_DEFAULTS = { name: "", subject: "", room: "R-101", duration: 90, sessionsPerWeek: 2, students: 20 };

export default function ClassForm({ initial = FORM_DEFAULTS, onSave, onClose, isEdit }) {
  const [form, setForm] = useState({ ...FORM_DEFAULTS, ...initial });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Nama Kelas</label>
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="cth. Matematika Kelas X"
          className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Mata Pelajaran</label>
        <input
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          placeholder="cth. Matematika"
          className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Ruangan</label>
          <select
            value={form.room}
            onChange={(e) => set("room", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] transition-all bg-white"
          >
            {ROOMS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Jumlah Siswa</label>
          <input
            type="number" min={1}
            value={form.students}
            onChange={(e) => set("students", +e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Durasi (menit)</label>
          <select
            value={form.duration}
            onChange={(e) => set("duration", +e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] transition-all bg-white"
          >
            {[45, 60, 90, 120].map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Pertemuan/Minggu</label>
          <select
            value={form.sessionsPerWeek}
            onChange={(e) => set("sessionsPerWeek", +e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] transition-all bg-white"
          >
            {[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}x</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2.5 pt-2">
        <button
          onClick={onClose}
          className="flex-1 h-10 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#6b6375] hover:bg-[#F8FAFC] transition-colors"
        >
          Batal
        </button>
        <button
          onClick={() => { if (form.name && form.subject) { onSave(form); onClose(); } }}
          className="flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #6C63FF, #8A7BFF)" }}
        >
          {isEdit ? "Simpan Perubahan" : "Tambah Kelas"}
        </button>
      </div>
    </div>
  );
}