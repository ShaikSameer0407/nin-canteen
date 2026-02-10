// src/services/authService.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  getIdToken,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase";

const googleProvider = new GoogleAuthProvider();

/* ================= EMAIL LOGIN ================= */
export const firebaseLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const token = await getIdToken(userCredential.user, true);

    return {
      user: userCredential.user,
      token,
    };
  } catch (error) {
    console.error("Firebase login error:", error);
    throw new Error(error?.message || "Login failed");
  }
};

/* ================= EMAIL REGISTER ================= */
export const firebaseRegister = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }

    const token = await getIdToken(userCredential.user, true);

    return {
      user: userCredential.user,
      token,
    };
  } catch (error) {
    console.error("Firebase register error:", error);
    throw new Error(error?.message || "Registration failed");
  }
};

/* ================= GOOGLE LOGIN / REGISTER ================= */
export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await getIdToken(result.user, true);

    return {
      user: result.user,
      token,
    };
  } catch (error) {
    console.error("Google login error:", error);
    throw new Error(error?.message || "Google login failed");
  }
};

/* ================= FORGOT PASSWORD ================= */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Reset password error:", error);
    throw new Error(error?.message || "Password reset failed");
  }
};
