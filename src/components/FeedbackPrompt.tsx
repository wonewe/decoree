import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../shared/i18n";
import { usePopups } from "../hooks/usePopups";
import { useEventList } from "../hooks/useEventList";
import type { PopupEvent } from "../data/popups";
import type { KCultureEvent } from "../data/events";
import { submitFeedback } from "../services/feedbackService";

const isOngoingEvent = (event: KCultureEvent) => {
  const today = new Date().toISOString().slice(0, 10);
  return event.startDate <= today && today <= event.endDate;
};

const isUpcomingEvent = (event: KCultureEvent) => {
  const today = new Date().toISOString().slice(0, 10);
  return event.startDate >= today;
};

const pickRandom = <T,>(items: T[]): T | null => {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
};

type Suggestion =
  | { type: "popup"; item: PopupEvent }
  | { type: "event"; item: KCultureEvent }
  | null;

const copyMap: Record<
  string,
  {
    greeting: string;
    suggestion: string;
    refresh: string;
    viewMore: string;
    noSuggestion: string;
    loading: string;
    feedback: string;
    placeholder: string;
    close: string;
    send: string;
    sending: string;
  }
> = {
  ko: {
    greeting: "이런 팝업/전시는 어떠세요?",
    suggestion: "추천",
    refresh: "새로고침",
    viewMore: "자세히 보기 →",
    noSuggestion: "추천할 대상을 찾지 못했습니다.",
    loading: "추천을 불러오는 중...",
    feedback: "피드백",
    placeholder: "예) 성수/홍대 야외 팝업을 더 보고 싶어요.",
    close: "닫기",
    send: "보내기",
    sending: "보내는 중..."
  },
  en: {
    greeting: "How about these pop-ups or exhibitions?",
    suggestion: "Suggestion",
    refresh: "Refresh",
    viewMore: "View details →",
    noSuggestion: "No suggestion available right now.",
    loading: "Loading suggestions...",
    feedback: "Feedback",
    placeholder: "e.g., More outdoor pop-ups in Seongsu/Hongdae.",
    close: "Close",
    send: "Send",
    sending: "Sending..."
  },
  fr: {
    greeting: "Que diriez-vous de ces pop-ups/expositions ?",
    suggestion: "Suggestion",
    refresh: "Rafraîchir",
    viewMore: "Voir les détails →",
    noSuggestion: "Aucune suggestion pour le moment.",
    loading: "Chargement des suggestions...",
    feedback: "Retour",
    placeholder: "ex. Plus de pop-ups en plein air à Seongsu/Hongdae.",
    close: "Fermer",
    send: "Envoyer",
    sending: "Envoi..."
  },
  ja: {
    greeting: "こんなポップアップ／展示はいかがですか？",
    suggestion: "おすすめ",
    refresh: "更新",
    viewMore: "詳しく見る →",
    noSuggestion: "おすすめを見つけられませんでした。",
    loading: "おすすめを読み込み中...",
    feedback: "フィードバック",
    placeholder: "例）ソンス／弘大の屋外ポップアップをもっと見たいです。",
    close: "閉じる",
    send: "送信",
    sending: "送信中..."
  }
};

