import { FirebaseError } from "firebase/app";
import { FormEvent, useEffect, useState } from "react";
import type { TrendReport, TrendIntensity } from "../data/trends";
import type { KCultureEvent, EventCategory } from "../data/events";
import type { Phrase, PhraseCategory } from "../data/phrases";
import {
  addEvent,
  addPhrase,
  addTrendReport,
  deleteEvent,
  deletePhrase,
  deleteTrendReport,
  fetchEvents,
  fetchPhrases,
  fetchTrendReports,
  updateEvent,
  updatePhrase,
  updateTrendReport
} from "../services/contentService";
import { useAuth } from "../shared/auth";
import type { SupportedLanguage } from "../shared/i18n";
import { getLanguageLabel } from "../shared/i18n";

type ActiveSection = "trends" | "events" | "phrases";

type AdminMessage = {
  tone: "success" | "error" | "info";
  text: string;
};

const LANG_OPTIONS: SupportedLanguage[] = ["fr", "ko", "ja", "en"];

type TrendDraft = {
  id: string;
  language: SupportedLanguage;
  title: string;
  summary: string;
  details: string;
  neighborhood: string;
  tagsInput: string;
  intensity: TrendIntensity;
  isPremium: boolean;
  publishedAt: string;
  imageUrl: string;
  contentInput: string;
};

type EventDraft = {
  id: string;
  language: SupportedLanguage;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: EventCategory;
  price: string;
  bookingUrl: string;
  imageUrl: string;
  longDescriptionInput: string;
  tipsInput: string;
};

type PhraseDraft = {
  id: string;
  language: SupportedLanguage;
  korean: string;
  transliteration: string;
  translation: string;
  culturalNote: string;
  category: PhraseCategory;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function createEmptyTrendDraft(): TrendDraft {
  return {
    id: "",
    language: "en",
    title: "",
    summary: "",
    details: "",
    neighborhood: "",
    tagsInput: "",
    intensity: "highlight",
    isPremium: false,
    publishedAt: todayIso(),
    imageUrl: "",
    contentInput: ""
  };
}

function trendToDraft(report: TrendReport): TrendDraft {
  return {
    id: report.id,
    language: report.language ?? "en",
    title: report.title,
    summary: report.summary,
    details: report.details,
    neighborhood: report.neighborhood,
    tagsInput: report.tags.join(", "),
    intensity: report.intensity,
    isPremium: report.isPremium,
    publishedAt: report.publishedAt ?? todayIso(),
    imageUrl: report.imageUrl,
    contentInput: report.content.join("\n\n")
  };
}

function draftToTrend(draft: TrendDraft): TrendReport {
  const tags = draft.tagsInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const content = draft.contentInput
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    id: draft.id.trim(),
    language: draft.language,
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    details: draft.details.trim(),
    neighborhood: draft.neighborhood.trim(),
    tags,
    intensity: draft.intensity,
    isPremium: draft.isPremium,
    publishedAt: draft.publishedAt || todayIso(),
    imageUrl: draft.imageUrl.trim(),
    content
  };
}

function createEmptyEventDraft(): EventDraft {
  return {
    id: "",
    language: "en",
    title: "",
    description: "",
    date: todayIso(),
    time: "19:00",
    location: "",
    category: "concert",
    price: "",
    bookingUrl: "",
    imageUrl: "",
    longDescriptionInput: "",
    tipsInput: ""
  };
}

function eventToDraft(event: KCultureEvent): EventDraft {
  return {
    id: event.id,
    language: event.language ?? "en",
    title: event.title,
    description: event.description,
    date: event.date ?? todayIso(),
    time: event.time,
    location: event.location,
    category: event.category,
    price: event.price,
    bookingUrl: event.bookingUrl ?? "",
    imageUrl: event.imageUrl,
    longDescriptionInput: event.longDescription.join("\n\n"),
    tipsInput: event.tips.join("\n")
  };
}

function draftToEvent(draft: EventDraft): KCultureEvent {
  const longDescription = draft.longDescriptionInput
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const tips = draft.tipsInput
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    id: draft.id.trim(),
    language: draft.language,
    title: draft.title.trim(),
    description: draft.description.trim(),
    date: draft.date,
    time: draft.time.trim(),
    location: draft.location.trim(),
    category: draft.category,
    price: draft.price.trim(),
    bookingUrl: draft.bookingUrl.trim() || undefined,
    imageUrl: draft.imageUrl.trim(),
    longDescription,
    tips
  };
}

