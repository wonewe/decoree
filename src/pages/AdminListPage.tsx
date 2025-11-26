import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TrendReport } from "../data/trends";
import type { KCultureEvent } from "../data/events";
import type { Phrase } from "../data/phrases";
import type { PopupEvent } from "../data/popups";
import { AUTHOR_PROFILES } from "../data/authors";
import {
  fetchEvents,
  fetchPhrases,
  fetchPopups,
  fetchTrendReports
} from "../services/contentService";
import { useAuth } from "../shared/auth";
import { getLanguageLabel } from "../shared/i18n";

type ContentType = "trends" | "events" | "phrases" | "popups";

const SECTION_META: Record<
  ContentType,
  { label: string; description: string; createLabel: string; createPath: string; tagline: string }
> = {
  trends: {
    label: "트렌드 리포트",
    description: "동네별 인사이트와 리포트를 빠르게 작성하고 번역 상태를 추적하세요.",
    createLabel: "새 트렌드 작성",
    createPath: "/admin/edit/trends",
    tagline: "에디터 팀"
  },
  events: {
    label: "이벤트 캘린더",
    description: "K-Culture 이벤트를 한 곳에서 관리하고 KOPIS와 동기화 상태를 확인합니다.",
    createLabel: "새 이벤트 작성",
    createPath: "/admin/edit/events",
    tagline: "KOPIS 연동"
  },
  phrases: {
    label: "한국어 프레이즈북",
    description: "학습자용 표현집을 정리하고 카테고리·언어별 커버리지를 확인하세요.",
    createLabel: "새 프레이즈 작성",
    createPath: "/admin/edit/phrases",
    tagline: "언어 전문가"
  },
  popups: {
    label: "팝업 레이더",
    description: "도심 팝업과 브랜드 협업 케이스를 큐레이션하고 노출 상태를 관리합니다.",
    createLabel: "새 팝업 작성",
    createPath: "/admin/edit/popups",
    tagline: "도심 리서치"
  }
};

const sectionOrder: ContentType[] = ["trends", "events", "phrases", "popups"];

