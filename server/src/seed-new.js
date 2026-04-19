import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// ── Init Firebase Admin ──────────────────────────────────────
if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
		}),
	});
}

const db = admin.firestore();

// ── CONSTANTS ────────────────────────────────────────────────
const MAJORS = ["IPA", "IPS", "Bahasa", "Teknologi"];
const GRADES = [10, 11, 12];
const MAJOR_DISTRIBUTION = {
	IPA: 3,
	IPS: 2,
	Bahasa: 2,
	Teknologi: 2,
};

// ── GURU (Dengan Grade + Major Specialization) ──────────────

const teachers = [
	// ── Matematika (semua grade, semua jurusan) ──
	{
		name: "Drs. Bambang Setiawan",
		subject: "Matematika",
		grades: [10, 11, 12],
		majors: ["IPA", "IPS", "Bahasa", "Teknologi"], // semua
		email: "bambang.setiawan@sman1.id",
		phone: "+62 812-3456-7890",
		status: "Active",
	},
	{
		name: "Prof. Siti Haryanto, M.Pd.",
		subject: "Matematika",
		grades: [10, 11, 12],
		majors: ["IPA", "IPS", "Bahasa", "Teknologi"],
		email: "siti.haryanto@sman1.id",
		phone: "+62 812-1111-1111",
		status: "Active",
	},

	// ── Bahasa Indonesia (semua grade, semua jurusan) ──
	{
		name: "Siti Nurhaliza, S.Pd.",
		subject: "Bahasa Indonesia",
		grades: [10, 11, 12],
		majors: ["IPA", "IPS", "Bahasa", "Teknologi"],
		email: "siti.nurhaliza@sman1.id",
		phone: "+62 814-3456-7891",
		status: "Active",
	},
	{
		name: "Dr. Rahayu Putri, M.Pd.",
		subject: "Bahasa Indonesia",
		grades: [10, 11, 12],
		majors: ["IPA", "IPS", "Bahasa", "Teknologi"],
		email: "rahayu.putri@sman1.id",
		phone: "+62 814-2222-2222",
		status: "Active",
	},

	// ── IPA: Fisika (hanya grade 11-12, hanya IPA) ──
	{
		name: "Ir. Suryanto, M.T.",
		subject: "Fisika",
		grades: [11, 12],
		majors: ["IPA"],
		email: "suryanto@sman1.id",
		phone: "+62 813-2345-6789",
		status: "Active",
	},
	{
		name: "Dr. Eka Wijaya, M.Si.",
		subject: "Fisika",
		grades: [11, 12],
		majors: ["IPA"],
		email: "eka.wijaya@sman1.id",
		phone: "+62 813-3333-3333",
		status: "Active",
	},

	// ── IPA: Kimia (hanya grade 11-12, hanya IPA) ──
	{
		name: "Drs. Ahmad Wijaya",
		subject: "Kimia",
		grades: [11, 12],
		majors: ["IPA"],
		email: "ahmad.wijaya@sman1.id",
		phone: "+62 815-4567-8902",
		status: "Active",
	},
	{
		name: "Dra. Nurma Sari, M.Sc.",
		subject: "Kimia",
		grades: [11, 12],
		majors: ["IPA"],
		email: "nurma.sari@sman1.id",
		phone: "+62 815-4444-4444",
		status: "Active",
	},

	// ── IPA: Biologi (hanya grade 11-12, hanya IPA) ──
	{
		name: "Dr. Rina Dewi Kusuma",
		subject: "Biologi",
		grades: [11, 12],
		majors: ["IPA"],
		email: "rina.dewi@sman1.id",
		phone: "+62 816-5678-9013",
		status: "Active",
	},

	// ── IPS: Ekonomi (hanya grade 11-12, hanya IPS) ──
	{
		name: "Prof. Drs. Sutrisno, M.A.",
		subject: "Ekonomi",
		grades: [11, 12],
		majors: ["IPS"],
		email: "sutrisno@sman1.id",
		phone: "+62 819-8901-2346",
		status: "Active",
	},

	// ── IPS: Sejarah (grade 10-11-12, tapi prioritas IPS) ──
	{
		name: "Drs. Eka Prasetya",
		subject: "Sejarah",
		grades: [10, 11, 12],
		majors: ["IPS", "Bahasa", "IPA"],
		email: "eka.prasetya@sman1.id",
		phone: "+62 818-7890-1235",
		status: "Active",
	},

	// ── IPS: Geografi (hanya grade 11-12, hanya IPS) ──
	{
		name: "Drs. Warsito",
		subject: "Geografi",
		grades: [11, 12],
		majors: ["IPS"],
		email: "warsito@sman1.id",
		phone: "+62 823-2345-6780",
		status: "Active",
	},

	// ── IPS: Sosiologi (hanya grade 11-12, hanya IPS) ──
	{
		name: "Dra. Endang Sulistyowati",
		subject: "Sosiologi",
		grades: [11, 12],
		majors: ["IPS"],
		email: "endang.s@sman1.id",
		phone: "+62 825-4567-8902",
		status: "Active",
	},

	// ── Bahasa: Bahasa Inggris (semua grade, prioritas Bahasa) ──
	{
		name: "Sri Wahyuningsih, S.Pd.",
		subject: "Bahasa Inggris",
		grades: [10, 11, 12],
		majors: ["Bahasa", "IPA", "IPS", "Teknologi"],
		email: "sri.wahyuningsih@sman1.id",
		phone: "+62 822-1234-5679",
		status: "Active",
	},
	{
		name: "David Foster, M.A.",
		subject: "Bahasa Inggris",
		grades: [10, 11, 12],
		majors: ["Bahasa", "IPA", "IPS"],
		email: "david.foster@sman1.id",
		phone: "+62 822-5555-5555",
		status: "Active",
	},

	// ── Teknologi: TIK (grade 10-11, prioritas Teknologi) ──
	{
		name: "Ing. Hendra Gunawan, M.Cs.",
		subject: "Teknologi Informasi",
		grades: [10, 11],
		majors: ["Teknologi", "IPA"],
		email: "hendra.gunawan@sman1.id",
		phone: "+62 817-6789-0124",
		status: "Active",
	},
	{
		name: "Bambang Sugiono, S.Kom.",
		subject: "Teknologi Informasi",
		grades: [10, 11, 12],
		majors: ["Teknologi", "IPA"],
		email: "bambang.sugiono@sman1.id",
		phone: "+62 817-6666-6666",
		status: "Active",
	},

	// ── Seni/Budaya (semua grade) ──
	{
		name: "Drs. Haryanto, S.Sn.",
		subject: "Seni Budaya",
		grades: [10, 11, 12],
		majors: ["IPA", "IPS", "Bahasa", "Teknologi"],
		email: "haryanto@sman1.id",
		phone: "+62 820-9012-3457",
		status: "Active",
	},

	// ── PJOK (semua grade) ──
	{
		name: "Drs. Bambang Irawan, M.Pd.",
		subject: "Pendidikan Jasmani",
		grades: [10, 11, 12],
		majors: ["IPA", "IPS", "Bahasa", "Teknologi"],
		email: "bambang.irawan@sman1.id",
		phone: "+62 821-0123-4568",
		status: "Active",
	},
	{
		name: "Erwin Kusaeri, S.Pd.",
		subject: "Pendidikan Jasmani",
		grades: [10, 11, 12],
		majors: ["IPA", "IPS", "Bahasa", "Teknologi"],
		email: "erwin.kusaeri@sman1.id",
		phone: "+62 821-7777-7777",
		status: "Active",
	},

	// ── PPKN (semua grade) ──
	{
		name: "Drs. Agus Santoso",
		subject: "Pendidikan Pancasila",
		grades: [10, 11, 12],
		majors: ["IPA", "IPS", "Bahasa", "Teknologi"],
		email: "agus.santoso@sman1.id",
		phone: "+62 824-3456-7891",
		status: "Active",
	},
];

