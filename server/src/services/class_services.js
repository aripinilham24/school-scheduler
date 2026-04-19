import db from "../lib/firestore.js";

const classesCollection = db.collection("classrooms");

// List Kelas dengan filter
export async function listClasses({ search = "", grade, major, status } = {}) {
	let snapshot = await classesCollection.get();
	let items = [];

	snapshot.forEach((doc) => {
		items.push({ id: doc.id, ...doc.data() });
	});

	// Filter by grade
	if (grade) {
		items = items.filter((c) => c.grade === parseInt(grade));
	}

	// Filter by major
	if (major) {
		items = items.filter((c) => c.major === major);
	}

	// Filter by status
	if (status) {
		items = items.filter((c) => c.status === status);
	}

	// Filter by search
	if (search) {
		const lcSearch = search.toString().trim().toLowerCase();
		items = items.filter(
			(item) =>
				(item.name || "").toString().toLowerCase().includes(lcSearch) ||
				(item.code || "").toString().toLowerCase().includes(lcSearch) ||
				(item.major || "").toString().toLowerCase().includes(lcSearch),
		);
	}

	// Sort by grade, then major
	const majorOrder = ["IPA", "IPS", "Bahasa", "Teknologi"];
	items.sort((a, b) => {
		if (a.grade !== b.grade) return a.grade - b.grade;
		const majorIndexA = majorOrder.indexOf(a.major || "");
		const majorIndexB = majorOrder.indexOf(b.major || "");
		return majorIndexA - majorIndexB;
	});

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
	const {
		name,
		code,
		grade,
		major,
		room,
		students,
		capacity,
		status,
		description,
	} = payload;

	if (!name || !code || !grade) {
		const err = new Error("Nama, kode, dan grade kelas tidak boleh kosong");
		err.status = 400;
		throw err;
	}

	const newDoc = await classesCollection.add({
		name,
		code,
		grade: parseInt(grade),
		major: major || null,
		room: room || null,
		students: students || 0,
		capacity: capacity || 40,
		status: status || "Active",
		description: description || "",
		createdAt: new Date(),
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

	const updateData = {
		...payload,
		grade: payload.grade ? parseInt(payload.grade) : existing.grade,
		updatedAt: new Date(),
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
