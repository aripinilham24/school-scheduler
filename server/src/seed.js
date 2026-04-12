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

// ── Data Guru ────────────────────────────────────────────────
const teachers = [
	{
		name: "Drs. Bambang Setiawan",
		subject: "Matematika",
		email: "bambang.setiawan@sman1.id",
		phone: "+62 812-3456-7890",
		status: "Active",
		rating: 4.8,
		students: 156,
		courses: 6,
		joinDate: "Jan 2015",
		level: "Senior High School",
	},
	{
		name: "Ir. Suryanto, M.T.",
		subject: "Fisika",
		email: "suryanto@sman1.id",
		phone: "+62 813-2345-6789",
		status: "Active",
		rating: 4.7,
		students: 124,
		courses: 5,
		joinDate: "Mar 2016",
		level: "Senior High School",
	},
	{
		name: "Siti Nurhaliza, S.Pd.",
		subject: "Bahasa Indonesia",
		email: "siti.nurhaliza@sman1.id",
		phone: "+62 814-3456-7891",
		status: "Active",
		rating: 4.9,
		students: 187,
		courses: 7,
		joinDate: "Jun 2014",
		level: "Senior High School",
	},
	{
		name: "Drs. Ahmad Wijaya",
		subject: "Kimia",
		email: "ahmad.wijaya@sman1.id",
		phone: "+62 815-4567-8902",
		status: "Active",
		rating: 4.6,
		students: 98,
		courses: 4,
		joinDate: "Sep 2017",
		level: "Senior High School",
	},
	{
		name: "Dr. Rina Dewi Kusuma",
		subject: "Biologi",
		email: "rina.dewi@sman1.id",
		phone: "+62 816-5678-9013",
		status: "Active",
		rating: 4.8,
		students: 142,
		courses: 6,
		joinDate: "Dec 2015",
		level: "Senior High School",
	},
	{
		name: "Ing. Hendra Gunawan, M.Cs.",
		subject: "Teknologi Informasi",
		email: "hendra.gunawan@sman1.id",
		phone: "+62 817-6789-0124",
		status: "Active",
		rating: 4.9,
		students: 165,
		courses: 8,
		joinDate: "Feb 2016",
		level: "Senior High School",
	},
	{
		name: "Drs. Eka Prasetya",
		subject: "Sejarah",
		email: "eka.prasetya@sman1.id",
		phone: "+62 818-7890-1235",
		status: "Active",
		rating: 4.5,
		students: 112,
		courses: 4,
		joinDate: "Jul 2017",
		level: "Senior High School",
	},
	{
		name: "Prof. Drs. Sutrisno, M.A.",
		subject: "Ekonomi",
		email: "sutrisno@sman1.id",
		phone: "+62 819-8901-2346",
		status: "Active",
		rating: 4.7,
		students: 135,
		courses: 5,
		joinDate: "Apr 2014",
		level: "Senior High School",
	},
	{
		name: "Drs. Haryanto, S.Sn.",
		subject: "Seni Budaya",
		email: "haryanto@sman1.id",
		phone: "+62 820-9012-3457",
		status: "Active",
		rating: 4.6,
		students: 98,
		courses: 3,
		joinDate: "Jan 2018",
		level: "Senior High School",
	},
	{
		name: "Drs. Bambang Irawan, M.Pd.",
		subject: "Pendidikan Jasmani",
		email: "bambang.irawan@sman1.id",
		phone: "+62 821-0123-4568",
		status: "On Leave",
		rating: 4.4,
		students: 156,
		courses: 6,
		joinDate: "Aug 2016",
		level: "Senior High School",
	},
	{
		name: "Sri Wahyuningsih, S.Pd.",
		subject: "Bahasa Inggris",
		email: "sri.wahyuningsih@sman1.id",
		phone: "+62 822-1234-5679",
		status: "Active",
		rating: 4.8,
		students: 178,
		courses: 7,
		joinDate: "Oct 2015",
		level: "Senior High School",
	},
	{
		name: "Drs. Warsito",
		subject: "Geografi",
		email: "warsito@sman1.id",
		phone: "+62 823-2345-6780",
		status: "Active",
		rating: 4.5,
		students: 87,
		courses: 3,
		joinDate: "May 2019",
		level: "Senior High School",
	},
	{
		name: "Drs. Agus Santoso",
		subject: "Pendidikan Pancasila",
		email: "agus.santoso@sman1.id",
		phone: "+62 824-3456-7891",
		status: "Active",
		rating: 4.6,
		students: 165,
		courses: 6,
		joinDate: "Mar 2015",
		level: "Senior High School",
	},
	{
		name: "Dra. Endang Sulistyowati",
		subject: "Sosiologi",
		email: "endang.s@sman1.id",
		phone: "+62 825-4567-8902",
		status: "Active",
		rating: 4.5,
		students: 98,
		courses: 4,
		joinDate: "Jun 2016",
		level: "Senior High School",
	},
];

