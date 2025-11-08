import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../shared/auth";
import { useI18n } from "../shared/i18n";
import { useBookmarks } from "../shared/bookmarks";

type FormStatus = "idle" | "saving" | "success" | "error";

export default function ProfilePage() {
  const { user, logout, updateProfileInfo } = useAuth();
  const { t } = useI18n();
  const { bookmarks, removeBookmark } = useBookmarks();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(user?.displayName ?? "");
  }, [user?.displayName]);

  if (!user) {
    return (
      <section className="section-container space-y-6 text-center">
        <h1 className="text-3xl font-semibold text-dancheongNavy">
          {t("profile.noUser.title")}
        </h1>
        <p className="text-slate-600">{t("profile.noUser.subtitle")}</p>
      </section>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!displayName.trim()) {
      setErrorMessage(t("profile.errors.displayNameRequired"));
      setStatus("error");
      return;
    }

    setStatus("saving");
    setErrorMessage(null);
    try {
      await updateProfileInfo({ displayName: displayName.trim() });
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (error) {
      console.error("Failed to update profile", error);
      setErrorMessage(t("profile.errors.generic"));
      setStatus("error");
    }
  };

  const createdAt = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : null;
  const lastLogin = user.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
    : null;

  const sortedBookmarks = useMemo(
    () =>
      [...bookmarks].sort(
        (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      ),
    [bookmarks]
  );

  return (
    <section className="section-container space-y-10">
      <header className="space-y-3">
        <span className="badge-premium bg-hanBlue/10 text-hanBlue">
          {t("profile.badge")}
        </span>
        <h1 className="text-4xl font-bold text-dancheongNavy md:text-5xl">
          {t("profile.title")}
        </h1>
        <p className="max-w-2xl text-base text-slate-600 md:text-lg">
          {t("profile.subtitle")}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-dancheongNavy">
              {t("profile.section.identity")}
            </h2>
            <p className="text-sm text-slate-500">{t("profile.section.identityHint")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
              {t("profile.form.displayName")}
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder={t("profile.form.displayNamePlaceholder")}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
                required
                maxLength={80}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
              {t("profile.form.email")}
              <input
                type="email"
                value={user.email ?? ""}
                readOnly
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={status === "saving"}
              className="rounded-full bg-hanBlue px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-dancheongNavy disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {status === "saving" ? t("profile.actions.saving") : t("profile.actions.save")}
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-hanBlue hover:text-hanBlue"
            >
              {t("profile.actions.logout")}
            </button>
            {status === "success" && (
              <span className="text-sm font-semibold text-dancheongGreen">
                {t("profile.feedback.success")}
              </span>
            )}
            {status === "error" && errorMessage && (
              <span className="text-sm font-semibold text-dancheongRed">{errorMessage}</span>
            )}
          </div>
        </form>

        <aside className="space-y-6 rounded-3xl bg-white p-8 shadow">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-dancheongNavy">
              {t("profile.section.account")}
            </h2>
            <p className="text-sm text-slate-500">{t("profile.section.accountHint")}</p>
          </div>
          <dl className="space-y-4 text-sm text-slate-600">
            <div>
              <dt className="font-semibold text-slate-500">{t("profile.account.displayName")}</dt>
              <dd>{user.displayName ?? t("profile.account.fallbackName")}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">{t("profile.account.email")}</dt>
              <dd>{user.email}</dd>
            </div>
            {createdAt && (
              <div>
                <dt className="font-semibold text-slate-500">{t("profile.account.created")}</dt>
                <dd>{createdAt}</dd>
              </div>
            )}
            {lastLogin && (
              <div>
                <dt className="font-semibold text-slate-500">{t("profile.account.lastLogin")}</dt>
                <dd>{lastLogin}</dd>
              </div>
            )}
            <div>
              <dt className="font-semibold text-slate-500">{t("profile.account.uid")}</dt>
              <dd className="break-all text-xs text-slate-500">{user.uid}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <section className="space-y-6 rounded-3xl bg-white p-8 shadow">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-dancheongNavy">
            {t("profile.bookmarks.title")}
          </h2>
          <p className="text-sm text-slate-500">{t("profile.bookmarks.subtitle")}</p>
        </div>
        {sortedBookmarks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            {t("profile.bookmarks.empty")}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedBookmarks.map((bookmark) => (
              <article
                key={`${bookmark.type}-${bookmark.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <span>{t(`bookmarks.type.${bookmark.type}`)}</span>
                  <span>{new Date(bookmark.savedAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-semibold text-dancheongNavy">{bookmark.title}</h3>
                {bookmark.summary && (
                  <p className="text-sm text-slate-600">{bookmark.summary}</p>
                )}
                {bookmark.location && (
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {bookmark.location}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 text-sm font-semibold">
                  <Link
                    to={bookmark.href}
                    className="rounded-full border border-hanBlue px-4 py-2 text-hanBlue transition hover:bg-hanBlue hover:text-white"
                  >
                    {t("bookmarks.actions.view")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeBookmark(bookmark.type, bookmark.id)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-slate-500 transition hover:border-dancheongRed hover:text-dancheongRed"
                  >
                    {t("bookmarks.actions.remove")}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
