import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FirebaseError } from "firebase/app";
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
import { getLanguageLabel, useI18n } from "../shared/i18n";
import {
  STUDIO_AUTO_TRANSLATE_ENABLED,
  translateEventContent,
  translatePhraseContent,
  translatePopupContent,
  translateTrendReportContent
} from "../services/translation/contentLocalizationService";
import { uploadAdminAsset } from "../services/storageService";
import { generateEventContentWithAI } from "../services/aiContentService";
import TextEditor from "../components/TextEditor";
import type {
  ContentType,
  AdminMessage,
  TrendDraft,
  EventDraft,
  PhraseDraft,
  PopupDraft,
  TrendReport,
  KCultureEvent,
  Phrase,
  PopupEvent,
  TrendIntensity,
  EventCategory,
  PhraseCategory,
  PopupStatus
} from "../admin/types";
import { DRAFT_STORAGE_KEYS, LANG_OPTIONS } from "../admin/constants";
import { readDraft, writeDraft, clearDraft } from "../admin/utils/draftStorage";
import {
  createEmptyTrendDraft,
  trendToDraft,
  draftToTrend,
  createEmptyEventDraft,
  eventToDraft,
  draftToEvent,
  createEmptyPhraseDraft,
  phraseToDraft,
  draftToPhrase,
  createEmptyPopupDraft,
  popupToDraft,
  draftToPopup
} from "../admin/utils/draftConverters";
import { resolveTargetLanguages, buildLocalizedId, syncLanguagesOnSourceChange, normalizeBaseId } from "../admin/utils/languageUtils";
import { LanguageMultiSelect } from "../admin/components/LanguageMultiSelect";
import { useImageUpload } from "../admin/hooks/useImageUpload";

const EDITOR_META: Record<ContentType, { title: string; description: string; helper: string }> = {
  trends: {
    title: "트렌드 리포트",
    description: "동네별 인사이트, 추천 루트, 포스터 이미지를 한 번에 편집합니다.",
    helper: "트렌드 팀"
  },
  events: {
    title: "K-Culture 이벤트",
    description: "KOPIS 수집 데이터와 AI 보조 도구를 활용해 상세 정보를 채웁니다.",
    helper: "이벤트 팀"
  },
  phrases: {
    title: "한국어 프레이즈북",
    description: "카테고리·상황별 표현을 정리하고 자동 번역 범위를 확인하세요.",
    helper: "언어 팀"
  },
  popups: {
    title: "팝업 레이더",
    description: "브랜드 협업 팝업과 장소 정보를 입력하고 태그를 관리합니다.",
    helper: "리서치 팀"
  }
};

