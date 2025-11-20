import { BaseEvent } from "../types/event";

/**
 * Normalize title for duplicate detection
 * Remove spaces, special characters, and convert to lowercase
 */
const normalizeTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\w\u3131-\uD79D]/g, ""); // Keep Korean characters
};

/**
 * Check if two date ranges overlap
 */
const datesOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  return start1 <= end2 && start2 <= end1;
};

/**
 * Calculate completeness score for an event
 * Higher score = more complete data
 */
const calculateCompleteness = (event: BaseEvent): number => {
  let score = 0;

  if (event.description && event.description.length > 50) score += 2;
  if (event.longDescription && event.longDescription.length > 1) score += 2;
  if (event.longDescription && !event.longDescription[0].includes("정보가 제공되지 않습니다")) score += 1;
  if (event.tips && event.tips.length > 0) score += 1;
  if (event.imageUrl && event.imageUrl.length > 0) score += 2;
  if (event.time && event.time !== "공연시간 미정" && event.time !== "시간 미정") score += 1;
  if (event.price && event.price !== "가격 미정") score += 1;

  return score;
};

/**
 * Remove duplicate events from combined list
 * @param {BaseEvent[]} events - Combined events from multiple sources
 * @return {BaseEvent[]} Deduplicated events
 */
export const deduplicateEvents = (events: BaseEvent[]): BaseEvent[] => {
  const seen = new Map<string, BaseEvent>();

  for (const event of events) {
    const normalized = normalizeTitle(event.title);

    // Check if we've seen this title before
    const existing = seen.get(normalized);

    if (!existing) {
      // New event, add it
      seen.set(normalized, event);
      continue;
    }

    // Check if dates overlap
    if (datesOverlap(event.startDate, event.endDate, existing.startDate, existing.endDate)) {
      // Likely duplicate - keep the one with better data
      const eventScore = calculateCompleteness(event);
      const existingScore = calculateCompleteness(existing);

      if (eventScore > existingScore) {
        // New event has better data
        seen.set(normalized, event);
      } else if (eventScore === existingScore && event.source === "kopis") {
        // Equal quality, prefer KOPIS (better image quality)
        seen.set(normalized, event);
      }
      // Otherwise keep existing
    } else {
      // Different date ranges - probably different events with same name
      // Keep both by adding to map with unique key
      seen.set(`${normalized}_${event.startDate}`, event);
    }
  }

  return Array.from(seen.values());
};
