import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../shared/auth";
import { useI18n } from "../shared/i18n";
import { useBookmarks } from "../shared/bookmarks";
import { formatDate } from "../shared/date";
import {
  getUserEnrollments,
  type Enrollment
} from "../services/repositories/enrollmentRepository";
import { getMultipleCoursesByIds, type Course } from "../services/repositories/courseRepository";

type FormStatus = "idle" | "saving" | "success" | "error";

export default function ProfilePage() {
  const { user, logout, updateProfileInfo } = useAuth();
  const { t } = useI18n();
  const { bookmarks, removeBookmark } = useBookmarks();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<(Enrollment & { course?: Course })[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

  useEffect(() => {
    setDisplayName(user?.displayName ?? "");
  }, [user?.displayName]);

  useEffect(() => {
    if (user) {
      loadEnrollments();
    } else {
      setEnrollments([]);
      setEnrollmentsLoading(false);
    }
  }, [user]);

  const loadEnrollments = async () => {
    if (!user) return;
    
    try {
      setEnrollmentsLoading(true);
      const userEnrollments = await getUserEnrollments(user.uid);
      
      // 모든 courseId 수집
      const courseIds = userEnrollments.map((enrollment) => enrollment.courseId);
      
      // 한 번의 배치 쿼리로 모든 수업 정보 로드
      const courses = await getMultipleCoursesByIds(courseIds);
      const courseMap = new Map(courses.map((course) => [course.id, course]));
      
      // 등록 정보와 수업 정보 조인
      const enrollmentsWithCourses = userEnrollments.map((enrollment) => ({
        ...enrollment,
        course: courseMap.get(enrollment.courseId)
      }));
      
      setEnrollments(enrollmentsWithCourses);
    } catch (err) {
      console.error("Failed to load enrollments:", err);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  if (!user) {
    return (
      <section className="section-container space-y-6 text-center">
        <h1 className="text-3xl font-semibold text-[var(--ink)]">
          {t("profile.noUser.title")}
        </h1>
        <p className="text-[var(--ink-muted)]">{t("profile.noUser.subtitle")}</p>
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

  const createdAt = user.metadata?.creationTime ? formatDate(user.metadata.creationTime) : null;
  const lastLogin = user.metadata?.lastSignInTime ? formatDate(user.metadata.lastSignInTime) : null;

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
        <span className="badge-label">
          {t("profile.badge")}
        </span>
        <h1 className="text-4xl font-bold text-[var(--ink)] md:text-5xl">
          {t("profile.title")}
        </h1>
        <p className="max-w-2xl text-base text-[var(--ink-muted)] md:text-lg">
          {t("profile.subtitle")}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="studio-form space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-[var(--ink)]">
              {t("profile.section.identity")}
            </h2>
            <p className="text-sm text-[var(--ink-muted)]">{t("profile.section.identityHint")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
              {t("profile.form.displayName")}
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder={t("profile.form.displayNamePlaceholder")}
                className="rounded-2xl border border-[var(--border)] bg-[var(--paper-muted)] px-4 py-3 text-sm text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]/40"
                required
                maxLength={80}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
              {t("profile.form.email")}
              <input
                type="email"
                value={user.email ?? ""}
                readOnly
                className="rounded-2xl border border-[var(--border)] bg-[var(--paper-muted)] px-4 py-3 text-sm text-[var(--ink-muted)]"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={status === "saving"}
              className="pill-button bg-[var(--ink)] text-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "saving" ? t("profile.actions.saving") : t("profile.actions.save")}
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="pill-button border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
            >
              {t("profile.actions.logout")}
            </button>
            {status === "success" && (
              <span className="text-sm font-semibold text-emerald-600">
                {t("profile.feedback.success")}
              </span>
            )}
            {status === "error" && errorMessage && (
              <span className="text-sm font-semibold text-rose-700">{errorMessage}</span>
            )}
          </div>
        </form>

        <aside className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-8 shadow">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-[var(--ink)]">
              {t("profile.section.account")}
            </h2>
            <p className="text-sm text-[var(--ink-muted)]">{t("profile.section.accountHint")}</p>
          </div>
          <dl className="space-y-4 text-sm text-[var(--ink-muted)]">
            <div>
              <dt className="font-semibold text-[var(--ink-subtle)]">{t("profile.account.displayName")}</dt>
              <dd>{user.displayName ?? t("profile.account.fallbackName")}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--ink-subtle)]">{t("profile.account.email")}</dt>
              <dd>{user.email}</dd>
            </div>
            {createdAt && (
              <div>
                <dt className="font-semibold text-[var(--ink-subtle)]">{t("profile.account.created")}</dt>
                <dd>{createdAt}</dd>
              </div>
            )}
            {lastLogin && (
              <div>
                <dt className="font-semibold text-[var(--ink-subtle)]">{t("profile.account.lastLogin")}</dt>
                <dd>{lastLogin}</dd>
              </div>
            )}
            <div>
              <dt className="font-semibold text-[var(--ink-subtle)]">{t("profile.account.uid")}</dt>
              <dd className="break-all text-xs text-[var(--ink-subtle)]">{user.uid}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <section className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-8 shadow">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--ink)]">
            {t("profile.bookmarks.title")}
          </h2>
          <p className="text-sm text-[var(--ink-muted)]">{t("profile.bookmarks.subtitle")}</p>
        </div>
        {sortedBookmarks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper-muted)] px-4 py-6 text-sm text-[var(--ink-muted)]">
            {t("profile.bookmarks.empty")}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedBookmarks.map((bookmark) => (
              <article
                key={`${bookmark.type}-${bookmark.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--paper-muted)] p-4"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                  <span>{t(`bookmarks.type.${bookmark.type}`)}</span>
                  <span>{formatDate(bookmark.savedAt)}</span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--ink)]">{bookmark.title}</h3>
                {bookmark.summary && (
                  <p className="text-sm text-[var(--ink-muted)]">{bookmark.summary}</p>
                )}
                {bookmark.location && (
                  <p className="text-xs uppercase tracking-wide text-[var(--ink-subtle)]">
                    {bookmark.location}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 text-sm font-semibold">
                  <Link
                    to={bookmark.href}
                    className="rounded-full border border-[var(--ink)] px-4 py-2 text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
                  >
                    {t("bookmarks.actions.view")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeBookmark(bookmark.type, bookmark.id)}
                    className="rounded-full border border-[var(--border)] px-4 py-2 text-[var(--ink-muted)] transition hover:border-rose-300 hover:text-rose-600"
                  >
                    {t("bookmarks.actions.remove")}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-8 shadow">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--ink)]">
            {t("profile.enrollments.title")}
          </h2>
          <p className="text-sm text-[var(--ink-muted)]">{t("profile.enrollments.subtitle")}</p>
        </div>
        {enrollmentsLoading ? (
          <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper-muted)] px-4 py-6 text-sm text-[var(--ink-muted)]">
            {t("auth.loading")}
          </p>
        ) : enrollments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper-muted)] px-4 py-6 text-sm text-[var(--ink-muted)]">
            {t("profile.enrollments.empty")}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {enrollments.map((enrollment) => (
              <article
                key={enrollment.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--paper-muted)] p-4"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                  <span>{t(`profile.enrollments.status.${enrollment.status}`)}</span>
                  {enrollment.createdAt && (
                    <span>{formatDate(enrollment.createdAt.toDate().toISOString())}</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[var(--ink)]">
                  {enrollment.course?.title || "Unknown Course"}
                </h3>
                {enrollment.course?.description && (
                  <p className="text-sm text-[var(--ink-muted)]">{enrollment.course.description}</p>
                )}
                {enrollment.course && (
                  <div className="flex flex-wrap gap-2 text-xs text-[var(--ink-subtle)]">
                    {enrollment.course.level && (
                      <span>{t(`tutoring.enroll.course.level.${enrollment.course.level}`)}</span>
                    )}
                    {enrollment.course.duration && (
                      <span>{enrollment.course.duration}분</span>
                    )}
                    {enrollment.course.price && (
                      <span>
                        {new Intl.NumberFormat("ko-KR", {
                          style: "currency",
                          currency: "KRW"
                        }).format(enrollment.course.price)}
                      </span>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
