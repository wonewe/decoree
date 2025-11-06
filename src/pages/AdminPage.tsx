import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  addEvent,
  addPhrase,
  addTrendReport,
  clearCustomContent,
  fetchEvents,
  fetchPhrases,
  fetchTrendReports
} from "../services/contentService";
import type { TrendIntensity, TrendReport } from "../data/trends";
import type { KCultureEvent } from "../data/events";
import type { Phrase, PhraseCategory } from "../data/phrases";
import { useI18n } from "../shared/i18n";
import { useAuth } from "../shared/auth";

const defaultTrendDate = new Date().toISOString().slice(0, 10);

const intensityOptions: TrendIntensity[] = ["highlight", "insider", "emerging"];
const phraseCategories: PhraseCategory[] = ["food", "shopping", "entertainment"];

type FeedbackState = { type: "success" | "error"; message: string } | null;

const generateId = (prefix: string, title: string) => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  return `${prefix}-${slug || "item"}-${Date.now()}`;
};

export default function AdminPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [trendForm, setTrendForm] = useState({
    title: "",
    summary: "",
    details: "",
    neighborhood: "",
    tags: "",
    intensity: intensityOptions[0],
    isPremium: false,
    publishedAt: defaultTrendDate,
    imageUrl: "",
    content: ""
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: defaultTrendDate,
    time: "19:00",
    location: "",
    category: "concert" as KCultureEvent["category"],
    price: "",
    bookingUrl: "",
    imageUrl: "",
    longDescription: "",
    tips: ""
  });

  const [phraseForm, setPhraseForm] = useState({
    korean: "",
    transliteration: "",
    french: "",
    culturalNote: "",
    category: phraseCategories[0]
  });

  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [loading, setLoading] = useState(false);

  const [trends, setTrends] = useState<TrendReport[]>([]);
  const [events, setEvents] = useState<KCultureEvent[]>([]);
  const [phrases, setPhrases] = useState<Phrase[]>([]);

  const loadAllContent = useCallback(async () => {
    const [trendData, eventData, phraseData] = await Promise.all([
      fetchTrendReports(),
      fetchEvents(),
      fetchPhrases()
    ]);
    setTrends(trendData);
    setEvents(eventData);
    setPhrases(phraseData);
  }, []);

  useEffect(() => {
    loadAllContent();
  }, [loadAllContent]);

  const customCounts = useMemo(() => {
    return {
      trends: trends.filter((item) => item.id.startsWith("custom-trend-")).length,
      events: events.filter((item) => item.id.startsWith("custom-event-")).length,
      phrases: phrases.filter((item) => item.id.startsWith("custom-phrase-")).length
    };
  }, [trends, events, phrases]);

  const resetForms = () => {
    setTrendForm({
      title: "",
      summary: "",
      details: "",
      neighborhood: "",
      tags: "",
      intensity: intensityOptions[0],
      isPremium: false,
      publishedAt: defaultTrendDate,
      imageUrl: "",
      content: ""
    });
    setEventForm({
      title: "",
      description: "",
      date: defaultTrendDate,
      time: "19:00",
      location: "",
      category: "concert",
      price: "",
      bookingUrl: "",
      imageUrl: "",
      longDescription: "",
      tips: ""
    });
    setPhraseForm({
      korean: "",
      transliteration: "",
      french: "",
      culturalNote: "",
      category: phraseCategories[0]
    });
  };

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleTrendSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const report: TrendReport = {
        id: generateId("custom-trend", trendForm.title),
        title: trendForm.title,
        summary: trendForm.summary,
        details: trendForm.details,
        neighborhood: trendForm.neighborhood,
        tags: trendForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        intensity: trendForm.intensity as TrendIntensity,
        isPremium: trendForm.isPremium,
        publishedAt: trendForm.publishedAt,
        imageUrl:
          trendForm.imageUrl.trim() ||
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1600&q=80",
        content:
          trendForm.content
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean) || []
      };
      if (report.content.length === 0) {
        report.content = [trendForm.summary, trendForm.details];
      }
      await addTrendReport(report);
      await loadAllContent();
      resetForms();
      showFeedback("success", t("admin.feedback.trendSaved"));
    } catch (error) {
      console.error(error);
      showFeedback("error", t("admin.feedback.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const entry: KCultureEvent = {
        id: generateId("custom-event", eventForm.title),
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        category: eventForm.category,
        price: eventForm.price,
        bookingUrl: eventForm.bookingUrl || undefined,
        imageUrl:
          eventForm.imageUrl.trim() ||
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
        longDescription:
          eventForm.longDescription
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean) || [],
        tips:
          eventForm.tips
            .split("\n")
            .map((tip) => tip.trim())
            .filter(Boolean) || []
      };
      if (entry.longDescription.length === 0) {
        entry.longDescription = [eventForm.description];
      }
      await addEvent(entry);
      await loadAllContent();
      resetForms();
      showFeedback("success", t("admin.feedback.eventSaved"));
    } catch (error) {
      console.error(error);
      showFeedback("error", t("admin.feedback.error"));
    } finally {
      setLoading(false);
    }
  };

  const handlePhraseSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const entry: Phrase = {
        id: generateId("custom-phrase", phraseForm.korean),
        korean: phraseForm.korean,
        transliteration: phraseForm.transliteration,
        french: phraseForm.french,
        culturalNote: phraseForm.culturalNote,
        category: phraseForm.category
      };
      await addPhrase(entry);
      await loadAllContent();
      resetForms();
      showFeedback("success", t("admin.feedback.phraseSaved"));
    } catch (error) {
      console.error(error);
      showFeedback("error", t("admin.feedback.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleClearCustomContent = async () => {
    clearCustomContent();
    await loadAllContent();
    showFeedback("success", t("admin.feedback.cleared"));
  };

  return (
    <section className="section-container space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-dancheongNavy">{t("admin.title")}</h1>
        <p className="max-w-2xl text-slate-600">{t("admin.subtitle")}</p>
        {user && (
          <p className="text-xs uppercase tracking-wide text-slate-400">
            {t("admin.session", { email: user.email ?? "n/a" })}
          </p>
        )}
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <span>{t("admin.stats.trends", { count: customCounts.trends })}</span>
          <span>{t("admin.stats.events", { count: customCounts.events })}</span>
          <span>{t("admin.stats.phrases", { count: customCounts.phrases })}</span>
        </div>
        <button
          onClick={handleClearCustomContent}
          className="rounded-full border border-dancheongRed px-4 py-2 text-sm font-semibold text-dancheongRed transition hover:bg-dancheongRed/10"
        >
          {t("admin.actions.reset")}
        </button>
        {feedback && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "bg-dancheongGreen/10 text-dancheongGreen"
                : "bg-dancheongRed/10 text-dancheongRed"
            }`}
          >
            {feedback.message}
          </div>
        )}
      </header>

      <section className="space-y-6 rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-dancheongNavy">{t("admin.trend.title")}</h2>
        <p className="text-sm text-slate-500">{t("admin.trend.description")}</p>
        <form onSubmit={handleTrendSubmit} className="grid gap-4 md:grid-cols-2">
          <input
            required
            placeholder={t("admin.form.title")}
            value={trendForm.title}
            onChange={(event) => setTrendForm((prev) => ({ ...prev, title: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <input
            required
            placeholder={t("admin.form.neighborhood")}
            value={trendForm.neighborhood}
            onChange={(event) =>
              setTrendForm((prev) => ({ ...prev, neighborhood: event.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <input
            placeholder={t("admin.form.imageUrl")}
            value={trendForm.imageUrl}
            onChange={(event) =>
              setTrendForm((prev) => ({ ...prev, imageUrl: event.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <textarea
            required
            placeholder={t("admin.form.summary")}
            value={trendForm.summary}
            onChange={(event) => setTrendForm((prev) => ({ ...prev, summary: event.target.value }))}
            className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
            rows={3}
          />
          <textarea
            required
            placeholder={t("admin.form.details")}
            value={trendForm.details}
            onChange={(event) => setTrendForm((prev) => ({ ...prev, details: event.target.value }))}
            className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
            rows={4}
          />
          <textarea
            placeholder={t("admin.form.content")}
            value={trendForm.content}
            onChange={(event) => setTrendForm((prev) => ({ ...prev, content: event.target.value }))}
            className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
            rows={4}
          />
          <input
            placeholder={t("admin.form.tags")}
            value={trendForm.tags}
            onChange={(event) => setTrendForm((prev) => ({ ...prev, tags: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <select
            value={trendForm.intensity}
            onChange={(event) =>
              setTrendForm((prev) => ({ ...prev, intensity: event.target.value as TrendIntensity }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          >
            {intensityOptions.map((option) => (
              <option key={option} value={option}>
                {t(`admin.form.intensity.${option}`)}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 shadow-sm">
            <input
              type="checkbox"
              checked={trendForm.isPremium}
              onChange={(event) =>
                setTrendForm((prev) => ({ ...prev, isPremium: event.target.checked }))
              }
            />
            {t("admin.form.isPremium")}
          </label>
          <input
            type="date"
            value={trendForm.publishedAt}
            onChange={(event) =>
              setTrendForm((prev) => ({ ...prev, publishedAt: event.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="primary-button disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? t("admin.form.saving") : t("admin.trend.submit")}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-6 rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-dancheongNavy">{t("admin.event.title")}</h2>
        <p className="text-sm text-slate-500">{t("admin.event.description")}</p>
        <form onSubmit={handleEventSubmit} className="grid gap-4 md:grid-cols-2">
          <input
            required
            placeholder={t("admin.form.title")}
            value={eventForm.title}
            onChange={(event) => setEventForm((prev) => ({ ...prev, title: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <input
            required
            placeholder={t("admin.form.location")}
            value={eventForm.location}
            onChange={(event) =>
              setEventForm((prev) => ({ ...prev, location: event.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <textarea
            required
            placeholder={t("admin.form.details")}
            value={eventForm.description}
            onChange={(event) =>
              setEventForm((prev) => ({ ...prev, description: event.target.value }))
            }
            className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
            rows={3}
          />
          <input
            type="date"
            value={eventForm.date}
            onChange={(event) => setEventForm((prev) => ({ ...prev, date: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <input
            type="time"
            value={eventForm.time}
            onChange={(event) => setEventForm((prev) => ({ ...prev, time: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <select
            value={eventForm.category}
            onChange={(event) =>
              setEventForm((prev) => ({
                ...prev,
                category: event.target.value as KCultureEvent["category"]
              }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          >
            <option value="concert">{t("admin.event.category.concert")}</option>
            <option value="traditional">{t("admin.event.category.traditional")}</option>
            <option value="pop-up">{t("admin.event.category.popup")}</option>
            <option value="festival">{t("admin.event.category.festival")}</option>
          </select>
          <input
            placeholder={t("admin.form.price")}
            value={eventForm.price}
            onChange={(event) => setEventForm((prev) => ({ ...prev, price: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <input
            placeholder={t("admin.form.imageUrl")}
            value={eventForm.imageUrl}
            onChange={(event) =>
              setEventForm((prev) => ({ ...prev, imageUrl: event.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <input
            placeholder={t("admin.form.bookingUrl")}
            value={eventForm.bookingUrl}
            onChange={(event) =>
              setEventForm((prev) => ({ ...prev, bookingUrl: event.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <textarea
            placeholder={t("admin.form.longDescription")}
            value={eventForm.longDescription}
            onChange={(event) =>
              setEventForm((prev) => ({ ...prev, longDescription: event.target.value }))
            }
            className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
            rows={4}
          />
          <textarea
            placeholder={t("admin.form.tips")}
            value={eventForm.tips}
            onChange={(event) => setEventForm((prev) => ({ ...prev, tips: event.target.value }))}
            className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
            rows={3}
          />
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="primary-button disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? t("admin.form.saving") : t("admin.event.submit")}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-6 rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-dancheongNavy">{t("admin.phrase.title")}</h2>
        <p className="text-sm text-slate-500">{t("admin.phrase.description")}</p>
        <form onSubmit={handlePhraseSubmit} className="grid gap-4 md:grid-cols-2">
          <input
            required
            placeholder={t("admin.form.korean")}
            value={phraseForm.korean}
            onChange={(event) => setPhraseForm((prev) => ({ ...prev, korean: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <input
            required
            placeholder={t("admin.form.transliteration")}
            value={phraseForm.transliteration}
            onChange={(event) =>
              setPhraseForm((prev) => ({ ...prev, transliteration: event.target.value }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          />
          <textarea
            required
            placeholder={t("admin.form.french")}
            value={phraseForm.french}
            onChange={(event) =>
              setPhraseForm((prev) => ({ ...prev, french: event.target.value }))
            }
            className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
            rows={2}
          />
          <textarea
            placeholder={t("admin.form.culturalNote")}
            value={phraseForm.culturalNote}
            onChange={(event) =>
              setPhraseForm((prev) => ({ ...prev, culturalNote: event.target.value }))
            }
            className="md:col-span-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
            rows={3}
          />
          <select
            value={phraseForm.category}
            onChange={(event) =>
              setPhraseForm((prev) => ({ ...prev, category: event.target.value as PhraseCategory }))
            }
            className="rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus:border-hanBlue focus:outline-none focus:ring-1 focus:ring-hanBlue"
          >
            {phraseCategories.map((category) => (
              <option key={category} value={category}>
                {t(`phrasebook.category.${category}`)}
              </option>
            ))}
          </select>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="primary-button disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? t("admin.form.saving") : t("admin.phrase.submit")}
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}
