declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
let isLoaded = false;

export function initAnalytics() {
  if (isLoaded || typeof window === "undefined" || !MEASUREMENT_ID) {
    if (typeof window !== "undefined") {
      console.info("[GA] init skipped", {
        isLoaded,
        hasWindow: typeof window !== "undefined",
        measurementId: MEASUREMENT_ID
      });
    }
    return;
  }

  console.info("[GA] init start", MEASUREMENT_ID);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, { debug_mode: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  isLoaded = true;
  console.info("[GA] gtag script appended");
}

export function trackPageView(path: string, title: string) {
  if (typeof window === "undefined" || !window.gtag || !MEASUREMENT_ID) {
    if (typeof window !== "undefined") {
      console.warn("[GA] track skipped", {
        hasGtag: Boolean(window.gtag),
        measurementId: MEASUREMENT_ID,
        path,
        title
      });
    }
    return;
  }
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    send_to: MEASUREMENT_ID,
    debug_mode: true
  });
}
