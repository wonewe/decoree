import { fetchEventList, fetchEventDetail } from "./services/kopis";
import { normalizeEventData } from "./services/transform";
import { translateEvent } from "./services/translate";
import { saveEventToFirestore } from "./services/firestore";
import { uploadKopisImage } from "./services/storage";
import { LocalizedEvent, SupportedLanguage } from "./types/event";

export const updateEvents = async (
  startDate: string,
  endDate: string,
  baseLang: SupportedLanguage = "en",
  targetLangs: SupportedLanguage[] = ["ko", "en", "fr", "ja"]
) => {
  console.log(`Starting event update from ${startDate} to ${endDate}`);

  try {
    // 1. Fetch List
    const events = await fetchEventList(startDate, endDate, 1, 10); // Limit to 10 for safety/demo
    console.log(`Found ${events.length} events.`);

    for (const item of events) {
      const eventId = item.mt20id;
      console.log(`Processing event: ${eventId} - ${item.prfnm}`);

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
      baseEvent.imageUrl = uploadedImageUrl; // Replace with Storage URL

      // 5. Translate
      // We need to translate to all target languages.
      // The baseEvent is technically in "KOPIS original language" (likely Korean mixed with English).
      // But the requirement says "User inputs in Base Language".
      // Here we are fetching from API, so we treat the API result as the source.
      // We will translate to ALL required languages.
      const translations = await translateEvent(baseEvent, targetLangs);

      // 6. Prepare Localized Events
      const localizedEvents: LocalizedEvent[] = targetLangs.map((lang) => {
        const trans = translations[lang];
        return {
          ...baseEvent,
          language: lang, // Add language field for frontend
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
  } catch (error) {
    console.error("Error in updateEvents:", error);
    throw error;
  }
};
