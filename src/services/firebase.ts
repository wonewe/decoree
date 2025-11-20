import { initializeApp, type FirebaseApp } from "firebase/app";

let app: FirebaseApp | null = null;

export function getFirebaseApp() {
  if (app) return app;

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    throw new Error(
      "Firebase config missing. Define VITE_FIREBASE_* environment variables (see .env.example)."
    );
  }

  if (!config.storageBucket) {
    throw new Error(
      "Firebase Storage bucket is not configured. Please set VITE_FIREBASE_STORAGE_BUCKET in your .env file. " +
      "The bucket name is usually in the format: your-project-id.appspot.com"
    );
  }

  app = initializeApp(config);
  return app;
}

export async function getFunctions() {
  const app = getFirebaseApp();
  const { getFunctions } = await import("firebase/functions");
  return getFunctions(app, "us-central1"); // Ensure region matches your deployment
}
