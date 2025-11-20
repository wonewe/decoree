import { XMLParser } from 'fast-xml-parser';
import { BaseEvent, KopisEventDetail } from '../types/event';

const parser = new XMLParser({
    ignoreAttributes: true,
    parseTagValue: true,
});

export const parseXML = (xmlData: string): any => {
    return parser.parse(xmlData);
};

export const normalizeEventData = (
    kopisData: KopisEventDetail,
    baseLang: string = 'English'
): BaseEvent => {
    // Handle styurls (detail images)
    let detailImages: string[] = [];
    if (kopisData.styurls && kopisData.styurls.styurl) {
        detailImages = Array.isArray(kopisData.styurls.styurl)
            ? kopisData.styurls.styurl
            : [kopisData.styurls.styurl];
    }

    return {
        id: kopisData.mt20id,
        category: kopisData.genrenm || 'Performance', // Default category
        title: kopisData.prfnm,
        summary: kopisData.sty || '', // Use sty as summary initially
        startDate: kopisData.prfpdfrom,
        endDate: kopisData.prfpdto,
        time: kopisData.dtguidance,
        price: kopisData.pcseguidance,
        place: kopisData.fcltynm,
        mainImage: kopisData.poster,
        detailImages: detailImages,
        content: kopisData.sty || '', // Use sty as content initially
    };
};