// ── Data Kelas ───────────────────────────────────────────────
// PENTING: level sebagai integer, name konsisten
const classrooms = [
	// Kelas 10
	{
		name: "Kelas 10-1",
		code: "X-1",
		grade: 10,
		room: "101",
		students: 36,
		capacity: 40,
		status: "Active",
		description: "Kelas 10 Reguler",
	},
	{
		name: "Kelas 10-2",
		code: "X-2",
		grade: 10,
		room: "102",
		students: 35,
		capacity: 40,
		status: "Active",
		description: "Kelas 10 Reguler",
	},
	{
		name: "Kelas 10-3",
		code: "X-3",
		grade: 10,
		room: "103",
		students: 37,
		capacity: 40,
		status: "Active",
		description: "Kelas 10 Reguler",
	},
	{
		name: "Kelas 10-4",
		code: "X-4",
		grade: 10,
		room: "104",
		students: 36,
		capacity: 40,
		status: "Active",
		description: "Kelas 10 Reguler",
	},
	{
		name: "Kelas 10-5",
		code: "X-5",
		grade: 10,
		room: "105",
		students: 34,
		capacity: 40,
		status: "Active",
		description: "Kelas 10 Reguler",
	},
	{
		name: "Kelas 10-6",
		code: "X-6",
		grade: 10,
		room: "106",
		students: 36,
		capacity: 40,
		status: "Active",
		description: "Kelas 10 Reguler",
	},
	{
		name: "Kelas 10-7",
		code: "X-7",
		grade: 10,
		room: "107",
		students: 35,
		capacity: 40,
		status: "Active",
		description: "Kelas 10 Reguler",
	},
	{
		name: "Kelas 10-8",
		code: "X-8",
		grade: 10,
		room: "108",
		students: 37,
		capacity: 40,
		status: "Active",
		description: "Kelas 10 Reguler",
	},
	{
		name: "Kelas 10-9",
		code: "X-9",
		grade: 10,
		room: "109",
		students: 36,
		capacity: 40,
		status: "Active",
		description: "Kelas 10 Reguler",
	},
	// Kelas 11
	{
		name: "Kelas 11-1",
		code: "XI-1",
		grade: 11,
		room: "201",
		students: 35,
		capacity: 40,
		status: "Active",
		description: "Kelas 11 IPA",
	},
	{
		name: "Kelas 11-2",
		code: "XI-2",
		grade: 11,
		room: "202",
		students: 36,
		capacity: 40,
		status: "Active",
		description: "Kelas 11 IPA",
	},
	{
		name: "Kelas 11-3",
		code: "XI-3",
		grade: 11,
		room: "203",
		students: 34,
		capacity: 40,
		status: "Active",
		description: "Kelas 11 IPA",
	},
	{
		name: "Kelas 11-4",
		code: "XI-4",
		grade: 11,
		room: "204",
		students: 37,
		capacity: 40,
		status: "Active",
		description: "Kelas 11 IPS",
	},
	{
		name: "Kelas 11-5",
		code: "XI-5",
		grade: 11,
		room: "205",
		students: 36,
		capacity: 40,
		status: "Active",
		description: "Kelas 11 IPS",
	},
	{
		name: "Kelas 11-6",
		code: "XI-6",
		grade: 11,
		room: "206",
		students: 35,
		capacity: 40,
		status: "Active",
		description: "Kelas 11 IPS",
	},
	{
		name: "Kelas 11-7",
		code: "XI-7",
		grade: 11,
		room: "207",
		students: 32,
		capacity: 40,
		status: "Active",
		description: "Kelas 11 Bahasa",
	},
	{
		name: "Kelas 11-8",
		code: "XI-8",
		grade: 11,
		room: "208",
		students: 31,
		capacity: 40,
		status: "Active",
		description: "Kelas 11 Bahasa",
	},
	{
		name: "Kelas 11-9",
		code: "XI-9",
		grade: 11,
		room: "209",
		students: 36,
		capacity: 40,
		status: "Active",
		description: "Kelas 11 Reguler",
	},
	// Kelas 12
	{
		name: "Kelas 12-1",
		code: "XII-1",
		grade: 12,
		room: "301",
		students: 34,
		capacity: 40,
		status: "Active",
		description: "Kelas 12 IPA",
	},
	{
		name: "Kelas 12-2",
		code: "XII-2",
		grade: 12,
		room: "302",
		students: 35,
		capacity: 40,
		status: "Active",
		description: "Kelas 12 IPA",
	},
	{
		name: "Kelas 12-3",
		code: "XII-3",
		grade: 12,
		room: "303",
		students: 36,
		capacity: 40,
		status: "Active",
		description: "Kelas 12 IPA",
	},
	{
		name: "Kelas 12-4",
		code: "XII-4",
		grade: 12,
		room: "304",
		students: 35,
		capacity: 40,
		status: "Active",
		description: "Kelas 12 IPS",
	},
	{
		name: "Kelas 12-5",
		code: "XII-5",
		grade: 12,
		room: "305",
		students: 37,
		capacity: 40,
		status: "Active",
		description: "Kelas 12 IPS",
	},
	{
		name: "Kelas 12-6",
		code: "XII-6",
		grade: 12,
		room: "306",
		students: 33,
		capacity: 40,
		status: "Active",
		description: "Kelas 12 IPS",
	},
	{
		name: "Kelas 12-7",
		code: "XII-7",
		grade: 12,
		room: "307",
		students: 30,
		capacity: 40,
		status: "Active",
		description: "Kelas 12 Bahasa",
	},
	{
		name: "Kelas 12-8",
		code: "XII-8",
		grade: 12,
		room: "308",
		students: 29,
		capacity: 40,
		status: "Active",
		description: "Kelas 12 Bahasa",
	},
	{
		name: "Kelas 12-9",
		code: "XII-9",
		grade: 12,
		room: "309",
		students: 36,
		capacity: 40,
		status: "Active",
		description: "Kelas 12 Reguler",
	},
];

