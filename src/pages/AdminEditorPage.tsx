import { FormEvent, useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FirebaseError } from "firebase/app";
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
  getEventById,
  getPhraseById,
  getPopupById,
  getTrendReportById,
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
import TextEditor from "../components/TextEditor";

type ContentType = "trends" | "events" | "phrases" | "popups";

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
  // content가 HTML 요소를 포함하는지 확인
  const hasHtml = report.content.some(item => item.includes("<img") || item.includes("<p>") || item.includes("<h2>"));
  let contentInput: string;
  
  if (hasHtml) {
    // HTML인 경우 그대로 합치기 (각 요소는 이미 완전한 HTML)
    contentInput = report.content.join("");
  } else {
    // 텍스트인 경우 줄바꿈으로 합치기
    contentInput = report.content.join("\n\n");
  }

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
    contentInput: contentInput || ""
  };
}

function draftToTrend(draft: TrendDraft): TrendReport {
  const tags = draft.tagsInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  // HTML 콘텐츠가 있으면 그대로 사용, 없으면 기존 방식대로 텍스트를 문단으로 분리
  let content: string[];
  if (draft.contentInput.includes("<img") || draft.contentInput.includes("<p>") || draft.contentInput.includes("<h2>")) {
    // HTML 콘텐츠인 경우, 각 요소를 분리
    try {
      if (typeof document !== "undefined") {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = draft.contentInput;
        const elements = Array.from(tempDiv.children);
        content = elements.map(el => el.outerHTML).filter(Boolean);
        // 빈 배열이면 원본을 그대로 사용
        if (content.length === 0) {
          content = [draft.contentInput];
        }
      } else {
        // 서버 사이드에서는 원본을 그대로 사용
        content = [draft.contentInput];
      }
    } catch (error) {
      console.warn("HTML 파싱 실패, 원본 사용:", error);
      content = [draft.contentInput];
    }
  } else {
    // 일반 텍스트인 경우 기존 방식대로 처리
    content = draft.contentInput
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  // 빈 배열 방지
  if (content.length === 0) {
    content = [draft.contentInput || ""];
  }

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
  // longDescription이 HTML 요소를 포함하는지 확인
  const hasHtml = event.longDescription.some(item => item.includes("<img") || item.includes("<p>") || item.includes("<h2>"));
  const longDescriptionInput = hasHtml 
    ? event.longDescription.join("") // HTML인 경우 그대로 합치기
    : event.longDescription.join("\n\n"); // 텍스트인 경우 줄바꿈으로 합치기

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
    longDescriptionInput: longDescriptionInput || "",
    tipsInput: event.tips.join("\n")
  };
}

