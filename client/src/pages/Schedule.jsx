import { useState } from "react";
import {
  Trash2,
  BookOpen,
  Clock,
  AlertTriangle,
  Calendar,
  Zap,
} from "lucide-react";
import { INITIAL_CLASSES, DAYS, TIME_SLOTS } from "@/assets/data";
import StatCard from "@/components/layout/StatCard";
import Modal from "@/components/layout/Modal";
import DetailModal from "@/components/layout/DetailModal";
import ScheduleTab from "@/components/layout/ScheduleTab";
import { generateSchedule } from "@/utils/generateSchedule";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Schedule() {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [schedule, setSchedule] = useState([]);
  const [modal, setModal] = useState(null);
  const days = DAYS;
  const timeSlots = TIME_SLOTS;

  const handleGenerate = () => {
    setSchedule(generateSchedule(classes, days, timeSlots));
  };

  const handleAdd = (form) =>
    setClasses((p) => [...p, { ...form, id: Date.now() }]);
  const handleEdit = (form) =>
    setClasses((p) =>
      p.map((c) => (c.id === selected.id ? { ...c, ...form } : c)),
    );
  const handleDelete = (id) => setClasses((p) => p.filter((c) => c.id !== id));

  const totalSessions = classes.reduce((a, c) => a + c.sessionsPerWeek, 0);
  const totalHours = classes.reduce(
    (a, c) => a + (c.duration * c.sessionsPerWeek) / 60,
    0,
  );
  const conflicts = schedule.filter((s) => s.conflict).length;

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
            icon={Calendar}
            label="Sesi / Minggu"
            value={totalSessions}
            color="bg-[#10B981]"
          />
          <StatCard
            icon={Clock}
            label="Jam / Minggu"
            value={`${totalHours.toFixed(0)}j`}
            color="bg-[#F59E0B]"
          />
          <StatCard
            icon={AlertTriangle}
            label="Bentrok Jadwal"
            value={conflicts}
            color={conflicts > 0 ? "bg-[#FF4757]" : "bg-[#9ca3af]"}
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <ScheduleTab schedule={schedule} onRegenerate={handleGenerate} />
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