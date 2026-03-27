import { Router } from "express";
import teacherController from "../controllers/teachers_controller.js";
import { db } from "./../lib/firebase.js";

const router = Router();

// Ambil data semua guru
router.get("/", async (req, res) => {
	try {
		const snapshot = await db
			.collection(COL)
			.orderBy("createdAt", "desc")
			.get();

		const data = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
			// konversi Firestore Timestamp ke ISO string
			createdAt: doc.data().createdAt?.toDate().toISOString() ?? null,
			updatedAt: doc.data().updatedAt?.toDate().toISOString() ?? null,
		}));

		res.json({ data });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Ambil satu guru
router.get("/:id", async (req, res) => {
	try {
		const doc = await db.collection(COL).doc(req.params.id).get();
		if (!doc.exists)
			return res.status(404).json({ error: "Guru tidak ditemukan" });

		res.json({
			data: {
				id: doc.id,
				...doc.data(),
				createdAt: doc.data().createdAt?.toDate().toISOString() ?? null,
				updatedAt: doc.data().updatedAt?.toDate().toISOString() ?? null,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Tambah Guru
router.post("/", async (req, res) => {
	try {
		const { name, subject, email, phone, status, rating } = req.body;

		if (!name || !email) {
			return res.status(400).json({ error: "Name dan email wajib diisi" });
		}

		const docRef = await db.collection(COL).add({
			name,
			subject: subject ?? "",
			email,
			phone: phone ?? "",
			status: status ?? "Active",
			rating: rating ?? 0,
			students: 0,
			courses: 0,
			createdAt: new Date(),
		});

		res
			.status(201)
			.json({ message: "Guru berhasil ditambahkan", id: docRef.id });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Edit guru
router.put("/:id", async (req, res) => {
	try {
		const ref = db.collection(COL).doc(req.params.id);
		const doc = await ref.get();
		if (!doc.exists)
			return res.status(404).json({ error: "Guru tidak ditemukan" });

		await ref.update({
			...req.body,
			updatedAt: new Date(),
		});

		res.json({ message: "Guru berhasil diupdate" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Hapus guru
router.delete("/:id", async (req, res) => {
	try {
		const ref = db.collection(COL).doc(req.params.id);
		const doc = await ref.get();
		if (!doc.exists)
			return res.status(404).json({ error: "Guru tidak ditemukan" });

		await ref.delete();
		res.json({ message: "Guru berhasil dihapus" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
