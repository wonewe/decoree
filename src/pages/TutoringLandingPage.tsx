import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { addWaitlistEntry } from "../services/repositories/waitlistRepository";
import { useI18n } from "../shared/i18n";
import { trackEvent } from "../shared/analytics";

export default function TutoringLandingPage() {
  const { language, t } = useI18n();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    koreanLevel: "beginner" as "beginner" | "intermediate" | "advanced",
    interestingTopic: "",
    nativeLanguage: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await addWaitlistEntry({
        name: formData.name,
        email: formData.email,
        koreanLevel: formData.koreanLevel,
        interestingTopic: formData.interestingTopic,
        nativeLanguage: formData.nativeLanguage
      });
      
      // Analytics: 전환율 추적
      trackEvent("tutoring_waitlist_submit", {
        korean_level: formData.koreanLevel,
        interesting_topic: formData.interestingTopic
      });
      
      setSuccess(true);
      // Reset form
      setFormData({
        name: "",
        email: "",
        koreanLevel: "beginner",
        interestingTopic: "",
        nativeLanguage: ""
      });
    } catch (err) {
      console.error("Failed to submit waitlist:", err);
      setError(t("tutoring.form.error"));
      
      // Analytics: 에러 추적
      trackEvent("tutoring_waitlist_error", {
        error: err instanceof Error ? err.message : "unknown"
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    trackEvent("tutoring_cta_click", {
      source: "hero"
    });
    const formElement = document.getElementById("waitlist-form");
    formElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>{t("tutoring.hero.title")} | koraid</title>
        <meta name="description" content={t("tutoring.hero.subtitle")} />
      </Helmet>

      <article className="bg-[var(--paper)]">
        {/* Section 1: Hero */}
        <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden">
          {/* Fallback 이미지 (비디오 로드 실패 시) */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/main1.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            aria-hidden="true"
          />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 z-[1] h-full w-full object-cover"
          >
            <source src="/hero-seoul-timelapse.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/80 via-black/70 to-black/75" />
          <div className="absolute inset-x-0 bottom-0 z-[2] h-64 bg-gradient-to-b from-transparent via-transparent to-[var(--paper)]" />
          <div className="relative z-[3] flex h-full items-center">
            <div className="section-container w-full text-white">
              <div className="max-w-3xl space-y-6">
                <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
                  {t("tutoring.hero.title")}
                </h1>
                <p className="text-lg leading-relaxed md:text-xl text-white/90">
                  {t("tutoring.hero.subtitle")}
                </p>
                <button
                  onClick={scrollToForm}
                  className="primary-button bg-white text-[var(--ink)] hover:bg-white/90"
                >
                  {t("tutoring.hero.cta")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Meet Our Tutors */}
        <section className="section-container py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[var(--ink)] md:text-4xl">
              {t("tutoring.tutors.title")}
            </h2>
            <p className="text-lg text-[var(--ink-muted)]">
              {t("tutoring.tutors.subtitle")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-[var(--paper)] p-8 shadow-sm">
              <div className="mb-4 aspect-square w-32 overflow-hidden rounded-full bg-[var(--paper-muted)] mx-auto">
                <img
                  src={t("tutoring.tutors.tutor1.image")}
                  alt={t("tutoring.tutors.tutor1.name")}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // 이미지 로드 실패 시 placeholder 표시
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<div class="flex h-full w-full items-center justify-center text-4xl">👤</div>';
                    }
                  }}
                />
              </div>
              <h3 className="mb-2 text-center text-xl font-semibold text-[var(--ink)]">
                {t("tutoring.tutors.tutor1.name")}
              </h3>
              <p className="mb-4 text-center text-sm font-semibold text-[var(--ink-subtle)]">
                {t("tutoring.tutors.tutor1.bio")}
              </p>
              <p className="text-center text-[var(--ink-muted)]">
                {t("tutoring.tutors.tutor1.description")}
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--paper)] p-8 shadow-sm">
              <div className="mb-4 aspect-square w-32 overflow-hidden rounded-full bg-[var(--paper-muted)] mx-auto">
                <img
                  src={t("tutoring.tutors.tutor2.image")}
                  alt={t("tutoring.tutors.tutor2.name")}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // 이미지 로드 실패 시 placeholder 표시
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<div class="flex h-full w-full items-center justify-center text-4xl">👤</div>';
                    }
                  }}
                />
              </div>
              <h3 className="mb-2 text-center text-xl font-semibold text-[var(--ink)]">
                {t("tutoring.tutors.tutor2.name")}
              </h3>
              <p className="mb-4 text-center text-sm font-semibold text-[var(--ink-subtle)]">
                {t("tutoring.tutors.tutor2.bio")}
              </p>
              <p className="text-center text-[var(--ink-muted)]">
                {t("tutoring.tutors.tutor2.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: The "Gen Z Tutor" Advantage */}
        <section className="bg-[var(--paper-muted)] py-16">
          <div className="section-container">
            <h2 className="mb-12 text-center text-3xl font-bold text-[var(--ink)] md:text-4xl">
              {t("tutoring.advantage.title")}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl bg-[var(--paper)] p-8 shadow-sm">
                <div className="mb-4 text-4xl">📚</div>
                <h3 className="mb-3 text-xl font-semibold text-[var(--ink)]">
                  {t("tutoring.advantage.trendBased.title")}
                </h3>
                <p className="text-[var(--ink-muted)]">
                  {t("tutoring.advantage.trendBased.description")}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--paper)] p-8 shadow-sm">
                <div className="mb-4 text-4xl">👥</div>
                <h3 className="mb-3 text-xl font-semibold text-[var(--ink)]">
                  {t("tutoring.advantage.genZPeer.title")}
                </h3>
                <p className="text-[var(--ink-muted)]">
                  {t("tutoring.advantage.genZPeer.description")}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--paper)] p-8 shadow-sm">
                <div className="mb-4 text-4xl">🎯</div>
                <h3 className="mb-3 text-xl font-semibold text-[var(--ink)]">
                  {t("tutoring.advantage.realLifeMission.title")}
                </h3>
                <p className="text-[var(--ink-muted)]">
                  {t("tutoring.advantage.realLifeMission.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Beta Program Offer */}
        <section className="section-container py-16">
          <div className="rounded-3xl bg-gradient-to-br from-[var(--ink)]/10 via-[var(--paper)] to-[var(--accent)]/15 p-12 text-center shadow-lg">
            <h2 className="mb-6 text-3xl font-bold text-[var(--ink)] md:text-4xl">
              {t("tutoring.beta.title")}
            </h2>
            <div className="mx-auto max-w-2xl space-y-4 text-left">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <p className="font-semibold text-[var(--ink)]">{t("tutoring.beta.benefit1.title")}</p>
                  <p className="text-sm text-[var(--ink-muted)]">{t("tutoring.beta.benefit1.description")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-semibold text-[var(--ink)]">{t("tutoring.beta.benefit2.title")}</p>
                  <p className="text-sm text-[var(--ink-muted)]">{t("tutoring.beta.benefit2.description")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="font-semibold text-[var(--ink)]">{t("tutoring.beta.benefit3.title")}</p>
                  <p className="text-sm text-[var(--ink-muted)]">{t("tutoring.beta.benefit3.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Conversion Form */}
        <section id="waitlist-form" className="bg-[var(--paper-muted)] py-16">
          <div className="section-container">
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-[var(--ink)] md:text-4xl">
                  {t("tutoring.form.title")}
                </h2>
                <p className="text-[var(--ink-muted)]">
                  {t("tutoring.form.subtitle")}
                </p>
              </div>

              {success ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                  <div className="mb-4 text-4xl">✅</div>
                  <h3 className="mb-2 text-xl font-semibold text-green-900">
                    {t("tutoring.form.success.title")}
                  </h3>
                  <p className="text-green-700">
                    {t("tutoring.form.success.message")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-[var(--paper)] p-8 shadow-sm">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-[var(--ink)]">
                      {t("tutoring.form.name")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--paper-muted)] px-4 py-3 text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]/40"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[var(--ink)]">
                      {t("tutoring.form.email")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--paper-muted)] px-4 py-3 text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]/40"
                      placeholder="example@email.com"
                    />
                    <p className="mt-1 text-xs text-[var(--ink-subtle)]">{t("tutoring.form.emailHint")}</p>
                  </div>

                  <div>
                    <label htmlFor="koreanLevel" className="mb-2 block text-sm font-semibold text-[var(--ink)]">
                      {t("tutoring.form.koreanLevel")} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="koreanLevel"
                      required
                      value={formData.koreanLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, koreanLevel: e.target.value as typeof formData.koreanLevel })
                      }
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--paper-muted)] px-4 py-3 text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]/40"
                    >
                      <option value="beginner">{t("tutoring.form.koreanLevel.beginner")}</option>
                      <option value="intermediate">{t("tutoring.form.koreanLevel.intermediate")}</option>
                      <option value="advanced">{t("tutoring.form.koreanLevel.advanced")}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="interestingTopic" className="mb-2 block text-sm font-semibold text-[var(--ink)]">
                      {t("tutoring.form.interestingTopic")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="interestingTopic"
                      type="text"
                      required
                      value={formData.interestingTopic}
                      onChange={(e) => setFormData({ ...formData, interestingTopic: e.target.value })}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--paper-muted)] px-4 py-3 text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]/40"
                      placeholder={t("tutoring.form.interestingTopic.placeholder")}
                    />
                  </div>

                  <div>
                    <label htmlFor="nativeLanguage" className="mb-2 block text-sm font-semibold text-[var(--ink)]">
                      {t("tutoring.form.nativeLanguage")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="nativeLanguage"
                      type="text"
                      required
                      value={formData.nativeLanguage}
                      onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--paper-muted)] px-4 py-3 text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--ink)]/40"
                      placeholder={t("tutoring.form.nativeLanguage.placeholder")}
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? t("tutoring.form.submitting") : t("tutoring.form.submit")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}

