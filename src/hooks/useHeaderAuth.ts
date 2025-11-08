import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../shared/auth";

export function useHeaderAuth() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    setError(null);
    setIsProcessing(true);
    try {
      await logout();
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  }, [logout, navigate]);

  const dismissError = useCallback(() => setError(null), []);

  return {
    user,
    isAdmin,
    handleLogout,
    isProcessing,
    error,
    dismissError
  };
}
