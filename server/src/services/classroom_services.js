import db from "../lib/firestore.js";

const classroomsCollection = db.collection("classrooms");

// List all classrooms
export async function listClassrooms() {
	const snapshot = await classroomsCollection.get();
	
	const data = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
		createdAt: doc.data().createdAt?.toDate?.().toISOString?.() ?? null,
	}));

	// Sort by grade, then by major
	const majorOrder = ["IPA", "IPS", "Bahasa", "Teknologi"];
	data.sort((a, b) => {
		if (a.grade !== b.grade) return a.grade - b.grade;
		const majorIndexA = majorOrder.indexOf(a.major || "");
		const majorIndexB = majorOrder.indexOf(b.major || "");
		return majorIndexA - majorIndexB;
	});

	return data;
}

// Get classroom by ID
export async function getClassroomById(id) {
	if (!id) throw new Error("ID kelas tidak valid");
	const doc = await classroomsCollection.doc(id).get();
	if (!doc.exists) return null;
	return {
		id: doc.id,
		...doc.data(),
		createdAt: doc.data().createdAt?.toDate?.().toISOString?.() ?? null,
	};
}

// Create new classroom
export async function createClassroom(payload) {
	const { name, code, grade, major, room, students, capacity, status, description } = payload;

	if (!name || !code || !grade) {
		const err = new Error("Nama, kode, dan grade kelas tidak boleh kosong");
		err.status = 400;
		throw err;
	}

	const docRef = await classroomsCollection.add({
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

	return getClassroomById(docRef.id);
}

// Update classroom
export async function updateClassroom(id, payload) {
	if (!id) {
		const err = new Error("ID kelas diperlukan");
		err.status = 400;
		throw err;
	}

	const existing = await getClassroomById(id);
	if (!existing) {
		const err = new Error("Kelas tidak ditemukan");
		err.status = 404;
		throw err;
	}

	const ref = classroomsCollection.doc(id);
	await ref.update({
		...payload,
		updatedAt: new Date(),
	});

	return getClassroomById(id);
}

// Delete classroom
export async function deleteClassroom(id) {
	if (!id) {
		const err = new Error("ID kelas diperlukan");
		err.status = 400;
		throw err;
	}

	const existing = await getClassroomById(id);
	if (!existing) {
		const err = new Error("Kelas tidak ditemukan");
		err.status = 404;
		throw err;
	}

	await classroomsCollection.doc(id).delete();
	return true;
}

export default {
	listClassrooms,
	getClassroomById,
	createClassroom,
	updateClassroom,
	deleteClassroom,
};
