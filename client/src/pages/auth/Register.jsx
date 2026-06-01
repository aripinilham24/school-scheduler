import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Tidak Cocok",
        text: "Pastikan password dan konfirmasi password sama.",
      });
      return;
    }

    setSubmitting(true);
    try {
      await register(firstName, lastName, email, password);
      await Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil",
        text: "Akun Anda telah dibuat. Silakan masuk.",
        timer: 1800,
        showConfirmButton: false,
      });
      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
   <div className="flex items-center justify-center w-full h-screen"style={{ background: "linear-gradient(135deg, #6C63FF 0%, #a78bfa 40%, #DDD6FE 70%, #f3f0ff 100%)" }}>
      <div className="grid grid-cols-[2fr_3fr] w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl">

        {/* Left panel */}
        <div className="relative bg-[#6C63FF] flex flex-col justify-between p-10 overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute w-44 h-44 rounded-full bg-white/10 -bottom-10 -left-10" />
          <div className="absolute w-20 h-20 rounded-full bg-white/10 top-8 right-6" />
          <div className="absolute w-7 h-7 bg-white/10 rounded-md rotate-12 top-28 right-16" />

          {/* Logo */}
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-lg border-[1.5px] border-white/60 flex items-center justify-center">
              <Clock size={14} className="text-white" />
            </div>
            <span className="text-white text-sm font-medium">School Scheduler</span>
          </div>

          {/* Copy */}
          <div className="relative z-10 my-8">
            <h1 className="text-white text-3xl font-semibold leading-tight mb-3">
              Hello,<br />Friend!
            </h1>
            <p className="text-white/75 text-sm leading-relaxed mb-8 max-w-[190px]">
              Enter your personal details and start your journey with us
            </p>
            <Link
              to="/login"
              className="inline-block px-7 py-2.5 border-[1.5px] border-white/70 rounded-full text-white text-xs font-medium tracking-widest uppercase hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-white flex flex-col justify-center px-10 py-10">
          <h2 className="text-[#6C63FF] text-2xl font-semibold text-center mb-6">
            Create Account
          </h2>

          {/* Social buttons */}
          <div className="flex justify-center gap-3 mb-5">
            {[
              { label: "Facebook", icon: "f" },
              { label: "Google", icon: "G+" },
              { label: "LinkedIn", icon: "in" },
            ].map(({ label, icon }) => (
              <button
                key={label}
                aria-label={`Register with ${label}`}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium hover:bg-gray-50 transition-colors"
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or use your email for registration</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 px-4 h-11 border border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#6C63FF] transition-colors">
                <span className="text-gray-400 text-base">👤</span>
                <input
                  type="text"
                  placeholder="First name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-3 px-4 h-11 border border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#6C63FF] transition-colors">
                <span className="text-gray-400 text-base">👤</span>
                <input
                  type="text"
                  placeholder="Last name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 px-4 h-11 border border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#6C63FF] transition-colors">
              <span className="text-gray-400 text-base">✉</span>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 px-4 h-11 border border-gray-200 rounded-xl bg-gray-50 focus-within:border-[#6C63FF] transition-colors">
              <span className="text-gray-400 text-base">🔒</span>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Confirm password */}
            <div
              className={`flex items-center gap-3 px-4 h-11 border rounded-xl bg-gray-50 transition-colors focus-within:border-[#6C63FF] ${
                confirmPassword && password !== confirmPassword
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            >
              <span className="text-gray-400 text-base">🔒</span>
              <input
                type="password"
                placeholder="Confirm password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 -mt-1 px-1">
                Passwords do not match.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 mt-1 bg-[#6C63FF] text-white text-xs font-medium tracking-widest uppercase rounded-full hover:bg-[#5a52e0] transition-colors disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-5 text-xs text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#6C63FF] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;