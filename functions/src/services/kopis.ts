import axios from "axios";
import {KopisEventDetail, KopisEventListItem} from "../types/event";
import {parseXML} from "./transform";

const KOPIS_BASE_URL = "http://www.kopis.or.kr/openApi/restful";
const API_KEY = process.env.KOPIS_API_KEY;

export const fetchEventList = async (
  startDate: string,
  endDate: string,
  page = 1,
  rows = 10
): Promise<KopisEventListItem[]> => {
  if (!API_KEY) {
    throw new Error("KOPIS_API_KEY is not defined");
  }

  try {
    const response = await axios.get(`${KOPIS_BASE_URL}/pblprfr`, {
      params: {
        service: API_KEY,
        stdate: startDate,
        eddate: endDate,
        cpage: page,
        rows: rows,
      },
      responseType: "text", // KOPIS returns XML
    });

    const parsed = parseXML(response.data);
    const dbs = parsed?.dbs;

    if (!dbs || !dbs.db) {
      return [];
    }

    // Handle single item vs array
    const list = Array.isArray(dbs.db) ? dbs.db : [dbs.db];
    return list as KopisEventListItem[];
  } catch (error) {
    console.error("Error fetching KOPIS event list:", error);
    throw error;
  }
};

export const fetchEventDetail = async (eventId: string): Promise<KopisEventDetail | null> => {
  if (!API_KEY) {
    throw new Error("KOPIS_API_KEY is not defined");
  }

  try {
    const response = await axios.get(`${KOPIS_BASE_URL}/pblprfr/${eventId}`, {
      params: {
        service: API_KEY,
      },
      responseType: "text",
    });

    const parsed = parseXML(response.data);
    const dbs = parsed?.dbs;

    if (!dbs || !dbs.db) {
      return null;
    }

    return dbs.db as KopisEventDetail;
  } catch (error) {
    console.error(`Error fetching KOPIS event detail for ${eventId}:`, error);
    return null;
  }
};