function draftToEvent(draft: EventDraft): KCultureEvent {
  // HTML 콘텐츠가 있으면 그대로 사용, 없으면 기존 방식대로 텍스트를 문단으로 분리
  let longDescription: string[];
  if (draft.longDescriptionInput.includes("<img") || draft.longDescriptionInput.includes("<p>") || draft.longDescriptionInput.includes("<h2>")) {
    // HTML 콘텐츠인 경우, 각 요소를 분리
    try {
      if (typeof document !== "undefined") {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = draft.longDescriptionInput;
        const elements = Array.from(tempDiv.children);
        longDescription = elements.map(el => el.outerHTML).filter(Boolean);
        // 빈 배열이면 원본을 그대로 사용
        if (longDescription.length === 0) {
          longDescription = [draft.longDescriptionInput];
        }
      } else {
        // 서버 사이드에서는 원본을 그대로 사용
        longDescription = [draft.longDescriptionInput];
      }
    } catch (error) {
      console.warn("HTML 파싱 실패, 원본 사용:", error);
      longDescription = [draft.longDescriptionInput];
    }
  } else {
    // 일반 텍스트인 경우 기존 방식대로 처리
    longDescription = draft.longDescriptionInput
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  // 빈 배열 방지
  if (longDescription.length === 0) {
    longDescription = [draft.longDescriptionInput || ""];
  }

  const tips = draft.tipsInput
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const trimmedBookingUrl = draft.bookingUrl.trim();
  
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
    ...(trimmedBookingUrl ? { bookingUrl: trimmedBookingUrl } : {}),
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
  // details가 HTML 요소를 포함하는지 확인
  const hasHtml = popup.details.some(item => item.includes("<img") || item.includes("<p>") || item.includes("<h2>"));
  const detailsInput = hasHtml 
    ? popup.details.join("") // HTML인 경우 그대로 합치기
    : popup.details.join("\n\n"); // 텍스트인 경우 줄바꿈으로 합치기

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
    detailsInput: detailsInput || "",
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
  
  // HTML 콘텐츠가 있으면 그대로 사용, 없으면 기존 방식대로 텍스트를 문단으로 분리
  let details: string[];
  if (draft.detailsInput.includes("<img") || draft.detailsInput.includes("<p>") || draft.detailsInput.includes("<h2>")) {
    // HTML 콘텐츠인 경우, 각 요소를 분리
    try {
      if (typeof document !== "undefined") {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = draft.detailsInput;
        const elements = Array.from(tempDiv.children);
        details = elements.map(el => el.outerHTML).filter(Boolean);
        // 빈 배열이면 원본을 그대로 사용
        if (details.length === 0) {
          details = [draft.detailsInput];
        }
      } else {
        // 서버 사이드에서는 원본을 그대로 사용
        details = [draft.detailsInput];
      }
    } catch (error) {
      console.warn("HTML 파싱 실패, 원본 사용:", error);
      details = [draft.detailsInput];
    }
  } else {
    // 일반 텍스트인 경우 기존 방식대로 처리
    details = draft.detailsInput
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  // 빈 배열 방지
  if (details.length === 0) {
    details = [draft.detailsInput || ""];
  }

  const trimmedReservationUrl = draft.reservationUrl.trim();
  
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
    ...(trimmedReservationUrl ? { reservationUrl: trimmedReservationUrl } : {})
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

export default function AdminEditorPage() {
  const { type, id } = useParams<{ type: ContentType; id?: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<AdminMessage | null>(null);
  const [saving, setSaving] = useState(false);

  // State for each content type
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
      if (!file) {
        console.log("이미지 파일 선택 해제");
        return null;
      }
      const blobUrl = URL.createObjectURL(file);
      console.log("이미지 파일 선택됨:", file.name, "Blob URL:", blobUrl);
      return blobUrl;
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
      if (!file) {
        console.log("이미지 파일 선택 해제");
        return null;
      }
      const blobUrl = URL.createObjectURL(file);
      console.log("이미지 파일 선택됨:", file.name, "Blob URL:", blobUrl);
      return blobUrl;
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
      if (!file) {
        console.log("포스터 이미지 파일 선택 해제");
        return null;
      }
      const blobUrl = URL.createObjectURL(file);
      console.log("포스터 이미지 파일 선택됨:", file.name, "Blob URL:", blobUrl);
      return blobUrl;
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
      if (!file) {
        console.log("히어로 이미지 파일 선택 해제");
        return null;
      }
      const blobUrl = URL.createObjectURL(file);
      console.log("히어로 이미지 파일 선택됨:", file.name, "Blob URL:", blobUrl);
      return blobUrl;
    });
  }, []);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      revokePreviewUrl(trendImagePreview);
      revokePreviewUrl(eventImagePreview);
      revokePreviewUrl(popupPosterPreview);
      revokePreviewUrl(popupHeroPreview);
    };
  }, [trendImagePreview, eventImagePreview, popupPosterPreview, popupHeroPreview]);

  // Load content based on type and id
  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }
    if (!type || !["trends", "events", "phrases", "popups"].includes(type)) {
      navigate("/admin");
      return;
    }

    async function loadContent() {
      setLoading(true);
      try {
        if (type === "trends") {
          if (id) {
            const report = await getTrendReportById(id);
            if (report) {
              setTrendDraft(trendToDraft(report));
            }
          } else {
            const storedDraft = readDraft<TrendDraft>(DRAFT_STORAGE_KEYS.trend);
            if (storedDraft) {
              setTrendDraft(storedDraft);
            } else {
              setTrendDraft(createEmptyTrendDraft());
            }
          }
        } else if (type === "events") {
          if (id) {
            const event = await getEventById(id);
            if (event) {
              setEventDraft(eventToDraft(event));
            }
          } else {
            const storedDraft = readDraft<EventDraft>(DRAFT_STORAGE_KEYS.event);
            if (storedDraft) {
              setEventDraft(storedDraft);
            } else {
              setEventDraft(createEmptyEventDraft());
            }
          }
        } else if (type === "phrases") {
          if (id) {
            const phrase = await getPhraseById(id);
            if (phrase) {
              setPhraseDraft(phraseToDraft(phrase));
            }
          } else {
            const storedDraft = readDraft<PhraseDraft>(DRAFT_STORAGE_KEYS.phrase);
            if (storedDraft) {
              setPhraseDraft(storedDraft);
            } else {
              setPhraseDraft(createEmptyPhraseDraft());
            }
          }
        } else if (type === "popups") {
          if (id) {
            const popup = await getPopupById(id);
            if (popup) {
              setPopupDraft(popupToDraft(popup));
            }
          } else {
            const storedDraft = readDraft<PopupDraft>(DRAFT_STORAGE_KEYS.popup);
            if (storedDraft) {
              setPopupDraft(storedDraft);
            } else {
              setPopupDraft(createEmptyPopupDraft());
            }
          }
        }
      } catch (error) {
        console.error("Failed to load content", error);
        setMessage({
          tone: "error",
          text: "콘텐츠를 불러오는 중 오류가 발생했습니다."
        });
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [isAdmin, navigate, type, id]);

  // Handlers for each content type
  const handleTrendSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // ID 검증
      if (!trendDraft.id || !trendDraft.id.trim()) {
        throw new Error("ID는 필수입니다. 영문 소문자와 하이픈을 사용하여 입력해주세요.");
      }

      const finalImageUrl = trendImageFile
        ? (await uploadAdminAsset(trendImageFile, { collection: "trends", entityId: trendDraft.id.trim(), assetType: "image" })).downloadUrl
        : trendDraft.imageUrl.trim();

      if (!finalImageUrl) {
        throw new Error("이미지 URL 또는 이미지 파일이 필요합니다.");
      }

      const baseTrend = draftToTrend({ ...trendDraft, imageUrl: finalImageUrl });
      console.log("저장할 트렌드 데이터:", baseTrend);
      console.log("content 배열:", baseTrend.content);
      
      // content가 비어있으면 에러
      if (!baseTrend.content || baseTrend.content.length === 0) {
        throw new Error("본문 내용이 필요합니다.");
      }
      
      const targetLanguages = resolveTargetLanguages(trendDraft.languages, trendDraft.language);

      const payloads: TrendReport[] = [];
      for (const lang of targetLanguages) {
        const localizedId = buildLocalizedId(baseTrend.id, baseTrend.language, lang, targetLanguages.length);
        if (lang === baseTrend.language) {
          payloads.push({ ...baseTrend, id: localizedId, language: lang, imageUrl: finalImageUrl });
        } else if (STUDIO_AUTO_TRANSLATE_ENABLED) {
          const translated = await translateTrendReportContent(baseTrend, lang);
          payloads.push({
            ...(translated ?? baseTrend),
            id: localizedId,
            language: lang,
            imageUrl: finalImageUrl
          });
        } else {
          payloads.push({ ...baseTrend, id: localizedId, language: lang, imageUrl: finalImageUrl });
        }
      }

      if (id) {
        // Update existing
        await Promise.all(payloads.map((payload) => updateTrendReport(payload)));
        setMessage({ tone: "success", text: "트렌드가 성공적으로 수정되었습니다." });
      } else {
        // Create new
        await Promise.all(payloads.map((payload) => addTrendReport(payload)));
        setMessage({ tone: "success", text: "트렌드가 성공적으로 등록되었습니다." });
        clearDraft(DRAFT_STORAGE_KEYS.trend);
        navigate("/admin");
      }

      clearTrendImageSelection();
    } catch (error) {
      console.error("Failed to save trend", error);
      const errorMessage = error instanceof FirebaseError ? error.message : "트렌드 저장 중 오류가 발생했습니다.";
      setMessage({ tone: "error", text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handleEventSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // ID 검증
      if (!eventDraft.id || !eventDraft.id.trim()) {
        throw new Error("ID는 필수입니다. 영문 소문자와 하이픈을 사용하여 입력해주세요.");
      }

      const finalImageUrl = eventImageFile
        ? (await uploadAdminAsset(eventImageFile, { collection: "events", entityId: eventDraft.id.trim(), assetType: "image" })).downloadUrl
        : eventDraft.imageUrl.trim();

      if (!finalImageUrl) {
        throw new Error("이미지 URL 또는 이미지 파일이 필요합니다.");
      }

      const baseEvent = draftToEvent({ ...eventDraft, imageUrl: finalImageUrl });
      console.log("저장할 이벤트 데이터:", baseEvent);
      console.log("longDescription 배열:", baseEvent.longDescription);
      
      // longDescription이 비어있으면 에러
      if (!baseEvent.longDescription || baseEvent.longDescription.length === 0) {
        throw new Error("상세 설명이 필요합니다.");
      }
      
      const targetLanguages = resolveTargetLanguages(eventDraft.languages, eventDraft.language);

      const payloads: KCultureEvent[] = [];
      for (const lang of targetLanguages) {
        const localizedId = buildLocalizedId(baseEvent.id, baseEvent.language, lang, targetLanguages.length);
        if (lang === baseEvent.language) {
          payloads.push({ ...baseEvent, id: localizedId, language: lang, imageUrl: finalImageUrl });
        } else if (STUDIO_AUTO_TRANSLATE_ENABLED) {
          const translated = await translateEventContent(baseEvent, lang);
          payloads.push({
            ...(translated ?? baseEvent),
            id: localizedId,
            language: lang,
            imageUrl: finalImageUrl
          });
        } else {
          payloads.push({ ...baseEvent, id: localizedId, language: lang, imageUrl: finalImageUrl });
        }
      }

      if (id) {
        await Promise.all(payloads.map((payload) => updateEvent(payload)));
        setMessage({ tone: "success", text: "이벤트가 성공적으로 수정되었습니다." });
      } else {
        await Promise.all(payloads.map((payload) => addEvent(payload)));
        setMessage({ tone: "success", text: "이벤트가 성공적으로 등록되었습니다." });
        clearDraft(DRAFT_STORAGE_KEYS.event);
        navigate("/admin");
      }

      clearEventImageSelection();
    } catch (error) {
      console.error("Failed to save event", error);
      const errorMessage = error instanceof FirebaseError ? error.message : "이벤트 저장 중 오류가 발생했습니다.";
      setMessage({ tone: "error", text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handlePhraseSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // ID 검증
      if (!phraseDraft.id || !phraseDraft.id.trim()) {
        throw new Error("ID는 필수입니다. 영문 소문자와 하이픈을 사용하여 입력해주세요.");
      }

      const basePhrase = draftToPhrase(phraseDraft);
      const targetLanguages = resolveTargetLanguages(phraseDraft.languages, phraseDraft.language);

      const payloads: Phrase[] = [];
      for (const lang of targetLanguages) {
        const localizedId = buildLocalizedId(basePhrase.id, basePhrase.language, lang, targetLanguages.length);
        if (lang === basePhrase.language) {
          payloads.push({ ...basePhrase, id: localizedId, language: lang });
        } else if (STUDIO_AUTO_TRANSLATE_ENABLED) {
          const translated = await translatePhraseContent(basePhrase, lang);
          payloads.push({
            ...(translated ?? basePhrase),
            id: localizedId,
            language: lang
          });
        } else {
          payloads.push({ ...basePhrase, id: localizedId, language: lang });
        }
      }

      if (id) {
        await Promise.all(payloads.map((payload) => updatePhrase(payload)));
        setMessage({ tone: "success", text: "표현이 성공적으로 수정되었습니다." });
      } else {
        await Promise.all(payloads.map((payload) => addPhrase(payload)));
        setMessage({ tone: "success", text: "표현이 성공적으로 등록되었습니다." });
        clearDraft(DRAFT_STORAGE_KEYS.phrase);
        navigate("/admin");
      }
    } catch (error) {
      console.error("Failed to save phrase", error);
      const errorMessage = error instanceof FirebaseError ? error.message : "표현 저장 중 오류가 발생했습니다.";
      setMessage({ tone: "error", text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handlePopupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // ID 검증
      if (!popupDraft.id || !popupDraft.id.trim()) {
        throw new Error("ID는 필수입니다. 영문 소문자와 하이픈을 사용하여 입력해주세요.");
      }

      const finalPosterUrl = popupPosterFile
        ? (await uploadAdminAsset(popupPosterFile, { collection: "popups", entityId: popupDraft.id.trim(), assetType: "poster" })).downloadUrl
        : popupDraft.posterUrl.trim();

      const finalHeroUrl = popupHeroFile
        ? (await uploadAdminAsset(popupHeroFile, { collection: "popups", entityId: popupDraft.id.trim(), assetType: "hero" })).downloadUrl
        : popupDraft.heroImageUrl.trim() || finalPosterUrl;

      if (!finalPosterUrl) {
        throw new Error("포스터 이미지 URL 또는 이미지 파일이 필요합니다.");
      }

      const basePopup = draftToPopup({ ...popupDraft, posterUrl: finalPosterUrl, heroImageUrl: finalHeroUrl });
      console.log("저장할 팝업 데이터:", basePopup);
      console.log("details 배열:", basePopup.details);
      
      // details가 비어있으면 에러
      if (!basePopup.details || basePopup.details.length === 0) {
        throw new Error("상세 설명이 필요합니다.");
      }
      
      const targetLanguages = resolveTargetLanguages(popupDraft.languages, popupDraft.language);

      const payloads: PopupEvent[] = [];
      for (const lang of targetLanguages) {
        const localizedId = buildLocalizedId(basePopup.id, basePopup.language, lang, targetLanguages.length);
        if (lang === basePopup.language) {
          payloads.push({ ...basePopup, id: localizedId, language: lang, posterUrl: finalPosterUrl, heroImageUrl: finalHeroUrl });
        } else if (STUDIO_AUTO_TRANSLATE_ENABLED) {
          const translated = await translatePopupContent(basePopup, lang);
          payloads.push({
            ...(translated ?? basePopup),
            id: localizedId,
            language: lang,
            posterUrl: finalPosterUrl,
            heroImageUrl: finalHeroUrl
          });
        } else {
          payloads.push({ ...basePopup, id: localizedId, language: lang, posterUrl: finalPosterUrl, heroImageUrl: finalHeroUrl });
        }
      }

      if (id) {
        await Promise.all(payloads.map((payload) => updatePopup(payload)));
        setMessage({ tone: "success", text: "팝업이 성공적으로 수정되었습니다." });
      } else {
        await Promise.all(payloads.map((payload) => addPopup(payload)));
        setMessage({ tone: "success", text: "팝업이 성공적으로 등록되었습니다." });
        clearDraft(DRAFT_STORAGE_KEYS.popup);
        navigate("/admin");
      }

      clearPopupPosterSelection();
      clearPopupHeroSelection();
    } catch (error) {
      console.error("Failed to save popup", error);
      const errorMessage = error instanceof FirebaseError ? error.message : "팝업 저장 중 오류가 발생했습니다.";
      setMessage({ tone: "error", text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handleTrendDelete = async () => {
    if (!id || !confirm("정말로 이 트렌드를 삭제하시겠습니까?")) return;
    try {
      await deleteTrendReport(id);
      setMessage({ tone: "success", text: "트렌드가 삭제되었습니다." });
      navigate("/admin");
    } catch (error) {
      console.error("Failed to delete trend", error);
      setMessage({ tone: "error", text: "트렌드 삭제 중 오류가 발생했습니다." });
    }
  };

  const handleEventDelete = async () => {
    if (!id || !confirm("정말로 이 이벤트를 삭제하시겠습니까?")) return;
    try {
      await deleteEvent(id);
      setMessage({ tone: "success", text: "이벤트가 삭제되었습니다." });
      navigate("/admin");
    } catch (error) {
      console.error("Failed to delete event", error);
      setMessage({ tone: "error", text: "이벤트 삭제 중 오류가 발생했습니다." });
    }
  };

  const handlePhraseDelete = async () => {
    if (!id || !confirm("정말로 이 표현을 삭제하시겠습니까?")) return;
    try {
      await deletePhrase(id);
      setMessage({ tone: "success", text: "표현이 삭제되었습니다." });
      navigate("/admin");
    } catch (error) {
      console.error("Failed to delete phrase", error);
      setMessage({ tone: "error", text: "표현 삭제 중 오류가 발생했습니다." });
    }
  };

  const handlePopupDelete = async () => {
    if (!id || !confirm("정말로 이 팝업을 삭제하시겠습니까?")) return;
    try {
      await deletePopup(id);
      setMessage({ tone: "success", text: "팝업이 삭제되었습니다." });
      navigate("/admin");
    } catch (error) {
      console.error("Failed to delete popup", error);
      setMessage({ tone: "error", text: "팝업 삭제 중 오류가 발생했습니다." });
    }
  };

  const handleTrendDraftSave = () => {
    writeDraft(DRAFT_STORAGE_KEYS.trend, trendDraft);
    setMessage({ tone: "info", text: "임시저장되었습니다." });
  };

  const handleEventDraftSave = () => {
    writeDraft(DRAFT_STORAGE_KEYS.event, eventDraft);
    setMessage({ tone: "info", text: "임시저장되었습니다." });
  };

  const handlePhraseDraftSave = () => {
    writeDraft(DRAFT_STORAGE_KEYS.phrase, phraseDraft);
    setMessage({ tone: "info", text: "임시저장되었습니다." });
  };

  const handlePopupDraftSave = () => {
    writeDraft(DRAFT_STORAGE_KEYS.popup, popupDraft);
    setMessage({ tone: "info", text: "임시저장되었습니다." });
  };

  if (!type) {
    return null;
  }

  const renderTrendForm = () => {
    const currentTrendImagePreview = trendImagePreview ?? trendDraft.imageUrl;
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.error("이미지 로드 실패:", e.currentTarget.src);
      // 이미지 로드 실패 시 빈 이미지로 대체
      e.currentTarget.style.display = "none";
    };

    return (
      <form onSubmit={handleTrendSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-dancheongNavy">
            {id ? "트렌드 수정" : "새 트렌드 등록"}
          </h3>
          {id && (
            <button
              type="button"
              onClick={handleTrendDelete}
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
                onError={handleImageError}
                onLoad={() => console.log("이미지 로드 성공:", currentTrendImagePreview)}
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

        <TextEditor
          label="본문 문단 (줄바꿈으로 구분)"
          value={trendDraft.contentInput}
          onChange={(value) => setTrendDraft((prev) => ({ ...prev, contentInput: value }))}
          placeholder="문단마다 한 줄을 비워두면 가독성이 올라갑니다. 이미지를 드래그 앤 드롭하여 삽입할 수 있습니다."
          imageUploadOptions={{
            collection: "trends",
            entityId: trendDraft.id || undefined
          }}
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
              setTrendDraft(createEmptyTrendDraft());
              clearTrendImageSelection();
            }}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            새로 작성
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-hanBlue px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-dancheongNavy disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    );
  };

  const renderEventForm = () => {
    const currentEventImagePreview = eventImagePreview ?? eventDraft.imageUrl;
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.error("이미지 로드 실패:", e.currentTarget.src);
      e.currentTarget.style.display = "none";
    };

    return (
      <form onSubmit={handleEventSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-dancheongNavy">
            {id ? "이벤트 수정" : "새 이벤트 등록"}
          </h3>
          {id && (
            <button
              type="button"
              onClick={handleEventDelete}
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
                onError={handleImageError}
                onLoad={() => console.log("이미지 로드 성공:", currentEventImagePreview)}
              />
            </div>
            <p className="text-xs text-slate-500">
              저장 시 이 이미지 URL이 모든 언어 버전에 함께 적용됩니다.
            </p>
          </div>
        )}

        <TextEditor
          label="상세 설명 (줄바꿈으로 문단 구분)"
          value={eventDraft.longDescriptionInput}
          onChange={(value) => setEventDraft((prev) => ({ ...prev, longDescriptionInput: value }))}
          placeholder="이미지를 드래그 앤 드롭하여 삽입할 수 있습니다."
          imageUploadOptions={{
            collection: "events",
            entityId: eventDraft.id || undefined
          }}
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
              setEventDraft(createEmptyEventDraft());
              clearEventImageSelection();
            }}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            새로 작성
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-hanBlue px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-dancheongNavy disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    );
  };

  const renderPhraseForm = () => {
    return (
      <form onSubmit={handlePhraseSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-dancheongNavy">
            {id ? "표현 수정" : "새 표현 등록"}
          </h3>
          {id && (
            <button
              type="button"
              onClick={handlePhraseDelete}
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
              setPhraseDraft(createEmptyPhraseDraft());
            }}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            새로 작성
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-hanBlue px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-dancheongNavy disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    );
  };

  const renderPopupForm = () => {
    const currentPopupPosterPreview = popupPosterPreview ?? popupDraft.posterUrl;
    const currentPopupHeroPreview = popupHeroPreview ?? popupDraft.heroImageUrl;
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.error("이미지 로드 실패:", e.currentTarget.src);
      e.currentTarget.style.display = "none";
    };

    return (
      <form onSubmit={handlePopupSubmit} className="space-y-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-dancheongNavy">
            {id ? "팝업 수정" : "새 팝업 등록"}
          </h3>
          {id && (
            <button
              type="button"
              onClick={handlePopupDelete}
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
            브랜드
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
              <span>포스터 이미지 파일 업로드 (선택)</span>
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
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
              히어로 이미지 URL (선택)
              <input
                type="url"
                value={popupDraft.heroImageUrl}
                onChange={(e) => setPopupDraft((prev) => ({ ...prev, heroImageUrl: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="https://"
              />
            </label>
            <div className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
              <span>히어로 이미지 파일 업로드 (선택)</span>
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
            </div>
          </div>
        </div>

        {(currentPopupPosterPreview || currentPopupHeroPreview) && (
          <div className="space-y-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              이미지 미리보기
            </span>
            {currentPopupPosterPreview && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600">포스터</p>
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <img
                    src={currentPopupPosterPreview}
                    alt="Poster preview"
                    className="h-56 w-full object-cover"
                    onError={handleImageError}
                    onLoad={() => console.log("이미지 로드 성공:", currentPopupPosterPreview)}
                  />
                </div>
              </div>
            )}
            {currentPopupHeroPreview && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600">히어로</p>
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <img
                    src={currentPopupHeroPreview}
                    alt="Hero preview"
                    className="h-56 w-full object-cover"
                    onError={handleImageError}
                    onLoad={() => console.log("이미지 로드 성공:", currentPopupHeroPreview)}
                  />
                </div>
              </div>
            )}
            <p className="text-xs text-slate-500">저장 시 모든 언어 버전에 동일한 이미지가 반영됩니다.</p>
          </div>
        )}

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          설명
          <textarea
            value={popupDraft.description}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, description: e.target.value }))}
            className="h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          태그 (쉼표로 구분)
          <input
            type="text"
            value={popupDraft.tagsInput}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, tagsInput: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="limited edition, collaboration"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          하이라이트 (줄바꿈으로 구분)
          <textarea
            value={popupDraft.highlightsInput}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, highlightsInput: e.target.value }))}
            className="h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </label>

        <TextEditor
          label="상세 설명 (줄바꿈으로 문단 구분)"
          value={popupDraft.detailsInput}
          onChange={(value) => setPopupDraft((prev) => ({ ...prev, detailsInput: value }))}
          placeholder="이미지를 드래그 앤 드롭하여 삽입할 수 있습니다."
          imageUploadOptions={{
            collection: "popups",
            entityId: popupDraft.id || undefined
          }}
        />

        <label className="flex flex-col gap-2 text-sm font-semibold text-dancheongNavy">
          예약 링크 (선택)
          <input
            type="url"
            value={popupDraft.reservationUrl}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, reservationUrl: e.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="https://"
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
            disabled={saving}
            className="rounded-full bg-hanBlue px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-dancheongNavy disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    );
  };

  return (
    <main className="section-container space-y-6">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/admin")}
            className="text-sm font-semibold text-slate-600 hover:text-hanBlue"
          >
            ← 목록으로
          </button>
          <h1 className="text-2xl font-bold text-dancheongNavy">
            {type === "trends" && "트렌드 리포트"}
            {type === "events" && "K-Culture 이벤트"}
            {type === "phrases" && "한국어 프레이즈북"}
            {type === "popups" && "팝업 레이더"}
            {id ? " 수정" : " 작성"}
          </h1>
        </div>
      </header>

      {message && (
        <div
          className={`rounded-xl border p-4 ${
            message.tone === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : message.tone === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          <p className="text-sm font-semibold">{message.text}</p>
        </div>
      )}

      {loading ? (
        <section className="rounded-3xl bg-white p-10 text-center shadow">
          <p className="text-sm text-slate-500">콘텐츠를 불러오는 중입니다...</p>
        </section>
      ) : (
        <>
          {type === "trends" && renderTrendForm()}
          {type === "events" && renderEventForm()}
          {type === "phrases" && renderPhraseForm()}
          {type === "popups" && renderPopupForm()}
        </>
      )}
    </main>
  );
}

