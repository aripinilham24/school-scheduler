import { useState } from "react";
import StatCard from "@/components/layout/StatCard";
import ClassCard from "@/components/layout/ClassCard";
import Modal from "@/components/layout/Modal";
import ClassForm from "@/components/layout/ClassForm";
import DetailModal from "@/components/layout/DetailModal";
import Swal from "sweetalert2";
import { useClasses } from "@/hooks/useClasses";
import {
  Plus,
  Search,
  Trash2,
  BookOpen,
  AlertTriangle,
  Zap,
  GraduationCap,
  RefreshCw,
} from "lucide-react";



// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClassPage() {
  const { classes, loading, error, addClass, updateClass, deleteClass } =
    useClasses();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = classes.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.code || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.major || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleGenerate = () => {
    // Generate schedule dari Schedule page
    // Navigate ke jadwal page dengan notification
    Swal.fire({
      icon: "info",
      title: "Generate Jadwal",
      text: "Silakan gunakan tombol Generate pada halaman Jadwal",
    });
  };

  const handleAdd = async (form) => {
    try {
      await addClass(form);
      setModal(null);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kelas baru telah ditambahkan",
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal", text: err.message });
    }
  };

  const handleEdit = async (form) => {
    try {
      await updateClass(selected.id, form);
      setModal(null);
      setSelected(null);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kelas telah diperbarui",
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal", text: err.message });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteClass(id);
      setModal(null);
      setSelected(null);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kelas telah dihapus",
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal", text: err.message });
    }
  };

  // Calculate stats
  const totalStudents = classes.reduce((a, c) => a + (c.students || 0), 0);
  const totalCapacity = classes.reduce((a, c) => a + (c.capacity || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={28} className="text-[#6C63FF] animate-spin" />
          <p className="text-[#6b6375]">Memuat data kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      {/* ── Header ── */}
      <div className="shrink-0 px-8 pt-7 pb-5 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#08060d] tracking-tight">
              Manajemen Kelas
            </h1>
            <p className="text-sm text-[#9ca3af] mt-0.5">
              Kelola kelas dan generate jadwal otomatis tanpa bentrok
            </p>
          </div>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-[0_4px_14px_rgba(108,99,255,0.4)] hover:shadow-[0_4px_20px_rgba(108,99,255,0.5)] hover:scale-[1.02] transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #6C63FF, #8A7BFF)" }}
          >
            <Zap size={16} fill="white" />
            Generate Jadwal
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <StatCard
            icon={BookOpen}
            label="Total Kelas"
            value={classes.length}
            color="bg-[#6C63FF]"
          />
          <StatCard
            icon={GraduationCap}
            label="Total Siswa"
            value={totalStudents}
            color="bg-[#10B981]"
          />
          <StatCard
            icon={AlertTriangle}
            label="Grade Level"
            value={new Set(classes.map(c => c.grade)).size}
            color="bg-[#8B5CF6]"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-xl p-1 w-fit">
          {[
            { key: "classes", label: "Daftar Kelas", icon: GraduationCap },
          ].map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium`}
            >
              <Icon size={15} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <>
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex items-center h-10 px-4 gap-2 rounded-xl border border-[#E5E7EB] bg-white flex-1 max-w-sm hover:border-[#c4c0ff] focus-within:border-[#6C63FF] focus-within:ring-2 focus-within:ring-[rgba(108,99,255,0.12)] transition-all">
              <Search size={15} className="text-[#9ca3af] shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kelas atau mata pelajaran..."
                className="flex-1 bg-transparent text-sm text-[#08060d] placeholder:text-[#9ca3af] outline-none"
              />
            </div>
            <button
              onClick={() => setModal("add")}
              className="flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
              style={{
                background: "linear-gradient(135deg,#6C63FF,#8A7BFF)",
              }}
            >
              <Plus size={15} /> Tambah Kelas
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(108,99,255,0.08)] flex items-center justify-center">
                <BookOpen size={24} className="text-[#6C63FF]" />
              </div>
              <p className="text-sm font-medium text-[#08060d]">
                Tidak ada kelas ditemukan
              </p>
              <p className="text-xs text-[#9ca3af]">
                Coba kata kunci lain atau tambah kelas baru
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filtered.map((cls) => (
                <ClassCard
                  key={cls.id}
                  cls={cls}
                  onEdit={(c) => {
                    setSelected(c);
                    setModal("edit");
                  }}
                  onDelete={(id) => {
                    setSelected({ id });
                    setModal("delete");
                  }}
                  onView={(c) => {
                    setSelected(c);
                    setModal("detail");
                  }}
                />
              ))}
            </div>
          )}
        </>
      </div>

      {/* ── Modals ── */}
      {modal === "add" && (
        <Modal title="Tambah Kelas Baru" onClose={() => setModal(null)}>
          <ClassForm
            onSave={handleAdd}
            onClose={() => setModal(null)}
            isEdit={false}
          />
        </Modal>
      )}
      {modal === "edit" && selected && (
        <Modal title="Edit Kelas" onClose={() => setModal(null)}>
          <ClassForm
            initial={selected}
            onSave={handleEdit}
            onClose={() => setModal(null)}
            isEdit
          />
        </Modal>
      )}
      {modal === "detail" && selected && (
        <DetailModal cls={selected} onClose={() => setModal(null)} />
      )}
      {modal === "delete" && selected && (
        <Modal title="Hapus Kelas" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 mx-auto">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <p className="text-sm text-[#6b6375] text-center leading-relaxed">
              Apakah kamu yakin ingin menghapus kelas ini?
              <br />
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
                onClick={() => {
                  handleDelete(selected.id);
                  setModal(null);
                }}
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
