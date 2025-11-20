import { fetchEventList, fetchEventDetail } from "./services/kopis";
import { normalizeEventData } from "./services/transform";
import { translateEvent } from "./services/translate";
import { saveEventToFirestore } from "./services/firestore";
import { uploadKopisImage } from "./services/storage";
import {
  createSyncStatus,
  updateSyncStatus,
  completeSyncStatus,
  failSyncStatus,
} from "./services/syncStatus";
import { LocalizedEvent, SupportedLanguage } from "./types/event";

export const updateEvents = async (
  startDate: string,
  endDate: string,
  syncId?: string,
  baseLang: SupportedLanguage = "en",
  targetLangs: SupportedLanguage[] = ["ko", "en", "fr", "ja"]
) => {
  console.log(`Starting event update from ${startDate} to ${endDate}`);

  try {
    // 1. Fetch List
    const events = await fetchEventList(startDate, endDate, 1, 10);
    console.log(`Found ${events.length} events.`);

    // Initialize sync status
    if (syncId) {
      await createSyncStatus(syncId, events.length);
    }

    for (let i = 0; i < events.length; i++) {
      const item = events[i];
      const eventId = item.mt20id;
      console.log(`Processing event ${i + 1}/${events.length}: ${eventId} - ${item.prfnm}`);

      // Update progress
      if (syncId) {
        await updateSyncStatus(syncId, {
          processed: i,
          progress: Math.round((i / events.length) * 100),
          message: `처리 중: ${item.prfnm} (${i + 1}/${events.length})`,
        });
      }

      // 2. Fetch Detail
      const detail = await fetchEventDetail(eventId);
      if (!detail) {
        console.warn(`Skipping ${eventId}: No detail found.`);
        continue;
      }

      // 3. Normalize (Base Event)
      const baseEvent = normalizeEventData(detail);

      // 4. Upload poster image to Firebase Storage
      const uploadedImageUrl = await uploadKopisImage(baseEvent.imageUrl, eventId);
      baseEvent.imageUrl = uploadedImageUrl;

      // 5. Translate
      const translations = await translateEvent(baseEvent, targetLangs);

      // 6. Prepare Localized Events
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

      // 7. Save to Firestore
      await saveEventToFirestore(eventId, localizedEvents);
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
