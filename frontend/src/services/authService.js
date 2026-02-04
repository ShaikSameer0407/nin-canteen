// src/services/authService.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  getIdToken,
} from "firebase/auth";

import { auth } from "../firebase";

const googleProvider = new GoogleAuthProvider();

/* ================= EMAIL LOGIN ================= */
export const firebaseLogin = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const token = await getIdToken(userCredential.user);

  return {
    user: userCredential.user,
    token,
  };
};

/* ================= EMAIL REGISTER ================= */
export const firebaseRegister = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(userCredential.user, {
    displayName: name,
  });

  const token = await getIdToken(userCredential.user);

  return {
    user: userCredential.user,
    token,
  };
};

/* ================= GOOGLE LOGIN / REGISTER ================= */
export const googleLogin = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const token = await getIdToken(result.user);

  return {
    user: result.user,
    token,
  };
};