// ── Data Mata Pelajaran ──────────────────────────────────────
// PENTING: koleksi bernama "subjects" (bukan "mapel")
const subjects = [
	{
		name: "Pendidikan Agama Islam",
		code: "PAI",
		hoursPerWeek: 2,
		category: "Wajib",
		grades: [10, 11, 12],
		double: false,
	},
	{
		name: "Pendidikan Pancasila",
		code: "PPKN",
		hoursPerWeek: 2,
		category: "Wajib",
		grades: [10, 11, 12],
		double: false,
	},
	{
		name: "Bahasa Indonesia",
		code: "BI",
		hoursPerWeek: 4,
		category: "Wajib",
		grades: [10, 11, 12],
		double: false,
	},
	{
		name: "Bahasa Inggris",
		code: "ING",
		hoursPerWeek: 4,
		category: "Wajib",
		grades: [10, 11, 12],
		double: false,
	},
	{
		name: "Matematika",
		code: "MTK",
		hoursPerWeek: 4,
		category: "Wajib",
		grades: [10, 11, 12],
		double: false,
	},
	{
		name: "Sejarah",
		code: "SEJ",
		hoursPerWeek: 2,
		category: "Wajib",
		grades: [10, 11, 12],
		double: false,
	},
	{
		name: "Pendidikan Jasmani",
		code: "PJOK",
		hoursPerWeek: 2,
		category: "Pengembangan",
		grades: [10, 11, 12],
		double: true,
	},
	{
		name: "Seni Budaya",
		code: "SBD",
		hoursPerWeek: 2,
		category: "Peminatan",
		grades: [10, 11, 12],
		double: false,
	},
	{
		name: "Teknologi Informasi",
		code: "TIK",
		hoursPerWeek: 2,
		category: "Peminatan",
		grades: [10, 11, 12],
		double: true,
	},
	{
		name: "Fisika",
		code: "FIS",
		hoursPerWeek: 4,
		category: "IPA",
		grades: [11, 12],
		double: false,
	},
	{
		name: "Kimia",
		code: "KIM",
		hoursPerWeek: 4,
		category: "IPA",
		grades: [11, 12],
		double: false,
	},
	{
		name: "Biologi",
		code: "BIO",
		hoursPerWeek: 4,
		category: "IPA",
		grades: [11, 12],
		double: false,
	},
	{
		name: "Ekonomi",
		code: "EKO",
		hoursPerWeek: 3,
		category: "IPS",
		grades: [11, 12],
		double: false,
	},
	{
		name: "Geografi",
		code: "GEO",
		hoursPerWeek: 3,
		category: "IPS",
		grades: [11, 12],
		double: false,
	},
	{
		name: "Sosiologi",
		code: "SOC",
		hoursPerWeek: 3,
		category: "IPS",
		grades: [11, 12],
		double: false,
	},
];

