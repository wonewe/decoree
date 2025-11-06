import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../shared/auth";
import { useState } from "react";

const navItems = [
  { path: "/", labelKey: "nav.home" },
  { path: "/trends", labelKey: "nav.trends" },
  { path: "/events", labelKey: "nav.events" },
  { path: "/phrasebook", labelKey: "nav.phrasebook" },
  { path: "/subscribe", labelKey: "nav.subscribe" },
  { path: "/admin", labelKey: "nav.admin", requireAdmin: true }
] as const;

export default function Layout() {
  const { t } = useI18n();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setAuthError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <NavLink to="/" className="text-xl font-bold text-hanBlue">
            Decorée
          </NavLink>
          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            {navItems
              .filter((item) => {
                if ("requireAdmin" in item && item.requireAdmin) {
                  return isAdmin;
                }
                return true;
              })
              .map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `transition hover:text-hanBlue ${
                      isActive ? "text-hanBlue" : "text-slate-600"
                    }`
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-slate-500 md:inline">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-dancheongRed px-3 py-1 text-xs font-semibold text-dancheongRed transition hover:bg-dancheongRed/10"
                >
                  {t("auth.logout")}
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <NavLink
                  to="/login"
                  className="rounded-full border border-hanBlue px-4 py-2 text-sm font-semibold text-hanBlue transition hover:bg-hanBlue hover:text-white"
                >
                  {t("auth.login")}
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-hanBlue hover:text-hanBlue"
                >
                  {t("auth.signup")}
                </NavLink>
              </div>
            )}
          </div>
        </div>
        {authError && (
          <div className="bg-dancheongRed/10 py-2 text-center text-xs text-dancheongRed">
            {authError}
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Decorée. {t("footer.madeIn")}.</span>
          <div className="flex gap-4">
            <a href="https://www.instagram.com" className="hover:text-hanBlue" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://www.tiktok.com" className="hover:text-hanBlue" target="_blank" rel="noreferrer">
              TikTok
            </a>
            <a href="mailto:hello@decoree.app" className="hover:text-hanBlue">
              hello@decoree.app
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
