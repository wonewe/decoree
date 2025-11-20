import { XMLParser } from "fast-xml-parser";
import { BaseEvent, KopisEventDetail } from "../types/event";

const parser = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: true,
});

export const parseXML = (xmlData: string): any => {
  return parser.parse(xmlData);
};

export const normalizeEventData = (
  kopisData: KopisEventDetail
): BaseEvent => {
  // Handle styurls (detail images) - use for longDescription or tips
  let detailImages: string[] = [];
  if (kopisData.styurls && kopisData.styurls.styurl) {
    detailImages = Array.isArray(kopisData.styurls.styurl) ?
      kopisData.styurls.styurl :
      [kopisData.styurls.styurl];
  }

  // Extract longDescription from sty content (split by paragraphs)
  const longDescription = kopisData.sty
    ? kopisData.sty.split(/\n+/).filter((p) => p.trim().length > 0)
    : [];

  // Map KOPIS category to frontend EventCategory
  const categoryMap: Record<string, string> = {
    "연극": "theatre",
    "뮤지컬": "theatre",
    "콘서트": "concert",
    "무용": "traditional",
    "국악": "traditional",
    "클래식": "concert",
    "복합": "festival",
    "서커스/마술": "theatre",
    "대중음악": "concert",
  };

  return {
    id: kopisData.mt20id,
    source: "kopis",
    category: categoryMap[kopisData.genrenm] || "concert",
    title: kopisData.prfnm,
    description: kopisData.sty?.substring(0, 200) || kopisData.prfnm, // Short description
    startDate: kopisData.prfpdfrom,
    endDate: kopisData.prfpdto,
    time: kopisData.dtguidance || "공연시간 미정",
    price: kopisData.pcseguidance || "가격 미정",
    location: kopisData.fcltynm,
    imageUrl: kopisData.poster,
    longDescription: longDescription.length > 0 ? longDescription : ["공연 상세 정보가 제공되지 않습니다."],
    tips: detailImages.length > 0 ? [`상세 이미지: ${detailImages.length}장 제공`] : [],
  };
};
