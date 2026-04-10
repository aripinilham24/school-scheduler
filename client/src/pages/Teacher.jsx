import { useState } from "react";
import {
  Plus, Search, Edit2, Trash2, X,
  Users, Star, BookOpen, Clock,
  MoreVertical, GraduationCap, RefreshCw,
  AlertCircle, CheckCircle2, UserCheck, UserX,
} from "lucide-react";
import Swal from "sweetalert2";
import { useTeachers } from "@/hooks/useTeachers";
import StatCard from "@/components/layout/StatCard";

const AVATAR_COLORS = [
  { bg: "bg-[rgba(108,99,255,0.12)]", text: "text-[#534AB7]" },
  { bg: "bg-[rgba(29,158,117,0.12)]", text: "text-[#0F6E56]" },
  { bg: "bg-[rgba(216,90,48,0.12)]",  text: "text-[#993C1D]" },
  { bg: "bg-[rgba(212,83,126,0.12)]", text: "text-[#993556]" },
];

function getInitials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function getStatusClasses(status) {
  if (status === "Active")   return "bg-[#ECFDF5] text-[#047857]";
  if (status === "Inactive") return "bg-[#FEF2F2] text-[#B91C1C]";
  if (status === "On Leave") return "bg-[#FEF7C3] text-[#92400E]";
  return "bg-[#E5E7EB] text-[#6B7280]";
}