// ── Helpers ──────────────────────────────────────────────────

async function clearCollection(colName) {
	const snapshot = await db.collection(colName).get();
	if (snapshot.empty) return;
	const batch = db.batch();
	snapshot.docs.forEach((doc) => batch.delete(doc.ref));
	await batch.commit();
	console.log(`  🗑  "${colName}" dikosongkan (${snapshot.size} dokumen)`);
}

async function seedCollection(colName, data) {
	// Firestore batch max 500, pecah jika perlu
	const CHUNK = 400;
	for (let i = 0; i < data.length; i += CHUNK) {
		const batch = db.batch();
		data.slice(i, i + CHUNK).forEach((item) => {
			batch.set(db.collection(colName).doc(), {
				...item,
				createdAt: admin.firestore.FieldValue.serverTimestamp(),
			});
		});
		await batch.commit();
	}
	console.log(`  ✅ "${colName}" — ${data.length} dokumen ditambahkan`);
}

// ── Seed Assignments ─────────────────────────────────────────
// Buat relasi: guru → mapel → kelas (ini yang dibutuhkan generate jadwal)
async function seedAssignments(teacherDocs, subjectDocs, classroomDocs) {
	console.log("\n  🔗 Membuat assignment guru → mapel → kelas...");

	// Map nama → doc id
	const teacherMap = new Map(teacherDocs.map((t) => [t.subject, t.id]));
	const subjectMap = new Map(subjectDocs.map((s) => [s.code, s.id]));
	const classMap = new Map(
		classroomDocs.map((c) => [c.code, { id: c.id, grade: c.grade }]),
	);

	// Definisi: guru siapa mengajar mapel apa di kelas mana
	// Format: { teacherSubject, subjectCode, classCodes[], hoursPerWeek }
	const assignments = [
		// Matematika — Bambang Setiawan → semua kelas 10-12
		{
			teacherSubject: "Matematika",
			subjectCode: "MTK",
			classCodes: [
				"X-1",
				"X-2",
				"X-3",
				"X-4",
				"X-5",
				"X-6",
				"X-7",
				"X-8",
				"X-9",
			],
			hoursPerWeek: 4,
		},
		{
			teacherSubject: "Matematika",
			subjectCode: "MTK",
			classCodes: [
				"XI-1",
				"XI-2",
				"XI-3",
				"XI-4",
				"XI-5",
				"XI-6",
				"XI-7",
				"XI-8",
				"XI-9",
			],
			hoursPerWeek: 4,
		},
		{
			teacherSubject: "Matematika",
			subjectCode: "MTK",
			classCodes: [
				"XII-1",
				"XII-2",
				"XII-3",
				"XII-4",
				"XII-5",
				"XII-6",
				"XII-7",
				"XII-8",
				"XII-9",
			],
			hoursPerWeek: 4,
		},

		// Fisika — Suryanto → kelas 11 & 12 IPA
		{
			teacherSubject: "Fisika",
			subjectCode: "FIS",
			classCodes: ["XI-1", "XI-2", "XI-3", "XII-1", "XII-2", "XII-3"],
			hoursPerWeek: 4,
		},

		// Bahasa Indonesia — Siti Nurhaliza → semua kelas
		{
			teacherSubject: "Bahasa Indonesia",
			subjectCode: "BI",
			classCodes: [
				"X-1",
				"X-2",
				"X-3",
				"X-4",
				"X-5",
				"XI-1",
				"XI-2",
				"XI-4",
				"XII-1",
				"XII-4",
				"XII-7",
			],
			hoursPerWeek: 4,
		},

		// Kimia — Ahmad Wijaya → kelas 11 & 12 IPA
		{
			teacherSubject: "Kimia",
			subjectCode: "KIM",
			classCodes: ["XI-1", "XI-2", "XI-3", "XII-1", "XII-2", "XII-3"],
			hoursPerWeek: 4,
		},

		// Biologi — Rina Dewi → kelas 11 & 12 IPA
		{
			teacherSubject: "Biologi",
			subjectCode: "BIO",
			classCodes: ["XI-1", "XI-2", "XI-3", "XII-1", "XII-2", "XII-3"],
			hoursPerWeek: 4,
		},

		// TIK — Hendra Gunawan → kelas 10 & 11
		{
			teacherSubject: "Teknologi Informasi",
			subjectCode: "TIK",
			classCodes: ["X-1", "X-2", "X-3", "X-4", "X-5", "XI-1", "XI-4", "XI-7"],
			hoursPerWeek: 2,
		},

		// Sejarah — Eka Prasetya → kelas 10 & 11
		{
			teacherSubject: "Sejarah",
			subjectCode: "SEJ",
			classCodes: ["X-1", "X-2", "X-3", "X-4", "X-5", "XI-1", "XI-2", "XI-3"],
			hoursPerWeek: 2,
		},

		// Ekonomi — Sutrisno → kelas 11 & 12 IPS
		{
			teacherSubject: "Ekonomi",
			subjectCode: "EKO",
			classCodes: ["XI-4", "XI-5", "XI-6", "XII-4", "XII-5", "XII-6"],
			hoursPerWeek: 3,
		},

		// Seni Budaya — Haryanto → kelas 10
		{
			teacherSubject: "Seni Budaya",
			subjectCode: "SBD",
			classCodes: [
				"X-1",
				"X-2",
				"X-3",
				"X-4",
				"X-5",
				"X-6",
				"X-7",
				"X-8",
				"X-9",
			],
			hoursPerWeek: 2,
		},

		// PJOK — Bambang Irawan → kelas 10 & 11
		{
			teacherSubject: "Pendidikan Jasmani",
			subjectCode: "PJOK",
			classCodes: ["X-1", "X-2", "X-3", "XI-1", "XI-4", "XI-7"],
			hoursPerWeek: 2,
		},

		// Bahasa Inggris — Sri Wahyuningsih → kelas 10 & 11
		{
			teacherSubject: "Bahasa Inggris",
			subjectCode: "ING",
			classCodes: [
				"X-1",
				"X-2",
				"X-3",
				"X-4",
				"X-5",
				"XI-1",
				"XI-2",
				"XI-7",
				"XII-7",
				"XII-8",
			],
			hoursPerWeek: 4,
		},

		// Geografi — Warsito → kelas 11 & 12 IPS
		{
			teacherSubject: "Geografi",
			subjectCode: "GEO",
			classCodes: ["XI-4", "XI-5", "XI-6", "XII-4", "XII-5", "XII-6"],
			hoursPerWeek: 3,
		},

		// Pendidikan Pancasila — Agus Santoso → semua kelas 10
		{
			teacherSubject: "Pendidikan Pancasila",
			subjectCode: "PPKN",
			classCodes: [
				"X-1",
				"X-2",
				"X-3",
				"X-4",
				"X-5",
				"X-6",
				"X-7",
				"X-8",
				"X-9",
			],
			hoursPerWeek: 2,
		},

		// Sosiologi — Endang → kelas 11 & 12 IPS
		{
			teacherSubject: "Sosiologi",
			subjectCode: "SOC",
			classCodes: ["XI-4", "XI-5", "XI-6", "XII-4", "XII-5", "XII-6"],
			hoursPerWeek: 3,
		},
	];

	const batch = db.batch();
	let count = 0;

	for (const a of assignments) {
		const teacherId = teacherMap.get(a.teacherSubject);
		const subjectId = subjectMap.get(a.subjectCode);

		if (!teacherId || !subjectId) {
			console.warn(
				`    ⚠️  Skip: guru "${a.teacherSubject}" atau mapel "${a.subjectCode}" tidak ditemukan`,
			);
			continue;
		}

		// Resolve classIds dari classCodes
		const classIds = a.classCodes
			.map((code) => classMap.get(code)?.id)
			.filter(Boolean);

		if (classIds.length === 0) continue;

		const ref = db.collection("assignments").doc();
		batch.set(ref, {
			teacherId,
			subjectId,
			classIds,
			hoursPerWeek: a.hoursPerWeek,
			createdAt: admin.firestore.FieldValue.serverTimestamp(),
		});
		count++;
	}

	await batch.commit();
	console.log(`  ✅ "assignments" — ${count} assignment dibuat`);
}

