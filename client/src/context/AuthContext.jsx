import { createContext, useContext, useState, useEffect, useCallback } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Token tidak valid");
      const json = await res.json();
      setUser(json.data);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Login gagal");
    localStorage.setItem("token", json.data.token);
    setUser(json.data.user);
    return json.data.user;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Registrasi gagal");
    return json.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