export function FeedbackPrompt() {
  const { language } = useI18n();
  const { popups, status: popupStatus } = usePopups(language);
  const { events, status: eventStatus } = useEventList(language);

  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion>(null);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);

  const copy = copyMap[language] ?? copyMap.en;

  const computeSuggestion = (): Suggestion => {
    const livePopups = popups.filter((p) => p.status === "now" && !p.hidden);
    const soonPopups = popups.filter((p) => p.status === "soon" && !p.hidden);
    const liveEvents = events.filter((e) => isOngoingEvent(e) && !e.hidden);
    const upcomingEvents = events.filter((e) => isUpcomingEvent(e) && !e.hidden);

    const primary: Suggestion[] = [
      ...livePopups.map((item) => ({ type: "popup" as const, item })),
      ...liveEvents.map((item) => ({ type: "event" as const, item }))
    ];
    if (primary.length) return pickRandom(primary);

    const fallback: Suggestion[] = [
      ...soonPopups.map((item) => ({ type: "popup" as const, item })),
      ...upcomingEvents.map((item) => ({ type: "event" as const, item }))
    ];
    return pickRandom(fallback);
  };

  useEffect(() => {
    if (suggestionOpen) {
      setSuggestion(computeSuggestion());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popups, events, suggestionOpen]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!bubbleDismissed) setBubbleVisible(false);
    }, 60_000);
    return () => window.clearTimeout(timer);
  }, [bubbleDismissed]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    const result = await submitFeedback({
      message: text.trim(),
      language,
      suggestionType: suggestion?.type,
      suggestionId: suggestion?.item.id
    });
    setSending(false);
    if (!result.ok) {
      alert("피드백 전송에 실패했습니다. 나중에 다시 시도해주세요.");
      return;
    }
    setFeedbackOpen(false);
    setText("");
  };

  const showLoading = popupStatus === "loading" || eventStatus === "loading";

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      <div className="relative flex flex-col items-end gap-2">
        {bubbleVisible && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSuggestionOpen((prev) => !prev);
                setFeedbackOpen(false);
              }}
              className="max-w-xs rounded-2xl border border-[var(--border)] bg-[var(--paper)] px-3 py-2 text-left text-xs font-semibold text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {suggestion ? (
                <>
                  <span className="text-[var(--ink-muted)]">{copy.suggestion}: </span>
                  <span>{suggestion.item.title}</span>
                </>
              ) : (
                <span>{copy.greeting}</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setBubbleDismissed(true);
                setBubbleVisible(false);
              }}
              className="rounded-full border border-[var(--border)] bg-[var(--paper-muted)] px-2 py-1 text-[10px] font-semibold text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
            >
              ×
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setFeedbackOpen((prev) => !prev);
            setSuggestionOpen(false);
          }}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--paper)]/85 text-lg shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
          aria-label="피드백 열기"
        >
          <div
            className="h-9 w-9 rounded-full bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: "url('/favicon.svg')" }}
          />
        </button>

        {suggestionOpen && (
          <div className="absolute bottom-[calc(100%+10px)] right-0 w-80 rounded-2xl border border-[var(--border)] bg-white/95 p-4 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[var(--ink)]">{copy.suggestion}</h4>
              <button
                type="button"
                onClick={() => setSuggestionOpen(false)}
            className="text-xs font-semibold text-[var(--ink-subtle)] hover:text-[var(--ink)]"
          >
            ×
          </button>
        </div>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--ink-subtle)]">
                <span>{copy.greeting}</span>
                <button
                  type="button"
                  onClick={() => setSuggestion(computeSuggestion())}
                  className="text-[var(--ink-muted)] hover:text-[var(--ink)]"
                >
                  {copy.refresh}
                </button>
              </div>
              {showLoading ? (
                <p className="text-xs text-[var(--ink-subtle)]">{copy.loading}</p>
              ) : suggestion ? (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--paper-muted)] p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                    {suggestion.type === "popup" ? "Pop-up" : "Event"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--ink)]">{suggestion.item.title}</p>
                  {suggestion.item.location && (
                    <p className="text-xs text-[var(--ink-subtle)]">{suggestion.item.location}</p>
                  )}
                    <div className="mt-2 flex justify-end">
                      <a
                        href={
                          suggestion.type === "popup"
                            ? `/popups/${suggestion.item.id}`
                            : `/events/${suggestion.item.id}`
                        }
                        className="text-xs font-semibold text-[var(--ink)] underline"
                      >
                        {copy.viewMore}
                      </a>
                    </div>
                  </div>
                ) : (
                <p className="text-xs text-[var(--ink-subtle)]">{copy.noSuggestion}</p>
                )}
            </div>
          </div>
        )}

        {feedbackOpen && (
          <div className="absolute bottom-[calc(100%+10px)] right-0 w-80 rounded-2xl border border-[var(--border)] bg-white/95 p-4 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[var(--ink)]">{copy.feedback}</h4>
              <button
                type="button"
                onClick={() => setFeedbackOpen(false)}
                className="text-xs font-semibold text-[var(--ink-subtle)] hover:text-[var(--ink)]"
              >
                ×
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--paper-muted)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
                placeholder={copy.placeholder}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(false)}
                  className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                >
                  {copy.close}
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                  disabled={!text.trim() || sending}
                >
                  {sending ? copy.sending : copy.send}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
