import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import teacherRoutes from "./routes/teachers.js";
// import classroomRoutes from "./routes/classrooms.js";
// import subjectRoutes from "./routes/subjects.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:5173",
		credentials: true,
	}),
);
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────
app.use("/api/teachers", teacherRoutes);
// app.use("/api/classrooms", classroomRoutes);
// app.use("/api/subjects", subjectRoutes);

// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
	res.json({ status: "ok", message: "SkillSet API berjalan normal" });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
	res.status(404).json({ error: "Route tidak ditemukan" });
});

// ── Error handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
	console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});