import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type Auth,
  type User
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFirebaseApp } from "../services/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isAdminEmail: (email: string) => boolean;
  firebaseError: string | null;
  lastErrorCode: string | null;
  clearLastError: () => void;
  updateProfileInfo: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function parseAdminEmails(): string[] {
  const raw = import.meta.env.VITE_DECOREE_ADMIN_EMAILS;
  if (!raw) return [];
  return raw
    .split(",")
    .map((item: string) => item.trim().toLowerCase())
    .filter(Boolean);
}

function extractErrorCode(error: unknown): string {
  if (error instanceof FirebaseError) return error.code;
  if (error instanceof Error) return error.message;
  return String(error);
}

function cloneFirebaseUser(user: User): User {
  return Object.assign(Object.create(Object.getPrototypeOf(user)), user);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [lastErrorCode, setLastErrorCode] = useState<string | null>(null);
  const adminEmails = useMemo(() => parseAdminEmails(), []);

  const isAdminEmail = useCallback(
    (email: string) => {
      if (!email) return false;
      if (adminEmails.length === 0) return false;
      return adminEmails.includes(email.toLowerCase());
    },
    [adminEmails]
  );

  const captureError = (error: unknown) => {
    const code = extractErrorCode(error);
    setLastErrorCode(code);
    return code;
  };

  useEffect(() => {
    try {
      const app = getFirebaseApp();
      const authInstance = getAuth(app);
      setAuth(authInstance);

      const unsubscribe = onAuthStateChanged(authInstance, (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      const message = extractErrorCode(error);
      console.error("Firebase initialisation failed:", message);
      setFirebaseError(message);
      setLoading(false);
      return () => undefined;
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase authentication is not initialised.");
    }
    setLastErrorCode(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      captureError(error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase authentication is not initialised.");
    }
    setLastErrorCode(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      captureError(error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    if (!auth) {
      throw new Error("Firebase authentication is not initialised.");
    }
    setLastErrorCode(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      captureError(error);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) {
      throw new Error("Firebase authentication is not initialised.");
    }
    await signOut(auth);
  };

  const updateProfileInfo = async (updates: { displayName?: string; photoURL?: string }) => {
    if (!auth || !auth.currentUser) {
      throw new Error("No authenticated user to update.");
    }
    setLastErrorCode(null);
    try {
      await updateProfile(auth.currentUser, updates);
      await auth.currentUser.reload();
      if (auth.currentUser) {
        setUser(cloneFirebaseUser(auth.currentUser));
      }
    } catch (error) {
      captureError(error);
      throw error;
    }
  };

  const clearLastError = useCallback(() => setLastErrorCode(null), []);

  const value: AuthContextValue = {
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    isAdmin: !!(user && isAdminEmail(user.email ?? "")),
    isAdminEmail,
    firebaseError,
    lastErrorCode,
    clearLastError,
    updateProfileInfo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
