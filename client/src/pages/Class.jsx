import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  BookOpen,
  MapPin,
  Clock,
  Users,
  Calendar,
  MoreVertical,
} from "lucide-react";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const INITIAL_CLASSES = [
  {
    id: 1,
    name: "Matematika Dasar",
    subject: "Matematika",
    room: "R-101",
    duration: 90,
    sessionsPerWeek: 3,
    students: 32,
  },
  {
    id: 2,
    name: "Bahasa Indonesia Lanjut",
    subject: "Bahasa Indonesia",
    room: "R-102",
    duration: 60,
    sessionsPerWeek: 2,
    students: 28,
  },
  {
    id: 3,
    name: "Fisika Modern",
    subject: "Fisika",
    room: "Lab-A",
    duration: 120,
    sessionsPerWeek: 2,
    students: 24,
  },
  {
    id: 4,
    name: "Kimia Organik",
    subject: "Kimia",
    room: "Lab-B",
    duration: 120,
    sessionsPerWeek: 2,
    students: 20,
  },
  {
    id: 5,
    name: "Sejarah Dunia",
    subject: "Sejarah",
    room: "R-103",
    duration: 60,
    sessionsPerWeek: 3,
    students: 35,
  },
  {
    id: 6,
    name: "Ekonomi Mikro",
    subject: "Ekonomi",
    room: "R-104",
    duration: 90,
    sessionsPerWeek: 2,
    students: 30,
  },
  {
    id: 7,
    name: "Biologi Sel",
    subject: "Biologi",
    room: "Lab-C",
    duration: 90,
    sessionsPerWeek: 2,
    students: 22,
  },
  {
    id: 8,
    name: "Seni Rupa",
    subject: "Seni",
    room: "Studio",
    duration: 120,
    sessionsPerWeek: 1,
    students: 18,
  },
];

const ROOMS = [
  "R-101",
  "R-102",
  "R-103",
  "R-104",
  "Lab-A",
  "Lab-B",
  "Lab-C",
  "Studio",
];

const SUBJECT_COLORS = {
  Matematika: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "Bahasa Indonesia": {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  Fisika: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  Kimia: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  Sejarah: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  Ekonomi: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  Biologi: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  Seni: { bg: "bg-pink-50", text: "text-pink-700", dot: "bg-pink-500" },
};

// ─── ClassCard ────────────────────────────────────────────────────────────────
function ClassCard({ cls, onEdit, onDelete, onView }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const color = SUBJECT_COLORS[cls.subject] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-400",
  };

  return (
    <div
      className="group bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#c4c0ff] hover:shadow-[0_4px_20px_rgba(108,99,255,0.1)] transition-all duration-200 cursor-pointer"
      onClick={() => onView(cls)}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${color.bg} ${color.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
          {cls.subject}
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
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 w-36 bg-white rounded-xl border border-[#E5E7EB] shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => {
                    onEdit(cls);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6b6375] hover:bg-[#F8FAFC] hover:text-[#08060d] transition-colors"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(cls.id);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#FF4757] hover:bg-[#FFF1F2] transition-colors"
                >
                  <Trash2 size={13} /> Hapus
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-[#08060d] text-[15px] leading-snug mb-3 line-clamp-2">
        {cls.name}
      </h3>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <MapPin size={12} className="text-[#9ca3af] shrink-0" />
          <span>{cls.room}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <Clock size={12} className="text-[#9ca3af] shrink-0" />
          <span>
            {cls.duration} menit · {cls.sessionsPerWeek}x/minggu
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6b6375]">
          <Users size={12} className="text-[#9ca3af] shrink-0" />
          <span>{cls.students} siswa</span>
        </div>
      </div>
    </div>
  );
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md">
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

// ─── Class Form ───────────────────────────────────────────────────────────────
const FORM_DEFAULTS = {
  name: "",
  subject: "",
  room: "R-101",
  duration: 90,
  sessionsPerWeek: 2,
  students: 20,
};

function ClassForm({ initial = FORM_DEFAULTS, onSave, onClose, isEdit }) {
  const [form, setForm] = useState({ ...FORM_DEFAULTS, ...initial });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
          Nama Kelas
        </label>
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="cth. Matematika Kelas X"
          className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
          Mata Pelajaran
        </label>
        <input
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          placeholder="cth. Matematika"
          className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] placeholder:text-[#c4c0cc] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
            Ruangan
          </label>
          <select
            value={form.room}
            onChange={(e) => set("room", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] transition-all bg-white"
          >
            {ROOMS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
            Jumlah Siswa
          </label>
          <input
            type="number"
            min={1}
            value={form.students}
            onChange={(e) => set("students", +e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[rgba(108,99,255,0.12)] transition-all"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
            Durasi (menit)
          </label>
          <select
            value={form.duration}
            onChange={(e) => set("duration", +e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] transition-all bg-white"
          >
            {[45, 60, 90, 120].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6b6375] mb-1.5">
            Pertemuan/Minggu
          </label>
          <select
            value={form.sessionsPerWeek}
            onChange={(e) => set("sessionsPerWeek", +e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-sm text-[#08060d] focus:outline-none focus:border-[#6C63FF] transition-all bg-white"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n}>{n}x</option>
            ))}
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
          onClick={() => {
            if (form.name && form.subject) {
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

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ cls, onClose }) {
  const color = SUBJECT_COLORS[cls.subject] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-400",
  };
  return (
    <Modal title="Detail Kelas" onClose={onClose}>
      <div className="space-y-4">
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${color.bg}`}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/60">
            <BookOpen size={18} className={color.text} />
          </div>
          <div>
            <p className={`font-semibold text-[15px] ${color.text}`}>
              {cls.name}
            </p>
            <p className={`text-xs ${color.text} opacity-70`}>{cls.subject}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: MapPin, label: "Ruangan", value: cls.room },
            { icon: Users, label: "Siswa", value: `${cls.students} orang` },
            { icon: Clock, label: "Durasi", value: `${cls.duration} menit` },
            {
              icon: Calendar,
              label: "Pertemuan",
              value: `${cls.sessionsPerWeek}x / minggu`,
            },
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
        <div className="bg-[rgba(108,99,255,0.06)] rounded-xl p-3">
          <p className="text-xs text-[#6b6375]">Total jam per minggu</p>
          <p className="text-lg font-bold text-[#6C63FF]">
            {((cls.duration * cls.sessionsPerWeek) / 60).toFixed(1)} jam
          </p>
        </div>
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClassPage() {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = classes.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = (form) =>
    setClasses((p) => [...p, { ...form, id: Date.now() }]);
  const handleEdit = (form) =>
    setClasses((p) =>
      p.map((c) => (c.id === selected.id ? { ...c, ...form } : c)),
    );
  const handleDelete = (id) => setClasses((p) => p.filter((c) => c.id !== id));

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
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
              style={{ background: "linear-gradient(135deg,#6C63FF,#8A7BFF)" }}
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
