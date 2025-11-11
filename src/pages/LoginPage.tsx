import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/auth";
import { useI18n } from "../shared/i18n";

const GOOGLE_ICON =
  "M18.64 9.204c0-.638-.057-1.252-.164-1.84H9.5v3.48h5.12a4.377 4.377 0 0 1-1.9 2.87v2.385h3.072c1.8-1.657 2.848-4.1 2.848-6.895z";
const GOOGLE_PATHS = {
  blue: "M9.5 18.5c2.565 0 4.72-.848 6.293-2.285l-3.072-2.385c-.853.57-1.942.908-3.221.908-2.477 0-4.574-1.672-5.324-3.92H1.97v2.461A9 9 0 0 0 9.5 18.5z",
  yellow:
    "M4.176 10.818A5.417 5.417 0 0 1 3.9 9.5c0-.458.08-.902.216-1.318V5.72H1.97A8.998 8.998 0 0 0 .5 9.5c0 1.423.338 2.771.943 3.966l2.733-2.648z",
  green:
    "M9.5 4.082c1.397 0 2.65.482 3.636 1.43l2.727-2.727C14.215 1.533 12.06.5 9.5.5A8.998 8.998 0 0 0 .5 5.72l2.633 2.462C3.926 5.753 6.023 4.082 9.5 4.082z"
};

function useTranslatedError(error: string | null) {
  const { t } = useI18n();
  return useMemo(() => {
    if (!error) return null;
    if (error.includes("auth/unauthorised-email")) return t("auth.error.unauthorisedEmail");
    if (error.includes("auth/invalid-credential")) return t("auth.error.invalidCredential");
    if (error.includes("auth/user-not-found")) return t("auth.error.invalidCredential");
    if (error.includes("auth/wrong-password")) return t("auth.error.invalidCredential");
    return error;
  }, [error, t]);
}

export default function LoginPage() {
  const {
    login,
    loginWithGoogle,
    firebaseError,
    lastErrorCode,
    clearLastError
  } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    clearLastError();
  }, [clearLastError]);

  const translatedAuthError = useTranslatedError(formError ?? lastErrorCode);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFormError(null);
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setFormError(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <section className="section-container">
      <div className="mx-auto max-w-lg space-y-6 rounded-3xl bg-white p-8 shadow-xl">
        <header className="space-y-2 text-center">
          <span className="badge-label">{t("auth.badge")}</span>
          <h1 className="text-3xl font-bold text-dancheongNavy">{t("auth.title")}</h1>
          <p className="text-sm text-slate-500">{t("auth.subtitle")}</p>
          {firebaseError && (
            <p className="rounded-2xl border border-dancheongRed/30 bg-dancheongRed/10 px-4 py-2 text-sm text-dancheongRed">
              {firebaseError}
            </p>
          )}
        </header>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 font-semibold text-slate-600 transition hover:border-hanBlue hover:text-hanBlue disabled:cursor-not-allowed disabled:opacity-60"
            disabled={googleLoading || loading}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 19 19" aria-hidden="true">
              <path fill="#4285F4" d={GOOGLE_ICON} />
              <path fill="#34A853" d={GOOGLE_PATHS.green} />
              <path fill="#FBBC04" d={GOOGLE_PATHS.yellow} />
              <path fill="#EA4335" d={GOOGLE_PATHS.blue} />
            </svg>
            {googleLoading ? t("auth.googleLoading") : t("auth.loginWithGoogle")}
          </button>

          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            {t("auth.or")}
            <span className="h-px flex-1 bg-slate-200" />
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600" htmlFor="email">
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-600" htmlFor="password">
              {t("auth.password")}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="primary-button w-full disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={loading || googleLoading}
          >
            {loading ? t("auth.loggingIn") : t("auth.submit")}
          </button>
        </form>

        {translatedAuthError && (
          <p className="rounded-2xl bg-dancheongRed/10 px-4 py-2 text-sm text-dancheongRed">
            {translatedAuthError}
          </p>
        )}

        <div className="text-center text-sm text-slate-600">
          {t("auth.noAccount")}{" "}
          <Link to="/signup" className="font-semibold text-hanBlue hover:underline">
            {t("auth.goToSignup")}
          </Link>
        </div>

        <footer className="rounded-2xl bg-slate-100 p-4 text-xs text-slate-500">
          <p>{t("auth.footer.hint")}</p>
          <p className="mt-1">{t("auth.footer.support")}</p>
        </footer>
      </div>
    </section>
  );
}