function TeacherCard({ teacher, index, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const c = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div className="group bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#c4c0ff] hover:shadow-[0_4px_20px_rgba(108,99,255,0.1)] transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${c.bg} ${c.text} flex items-center justify-center text-[13px] font-semibold shrink-0`}>
            {getInitials(teacher.name)}
          </div>
          <div>
            <p className="font-semibold text-[14px] text-[#08060d] leading-snug">{teacher.name}</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">{teacher.subject ?? "-"}</p>
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
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 w-36 bg-white rounded-xl border border-[#E5E7EB] shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => { onEdit(teacher); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6b6375] hover:bg-[#F8FAFC] hover:text-[#08060d] transition-colors"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => { onDelete(teacher); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#FF4757] hover:bg-[#FFF1F2] transition-colors"
                >
                  <Trash2 size={13} /> Hapus
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold mb-4 ${getStatusClasses(teacher.status)}`}>
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
          <span>{teacher.courses ?? 0} kursus</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <Clock size={12} className="text-[#9ca3af] shrink-0" />
          <span>Bergabung {teacher.joinDate ?? "-"}</span>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#F1F5F9]" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 bg-[#F1F5F9] rounded-md w-3/4" />
          <div className="h-3 bg-[#F1F5F9] rounded-md w-1/2" />
        </div>
      </div>
      <div className="h-6 bg-[#F1F5F9] rounded-full w-20" />
      <div className="space-y-2">
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-3 bg-[#F1F5F9] rounded-md w-full" />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message = "Belum ada data guru" }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(108,99,255,0.08)] flex items-center justify-center">
        <GraduationCap size={28} className="text-[#6C63FF]" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-[#08060d] text-sm">{message}</p>
        <p className="text-xs text-[#9ca3af] mt-1">Klik tombol "Tambah Guru" untuk mulai menambahkan data</p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(225,29,72,0.08)] flex items-center justify-center">
        <AlertCircle size={28} className="text-[#E11D48]" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-[#08060d] text-sm">Gagal memuat data</p>
        <p className="text-xs text-[#9ca3af] mt-1">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-[#6C63FF] border border-[rgba(108,99,255,0.3)] hover:bg-[rgba(108,99,255,0.06)] transition-colors"
      >
        <RefreshCw size={13} /> Coba lagi
      </button>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-[#08060d]">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-[#9ca3af] hover:bg-[#F1F5F9] hover:text-[#08060d] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

const TEACHER_FORM_DEFAULT = {
  name: "", subject: "", email: "", phone: "",
  status: "Active", rating: 0, students: 0, courses: 0, joinDate: "",
};

function TeacherForm({ initial = TEACHER_FORM_DEFAULT, onSave, onClose, isEdit }) {
  const [form, setForm] = useState({ ...TEACHER_FORM_DEFAULT, ...initial });
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim()) {
      Swal.fire("Lengkapi Form", "Nama, Email, dan Mata Pelajaran wajib diisi", "warning");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Nama</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Nama guru"
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
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="example@domain.com"
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Telepon</label>
          <input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+62 ..."
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] transition-all bg-white"
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>On Leave</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Join Date</label>
          <input
            value={form.joinDate}
            onChange={(e) => set("joinDate", e.target.value)}
            placeholder="Feb 2021"
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Rating</label>
          <input
            type="number" min={0} max={5} step={0.1}
            value={form.rating}
            onChange={(e) => set("rating", Number(e.target.value))}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Siswa</label>
          <input
            type="number" min={0}
            value={form.students}
            onChange={(e) => set("students", Number(e.target.value))}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">Kursus</label>
          <input
            type="number" min={0}
            value={form.courses}
            onChange={(e) => set("courses", Number(e.target.value))}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
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

export default function Teacher() {
  const { teachers, loading, error, addTeacher, updateTeacher, deleteTeacher, refetch } = useTeachers();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = (teachers ?? []).filter((t) =>
    !search ||
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount  = (teachers ?? []).filter((t) => t.status === "Active").length;
  const onLeaveCount = (teachers ?? []).filter((t) => t.status === "On Leave").length;
  const totalStudents = (teachers ?? []).reduce((a, t) => a + (t.students ?? 0), 0);

  const onSaveTeacher = async (data) => {
    try {
      if (selected) {
        await updateTeacher(selected.id, data);
        Swal.fire("Berhasil", "Data guru berhasil diupdate", "success");
      } else {
        await addTeacher(data);
        Swal.fire("Berhasil", "Guru baru berhasil ditambahkan", "success");
      }
      refetch();
      setModal(null);
    } catch (err) {
      Swal.fire("Gagal", err.message || "Terjadi kesalahan", "error");
    }
  };

  const onDelete = async () => {
    try {
      await deleteTeacher(selected.id);
      Swal.fire("Terhapus", "Guru telah dihapus", "success");
      refetch();
      setModal(null);
    } catch (err) {
      Swal.fire("Gagal", err.message || "Terjadi kesalahan", "error");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      <div className="shrink-0 px-8 pt-7 pb-5 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#08060d] tracking-tight">Manajemen Guru</h1>
            <p className="text-sm text-[#9ca3af] mt-0.5">Kelola data guru dan informasi pengajar</p>
          </div>
          <button
            onClick={() => { setSelected(null); setModal("form"); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-[0_4px_14px_rgba(108,99,255,0.4)] hover:shadow-[0_4px_20px_rgba(108,99,255,0.5)] hover:scale-[1.02] transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #6C63FF, #8A7BFF)" }}
          >
            <Plus size={16} />
            Tambah Guru
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <StatCard icon={GraduationCap} label="Total Guru"     value={loading ? "-" : (teachers?.length ?? 0)} color="bg-[#6C63FF]" />
          <StatCard icon={CheckCircle2}  label="Aktif"          value={loading ? "-" : activeCount}             color="bg-[#10B981]" />
          <StatCard icon={UserCheck}     label="Cuti / Izin"    value={loading ? "-" : onLeaveCount}            color="bg-[#F59E0B]" />
          <StatCard icon={Users}         label="Total Siswa"    value={loading ? "-" : totalStudents}           color="bg-[#6366F1]" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex items-center h-10 px-4 gap-2 rounded-xl border border-[#E5E7EB] bg-white flex-1 max-w-sm hover:border-[#c4c0ff] focus-within:border-[#6C63FF] focus-within:ring-2 focus-within:ring-[rgba(108,99,255,0.12)] transition-all">
            <Search size={15} className="text-[#9ca3af] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari guru atau mata pelajaran..."
              className="flex-1 bg-transparent text-sm text-[#08060d] placeholder:text-[#9ca3af] outline-none"
            />
          </div>
          {!loading && !error && (
            <span className="text-xs text-[#9ca3af]">{filtered.length} guru ditemukan</span>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && error && <ErrorState message={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && <EmptyState />}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filtered.map((teacher, index) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                index={index}
                onEdit={(t) => { setSelected(t); setModal("form"); }}
                onDelete={(t) => { setSelected(t); setModal("delete"); }}
              />
            ))}
          </div>
        )}
      </div>

      {modal === "form" && (
        <Modal title={selected ? "Edit Guru" : "Tambah Guru"} onClose={() => setModal(null)}>
          <TeacherForm
            initial={selected || TEACHER_FORM_DEFAULT}
            onSave={onSaveTeacher}
            onClose={() => setModal(null)}
            isEdit={Boolean(selected)}
          />
        </Modal>
      )}

      {modal === "delete" && selected && (
        <Modal title="Hapus Guru" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 mx-auto">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <p className="text-sm text-[#6b6375] text-center leading-relaxed">
              Apakah kamu yakin ingin menghapus <span className="font-semibold text-[#08060d]">{selected.name}</span>?<br />
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setModal(null)}
                className="flex-1 h-10 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#6b6375] hover:bg-[#F8FAFC] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={onDelete}
                className="flex-1 h-10 rounded-xl bg-[#FF4757] text-white text-sm font-semibold hover:bg-[#e03546] transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}