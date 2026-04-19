import { useState } from "react";
import ROOMS from "@/assets/data/roomData";

const FORM_DEFAULTS = {
  name: "",
  code: "",
  grade: 10,
  major: "IPA",
  room: "R-101",
  students: 30,
  capacity: 40,
  status: "Active",
  description: "",
};

const grades = [10, 11, 12];
const majors = ["IPA", "IPS", "Bahasa", "Teknologi"];

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
          placeholder="cth. Kelas X-IPA-1"
          className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Kode</label>
          <input
            value={form.code}
            onChange={(e) => set("code", e.target.value)}
            placeholder="cth. X-IPA-1"
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Tahun</label>
          <select
            value={form.grade}
            onChange={(e) => set("grade", parseInt(e.target.value))}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] transition-all bg-white"
          >
            {grades.map((g) => <option key={g} value={g}>Kelas {g}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Jurusan</label>
          <select
            value={form.major}
            onChange={(e) => set("major", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] transition-all bg-white"
          >
            {majors.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
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
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Siswa</label>
          <input
            type="number"
            min={0}
            value={form.students}
            onChange={(e) => set("students", parseInt(e.target.value) || 0)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Kapasitas</label>
          <input
            type="number"
            min={1}
            value={form.capacity}
            onChange={(e) => set("capacity", parseInt(e.target.value) || 40)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] transition-all bg-white"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Deskripsi (opsional)</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Catatan atau deskripsi kelas..."
          rows={2}
          className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all resize-none"
        />
      </div>

      <div className="flex gap-2.5 pt-2">
        <button
          onClick={onClose}
          className="flex-1 h-10 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#6b6375] hover:bg-[#F8FAFC] transition-colors"
        >
          Batal
        </button>
        <button
          onClick={() => {
            if (form.name && form.code) {
              onSave(form);
              onClose();
            }
          }}
          className="flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #6C63FF, #8A7BFF)" }}
        >
          {isEdit ? "Simpan Perubahan" : "Tambah Kelas"}
        </button>
      </div>
    </div>
  );
}