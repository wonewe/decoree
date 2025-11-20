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

export interface BaseEvent {
    id: string;
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
