import { useMemo, useState } from "react";
import {
  CULTURE_QUIZ_QUESTIONS,
  CULTURE_QUIZ_RESULTS,
  scoreCultureQuiz,
  type CultureArchetype
} from "../data/cultureTest";
import { useI18n } from "../shared/i18n";

type AnswerMap = Record<string, string>;

export default function CultureTestPage() {
  const { t } = useI18n();
  const totalQuestions = CULTURE_QUIZ_QUESTIONS.length;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");

  const currentQuestion = CULTURE_QUIZ_QUESTIONS[currentQuestionIndex];
  const { totals, dominantArchetype } = useMemo(() => scoreCultureQuiz(answers), [answers]);
  const resultMeta = CULTURE_QUIZ_RESULTS[dominantArchetype];

  const answeredCount = Object.keys(answers).length;
  const progressValue = hasSubmitted
    ? 100
    : Math.min(100, Math.round((answeredCount / totalQuestions) * 100));
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleSelect = (answerId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId
    }));
  };

  const handleNext = () => {
    if (!currentQuestion || !answers[currentQuestion.id]) return;
    if (currentQuestionIndex === totalQuestions - 1) {
      setHasSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const handlePrev = () => {
    if (currentQuestionIndex === 0) return;
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setHasSubmitted(false);
    setShareStatus("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = async () => {
    if (!hasSubmitted) return;
    const title = t("cultureTest.share.title");
    const resultTitle = t(resultMeta.titleKey);
    const text = t("cultureTest.share.text", { result: resultTitle });
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        setShareStatus("idle");
      } catch (error) {
        console.error("Share failed", error);
        setShareStatus("error");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text} ${shareUrl}`);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2500);
    } catch (error) {
      console.error("Clipboard copy failed", error);
      setShareStatus("error");
    }
  };

  return (
    <section className="section-container space-y-12">
      <header className="space-y-4 text-center md:text-left">
        <span className="inline-flex items-center gap-2 rounded-full bg-hanBlue/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-hanBlue">
          {t("cultureTest.badge")}
        </span>
        <h1 className="text-4xl font-bold text-dancheongNavy md:text-5xl">{t("cultureTest.title")}</h1>
        <p className="mx-auto max-w-3xl text-base text-slate-600 md:text-lg">{t("cultureTest.subtitle")}</p>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {hasSubmitted
                  ? t("cultureTest.progress.complete")
                  : t("cultureTest.progress.step", {
                      current: currentQuestionIndex + 1,
                      total: totalQuestions
                    })}
              </span>
              <span className="text-xs text-slate-400">
                {t("cultureTest.progress.helper")}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-hanBlue via-dancheongGreen to-dancheongYellow transition-all duration-300"
                style={{ width: `${Math.max(progressValue, 6)}%` }}
              />
            </div>
          </div>

          {!hasSubmitted && currentQuestion && (
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-dancheongNavy">
                  {t(currentQuestion.titleKey)}
                </h2>
                {currentQuestion.subtitleKey && (
                  <p className="text-sm text-slate-500">{t(currentQuestion.subtitleKey)}</p>
                )}
              </div>
              <div className="grid gap-3">
                {currentQuestion.answers.map((answer) => {
                  const isSelected = currentAnswer === answer.id;
                  return (
                    <button
                      key={answer.id}
                      onClick={() => handleSelect(answer.id)}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        isSelected
                          ? "border-hanBlue bg-hanBlue/10 text-hanBlue"
                          : "border-slate-200 hover:border-hanBlue/40 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block text-base font-semibold">
                        {t(answer.labelKey)}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                >
                  {t("cultureTest.actions.previous")}
                </button>
                <div className="flex flex-1 justify-end gap-3">
                  <button
                    onClick={handleRestart}
                    disabled={answeredCount === 0}
                    className="rounded-full border border-dancheongYellow px-5 py-2 text-sm font-semibold text-dancheongYellow transition hover:bg-dancheongYellow/10 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"
                  >
                    {t("cultureTest.actions.reset")}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!currentAnswer}
                    className="rounded-full bg-hanBlue px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-dancheongNavy disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {currentQuestionIndex === totalQuestions - 1
                      ? t("cultureTest.actions.submit")
                      : t("cultureTest.actions.next")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {hasSubmitted && (
            <div className="mt-8 space-y-6">
              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-hanBlue">
                  {t("cultureTest.result.badge")}
                </h2>
                <h3 className="text-3xl font-bold text-dancheongNavy">
                  {t(resultMeta.titleKey)}
                </h3>
                <p className="text-base text-slate-600">{t(resultMeta.descriptionKey)}</p>
              </div>
              <div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:grid-cols-3">
                {resultMeta.highlightsKeys.map((highlightKey) => (
                  <div key={highlightKey} className="space-y-2">
                    <span className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-hanBlue shadow-sm">
                      {t("cultureTest.result.highlight")}
                    </span>
                    <p className="text-sm text-slate-600">{t(highlightKey)}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleShare}
                  className="rounded-full border border-hanBlue px-5 py-2 text-sm font-semibold text-hanBlue transition hover:bg-hanBlue hover:text-white"
                >
                  {t("cultureTest.actions.share")}
                </button>
                <button
                  onClick={handleRestart}
                  className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-hanBlue hover:text-hanBlue"
                >
                  {t("cultureTest.actions.retry")}
                </button>
                {shareStatus === "copied" && (
                  <span className="text-xs font-semibold text-dancheongGreen">
                    {t("cultureTest.share.copied")}
                  </span>
                )}
                {shareStatus === "error" && (
                  <span className="text-xs font-semibold text-dancheongRed">
                    {t("cultureTest.share.error")}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {hasSubmitted ? (
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-inner sm:p-8 lg:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-dancheongNavy">
                {t("cultureTest.result.next.title")}
              </h4>
              <p className="text-sm text-slate-600">{t("cultureTest.result.next.subtitle")}</p>
            </div>
            <div className="grid gap-3 text-sm text-slate-500">
              {Object.entries(CULTURE_QUIZ_RESULTS).map(([archetype, meta]) => {
                const score = totals[archetype as CultureArchetype] ?? 0;
                const percentage = Math.round((score / (totalQuestions * 2)) * 100);
                return (
                  <div key={archetype} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold ${
                          archetype === dominantArchetype ? "text-hanBlue" : "text-slate-500"
                        }`}
                      >
                        {t(meta.titleKey)}
                      </span>
                      <span className="text-xs text-slate-400">{percentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className={`h-2 rounded-full ${
                          archetype === dominantArchetype
                            ? "bg-hanBlue"
                            : "bg-dancheongGreen/60"
                        }`}
                        style={{ width: `${Math.max(6, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-inner sm:p-8">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-dancheongNavy">
                {t("cultureTest.hint.title")}
              </h4>
              <p className="text-sm text-slate-600">{t("cultureTest.hint.subtitle")}</p>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-500">
                <li>{t("cultureTest.hint.item.1")}</li>
                <li>{t("cultureTest.hint.item.2")}</li>
                <li>{t("cultureTest.hint.item.3")}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
