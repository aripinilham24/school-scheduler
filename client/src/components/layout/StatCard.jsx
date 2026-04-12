export default function StatCard({ icon, label, value, color, stat }) {
  const card = stat
    ? {
        icon: stat.icon,
        label: stat.label,
        value: stat.value,
        bg: stat.bg || stat.color,
        iconColor: stat.color,
      }
    : { icon, label, value, bg: color, iconColor: undefined };

  const Icon = card.icon;
  const bgClass = card.bg?.startsWith("bg-") ? card.bg : "";
  const bgStyle = card.bg && !bgClass ? { backgroundColor: card.bg } : undefined;
  const iconStyle = card.iconColor ? { color: card.iconColor } : undefined;

  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-[#E5E7EB] px-5 py-4 shadow-sm">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-xl ${bgClass}`}
        style={bgStyle}
      >
        {Icon && (
          <Icon
            size={18}
            className={iconStyle ? undefined : "text-white"}
            style={iconStyle}
          />
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#08060d] leading-none">{card.value}</p>
        <p className="text-xs text-[#9ca3af] mt-0.5">{card.label}</p>
      </div>
    </div>
  );
}