// ── MATA PELAJARAN (Subjects dengan spesialisasi per jurusan) ──

const subjects = [
	// Umum (semua grade, semua jurusan)
	{ code: "MTK", name: "Matematika", category: "Wajib", grades: [10, 11, 12], majors: ["IPA", "IPS", "Bahasa", "Teknologi"] },
	{ code: "BI", name: "Bahasa Indonesia", category: "Wajib", grades: [10, 11, 12], majors: ["IPA", "IPS", "Bahasa", "Teknologi"] },
	{ code: "ING", name: "Bahasa Inggris", category: "Wajib", grades: [10, 11, 12], majors: ["IPA", "IPS", "Bahasa", "Teknologi"] },
	{ code: "PPKN", name: "Pendidikan Pancasila", category: "Wajib", grades: [10, 11, 12], majors: ["IPA", "IPS", "Bahasa", "Teknologi"] },
	{ code: "PJOK", name: "Pendidikan Jasmani", category: "Wajib", grades: [10, 11, 12], majors: ["IPA", "IPS", "Bahasa", "Teknologi"] },
	{ code: "SBD", name: "Seni Budaya", category: "Wajib", grades: [10, 11, 12], majors: ["IPA", "IPS", "Bahasa", "Teknologi"] },

	// IPA (grade 11-12)
	{ code: "FIS", name: "Fisika", category: "IPA", grades: [11, 12], majors: ["IPA"] },
	{ code: "KIM", name: "Kimia", category: "IPA", grades: [11, 12], majors: ["IPA"] },
	{ code: "BIO", name: "Biologi", category: "IPA", grades: [11, 12], majors: ["IPA"] },

	// IPS (grade 11-12)
	{ code: "EKO", name: "Ekonomi", category: "IPS", grades: [11, 12], majors: ["IPS"] },
	{ code: "GEO", name: "Geografi", category: "IPS", grades: [11, 12], majors: ["IPS"] },
	{ code: "SOC", name: "Sosiologi", category: "IPS", grades: [11, 12], majors: ["IPS"] },
	{ code: "SEJ", name: "Sejarah", category: "IPS", grades: [10, 11, 12], majors: ["IPS", "Bahasa"] },

	// Bahasa (grade 11-12)
	{ code: "ARAB", name: "Bahasa Arab", category: "Bahasa", grades: [11, 12], majors: ["Bahasa"] },
	{ code: "MAND", name: "Bahasa Mandarin", category: "Bahasa", grades: [11, 12], majors: ["Bahasa"] },

	// Teknologi (grade 10-11)
	{ code: "TIK", name: "Teknologi Informasi", category: "Teknologi", grades: [10, 11], majors: ["Teknologi", "IPA"] },
];

