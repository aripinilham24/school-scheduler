import express from "express";
import db from "../lib/firestore.js";
import { generateSchedule } from "../../../client/src/utils/ScheduleGenerator.js";

const router = express.Router();

// ── GET /api/schedules ───────────────────────────────────────
router.get("/", async (req, res) => {
	try {
		const { teacherId, classId, day, grade } = req.query;

		const snapshot = await db.collection("schedules").get();

		let data = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
			createdAt: doc.data().createdAt?.toDate().toISOString() ?? null,
		}));

		const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
		data.sort((a, b) => {
			const dayA = dayOrder.indexOf(a.day);
			const dayB = dayOrder.indexOf(b.day);
			if (dayA !== dayB) return dayA - dayB;
			return (a.slot || 0) - (b.slot || 0);
		});

		if (teacherId) data = data.filter((s) => s.teacherId === teacherId);
		if (classId) data = data.filter((s) => s.classId === classId);
		if (day) data = data.filter((s) => s.day === day);
		if (grade) data = data.filter((s) => String(s.grade) === String(grade));

		res.json({ data, total: data.length });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// ── POST /api/schedules/generate ────────────────────────────
router.post("/generate", async (req, res) => {
	try {
		const { clearExisting = true } = req.body;

		// 1. Ambil semua data secara paralel
		const [classesSnap, teachersSnap, subjectsSnap, assignmentsSnap] =
			await Promise.all([
				db.collection("classrooms").get(),
				db.collection("teachers").get(),
				db.collection("subjects").get(),
				db.collection("assignments").get(),
			]);

		const classes = classesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
		const teachers = teachersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
		const subjects = subjectsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
		const assignments = assignmentsSnap.docs.map((d) => ({
			id: d.id,
			...d.data(),
		}));

		if (classes.length === 0)
			return res.status(400).json({
				error: "Belum ada data kelas. Jalankan seed terlebih dahulu.",
			});
		if (teachers.length === 0)
			return res
				.status(400)
				.json({ error: "Belum ada data guru. Jalankan seed terlebih dahulu." });
		if (subjects.length === 0)
			return res.status(400).json({
				error: "Belum ada data mata pelajaran. Jalankan seed terlebih dahulu.",
			});
		if (assignments.length === 0)
			return res.status(400).json({
				error: "Belum ada assignment guru. Jalankan seed terlebih dahulu.",
			});

		// 2. Gabungkan assignment ke dalam teacher
		// Teacher akan punya field: subjects: [{ subjectId, classIds, hoursPerWeek }]
		const teacherWithAssignments = teachers.map((teacher) => ({
			...teacher,
			subjects: assignments
				.filter((a) => a.teacherId === teacher.id)
				.map((a) => ({
					subjectId: a.subjectId,
					classIds: a.classIds,
					hoursPerWeek: a.hoursPerWeek,
				})),
		}));

		// 3. Jalankan algoritma
		const { schedules, unscheduled } = generateSchedule({
			classes,
			teachers: teacherWithAssignments,
			subjects,
		});

		if (schedules.length === 0) {
			return res.status(400).json({
				error: "Jadwal tidak bisa dibuat. Periksa data assignment guru.",
				unscheduled: unscheduled.length,
			});
		}

		// 4. Hapus jadwal lama jika diminta
		if (clearExisting) {
			const existing = await db.collection("schedules").get();
			if (!existing.empty) {
				const CHUNK = 400;
				for (let i = 0; i < existing.docs.length; i += CHUNK) {
					const batch = db.batch();
					existing.docs
						.slice(i, i + CHUNK)
						.forEach((doc) => batch.delete(doc.ref));
					await batch.commit();
				}
			}
		}

		// 5. Simpan jadwal baru (batch write)
		const CHUNK = 400;
		for (let i = 0; i < schedules.length; i += CHUNK) {
			const batch = db.batch();
			schedules.slice(i, i + CHUNK).forEach((s) => {
				batch.set(db.collection("schedules").doc(), {
					...s,
					createdAt: new Date(),
				});
			});
			await batch.commit();
		}

		res.json({
			message: `Jadwal berhasil dibuat: ${schedules.length} sesi`,
			total: schedules.length,
			unscheduled: unscheduled.length,
			warning:
				unscheduled.length > 0
					? `${unscheduled.length} sesi tidak bisa dijadwalkan karena slot penuh`
					: null,
		});
	} catch (err) {
		console.error("Generate error:", err);
		res.status(500).json({ error: err.message });
	}
});

// ── POST /api/schedules — tambah manual ─────────────────────
router.post("/", async (req, res) => {
	try {
		const { teacherId, subjectId, classId, day, slot } = req.body;
		if (!teacherId || !subjectId || !classId || !day || !slot) {
			return res.status(400).json({ error: "Data tidak lengkap" });
		}

		// Cek bentrok guru
		const teacherConflict = await db
			.collection("schedules")
			.where("teacherId", "==", teacherId)
			.where("day", "==", day)
			.where("slot", "==", slot)
			.get();
		if (!teacherConflict.empty)
			return res.status(409).json({ error: "Guru sudah mengajar di jam ini" });

		// Cek bentrok kelas
		const classConflict = await db
			.collection("schedules")
			.where("classId", "==", classId)
			.where("day", "==", day)
			.where("slot", "==", slot)
			.get();
		if (!classConflict.empty)
			return res
				.status(409)
				.json({ error: "Kelas sudah ada pelajaran di jam ini" });

		const docRef = await db.collection("schedules").add({
			...req.body,
			createdAt: new Date(),
		});

		res
			.status(201)
			.json({ message: "Jadwal berhasil ditambahkan", id: docRef.id });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// ── PUT /api/schedules/:id ───────────────────────────────────
router.put("/:id", async (req, res) => {
	try {
		const ref = db.collection("schedules").doc(req.params.id);
		const doc = await ref.get();
		if (!doc.exists)
			return res.status(404).json({ error: "Jadwal tidak ditemukan" });
		await ref.update({ ...req.body, updatedAt: new Date() });
		res.json({ message: "Jadwal berhasil diupdate" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// ── DELETE /api/schedules/:id ────────────────────────────────
router.delete("/:id", async (req, res) => {
	try {
		const ref = db.collection("schedules").doc(req.params.id);
		const doc = await ref.get();
		if (!doc.exists)
			return res.status(404).json({ error: "Jadwal tidak ditemukan" });
		await ref.delete();
		res.json({ message: "Jadwal berhasil dihapus" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// ── DELETE /api/schedules — hapus semua ─────────────────────
router.delete("/", async (req, res) => {
	try {
		const snapshot = await db.collection("schedules").get();
		if (snapshot.empty) return res.json({ message: "Tidak ada jadwal" });

		const CHUNK = 400;
		for (let i = 0; i < snapshot.docs.length; i += CHUNK) {
			const batch = db.batch();
			snapshot.docs.slice(i, i + CHUNK).forEach((doc) => batch.delete(doc.ref));
			await batch.commit();
		}

		res.json({ message: `${snapshot.size} jadwal berhasil dihapus` });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;