// ── Main ─────────────────────────────────────────────────────

async function seed() {
	console.log("\n🌱 Memulai seed data ke Firestore...\n");

	try {
		// 1. Kosongkan semua koleksi
		console.log("📦 Mengosongkan koleksi lama...");
		await clearCollection("teachers");
		await clearCollection("classrooms");
		await clearCollection("subjects"); // konsisten: bukan "mapel"
		await clearCollection("assignments");

		// 2. Seed data utama
		console.log("\n📝 Memasukkan data...");
		await seedCollection("teachers", teachers);
		await seedCollection("classrooms", classrooms);
		await seedCollection("subjects", subjects);

		// 3. Ambil dokumen yang baru diseed untuk dapat ID-nya
		const [teacherDocs, subjectDocs, classroomDocs] = await Promise.all([
			db
				.collection("teachers")
				.get()
				.then((s) => s.docs.map((d) => ({ id: d.id, ...d.data() }))),
			db
				.collection("subjects")
				.get()
				.then((s) => s.docs.map((d) => ({ id: d.id, ...d.data() }))),
			db
				.collection("classrooms")
				.get()
				.then((s) => s.docs.map((d) => ({ id: d.id, ...d.data() }))),
		]);

		// 4. Seed assignments (relasi guru → mapel → kelas)
		await seedAssignments(teacherDocs, subjectDocs, classroomDocs);

		// 5. Ringkasan
		console.log("\n🎉 Seed selesai!\n");
		console.log("📊 Ringkasan:");
		console.log(`   • Guru      : ${teachers.length} orang`);
		console.log(
			`   • Kelas     : ${classrooms.length} ruang (${classrooms.filter((c) => c.grade === 10).length} kelas 10, ${classrooms.filter((c) => c.grade === 11).length} kelas 11, ${classrooms.filter((c) => c.grade === 12).length} kelas 12)`,
		);
		console.log(`   • Mapel     : ${subjects.length} mata pelajaran`);
		console.log(
			`   • Siswa     : ${classrooms.reduce((s, c) => s + c.students, 0)} total\n`,
		);

		process.exit(0);
	} catch (err) {
		console.error("\n❌ Seed gagal:", err.message);
		console.error(err.stack);
		process.exit(1);
	}
}

seed();