import admin from "firebase-admin";
import db from "../lib/firestore.js";

const classesCollection = db.collection("classrooms");

// Standarisasi Input dan Validasi
function normalizeClassInput(raw) {
  return {
    name: (raw.name || "").toString().trim(),
    classCode: (raw.classCode || "").toString().trim(),
    level: (raw.level || "").toString().trim(),
    schedule: (raw.schedule || "").toString().trim(),
    capacity: raw.capacity !== undefined ? Number(raw.capacity) : undefined,
    students: raw.students !== undefined ? Number(raw.students) : undefined,
    teacher: (raw.teacher || "").toString().trim(),
    room: (raw.room || "").toString().trim(),
    status: (raw.status || "").toString().trim(),
    startDate: (raw.startDate || "").toString().trim(),
  };
}

// Validasi Payload untuk Create dan Update
function validateClassPayload(payload, { requireAllFields = false } = {}) {
  const errors = [];
  const classData = normalizeClassInput(payload);

  if (!classData.name) errors.push("name harus diisi");
  if (!classData.classCode) errors.push("classCode harus diisi");
  if (!classData.level) errors.push("level harus diisi");
  if (!classData.schedule) errors.push("schedule harus diisi");

  if (requireAllFields || payload.capacity !== undefined) {
    if (classData.capacity === undefined || !Number.isInteger(classData.capacity) || classData.capacity < 0) {
      errors.push("capacity harus integer >= 0");
    }
  }
  if (requireAllFields || payload.students !== undefined) {
    if (classData.students === undefined || !Number.isInteger(classData.students) || classData.students < 0) {
      errors.push("students harus integer >= 0");
    }
  }

  if (!classData.teacher) errors.push("teacher harus diisi");
  if (!classData.room) errors.push("room harus diisi");
  if (!classData.status) errors.push("status harus diisi");
  if (!classData.startDate) errors.push("startDate harus diisi");

  return { classData, errors };
}


// List Kelas dengan filter pencarian
export async function listClasses({ search = "", level, status } = {}) {
  let query = classesCollection;

  if (level) query = query.where("level", "==", level);
  if (status) query = query.where("status", "==", status);

  query = query.orderBy("createdAt", "desc");

  const snapshot = await query.get();
  const items = [];
  snapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() });
  });

  if (search) {
    const lcSearch = search.toString().trim().toLowerCase();
    return items.filter((item) =>
      (item.name || "").toString().toLowerCase().includes(lcSearch) ||
      (item.classCode || "").toString().toLowerCase().includes(lcSearch) ||
      (item.teacher || "").toString().toLowerCase().includes(lcSearch),
    );
  }

  return items;
}

// Mengambil data kelas berdasarkan ID
export async function getClassById(id) {
  if (!id) throw new Error("ID class tidak valid");
  const doc = await classesCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

// Tambah Kelas
export async function createClass(payload) {
  const { classData, errors } = validateClassPayload(payload, { requireAllFields: true });
  if (errors.length) {
    const err = new Error("Data tidak valid");
    err.status = 400;
    err.details = errors;
    throw err;
  }

  const newDoc = await classesCollection.add({
    ...classData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return getClassById(newDoc.id);
}

// Update Kelas
export async function updateClass(id, payload) {
  if (!id) {
    const err = new Error("ID class diperlukan");
    err.status = 400;
    throw err;
  }

  const existing = await getClassById(id);
  if (!existing) {
    const err = new Error("Class tidak ditemukan");
    err.status = 404;
    throw err;
  }

  const { classData, errors } = validateClassPayload({ ...existing, ...payload }, { requireAllFields: false });
  if (errors.length) {
    const err = new Error("Data tidak valid");
    err.status = 400;
    err.details = errors;
    throw err;
  }

  const updateData = {
    ...classData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await classesCollection.doc(id).update(updateData);
  return getClassById(id);
}

// Hapus Kelas
export async function deleteClass(id) {
  if (!id) {
    const err = new Error("ID class diperlukan");
    err.status = 400;
    throw err;
  }

  const existing = await getClassById(id);
  if (!existing) {
    const err = new Error("Class tidak ditemukan");
    err.status = 404;
    throw err;
  }

  await classesCollection.doc(id).delete();
  return true;
}

export default {
  listClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};
