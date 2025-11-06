import { NavLink, Outlet } from "react-router-dom";
import { useI18n } from "../shared/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

const navItems = [
  { path: "/", labelKey: "nav.home" },
  { path: "/trends", labelKey: "nav.trends" },
  { path: "/events", labelKey: "nav.events" },
  { path: "/phrasebook", labelKey: "nav.phrasebook" },
  { path: "/subscribe", labelKey: "nav.subscribe" }
];

export default function Layout() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <NavLink to="/" className="text-xl font-bold text-hanBlue">
            Decorée
          </NavLink>
          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            {navItems.map((item) => (
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
          <LanguageSwitcher />
        </div>
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
