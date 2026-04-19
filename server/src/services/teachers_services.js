import admin from "firebase-admin";
import db from "../lib/firestore.js";

const teachersCollection = db.collection("teachers");

// Standarisasi Input dan Validasi
function normalizeTeacherInput(raw) {
	return {
		name: (raw.name || "").toString().trim(),
		subject: (raw.subject || "").toString().trim(),
		email: (raw.email || "").toString().trim().toLowerCase(),
		phone: (raw.phone || "").toString().trim(),
		status: (raw.status || "Active").toString().trim(),
		grades: Array.isArray(raw.grades) ? raw.grades : [],
		majors: Array.isArray(raw.majors) ? raw.majors : [],
		rating: raw.rating !== undefined ? Number(raw.rating) : 0,
		students: raw.students !== undefined ? Number(raw.students) : 0,
		courses: raw.courses !== undefined ? Number(raw.courses) : 0,
	};
}

// Validasi Payload untuk Create dan Update
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

	if (teacher.rating < 0 || teacher.rating > 5) {
		errors.push("rating harus angka antara 0 sampai 5");
	}

	if (teacher.students < 0) {
		errors.push("students harus integer >= 0");
	}

	if (teacher.courses < 0) {
		errors.push("courses harus integer >= 0");
	}

	return { teacher, errors };
}

// List Guru dengan filter pencarian
export async function listTeachers({ search = "", subject, status } = {}) {
	const snapshot = await teachersCollection.get();
	let items = [];

	snapshot.forEach((doc) => {
		items.push({ id: doc.id, ...doc.data() });
	});

	// Filter by subject
	if (subject) {
		items = items.filter((t) => t.subject === subject);
	}

	// Filter by status
	if (status) {
		items = items.filter((t) => t.status === status);
	}

	// Filter by search
	if (search) {
		const lcSearch = search.toString().trim().toLowerCase();
		items = items.filter(
			(item) =>
				(item.name || "").toString().toLowerCase().includes(lcSearch) ||
				(item.email || "").toString().toLowerCase().includes(lcSearch) ||
				(item.subject || "").toString().toLowerCase().includes(lcSearch),
		);
	}

	// Sort by name
	items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

	return items;
}

// Mengambil data guru berdasarkan ID
export async function getTeacherById(id) {
  if (!id) throw new Error("ID teacher tidak valid");
  const doc = await teachersCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

// Tambah Guru
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

// Update Guru
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

// Hapus GUru
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
