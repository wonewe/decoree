/**
 * 구조화 데이터(JSON-LD) 유틸리티 함수
 */

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    "@type": "ContactPoint";
    email?: string;
    contactType?: string;
  };
}

export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export interface ArticleSchema {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  image: string | string[];
  datePublished: string;
  dateModified?: string;
  author?: {
    "@type": "Person" | "Organization";
    name: string;
    url?: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
}

export interface EventSchema {
  "@context": "https://schema.org";
  "@type": "Event";
  name: string;
  description: string;
  image?: string | string[];
  startDate: string;
  endDate?: string;
  eventStatus?: "https://schema.org/EventScheduled" | "https://schema.org/EventCancelled" | "https://schema.org/EventPostponed";
  eventAttendanceMode?: "https://schema.org/OfflineEventAttendanceMode" | "https://schema.org/OnlineEventAttendanceMode" | "https://schema.org/MixedEventAttendanceMode";
  location?: {
    "@type": "Place";
    name?: string;
    address?: {
      "@type": "PostalAddress";
      addressLocality?: string;
      addressCountry?: string;
    };
  };
  organizer?: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
  offers?: {
    "@type": "Offer";
    price?: string;
    priceCurrency?: string;
    url?: string;
    availability?: string;
  };
}

/**
 * Organization 구조화 데이터 생성
 */
export function generateOrganizationSchema(
  name: string,
  url: string,
  options?: {
    logo?: string;
    description?: string;
    sameAs?: string[];
    email?: string;
  }
): OrganizationSchema {
  const schema: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url
  };

  if (options?.logo) {
    schema.logo = options.logo;
  }

  if (options?.description) {
    schema.description = options.description;
  }

  if (options?.sameAs && options.sameAs.length > 0) {
    schema.sameAs = options.sameAs;
  }

  if (options?.email) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      email: options.email,
      contactType: "customer service"
    };
  }

  return schema;
}

/**
 * WebSite 구조화 데이터 생성
 */
export function generateWebSiteSchema(
  name: string,
  url: string,
  options?: {
    description?: string;
    searchUrl?: string;
  }
): WebSiteSchema {
  const schema: WebSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url
  };

  if (options?.description) {
    schema.description = options.description;
  }

  if (options?.searchUrl) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: options.searchUrl
      },
      "query-input": "required name=search_term_string"
    };
  }

  return schema;
}

/**
 * Article 구조화 데이터 생성
 */
export function generateArticleSchema(
  headline: string,
  description: string,
  image: string | string[],
  datePublished: string,
  publisherName: string,
  options?: {
    dateModified?: string;
    authorName?: string;
    authorUrl?: string;
    pageUrl?: string;
    publisherLogo?: string;
  }
): ArticleSchema {
  const schema: ArticleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: Array.isArray(image) ? image : [image],
    datePublished,
    publisher: {
      "@type": "Organization",
      name: publisherName
    }
  };

  if (options?.dateModified) {
    schema.dateModified = options.dateModified;
  }

  if (options?.authorName) {
    schema.author = {
      "@type": "Person",
      name: options.authorName
    };
    if (options?.authorUrl) {
      schema.author.url = options.authorUrl;
    }
  }

  if (options?.publisherLogo) {
    schema.publisher.logo = {
      "@type": "ImageObject",
      url: options.publisherLogo
    };
  }

  if (options?.pageUrl) {
    schema.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": options.pageUrl
    };
  }

  return schema;
}

/**
 * Event 구조화 데이터 생성
 */
export function generateEventSchema(
  name: string,
  description: string,
  startDate: string,
  options?: {
    endDate?: string;
    image?: string | string[];
    locationName?: string;
    locationAddress?: string;
    organizerName?: string;
    organizerUrl?: string;
    price?: string;
    priceCurrency?: string;
    bookingUrl?: string;
  }
): EventSchema {
  const schema: EventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode"
  };

  if (options?.endDate) {
    schema.endDate = options.endDate;
  }

  if (options?.image) {
    schema.image = Array.isArray(options.image) ? options.image : [options.image];
  }

  if (options?.locationName || options?.locationAddress) {
    schema.location = {
      "@type": "Place"
    };
    if (options.locationName) {
      schema.location.name = options.locationName;
    }
    if (options.locationAddress) {
      schema.location.address = {
        "@type": "PostalAddress",
        addressLocality: options.locationAddress,
        addressCountry: "KR"
      };
    }
  }

  if (options?.organizerName) {
    schema.organizer = {
      "@type": "Organization",
      name: options.organizerName
    };
    if (options?.organizerUrl) {
      schema.organizer.url = options.organizerUrl;
    }
  }

  if (options?.price || options?.bookingUrl) {
    schema.offers = {
      "@type": "Offer",
      availability: "https://schema.org/InStock"
    };
    if (options.price) {
      schema.offers.price = options.price;
      schema.offers.priceCurrency = options.priceCurrency || "KRW";
    }
    if (options.bookingUrl) {
      schema.offers.url = options.bookingUrl;
    }
  }

  return schema;
}

/**
 * 구조화 데이터를 JSON-LD 스크립트 태그로 변환
 */
export function generateStructuredDataScript(schema: object): string {
  return JSON.stringify(schema, null, 2);
}
