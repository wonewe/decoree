import { FirebaseError } from "firebase/app";
import { FormEvent, useEffect, useState } from "react";
import type { TrendReport, TrendIntensity } from "../data/trends";
import type { KCultureEvent, EventCategory } from "../data/events";
import type { Phrase, PhraseCategory } from "../data/phrases";
import type { PopupEvent, PopupStatus } from "../data/popups";
import { AUTHOR_PROFILES } from "../data/authors";
import {
  addEvent,
  addPhrase,
  addPopup,
  addTrendReport,
  deleteEvent,
  deletePhrase,
  deletePopup,
  deleteTrendReport,
  fetchEvents,
  fetchPhrases,
  fetchPopups,
  fetchTrendReports,
  updateEvent,
  updatePhrase,
  updatePopup,
  updateTrendReport
} from "../services/contentService";
import { useAuth } from "../shared/auth";
import type { SupportedLanguage } from "../shared/i18n";
import { getLanguageLabel } from "../shared/i18n";
import {
  STUDIO_AUTO_TRANSLATE_ENABLED,
  translateEventContent,
  translatePhraseContent,
  translatePopupContent,
  translateTrendReportContent
} from "../services/translation/contentLocalizationService";

type ActiveSection = "trends" | "events" | "phrases" | "popups";

type AdminMessage = {
  tone: "success" | "error" | "info";
  text: string;
};

const LANG_OPTIONS: SupportedLanguage[] = ["fr", "ko", "ja", "en"];

const DRAFT_STORAGE_KEYS = {
  trend: "koraid:studio:draft:trend",
  event: "koraid:studio:draft:event",
  phrase: "koraid:studio:draft:phrase",
  popup: "koraid:studio:draft:popup"
} as const;

const DRAFT_LIST_ID = {
  trend: "__draft_trend",
  event: "__draft_event",
  phrase: "__draft_phrase",
  popup: "__draft_popup"
} as const;

function readDraft<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    console.warn("Failed to read draft", error);
    return null;
  }
}

function writeDraft<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to save draft", error);
  }
}

function clearDraft(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn("Failed to clear draft", error);
  }
}

type TrendDraft = {
  id: string;
  language: SupportedLanguage;
  languages: SupportedLanguage[];
  authorId: string;
  title: string;
  summary: string;
  details: string;
  neighborhood: string;
  tagsInput: string;
  intensity: TrendIntensity;
  publishedAt: string;
  imageUrl: string;
  contentInput: string;
};

type EventDraft = {
  id: string;
  language: SupportedLanguage;
  languages: SupportedLanguage[];
  title: string;
  description: string;
  startDate: string;
  endDate: string;
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
  languages: SupportedLanguage[];
  korean: string;
  transliteration: string;
  translation: string;
  culturalNote: string;
  category: PhraseCategory;
};