// ── KELAS (Classrooms dengan Major Assignment) ──────────────

function generateClassrooms() {
	const classrooms = [];
	let roomNumber = 101;

	for (const grade of GRADES) {
		for (const major of MAJORS) {
			const count = MAJOR_DISTRIBUTION[major];
			for (let i = 1; i <= count; i++) {
				const gradeLabel = {
					10: "X",
					11: "XI",
					12: "XII",
				}[grade];

				const majorLabel = major.substring(0, 3).toUpperCase();
				classrooms.push({
					name: `Kelas ${gradeLabel}-${majorLabel}-${i}`,
					code: `${gradeLabel}-${majorLabel}-${i}`,
					grade,
					major,
					room: String(roomNumber++),
					students: 32 + Math.floor(Math.random() * 8), // 32-40 siswa
					capacity: 40,
					status: "Active",
					description: `Kelas ${gradeLabel} Peminatan ${major}`,
				});
			}
		}
	}

	return classrooms;
}

// ── ASSIGNMENTS (Guru → Kelas/Jurusan) ──────────────────────

function generateAssignments(teachers, classrooms) {
	const assignments = [];
	const assignmentMap = new Map(); // track guru per subject

	// Group teachers by subject
	const teachersBySubject = {};
	for (const teacher of teachers) {
		if (!teachersBySubject[teacher.subject]) {
			teachersBySubject[teacher.subject] = [];
		}
		teachersBySubject[teacher.subject].push(teacher);
	}

	// Cari semua mapel yang akan diajarkan
	const subjects = [
		// Wajib semua
		{ code: "MTK", name: "Matematika", hoursPerWeek: 4 },
		{ code: "BI", name: "Bahasa Indonesia", hoursPerWeek: 4 },
		{ code: "ING", name: "Bahasa Inggris", hoursPerWeek: 4 },
		{ code: "PPKN", name: "Pendidikan Pancasila", hoursPerWeek: 2 },
		{ code: "PJOK", name: "Pendidikan Jasmani", hoursPerWeek: 2 },
		{ code: "SBD", name: "Seni Budaya", hoursPerWeek: 2 },

		// IPA (11-12)
		{ code: "FIS", name: "Fisika", hoursPerWeek: 4, grades: [11, 12], majors: ["IPA"] },
		{ code: "KIM", name: "Kimia", hoursPerWeek: 4, grades: [11, 12], majors: ["IPA"] },
		{ code: "BIO", name: "Biologi", hoursPerWeek: 4, grades: [11, 12], majors: ["IPA"] },

		// IPS (11-12)
		{ code: "EKO", name: "Ekonomi", hoursPerWeek: 3, grades: [11, 12], majors: ["IPS"] },
		{ code: "GEO", name: "Geografi", hoursPerWeek: 3, grades: [11, 12], majors: ["IPS"] },
		{ code: "SOC", name: "Sosiologi", hoursPerWeek: 3, grades: [11, 12], majors: ["IPS"] },
		{ code: "SEJ", name: "Sejarah", hoursPerWeek: 2, grades: [11, 12], majors: ["IPS"] },

		// Bahasa (11-12)
		{ code: "ARAB", name: "Bahasa Arab", hoursPerWeek: 3, grades: [11, 12], majors: ["Bahasa"] },
		{ code: "MAND", name: "Bahasa Mandarin", hoursPerWeek: 3, grades: [11, 12], majors: ["Bahasa"] },

		// Teknologi (10-11)
		{ code: "TIK", name: "Teknologi Informasi", hoursPerWeek: 2, grades: [10, 11], majors: ["Teknologi", "IPA"] },

		// Sejarah (10)
		{ code: "SEJ10", name: "Sejarah", hoursPerWeek: 2, grades: [10] },
	];

	// Generate assignments untuk setiap subject
	for (const subject of subjects) {
		const relevantTeachers = teachersBySubject[subject.name] || [];
		if (relevantTeachers.length === 0) continue;

		// Filter teachers yang sesuai grade dan major
		const suitableTeachers = relevantTeachers.filter((t) => {
			const grades = subject.grades || [10, 11, 12];
			const majors = subject.majors || MAJORS;
			return grades.some((g) => t.grades.includes(g)) && majors.some((m) => t.majors.includes(m));
		});

		if (suitableTeachers.length === 0) continue;

		// Ambil kelas yang sesuai
		const targetClasses = classrooms.filter((c) => {
			const grades = subject.grades || [10, 11, 12];
			const majors = subject.majors || MAJORS;
			return grades.includes(c.grade) && majors.includes(c.major);
		});

		if (targetClasses.length === 0) continue;

		// Distribusikan guru ke kelas secara round-robin
		let teacherIndex = 0;
		for (let i = 0; i < targetClasses.length; i++) {
			const cls = targetClasses[i];
			const teacher = suitableTeachers[teacherIndex % suitableTeachers.length];
			teacherIndex++;

			assignments.push({
				teacherName: teacher.name,
				teacherSubject: subject.name,
				subjectCode: subject.code,
				classCode: cls.code,
				hoursPerWeek: subject.hoursPerWeek,
			});
		}
	}

	return assignments;
}

