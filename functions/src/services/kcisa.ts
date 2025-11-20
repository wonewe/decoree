import axios from "axios";
import { KcisaEvent } from "../types/event";

const KCISA_API_URL = "http://api.kcisa.kr/openapi/CNV_060/request";

/**
 * Fetch events from KCISA Culture Portal API
 * @param {string} dtype - Category filter (연극, 뮤지컬, 음악, 전시 등)
 * @param {string} title - Search keyword (minimum 2 characters)
 * @param {number} numOfRows - Number of results per page
 * @param {number} pageNo - Page number
 * @return {Promise<KcisaEvent[]>} Array of events
 */
export const fetchKcisaEvents = async (
  dtype = "",
  title = "",
  numOfRows = 100,
  pageNo = 1
): Promise<KcisaEvent[]> => {
  if (!process.env.KCISA_API_KEY) {
    console.warn("KCISA_API_KEY not found. Skipping KCISA fetch.");
    return [];
  }

  try {
    const response = await axios.get(KCISA_API_URL, {
      params: {
        serviceKey: process.env.KCISA_API_KEY,
        dtype,
        title,
        numOfRows,
        pageNo,
      },
    });

    // KCISA returns JSON directly
    const data = response.data;

    // Handle different response structures
    if (data.response && data.response.body) {
      const items = data.response.body.items;
      if (Array.isArray(items)) {
        return items as KcisaEvent[];
      } else if (items && items.item) {
        // Sometimes wrapped in item object
        return Array.isArray(items.item) ? items.item : [items.item];
      }
    }

    // Direct array response
    if (Array.isArray(data)) {
      return data as KcisaEvent[];
    }

    console.warn("Unexpected KCISA response format:", data);
    return [];
  } catch (error) {
    console.error("Error fetching from KCISA:", error);
    return [];
  }
};
