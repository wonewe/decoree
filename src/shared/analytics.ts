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

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  script.onload = () => {
    console.info("[GA] script loaded, initializing gtag");
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    }
    window.gtag = gtag;
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, { debug_mode: true });
  };

  document.head.appendChild(script);
  isLoaded = true;
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
