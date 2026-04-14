import admin from "firebase-admin";
import db from "../lib/firestore.js";

const mapelCollection = db.collection("subjects");

// Standarisasi Input dan Validasi
function normalizeMapelInput(raw) {
  return {
    name: (raw.name || "").toString().trim(),
    code: (raw.code || "").toString().trim(),
    level: (raw.level || "").toString().trim(),
    description: (raw.description || "").toString().trim(),
    credits: raw.credits !== undefined ? Number(raw.credits) : undefined,
    hours: raw.hours !== undefined ? Number(raw.hours) : undefined,
    teacher: (raw.teacher || "").toString().trim(),
    status: (raw.status || "").toString().trim(),
  };
}

// Validasi Payload untuk Create dan Update
function validateMapelPayload(payload, { requireAllFields = false } = {}) {
  const errors = [];
  const mapel = normalizeMapelInput(payload);

  if (!mapel.name) errors.push("name harus diisi");
  if (!mapel.code) errors.push("code harus diisi");
  if (!mapel.level) errors.push("level harus diisi");

  if (requireAllFields || payload.credits !== undefined) {
    if (mapel.credits === undefined || !Number.isInteger(mapel.credits) || mapel.credits < 0) {
      errors.push("credits harus integer >= 0");
    }
  }
  if (requireAllFields || payload.hours !== undefined) {
    if (mapel.hours === undefined || !Number.isInteger(mapel.hours) || mapel.hours < 0) {
      errors.push("hours harus integer >= 0");
    }
  }

  if (!mapel.teacher) errors.push("teacher harus diisi");
  if (!mapel.status) errors.push("status harus diisi");

  return { mapel, errors };
}


// List Mapel dengan filter pencarian
export async function listMapel({ search = "", level, status } = {}) {
  let query = mapelCollection;

  if (level) query = query.where("level", "==", level);
  if (status) query = query.where("status", "==", status);

  const snapshot = await query.get();
  const items = [];
  snapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() });
  });

  items.sort((a, b) => {
		const timeA = a.createdAt?.toDate?.().getTime() ?? 0;
		const timeB = b.createdAt?.toDate?.().getTime() ?? 0;
		return timeB - timeA;
	});

  if (search) {
    const lcSearch = search.toString().trim().toLowerCase();
    return items.filter((item) =>
      (item.name || "").toString().toLowerCase().includes(lcSearch) ||
      (item.code || "").toString().toLowerCase().includes(lcSearch) ||
      (item.teacher || "").toString().toLowerCase().includes(lcSearch),
    );
  }

  return items;
}

// Mengambil data mapel berdasarkan ID
export async function getMapelById(id) {
  if (!id) throw new Error("ID mapel tidak valid");
  const doc = await mapelCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

// Tambah Mapel
export async function createMapel(payload) {
  const { mapel, errors } = validateMapelPayload(payload, { requireAllFields: true });
  if (errors.length) {
    const err = new Error("Data tidak valid");
    err.status = 400;
    err.details = errors;
    throw err;
  }

  const newDoc = await mapelCollection.add({
    ...mapel,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return getMapelById(newDoc.id);
}

// Update Mapel
export async function updateMapel(id, payload) {
  if (!id) {
    const err = new Error("ID mapel diperlukan");
    err.status = 400;
    throw err;
  }

  const existing = await getMapelById(id);
  if (!existing) {
    const err = new Error("Mapel tidak ditemukan");
    err.status = 404;
    throw err;
  }

  const { mapel, errors } = validateMapelPayload({ ...existing, ...payload }, { requireAllFields: false });
  if (errors.length) {
    const err = new Error("Data tidak valid");
    err.status = 400;
    err.details = errors;
    throw err;
  }

  const updateData = {
    ...mapel,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await mapelCollection.doc(id).update(updateData);
  return getMapelById(id);
}

// Hapus Mapel
export async function deleteMapel(id) {
  if (!id) {
    const err = new Error("ID mapel diperlukan");
    err.status = 400;
    throw err;
  }

  const existing = await getMapelById(id);
  if (!existing) {
    const err = new Error("Mapel tidak ditemukan");
    err.status = 404;
    throw err;
  }

  await mapelCollection.doc(id).delete();
  return true;
}

export default {
  listMapel,
  getMapelById,
  createMapel,
  updateMapel,
  deleteMapel,
};
