import { fetchEventList, fetchEventDetail } from "./services/kopis";
import { normalizeEventData } from "./services/transform";
import { fetchKcisaEvents } from "./services/kcisa";
import { normalizeKcisaData } from "./services/kcisaTransform";
import { deduplicateEvents } from "./services/deduplication";
import { translateEvent } from "./services/translate";
import { saveEventToFirestore } from "./services/firestore";
import { uploadKopisImage } from "./services/storage";
import {
  createSyncStatus,
  updateSyncStatus,
  completeSyncStatus,
  failSyncStatus,
} from "./services/syncStatus";
import { BaseEvent, LocalizedEvent, SupportedLanguage } from "./types/event";

export const updateEvents = async (
  startDate: string,
  endDate: string,
  syncId?: string,
  baseLang: SupportedLanguage = "en",
  targetLangs: SupportedLanguage[] = ["ko", "en", "fr", "ja"]
) => {
  console.log(`Starting event update from ${startDate} to ${endDate}`);

  try {
    // 1. Fetch from both KOPIS and KCISA
    console.log("Fetching from KOPIS...");
    const kopisListItems = await fetchEventList(startDate, endDate, 1, 10);
    console.log(`Found ${kopisListItems.length} events from KOPIS.`);

    console.log("Fetching from KCISA...");
    const kcisaEvents = await fetchKcisaEvents("", "", 100, 1);
    console.log(`Found ${kcisaEvents.length} events from KCISA.`);

    // 2. Process KOPIS events (需요 details)
    const kopisBaseEvents: BaseEvent[] = [];
    for (const item of kopisListItems) {
      const detail = await fetchEventDetail(item.mt20id);
      if (detail) {
        kopisBaseEvents.push(normalizeEventData(detail));
      }
    }

    // 3. Process KCISA events
    const kcisaBaseEvents: BaseEvent[] = kcisaEvents.map((e) => normalizeKcisaData(e));

    // 4. Merge and deduplicate
    const allEvents = [...kopisBaseEvents, ...kcisaBaseEvents];
    const uniqueEvents = deduplicateEvents(allEvents);
    console.log(`After deduplication: ${uniqueEvents.length} unique events`);

    // Initialize sync status
    if (syncId) {
      await createSyncStatus(syncId, uniqueEvents.length);
    }

    // 5. Process each unique event
    for (let i = 0; i < uniqueEvents.length; i++) {
      const baseEvent = uniqueEvents[i];
      console.log(`Processing event ${i + 1}/${uniqueEvents.length}: ${baseEvent.title}`);

      // Update progress
      if (syncId) {
        await updateSyncStatus(syncId, {
          processed: i,
          progress: Math.round((i / uniqueEvents.length) * 100),
          message: `처리 중: ${baseEvent.title} (${i + 1}/${uniqueEvents.length})`,
        });
      }

      // Upload poster image to Firebase Storage
      if (baseEvent.imageUrl) {
        const uploadedImageUrl = await uploadKopisImage(baseEvent.imageUrl, baseEvent.id);
        baseEvent.imageUrl = uploadedImageUrl;
      }

      // Translate
      const translations = await translateEvent(baseEvent, targetLangs);

      // Prepare Localized Events
      const localizedEvents: LocalizedEvent[] = targetLangs.map((lang) => {
        const trans = translations[lang];
        return {
          ...baseEvent,
          language: lang,
          title: trans.title,
          description: trans.description,
          longDescription: trans.longDescription,
          tips: trans.tips,
        };
      });

      // Save to Firestore
      await saveEventToFirestore(baseEvent.id, localizedEvents);
    }

    console.log("Event update completed successfully.");

    // Mark as completed
    if (syncId) {
      await completeSyncStatus(syncId);
    }
  } catch (error) {
    console.error("Error in updateEvents:", error);

    // Mark as failed
    if (syncId) {
      await failSyncStatus(syncId, String(error));
    }

    throw error;
  }
};