export default function AdminEditorPage() {
  const { type, id } = useParams<{ type: ContentType; id?: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { language } = useI18n();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<AdminMessage | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // State for each content type
  const [trendDraft, setTrendDraft] = useState<TrendDraft>(createEmptyTrendDraft);
  const trendImage = useImageUpload(trendDraft.imageUrl);

  const [eventDraft, setEventDraft] = useState<EventDraft>(createEmptyEventDraft);
  const eventImage = useImageUpload(eventDraft.imageUrl);
  const canUseAiGenerator = Boolean(
    eventDraft.title && eventDraft.location && eventDraft.startDate && eventDraft.time && eventDraft.price
  );

  const [phraseDraft, setPhraseDraft] = useState<PhraseDraft>(createEmptyPhraseDraft);

  const [popupDraft, setPopupDraft] = useState<PopupDraft>(createEmptyPopupDraft);
  const popupPoster = useImageUpload(popupDraft.posterUrl);
  const popupHero = useImageUpload(popupDraft.heroImageUrl);

  const handleEventContentGeneration = async () => {
    if (
      !eventDraft.title ||
      !eventDraft.location ||
      !eventDraft.startDate ||
      !eventDraft.time ||
      !eventDraft.price
    ) {
      setMessage({
        tone: "error",
        text: "AI 생성을 위해 제목, 장소, 시작일, 시간, 가격을 모두 입력해 주세요."
      });
      return;
    }

    setAiGenerating(true);
    setMessage(null);
    try {
      const result = await generateEventContentWithAI({
        title: eventDraft.title,
        language: eventDraft.language,
        category: eventDraft.category,
        location: eventDraft.location,
        startDate: eventDraft.startDate,
        endDate: eventDraft.endDate,
        time: eventDraft.time,
        price: eventDraft.price,
        description: eventDraft.description,
        longDescription: eventDraft.longDescriptionInput,
        tips: eventDraft.tipsInput
      });

      setEventDraft((prev) => ({
        ...prev,
        description: result.description || prev.description,
        longDescriptionInput: result.longDescription?.length
          ? result.longDescription.join("\n\n")
          : prev.longDescriptionInput,
        tipsInput: result.tips?.length ? result.tips.join("\n") : prev.tipsInput
      }));

      setMessage({
        tone: "info",
        text: "AI가 상세 내용을 채웠어요. 저장 전에 한 번 더 확인해 주세요."
      });
    } catch (error) {
      console.error("Failed to generate AI content", error);
      setMessage({
        tone: "error",
        text: "AI 내용 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      });
    } finally {
      setAiGenerating(false);
    }
  };

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
            const report = await getTrendReportById(id, { includeHidden: true });
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
            const event = await getEventById(id, { includeHidden: true });
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
            const phrase = await getPhraseById(id, { includeHidden: true });
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
            const popup = await getPopupById(id, language, { includeHidden: true });
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
  }, [isAdmin, navigate, type, id, language]);

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

      const finalImageUrl = trendImage.file
        ? (await uploadAdminAsset(trendImage.file, { collection: "trends", entityId: trendDraft.id.trim(), assetType: "image" })).downloadUrl
        : trendDraft.imageUrl.trim();

      if (!finalImageUrl) {
        throw new Error("이미지 URL 또는 이미지 파일이 필요합니다.");
      }

      const baseTrend = draftToTrend({ ...trendDraft, imageUrl: finalImageUrl });

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

      trendImage.clearSelection();
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

      const finalImageUrl = eventImage.file
        ? (await uploadAdminAsset(eventImage.file, { collection: "events", entityId: eventDraft.id.trim(), assetType: "image" })).downloadUrl
        : eventDraft.imageUrl.trim();

      if (!finalImageUrl) {
        throw new Error("이미지 URL 또는 이미지 파일이 필요합니다.");
      }

      const baseEvent = draftToEvent({ ...eventDraft, imageUrl: finalImageUrl });

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

      eventImage.clearSelection();
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

      const finalPosterUrl = popupPoster.file
        ? (await uploadAdminAsset(popupPoster.file, { collection: "popups", entityId: popupDraft.id.trim(), assetType: "poster" })).downloadUrl
        : popupDraft.posterUrl.trim();

      const finalHeroUrl = popupHero.file
        ? (await uploadAdminAsset(popupHero.file, { collection: "popups", entityId: popupDraft.id.trim(), assetType: "hero" })).downloadUrl
        : popupDraft.heroImageUrl.trim() || finalPosterUrl;

      if (!finalPosterUrl) {
        throw new Error("포스터 이미지 URL 또는 이미지 파일이 필요합니다.");
      }

      const basePopup = draftToPopup({ ...popupDraft, posterUrl: finalPosterUrl, heroImageUrl: finalHeroUrl });

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

      popupPoster.clearSelection();
      popupHero.clearSelection();
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

  const editorMeta = EDITOR_META[type];
  const messageToneClass = {
    success: "border-green-200 bg-green-50 text-green-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
    info: "border-blue-200 bg-blue-50 text-blue-900"
  } as const;

  const renderTrendForm = () => {
    const currentTrendImagePreview = trendImage.preview;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.error("이미지 로드 실패:", e.currentTarget.src);
      // 이미지 로드 실패 시 빈 이미지로 대체
      e.currentTarget.style.display = "none";
    };

    return (
      <form onSubmit={handleTrendSubmit} className="studio-form space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[var(--ink)]">
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
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
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
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            >
              {LANG_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {getLanguageLabel(lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <input
              type="checkbox"
              checked={trendDraft.hidden}
              onChange={(e) => setTrendDraft((prev) => ({ ...prev, hidden: e.target.checked }))}
              className="h-4 w-4 rounded border-[var(--border)]"
              aria-label="숨김"
            />
            <span className="sr-only">숨김</span>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            저자
            <select
              value={trendDraft.authorId}
              onChange={(e) =>
                setTrendDraft((prev) => ({
                  ...prev,
                  authorId: e.target.value
                }))
              }
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            >
              {AUTHOR_PROFILES.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name} — {author.title}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            ID (영문 소문자, 하이픈 권장)
            <input
              type="text"
              value={trendDraft.id}
              onChange={(e) => setTrendDraft((prev) => ({ ...prev, id: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              placeholder="ex) seongsu-vinyl"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            공개 날짜
            <input
              type="date"
              value={trendDraft.publishedAt}
              onChange={(e) => setTrendDraft((prev) => ({ ...prev, publishedAt: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              required
            />
          </label>
        </div>

        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper-muted)]/70 p-4">
          <LanguageMultiSelect
            label="노출 언어 (복수 선택)"
            helper="작성 언어를 기준으로 자동 번역하여 각 언어 버전이 생성됩니다. 선택하지 않으면 작성 언어만 발행됩니다."
            value={trendDraft.languages}
            onChange={(languages) => setTrendDraft((prev) => ({ ...prev, languages }))}
          />
          <p className="mt-2 text-xs text-[var(--ink-subtle)]">
            다국어 발행 시 ID 앞에 언어 코드가 자동으로 붙습니다. 예){" "}
            <span className="font-semibold text-[var(--ink)]">
              {trendDraft.languages.length > 1
                ? `fr-${normalizeBaseId(trendDraft.id || "trend-id", trendDraft.language)}`
                : trendDraft.id || "trend-id"}
            </span>
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          제목
          <input
            type="text"
            value={trendDraft.title}
            onChange={(e) => setTrendDraft((prev) => ({ ...prev, title: e.target.value }))}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          요약
          <textarea
            value={trendDraft.summary}
            onChange={(e) => setTrendDraft((prev) => ({ ...prev, summary: e.target.value }))}
            className="h-24 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          상세 설명 (목록 카드에서 사용)
          <textarea
            value={trendDraft.details}
            onChange={(e) => setTrendDraft((prev) => ({ ...prev, details: e.target.value }))}
            className="h-24 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            지역 / 동네
            <input
              type="text"
              value={trendDraft.neighborhood}
              onChange={(e) => setTrendDraft((prev) => ({ ...prev, neighborhood: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              required
            />
          </label>
          <div className="space-y-3">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
              대표 이미지 URL
              <input
                type="url"
                value={trendDraft.imageUrl}
                onChange={(e) => setTrendDraft((prev) => ({ ...prev, imageUrl: e.target.value }))}
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
                placeholder="https://"
              />
            </label>
            <div className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
              <span>이미지 파일 업로드 (선택)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  trendImage.applyFile(file);
                  if (e.target) {
                    e.target.value = "";
                  }
                }}
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--ink)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {trendImage.file && (
                <div className="flex items-center justify-between gap-2 text-xs font-normal">
                  <span className="truncate text-[var(--ink-subtle)]">{trendImage.file.name}</span>
                  <button
                    type="button"
                    onClick={() => trendImage.applyFile(null)}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--ink-muted)] hover:bg-[var(--paper-muted)]"
                  >
                    선택 해제
                  </button>
                </div>
              )}
              <p className="text-xs font-normal text-[var(--ink-subtle)]">
                Studio에 업로드하면 Firebase Storage URL이 자동으로 생성됩니다.
              </p>
            </div>
          </div>
        </div>

        {currentTrendImagePreview && (
          <div className="space-y-2 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper-muted)]/80 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
              이미지 미리보기
            </span>
            <div className="overflow-hidden rounded-xl border border-[var(--border)]">
              <img
                src={currentTrendImagePreview}
                alt={trendDraft.title || "Trend image preview"}
                className="h-56 w-full object-cover"
                onError={handleImageError}
                onLoad={() => undefined}
              />
            </div>
            <p className="text-xs text-[var(--ink-subtle)]">저장 시 모든 언어 버전에 동일한 이미지가 반영됩니다.</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            태그 (쉼표로 구분)
            <input
              type="text"
              value={trendDraft.tagsInput}
              onChange={(e) => setTrendDraft((prev) => ({ ...prev, tagsInput: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              placeholder="pop-up, mode, street food"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            트렌드 강도
            <select
              value={trendDraft.intensity}
              onChange={(e) =>
                setTrendDraft((prev) => ({ ...prev, intensity: e.target.value as TrendIntensity }))
              }
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
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

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handleTrendDraftSave}
            className="pill-button border border-[var(--border)] text-[var(--ink)] hover:-translate-y-0.5"
          >
            임시저장
          </button>
          <button
            type="button"
            onClick={() => {
              setTrendDraft(createEmptyTrendDraft());
              trendImage.clearSelection();
            }}
            className="pill-button border border-dashed border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
          >
            새로 작성
          </button>
          <button
            type="submit"
            disabled={saving}
            className="pill-button bg-[var(--ink)] text-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    );
  };

  const renderEventForm = () => {
    const currentEventImagePreview = eventImage.preview;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.error("이미지 로드 실패:", e.currentTarget.src);
      e.currentTarget.style.display = "none";
    };

    return (
      <form onSubmit={handleEventSubmit} className="studio-form space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[var(--ink)]">
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
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
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
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            >
              {LANG_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {getLanguageLabel(lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <input
              type="checkbox"
              checked={eventDraft.hidden}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, hidden: e.target.checked }))}
              className="h-4 w-4 rounded border-[var(--border)]"
              aria-label="숨김"
            />
            <span className="sr-only">숨김</span>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            ID
            <input
              type="text"
              value={eventDraft.id}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, id: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            카테고리
            <select
              value={eventDraft.category}
              onChange={(e) =>
                setEventDraft((prev) => ({ ...prev, category: e.target.value as EventCategory }))
              }
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            >
              <option value="concert">Concert</option>
              <option value="traditional">Traditional</option>
              <option value="atelier">Atelier</option>
              <option value="theatre">Theatre</option>
              <option value="festival">Festival</option>
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper-muted)]/70 p-4">
          <LanguageMultiSelect
            label="노출 언어 (복수 선택)"
            helper="선택한 언어마다 이벤트 설명이 자동 번역되어 게시됩니다."
            value={eventDraft.languages}
            onChange={(languages) => setEventDraft((prev) => ({ ...prev, languages }))}
          />
          <p className="mt-2 text-xs text-[var(--ink-subtle)]">
            여러 언어를 발행하면 ID는{" "}
            <strong>{`lang-${normalizeBaseId(eventDraft.id || "event-id", eventDraft.language)}`}</strong>{" "}
            형식으로 저장됩니다.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          제목
          <input
            type="text"
            value={eventDraft.title}
            onChange={(e) => setEventDraft((prev) => ({ ...prev, title: e.target.value }))}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          요약 설명
          <textarea
            value={eventDraft.description}
            onChange={(e) => setEventDraft((prev) => ({ ...prev, description: e.target.value }))}
            className="h-24 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            시작 날짜
            <input
              type="date"
              value={eventDraft.startDate}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, startDate: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            종료 날짜
            <input
              type="date"
              value={eventDraft.endDate}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, endDate: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            시간
            <input
              type="time"
              value={eventDraft.time}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, time: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            참가비 / 티켓
            <input
              type="text"
              value={eventDraft.price}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, price: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              placeholder="예: 29 000 KRW, Entrée libre"
              required
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          장소
          <input
            type="text"
            value={eventDraft.location}
            onChange={(e) => setEventDraft((prev) => ({ ...prev, location: e.target.value }))}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          지도 검색어 (선택)
          <input
            type="text"
            value={eventDraft.mapQuery}
            onChange={(e) => setEventDraft((prev) => ({ ...prev, mapQuery: e.target.value }))}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            placeholder="예: 성수동 무신사 스튜디오, 광화문 세종문화회관"
          />
          <span className="text-xs font-normal text-[var(--ink-subtle)]">
            지도를 열 때 우선 검색할 키워드입니다. 비워두면 장소 값으로 검색합니다.
          </span>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
              대표 이미지 URL
              <input
                type="url"
                value={eventDraft.imageUrl}
                onChange={(e) => setEventDraft((prev) => ({ ...prev, imageUrl: e.target.value }))}
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
                placeholder="https://"
              />
            </label>
            <div className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
              <span>이미지 파일 업로드 (선택)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  eventImage.applyFile(file);
                  if (e.target) {
                    e.target.value = "";
                  }
                }}
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--ink)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {eventImage.file && (
                <div className="flex items-center justify-between gap-2 text-xs font-normal">
                  <span className="truncate text-[var(--ink-subtle)]">{eventImage.file.name}</span>
                  <button
                    type="button"
                    onClick={() => eventImage.applyFile(null)}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--ink-muted)] hover:bg-[var(--paper-muted)]"
                  >
                    선택 해제
                  </button>
                </div>
              )}
              <p className="text-xs font-normal text-[var(--ink-subtle)]">
                파일을 업로드하면 Firebase Storage에 저장되어 Cloudinary 차단 없이 노출됩니다.
              </p>
            </div>
          </div>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            예약 링크 (선택)
            <input
              type="url"
              value={eventDraft.bookingUrl}
              onChange={(e) => setEventDraft((prev) => ({ ...prev, bookingUrl: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              placeholder="https://"
            />
          </label>
        </div>

        {currentEventImagePreview && (
          <div className="space-y-2 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper-muted)]/80 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
              이미지 미리보기
            </span>
            <div className="overflow-hidden rounded-xl border border-[var(--border)]">
              <img
                src={currentEventImagePreview}
                alt={eventDraft.title || "Event image preview"}
                className="h-56 w-full object-cover"
                onError={handleImageError}
                onLoad={() => undefined}
              />
            </div>
            <p className="text-xs text-[var(--ink-subtle)]">
              저장 시 이 이미지 URL이 모든 언어 버전에 함께 적용됩니다.
            </p>
          </div>
        )}

        <TextEditor
          label="상세 설명 (줄바꿈으로 문단 구분)"
          labelActions={
            <button
              type="button"
              onClick={handleEventContentGeneration}
              disabled={aiGenerating || !canUseAiGenerator}
              className="rounded-full border border-[var(--ink)]/30 px-3 py-1 text-xs font-semibold text-[var(--ink)] transition hover:bg-[var(--ink)]/10 disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:text-[var(--ink-subtle)]"
            >
              {aiGenerating ? "AI 생성 중..." : "AI로 내용 채우기"}
            </button>
          }
          value={eventDraft.longDescriptionInput}
          onChange={(value) => setEventDraft((prev) => ({ ...prev, longDescriptionInput: value }))}
          placeholder="이미지를 드래그 앤 드롭하여 삽입할 수 있습니다."
          imageUploadOptions={{
            collection: "events",
            entityId: eventDraft.id || undefined
          }}
        />

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          팁 & 추천 (줄바꿈으로 구분)
          <textarea
            value={eventDraft.tipsInput}
            onChange={(e) => setEventDraft((prev) => ({ ...prev, tipsInput: e.target.value }))}
            className="h-32 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
          />
        </label>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handleEventDraftSave}
            className="pill-button border border-[var(--border)] text-[var(--ink)] hover:-translate-y-0.5"
          >
            임시저장
          </button>
          <button
            type="button"
            onClick={() => {
              setEventDraft(createEmptyEventDraft());
              eventImage.clearSelection();
            }}
            className="pill-button border border-dashed border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
          >
            새로 작성
          </button>
          <button
            type="submit"
            disabled={saving}
            className="pill-button bg-[var(--ink)] text-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    );
  };

  const renderPhraseForm = () => {
    return (
      <form onSubmit={handlePhraseSubmit} className="studio-form space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[var(--ink)]">
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
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
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
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            >
              {LANG_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {getLanguageLabel(lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <input
              type="checkbox"
              checked={phraseDraft.hidden}
              onChange={(e) => setPhraseDraft((prev) => ({ ...prev, hidden: e.target.checked }))}
              className="h-4 w-4 rounded border-[var(--border)]"
              aria-label="숨김"
            />
            <span className="sr-only">숨김</span>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            ID
            <input
              type="text"
              value={phraseDraft.id}
              onChange={(e) => setPhraseDraft((prev) => ({ ...prev, id: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            카테고리
            <select
              value={phraseDraft.category}
              onChange={(e) =>
                setPhraseDraft((prev) => ({ ...prev, category: e.target.value as PhraseCategory }))
              }
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            >
              <option value="food">음식</option>
              <option value="shopping">쇼핑</option>
              <option value="entertainment">엔터테인먼트</option>
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper-muted)]/70 p-4">
          <LanguageMultiSelect
            label="노출 언어 (복수 선택)"
            helper="선택한 언어마다 번역과 문화 노트가 자동 생성됩니다."
            value={phraseDraft.languages}
            onChange={(languages) => setPhraseDraft((prev) => ({ ...prev, languages }))}
          />
          <p className="mt-2 text-xs text-[var(--ink-subtle)]">
            예) <strong>{`ja-${normalizeBaseId(phraseDraft.id || "phrase-id", phraseDraft.language)}`}</strong>
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          한국어 표현
          <input
            type="text"
            value={phraseDraft.korean}
            onChange={(e) => setPhraseDraft((prev) => ({ ...prev, korean: e.target.value }))}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          발음 표기
          <input
            type="text"
            value={phraseDraft.transliteration}
            onChange={(e) =>
              setPhraseDraft((prev) => ({ ...prev, transliteration: e.target.value }))
            }
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          번역 (선택한 언어)
          <input
            type="text"
            value={phraseDraft.translation}
            onChange={(e) => setPhraseDraft((prev) => ({ ...prev, translation: e.target.value }))}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          문화 노트
          <textarea
            value={phraseDraft.culturalNote}
            onChange={(e) => setPhraseDraft((prev) => ({ ...prev, culturalNote: e.target.value }))}
            className="h-28 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
        </label>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handlePhraseDraftSave}
            className="pill-button border border-[var(--border)] text-[var(--ink)] hover:-translate-y-0.5"
          >
            임시저장
          </button>
          <button
            type="button"
            onClick={() => {
              setPhraseDraft(createEmptyPhraseDraft());
            }}
            className="pill-button border border-dashed border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
          >
            새로 작성
          </button>
          <button
            type="submit"
            disabled={saving}
            className="pill-button bg-[var(--ink)] text-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    );
  };

  const renderPopupForm = () => {
    const currentPopupPosterPreview = popupPoster.preview;
    const currentPopupHeroPreview = popupHero.preview;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.error("이미지 로드 실패:", e.currentTarget.src);
      e.currentTarget.style.display = "none";
    };

    return (
      <form onSubmit={handlePopupSubmit} className="studio-form space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[var(--ink)]">
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
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
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
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            >
              {LANG_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {getLanguageLabel(lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <input
              type="checkbox"
              checked={popupDraft.hidden}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, hidden: e.target.checked }))}
              className="h-4 w-4 rounded border-[var(--border)]"
              aria-label="숨김"
            />
            <span className="sr-only">숨김</span>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            ID
            <input
              type="text"
              value={popupDraft.id}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, id: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            상태
            <select
              value={popupDraft.status}
              onChange={(e) =>
                setPopupDraft((prev) => ({ ...prev, status: e.target.value as PopupStatus }))
              }
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            >
              <option value="now">진행 중</option>
              <option value="soon">오픈 예정</option>
              <option value="ended">종료</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            기간
            <input
              type="text"
              value={popupDraft.window}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, window: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              placeholder="2024.06.01 - 06.24 • 11:00-20:00"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            시작일 (자동 상태 전환)
            <input
              type="date"
              value={popupDraft.startDate}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, startDate: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            종료일 (자동 상태 전환)
            <input
              type="date"
              value={popupDraft.endDate}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, endDate: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper-muted)]/70 p-4">
          <LanguageMultiSelect
            label="노출 언어 (복수 선택)"
            helper="팝업 카드와 상세 페이지가 선택한 언어로 자동 생성됩니다."
            value={popupDraft.languages}
            onChange={(languages) => setPopupDraft((prev) => ({ ...prev, languages }))}
          />
          <p className="mt-2 text-xs text-[var(--ink-subtle)]">
            예) <strong>{`en-${normalizeBaseId(popupDraft.id || "popup-id", popupDraft.language)}`}</strong>
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            제목
            <input
              type="text"
              value={popupDraft.title}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, title: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
            브랜드
            <input
              type="text"
              value={popupDraft.brand}
              onChange={(e) => setPopupDraft((prev) => ({ ...prev, brand: e.target.value }))}
              className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              required
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          위치
          <input
            type="text"
            value={popupDraft.location}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, location: e.target.value }))}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          지도 검색어 (선택)
          <input
            type="text"
            value={popupDraft.mapQuery}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, mapQuery: e.target.value }))}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            placeholder="예: 성수동 카페 레이어드, 이태원 제로프루프 바"
          />
          <span className="text-xs font-normal text-[var(--ink-subtle)]">
            지도를 열 때 우선 검색할 키워드입니다. 비워두면 위치 값으로 검색합니다.
          </span>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
              포스터 이미지 URL
              <input
                type="url"
                value={popupDraft.posterUrl}
                onChange={(e) => setPopupDraft((prev) => ({ ...prev, posterUrl: e.target.value }))}
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
                placeholder="https://"
              />
            </label>
            <div className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
              <span>포스터 이미지 파일 업로드 (선택)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  popupPoster.applyFile(file);
                  if (e.target) {
                    e.target.value = "";
                  }
                }}
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--ink)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {popupPoster.file && (
                <div className="flex items-center justify-between gap-2 text-xs font-normal">
                  <span className="truncate text-[var(--ink-subtle)]">{popupPoster.file.name}</span>
                  <button
                    type="button"
                    onClick={() => popupPoster.applyFile(null)}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--ink-muted)] hover:bg-[var(--paper-muted)]"
                  >
                    선택 해제
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
              히어로 이미지 URL (선택)
              <input
                type="url"
                value={popupDraft.heroImageUrl}
                onChange={(e) => setPopupDraft((prev) => ({ ...prev, heroImageUrl: e.target.value }))}
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
                placeholder="https://"
              />
            </label>
            <div className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
              <span>히어로 이미지 파일 업로드 (선택)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  popupHero.applyFile(file);
                  if (e.target) {
                    e.target.value = "";
                  }
                }}
                className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--ink)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {popupHero.file && (
                <div className="flex items-center justify-between gap-2 text-xs font-normal">
                  <span className="truncate text-[var(--ink-subtle)]">{popupHero.file.name}</span>
                  <button
                    type="button"
                    onClick={() => popupHero.applyFile(null)}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--ink-muted)] hover:bg-[var(--paper-muted)]"
                  >
                    선택 해제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {(currentPopupPosterPreview || currentPopupHeroPreview) && (
          <div className="space-y-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper-muted)]/80 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
              이미지 미리보기
            </span>
            {currentPopupPosterPreview && (
              <div className="space-y-2">
                <p className="text-xs text-[var(--ink-muted)]">포스터</p>
                <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                  <img
                    src={currentPopupPosterPreview}
                    alt="Poster preview"
                    className="h-56 w-full object-cover"
                    onError={handleImageError}
                    onLoad={() => undefined}
                  />
                </div>
              </div>
            )}
            {currentPopupHeroPreview && (
              <div className="space-y-2">
                <p className="text-xs text-[var(--ink-muted)]">히어로</p>
                <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                  <img
                    src={currentPopupHeroPreview}
                    alt="Hero preview"
                    className="h-56 w-full object-cover"
                    onError={handleImageError}
                    onLoad={() => undefined}
                  />
                </div>
              </div>
            )}
            <p className="text-xs text-[var(--ink-subtle)]">저장 시 모든 언어 버전에 동일한 이미지가 반영됩니다.</p>
          </div>
        )}

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          설명
          <textarea
            value={popupDraft.description}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, description: e.target.value }))}
            className="h-24 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          태그 (쉼표로 구분)
          <input
            type="text"
            value={popupDraft.tagsInput}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, tagsInput: e.target.value }))}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            placeholder="limited edition, collaboration"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          하이라이트 (줄바꿈으로 구분)
          <textarea
            value={popupDraft.highlightsInput}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, highlightsInput: e.target.value }))}
            className="h-24 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
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

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          예약 링크 (선택)
          <input
            type="url"
            value={popupDraft.reservationUrl}
            onChange={(e) => setPopupDraft((prev) => ({ ...prev, reservationUrl: e.target.value }))}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            placeholder="https://"
          />
        </label>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handlePopupDraftSave}
            className="pill-button border border-[var(--border)] text-[var(--ink)] hover:-translate-y-0.5"
          >
            임시저장
          </button>
          <button
            type="button"
            onClick={() => {
              setPopupDraft(createEmptyPopupDraft());
              popupPoster.clearSelection();
              popupHero.clearSelection();
            }}
            className="pill-button border border-dashed border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
          >
            새로 작성
          </button>
          <button
            type="submit"
            disabled={saving}
            className="pill-button bg-[var(--ink)] text-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    );
  };

  return (
    <main className="min-h-screen bg-[var(--paper-muted)]">
      <section className="section-container space-y-8">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-sm lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-4">
              <button
                onClick={() => navigate("/admin")}
                className="text-sm font-semibold text-[var(--ink-subtle)] hover:text-[var(--ink)]"
              >
                ← Studio 목록
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                  {editorMeta.helper}
                </p>
                <h1 className="mt-2 font-heading text-4xl text-[var(--ink)]">
                  {editorMeta.title}
                  {id ? " 수정" : " 작성"}
                </h1>
              </div>
              <p className="text-[var(--ink-muted)]">{editorMeta.description}</p>
            </div>
            <div className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--ink-muted)]">
              <p className="font-semibold text-[var(--ink)]">Draft storage</p>
              <p>자동 임시저장 · 복원 지원</p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`rounded-2xl border p-4 ${messageToneClass[message.tone]}`}>
            <p className="text-sm font-semibold">{message.text}</p>
          </div>
        )}

        {loading ? (
          <section className="card text-center">
            <p className="text-sm text-[var(--ink-muted)]">콘텐츠를 불러오는 중입니다...</p>
          </section>
        ) : (
          <>
            {type === "trends" && renderTrendForm()}
            {type === "events" && renderEventForm()}
            {type === "phrases" && renderPhraseForm()}
            {type === "popups" && renderPopupForm()}
          </>
        )}
      </section>
    </main>
  );
}
