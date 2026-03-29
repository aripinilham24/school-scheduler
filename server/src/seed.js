import admin from "firebase-admin";
import dotenv from "dotenv";
import { createRequire } from "module";

dotenv.config();

// ── Init Firebase Admin ──────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

// ── Seed Data ────────────────────────────────────────────────

const teachers = [
  {
    name:     "Dr. Sarah Johnson",
    subject:  "Mathematics",
    email:    "sarah.johnson@skillset.id",
    phone:    "+62 812-3456-7890",
    status:   "Active",
    rating:   4.9,
    students: 124,
    courses:  5,
    joinDate: "Jan 2022",
  },
  {
    name:     "Prof. Michael Chen",
    subject:  "Physics",
    email:    "m.chen@skillset.id",
    phone:    "+62 813-2345-6789",
    status:   "Active",
    rating:   4.7,
    students: 98,
    courses:  4,
    joinDate: "Mar 2022",
  },
  {
    name:     "Ms. Ayu Rahmawati",
    subject:  "English Literature",
    email:    "ayu.r@skillset.id",
    phone:    "+62 814-3456-7891",
    status:   "Active",
    rating:   4.8,
    students: 210,
    courses:  7,
    joinDate: "Jun 2021",
  },
  {
    name:     "Mr. Budi Santoso",
    subject:  "Chemistry",
    email:    "budi.s@skillset.id",
    phone:    "+62 815-4567-8902",
    status:   "On Leave",
    rating:   4.5,
    students: 76,
    courses:  3,
    joinDate: "Sep 2022",
  },
  {
    name:     "Dr. Lisa Huang",
    subject:  "Biology",
    email:    "lisa.h@skillset.id",
    phone:    "+62 816-5678-9013",
    status:   "Active",
    rating:   4.6,
    students: 145,
    courses:  6,
    joinDate: "Dec 2021",
  },
  {
    name:     "Mr. Rizky Pratama",
    subject:  "Computer Science",
    email:    "rizky.p@skillset.id",
    phone:    "+62 817-6789-0124",
    status:   "Active",
    rating:   4.9,
    students: 189,
    courses:  8,
    joinDate: "Feb 2021",
  },
  {
    name:     "Ms. Dewi Lestari",
    subject:  "History",
    email:    "dewi.l@skillset.id",
    phone:    "+62 818-7890-1235",
    status:   "Inactive",
    rating:   4.3,
    students: 63,
    courses:  3,
    joinDate: "Jul 2023",
  },
  {
    name:     "Prof. Ahmad Fauzi",
    subject:  "Economics",
    email:    "ahmad.f@skillset.id",
    phone:    "+62 819-8901-2346",
    status:   "Active",
    rating:   4.7,
    students: 112,
    courses:  5,
    joinDate: "Apr 2022",
  },
];

const classrooms = [
  { name: "Kelas 10-1",        code: "10-01", description: "Matematika dasar dan lanjutan" },
  { name: "Kelas 10-2",        code: "10-02", description: "Matematika dasar dan lanjutan" },
  { name: "Kelas 10-3",        code: "10-03", description: "Matematika dasar dan lanjutan" },
  { name: "Kelas 11-1",        code: "11-01", description: "Matematika dasar dan lanjutan" },
  { name: "Kelas 11-2",        code: "11-02", description: "Matematika dasar dan lanjutan" },
  { name: "Kelas 11-3",        code: "11-03", description: "Matematika dasar dan lanjutan" },
  { name: "Kelas 12-1",        code: "12-01", description: "Matematika dasar dan lanjutan" },
  { name: "Kelas 12-2",        code: "12-02", description: "Matematika dasar dan lanjutan" },
  { name: "Kelas 12-3",        code: "12-03", description: "Matematika dasar dan lanjutan" },
];

const subjects = [
  { name: "Mathematics",        code: "MTK-01", description: "Matematika dasar dan lanjutan" },
  { name: "Physics",            code: "FIS-01", description: "Fisika dasar dan terapan" },
  { name: "English Literature", code: "ING-01", description: "Sastra dan bahasa Inggris" },
  { name: "Chemistry",          code: "KIM-01", description: "Kimia dasar dan organik" },
  { name: "Biology",            code: "BIO-01", description: "Biologi umum dan molekuler" },
  { name: "Computer Science",   code: "TIK-01", description: "Ilmu komputer dan pemrograman" },
  { name: "History",            code: "SEJ-01", description: "Sejarah Indonesia dan dunia" },
  { name: "Economics",          code: "EKO-01", description: "Ekonomi mikro dan makro" },
  { name: "Geography",          code: "GEO-01", description: "Geografi fisik dan sosial" },
  { name: "Arts",               code: "SBD-01", description: "Seni budaya dan desain" },
];

// ── Helper ───────────────────────────────────────────────────

async function clearCollection(colName) {
  const snapshot = await db.collection(colName).get();
  if (snapshot.empty) return;

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`  🗑  Koleksi "${colName}" dikosongkan (${snapshot.size} dokumen)`);
}

async function seedCollection(colName, data) {
  const batch = db.batch();
  data.forEach((item) => {
    const ref = db.collection(colName).doc();
    batch.set(ref, {
      ...item,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();
  console.log(`  ✅ "${colName}" — ${data.length} dokumen berhasil ditambahkan`);
}

// ── Main ─────────────────────────────────────────────────────

async function seed() {
  console.log("\n🌱 Memulai seed data ke Firestore...\n");

  try {
    // Kosongkan dulu supaya tidak duplikat
    console.log("📦 Mengosongkan koleksi lama...");
    await clearCollection("teachers");
    await clearCollection("classrooms");
    await clearCollection("subjects");

    // Isi data baru
    console.log("\n📝 Memasukkan data baru...");
    await seedCollection("teachers",   teachers);
    await seedCollection("classrooms", classrooms);
    await seedCollection("subjects",   subjects);

    console.log("\n🎉 Seed selesai! Semua data berhasil dimasukkan ke Firestore.\n");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Seed gagal:", err.message);
    process.exit(1);
  }
}

seed();