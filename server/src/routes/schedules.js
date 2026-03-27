import express from "express";
import  db  from "./../lib/firestore.js";

const router = express.Router();
const COL = "schedules";

// GET /api/schedules — ambil semua jadwal (bisa filter by teacherId)
router.get("/", async (req, res) => {
  try {
    const { teacherId } = req.query;

    let ref = db.collection(COL).orderBy("createdAt", "desc");
    if (teacherId) {
      ref = db.collection(COL).where("teacherId", "==", teacherId).orderBy("createdAt", "desc");
    }

    const snapshot = await ref.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() ?? null,
      updatedAt: doc.data().updatedAt?.toDate().toISOString() ?? null,
    }));

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/schedules/:id
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection(COL).doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Jadwal tidak ditemukan" });

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

// POST /api/schedules — tambah jadwal baru
router.post("/", async (req, res) => {
  try {
    const { teacherId, subject, time, day, room } = req.body;

    if (!teacherId || !subject || !time) {
      return res.status(400).json({ error: "teacherId, subject, dan time wajib diisi" });
    }

    const docRef = await db.collection(COL).add({
      teacherId,
      subject,
      time,
      day:       day  ?? "",
      room:      room ?? "",
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Jadwal berhasil ditambahkan", id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/schedules/:id
router.put("/:id", async (req, res) => {
  try {
    const ref = db.collection(COL).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: "Jadwal tidak ditemukan" });

    await ref.update({ ...req.body, updatedAt: new Date() });
    res.json({ message: "Jadwal berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/schedules/:id
router.delete("/:id", async (req, res) => {
  try {
    const ref = db.collection(COL).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: "Jadwal tidak ditemukan" });

    await ref.delete();
    res.json({ message: "Jadwal berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;