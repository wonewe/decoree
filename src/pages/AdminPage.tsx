import { FirebaseError } from "firebase/app";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
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
import { uploadAdminAsset } from "../services/storageService";

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
  mapQuery: string;
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
  mapQuery: string;
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
    mapQuery: "",
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
    mapQuery: event.mapQuery ?? event.location,
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
    mapQuery: (draft.mapQuery || draft.location).trim(),
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
    mapQuery: "",
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
  mapQuery: popup.mapQuery ?? popup.location,
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
  mapQuery: (draft.mapQuery || draft.location).trim(),
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
  const [searchTerm, setSearchTerm] = useState("");

  const [trendDraft, setTrendDraft] = useState<TrendDraft>(createEmptyTrendDraft);
  const [trendImageFile, setTrendImageFile] = useState<File | null>(null);
  const [trendImagePreview, setTrendImagePreview] = useState<string | null>(null);
  const [eventDraft, setEventDraft] = useState<EventDraft>(createEmptyEventDraft);
  const [eventImageFile, setEventImageFile] = useState<File | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);
  const [phraseDraft, setPhraseDraft] = useState<PhraseDraft>(createEmptyPhraseDraft);
  const [popupDraft, setPopupDraft] = useState<PopupDraft>(createEmptyPopupDraft);
  const [popupPosterFile, setPopupPosterFile] = useState<File | null>(null);
  const [popupPosterPreview, setPopupPosterPreview] = useState<string | null>(null);
  const [popupHeroFile, setPopupHeroFile] = useState<File | null>(null);
  const [popupHeroPreview, setPopupHeroPreview] = useState<string | null>(null);
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
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const matchesSearch = useCallback(
    (...fields: Array<string | undefined | null>) => {
      if (!normalizedSearch) return true;
      return fields
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(normalizedSearch));
    },
    [normalizedSearch]
  );

  const filteredTrends = useMemo(
    () =>
      normalizedSearch
        ? trends.filter((t) =>
            matchesSearch(
              t.title,
              t.id,
              t.summary,
              t.neighborhood,
              t.tags?.join(" ")
            )
          )
        : trends,
    [matchesSearch, normalizedSearch, trends]
  );

  const filteredEvents = useMemo(
    () =>
      normalizedSearch
        ? events.filter((ev) =>
            matchesSearch(ev.title, ev.id, ev.description, ev.location, ev.category)
          )
        : events,
    [events, matchesSearch, normalizedSearch]
  );

  const filteredPhrases = useMemo(
    () =>
      normalizedSearch
        ? phrases.filter((p) =>
            matchesSearch(p.translation, p.id, p.korean, p.transliteration, p.culturalNote)
          )
        : phrases,
    [matchesSearch, normalizedSearch, phrases]
  );

  const filteredPopups = useMemo(
    () =>
      normalizedSearch
        ? popups.filter((p) =>
            matchesSearch(p.title, p.id, p.brand, p.location, p.tags?.join(" "))
          )
        : popups,
    [matchesSearch, normalizedSearch, popups]
  );

  const revokePreviewUrl = (url: string | null) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const clearTrendImageSelection = useCallback(() => {
    setTrendImageFile(null);
    setTrendImagePreview((prev) => {
      revokePreviewUrl(prev);
      return null;
    });
  }, []);

  const applyTrendImageFile = useCallback((file: File | null) => {
    setTrendImageFile(file);
    setTrendImagePreview((prev) => {
      revokePreviewUrl(prev);
      if (!file) return null;
      return URL.createObjectURL(file);
    });
  }, []);

  const clearEventImageSelection = useCallback(() => {
    setEventImageFile(null);
    setEventImagePreview((prev) => {
      revokePreviewUrl(prev);
      return null;
    });
  }, []);

  const applyEventImageFile = useCallback((file: File | null) => {
    setEventImageFile(file);
    setEventImagePreview((prev) => {
      revokePreviewUrl(prev);
      if (!file) return null;
      return URL.createObjectURL(file);
    });
  }, []);

  const clearPopupPosterSelection = useCallback(() => {
    setPopupPosterFile(null);
    setPopupPosterPreview((prev) => {
      revokePreviewUrl(prev);
      return null;
    });
  }, []);

  const applyPopupPosterFile = useCallback((file: File | null) => {
    setPopupPosterFile(file);
    setPopupPosterPreview((prev) => {
      revokePreviewUrl(prev);
      if (!file) return null;
      return URL.createObjectURL(file);
    });
  }, []);

  const clearPopupHeroSelection = useCallback(() => {
    setPopupHeroFile(null);
    setPopupHeroPreview((prev) => {
      revokePreviewUrl(prev);
      return null;
    });
  }, []);

  const applyPopupHeroFile = useCallback((file: File | null) => {
    setPopupHeroFile(file);
    setPopupHeroPreview((prev) => {
      revokePreviewUrl(prev);
      if (!file) return null;
      return URL.createObjectURL(file);
    });
  }, []);

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
          clearTrendImageSelection();
          setTrendDraft(storedTrendDraft);
        } else {
          setTrendDraftCache(null);
          setHasTrendDraft(false);
          if (trendData.length > 0) {
            setSelectedTrendId(trendData[0].id);
            clearTrendImageSelection();
            setTrendDraft(trendToDraft(trendData[0]));
          }
        }

        const storedEventDraft = readDraft<EventDraft>(DRAFT_STORAGE_KEYS.event);
        if (storedEventDraft) {
          setEventDraftCache(storedEventDraft);
          setHasEventDraft(true);
          setSelectedEventId(DRAFT_LIST_ID.event);
          clearEventImageSelection();
          setEventDraft(storedEventDraft);
        } else {
          setEventDraftCache(null);
          setHasEventDraft(false);
          if (eventData.length > 0) {
            setSelectedEventId(eventData[0].id);
            clearEventImageSelection();
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
          clearPopupPosterSelection();
          clearPopupHeroSelection();
          setPopupDraft(storedPopupDraft);
        } else {
          setPopupDraftCache(null);
          setHasPopupDraft(false);
          if (popupData.length > 0) {
            setSelectedPopupId(popupData[0].id);
            clearPopupPosterSelection();
            clearPopupHeroSelection();
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
  }, [
    clearTrendImageSelection,
    clearEventImageSelection,
    clearPopupPosterSelection,
    clearPopupHeroSelection
  ]);

  useEffect(() => {
    return () => {
      revokePreviewUrl(trendImagePreview);
      revokePreviewUrl(eventImagePreview);
      revokePreviewUrl(popupPosterPreview);
      revokePreviewUrl(popupHeroPreview);
    };
  }, [trendImagePreview, eventImagePreview, popupPosterPreview, popupHeroPreview]);

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
    if (!payload.imageUrl && !trendImageFile) {
      setMessage({ tone: "error", text: "대표 이미지 URL을 입력하거나 파일을 업로드해주세요." });
      return;
    }
    const targetLanguages = resolveTargetLanguages(trendDraft.languages, payload.language);
    setSavingTrend(true);
    try {
      let resolvedImageUrl = payload.imageUrl;
      if (trendImageFile) {
        const uploadResult = await uploadAdminAsset(trendImageFile, {
          collection: "trends",
          entityId: payload.id,
          language: payload.language,
          assetType: "cover"
        });
        resolvedImageUrl = uploadResult.downloadUrl;
      }

      if (!resolvedImageUrl) {
        setMessage({
          tone: "error",
          text: "이미지 업로드가 완료되지 않았습니다. 다시 시도해주세요."
        });
        return;
      }

      const basePayload = {
        ...payload,
        imageUrl: resolvedImageUrl
      };

      const localizedPayloads: TrendReport[] = [];
      for (const lang of targetLanguages) {
        const localizedId = buildLocalizedId(
          basePayload.id,
          basePayload.language,
          lang,
          targetLanguages.length
        );
        if (lang === basePayload.language) {
          localizedPayloads.push({ ...basePayload, id: localizedId, language: lang });
          continue;
        }
        const translated = await translateTrendReportContent(basePayload, lang);
        localizedPayloads.push({
          ...(translated ?? { ...basePayload }),
          id: localizedId,
          language: lang,
          imageUrl: resolvedImageUrl
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
        localizedPayloads.find((entry) => entry.language === basePayload.language)?.id ??
        localizedPayloads[0]?.id;
      const saved = refreshed.find((item) => item.id === preferredId);
      if (saved) {
        clearTrendImageSelection();
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
      clearTrendImageSelection();
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
        clearTrendImageSelection();
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
      clearTrendImageSelection();
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
    const draftPayload = draftToEvent(eventDraft);
    if (!draftPayload.id) {
      setMessage({ tone: "error", text: "ID는 반드시 입력해야 합니다." });
      return;
    }
    if (!draftPayload.imageUrl && !eventImageFile) {
      setMessage({ tone: "error", text: "이미지 URL을 입력하거나 파일을 업로드해주세요." });
      return;
    }
    const targetLanguages = resolveTargetLanguages(eventDraft.languages, draftPayload.language);
    setSavingEvent(true);
    try {
      let resolvedImageUrl = draftPayload.imageUrl;
      if (eventImageFile) {
        const uploadResult = await uploadAdminAsset(eventImageFile, {
          collection: "events",
          entityId: draftPayload.id,
          language: draftPayload.language,
          assetType: "cover"
        });
        resolvedImageUrl = uploadResult.downloadUrl;
      }

      if (!resolvedImageUrl) {
        setMessage({
          tone: "error",
          text: "이미지 업로드가 완료되지 않았습니다. 다시 시도해주세요."
        });
        return;
      }

      const payload = {
        ...draftPayload,
        imageUrl: resolvedImageUrl
      };

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
          language: lang,
          imageUrl: resolvedImageUrl
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
        clearEventImageSelection();
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
      clearEventImageSelection();
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
        clearEventImageSelection();
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
      clearEventImageSelection();
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
    if (!payload.posterUrl && !popupPosterFile) {
      setMessage({ tone: "error", text: "포스터 URL을 입력하거나 파일을 업로드해주세요." });
      return;
    }
    const targetLanguages = resolveTargetLanguages(popupDraft.languages, payload.language);
    setSavingPopup(true);
    try {
      let resolvedPosterUrl = payload.posterUrl;
      if (popupPosterFile) {
        const uploadResult = await uploadAdminAsset(popupPosterFile, {
          collection: "popups",
          entityId: payload.id,
          language: payload.language,
          assetType: "poster"
        });
        resolvedPosterUrl = uploadResult.downloadUrl;
      }

      let resolvedHeroUrl = payload.heroImageUrl;
      if (popupHeroFile) {
        const uploadResult = await uploadAdminAsset(popupHeroFile, {
          collection: "popups",
          entityId: payload.id,
          language: payload.language,
          assetType: "hero"
        });
        resolvedHeroUrl = uploadResult.downloadUrl;
      }

      if (!resolvedPosterUrl) {
        setMessage({
          tone: "error",
          text: "이미지 업로드가 완료되지 않았습니다. 다시 시도해주세요."
        });
        return;
      }

      const basePayload: PopupEvent = {
        ...payload,
        posterUrl: resolvedPosterUrl,
        heroImageUrl: resolvedHeroUrl || resolvedPosterUrl
      };

      const localizedPayloads: PopupEvent[] = [];
      for (const lang of targetLanguages) {
        const localizedId = buildLocalizedId(
          basePayload.id,
          basePayload.language,
          lang,
          targetLanguages.length
        );
        if (lang === basePayload.language) {
          localizedPayloads.push({ ...basePayload, id: localizedId, language: lang });
          continue;
        }
        const translated = await translatePopupContent(basePayload, lang);
        localizedPayloads.push({
          ...(translated ?? { ...basePayload }),
          id: localizedId,
          language: lang,
          posterUrl: resolvedPosterUrl,
          heroImageUrl: resolvedHeroUrl || resolvedPosterUrl
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
        clearPopupPosterSelection();
        clearPopupHeroSelection();
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
      clearPopupPosterSelection();
      clearPopupHeroSelection();
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
        clearPopupPosterSelection();
        clearPopupHeroSelection();
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
      clearPopupPosterSelection();
      clearPopupHeroSelection();
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

  type EnhancedTextEditorProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };

  const EnhancedTextEditor = memo(({
    label,
    value,
    onChange,
    placeholder
  }: EnhancedTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [editorHeight, setEditorHeight] = useState(300);
    // initialValueRef는 컴포넌트가 처음 마운트될 때만 설정되도록 useMemo 사용
    const initialValueRef = useRef<string | null>(null);
    const lastSentValueRef = useRef<string>("");
    const changeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMountedRef = useRef(false);

    // 초기값을 한 번만 설정
    if (initialValueRef.current === null) {
      initialValueRef.current = value;
      lastSentValueRef.current = value;
    }

    const syncToParent = useCallback(() => {
      if (!editorRef.current) return;
      const content = editorRef.current.innerText || editorRef.current.textContent || "";
      
      // 마지막으로 보낸 값과 다를 때만 onChange 호출
      if (content !== lastSentValueRef.current) {
        // onChange를 debounce하여 불필요한 리렌더링 방지
        if (changeTimeoutRef.current) {
          clearTimeout(changeTimeoutRef.current);
        }
        changeTimeoutRef.current = setTimeout(() => {
          // lastSentValueRef를 먼저 업데이트하여 상위 컴포넌트 리렌더링 시 문제 방지
          lastSentValueRef.current = content;
          // requestAnimationFrame을 사용하여 다음 프레임에 onChange 호출
          requestAnimationFrame(() => {
            onChange(content);
            changeTimeoutRef.current = null;
          });
        }, 300);
      }
    }, [onChange]);

    const applyFormat = useCallback((command: string, formatValue?: string) => {
      if (!editorRef.current) return;
      editorRef.current.focus();
      document.execCommand(command, false, formatValue);
      syncToParent();
    }, [syncToParent]);

    const handleInput = useCallback(() => {
      syncToParent();
    }, [syncToParent]);

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      if (editorRef.current) {
        document.execCommand("insertText", false, text);
        syncToParent();
      }
    }, [syncToParent]);

    const handleBlur = useCallback(() => {
      syncToParent();
    }, [syncToParent]);

    // 초기값 설정 (마운트 시 한 번만)
    useEffect(() => {
      if (editorRef.current && !isMountedRef.current && initialValueRef.current !== null) {
        editorRef.current.textContent = initialValueRef.current;
        isMountedRef.current = true;
      }
      return () => {
        if (changeTimeoutRef.current) {
          clearTimeout(changeTimeoutRef.current);
        }
      };
    }, []);

    // value prop 변경을 완전히 무시 - 에디터는 uncontrolled로 동작
    // 외부에서 값이 변경되어도 에디터는 절대 업데이트하지 않음

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-dancheongNavy">{label}</label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1">
            <button
              type="button"
              onClick={() => applyFormat("bold")}
              className="rounded px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100"
              title="굵게 (Ctrl+B)"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => applyFormat("italic")}
              className="rounded px-2 py-1 text-xs italic text-slate-700 hover:bg-slate-100"
              title="기울임 (Ctrl+I)"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => applyFormat("underline")}
              className="rounded px-2 py-1 text-xs underline text-slate-700 hover:bg-slate-100"
              title="밑줄 (Ctrl+U)"
            >
              U
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <button
              type="button"
              onClick={() => applyFormat("formatBlock", "h2")}
              className="rounded px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              title="제목"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => applyFormat("formatBlock", "p")}
              className="rounded px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
              title="본문"
            >
              P
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">높이</span>
              <button
                type="button"
                onClick={() => setEditorHeight((prev) => Math.max(200, prev - 40))}
                className="rounded px-1 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
                disabled={editorHeight <= 200}
              >
                −
              </button>
              <span className="w-10 text-center text-xs font-semibold text-dancheongNavy">{editorHeight}px</span>
              <button
                type="button"
                onClick={() => setEditorHeight((prev) => Math.min(600, prev + 40))}
                className="rounded px-1 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
                disabled={editorHeight >= 600}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onBlur={handleBlur}
          style={{
            minHeight: `${editorHeight}px`,
            maxHeight: "600px",
            overflowY: "auto"
          }}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed focus:border-hanBlue focus:outline-none focus:ring-2 focus:ring-hanBlue/20"
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
        <style>{`
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #94a3b8;
            pointer-events: none;
          }
          [contenteditable] h2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0.75rem 0 0.5rem 0;
            color: #1e293b;
          }
          [contenteditable] p {
            margin: 0.5rem 0;
            line-height: 1.6;
          }
        `}</style>
      </div>
    );
  });

  const renderTrendsSection = () => {
    const currentTrendImagePreview = trendImagePreview ?? trendDraft.imageUrl;

    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dancheongNavy">주간 트렌드 목록</h3>
          <button
            type="button"
            onClick={() => {
              setSelectedTrendId(null);
              setTrendDraft(createEmptyTrendDraft());
              clearTrendImageSelection();
            }}
            className="text-sm font-semibold text-hanBlue hover:underline"
          >
            새 트렌드 작성
          </button>
        </div>
        <div className="space-y-2">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="트렌드/이벤트/팝업/회화 검색"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          {hasTrendDraft && trendDraftCache && (
            renderListButton(
              DRAFT_LIST_ID.trend,
              `[임시저장] ${trendDraftCache.title || trendDraftCache.id || "제목 미정"}`,
              selectedTrendId === DRAFT_LIST_ID.trend,
              () => {
                setSelectedTrendId(DRAFT_LIST_ID.trend);
                clearTrendImageSelection();
                setTrendDraft(trendDraftCache);
              }
            )
          )}
          {filteredTrends.map((report) => {
            const author = AUTHOR_PROFILES.find((profile) => profile.id === report.authorId);
            const label = `[${getLanguageLabel(report.language ?? "en")}] ${report.title}${
              author ? ` · ${author.name}` : ""
            }`;
            return renderListButton(report.id, label, selectedTrendId === report.id, () => {
              setSelectedTrendId(report.id);
              clearTrendImageSelection();
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
          <div className="space-y-3">
            <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
              대표 이미지 URL
              <input
                type="url"
                value={trendDraft.imageUrl}
                onChange={(e) => setTrendDraft((prev) => ({ ...prev, imageUrl: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="https://"
              />
            </label>
            <div className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
              <span>이미지 파일 업로드 (선택)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  applyTrendImageFile(file);
                  if (e.target) {
                    e.target.value = "";
                  }
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-hanBlue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {trendImageFile && (
                <div className="flex items-center justify-between gap-2 text-xs font-normal">
                  <span className="truncate text-slate-500">{trendImageFile.name}</span>
                  <button
                    type="button"
                    onClick={() => applyTrendImageFile(null)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    선택 해제
                  </button>
                </div>
              )}
              <p className="text-xs font-normal text-slate-500">
                Studio에 업로드하면 Firebase Storage URL이 자동으로 생성됩니다.
              </p>
            </div>
          </div>
        </div>

        {currentTrendImagePreview && (
          <div className="space-y-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              이미지 미리보기
            </span>
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <img
                src={currentTrendImagePreview}
                alt={trendDraft.title || "Trend image preview"}
                className="h-56 w-full object-cover"
              />
            </div>
            <p className="text-xs text-slate-500">저장 시 모든 언어 버전에 동일한 이미지가 반영됩니다.</p>
          </div>
        )}

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

        <EnhancedTextEditor
          label="본문 문단 (줄바꿈으로 구분)"
          value={trendDraft.contentInput}
          onChange={(value) => setTrendDraft((prev) => ({ ...prev, contentInput: value }))}
          placeholder="문단마다 한 줄을 비워두면 가독성이 올라갑니다."
        />

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
              clearTrendImageSelection();
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
  };

  const renderEventsSection = () => {
    const currentEventImagePreview = eventImagePreview ?? eventDraft.imageUrl;

    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <aside className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dancheongNavy">K-Culture 이벤트</h3>
            <button
              type="button"
              onClick={() => {
                setSelectedEventId(null);
                setEventDraft(createEmptyEventDraft());
                clearEventImageSelection();
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
                  clearEventImageSelection();
                  setEventDraft(eventDraftCache);
                }
              )
            )}
            {filteredEvents.map((event) =>
              renderListButton(
                event.id,
                `[${getLanguageLabel(event.language ?? "fr")}] ${event.title}`,
                selectedEventId === event.id,
                () => {
                  clearEventImageSelection();
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
          <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
            지도 검색어 (지도 퍼스트뷰 개선용)
            <input
              type="text"
              value={eventDraft.mapQuery}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, mapQuery: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="예: 광화문 DDP pop-up, 성수동 무신사 스튜디오"
            />
            <span className="text-xs font-normal text-slate-500">
              지도를 열 때 우선 검색할 키워드입니다. 비워두면 장소 값으로 검색합니다.
            </span>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
                대표 이미지 URL
                <input
                  type="url"
                  value={eventDraft.imageUrl}
                  onChange={(e) => setEventDraft((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="https://"
                />
              </label>
              <div className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
                <span>이미지 파일 업로드 (선택)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    applyEventImageFile(file);
                    if (e.target) {
                      e.target.value = "";
                    }
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-hanBlue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                {eventImageFile && (
                  <div className="flex items-center justify-between gap-2 text-xs font-normal">
                    <span className="truncate text-slate-500">{eventImageFile.name}</span>
                    <button
                      type="button"
                      onClick={() => applyEventImageFile(null)}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      선택 해제
                    </button>
                  </div>
                )}
                <p className="text-xs font-normal text-slate-500">
                  파일을 업로드하면 Firebase Storage에 저장되어 Cloudinary 차단 없이 노출됩니다.
                </p>
              </div>
            </div>
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

          {currentEventImagePreview && (
            <div className="space-y-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                이미지 미리보기
              </span>
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <img
                  src={currentEventImagePreview}
                  alt={eventDraft.title || "Event image preview"}
                  className="h-56 w-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-500">
                저장 시 이 이미지 URL이 모든 언어 버전에 함께 적용됩니다.
              </p>
            </div>
          )}

          <EnhancedTextEditor
            label="상세 설명 (줄바꿈으로 문단 구분)"
            value={eventDraft.longDescriptionInput}
            onChange={(value) => setEventDraft((prev) => ({ ...prev, longDescriptionInput: value }))}
          />

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
                clearEventImageSelection();
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
  };

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
          {filteredPhrases.map((phrase) =>
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

  const renderPopupsSection = () => {
    const currentPopupPosterPreview = popupPosterPreview ?? popupDraft.posterUrl;
    const currentPopupHeroPreview = popupHeroPreview ?? popupDraft.heroImageUrl;

    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dancheongNavy">팝업 레이더</h3>
          <button
            type="button"
            onClick={() => {
              setSelectedPopupId(null);
              setPopupDraft(createEmptyPopupDraft());
              clearPopupPosterSelection();
              clearPopupHeroSelection();
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
                clearPopupPosterSelection();
                clearPopupHeroSelection();
                setPopupDraft(popupDraftCache);
              }
            )
          )}
          {filteredPopups.map((popup) =>
            renderListButton(
              popup.id,
              `[${getLanguageLabel(popup.language ?? "fr")}] ${popup.title} · ${popup.brand}`,
              selectedPopupId === popup.id,
              () => {
                setSelectedPopupId(popup.id);
                  clearPopupPosterSelection();
                  clearPopupHeroSelection();
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

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          지도 검색어 (선택)
          <input
            type="text"
            value={popupDraft.mapQuery}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, mapQuery: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="지도가 잘 나오도록 장소명/주소를 입력하세요"
          />
          <span className="text-xs font-normal text-slate-500">
            입력하지 않으면 위치 필드로 지도 검색을 시도합니다.
          </span>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
              포스터 이미지 URL
              <input
                type="url"
                value={popupDraft.posterUrl}
                onChange={(e) => setPopupDraft((prev) => ({ ...prev, posterUrl: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="https://"
              />
            </label>
            <div className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
              <span>포스터 파일 업로드 (선택)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  applyPopupPosterFile(file);
                  if (e.target) {
                    e.target.value = "";
                  }
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-hanBlue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {popupPosterFile && (
                <div className="flex items-center justify-between gap-2 text-xs font-normal">
                  <span className="truncate text-slate-500">{popupPosterFile.name}</span>
                  <button
                    type="button"
                    onClick={() => applyPopupPosterFile(null)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    선택 해제
                  </button>
                </div>
              )}
              <p className="text-xs font-normal text-slate-500">
                파일을 업로드하면 Firebase Storage URL이 자동으로 설정됩니다.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
              상세 헤더 이미지 URL (선택)
              <input
                type="url"
                value={popupDraft.heroImageUrl}
                onChange={(e) => setPopupDraft((prev) => ({ ...prev, heroImageUrl: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="https://"
              />
            </label>
            <div className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
              <span>헤더 이미지 파일 업로드 (선택)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  applyPopupHeroFile(file);
                  if (e.target) {
                    e.target.value = "";
                  }
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-hanBlue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {popupHeroFile && (
                <div className="flex items-center justify-between gap-2 text-xs font-normal">
                  <span className="truncate text-slate-500">{popupHeroFile.name}</span>
                  <button
                    type="button"
                    onClick={() => applyPopupHeroFile(null)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    선택 해제
                  </button>
                </div>
              )}
              <p className="text-xs font-normal text-slate-500">
                비워두면 포스터 이미지와 동일한 URL이 적용됩니다.
              </p>
            </div>
          </div>
        </div>

        {(currentPopupPosterPreview || currentPopupHeroPreview) && (
          <div className="grid gap-4 md:grid-cols-2">
            {currentPopupPosterPreview && (
              <div className="space-y-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  포스터 미리보기
                </span>
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <img
                    src={currentPopupPosterPreview}
                    alt={popupDraft.title || "Popup poster preview"}
                    className="h-56 w-full object-cover"
                  />
                </div>
              </div>
            )}
            {currentPopupHeroPreview && (
              <div className="space-y-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  헤더 미리보기
                </span>
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <img
                    src={currentPopupHeroPreview}
                    alt={popupDraft.title || "Popup hero preview"}
                    className="h-56 w-full object-cover"
                  />
                </div>
                <p className="text-xs text-slate-500">헤더가 비어 있으면 포스터 이미지가 재사용됩니다.</p>
              </div>
            )}
          </div>
        )}

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
          <EnhancedTextEditor
            label="상세 설명"
            value={popupDraft.detailsInput}
            onChange={(value) => setPopupDraft((prev) => ({ ...prev, detailsInput: value }))}
          />
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
              clearPopupPosterSelection();
              clearPopupHeroSelection();
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
  };

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
