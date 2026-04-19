import { useState } from "react";
import Swal from "sweetalert2";

export const TEACHER_FORM_DEFAULT = {
  name: "",
  subject: "",
  email: "",
  phone: "",
  status: "Active",
  grades: [],
  majors: [],
  rating: 0,
  students: 0,
  courses: 0,
};

const SUBJECTS = [
  "Matematika",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Fisika",
  "Kimia",
  "Biologi",
  "Sejarah",
  "Geografi",
  "Ekonomi",
  "Sosiologi",
  "Pendidikan Jasmani",
  "Seni Budaya",
];

const GRADES = [10, 11, 12];
const MAJORS = ["IPA", "IPS", "Bahasa", "Teknologi"];

export function TeacherForm({
  initial = TEACHER_FORM_DEFAULT,
  onSave,
  onClose,
  isEdit,
}) {
  const [form, setForm] = useState({ ...TEACHER_FORM_DEFAULT, ...initial });
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleArrayValue = (key, value) => {
    const current = form[key] || [];
    if (current.includes(value)) {
      set(key, current.filter((v) => v !== value));
    } else {
      set(key, [...current, value]);
    }
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim()) {
      Swal.fire(
        "Lengkapi Form",
        "Nama, Email, dan Mata Pelajaran wajib diisi",
        "warning",
      );
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
            Nama Guru
          </label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Nama lengkap guru"
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="email@sekolah.id"
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
            Nomor Telepon
          </label>
          <input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+62 81..."
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
            Mata Pelajaran
          </label>
          <select
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] transition-all bg-white"
          >
            <option value="">Pilih mapel</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] transition-all bg-white"
          >
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
            Rating (0-5)
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={(e) => set("rating", parseFloat(e.target.value) || 0)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
            Jumlah Siswa
          </label>
          <input
            type="number"
            min="0"
            value={form.students}
            onChange={(e) => set("students", parseInt(e.target.value) || 0)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
            Jumlah Kelas
          </label>
          <input
            type="number"
            min="0"
            value={form.courses}
            onChange={(e) => set("courses", parseInt(e.target.value) || 0)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#6b6375] mb-2">
          Tingkat Kelas
        </label>
        <div className="flex flex-wrap gap-2">
          {GRADES.map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => toggleArrayValue("grades", grade)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                form.grades.includes(grade)
                  ? "bg-[#6C63FF] text-white"
                  : "bg-[#F1F5F9] text-[#6b6375] border border-[#E5E7EB]"
              }`}
            >
              Kelas {grade}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#6b6375] mb-2">
          Jurusan
        </label>
        <div className="flex flex-wrap gap-2">
          {MAJORS.map((major) => (
            <button
              key={major}
              type="button"
              onClick={() => toggleArrayValue("majors", major)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                form.majors.includes(major)
                  ? "bg-[#6C63FF] text-white"
                  : "bg-[#F1F5F9] text-[#6b6375] border border-[#E5E7EB]"
              }`}
            >
              {major}
            </button>
          ))}
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
          onClick={handleSave}
          className="flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #6C63FF, #8A7BFF)" }}
        >
          {isEdit ? "Simpan Perubahan" : "Tambah Guru"}
        </button>
      </div>
    </div>
  );
}