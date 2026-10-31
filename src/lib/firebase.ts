import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyCByxNaQfl11qgPu9uA4FsmZovBpbXAfJA",
  authDomain: "snappost-si.firebaseapp.com",
  projectId: "snappost-si",
  storageBucket: "snappost-si.firebasestorage.app",
  messagingSenderId: "417552677296",
  appId: "1:417552677296:web:bb5268955d071c70a73e75",
  measurementId: "G-S5BZ6JJRQ5",
};

// Initialize Firebase App singleton
export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firebase Analytics safely on client side
export const initFirebaseAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};
