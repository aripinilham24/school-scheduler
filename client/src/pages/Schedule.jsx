import { useState, useMemo } from "react";
import {
  Trash2, BookOpen, Clock, AlertTriangle,
  Calendar, Zap, RefreshCw, CheckCircle2,
} from "lucide-react";

import StatCard      from "@/components/layout/StatCard";
import Modal         from "@/components/layout/Modal";
import ClassForm     from "@/components/layout/ClassForm";
import DetailModal   from "@/components/layout/DetailModal";
import ScheduleTab   from "@/components/layout/ScheduleTab";
import { generateSchedule } from "@/utils/ScheduleGenerator";
import { useSchedule }      from "@/hooks/useSchedule";

// ── Konstanta ────────────────────────────────────────────────
const GRADE_TABS = ["Semua", "Kelas 10", "Kelas 11", "Kelas 12"];

// ── Toast ────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const isError   = toast.type === "error";
  const isWarning = toast.type === "warning";
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] max-w-sm"
      style={{
        background: isError ? "#FEF2F2" : isWarning ? "#FFFBEB" : "#F0FDF4",
        border: `1px solid ${isError ? "#FCA5A5" : isWarning ? "#FCD34D" : "#86EFAC"}`,
      }}
    >
      {isError   && <AlertTriangle size={16} className="text-[#E11D48] shrink-0 mt-0.5" />}
      {isWarning && <AlertTriangle size={16} className="text-[#D97706] shrink-0 mt-0.5" />}
      {!isError && !isWarning && <CheckCircle2 size={16} className="text-[#16A34A] shrink-0 mt-0.5" />}
      <div>
        <p className="text-[13px] font-semibold"
          style={{ color: isError ? "#B91C1C" : isWarning ? "#92400E" : "#15803D" }}>
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-[12px] mt-0.5"
            style={{ color: isError ? "#DC2626" : isWarning ? "#B45309" : "#16A34A" }}>
            {toast.message}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function Schedule() {
  // ── State lokal (manajemen kelas) ──
  const [classes,  setClasses]  = useState([]);
  const [modal,    setModal]    = useState(null);   // "add" | "edit" | "detail" | "delete"
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("Semua");

  // ── State generate lokal (fallback tanpa Firebase) ──
  const [localSchedule, setLocalSchedule] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Hook Firebase ──
  const {
    schedules: firebaseSchedules,
    loading:   fbLoading,
    error:     fbError,
    generateSchedule: generateFromFirebase,
    clearAllSchedules,
    refetch,
  } = useSchedule();

  // ── Gabungkan jadwal: Firebase + lokal ──
  // Prioritaskan Firebase, fallback ke lokal
  const schedule = firebaseSchedules.length > 0 ? firebaseSchedules : localSchedule;

  // ── Stat counts ──
  const totalSessions = classes.reduce((a, c) => a + (c.sessionsPerWeek || 0), 0);
  const totalHours    = classes.reduce((a, c) => a + ((c.duration || 0) * (c.sessionsPerWeek || 0)) / 60, 0);
  const conflicts     = schedule.filter((s) => s.conflict).length;

  // ── Filter jadwal berdasarkan tab grade ──
  const filteredSchedule = useMemo(() => {
    if (activeTab === "Semua") return schedule;
    const grade = parseInt(activeTab.replace("Kelas ", ""));
    return schedule.filter((s) => s.grade === grade);
  }, [schedule, activeTab]);

  // ── Toast helper ──
  const showToast = (type, title, message) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Generate handler ──
  // Coba generate dari Firebase dulu, fallback ke lokal
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Coba Firebase
      const res = await generateFromFirebase(true);
      showToast(
        res.warning ? "warning" : "success",
        res.message,
        res.warning ?? null,
      );
    } catch (fbErr) {
      // Fallback: generate lokal dari state classes
      if (classes.length > 0) {
        const result = generateSchedule(classes);
        setLocalSchedule(Array.isArray(result) ? result : result.schedules ?? []);
        showToast("success", `Jadwal lokal dibuat: ${classes.length} kelas`);
      } else {
        showToast(
          "error",
          "Generate gagal",
          "Pastikan data guru, kelas, dan mata pelajaran sudah diisi di Firebase, atau tambah kelas secara manual.",
        );
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Hapus semua jadwal yang ada?")) return;
    try {
      await clearAllSchedules();
      setLocalSchedule([]);
      showToast("success", "Semua jadwal berhasil dihapus");
    } catch {
      setLocalSchedule([]);
      showToast("success", "Jadwal lokal dihapus");
    }
  };

  // ── CRUD kelas lokal ──
  const handleAdd    = (form) => setClasses((p) => [...p, { ...form, id: Date.now() }]);
  const handleEdit   = (form) => setClasses((p) => p.map((c) => c.id === selected.id ? { ...c, ...form } : c));
  const handleDelete = (id)   => setClasses((p) => p.filter((c) => c.id !== id));

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="shrink-0 px-8 pt-7 pb-5 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#08060d] tracking-tight">
              Manajemen Jadwal
            </h1>
            <p className="text-sm text-[#9ca3af] mt-0.5">
              Kelola kelas dan generate jadwal otomatis tanpa bentrok
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Hapus semua */}
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-medium text-[#6b6375] hover:bg-[#FEF2F2] hover:border-[#FCA5A5] hover:text-[#E11D48] transition-all duration-200"
            >
              <Trash2 size={14} />
              Hapus Semua
            </button>

            {/* Refresh */}
            <button
              onClick={refetch}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#E5E7EB] text-[#6b6375] hover:bg-[#F8FAFC] transition-colors"
            >
              <RefreshCw size={15} className={fbLoading ? "animate-spin" : ""} />
            </button>

            {/* Generate */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-[0_4px_14px_rgba(108,99,255,0.4)] hover:shadow-[0_4px_20px_rgba(108,99,255,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #6C63FF, #8A7BFF)" }}
            >
              {generating
                ? <RefreshCw size={16} className="animate-spin" />
                : <Zap size={16} fill="white" />
              }
              {generating ? "Generating..." : "Generate Jadwal"}
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <StatCard icon={BookOpen}      label="Total Kelas"    value={classes.length || scheduleByClass(schedule)} color="bg-[#6C63FF]" />
          <StatCard icon={Calendar}      label="Sesi / Minggu"  value={schedule.length}                            color="bg-[#10B981]" />
          <StatCard icon={Clock}         label="Jam / Minggu"   value={`${totalHours.toFixed(0) || "–"}j`}         color="bg-[#F59E0B]" />
          <StatCard
            icon={AlertTriangle}
            label="Bentrok Jadwal"
            value={conflicts}
            color={conflicts > 0 ? "bg-[#FF4757]" : "bg-[#9ca3af]"}
          />
        </div>

        {/* ── Grade Tabs — hanya tampil jika ada jadwal Firebase ── */}
        {firebaseSchedules.length > 0 && (
          <div className="flex items-center gap-2">
            {GRADE_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-3.5 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200"
                  style={{
                    background: isActive ? "#6C63FF"     : "white",
                    color:      isActive ? "white"        : "#6b6375",
                    border:     isActive ? "1px solid #6C63FF" : "1px solid #E5E7EB",
                    boxShadow:  isActive ? "0 4px 10px rgba(108,99,255,0.3)" : "none",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-8 py-6">

        {/* Error Firebase (non-blocking, hanya info) */}
        {fbError && (
          <div className="flex items-center gap-3 mb-4 p-3.5 bg-[#FFFBEB] border border-[#FCD34D] rounded-xl text-[13px] text-[#92400E]">
            <AlertTriangle size={15} className="text-[#D97706] shrink-0" />
            <span>Firebase tidak terhubung — menggunakan mode lokal. ({fbError})</span>
          </div>
        )}

        {/* Schedule Tab (komponen existing Anda) */}
        <ScheduleTab
          schedule={filteredSchedule}
          onRegenerate={handleGenerate}
        />
      </div>

      {/* ── Modals ───────────────────────────────────────── */}
      {modal === "add" && (
        <Modal title="Tambah Kelas Baru" onClose={() => setModal(null)}>
          <ClassForm onSave={handleAdd} onClose={() => setModal(null)} isEdit={false} />
        </Modal>
      )}
      {modal === "edit" && selected && (
        <Modal title="Edit Kelas" onClose={() => setModal(null)}>
          <ClassForm initial={selected} onSave={handleEdit} onClose={() => setModal(null)} isEdit />
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
              <br />Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setModal(null)}
                className="flex-1 h-10 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#6b6375] hover:bg-[#F8FAFC] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => { handleDelete(selected.id); setModal(null); }}
                className="flex-1 h-10 rounded-xl bg-[#FF4757] text-white text-sm font-semibold hover:bg-[#e03546] transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Toast toast={toast} />
    </div>
  );
}

// helper: hitung jumlah kelas unik dari jadwal
function scheduleByClass(schedule) {
  return new Set(schedule.map((s) => s.classId)).size || 0;
}