import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../shared/auth";
import { useI18n } from "../shared/i18n";
import { fetchCourses, type Course } from "../services/repositories/courseRepository";
import {
  createEnrollment,
  getEnrollmentByUserAndCourse
} from "../services/repositories/enrollmentRepository";
import {
  getActiveMembership,
  MembershipRequiredError,
  NoRemainingSessionsError
} from "../services/repositories/membershipRepository";

export default function TutoringEnrollPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const coursesData = await fetchCourses();
      setCourses(coursesData);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError(t("tutoring.enroll.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course: Course) => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/tutoring/enroll" } } });
      return;
    }

    try {
      // 활성 멤버십 확인
      const membership = await getActiveMembership(user.uid);
      if (!membership) {
        alert(t("tutoring.enroll.membership.required")); // TODO: 멤버십 구매 페이지로 이동
        return;
      }

      if (membership.sessionsRemaining <= 0) {
        alert(t("tutoring.enroll.membership.noSessions")); // TODO: 멤버십 업그레이드 페이지로 이동
        return;
      }

      // 이미 등록된 수업인지 확인
      const existingEnrollment = await getEnrollmentByUserAndCourse(user.uid, course.id);
      if (existingEnrollment && existingEnrollment.status !== "cancelled") {
        alert(t("tutoring.enroll.enrollment.error")); // TODO: 더 나은 메시지
        return;
      }

      setSelectedCourse(course);
      setShowPaymentModal(true);
    } catch (err) {
      console.error("Failed to check enrollment:", err);
      setError(t("tutoring.enroll.enrollment.error"));
    }
  };

  const handlePayment = async () => {
    if (!user || !selectedCourse) return;

    try {
      setEnrollingCourseId(selectedCourse.id);
      
      // 멤버십 기반으로 등록 생성 (세션 차감 포함)
      await createEnrollment(user.uid, selectedCourse.id);
      
      setShowPaymentModal(false);
      setSelectedCourse(null);
      setEnrollingCourseId(null);
      
      // 성공 메시지 표시 (간단한 alert, 나중에 토스트로 변경 가능)
      alert(t("tutoring.enroll.enrollment.success"));
      
      // 프로필 페이지로 이동
      navigate("/profile");
    } catch (err) {
      console.error("Failed to enroll:", err);
      if (err instanceof MembershipRequiredError) {
        setError(t("tutoring.enroll.membership.required"));
      } else if (err instanceof NoRemainingSessionsError) {
        setError(t("tutoring.enroll.membership.noSessions"));
      } else {
        setError(t("tutoring.enroll.enrollment.error"));
      }
      setEnrollingCourseId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW"
    }).format(price);
  };

  const getLevelLabel = (level: Course["level"]) => {
    return t(`tutoring.enroll.course.level.${level}`);
  };

  if (loading) {
    return (
      <section className="section-container">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-10 text-center shadow">
          <p className="text-sm text-[var(--ink-muted)]">{t("auth.loading")}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t("tutoring.enroll.title")} | koraid</title>
        <meta name="description" content={t("tutoring.enroll.subtitle")} />
      </Helmet>

      <section className="section-container space-y-8">
        <header className="space-y-3">
          <h1 className="text-4xl font-bold text-[var(--ink)] md:text-5xl">
            {t("tutoring.enroll.title")}
          </h1>
          <p className="max-w-2xl text-base text-[var(--ink-muted)] md:text-lg">
            {t("tutoring.enroll.subtitle")}
          </p>
        </header>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            {error}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-10 text-center shadow">
            <p className="text-[var(--ink-muted)]">{t("tutoring.enroll.empty")}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.id}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="mb-3 text-xl font-semibold text-[var(--ink)]">
                  {course.title}
                </h3>
                <p className="mb-4 flex-grow text-sm text-[var(--ink-muted)]">
                  {course.description}
                </p>
                
                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ink-subtle)]">{t("tutoring.enroll.course.price")}</span>
                    <span className="font-semibold text-[var(--ink)]">{formatPrice(course.price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ink-subtle)]">{t("tutoring.enroll.course.duration")}</span>
                    <span className="font-semibold text-[var(--ink)]">{course.duration}분</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ink-subtle)]">{t("tutoring.enroll.course.level")}</span>
                    <span className="font-semibold text-[var(--ink)]">{getLevelLabel(course.level)}</span>
                  </div>
                  {course.topics && course.topics.length > 0 && (
                    <div>
                      <span className="text-[var(--ink-subtle)]">{t("tutoring.enroll.course.topics")}: </span>
                      <span className="text-[var(--ink)]">{course.topics.join(", ")}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleEnroll(course)}
                  disabled={enrollingCourseId === course.id}
                  className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {enrollingCourseId === course.id
                    ? t("tutoring.enroll.payment.processing")
                    : t("tutoring.enroll.course.enrollButton")}
                </button>
              </article>
            ))}
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-[var(--ink)]">
                {t("tutoring.enroll.payment.title")}
              </h2>
              <div className="mb-6 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--ink)]">{selectedCourse.title}</h3>
                  <p className="text-sm text-[var(--ink-muted)]">{selectedCourse.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
                  <span className="font-semibold text-[var(--ink)]">
                    {t("tutoring.enroll.payment.amount")}
                  </span>
                  <span className="text-xl font-bold text-[var(--ink)]">
                    {formatPrice(selectedCourse.price)}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedCourse(null);
                  }}
                  className="flex-1 rounded-xl border border-[var(--border)] px-4 py-3 font-semibold text-[var(--ink-muted)] transition hover:bg-[var(--paper-muted)]"
                >
                  {t("tutoring.enroll.payment.cancel")}
                </button>
                <button
                  onClick={handlePayment}
                  disabled={enrollingCourseId !== null}
                  className="primary-button flex-1 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {enrollingCourseId ? t("tutoring.enroll.payment.processing") : t("tutoring.enroll.payment.confirm")}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

