import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Video,
  ClipboardList,
  CreditCard,
  Library,
  BarChart3,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Nav item config
const NAV_ITEMS = [
  { icon: Home,          label: "Home",       path: "/home" },
  { icon: Users,         label: "Students",   path: "/students" },
  { icon: GraduationCap, label: "Teachers",   path: "/teachers" },
  { icon: BookOpen,      label: "Courses",    path: "/courses" },
  { icon: Video,         label: "Live Class", path: "/live" },
  { icon: ClipboardList, label: "Attendance", path: "/attendance" },
  { icon: CreditCard,    label: "Payments",   path: "/payments" },
  { icon: Library,       label: "Library",    path: "/library" },
  { icon: BarChart3,     label: "Reports",    path: "/reports" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <aside className="flex flex-col h-screen w-[220px] shrink-0 border-r border-[#E5E7EB] bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#E5E7EB]">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
          style={{ background: "linear-gradient(135deg, #6C63FF, #8A7BFF)", boxShadow: "0 4px 14px rgba(108,99,255,0.35)" }}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <rect x="0" y="0"   width="18" height="3" rx="1.5" fill="white" />
            <rect x="0" y="5.5" width="12" height="3" rx="1.5" fill="white" opacity="0.8" />
            <rect x="0" y="11"  width="15" height="3" rx="1.5" fill="white" opacity="0.6" />
          </svg>
        </div>
        <span className="font-semibold text-[15px] text-[#08060d] tracking-tight">
          SkillSet
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
          const isActive = activePath === path || activePath.startsWith(path + "/");
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left",
                isActive
                  ? "bg-[rgba(108,99,255,0.08)] text-[#6C63FF]"
                  : "text-[#6b6375] hover:bg-[#F8FAFC] hover:text-[#08060d]"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#6C63FF]" />
              )}
              <Icon
                size={18}
                className={cn(
                  "shrink-0 transition-colors duration-200",
                  isActive ? "text-[#6C63FF]" : "text-[#9ca3af]"
                )}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span className="truncate">{label}</span>
              {isActive && (
                <ChevronRight size={14} className="ml-auto text-[#6C63FF] opacity-60" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      <div className="px-3 pb-5">
        <div
          className="relative overflow-hidden rounded-2xl p-4 text-white"
          style={{
            background: "linear-gradient(135deg, #6C63FF, #8A7BFF)",
            boxShadow: "0 10px 30px rgba(108,99,255,0.3)",
          }}
        >
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
          <div className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full bg-white/10" />
          <div className="relative z-10 flex flex-col items-center text-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 mb-1">
              <Zap size={16} fill="white" className="text-white" />
            </div>
            <p className="text-[13px] font-medium leading-snug opacity-95">
              Upgrade to <span className="font-bold text-[#DDD6FE]">Pro</span> for
              <br />more facilities
            </p>
            <button className="mt-1 flex items-center gap-1.5 px-4 py-1.5 bg-white rounded-xl text-[#6C63FF] text-[13px] font-semibold hover:scale-[1.02] transition-all duration-200">
              Upgrade <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}