import { useState } from "react";
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

const navItems = [
  { icon: Home, label: "Home", href: "#" },
  { icon: Users, label: "Students", href: "#" },
  { icon: GraduationCap, label: "Teachers", href: "#" },
  { icon: BookOpen, label: "Courses", href: "#" },
  { icon: Video, label: "Live Class", href: "#" },
  { icon: ClipboardList, label: "Attendance", href: "#" },
  { icon: CreditCard, label: "Payments", href: "#" },
  { icon: Library, label: "Library", href: "#" },
  { icon: BarChart3, label: "Reports", href: "#" },
];

export default function Sidebar({ defaultActive = "Home" }) {
  const [activeItem, setActiveItem] = useState(defaultActive);

  return (
    <aside className="sidebar flex flex-col h-screen w-[220px] shrink-0 border-r border-[#E5E7EB] bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-gradient shadow-soft shrink-0">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <rect x="0" y="0" width="18" height="3" rx="1.5" fill="white" />
            <rect x="0" y="5.5" width="12" height="3" rx="1.5" fill="white" opacity="0.8" />
            <rect x="0" y="11" width="15" height="3" rx="1.5" fill="white" opacity="0.6" />
          </svg>
        </div>
        <span className="font-semibold text-[15px] text-[#08060d] tracking-tight">
          SkillSet
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = activeItem === label;
          return (
            <a
              key={label}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                setActiveItem(label);
              }}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[rgba(108,99,255,0.08)] text-[#6C63FF]"
                  : "text-[#6b6375] hover:bg-[#F8FAFC] hover:text-[#08060d]"
              )}
            >
              {/* Active indicator */}
              <span
                className={cn(
                  "absolute left-3 w-[3px] h-5 rounded-r-full bg-[#6C63FF] transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-0"
                )}
                style={{ position: "absolute", left: "12px" }}
              />
              <Icon
                size={18}
                className={cn(
                  "shrink-0 transition-colors duration-200",
                  isActive
                    ? "text-[#6C63FF]"
                    : "text-[#9ca3af] group-hover:text-[#6b6375]"
                )}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span className="truncate">{label}</span>
              {isActive && (
                <ChevronRight
                  size={14}
                  className="ml-auto text-[#6C63FF] opacity-60"
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      <div className="px-3 pb-5">
        <div className="relative overflow-hidden rounded-2xl bg-primary-gradient p-4 text-white shadow-soft">
          {/* decorative circles */}
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
          <div className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full bg-white/10" />

          <div className="relative z-10 flex flex-col items-center text-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 mb-1">
              <Zap size={16} fill="white" className="text-white" />
            </div>
            <p className="text-[13px] font-medium leading-snug opacity-95">
              Upgrade to{" "}
              <span className="font-bold text-[#DDD6FE]">Pro</span> for
              <br />
              more facilities
            </p>
            <button className="mt-1 flex items-center gap-1.5 px-4 py-1.5 bg-white rounded-xl text-[#6C63FF] text-[13px] font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200">
              Upgrade
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}