import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const STORAGE_KEY = "decoree.premium.active";

type PremiumAccessContextValue = {
  hasPremiumAccess: boolean;
  unlockPremium: () => void;
  resetPremium: () => void;
};

const PremiumAccessContext = createContext<PremiumAccessContextValue | undefined>(undefined);

export function PremiumAccessProvider({ children }: { children: ReactNode }) {
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setHasPremiumAccess(stored === "true");
  }, []);

  const unlockPremium = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
    setHasPremiumAccess(true);
  }, []);

  const resetPremium = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setHasPremiumAccess(false);
  }, []);

  const value = useMemo(
    () => ({
      hasPremiumAccess,
      unlockPremium,
      resetPremium
    }),
    [hasPremiumAccess, unlockPremium, resetPremium]
  );

  return (
    <PremiumAccessContext.Provider value={value}>{children}</PremiumAccessContext.Provider>
  );
}

export function usePremiumAccess() {
  const context = useContext(PremiumAccessContext);
  if (!context) {
    throw new Error("usePremiumAccess must be used within a PremiumAccessProvider");
  }
  return context;
}
