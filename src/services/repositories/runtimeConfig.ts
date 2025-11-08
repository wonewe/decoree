const env = import.meta.env;

const hasFirebaseConfig =
  Boolean(env.VITE_FIREBASE_API_KEY) &&
  Boolean(env.VITE_FIREBASE_AUTH_DOMAIN) &&
  Boolean(env.VITE_FIREBASE_PROJECT_ID) &&
  Boolean(env.VITE_FIREBASE_APP_ID);

const overrideStatic = env.VITE_USE_STATIC_CONTENT === "true";

export const STATIC_CONTENT_MODE = overrideStatic || !hasFirebaseConfig;

export function shouldUseStaticContent() {
  return STATIC_CONTENT_MODE;
}

export function assertFirestoreAvailable(action: string) {
  if (STATIC_CONTENT_MODE) {
    throw new Error(
      `${action} requires Firebase to be configured. Provide VITE_FIREBASE_* variables or disable static content mode.`
    );
  }
}
