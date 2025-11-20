import { useEffect, useState } from "react";
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
          fetchTrendReports(),
          fetchEvents(),
          fetchPhrases(),
          fetchPopups()
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
    return `rounded-full px-4 py-2 text-sm font-semibold transition ${activeSection === section
      ? "bg-hanBlue text-white shadow"
      : "border border-slate-200 bg-white text-slate-600 hover:border-hanBlue hover:text-hanBlue"
      }`;
  };

  const renderContentList = () => {
    if (loading) {
      return (
        <section className="rounded-3xl bg-white p-10 text-center shadow">
          <p className="text-sm text-slate-500">콘텐츠를 불러오는 중입니다...</p>
        </section>
      );
    }

    switch (activeSection) {
      case "trends":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dancheongNavy">주간 트렌드</h3>
              <button
                onClick={() => navigate("/admin/edit/trends")}
                className="rounded-full bg-hanBlue px-4 py-2 text-sm font-semibold text-white transition hover:bg-hanBlue/90"
              >
                새 트렌드 작성
              </button>
            </div>
            {trends.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                아직 등록된 트렌드가 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {trends.map((trend) => {
                  const author = AUTHOR_PROFILES.find((p) => p.id === trend.authorId);
                  return (
                    <button
                      key={trend.id}
                      onClick={() => navigate(`/admin/edit/trends/${trend.id}`)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-hanBlue hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                              {getLanguageLabel(trend.language ?? "en")}
                            </span>
                            {author && (
                              <span className="text-xs text-slate-500">{author.name}</span>
                            )}
                          </div>
                          <h4 className="mt-1 font-semibold text-dancheongNavy">{trend.title}</h4>
                          <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                            {trend.summary}
                          </p>
                        </div>
                        <span className="ml-4 text-xs text-slate-400">{trend.id}</span>
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
            <h3 className="text-lg font-semibold text-dancheongNavy">K-Culture 이벤트</h3>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateEvents}
                disabled={updating}
                className="rounded-full border border-hanBlue px-4 py-2 text-sm font-semibold text-hanBlue transition hover:bg-hanBlue/10 disabled:opacity-50"
              >
                {updating ? "갱신 중..." : "이벤트 갱신"}
              </button>
              <button
                onClick={() => navigate("/admin/edit/events")}
                className="rounded-full bg-hanBlue px-4 py-2 text-sm font-semibold text-white transition hover:bg-hanBlue/90"
              >
                새 이벤트 작성
              </button>
            </div>

            {/* Progress Bar */}
            {syncProgress && (
              <div className="rounded-xl border border-hanBlue/30 bg-hanBlue/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-dancheongNavy">{syncProgress.message}</span>
                  <span className="text-hanBlue font-semibold">{syncProgress.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-hanBlue transition-all duration-300"
                    style={{ width: `${syncProgress.progress}%` }}
                  />
                </div>
                {syncProgress.total > 0 && (
                  <p className="text-xs text-slate-600">
                    {syncProgress.processed} / {syncProgress.total} 이벤트 처리됨
                  </p>
                )}
              </div>
            )}

            {
              events.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  아직 등록된 이벤트가 없습니다.
                </p>
              ) : (
                <div className="space-y-2">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => navigate(`/admin/edit/events/${event.id}`)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-hanBlue hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                              {getLanguageLabel(event.language)}
                            </span>
                            <span className="text-xs text-slate-500">{event.category}</span>
                          </div>
                          <h4 className="mt-1 font-semibold text-dancheongNavy">{event.title}</h4>
                          <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                            {event.description}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {event.startDate} · {event.location}
                          </p>
                        </div>
                        <span className="ml-4 text-xs text-slate-400">{event.id}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )
            }
          </div >
        );

      case "phrases":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dancheongNavy">한국어 프레이즈북</h3>
              <button
                onClick={() => navigate("/admin/edit/phrases")}
                className="rounded-full bg-hanBlue px-4 py-2 text-sm font-semibold text-white transition hover:bg-hanBlue/90"
              >
                새 프레이즈 작성
              </button>
            </div>
            {phrases.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                아직 등록된 프레이즈가 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {phrases.map((phrase) => (
                  <button
                    key={phrase.id}
                    onClick={() => navigate(`/admin/edit/phrases/${phrase.id}`)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-hanBlue hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                            {getLanguageLabel(phrase.language)}
                          </span>
                          <span className="text-xs text-slate-500">{phrase.category}</span>
                        </div>
                        <h4 className="mt-1 font-semibold text-dancheongNavy">{phrase.korean}</h4>
                        <p className="mt-1 text-sm text-slate-600">{phrase.translation}</p>
                      </div>
                      <span className="ml-4 text-xs text-slate-400">{phrase.id}</span>
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
              <h3 className="text-lg font-semibold text-dancheongNavy">팝업 레이더</h3>
              <button
                onClick={() => navigate("/admin/edit/popups")}
                className="rounded-full bg-hanBlue px-4 py-2 text-sm font-semibold text-white transition hover:bg-hanBlue/90"
              >
                새 팝업 작성
              </button>
            </div>
            {popups.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                아직 등록된 팝업이 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {popups.map((popup) => (
                  <button
                    key={popup.id}
                    onClick={() => navigate(`/admin/edit/popups/${popup.id}`)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-hanBlue hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                            {getLanguageLabel(popup.language)}
                          </span>
                          <span className="text-xs text-slate-500">{popup.status}</span>
                        </div>
                        <h4 className="mt-1 font-semibold text-dancheongNavy">{popup.title}</h4>
                        <p className="mt-1 text-sm text-slate-600">{popup.brand}</p>
                        <p className="mt-1 text-xs text-slate-500">{popup.location}</p>
                      </div>
                      <span className="ml-4 text-xs text-slate-400">{popup.id}</span>
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
    <main className="section-container space-y-6">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dancheongNavy">Studio 관리</h1>
          <div className="text-sm text-slate-500">
            {user?.email}로 로그인됨
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveSection("trends")}
            className={sectionTabClass("trends")}
          >
            트렌드 리포트
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("events")}
            className={sectionTabClass("events")}
          >
            이벤트 캘린더
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("phrases")}
            className={sectionTabClass("phrases")}
          >
            한국어 프레이즈북
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("popups")}
            className={sectionTabClass("popups")}
          >
            팝업 레이더
          </button>
        </div>
      </header>

      <section className="rounded-3xl bg-white p-8 shadow">
        {renderContentList()}
      </section>
    </main>
  );
}

