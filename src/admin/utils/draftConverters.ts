import { AUTHOR_PROFILES } from "../../data/authors";
import type { TrendReport, TrendIntensity } from "../../data/trends";
import type { KCultureEvent, EventCategory } from "../../data/events";
import type { Phrase, PhraseCategory } from "../../data/phrases";
import type { PopupEvent, PopupStatus } from "../../data/popups";
import type {
  TrendDraft,
  EventDraft,
  PhraseDraft,
  PopupDraft
} from "../types";
import { todayIso } from "./dateUtils";
import { hasHtmlContent, joinHtmlArray, parseContentToArray } from "./htmlContentUtils";

/**
 * Trend Draft 변환 함수
 */
export function createEmptyTrendDraft(): TrendDraft {
  return {
    id: "",
    language: "en",
    languages: ["en"],
    hidden: false,
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

export function trendToDraft(report: TrendReport): TrendDraft {
  const contentInput = joinHtmlArray(report.content);

  return {
    id: report.id,
    language: report.language ?? "en",
    languages: [report.language ?? "en"],
    hidden: report.hidden ?? false,
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

export function draftToTrend(draft: TrendDraft): TrendReport {
  const tags = draft.tagsInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  let content = parseContentToArray(draft.contentInput);
  // 빈 배열 방지
  if (content.length === 0) {
    content = [draft.contentInput || ""];
  }

  return {
    id: draft.id.trim(),
    language: draft.language,
    hidden: draft.hidden ?? false,
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

/**
 * Event Draft 변환 함수
 */
export function createEmptyEventDraft(): EventDraft {
  return {
    id: "",
    language: "en",
    languages: ["en"],
    hidden: false,
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

export function eventToDraft(event: KCultureEvent): EventDraft {
  const longDescriptionInput = joinHtmlArray(event.longDescription);

  return {
    id: event.id,
    language: event.language ?? "en",
    languages: [event.language ?? "en"],
    hidden: event.hidden ?? false,
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

export function draftToEvent(draft: EventDraft): KCultureEvent {
  let longDescription = parseContentToArray(draft.longDescriptionInput);
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
    hidden: draft.hidden ?? false,
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

/**
 * Phrase Draft 변환 함수
 */
export function createEmptyPhraseDraft(): PhraseDraft {
  return {
    id: "",
    language: "en",
    languages: ["en"],
    hidden: false,
    korean: "",
    transliteration: "",
    translation: "",
    culturalNote: "",
    category: "food"
  };
}

export function phraseToDraft(phrase: Phrase): PhraseDraft {
  return {
    id: phrase.id,
    language: phrase.language ?? "en",
    languages: [phrase.language ?? "en"],
    hidden: phrase.hidden ?? false,
    korean: phrase.korean,
    transliteration: phrase.transliteration,
    translation: phrase.translation,
    culturalNote: phrase.culturalNote,
    category: phrase.category
  };
}

export function draftToPhrase(draft: PhraseDraft): Phrase {
  return {
    id: draft.id.trim(),
    language: draft.language,
    hidden: draft.hidden ?? false,
    korean: draft.korean.trim(),
    transliteration: draft.transliteration.trim(),
    translation: draft.translation.trim(),
    culturalNote: draft.culturalNote.trim(),
    category: draft.category
  };
}

/**
 * Popup Draft 변환 함수
 */
export function createEmptyPopupDraft(): PopupDraft {
  return {
    id: "",
    language: "en",
    languages: ["en"],
    hidden: false,
    title: "",
    brand: "",
    window: "2024.06.01 - 06.30",
    status: "now",
    startDate: "",
    endDate: "",
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

export function popupToDraft(popup: PopupEvent): PopupDraft {
  const detailsInput = joinHtmlArray(popup.details);

  return {
    id: popup.id,
    language: popup.language ?? "en",
    languages: [popup.language ?? "en"],
    hidden: popup.hidden ?? false,
    title: popup.title,
    brand: popup.brand,
    window: popup.window,
    status: popup.status,
    startDate: popup.startDate ?? "",
    endDate: popup.endDate ?? "",
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

export function draftToPopup(draft: PopupDraft): PopupEvent {
  const tags = draft.tagsInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const highlights = draft.highlightsInput
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  let details = parseContentToArray(draft.detailsInput);
  // 빈 배열 방지
  if (details.length === 0) {
    details = [draft.detailsInput || ""];
  }

  const trimmedReservationUrl = draft.reservationUrl.trim();

  return {
    id: draft.id.trim(),
    language: draft.language,
    hidden: draft.hidden ?? false,
    title: draft.title.trim(),
    brand: draft.brand.trim(),
    window: draft.window.trim(),
    status: draft.status,
    ...(draft.startDate ? { startDate: draft.startDate } : {}),
    ...(draft.endDate ? { endDate: draft.endDate } : {}),
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
