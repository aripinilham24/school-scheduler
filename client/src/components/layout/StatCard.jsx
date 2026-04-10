export default function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-[#E5E7EB] px-5 py-4 shadow-sm">
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#08060d] leading-none">{value}</p>
        <p className="text-xs text-[#9ca3af] mt-0.5">{label}</p>
      </div>
    </div>
  );
}