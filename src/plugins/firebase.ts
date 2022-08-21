import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});
const analytics = getAnalytics(app);
export { app as firebase, analytics };

const isDev =
  location.hostname === "localhost" || location.hostname.startsWith("192.168");

export const functions = getFunctions(app);
if (isDev) {
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export const getFunctionsEndpoind = (functionName: string) => {
  if (isDev) {
    return `http://localhost:5001/libe-student-card/us-central1/${functionName}`;
  } else {
    return `https://us-central1-libe-student-card.cloudfunctions.net/${functionName}`;
  }
};