export default function AdminListPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ContentType>("trends");
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<TrendReport[]>([]);
  const [events, setEvents] = useState<KCultureEvent[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [popups, setPopups] = useState<PopupEvent[]>([]);
  const [updating, setUpdating] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{
    message: string;
    progress: number;
    total: number;
    processed: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const activeMeta = SECTION_META[activeSection];

  const getLanguageCoverage = (items: { language?: string }[]) => {
    if (items.length === 0) return 0;
    return new Set(items.map((item) => item.language ?? "default")).size;
  };

  const summaryCards = useMemo(
    () => [
      {
        key: "trends" as ContentType,
        label: "트렌드",
        value: trends.length,
        helper: `${getLanguageCoverage(trends)}개 언어`
      },
      {
        key: "events" as ContentType,
        label: "이벤트",
        value: events.length,
        helper: `${getLanguageCoverage(events)}개 언어`
      },
      {
        key: "phrases" as ContentType,
        label: "프레이즈",
        value: phrases.length,
        helper: `${getLanguageCoverage(phrases)}개 언어`
      },
      {
        key: "popups" as ContentType,
        label: "팝업",
        value: popups.length,
        helper: `${getLanguageCoverage(popups)}개 언어`
      }
    ],
    [events, phrases, popups, trends]
  );

  const handleUpdateEvents = async () => {
    if (!confirm("KOPIS에서 최신 이벤트를 가져와 갱신하시겠습니까?")) return;

    setUpdating(true);
    setSyncProgress({ message: "이벤트 업데이트를 시작합니다...", progress: 0, total: 0, processed: 0 });

    try {
      // Dynamically import to avoid loading Firebase SDK unless needed
      const { getFunctions } = await import("../services/firebase");
      const { httpsCallable } = await import("firebase/functions");
      const { doc, onSnapshot, getFirestore } = await import("firebase/firestore");
      const { getFirebaseApp } = await import("../services/firebase");

      const functions = await getFunctions();
      const triggerUpdate = httpsCallable(functions, 'triggerEventUpdate');

      // Call Cloud Function
      const result = await triggerUpdate({}) as { data: { success: boolean; syncId: string; message: string } };
      const { syncId } = result.data;

      // Subscribe to sync status updates
      const app = getFirebaseApp();
      const db = getFirestore(app);
      const syncDocRef = doc(db, "sync_status", syncId);

      const unsubscribe = onSnapshot(syncDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSyncProgress({
            message: data.message || "처리 중...",
            progress: data.progress || 0,
            total: data.total || 0,
            processed: data.processed || 0,
          });

          // Check if completed
          if (data.status === "completed") {
            setTimeout(async () => {
              unsubscribe();
              setSyncProgress(null);
              setUpdating(false);

              // Refresh events list
              const eventsData = await fetchEvents();
              setEvents(eventsData);

              alert("이벤트 갱신이 완료되었습니다!");
            }, 1000); // Show 100% for 1 second before closing
          } else if (data.status === "error") {
            unsubscribe();
            setSyncProgress(null);
            setUpdating(false);
            alert(`이벤트 갱신에 실패했습니다: ${data.error || "알 수 없는 오류"}`);
          }
        }
      });
    } catch (error) {
      console.error("Update failed:", error);
      setSyncProgress(null);
      setUpdating(false);
      alert("이벤트 갱신에 실패했습니다. 로그를 확인해주세요.");
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const [trendsData, eventsData, phrasesData, popupsData] = await Promise.all([
          fetchTrendReports(undefined, { includeHidden: true }),
          fetchEvents(undefined, { includeHidden: true }),
          fetchPhrases(undefined, { includeHidden: true }),
          fetchPopups(undefined, { includeHidden: true })
        ]);
        setTrends(trendsData);
        setEvents(eventsData);
        setPhrases(phrasesData);
        setPopups(popupsData);
      } catch (error) {
        console.error("Failed to load content:", error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const sectionTabClass = (section: ContentType) => {
    return `rounded-full px-4 py-2 text-sm font-semibold transition ${
      activeSection === section
        ? "bg-[var(--ink)] text-white shadow-lg"
        : "border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
    }`;
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTrends = useMemo(() => {
    if (!normalizedQuery) return trends;
    return trends.filter((trend) => {
      const target = `${trend.title} ${trend.summary} ${trend.details} ${trend.id} ${trend.neighborhood}`.toLowerCase();
      return target.includes(normalizedQuery);
    });
  }, [normalizedQuery, trends]);

  const filteredEvents = useMemo(() => {
    if (!normalizedQuery) return events;
    return events.filter((event) => {
      const target = `${event.title} ${event.description} ${event.location} ${event.category} ${event.id}`.toLowerCase();
      return target.includes(normalizedQuery);
    });
  }, [normalizedQuery, events]);

  const filteredPhrases = useMemo(() => {
    if (!normalizedQuery) return phrases;
    return phrases.filter((phrase) => {
      const target = `${phrase.korean} ${phrase.translation} ${phrase.category} ${phrase.id}`.toLowerCase();
      return target.includes(normalizedQuery);
    });
  }, [normalizedQuery, phrases]);

  const filteredPopups = useMemo(() => {
    if (!normalizedQuery) return popups;
    return popups.filter((popup) => {
      const target = `${popup.title} ${popup.brand} ${popup.location} ${popup.description} ${popup.id}`.toLowerCase();
      return target.includes(normalizedQuery);
    });
  }, [normalizedQuery, popups]);

  const renderEmptyState = (message: string) => (
    <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper)] p-6 text-sm text-[var(--ink-muted)]">
      {message}
    </p>
  );

  const renderContentList = () => {
    if (loading) {
      return (
        <section className="card text-center">
          <p className="text-sm text-[var(--ink-muted)]">콘텐츠를 불러오는 중입니다...</p>
        </section>
      );
    }

    switch (activeSection) {
      case "trends":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[var(--ink)]">주간 트렌드</h3>
              <button
                onClick={() => navigate("/admin/edit/trends")}
                className="primary-button"
              >
                새 트렌드 작성
              </button>
            </div>
            <p className="text-xs font-semibold text-[var(--ink-subtle)]">
              숨김 배지가 있는 콘텐츠는 사용자에게 비노출됩니다.
            </p>
            {filteredTrends.length === 0 ? (
              renderEmptyState(
                trends.length === 0 ? "아직 등록된 트렌드가 없습니다." : "검색 결과가 없습니다."
              )
            ) : (
              <div className="space-y-2">
                {filteredTrends.map((trend) => {
                  const author = AUTHOR_PROFILES.find((p) => p.id === trend.authorId);
                  return (
                    <button
                      key={trend.id}
                      onClick={() => navigate(`/admin/edit/trends/${trend.id}`)}
                      className="card w-full text-left transition hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[var(--paper-muted)] px-2 py-0.5 text-xs font-semibold text-[var(--ink-subtle)]">
                            {getLanguageLabel(trend.language ?? "en")}
                          </span>
                          {trend.hidden && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                              숨김
                            </span>
                          )}
                          {author && (
                            <span className="text-xs text-[var(--ink-subtle)]">{author.name}</span>
                          )}
                        </div>
                          <h4 className="mt-1 font-semibold text-[var(--ink)]">{trend.title}</h4>
                          <p className="mt-1 text-sm text-[var(--ink-muted)] line-clamp-2">
                            {trend.summary}
                          </p>
                        </div>
                        <span className="ml-4 text-xs text-[var(--ink-subtle)]">{trend.id}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );

      case "events":
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-[var(--ink)]">K-Culture 이벤트</h3>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateEvents}
                disabled={updating}
                className="secondary-button disabled:opacity-50"
              >
                {updating ? "갱신 중..." : "이벤트 갱신"}
              </button>
              <button
                onClick={() => navigate("/admin/edit/events")}
                className="primary-button"
              >
                새 이벤트 작성
              </button>
            </div>
            <p className="text-xs font-semibold text-[var(--ink-subtle)]">
              숨김 배지가 있는 콘텐츠는 사용자에게 비노출됩니다.
            </p>

            {/* Progress Bar */}
            {syncProgress && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--paper)] p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--ink)]">{syncProgress.message}</span>
                  <span className="text-[var(--ink)] font-semibold">{syncProgress.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--paper-muted)]">
                  <div
                    className="h-full rounded-full bg-[var(--ink)] transition-all duration-300"
                    style={{ width: `${syncProgress.progress}%` }}
                  />
                </div>
                {syncProgress.total > 0 && (
                  <p className="text-xs text-[var(--ink-muted)]">
                    {syncProgress.processed} / {syncProgress.total} 이벤트 처리됨
                  </p>
                )}
              </div>
            )}

            {filteredEvents.length === 0 ? (
              renderEmptyState(
                events.length === 0 ? "아직 등록된 이벤트가 없습니다." : "검색 결과가 없습니다."
              )
            ) : (
              <div className="space-y-2">
                {filteredEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => navigate(`/admin/edit/events/${event.id}`)}
                      className="card w-full text-left transition hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[var(--paper-muted)] px-2 py-0.5 text-xs font-semibold text-[var(--ink-subtle)]">
                            {getLanguageLabel(event.language)}
                          </span>
                          {event.hidden && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                              숨김
                            </span>
                          )}
                          <span className="text-xs text-[var(--ink-subtle)]">{event.category}</span>
                        </div>
                          <h4 className="mt-1 font-semibold text-[var(--ink)]">{event.title}</h4>
                          <p className="mt-1 text-sm text-[var(--ink-muted)] line-clamp-2">
                            {event.description}
                          </p>
                          <p className="mt-1 text-xs text-[var(--ink-subtle)]">
                            {event.startDate} · {event.location}
                          </p>
                        </div>
                        <span className="ml-4 text-xs text-[var(--ink-subtle)]">{event.id}</span>
                      </div>
                    </button>
                ))}
              </div>
            )}
          </div >
        );

      case "phrases":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[var(--ink)]">한국어 프레이즈북</h3>
              <button onClick={() => navigate("/admin/edit/phrases")} className="primary-button">
                새 프레이즈 작성
              </button>
            </div>
            <p className="text-xs font-semibold text-[var(--ink-subtle)]">
              숨김 배지가 있는 콘텐츠는 사용자에게 비노출됩니다.
            </p>
            {filteredPhrases.length === 0 ? (
              renderEmptyState(
                phrases.length === 0 ? "아직 등록된 프레이즈가 없습니다." : "검색 결과가 없습니다."
              )
            ) : (
              <div className="space-y-2">
                {filteredPhrases.map((phrase) => (
                    <button
                      key={phrase.id}
                      onClick={() => navigate(`/admin/edit/phrases/${phrase.id}`)}
                      className="card w-full text-left transition hover:-translate-y-0.5"
                    >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-[var(--paper-muted)] px-2 py-0.5 text-xs font-semibold text-[var(--ink-subtle)]">
                            {getLanguageLabel(phrase.language)}
                          </span>
                            {phrase.hidden && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                숨김
                              </span>
                            )}
                            <span className="text-xs text-[var(--ink-subtle)]">{phrase.category}</span>
                        </div>
                          <h4 className="mt-1 font-semibold text-[var(--ink)]">{phrase.korean}</h4>
                          <p className="mt-1 text-sm text-[var(--ink-muted)]">{phrase.translation}</p>
                      </div>
                        <span className="ml-4 text-xs text-[var(--ink-subtle)]">{phrase.id}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case "popups":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[var(--ink)]">팝업 레이더</h3>
              <button onClick={() => navigate("/admin/edit/popups")} className="primary-button">
                새 팝업 작성
              </button>
            </div>
            <p className="text-xs font-semibold text-[var(--ink-subtle)]">
              숨김 배지가 있는 콘텐츠는 사용자에게 비노출됩니다.
            </p>
            {filteredPopups.length === 0 ? (
              renderEmptyState(
                popups.length === 0 ? "아직 등록된 팝업이 없습니다." : "검색 결과가 없습니다."
              )
            ) : (
              <div className="space-y-2">
                {filteredPopups.map((popup) => (
                    <button
                      key={popup.id}
                      onClick={() => navigate(`/admin/edit/popups/${popup.id}`)}
                      className="card w-full text-left transition hover:-translate-y-0.5"
                    >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-[var(--paper-muted)] px-2 py-0.5 text-xs font-semibold text-[var(--ink-subtle)]">
                            {getLanguageLabel(popup.language)}
                          </span>
                            {popup.hidden && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                숨김
                              </span>
                            )}
                            <span className="text-xs text-[var(--ink-subtle)]">{popup.status}</span>
                        </div>
                          <h4 className="mt-1 font-semibold text-[var(--ink)]">{popup.title}</h4>
                          <p className="mt-1 text-sm text-[var(--ink-muted)]">{popup.brand}</p>
                          <p className="mt-1 text-xs text-[var(--ink-subtle)]">{popup.location}</p>
                      </div>
                        <span className="ml-4 text-xs text-[var(--ink-subtle)]">{popup.id}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[var(--paper-muted)]">
      <section className="section-container space-y-8">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <header className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-sm lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                  Studio overview
                </p>
                <h1 className="font-heading text-4xl text-[var(--ink)]">Koraid Studio</h1>
                <p className="text-[var(--ink-muted)]">{activeMeta.description}</p>
              </div>
              <div className="flex flex-col items-start gap-3">
                {user?.email && (
                  <span className="rounded-full bg-[var(--paper-muted)] px-3 py-1 text-xs font-semibold text-[var(--ink-subtle)]">
                    {user.email}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => navigate(activeMeta.createPath)}
                  className="pill-button bg-[var(--ink)] text-white hover:-translate-y-0.5"
                >
                  + {activeMeta.createLabel}
                </button>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[var(--ink-subtle)]">
              <span className="rounded-full bg-[var(--paper-muted)] px-3 py-1">{activeMeta.tagline}</span>
              <span className="rounded-full bg-[var(--paper-muted)] px-3 py-1">
                현재 섹션 · {activeMeta.label}
              </span>
            </div>
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            {summaryCards.map((card) => (
              <div
                key={card.key}
                className={`rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-5 shadow-sm transition ${
                  activeSection === card.key ? "ring-2 ring-[var(--ink)]" : ""
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-[var(--ink)]">{card.value}</p>
                <p className="text-xs text-[var(--ink-muted)]">{card.helper}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {sectionOrder.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={sectionTabClass(section)}
            >
              {SECTION_META[section].label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-6 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-subtle)]">
            Studio 검색
          </label>
          <div className="relative mt-3">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]">
              ⌕
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목, ID, 담당자 등을 입력하세요"
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--paper-muted)] px-4 py-3 pl-11 pr-12 text-sm text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-[var(--ink)]"
              >
                지우기
              </button>
            )}
          </div>
        </div>

        <section className="space-y-6">{renderContentList()}</section>
      </section>
    </main>
  );
}