// ── MAIN SEED FUNCTION ───────────────────────────────────────

async function seedDatabase() {
	try {
		console.log("\n🌱 Starting Seeding Process...\n");
		console.log("⚠️  Clearing ALL existing data from database...\n");

		// 1. Clear ALL collections (comprehensive)
		const collectionsToDelete = [
			"teachers",
			"subjects",
			"classrooms",
			"assignments",
			"schedules",
		];

		for (const collectionName of collectionsToDelete) {
			const snapshot = await db.collection(collectionName).get();
			if (!snapshot.empty) {
				const batch = db.batch();
				let count = 0;
				snapshot.docs.forEach((doc) => {
					batch.delete(doc.ref);
					count++;
				});
				await batch.commit();
				console.log(`   ✓ Cleared ${count} documents from "${collectionName}"`);
			}
		}

		console.log("\n✅ Database cleared successfully!\n");

		// 2. Generate classrooms
		const classrooms = generateClassrooms();
		console.log(`✅ Generated ${classrooms.length} classrooms dengan major assignment`);

		// 3. Seed teachers
		await seedCollection("teachers", teachers);
		console.log(`✅ Seeded ${teachers.length} teachers dengan grade + major specialization`);

		// 4. Seed subjects
		await seedCollection("subjects", subjects);
		console.log(`✅ Seeded ${subjects.length} subjects\n`);

		// 5. Seed classrooms
		await seedCollection("classrooms", classrooms);
		console.log(`✅ Seeded ${classrooms.length} classrooms\n`);

		// 6. Generate and seed assignments
		const assignments = generateAssignments(teachers, classrooms);
		console.log(`📋 Generated ${assignments.length} assignments\n`);

		// Map data untuk assignment seeding
		const teacherMap = new Map();
		const subjectMap = new Map();
		const classroomMap = new Map();

		// Get existing teachers
		const teacherSnap = await db.collection("teachers").get();
		teacherSnap.docs.forEach((doc) => {
			teacherMap.set(doc.data().name, doc.id);
		});

		// Get existing subjects
		const subjectSnap = await db.collection("subjects").get();
		subjectSnap.docs.forEach((doc) => {
			subjectMap.set(doc.data().code, doc.id);
		});

		// Get existing classrooms
		const classroomSnap = await db.collection("classrooms").get();
		classroomSnap.docs.forEach((doc) => {
			classroomMap.set(doc.data().code, doc.id);
		});

		// Seed assignments dengan resolve ID
		let batch = db.batch();
		let count = 0;

		for (const a of assignments) {
			const teacherId = teacherMap.get(a.teacherName);
			const subjectId = subjectMap.get(a.subjectCode);
			const classroomId = classroomMap.get(a.classCode);

			if (!teacherId || !subjectId || !classroomId) {
				console.warn(
					`⚠️  Skip: guru "${a.teacherName}", mapel "${a.subjectCode}", atau kelas "${a.classCode}" tidak ditemukan`
				);
				continue;
			}

			batch.set(db.collection("assignments").doc(), {
				teacherId,
				subjectId,
				classroomId,
				hoursPerWeek: a.hoursPerWeek,
				createdAt: new Date(),
			});

			count++;
			if (count % 100 === 0) {
				await batch.commit();
				batch = db.batch(); // Create new batch after commit
				console.log(`   • ${count} assignments processed...`);
			}
		}

		if (count % 100 !== 0) {
			await batch.commit();
		}

		console.log(`✅ Seeded ${count} assignments dengan resolve ID\n`);

		// Summary
		console.log("=" .repeat(60));
		console.log("📊 SEEDING SUMMARY");
		console.log("=" .repeat(60));
		console.log(`   • Teachers      : ${teachers.length}`);
		console.log(`   • Subjects      : ${subjects.length}`);
		console.log(`   • Classrooms    : ${classrooms.length}`);
		console.log(`   • Assignments   : ${count}`);
		console.log("\n📌 Distribution:");
		console.log(`   • IPA:       ${MAJOR_DISTRIBUTION.IPA} × 3 grades = ${MAJOR_DISTRIBUTION.IPA * 3} kelas`);
		console.log(`   • IPS:       ${MAJOR_DISTRIBUTION.IPS} × 3 grades = ${MAJOR_DISTRIBUTION.IPS * 3} kelas`);
		console.log(`   • Bahasa:    ${MAJOR_DISTRIBUTION.Bahasa} × 3 grades = ${MAJOR_DISTRIBUTION.Bahasa * 3} kelas`);
		console.log(`   • Teknologi: ${MAJOR_DISTRIBUTION.Teknologi} × 3 grades = ${MAJOR_DISTRIBUTION.Teknologi * 3} kelas`);
		console.log("=" .repeat(60));
		console.log("✨ Seeding complete!\n");

		process.exit(0);
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	}
}

// ── Helpers ──────────────────────────────────────────────────

async function clearCollection(collectionName) {
	const snapshot = await db.collection(collectionName).get();
	if (snapshot.empty) return;

	let batch = db.batch();
	let count = 0;
	
	for (let i = 0; i < snapshot.docs.length; i++) {
		batch.delete(snapshot.docs[i].ref);
		count++;
		if (count % 100 === 0) {
			await batch.commit();
			batch = db.batch(); // Create new batch after commit
		}
	}
	
	if (count % 100 !== 0) {
		await batch.commit();
	}
}

async function seedCollection(collectionName, data) {
	let batch = db.batch();
	let count = 0;

	for (const item of data) {
		batch.set(db.collection(collectionName).doc(), item);
		count++;
		if (count % 100 === 0) {
			await batch.commit();
			batch = db.batch(); // Create new batch after commit
		}
	}

	if (count % 100 !== 0) {
		await batch.commit();
	}
}

// ── Run ──────────────────────────────────────────────────────
seedDatabase();
