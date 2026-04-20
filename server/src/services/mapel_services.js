import admin from "firebase-admin";
import db from "../lib/firestore.js";

const mapelCollection = db.collection("subjects");

// Standarisasi Input dan Validasi
function normalizeMapelInput(raw) {
  return {
		name: (raw.name || "").toString().trim(),
		code: (raw.code || "").toString().trim(),
		category: (raw.category || "").toString().trim(),
		description: (raw.description || "").toString().trim(),
		grades: Array.isArray(raw.grades) ? raw.grades : [],
		majors: Array.isArray(raw.majors) ? raw.majors : [],
	};
}

// Validasi Payload untuk Create dan Update
function validateMapelPayload(payload, { requireAllFields = false } = {}) {
  const errors = [];
  const mapel = normalizeMapelInput(payload);

  if (!mapel.name) errors.push("name harus diisi");
  if (!mapel.code) errors.push("code harus diisi");

  return { mapel, errors };
}


// List Mapel dengan filter pencarian dan join teacher info
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

	// Join dengan assignments untuk mendapatkan nama guru
	if (items.length > 0) {
		try {
			const assignmentsSnap = await db.collection("assignments").get();
			const assignments = assignmentsSnap.docs.map((d) => d.data());

			// Ambil teacher IDs dan fetch teacher names
			const teacherIds = new Set();
			assignments.forEach((a) => {
				if (a.teacherId) teacherIds.add(a.teacherId);
			});

			const teacherMap = new Map();
			if (teacherIds.size > 0) {
				const teachersSnap = await db.collection("teachers").get();
				teachersSnap.docs.forEach((doc) => {
					teacherMap.set(doc.id, doc.data().name || "Unknown");
				});
			}

			// Join mapel dengan teacher dari assignments
			items.forEach((item) => {
				const assignment = assignments.find((a) => a.subjectId === item.id);
				if (assignment && teacherMap.has(assignment.teacherId)) {
					item.teacher = teacherMap.get(assignment.teacherId);
				} else {
					item.teacher = item.teacher || "-";
				}
			});
		} catch (err) {
			console.error("Error joining teacher info:", err);
			// Jika join gagal, gunakan field teacher yang ada atau default "-"
			items.forEach((item) => {
				item.teacher = item.teacher || "-";
			});
		}
	}

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

// Mengambil data mapel berdasarkan ID dengan guru info
export async function getMapelById(id) {
  if (!id) throw new Error("ID mapel tidak valid");
  const doc = await mapelCollection.doc(id).get();
  if (!doc.exists) return null;

  const mapel = { id: doc.id, ...doc.data() };
  console.log(`[getMapelById] Getting mapel: id=${id}, name=${mapel.name}`);

	// Join dengan guru dari assignments
	try {
		const assignmentsSnap = await db
			.collection("assignments")
			.where("subjectId", "==", id)
			.get();

		console.log(
			`[getMapelById] Found ${assignmentsSnap.size} assignments for subject ${id}`,
		);

		if (!assignmentsSnap.empty) {
			const assignment = assignmentsSnap.docs[0].data();
			console.log(`[getMapelById] Assignment data:`, assignment);

			if (assignment.teacherId) {
				const teacherDoc = await db
					.collection("teachers")
					.doc(assignment.teacherId)
					.get();
				if (teacherDoc.exists) {
					mapel.teacher = teacherDoc.data().name || "-";
					console.log(
						`[getMapelById] Teacher found and joined: ${mapel.teacher}`,
					);
				} else {
					console.log(
						`[getMapelById] Teacher doc not found for ID: ${assignment.teacherId}`,
					);
				}
			}
		} else {
			console.log(`[getMapelById] No assignments found for subject ${id}`);
		}
	} catch (err) {
		console.error("Error joining teacher info:", err);
	}

	mapel.teacher = mapel.teacher || "-";
	return mapel;
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

// Link guru ke subject (create/update assignment)
export async function assignTeacherToSubject(subjectId, teacherName) {
  console.log(`[assignTeacherToSubject] Starting: subjectId=${subjectId}, teacherName=${teacherName}`);
  
  if (!subjectId || !teacherName) {
    const err = new Error("Subject ID dan Teacher Name diperlukan");
    err.status = 400;
    throw err;
  }

  // Get subject details
  const subjectDoc = await mapelCollection.doc(subjectId).get();
  if (!subjectDoc.exists) {
    const err = new Error("Subject tidak ditemukan");
    err.status = 404;
    throw err;
  }

  const subject = { id: subjectDoc.id, ...subjectDoc.data() };
  console.log(`[assignTeacherToSubject] Subject found: name=${subject.name}, grades=${JSON.stringify(subject.grades)}, majors=${JSON.stringify(subject.majors)}`);

  // Find teacher by name (case-insensitive trim)
  const cleanTeacherName = teacherName.trim();
  const allTeachersSnap = await db.collection("teachers").get();
  let foundTeacher = null;
  
  allTeachersSnap.forEach((doc) => {
    const teacher = doc.data();
    if (teacher.name && teacher.name.trim() === cleanTeacherName) {
      foundTeacher = { id: doc.id, ...teacher };
    }
  });

  if (!foundTeacher) {
    console.error(`[assignTeacherToSubject] Teacher NOT FOUND: "${teacherName}"`);
    const err = new Error(`Guru "${teacherName}" tidak ditemukan`);
    err.status = 404;
    throw err;
  }

  const teacherId = foundTeacher.id;
  console.log(`[assignTeacherToSubject] Teacher found: id=${teacherId}, name=${foundTeacher.name}`);

  // Find all classrooms matching subject's grades and majors
  let classroomQuery = db.collection("classrooms");
  const snapshot = await classroomQuery.get();
  const matchingClassrooms = [];

  snapshot.forEach((doc) => {
    const classroom = doc.data();
    const subjGrades = (subject.grades && subject.grades.length > 0) ? subject.grades : [10, 11, 12];
    const subjMajors = (subject.majors && subject.majors.length > 0) ? subject.majors : ["IPA", "IPS", "Bahasa", "Teknologi"];

    if (subjGrades.includes(classroom.grade) && subjMajors.includes(classroom.major)) {
      matchingClassrooms.push({ id: doc.id, ...classroom });
    }
  });
  
  console.log(`[assignTeacherToSubject] Matching classrooms found: ${matchingClassrooms.length}`);

  // Delete existing assignments for this subject (from any teacher)
  const existingSnap = await db
    .collection("assignments")
    .where("subjectId", "==", subjectId)
    .get();

  console.log(`[assignTeacherToSubject] Deleting ${existingSnap.size} old assignments`);

  const batch = db.batch();

  // Delete old assignments
  existingSnap.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Get hours per week from seed data
  const hoursPerWeek = subject.hoursPerWeek || 2;

  // Create new assignments for all matching classrooms
  const classIds = matchingClassrooms.map((c) => c.id);
  console.log(`[assignTeacherToSubject] Creating assignment with classIds count: ${classIds.length}`);
  
  if (classIds.length > 0) {
    const assignmentData = {
      teacherId,
      subjectId,
      classIds,
      hoursPerWeek,
      createdAt: new Date(),
    };
    console.log(`[assignTeacherToSubject] Assignment data:`, assignmentData);
    batch.set(db.collection("assignments").doc(), assignmentData);
  }

  await batch.commit();
  console.log(`[assignTeacherToSubject] Batch committed successfully`);
  
  // Fetch and return updated mapel with teacher info joined
  const updated = await getMapelById(subjectId);
  console.log(`[assignTeacherToSubject] Returning updated mapel:`, updated);
  return updated;
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
	assignTeacherToSubject,
};
