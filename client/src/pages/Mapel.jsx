import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  AlertCircle,
  BookOpen,
  Users,
  Clock,
  GraduationCap,
} from "lucide-react";
import Swal from "sweetalert2";
import { useMapel } from "@/hooks/useMapel";
import StatCard from "@/components/layout/StatCard";
import { MapelCard } from "@/components/layout/MapelCard";
import { EmptyState } from "@/components/layout/EmptyState";
import DetailModal from "@/components/layout/DetailModal";
import Modal from "@/components/layout/Modal";

const INITIAL_FORM_STATE = {
  name: "",
  code: "",
  teacher: "",
  level: "",
  description: "",
  credits: "",
  hours: "",
  status: "Active",
};

const statusOptions = ["Active", "Inactive", "On Leave"];

export default function MapelPage() {
  const { mapel, loading, error, addMapel, updateMapel, deleteMapel } =
    useMapel();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const filtered = useMemo(() => {
    if (!search.trim()) return mapel;
    const lcSearch = search.toLowerCase();
    return mapel.filter(
      (m) =>
        (m.name || "").toLowerCase().includes(lcSearch) ||
        (m.code || "").toLowerCase().includes(lcSearch) ||
        (m.teacher || "").toLowerCase().includes(lcSearch),
    );
  }, [mapel, search]);

  const openAddModal = () => {
    setSelected(null);
    setFormData(INITIAL_FORM_STATE);
    setModal("add");
  };

  const openEditModal = (mapelItem) => {
    setSelected(mapelItem);
    setFormData({
      name: mapelItem.name || "",
      code: mapelItem.code || "",
      teacher: mapelItem.teacher || "",
      level: mapelItem.level || "",
      description: mapelItem.description || "",
      credits: mapelItem.credits != null ? String(mapelItem.credits) : "",
      hours: mapelItem.hours != null ? String(mapelItem.hours) : "",
      status: mapelItem.status || "Active",
    });
    setModal("edit");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      credits: Number(formData.credits),
      hours: Number(formData.hours),
    };

    try {
      if (modal === "add") {
        await addMapel(payload);
        Swal.fire({ icon: "success", title: "Berhasil", text: "Mapel berhasil ditambahkan", timer: 1500 });
      } else if (modal === "edit" && selected?.id) {
        await updateMapel(selected.id, payload);
        Swal.fire({ icon: "success", title: "Berhasil", text: "Mapel berhasil diperbarui", timer: 1500 });
      }
      setModal(null);
      setSelected(null);
      setFormData(INITIAL_FORM_STATE);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Gagal", text: err.message || "Terjadi kesalahan" });
    }
  };

  const handleDelete = async (m) => {
    const result = await Swal.fire({
      title: "Hapus Mapel?",
      text: `Apakah kamu yakin menghapus ${m.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF4757",
      cancelButtonColor: "#E5E7EB",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteMapel(m.id);
        Swal.fire({ icon: "success", title: "Berhasil", text: "Mapel berhasil dihapus", timer: 1500 });
      } catch (err) {
        Swal.fire({ icon: "error", title: "Gagal", text: err.message || "Terjadi kesalahan" });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
        <div className="shrink-0 px-8 pt-7 pb-5 bg-white border-b border-[#E5E7EB]">
          <h1 className="text-2xl font-bold text-[#08060d] tracking-tight">
            Manajemen Mata Pelajaran
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw size={28} className="text-[#6C63FF] animate-spin" />
            <p className="text-[#6b6375]">Memuat mata pelajaran...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
        <div className="shrink-0 px-8 pt-7 pb-5 bg-white border-b border-[#E5E7EB]">
          <h1 className="text-2xl font-bold text-[#08060d] tracking-tight">
            Manajemen Mata Pelajaran
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <AlertCircle size={28} className="text-red-500" />
            <p className="text-[#6b6375]">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#6C63FF] text-white rounded-xl text-sm font-medium hover:opacity-90"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-8 pt-7 pb-5 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#08060d] tracking-tight">
              Manajemen Mata Pelajaran
            </h1>
            <p className="text-sm text-[#9ca3af] mt-0.5">
              Kelola semua mata pelajaran dan informasi guru pengampu
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-[0_4px_14px_rgba(108,99,255,0.4)] hover:shadow-[0_4px_20px_rgba(108,99,255,0.5)] hover:scale-[1.02] transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #6C63FF, #8A7BFF)" }}
          >
            <Plus size={16} /> Tambah Mapel
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={BookOpen}
            label="Total Mapel"
            value={mapel.length}
            color="bg-[#6C63FF]"
          />
          <StatCard
            icon={GraduationCap}
            label="Guru Unik"
            value={new Set(mapel.map((m) => m.teacher)).size}
            color="bg-[#10B981]"
          />
          <StatCard
            icon={Users}
            label="Total Jam"
            value={mapel.reduce((a, m) => a + (m.hours || 0), 0)}
            color="bg-[#F59E0B]"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex items-center h-10 px-4 gap-2 rounded-xl border border-[#E5E7EB] bg-white flex-1 max-w-sm hover:border-[#c4c0ff] focus-within:border-[#6C63FF] focus-within:ring-2 focus-within:ring-[rgba(108,99,255,0.12)] transition-all">
            <Search size={15} className="text-[#9ca3af] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari mapel atau guru..."
              className="flex-1 bg-transparent text-sm text-[#08060d] placeholder:text-[#9ca3af] outline-none"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            message={
              search ? "Tidak ada mapel ditemukan" : "Belum ada mata pelajaran"
            }
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filtered.map((m, idx) => (
              <MapelCard
                key={m.id}
                mapel={m}
                index={idx}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onView={(item) => {
                  setSelected(item);
                  setModal("detail");
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {(modal === "add" || modal === "edit") && (
        <Modal
          title={modal === "add" ? "Tambah Mata Pelajaran" : "Edit Mata Pelajaran"}
          onClose={() => {
            setModal(null);
            setSelected(null);
          }}
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-[#475569]">Nama Mapel</span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#08060d] outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)]"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#475569]">Kode Mapel</span>
                <input
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#08060d] outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)]"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#475569]">Guru</span>
                <input
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#08060d] outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)]"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#475569]">Level</span>
                <input
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#08060d] outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)]"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-[#475569]">Deskripsi</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#08060d] outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)]"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-[#475569]">SKS</span>
                <input
                  name="credits"
                  type="number"
                  min="0"
                  value={formData.credits}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#08060d] outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)]"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#475569]">Jam</span>
                <input
                  name="hours"
                  type="number"
                  min="0"
                  value={formData.hours}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#08060d] outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)]"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-[#475569]">Status</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#08060d] outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)]"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setModal(null);
                  setSelected(null);
                }}
                className="rounded-2xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#6b6375] hover:bg-[#F8FAFC]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-[#6C63FF] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                {modal === "add" ? "Tambah" : "Simpan"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === "detail" && selected && (
        <DetailModal
          mapel={selected}
          onClose={() => {
            setModal(null);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
