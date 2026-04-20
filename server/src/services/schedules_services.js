import db from "../lib/firestore.js";
import { generateSchedule } from "../../../client/src/utils/ScheduleGenerator.js";

const schedulesCollection = db.collection("schedules");

// List Jadwal dengan filter
export async function listSchedules({ teacherId, classId, day, grade } = {}) {
  const snapshot = await schedulesCollection.get();

  let data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.().toISOString?.() ?? null,
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

  return data;
}

// Ambil jadwal berdasarkan ID
export async function getScheduleById(id) {
  if (!id) throw new Error("ID jadwal tidak valid");
  const doc = await schedulesCollection.doc(id).get();
  if (!doc.exists) return null;
  return { 
    id: doc.id, 
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.().toISOString?.() ?? null,
  };
}

// Tambah Jadwal Manual dengan pengecekan bentrok
export async function createSchedule(payload) {
  const { teacherId, subjectId, classId, day, slot } = payload;

  if (!teacherId || !subjectId || !classId || !day || !slot) {
    const err = new Error("Data tidak lengkap");
    err.status = 400;
    throw err;
  }

  // Cek bentrok guru
  const teacherConflict = await schedulesCollection
    .where("teacherId", "==", teacherId)
    .where("day", "==", day)
    .where("slot", "==", slot)
    .get();

  if (!teacherConflict.empty) {
    const err = new Error("Guru sudah mengajar di jam ini");
    err.status = 409;
    throw err;
  }

  // Cek bentrok kelas
  const classConflict = await schedulesCollection
    .where("classId", "==", classId)
    .where("day", "==", day)
    .where("slot", "==", slot)
    .get();

  if (!classConflict.empty) {
    const err = new Error("Kelas sudah ada pelajaran di jam ini");
    err.status = 409;
    throw err;
  }

  const docRef = await schedulesCollection.add({
    ...payload,
    createdAt: new Date(),
  });

  return getScheduleById(docRef.id);
}

// Update Jadwal
export async function updateSchedule(id, payload) {
  if (!id) {
    const err = new Error("ID jadwal diperlukan");
    err.status = 400;
    throw err;
  }

  const existing = await getScheduleById(id);
  if (!existing) {
    const err = new Error("Jadwal tidak ditemukan");
    err.status = 404;
    throw err;
  }

  const ref = schedulesCollection.doc(id);
  await ref.update({
    ...payload,
    updatedAt: new Date(),
  });

  return getScheduleById(id);
}

// Hapus Jadwal
export async function deleteSchedule(id) {
  if (!id) {
    const err = new Error("ID jadwal diperlukan");
    err.status = 400;
    throw err;
  }

  const existing = await getScheduleById(id);
  if (!existing) {
    const err = new Error("Jadwal tidak ditemukan");
    err.status = 404;
    throw err;
  }

  await schedulesCollection.doc(id).delete();
  return true;
}

// Hapus Semua Jadwal
export async function deleteAllSchedules() {
  const existing = await schedulesCollection.get();
  if (existing.empty) {
    return 0;
  }
  
  const CHUNK = 400;
  let deleted = 0;
  for (let i = 0; i < existing.docs.length; i += CHUNK) {
    const batch = db.batch();
    existing.docs.slice(i, i + CHUNK).forEach((doc) => {
      batch.delete(doc.ref);
      deleted++;
    });
    await batch.commit();
  }
  return deleted;
}

// Generate Jadwal Otomatis
export async function generateSchedules({ clearExisting = true } = {}) {
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

	if (classes.length === 0) {
		const err = new Error(
			"Belum ada data kelas. Jalankan seed terlebih dahulu.",
		);
		err.status = 400;
		throw err;
	}
	if (teachers.length === 0) {
		const err = new Error(
			"Belum ada data guru. Jalankan seed terlebih dahulu.",
		);
		err.status = 400;
		throw err;
	}
	if (subjects.length === 0) {
		const err = new Error(
			"Belum ada data mata pelajaran. Jalankan seed terlebih dahulu.",
		);
		err.status = 400;
		throw err;
	}
	if (assignments.length === 0) {
		const err = new Error(
			"Belum ada assignment guru. Jalankan seed terlebih dahulu.",
		);
		err.status = 400;
		throw err;
	}

	// 2. Gabungkan assignment ke dalam teacher
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
		const err = new Error(
			"Jadwal tidak bisa dibuat. Periksa data assignment guru.",
		);
		err.status = 400;
		err.details = { unscheduled: unscheduled.length };
		throw err;
	}

	// 2.5 Hitung allocation per assignment
	const allocationByAssignment = new Map();
	for (const schedule of schedules) {
		const key = `${schedule.teacherId}_${schedule.subjectId}_${schedule.classId}`;
		if (!allocationByAssignment.has(key)) {
			allocationByAssignment.set(key, {
				target: 0,
				allocated: 0,
				subject: schedule.subjectName,
			});
		}
		const record = allocationByAssignment.get(key);
		record.allocated += schedule.double ? 2 : 1;
	}

	// Get target hours from assignments
	for (const assign of assignments) {
		for (const classId of assign.classIds || []) {
			const key = `${assign.teacherId}_${assign.subjectId}_${classId}`;
			if (allocationByAssignment.has(key)) {
				allocationByAssignment.get(key).target = assign.hoursPerWeek;
			}
		}
	}

	// Count over/under allocated
	let underAllocated = 0;
	let fullyAllocated = 0;
	for (const [_, record] of allocationByAssignment) {
		if (record.allocated < record.target) {
			underAllocated++;
		} else {
			fullyAllocated++;
		}
	}

	// 4. Hapus jadwal lama jika diminta
	if (clearExisting) {
		const existing = await schedulesCollection.get();
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
	const subjectMap = {};
	subjects.forEach((s) => {
		subjectMap[s.id] = s.name;
	});

	for (let i = 0; i < schedules.length; i += CHUNK) {
		const batch = db.batch();
		schedules.slice(i, i + CHUNK).forEach((s) => {
			batch.set(schedulesCollection.doc(), {
				...s,
				subject: s.subjectName || subjectMap[s.subjectId] || "Unknown",
				createdAt: new Date(),
			});
		});
		await batch.commit();
	}

	return {
		total: schedules.length,
		unscheduled: unscheduled.length,
		fullyAllocated,
		underAllocated,
		allocationRate: `${fullyAllocated}/${fullyAllocated + underAllocated}`,
		warning:
			unscheduled.length > 0
				? `${unscheduled.length} sesi tidak bisa dijadwalkan karena slot penuh`
				: null,
		notice:
			underAllocated > 0
				? `${underAllocated} assignment belum mencapai target jam per minggu`
				: "Semua assignment sudah mencapai target jam per minggu ✓",
	};
}

export default {
  listSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  generateSchedules,
};