function createEmptyPhraseDraft(): PhraseDraft {
  return {
    id: "",
    language: "en",
    korean: "",
    transliteration: "",
    translation: "",
    culturalNote: "",
    category: "food"
  };
}

function phraseToDraft(phrase: Phrase): PhraseDraft {
  return {
    id: phrase.id,
    language: phrase.language ?? "en",
    korean: phrase.korean,
    transliteration: phrase.transliteration,
    translation: phrase.translation,
    culturalNote: phrase.culturalNote,
    category: phrase.category
  };
}

function draftToPhrase(draft: PhraseDraft): Phrase {
  return {
    id: draft.id.trim(),
    language: draft.language,
    korean: draft.korean.trim(),
    transliteration: draft.transliteration.trim(),
    translation: draft.translation.trim(),
    culturalNote: draft.culturalNote.trim(),
    category: draft.category
  };
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>("trends");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<AdminMessage | null>(null);

  const [trends, setTrends] = useState<TrendReport[]>([]);
  const [events, setEvents] = useState<KCultureEvent[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);

  const [trendDraft, setTrendDraft] = useState<TrendDraft>(createEmptyTrendDraft);
  const [eventDraft, setEventDraft] = useState<EventDraft>(createEmptyEventDraft);
  const [phraseDraft, setPhraseDraft] = useState<PhraseDraft>(createEmptyPhraseDraft);

  const [selectedTrendId, setSelectedTrendId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);

  const [savingTrend, setSavingTrend] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [savingPhrase, setSavingPhrase] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadContent() {
      setLoading(true);
      try {
        const [trendData, eventData, phraseData] = await Promise.all([
          fetchTrendReports(),
          fetchEvents(),
          fetchPhrases()
        ]);

        if (!isMounted) return;
        setTrends(trendData);
        setEvents(eventData);
        setPhrases(phraseData);

        if (trendData.length > 0) {
          setSelectedTrendId(trendData[0].id);
          setTrendDraft(trendToDraft(trendData[0]));
        }
        if (eventData.length > 0) {
          setSelectedEventId(eventData[0].id);
          setEventDraft(eventToDraft(eventData[0]));
        }
        if (phraseData.length > 0) {
          setSelectedPhraseId(phraseData[0].id);
          setPhraseDraft(phraseToDraft(phraseData[0]));
        }
      } catch (error) {
        console.error("Failed to load admin content", error);
        setMessage({
          tone: "error",
          text: `콘텐츠를 불러오는 동안 문제가 발생했습니다. 잠시 후 다시 시도해주세요.\n${describeError(
            error
          )}`
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const resetMessage = () => setMessage(null);

  const describeError = (error: unknown) => {
    if (error instanceof FirebaseError) {
      return `${error.message} (${error.code})`;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  };

  const handleTrendSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessage();
    const payload = draftToTrend(trendDraft);
    if (!payload.id) {
      setMessage({ tone: "error", text: "ID는 반드시 입력해야 합니다." });
      return;
    }
    setSavingTrend(true);
    try {
      const exists = trends.some((item) => item.id === payload.id);
      const updated = exists ? await updateTrendReport(payload) : await addTrendReport(payload);
      setTrends(updated);
      const saved = updated.find((item) => item.id === payload.id);
      if (saved) {
        setTrendDraft(trendToDraft(saved));
        setSelectedTrendId(saved.id);
      }
      setMessage({
        tone: "success",
        text: exists ? "트렌드가 업데이트되었습니다." : "새 트렌드가 등록되었습니다."
      });
    } catch (error) {
      console.error("Failed to save trend", error);
      setMessage({
        tone: "error",
        text: `트렌드를 저장할 수 없습니다. 입력 값을 다시 확인해주세요.\n${describeError(
          error
        )}`
      });
    } finally {
      setSavingTrend(false);
    }
  };

  const handleTrendDelete = async (id: string) => {
    resetMessage();
    if (!id) {
      setMessage({ tone: "error", text: "삭제할 항목을 먼저 선택해주세요." });
      return;
    }
    const confirmed = window.confirm("정말로 이 트렌드를 삭제하시겠어요?");
    if (!confirmed) return;
    setSavingTrend(true);
    try {
      const updated = await deleteTrendReport(id);
      setTrends(updated);
      if (updated.length > 0) {
        setSelectedTrendId(updated[0].id);
        setTrendDraft(trendToDraft(updated[0]));
      } else {
        setSelectedTrendId(null);
        setTrendDraft(createEmptyTrendDraft());
      }
      setMessage({ tone: "success", text: "트렌드를 삭제했습니다." });
    } catch (error) {
      console.error("Failed to delete trend", error);
      setMessage({
        tone: "error",
        text: `트렌드를 삭제할 수 없습니다. 다시 시도해주세요.\n${describeError(error)}`
      });
    } finally {
      setSavingTrend(false);
    }
  };

  const handleEventSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessage();
    const payload = draftToEvent(eventDraft);
    if (!payload.id) {
      setMessage({ tone: "error", text: "ID는 반드시 입력해야 합니다." });
      return;
    }
    setSavingEvent(true);
    try {
      const exists = events.some((item) => item.id === payload.id);
      const updated = exists ? await updateEvent(payload) : await addEvent(payload);
      setEvents(updated);
      const saved = updated.find((item) => item.id === payload.id);
      if (saved) {
        setEventDraft(eventToDraft(saved));
        setSelectedEventId(saved.id);
      }
      setMessage({
        tone: "success",
        text: exists ? "이벤트가 업데이트되었습니다." : "새 이벤트가 등록되었습니다."
      });
    } catch (error) {
      console.error("Failed to save event", error);
      setMessage({
        tone: "error",
        text: `이벤트를 저장할 수 없습니다. 입력 값을 확인해주세요.\n${describeError(
          error
        )}`
      });
    } finally {
      setSavingEvent(false);
    }
  };

  const handleEventDelete = async (id: string) => {
    resetMessage();
    if (!id) {
      setMessage({ tone: "error", text: "삭제할 항목을 먼저 선택해주세요." });
      return;
    }
    const confirmed = window.confirm("정말로 이 이벤트를 삭제하시겠어요?");
    if (!confirmed) return;
    setSavingEvent(true);
    try {
      const updated = await deleteEvent(id);
      setEvents(updated);
      if (updated.length > 0) {
        setSelectedEventId(updated[0].id);
        setEventDraft(eventToDraft(updated[0]));
      } else {
        setSelectedEventId(null);
        setEventDraft(createEmptyEventDraft());
      }
      setMessage({ tone: "success", text: "이벤트를 삭제했습니다." });
    } catch (error) {
      console.error("Failed to delete event", error);
      setMessage({
        tone: "error",
        text: `이벤트를 삭제할 수 없습니다. 다시 시도해주세요.\n${describeError(error)}`
      });
    } finally {
      setSavingEvent(false);
    }
  };

  const handlePhraseSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessage();
    const payload = draftToPhrase(phraseDraft);
    if (!payload.id) {
      setMessage({ tone: "error", text: "ID는 반드시 입력해야 합니다." });
      return;
    }
    setSavingPhrase(true);
    try {
      const exists = phrases.some((item) => item.id === payload.id);
      const updated = exists ? await updatePhrase(payload) : await addPhrase(payload);
      setPhrases(updated);
      const saved = updated.find((item) => item.id === payload.id);
      if (saved) {
        setPhraseDraft(phraseToDraft(saved));
        setSelectedPhraseId(saved.id);
      }
      setMessage({
        tone: "success",
        text: exists ? "표현이 업데이트되었습니다." : "새 표현이 등록되었습니다."
      });
    } catch (error) {
      console.error("Failed to save phrase", error);
      setMessage({
        tone: "error",
        text: `표현을 저장할 수 없습니다. 입력 값을 확인해주세요.\n${describeError(error)}`
      });
    } finally {
      setSavingPhrase(false);
    }
  };

  const handlePhraseDelete = async (id: string) => {
    resetMessage();
    if (!id) {
      setMessage({ tone: "error", text: "삭제할 항목을 먼저 선택해주세요." });
      return;
    }
    const confirmed = window.confirm("정말로 이 표현을 삭제하시겠어요?");
    if (!confirmed) return;
    setSavingPhrase(true);
    try {
      const updated = await deletePhrase(id);
      setPhrases(updated);
      if (updated.length > 0) {
        setSelectedPhraseId(updated[0].id);
        setPhraseDraft(phraseToDraft(updated[0]));
      } else {
        setSelectedPhraseId(null);
        setPhraseDraft(createEmptyPhraseDraft());
      }
      setMessage({ tone: "success", text: "표현을 삭제했습니다." });
    } catch (error) {
      console.error("Failed to delete phrase", error);
      setMessage({
        tone: "error",
        text: `표현을 삭제할 수 없습니다. 다시 시도해주세요.\n${describeError(error)}`
      });
    } finally {
      setSavingPhrase(false);
    }
  };

  const sectionTabClass = (section: ActiveSection) =>
    `rounded-full px-5 py-2 text-sm font-semibold transition ${
      section === activeSection
        ? "bg-dancheongNavy text-white shadow"
        : "bg-white text-dancheongNavy hover:bg-slate-100"
    }`;

  const renderMessage = () => {
    if (!message) return null;
    const toneClass =
      message.tone === "success"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : message.tone === "error"
        ? "bg-rose-50 text-rose-700 border-rose-200"
        : "bg-slate-100 text-slate-600 border-slate-200";
    return (
      <div className={`rounded-2xl border px-6 py-4 text-sm ${toneClass}`}>
        {message.text}
      </div>
    );
  };

  const renderListButton = (id: string, label: string, isActive: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
        isActive ? "border-dancheongNavy bg-dancheongNavy/5" : "border-slate-200 bg-white"
      } hover:border-dancheongNavy/60`}
    >
      <span className="block font-semibold text-dancheongNavy">{label}</span>
      <span className="mt-1 block text-xs text-slate-500">{id}</span>
    </button>
  );

  const renderTrendsSection = () => (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dancheongNavy">주간 트렌드 목록</h3>
          <button
            type="button"
            onClick={() => {
              setSelectedTrendId(null);
              setTrendDraft(createEmptyTrendDraft());
            }}
            className="text-sm font-semibold text-hanBlue hover:underline"
          >
            새 트렌드 작성
          </button>
        </div>
        <div className="space-y-2">
          {trends.map((report) =>
            renderListButton(
              report.id,
              `[${getLanguageLabel(report.language ?? "fr")}] ${report.title}`,
              selectedTrendId === report.id,
              () => {
              setSelectedTrendId(report.id);
              setTrendDraft(trendToDraft(report));
              }
            )
          )}
          {trends.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              아직 등록된 트렌드가 없습니다. 오른쪽 양식을 채워 새 트렌드를 추가하세요.
            </p>
          )}
        </div>
      </aside>

      <form onSubmit={handleTrendSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-dancheongNavy">
            {selectedTrendId ? "트렌드 수정" : "새 트렌드 등록"}
          </h3>
          {selectedTrendId && (
            <button
              type="button"
              onClick={() => handleTrendDelete(selectedTrendId)}
              className="text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              삭제
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            언어
            <select
              value={trendDraft.language}
              onChange={(e) =>
                setTrendDraft((prev) => ({
                  ...prev,
                  language: e.target.value as SupportedLanguage
                }))
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              {LANG_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {getLanguageLabel(lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            ID (영문 소문자, 하이픈 권장)
            <input
              type="text"
              value={trendDraft.id}
              onChange={(e) => setTrendDraft((prev) => ({ ...prev, id: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="ex) seongsu-vinyl"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            공개 날짜
            <input
              type="date"
              value={trendDraft.publishedAt}
              onChange={(e) => setTrendDraft((prev) => ({ ...prev, publishedAt: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          제목
          <input
            type="text"
            value={trendDraft.title}
            onChange={(e) => setTrendDraft((prev) => ({ ...prev, title: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          요약
          <textarea
            value={trendDraft.summary}
            onChange={(e) => setTrendDraft((prev) => ({ ...prev, summary: e.target.value }))}
            className="h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          상세 설명 (목록 카드에서 사용)
          <textarea
            value={trendDraft.details}
            onChange={(e) => setTrendDraft((prev) => ({ ...prev, details: e.target.value }))}
            className="h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            지역 / 동네
            <input
              type="text"
              value={trendDraft.neighborhood}
              onChange={(e) => setTrendDraft((prev) => ({ ...prev, neighborhood: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            대표 이미지 URL
            <input
              type="url"
              value={trendDraft.imageUrl}
              onChange={(e) => setTrendDraft((prev) => ({ ...prev, imageUrl: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            태그 (쉼표로 구분)
            <input
              type="text"
              value={trendDraft.tagsInput}
              onChange={(e) => setTrendDraft((prev) => ({ ...prev, tagsInput: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="pop-up, mode, street food"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
              트렌드 강도
              <select
                value={trendDraft.intensity}
                onChange={(e) =>
                  setTrendDraft((prev) => ({ ...prev, intensity: e.target.value as TrendIntensity }))
                }
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="highlight">Highlight</option>
                <option value="insider">Insider</option>
                <option value="emerging">Emerging</option>
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-dancheongNavy">
              <input
                type="checkbox"
                checked={trendDraft.isPremium}
                onChange={(e) =>
                  setTrendDraft((prev) => ({ ...prev, isPremium: e.target.checked }))
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              프리미엄 전용
            </label>
          </div>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          본문 문단 (줄바꿈으로 구분)
          <textarea
            value={trendDraft.contentInput}
            onChange={(e) => setTrendDraft((prev) => ({ ...prev, contentInput: e.target.value }))}
            className="h-48 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="문단마다 한 줄을 비워두면 가독성이 올라갑니다."
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedTrendId(null);
              setTrendDraft(createEmptyTrendDraft());
            }}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            새로 작성
          </button>
          <button
            type="submit"
            disabled={savingTrend}
            className="rounded-full bg-hanBlue px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-dancheongNavy disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {savingTrend ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderEventsSection = () => (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dancheongNavy">K-Culture 이벤트</h3>
          <button
            type="button"
            onClick={() => {
              setSelectedEventId(null);
              setEventDraft(createEmptyEventDraft());
            }}
            className="text-sm font-semibold text-hanBlue hover:underline"
          >
            새 이벤트 작성
          </button>
        </div>
        <div className="space-y-2">
          {events.map((event) =>
            renderListButton(
              event.id,
              `[${getLanguageLabel(event.language ?? "fr")}] ${event.title}`,
              selectedEventId === event.id,
              () => {
                setSelectedEventId(event.id);
                setEventDraft(eventToDraft(event));
              }
            )
          )}
          {events.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              아직 등록된 이벤트가 없습니다. 오른쪽 양식을 채워 새 이벤트를 추가하세요.
            </p>
          )}
        </div>
      </aside>

      <form onSubmit={handleEventSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-dancheongNavy">
            {selectedEventId ? "이벤트 수정" : "새 이벤트 등록"}
          </h3>
          {selectedEventId && (
            <button
              type="button"
              onClick={() => handleEventDelete(selectedEventId)}
              className="text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              삭제
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            언어
            <select
              value={eventDraft.language}
              onChange={(e) =>
                setEventDraft((prev) => ({
                  ...prev,
                  language: e.target.value as SupportedLanguage
                }))
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              {LANG_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {getLanguageLabel(lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            ID
            <input
              type="text"
              value={eventDraft.id}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, id: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            카테고리
            <select
              value={eventDraft.category}
              onChange={(e) =>
                setEventDraft((prev) => ({ ...prev, category: e.target.value as EventCategory }))
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="concert">Concert</option>
              <option value="traditional">Traditional</option>
              <option value="pop-up">Pop-up</option>
              <option value="festival">Festival</option>
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          제목
          <input
            type="text"
            value={eventDraft.title}
            onChange={(e) => setEventDraft((prev) => ({ ...prev, title: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          요약 설명
          <textarea
            value={eventDraft.description}
            onChange={(e) => setEventDraft((prev) => ({ ...prev, description: e.target.value }))}
            className="h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            날짜
            <input
              type="date"
              value={eventDraft.date}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, date: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            시간
            <input
              type="time"
              value={eventDraft.time}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, time: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            참가비 / 티켓
            <input
              type="text"
              value={eventDraft.price}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, price: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="예: 29 000 KRW, Entrée libre"
              required
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          장소
          <input
            type="text"
            value={eventDraft.location}
            onChange={(e) => setEventDraft((prev) => ({ ...prev, location: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            대표 이미지 URL
            <input
              type="url"
              value={eventDraft.imageUrl}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, imageUrl: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            예약 링크 (선택)
            <input
              type="url"
              value={eventDraft.bookingUrl}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, bookingUrl: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="https://"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          상세 설명 (줄바꿈으로 문단 구분)
          <textarea
            value={eventDraft.longDescriptionInput}
            onChange={(e) =>
              setEventDraft((prev) => ({ ...prev, longDescriptionInput: e.target.value }))
            }
            className="h-40 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          팁 & 추천 (줄바꿈으로 구분)
          <textarea
            value={eventDraft.tipsInput}
            onChange={(e) => setEventDraft((prev) => ({ ...prev, tipsInput: e.target.value }))}
            className="h-32 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedEventId(null);
              setEventDraft(createEmptyEventDraft());
            }}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            새로 작성
          </button>
          <button
            type="submit"
            disabled={savingEvent}
            className="rounded-full bg-hanBlue px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-dancheongNavy disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {savingEvent ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderPhrasesSection = () => (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dancheongNavy">한국어 표현</h3>
          <button
            type="button"
            onClick={() => {
              setSelectedPhraseId(null);
              setPhraseDraft(createEmptyPhraseDraft());
            }}
            className="text-sm font-semibold text-hanBlue hover:underline"
          >
            새 표현 작성
          </button>
        </div>
        <div className="space-y-2">
          {phrases.map((phrase) =>
            renderListButton(
              phrase.id,
              `[${getLanguageLabel(phrase.language ?? "fr")}] ${phrase.korean}`,
              selectedPhraseId === phrase.id,
              () => {
                setSelectedPhraseId(phrase.id);
                setPhraseDraft(phraseToDraft(phrase));
              }
            )
          )}
          {phrases.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              아직 등록된 표현이 없습니다. 오른쪽 양식을 채워 새 표현을 추가하세요.
            </p>
          )}
        </div>
      </aside>

      <form onSubmit={handlePhraseSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-dancheongNavy">
            {selectedPhraseId ? "표현 수정" : "새 표현 등록"}
          </h3>
          {selectedPhraseId && (
            <button
              type="button"
              onClick={() => handlePhraseDelete(selectedPhraseId)}
              className="text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              삭제
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            언어
            <select
              value={phraseDraft.language}
              onChange={(e) =>
                setPhraseDraft((prev) => ({
                  ...prev,
                  language: e.target.value as SupportedLanguage
                }))
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              {LANG_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {getLanguageLabel(lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            ID
            <input
              type="text"
              value={phraseDraft.id}
              onChange={(e) => setPhraseDraft((prev) => ({ ...prev, id: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            카테고리
            <select
              value={phraseDraft.category}
              onChange={(e) =>
                setPhraseDraft((prev) => ({ ...prev, category: e.target.value as PhraseCategory }))
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="food">음식</option>
              <option value="shopping">쇼핑</option>
              <option value="entertainment">엔터테인먼트</option>
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          한국어 표현
          <input
            type="text"
            value={phraseDraft.korean}
            onChange={(e) => setPhraseDraft((prev) => ({ ...prev, korean: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          발음 표기
          <input
            type="text"
            value={phraseDraft.transliteration}
            onChange={(e) =>
              setPhraseDraft((prev) => ({ ...prev, transliteration: e.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          번역 (선택한 언어)
          <input
            type="text"
            value={phraseDraft.translation}
            onChange={(e) => setPhraseDraft((prev) => ({ ...prev, translation: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          문화 노트
          <textarea
            value={phraseDraft.culturalNote}
            onChange={(e) => setPhraseDraft((prev) => ({ ...prev, culturalNote: e.target.value }))}
            className="h-28 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedPhraseId(null);
              setPhraseDraft(createEmptyPhraseDraft());
            }}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            새로 작성
          </button>
          <button
            type="submit"
            disabled={savingPhrase}
            className="rounded-full bg-hanBlue px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-dancheongNavy disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {savingPhrase ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <main className="section-container space-y-10">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dancheongNavy">Studio Décorée 관리자</h1>
            <p className="mt-2 text-sm text-slate-500">
              주간 트렌드, 이벤트, 프레이즈북 콘텐츠를 한 곳에서 관리하세요. 저장 이후에는
              실시간으로 웹사이트에 반영됩니다.
            </p>
          </div>
          {user && (
            <div className="rounded-full bg-white px-5 py-3 text-sm text-slate-600 shadow">
              <p className="font-semibold text-dancheongNavy">로그인 계정</p>
              <p>{user.email}</p>
              <button
                type="button"
                onClick={logout}
                className="mt-2 text-xs font-semibold text-hanBlue hover:underline"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveSection("trends");
              resetMessage();
            }}
            className={sectionTabClass("trends")}
          >
            트렌드 리포트
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSection("events");
              resetMessage();
            }}
            className={sectionTabClass("events")}
          >
            이벤트 캘린더
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSection("phrases");
              resetMessage();
            }}
            className={sectionTabClass("phrases")}
          >
            한국어 프레이즈북
          </button>
        </div>

        {renderMessage()}
      </header>

      {loading ? (
        <section className="rounded-3xl bg-white p-10 text-center shadow">
          <p className="text-sm text-slate-500">콘텐츠를 불러오는 중입니다...</p>
        </section>
      ) : (
        <>
          {activeSection === "trends" && renderTrendsSection()}
          {activeSection === "events" && renderEventsSection()}
          {activeSection === "phrases" && renderPhrasesSection()}
        </>
      )}
    </main>
  );
}
