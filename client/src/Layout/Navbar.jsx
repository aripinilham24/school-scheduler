import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Moon, Bell, ChevronDown, Radio } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

const notifications = [
  { id: 1, text: "New student enrolled in React course", time: "2m ago", unread: true },
  { id: 2, text: "Live class starts in 10 minutes", time: "8m ago", unread: true },
  { id: 3, text: "Assignment submitted by John Doe", time: "1h ago", unread: false },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-50 flex items-center gap-4 px-6 h-[68px] bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
      {/* Search */}
      <div
        className={`relative flex items-center flex-1 max-w-[420px] h-10 px-4 gap-2.5 rounded-xl border transition-all duration-200 bg-[#F8FAFC] ${
          searchFocused
            ? "border-[#6C63FF] shadow-[0_0_0_3px_rgba(108,99,255,0.12)]"
            : "border-[#E5E7EB] hover:border-[#c4c0ff]"
        }`}
      >
        <Search
          size={16}
          className={`shrink-0 transition-colors duration-200 ${
            searchFocused ? "text-[#6C63FF]" : "text-[#9ca3af]"
          }`}
        />
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="flex-1 bg-transparent text-sm text-[#08060d] placeholder:text-[#9ca3af] outline-none"
        />
        {searchValue && (
          <button
            onClick={() => setSearchValue("")}
            className="text-[#9ca3af] hover:text-[#6b6375] text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Live Badge */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF4757] text-white text-[13px] font-semibold shadow-[0_4px_12px_rgba(255,71,87,0.35)] hover:shadow-[0_4px_16px_rgba(255,71,87,0.45)] hover:scale-[1.02] transition-all duration-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          Live
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-[#6b6375] hover:bg-[#F1F5F9] hover:text-[#08060d] transition-all duration-200"
          title="Toggle dark mode"
        >
          <Moon size={17} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotif(!showNotif);
              setShowProfile(false);
            }}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl text-[#6b6375] hover:bg-[#F1F5F9] hover:text-[#08060d] transition-all duration-200"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-[17px] h-[17px] rounded-full bg-[#6C63FF] text-white text-[9px] font-bold leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotif && (
            <div className="absolute right-0 top-12 w-[300px] bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_20px_40px_rgba(108,99,255,0.15)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
                <span className="text-sm font-semibold text-[#08060d]">Notifications</span>
                <button className="text-xs text-[#6C63FF] font-medium hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-[#F1F5F9]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-[#F8FAFC] cursor-pointer transition-colors ${
                      n.unread ? "bg-[rgba(108,99,255,0.04)]" : ""
                    }`}
                  >
                    <div
                      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                        n.unread ? "bg-[#6C63FF]" : "bg-transparent border border-[#E5E7EB]"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#08060d] leading-snug">{n.text}</p>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-[#E5E7EB] text-center">
                <button className="text-xs text-[#6C63FF] font-medium hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[#E5E7EB] mx-1" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotif(false);
            }}
            className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-xl hover:bg-[#F1F5F9] transition-all duration-200 group"
          >
            <div className="relative w-8 h-8 rounded-xl overflow-hidden ring-2 ring-[#DDD6FE] group-hover:ring-[#6C63FF] transition-all duration-200">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=skillset"
                alt="Profile"
                className="w-full h-full object-cover bg-[#DDD6FE]"
              />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[13px] font-semibold text-[#08060d]">{user?.name || "User"}</span>
              <span className="text-[11px] text-[#9ca3af] capitalize">{user?.role || ""}</span>
            </div>
            <ChevronDown
              size={14}
              className={`text-[#9ca3af] transition-transform duration-200 ${
                showProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-14 w-[200px] bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_20px_40px_rgba(108,99,255,0.15)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-[#E5E7EB]">
                <p className="text-[13px] font-semibold text-[#08060d]">{user?.name || "User"}</p>
                <p className="text-[11px] text-[#9ca3af]">{user?.email || ""}</p>
              </div>
              {["My Profile", "Settings", "Help Center"].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#6b6375] hover:bg-[#F8FAFC] hover:text-[#08060d] transition-colors"
                >
                  {item}
                </button>
              ))}
              <div className="border-t border-[#E5E7EB]">
                <button
                  onClick={() => {
                    setShowProfile(false);
                    Swal.fire({
                      title: "Yakin ingin logout?",
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonText: "Ya, logout",
                      cancelButtonText: "Batal",
                      confirmButtonColor: "#6C63FF",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        logout();
                        navigate("/login");
                      }
                    });
                  }}
                  className="w-full text-left px-4 py-2.5 text-[13px] text-[#FF4757] hover:bg-[#FFF1F2] transition-colors font-medium"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close dropdowns */}
      {(showNotif || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotif(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
}