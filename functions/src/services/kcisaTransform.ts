import { BaseEvent, KcisaEvent } from "../types/event";

/**
 * Parse KCISA period string to extract start and end dates
 * Format: "2024.11.20~2024.12.20" or "2024.11.20"
 * @param {string} period - Period string from KCISA API
 * @return {{startDate: string; endDate: string}} Parsed dates
 */
const parsePeriod = (period: string): { startDate: string; endDate: string } => {
  if (!period) {
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
    return { startDate: today, endDate: today };
  }

  // Remove spaces and split by ~
  const cleaned = period.replace(/\s/g, "");
  const parts = cleaned.split("~");

  const formatDate = (dateStr: string): string => {
    // Convert "2024.11.20" to "20241120"
    return dateStr.replace(/\./g, "");
  };

  const startDate = formatDate(parts[0]);
  const endDate = parts.length > 1 ? formatDate(parts[1]) : startDate;

  return { startDate, endDate };
};

/**
 * Map KCISA type to frontend category
 * @param {string} type - Event type from KCISA
 * @return {string} Frontend category name
 */
const mapCategory = (type: string): string => {
  const categoryMap: Record<string, string> = {
    "연극": "theatre",
    "뮤지컬": "theatre",
    "음악": "concert",
    "콘서트": "concert",
    "전시": "atelier",
    "무용": "traditional",
    "클래식": "concert",
    "국악": "traditional",
    "페스티벌": "festival",
    "축제": "festival",
  };

  return categoryMap[type] || "concert";
};

/**
 * Generate unique ID from KCISA event data
 * Use title + start date hash
 * @param {KcisaEvent} event - KCISA event object
 * @return {string} Unique event ID
 */
const generateId = (event: KcisaEvent): string => {
  const { startDate } = parsePeriod(event.period);
  const normalized = event.title.replace(/\s/g, "").toLowerCase();
  const hash = normalized + startDate;

  // Create simple hash
  let hashNum = 0;
  for (let i = 0; i < hash.length; i++) {
    hashNum = ((hashNum << 5) - hashNum) + hash.charCodeAt(i);
    hashNum = hashNum & hashNum; // Convert to 32bit integer
  }

  return `kcisa_${Math.abs(hashNum)}`;
};

/**
 * Normalize KCISA event data to BaseEvent format
 * @param {KcisaEvent} kcisaData - Raw KCISA event data
 * @return {BaseEvent} Normalized event
 */
export const normalizeKcisaData = (kcisaData: KcisaEvent): BaseEvent => {
  const { startDate, endDate } = parsePeriod(kcisaData.period);

  // Extract description and longDescription
  const description = kcisaData.description?.substring(0, 200) || kcisaData.title;
  const longDescription = kcisaData.description
    ? kcisaData.description.split(/\n+/).filter((p) => p.trim().length > 0)
    : [];

  return {
    id: generateId(kcisaData),
    source: "kcisa",
    category: mapCategory(kcisaData.type),
    title: kcisaData.title,
    description,
    startDate,
    endDate,
    time: kcisaData.eventPeriod || "시간 미정",
    price: kcisaData.charge || "가격 미정",
    location: kcisaData.eventSite || "장소 미정",
    imageUrl: kcisaData.imageObject || "",
    longDescription: longDescription.length > 0 ? longDescription : ["상세 정보가 제공되지 않습니다."],
    tips: kcisaData.url ? [`공식 URL: ${kcisaData.url}`] : [],
  };
};