type PopupDraft = {
  id: string;
  language: SupportedLanguage;
  languages: SupportedLanguage[];
  title: string;
  brand: string;
  window: string;
  status: PopupStatus;
  location: string;
  posterUrl: string;
  heroImageUrl: string;
  tagsInput: string;
  description: string;
  highlightsInput: string;
  detailsInput: string;
  reservationUrl: string;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function createEmptyTrendDraft(): TrendDraft {
  return {
    id: "",
    language: "en",
    languages: ["en"],
    authorId: AUTHOR_PROFILES[0]?.id ?? "",
    title: "",
    summary: "",
    details: "",
    neighborhood: "",
    tagsInput: "",
    intensity: "highlight",
    publishedAt: todayIso(),
    imageUrl: "",
    contentInput: ""
  };
}

function trendToDraft(report: TrendReport): TrendDraft {
  return {
    id: report.id,
    language: report.language ?? "en",
    languages: [report.language ?? "en"],
    authorId: report.authorId ?? AUTHOR_PROFILES[0]?.id ?? "",
    title: report.title,
    summary: report.summary,
    details: report.details,
    neighborhood: report.neighborhood,
    tagsInput: report.tags.join(", "),
    intensity: report.intensity,
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
    authorId: draft.authorId,
    title: draft.title.trim(),
    summary: draft.summary.trim(),
    details: draft.details.trim(),
    neighborhood: draft.neighborhood.trim(),
    tags,
    intensity: draft.intensity,
    publishedAt: draft.publishedAt || todayIso(),
    imageUrl: draft.imageUrl.trim(),
    content
  };
}

function createEmptyEventDraft(): EventDraft {
  return {
    id: "",
    language: "en",
    languages: ["en"],
    title: "",
    description: "",
    startDate: todayIso(),
    endDate: todayIso(),
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
    languages: [event.language ?? "en"],
    title: event.title,
    description: event.description,
    startDate: event.startDate ?? todayIso(),
    endDate: event.endDate ?? event.startDate ?? todayIso(),
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
    startDate: draft.startDate,
    endDate: draft.endDate || draft.startDate,
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
    languages: ["en"],
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
    languages: [phrase.language ?? "en"],
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

function createEmptyPopupDraft(): PopupDraft {
  return {
    id: "",
    language: "en",
    languages: ["en"],
    title: "",
    brand: "",
    window: "2024.06.01 - 06.30",
    status: "now",
    location: "",
    posterUrl: "",
    heroImageUrl: "",
    tagsInput: "",
    description: "",
    highlightsInput: "",
    detailsInput: "",
    reservationUrl: ""
  };
}

function popupToDraft(popup: PopupEvent): PopupDraft {
  return {
    id: popup.id,
    language: popup.language ?? "en",
    languages: [popup.language ?? "en"],
    title: popup.title,
    brand: popup.brand,
    window: popup.window,
    status: popup.status,
    location: popup.location,
    posterUrl: popup.posterUrl,
    heroImageUrl: popup.heroImageUrl,
    tagsInput: popup.tags.join(", "),
    description: popup.description,
    highlightsInput: popup.highlights.join("\n"),
    detailsInput: popup.details.join("\n\n"),
    reservationUrl: popup.reservationUrl ?? ""
  };
}

function draftToPopup(draft: PopupDraft): PopupEvent {
  const tags = draft.tagsInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const highlights = draft.highlightsInput
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const details = draft.detailsInput
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return {
    id: draft.id.trim(),
    language: draft.language,
    title: draft.title.trim(),
    brand: draft.brand.trim(),
    window: draft.window.trim(),
    status: draft.status,
    location: draft.location.trim(),
    posterUrl: draft.posterUrl.trim(),
    heroImageUrl: draft.heroImageUrl.trim() || draft.posterUrl.trim(),
    tags,
    description: draft.description.trim(),
    highlights,
    details,
    reservationUrl: draft.reservationUrl.trim() || undefined
  };
}

function resolveTargetLanguages(
  selected: SupportedLanguage[] | undefined,
  baseLanguage: SupportedLanguage
) {
  const fallback = selected && selected.length > 0 ? selected : [baseLanguage];
  return Array.from(new Set(fallback));
}

function normalizeBaseId(id: string, baseLanguage: SupportedLanguage) {
  const prefix = `${baseLanguage}-`;
  if (id.startsWith(prefix)) {
    return id.slice(prefix.length);
  }
  return id;
}

function buildLocalizedId(
  baseId: string,
  baseLanguage: SupportedLanguage,
  language: SupportedLanguage,
  totalLanguages: number
) {
  if (totalLanguages <= 1) {
    return baseId.trim();
  }
  const canonical = normalizeBaseId(baseId.trim(), baseLanguage) || baseId.trim();
  return `${language}-${canonical}`;
}

function syncLanguagesOnSourceChange(
  languages: SupportedLanguage[] | undefined,
  nextLanguage: SupportedLanguage
) {
  if (!languages || languages.length === 0) return [nextLanguage];
  if (languages.length === 1) return [nextLanguage];
  return languages;
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>("trends");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<AdminMessage | null>(null);

  const [trends, setTrends] = useState<TrendReport[]>([]);
  const [events, setEvents] = useState<KCultureEvent[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [popups, setPopups] = useState<PopupEvent[]>([]);

  const [trendDraft, setTrendDraft] = useState<TrendDraft>(createEmptyTrendDraft);
  const [eventDraft, setEventDraft] = useState<EventDraft>(createEmptyEventDraft);
  const [phraseDraft, setPhraseDraft] = useState<PhraseDraft>(createEmptyPhraseDraft);
  const [popupDraft, setPopupDraft] = useState<PopupDraft>(createEmptyPopupDraft);
  const [trendDraftCache, setTrendDraftCache] = useState<TrendDraft | null>(null);
  const [eventDraftCache, setEventDraftCache] = useState<EventDraft | null>(null);
  const [phraseDraftCache, setPhraseDraftCache] = useState<PhraseDraft | null>(null);
  const [popupDraftCache, setPopupDraftCache] = useState<PopupDraft | null>(null);

  const [selectedTrendId, setSelectedTrendId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);
  const [selectedPopupId, setSelectedPopupId] = useState<string | null>(null);

  const [savingTrend, setSavingTrend] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [savingPhrase, setSavingPhrase] = useState(false);
  const [savingPopup, setSavingPopup] = useState(false);
  const [hasTrendDraft, setHasTrendDraft] = useState(false);
  const [hasEventDraft, setHasEventDraft] = useState(false);
  const [hasPhraseDraft, setHasPhraseDraft] = useState(false);
  const [hasPopupDraft, setHasPopupDraft] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadContent() {
      setLoading(true);
      try {
        const [trendData, eventData, phraseData, popupData] = await Promise.all([
          fetchTrendReports(),
          fetchEvents(),
          fetchPhrases(),
          fetchPopups()
        ]);

        if (!isMounted) return;
        setTrends(trendData);
        setEvents(eventData);
        setPhrases(phraseData);
        setPopups(popupData);

        const storedTrendDraft = readDraft<TrendDraft>(DRAFT_STORAGE_KEYS.trend);
        if (storedTrendDraft) {
          setTrendDraftCache(storedTrendDraft);
          setHasTrendDraft(true);
          setSelectedTrendId(DRAFT_LIST_ID.trend);
          setTrendDraft(storedTrendDraft);
        } else {
          setTrendDraftCache(null);
          setHasTrendDraft(false);
          if (trendData.length > 0) {
            setSelectedTrendId(trendData[0].id);
            setTrendDraft(trendToDraft(trendData[0]));
          }
        }

        const storedEventDraft = readDraft<EventDraft>(DRAFT_STORAGE_KEYS.event);
        if (storedEventDraft) {
          setEventDraftCache(storedEventDraft);
          setHasEventDraft(true);
          setSelectedEventId(DRAFT_LIST_ID.event);
          setEventDraft(storedEventDraft);
        } else {
          setEventDraftCache(null);
          setHasEventDraft(false);
          if (eventData.length > 0) {
            setSelectedEventId(eventData[0].id);
            setEventDraft(eventToDraft(eventData[0]));
          }
        }

        const storedPhraseDraft = readDraft<PhraseDraft>(DRAFT_STORAGE_KEYS.phrase);
        if (storedPhraseDraft) {
          setPhraseDraftCache(storedPhraseDraft);
          setHasPhraseDraft(true);
          setSelectedPhraseId(DRAFT_LIST_ID.phrase);
          setPhraseDraft(storedPhraseDraft);
        } else {
          setPhraseDraftCache(null);
          setHasPhraseDraft(false);
          if (phraseData.length > 0) {
            setSelectedPhraseId(phraseData[0].id);
            setPhraseDraft(phraseToDraft(phraseData[0]));
          }
        }

        const storedPopupDraft = readDraft<PopupDraft>(DRAFT_STORAGE_KEYS.popup);
        if (storedPopupDraft) {
          setPopupDraftCache(storedPopupDraft);
          setHasPopupDraft(true);
          setSelectedPopupId(DRAFT_LIST_ID.popup);
          setPopupDraft(storedPopupDraft);
        } else {
          setPopupDraftCache(null);
          setHasPopupDraft(false);
          if (popupData.length > 0) {
            setSelectedPopupId(popupData[0].id);
            setPopupDraft(popupToDraft(popupData[0]));
          }
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
    const targetLanguages = resolveTargetLanguages(trendDraft.languages, payload.language);
    setSavingTrend(true);
    try {
      const localizedPayloads: TrendReport[] = [];
      for (const lang of targetLanguages) {
        const localizedId = buildLocalizedId(
          payload.id,
          payload.language,
          lang,
          targetLanguages.length
        );
        if (lang === payload.language) {
          localizedPayloads.push({ ...payload, id: localizedId, language: lang });
          continue;
        }
        const translated = await translateTrendReportContent(payload, lang);
        localizedPayloads.push({
          ...(translated ?? { ...payload }),
          id: localizedId,
          language: lang
        });
      }

      let createdCount = 0;
      let updatedCount = 0;
      for (const entry of localizedPayloads) {
        const exists = trends.some((item) => item.id === entry.id);
        if (exists) {
          await updateTrendReport(entry);
          updatedCount += 1;
        } else {
          await addTrendReport(entry);
          createdCount += 1;
        }
      }

      const refreshed = await fetchTrendReports();
      setTrends(refreshed);
      const preferredId =
        localizedPayloads.find((entry) => entry.language === payload.language)?.id ??
        localizedPayloads[0]?.id;
      const saved = refreshed.find((item) => item.id === preferredId);
      if (saved) {
        setTrendDraft({
          ...trendToDraft(saved),
          languages: targetLanguages
        });
        setSelectedTrendId(saved.id);
      }
      const successText =
        createdCount && updatedCount
          ? `새 ${createdCount}개 언어 + ${updatedCount}개 언어 콘텐츠를 반영했습니다.`
          : createdCount
          ? `${createdCount}개 언어 버전이 추가되었습니다.`
          : `${updatedCount}개 언어 버전이 업데이트되었습니다.`;
      setMessage({ tone: "success", text: successText });
      clearDraft(DRAFT_STORAGE_KEYS.trend);
      setTrendDraftCache(null);
      setHasTrendDraft(false);
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
    const isDraft = id === DRAFT_LIST_ID.trend;
    const confirmed = window.confirm(
      isDraft ? "임시저장을 삭제하시겠어요?" : "정말로 이 트렌드를 삭제하시겠어요?"
    );
    if (!confirmed) return;
    setSavingTrend(true);
    try {
      if (isDraft) {
        clearDraft(DRAFT_STORAGE_KEYS.trend);
        setTrendDraftCache(null);
        setHasTrendDraft(false);
        const fallback = trends[0];
        if (fallback) {
          setSelectedTrendId(fallback.id);
          setTrendDraft(trendToDraft(fallback));
        } else {
          setSelectedTrendId(null);
          setTrendDraft(createEmptyTrendDraft());
        }
        setMessage({ tone: "success", text: "임시저장을 삭제했습니다." });
        return;
      }
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
  const handleTrendDraftSave = () => {
    writeDraft(DRAFT_STORAGE_KEYS.trend, trendDraft);
    setTrendDraftCache(trendDraft);
    setHasTrendDraft(true);
    setSelectedTrendId(DRAFT_LIST_ID.trend);
    setMessage({ tone: "info", text: "트렌드 임시저장을 완료했습니다." });
  };

  const handleEventSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessage();
    const payload = draftToEvent(eventDraft);
    if (!payload.id) {
      setMessage({ tone: "error", text: "ID는 반드시 입력해야 합니다." });
      return;
    }
    const targetLanguages = resolveTargetLanguages(eventDraft.languages, payload.language);
    setSavingEvent(true);
    try {
      const localizedPayloads: KCultureEvent[] = [];
      for (const lang of targetLanguages) {
        const localizedId = buildLocalizedId(
          payload.id,
          payload.language,
          lang,
          targetLanguages.length
        );
        if (lang === payload.language) {
          localizedPayloads.push({ ...payload, id: localizedId, language: lang });
          continue;
        }
        const translated = await translateEventContent(payload, lang);
        localizedPayloads.push({
          ...(translated ?? { ...payload }),
          id: localizedId,
          language: lang
        });
      }

      let createdCount = 0;
      let updatedCount = 0;
      for (const entry of localizedPayloads) {
        const exists = events.some((item) => item.id === entry.id);
        if (exists) {
          await updateEvent(entry);
          updatedCount += 1;
        } else {
          await addEvent(entry);
          createdCount += 1;
        }
      }

      const refreshed = await fetchEvents();
      setEvents(refreshed);
      const preferredId =
        localizedPayloads.find((entry) => entry.language === payload.language)?.id ??
        localizedPayloads[0]?.id;
      const saved = refreshed.find((item) => item.id === preferredId);
      if (saved) {
        setEventDraft({
          ...eventToDraft(saved),
          languages: targetLanguages
        });
        setSelectedEventId(saved.id);
      }
      const successText =
        createdCount && updatedCount
          ? `새 ${createdCount}개 언어 + ${updatedCount}개 언어 이벤트를 반영했습니다.`
          : createdCount
          ? `${createdCount}개 언어 버전이 추가되었습니다.`
          : `${updatedCount}개 언어 버전이 업데이트되었습니다.`;
      setMessage({ tone: "success", text: successText });
      clearDraft(DRAFT_STORAGE_KEYS.event);
      setEventDraftCache(null);
      setHasEventDraft(false);
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
    const isDraft = id === DRAFT_LIST_ID.event;
    const confirmed = window.confirm(
      isDraft ? "이벤트 임시저장을 삭제하시겠어요?" : "정말로 이 이벤트를 삭제하시겠어요?"
    );
    if (!confirmed) return;
    setSavingEvent(true);
    try {
      if (isDraft) {
        clearDraft(DRAFT_STORAGE_KEYS.event);
        setEventDraftCache(null);
        setHasEventDraft(false);
        const fallback = events[0];
        if (fallback) {
          setSelectedEventId(fallback.id);
          setEventDraft(eventToDraft(fallback));
        } else {
          setSelectedEventId(null);
          setEventDraft(createEmptyEventDraft());
        }
        setMessage({ tone: "success", text: "이벤트 임시저장을 삭제했습니다." });
        return;
      }
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
  const handleEventDraftSave = () => {
    writeDraft(DRAFT_STORAGE_KEYS.event, eventDraft);
    setEventDraftCache(eventDraft);
    setHasEventDraft(true);
    setSelectedEventId(DRAFT_LIST_ID.event);
    setMessage({ tone: "info", text: "이벤트 임시저장을 완료했습니다." });
  };

  const handlePhraseSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessage();
    const payload = draftToPhrase(phraseDraft);
    if (!payload.id) {
      setMessage({ tone: "error", text: "ID는 반드시 입력해야 합니다." });
      return;
    }
    const targetLanguages = resolveTargetLanguages(phraseDraft.languages, payload.language);
    setSavingPhrase(true);
    try {
      const localizedPayloads: Phrase[] = [];
      for (const lang of targetLanguages) {
        const localizedId = buildLocalizedId(
          payload.id,
          payload.language,
          lang,
          targetLanguages.length
        );
        if (lang === payload.language) {
          localizedPayloads.push({ ...payload, id: localizedId, language: lang });
          continue;
        }
        const translated = await translatePhraseContent(payload, lang);
        localizedPayloads.push({
          ...(translated ?? { ...payload }),
          id: localizedId,
          language: lang
        });
      }

      let createdCount = 0;
      let updatedCount = 0;
      for (const entry of localizedPayloads) {
        const exists = phrases.some((item) => item.id === entry.id);
        if (exists) {
          await updatePhrase(entry);
          updatedCount += 1;
        } else {
          await addPhrase(entry);
          createdCount += 1;
        }
      }

      const refreshed = await fetchPhrases();
      setPhrases(refreshed);
      const preferredId =
        localizedPayloads.find((entry) => entry.language === payload.language)?.id ??
        localizedPayloads[0]?.id;
      const saved = refreshed.find((item) => item.id === preferredId);
      if (saved) {
        setPhraseDraft({
          ...phraseToDraft(saved),
          languages: targetLanguages
        });
        setSelectedPhraseId(saved.id);
      }
      const successText =
        createdCount && updatedCount
          ? `새 ${createdCount}개 언어 + ${updatedCount}개 언어 표현을 반영했습니다.`
          : createdCount
          ? `${createdCount}개 언어 버전이 추가되었습니다.`
          : `${updatedCount}개 언어 버전이 업데이트되었습니다.`;
      setMessage({ tone: "success", text: successText });
      clearDraft(DRAFT_STORAGE_KEYS.phrase);
      setPhraseDraftCache(null);
      setHasPhraseDraft(false);
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
    const isDraft = id === DRAFT_LIST_ID.phrase;
    const confirmed = window.confirm(
      isDraft ? "표현 임시저장을 삭제하시겠어요?" : "정말로 이 표현을 삭제하시겠어요?"
    );
    if (!confirmed) return;
    setSavingPhrase(true);
    try {
      if (isDraft) {
        clearDraft(DRAFT_STORAGE_KEYS.phrase);
        setPhraseDraftCache(null);
        setHasPhraseDraft(false);
        const fallback = phrases[0];
        if (fallback) {
          setSelectedPhraseId(fallback.id);
          setPhraseDraft(phraseToDraft(fallback));
        } else {
          setSelectedPhraseId(null);
          setPhraseDraft(createEmptyPhraseDraft());
        }
        setMessage({ tone: "success", text: "표현 임시저장을 삭제했습니다." });
        return;
      }
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
  const handlePhraseDraftSave = () => {
    writeDraft(DRAFT_STORAGE_KEYS.phrase, phraseDraft);
    setPhraseDraftCache(phraseDraft);
    setHasPhraseDraft(true);
    setSelectedPhraseId(DRAFT_LIST_ID.phrase);
    setMessage({ tone: "info", text: "표현 임시저장을 완료했습니다." });
  };

  const handlePopupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessage();
    const payload = draftToPopup(popupDraft);
    if (!payload.id) {
      setMessage({ tone: "error", text: "ID는 반드시 입력해야 합니다." });
      return;
    }
    const targetLanguages = resolveTargetLanguages(popupDraft.languages, payload.language);
    setSavingPopup(true);
    try {
      const localizedPayloads: PopupEvent[] = [];
      for (const lang of targetLanguages) {
        const localizedId = buildLocalizedId(
          payload.id,
          payload.language,
          lang,
          targetLanguages.length
        );
        if (lang === payload.language) {
          localizedPayloads.push({ ...payload, id: localizedId, language: lang });
          continue;
        }
        const translated = await translatePopupContent(payload, lang);
        localizedPayloads.push({
          ...(translated ?? { ...payload }),
          id: localizedId,
          language: lang
        });
      }

      let createdCount = 0;
      let updatedCount = 0;
      for (const entry of localizedPayloads) {
        const exists = popups.some((item) => item.id === entry.id);
        if (exists) {
          await updatePopup(entry);
          updatedCount += 1;
        } else {
          await addPopup(entry);
          createdCount += 1;
        }
      }

      const refreshed = await fetchPopups();
      setPopups(refreshed);
      const preferredId =
        localizedPayloads.find((entry) => entry.language === payload.language)?.id ??
        localizedPayloads[0]?.id;
      const saved = refreshed.find((item) => item.id === preferredId);
      if (saved) {
        setPopupDraft({
          ...popupToDraft(saved),
          languages: targetLanguages
        });
        setSelectedPopupId(saved.id);
      }
      const successText =
        createdCount && updatedCount
          ? `새 ${createdCount}개 언어 + ${updatedCount}개 언어 팝업을 반영했습니다.`
          : createdCount
          ? `${createdCount}개 언어 버전이 추가되었습니다.`
          : `${updatedCount}개 언어 버전이 업데이트되었습니다.`;
      setMessage({ tone: "success", text: successText });
      clearDraft(DRAFT_STORAGE_KEYS.popup);
      setPopupDraftCache(null);
      setHasPopupDraft(false);
    } catch (error) {
      console.error("Failed to save popup", error);
      setMessage({
        tone: "error",
        text: `팝업을 저장할 수 없습니다. 입력 값을 확인해주세요.\n${describeError(error)}`
      });
    } finally {
      setSavingPopup(false);
    }
  };

  const handlePopupDelete = async (id: string) => {
    resetMessage();
    if (!id) {
      setMessage({ tone: "error", text: "삭제할 항목을 먼저 선택해주세요." });
      return;
    }
    const isDraft = id === DRAFT_LIST_ID.popup;
    const confirmed = window.confirm(
      isDraft ? "팝업 임시저장을 삭제하시겠어요?" : "정말로 이 팝업을 삭제하시겠어요?"
    );
    if (!confirmed) return;
    setSavingPopup(true);
    try {
      if (isDraft) {
        clearDraft(DRAFT_STORAGE_KEYS.popup);
        setPopupDraftCache(null);
        setHasPopupDraft(false);
        const fallback = popups[0];
        if (fallback) {
          setSelectedPopupId(fallback.id);
          setPopupDraft(popupToDraft(fallback));
        } else {
          setSelectedPopupId(null);
          setPopupDraft(createEmptyPopupDraft());
        }
        setMessage({ tone: "success", text: "팝업 임시저장을 삭제했습니다." });
        return;
      }
      const updated = await deletePopup(id);
      setPopups(updated);
      if (updated.length > 0) {
        setSelectedPopupId(updated[0].id);
        setPopupDraft(popupToDraft(updated[0]));
      } else {
        setSelectedPopupId(null);
        setPopupDraft(createEmptyPopupDraft());
      }
      setMessage({ tone: "success", text: "팝업을 삭제했습니다." });
    } catch (error) {
      console.error("Failed to delete popup", error);
      setMessage({
        tone: "error",
        text: `팝업을 삭제할 수 없습니다. 다시 시도해주세요.\n${describeError(error)}`
      });
    } finally {
      setSavingPopup(false);
    }
  };
  const handlePopupDraftSave = () => {
    writeDraft(DRAFT_STORAGE_KEYS.popup, popupDraft);
    setPopupDraftCache(popupDraft);
    setHasPopupDraft(true);
    setSelectedPopupId(DRAFT_LIST_ID.popup);
    setMessage({ tone: "info", text: "팝업 임시저장을 완료했습니다." });
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

  type LanguageMultiSelectProps = {
    label: string;
    helper?: string;
    value: SupportedLanguage[];
    onChange: (next: SupportedLanguage[]) => void;
  };

  const LanguageMultiSelect = ({ label, helper, value, onChange }: LanguageMultiSelectProps) => {
    const toggleLanguage = (lang: SupportedLanguage) => {
      onChange(
        value.includes(lang)
          ? value.filter((item) => item !== lang)
          : [...value, lang]
      );
    };

    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-dancheongNavy">{label}</span>
        <div className="flex flex-wrap gap-2">
          {LANG_OPTIONS.map((lang) => {
            const isActive = value.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  isActive
                    ? "bg-hanBlue text-white shadow"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-hanBlue hover:text-hanBlue"
                }`}
              >
                {getLanguageLabel(lang)}
              </button>
            );
          })}
        </div>
        {helper && <p className="text-xs text-slate-500">{helper}</p>}
      </div>
    );
  };

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
          {hasTrendDraft && trendDraftCache && (
            renderListButton(
              DRAFT_LIST_ID.trend,
              `[임시저장] ${trendDraftCache.title || trendDraftCache.id || "제목 미정"}`,
              selectedTrendId === DRAFT_LIST_ID.trend,
              () => {
                setSelectedTrendId(DRAFT_LIST_ID.trend);
                setTrendDraft(trendDraftCache);
              }
            )
          )}
          {trends.map((report) => {
            const author = AUTHOR_PROFILES.find((profile) => profile.id === report.authorId);
            const label = `[${getLanguageLabel(report.language ?? "en")}] ${report.title}${
              author ? ` · ${author.name}` : ""
            }`;
            return renderListButton(report.id, label, selectedTrendId === report.id, () => {
              setSelectedTrendId(report.id);
              setTrendDraft(trendToDraft(report));
            });
          })}
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

        <div className="grid gap-4 md:grid-cols-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            언어
            <select
              value={trendDraft.language}
              onChange={(e) =>
                setTrendDraft((prev) => ({
                  ...prev,
                  language: e.target.value as SupportedLanguage,
                  languages: syncLanguagesOnSourceChange(
                    prev.languages,
                    e.target.value as SupportedLanguage
                  )
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
            저자
            <select
              value={trendDraft.authorId}
              onChange={(e) =>
                setTrendDraft((prev) => ({
                  ...prev,
                  authorId: e.target.value
                }))
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              {AUTHOR_PROFILES.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} — {author.title}
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

        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
          <LanguageMultiSelect
            label="노출 언어 (복수 선택)"
            helper="작성 언어를 기준으로 자동 번역하여 각 언어 버전이 생성됩니다. 선택하지 않으면 작성 언어만 발행됩니다."
            value={trendDraft.languages}
            onChange={(languages) => setTrendDraft((prev) => ({ ...prev, languages }))}
          />
          <p className="mt-2 text-xs text-slate-500">
            다국어 발행 시 ID 앞에 언어 코드가 자동으로 붙습니다. 예){" "}
            <span className="font-semibold text-dancheongNavy">
              {trendDraft.languages.length > 1
                ? `fr-${normalizeBaseId(trendDraft.id || "trend-id", trendDraft.language)}`
                : trendDraft.id || "trend-id"}
            </span>
          </p>
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
            onClick={handleTrendDraftSave}
            className="rounded-full border border-hanBlue/40 px-5 py-2 text-sm font-semibold text-hanBlue hover:bg-hanBlue/10"
          >
            임시저장
          </button>
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
          {hasEventDraft && eventDraftCache && (
            renderListButton(
              DRAFT_LIST_ID.event,
              `[임시저장] ${eventDraftCache.title || eventDraftCache.id || "제목 미정"}`,
              selectedEventId === DRAFT_LIST_ID.event,
              () => {
                setSelectedEventId(DRAFT_LIST_ID.event);
                setEventDraft(eventDraftCache);
              }
            )
          )}
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
                  language: e.target.value as SupportedLanguage,
                  languages: syncLanguagesOnSourceChange(
                    prev.languages,
                    e.target.value as SupportedLanguage
                  )
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
              <option value="atelier">Atelier</option>
              <option value="theatre">Theatre</option>
              <option value="festival">Festival</option>
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
          <LanguageMultiSelect
            label="노출 언어 (복수 선택)"
            helper="선택한 언어마다 이벤트 설명이 자동 번역되어 게시됩니다."
            value={eventDraft.languages}
            onChange={(languages) => setEventDraft((prev) => ({ ...prev, languages }))}
          />
          <p className="mt-2 text-xs text-slate-500">
            여러 언어를 발행하면 ID는{" "}
            <strong>{`lang-${normalizeBaseId(eventDraft.id || "event-id", eventDraft.language)}`}</strong>{" "}
            형식으로 저장됩니다.
          </p>
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
            시작 날짜
            <input
              type="date"
              value={eventDraft.startDate}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, startDate: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            종료 날짜
            <input
              type="date"
              value={eventDraft.endDate}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, endDate: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
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
            onClick={handleEventDraftSave}
            className="rounded-full border border-hanBlue/40 px-5 py-2 text-sm font-semibold text-hanBlue hover:bg-hanBlue/10"
          >
            임시저장
          </button>
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
          {hasPhraseDraft && phraseDraftCache && (
            renderListButton(
              DRAFT_LIST_ID.phrase,
              `[임시저장] ${phraseDraftCache.korean || phraseDraftCache.id || "표현 미정"}`,
              selectedPhraseId === DRAFT_LIST_ID.phrase,
              () => {
                setSelectedPhraseId(DRAFT_LIST_ID.phrase);
                setPhraseDraft(phraseDraftCache);
              }
            )
          )}
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
                  language: e.target.value as SupportedLanguage,
                  languages: syncLanguagesOnSourceChange(
                    prev.languages,
                    e.target.value as SupportedLanguage
                  )
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

        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
          <LanguageMultiSelect
            label="노출 언어 (복수 선택)"
            helper="선택한 언어마다 번역과 문화 노트가 자동 생성됩니다."
            value={phraseDraft.languages}
            onChange={(languages) => setPhraseDraft((prev) => ({ ...prev, languages }))}
          />
          <p className="mt-2 text-xs text-slate-500">
            예) <strong>{`ja-${normalizeBaseId(phraseDraft.id || "phrase-id", phraseDraft.language)}`}</strong>
          </p>
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
            onClick={handlePhraseDraftSave}
            className="rounded-full border border-hanBlue/40 px-5 py-2 text-sm font-semibold text-hanBlue hover:bg-hanBlue/10"
          >
            임시저장
          </button>
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

  const renderPopupsSection = () => (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dancheongNavy">팝업 레이더</h3>
          <button
            type="button"
            onClick={() => {
              setSelectedPopupId(null);
              setPopupDraft(createEmptyPopupDraft());
            }}
            className="text-sm font-semibold text-hanBlue hover:underline"
          >
            새 팝업 작성
          </button>
        </div>
        <div className="space-y-2">
          {hasPopupDraft && popupDraftCache && (
            renderListButton(
              DRAFT_LIST_ID.popup,
              `[임시저장] ${popupDraftCache.title || popupDraftCache.id || "팝업 미정"}`,
              selectedPopupId === DRAFT_LIST_ID.popup,
              () => {
                setSelectedPopupId(DRAFT_LIST_ID.popup);
                setPopupDraft(popupDraftCache);
              }
            )
          )}
          {popups.map((popup) =>
            renderListButton(
              popup.id,
              `[${getLanguageLabel(popup.language ?? "fr")}] ${popup.title} · ${popup.brand}`,
              selectedPopupId === popup.id,
              () => {
                setSelectedPopupId(popup.id);
                setPopupDraft(popupToDraft(popup));
              }
            )
          )}
          {popups.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              아직 등록된 팝업이 없습니다. 오른쪽 양식을 채워 추가하세요.
            </p>
          )}
        </div>
      </aside>

      <form onSubmit={handlePopupSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-dancheongNavy">
            {selectedPopupId ? "팝업 수정" : "새 팝업 등록"}
          </h3>
          {selectedPopupId && (
            <button
              type="button"
              onClick={() => handlePopupDelete(selectedPopupId)}
              className="text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              삭제
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            언어
            <select
              value={popupDraft.language}
              onChange={(e) =>
                setPopupDraft((prev) => ({
                  ...prev,
                  language: e.target.value as SupportedLanguage,
                  languages: syncLanguagesOnSourceChange(
                    prev.languages,
                    e.target.value as SupportedLanguage
                  )
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
              value={popupDraft.id}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, id: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            상태
            <select
              value={popupDraft.status}
              onChange={(e) =>
                setPopupDraft((prev) => ({ ...prev, status: e.target.value as PopupStatus }))
              }
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="now">진행 중</option>
              <option value="soon">오픈 예정</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            기간
            <input
              type="text"
              value={popupDraft.window}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, window: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="2024.06.01 - 06.24 • 11:00-20:00"
              required
            />
          </label>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
          <LanguageMultiSelect
            label="노출 언어 (복수 선택)"
            helper="팝업 카드와 상세 페이지가 선택한 언어로 자동 생성됩니다."
            value={popupDraft.languages}
            onChange={(languages) => setPopupDraft((prev) => ({ ...prev, languages }))}
          />
          <p className="mt-2 text-xs text-slate-500">
            예) <strong>{`en-${normalizeBaseId(popupDraft.id || "popup-id", popupDraft.language)}`}</strong>
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            제목
            <input
              type="text"
              value={popupDraft.title}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, title: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            브랜드 / 기획자
            <input
              type="text"
              value={popupDraft.brand}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, brand: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          위치
          <input
            type="text"
            value={popupDraft.location}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, location: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            포스터 이미지 URL
            <input
              type="url"
              value={popupDraft.posterUrl}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, posterUrl: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            상세 헤더 이미지 URL (선택)
            <input
              type="url"
              value={popupDraft.heroImageUrl}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, heroImageUrl: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          태그 (쉼표로 구분)
          <input
            type="text"
            value={popupDraft.tagsInput}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, tagsInput: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          소개 문장
          <textarea
            value={popupDraft.description}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, description: e.target.value }))}
            className="h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            하이라이트 (줄바꿈으로 구분)
            <textarea
              value={popupDraft.highlightsInput}
              onChange={(e) =>
                setPopupDraft((prev) => ({ ...prev, highlightsInput: e.target.value }))
              }
              className="h-32 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            상세 설명
            <textarea
              value={popupDraft.detailsInput}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, detailsInput: e.target.value }))}
              className="h-32 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          예약 링크 (선택)
          <input
            type="url"
            value={popupDraft.reservationUrl}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, reservationUrl: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handlePopupDraftSave}
            className="rounded-full border border-hanBlue/40 px-5 py-2 text-sm font-semibold text-hanBlue hover:bg-hanBlue/10"
          >
            임시저장
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedPopupId(null);
              setPopupDraft(createEmptyPopupDraft());
            }}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            새로 작성
          </button>
          <button
            type="submit"
            disabled={savingPopup}
            className="rounded-full bg-hanBlue px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-dancheongNavy disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {savingPopup ? "저장 중..." : "저장하기"}
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
            <h1 className="text-3xl font-bold text-dancheongNavy">Studio koraid 관리자</h1>
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

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              다국어 자동 번역
            </p>
            <p className="mt-2 text-lg font-semibold text-dancheongNavy">
              {STUDIO_AUTO_TRANSLATE_ENABLED ? "활성화됨" : "비활성화됨"}
            </p>
            <p className="text-sm text-slate-500">
              작성 언어 한 번으로 {LANG_OPTIONS.map((lang) => getLanguageLabel(lang)).join(", ")}{" "}
              페이지에 동시 노출됩니다.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              현재 콘텐츠
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-dancheongNavy">{trends.length}</p>
                <p className="text-xs text-slate-500">트렌드</p>
              </div>
              <div>
                <p className="text-lg font-bold text-dancheongNavy">{events.length}</p>
                <p className="text-xs text-slate-500">이벤트</p>
              </div>
              <div>
                <p className="text-lg font-bold text-dancheongNavy">{phrases.length}</p>
                <p className="text-xs text-slate-500">프레이즈</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              ID 안내
            </p>
            <p className="mt-2 text-sm text-slate-600">
              다국어 발행 시 ID는 <strong>언어코드-id</strong> 형태로 저장됩니다. 예){" "}
              <span className="font-semibold text-dancheongNavy">fr-seongsu-guide</span>
            </p>
          </div>
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
          <button
            type="button"
            onClick={() => {
              setActiveSection("popups");
              resetMessage();
            }}
            className={sectionTabClass("popups")}
          >
            팝업 레이더
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
          {activeSection === "popups" && renderPopupsSection()}
        </>
      )}
    </main>
  );
}
