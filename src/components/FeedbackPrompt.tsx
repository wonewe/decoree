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

  const greeting = useMemo(() => {
    switch (language) {
      case "fr":
        return "Que diriez-vous de ces pop-ups/expositions ?";
      case "ja":
        return "こんなポップアップ／展示はいかがですか？";
      case "ko":
        return "이런 팝업/전시는 어떠세요?";
      default:
        return "How about these pop-ups or exhibitions?";
    }
  }, [language]);

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
    const timer = window.setTimeout(() => setBubbleVisible(false), 60_000);
    return () => window.clearTimeout(timer);
  }, []);

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
                <span className="text-[var(--ink-muted)]">추천: </span>
                <span>{suggestion.item.title}</span>
              </>
            ) : (
              <span>{greeting}</span>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setFeedbackOpen((prev) => !prev);
            setSuggestionOpen(false);
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--paper)] text-lg shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          aria-label="피드백 열기"
        >
          <img src="/favicon.svg" alt="" className="h-6 w-6 object-contain" />
        </button>

        {suggestionOpen && (
          <div className="absolute bottom-[calc(100%+10px)] right-0 w-80 rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[var(--ink)]">추천</h4>
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
                <span>{greeting}</span>
                <button
                  type="button"
                  onClick={() => setSuggestion(computeSuggestion())}
                  className="text-[var(--ink-muted)] hover:text-[var(--ink)]"
                >
                  새로고침
                </button>
              </div>
              {showLoading ? (
                <p className="text-xs text-[var(--ink-subtle)]">추천을 불러오는 중...</p>
              ) : suggestion ? (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--paper-muted)] p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                    {suggestion.type === "popup" ? "Pop-up" : "Event"}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--ink)]">{suggestion.item.title}</p>
                  {"location" in suggestion.item && suggestion.item.location && (
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
                      자세히 보기 →
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[var(--ink-subtle)]">추천할 대상을 찾지 못했습니다.</p>
              )}
            </div>
          </div>
        )}

        {feedbackOpen && (
          <div className="absolute bottom-[calc(100%+10px)] right-0 w-80 rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[var(--ink)]">피드백</h4>
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
                placeholder="예) 성수/홍대 야외 팝업을 더 보고 싶어요."
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(false)}
                  className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                  disabled={!text.trim() || sending}
                >
                  {sending ? "보내는 중..." : "보내기"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
