import admin from "firebase-admin";
import db from "../lib/firestore.js";

const usersCollection = db.collection("users");
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const AUTH_REST_URL = "https://identitytoolkit.googleapis.com/v1/accounts";

export async function registerUser({ email, password, name }) {
  if (!email || !password || !name) {
    const err = new Error("Email, password, dan nama harus diisi");
    err.status = 400;
    throw err;
  }

  let userRecord;
  try {
    userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });
  } catch (firebaseError) {
    const err = new Error(
      firebaseError.code === "auth/email-already-exists"
        ? "Email sudah terdaftar"
        : "Gagal membuat akun: " + firebaseError.message,
    );
    err.status = 400;
    throw err;
  }

  const userData = {
    uid: userRecord.uid,
    email,
    name,
    role: "user",
    createdAt: new Date(),
  };

  await usersCollection.doc(userRecord.uid).set(userData);

  return { uid: userRecord.uid, email, name, role: "user" };
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    const err = new Error("Email dan password harus diisi");
    err.status = 400;
    throw err;
  }

  let idToken;
  let localId;
  try {
    const res = await fetch(
      `${AUTH_REST_URL}:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      const msg =
        data.error?.message === "EMAIL_NOT_FOUND" ||
        data.error?.message === "INVALID_LOGIN_CREDENTIALS"
          ? "Email atau password salah"
          : "Login gagal: " + (data.error?.message || "Unknown error");
      const err = new Error(msg);
      err.status = 401;
      throw err;
    }
    idToken = data.idToken;
    localId = data.localId;
  } catch (e) {
    if (e.status) throw e;
    const err = new Error("Gagal menghubungi server autentikasi");
    err.status = 500;
    throw err;
  }

  const userDoc = await usersCollection.doc(localId).get();
  let profile = {};
  if (userDoc.exists) {
    profile = userDoc.data();
  }

  return {
    token: idToken,
    user: {
      uid: localId,
      email: profile.email || email,
      name: profile.name || "",
      role: profile.role || "user",
    },
  };
}

export async function getUserById(uid) {
  if (!uid) {
    const err = new Error("UID tidak valid");
    err.status = 400;
    throw err;
  }

  let userRecord;
  try {
    userRecord = await admin.auth().getUser(uid);
  } catch {
    return null;
  }

  const userDoc = await usersCollection.doc(uid).get();
  const profile = userDoc.exists ? userDoc.data() : {};

  return {
    uid: userRecord.uid,
    email: userRecord.email,
    name: profile.name || userRecord.displayName || "",
    role: profile.role || "user",
  };
}

export async function verifyToken(idToken) {
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch {
    return null;
  }
}
