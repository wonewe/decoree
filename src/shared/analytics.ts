declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
let isLoaded = false;
let initPromise: Promise<void> | null = null;

export function initAnalytics() {
  if (typeof window === "undefined" || !MEASUREMENT_ID) {
    console.warn("[GA] init skipped - no window or measurement id");
    return Promise.resolve();
  }

  if (isLoaded) {
    return Promise.resolve();
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = new Promise<void>((resolve) => {
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
      isLoaded = true;
      resolve();
    };
    script.onerror = (error) => {
      console.error("[GA] script failed to load", error);
      resolve();
    };
    document.head.appendChild(script);
  });

  return initPromise;
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
