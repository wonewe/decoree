export interface KopisEventListItem {
    mt20id: string; // Event ID
    prfnm: string; // Title
    prfpdfrom: string; // Start Date
    prfpdto: string; // End Date
    fcltynm: string; // Place Name
    poster: string; // Poster Image URL
    genrenm: string; // Genre
    openrun: string; // Open Run
    prfruntime: string; // Runtime
    prfage: string; // Age Rating
}

export interface KopisEventDetail {
    mt20id: string;
    prfnm: string;
    prfpdfrom: string;
    prfpdto: string;
    fcltynm: string;
    poster: string;
    genrenm: string;
    prfruntime: string;
    prfage: string;
    pcseguidance: string; // Price
    sty: string; // Summary/Content
    styurls?: {
        styurl: string[];
    }; // Detail Images
    dtguidance: string; // Time
}

export interface KcisaEvent {
    title: string;
    type: string; // 분야 (연극, 뮤지컬, 음악, 전시 등)
    period: string; // 기간 (예: 2024.11.20~2024.12.20)
    eventPeriod: string; // 시간 (예: 19:00~21:00)
    eventSite: string; // 장소
    charge: string; // 금액
    url: string; // 링크
    imageObject: string; // 썸네일 URL
    description: string; // 설명
    viewCount?: number; // 조회수
}

export interface BaseEvent {
    id: string;
    source: "kopis" | "kcisa"; // Track data origin
    category: string;
    title: string;
    description: string; // Short description (from sty)
    startDate: string;
    endDate: string;
    time: string;
    price: string;
    location: string; // Changed from 'place'
    imageUrl: string; // Changed from 'mainImage'
    longDescription: string[]; // Array for detailed content
    tips: string[]; // Additional tips/info
}

export interface LocalizedEvent extends BaseEvent {
    language: "ko" | "en" | "fr" | "ja"; // Frontend expects 'language' not 'lang'
    createdAt?: any; // Firestore Timestamp
    updatedAt?: any; // Firestore Timestamp
}

export type SupportedLanguage = "ko" | "en" | "fr" | "ja";
