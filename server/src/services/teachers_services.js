import admin from "firebase-admin";
import db from "../lib/firestore.js";

const teachersCollection = db.collection("teachers");

function normalizeTeacherInput(raw) {
  return {
    name: (raw.name || "").toString().trim(),
    subject: (raw.subject || "").toString().trim(),
    email: (raw.email || "").toString().trim().toLowerCase(),
    phone: (raw.phone || "").toString().trim(),
    status: (raw.status || "").toString().trim(),
    rating: raw.rating !== undefined ? Number(raw.rating) : undefined,
    students: raw.students !== undefined ? Number(raw.students) : undefined,
    courses: raw.courses !== undefined ? Number(raw.courses) : undefined,
    joinDate: (raw.joinDate || "").toString().trim(),
  };
}

function validateTeacherPayload(payload, { requireAllFields = false } = {}) {
  const errors = [];
  const teacher = normalizeTeacherInput(payload);

  if (!teacher.name) errors.push("name harus diisi");
  if (!teacher.subject) errors.push("subject harus diisi");
  if (!teacher.email) {
    errors.push("email harus diisi");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacher.email)) {
    errors.push("email tidak valid");
  }

  if (!teacher.phone) errors.push("phone harus diisi");
  if (!teacher.status) errors.push("status harus diisi");

  if (requireAllFields || payload.rating !== undefined) {
    if (teacher.rating === undefined || Number.isNaN(teacher.rating) || teacher.rating < 0 || teacher.rating > 5) {
      errors.push("rating harus angka antara 0 sampai 5");
    }
  }
  if (requireAllFields || payload.students !== undefined) {
    if (teacher.students === undefined || !Number.isInteger(teacher.students) || teacher.students < 0) {
      errors.push("students harus integer >= 0");
    }
  }
  if (requireAllFields || payload.courses !== undefined) {
    if (teacher.courses === undefined || !Number.isInteger(teacher.courses) || teacher.courses < 0) {
      errors.push("courses harus integer >= 0");
    }
  }

  if (!teacher.joinDate) errors.push("joinDate harus diisi");

  return { teacher, errors };
}

export async function listTeachers({ search = "", subject, status } = {}) {
  let query = teachersCollection;

  if (subject) query = query.where("subject", "==", subject);
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
      (item.email || "").toString().toLowerCase().includes(lcSearch) ||
      (item.subject || "").toString().toLowerCase().includes(lcSearch),
    );
  }

  return items;
}

export async function getTeacherById(id) {
  if (!id) throw new Error("ID teacher tidak valid");
  const doc = await teachersCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function createTeacher(payload) {
  const { teacher, errors } = validateTeacherPayload(payload, { requireAllFields: true });
  if (errors.length) {
    const err = new Error("Data tidak valid");
    err.status = 400;
    err.details = errors;
    throw err;
  }

  const newDoc = await teachersCollection.add({
    ...teacher,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return getTeacherById(newDoc.id);
}

export async function updateTeacher(id, payload) {
  if (!id) {
    const err = new Error("ID teacher diperlukan");
    err.status = 400;
    throw err;
  }

  const existing = await getTeacherById(id);
  if (!existing) {
    const err = new Error("Teacher tidak ditemukan");
    err.status = 404;
    throw err;
  }

  const { teacher, errors } = validateTeacherPayload({ ...existing, ...payload }, { requireAllFields: false });
  if (errors.length) {
    const err = new Error("Data tidak valid");
    err.status = 400;
    err.details = errors;
    throw err;
  }

  const updateData = {
    ...teacher,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await teachersCollection.doc(id).update(updateData);
  return getTeacherById(id);
}

export async function deleteTeacher(id) {
  if (!id) {
    const err = new Error("ID teacher diperlukan");
    err.status = 400;
    throw err;
  }

  const existing = await getTeacherById(id);
  if (!existing) {
    const err = new Error("Teacher tidak ditemukan");
    err.status = 404;
    throw err;
  }

  await teachersCollection.doc(id).delete();
  return true;
}

export default {
  listTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
