declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
let gtagReady = false;
const pendingEvents: Array<{ path: string; title?: string }> = [];

export function initAnalytics(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !MEASUREMENT_ID) {
      console.warn("[GA] init skipped - no window or measurement id");
      resolve();
      return;
    }

    if (gtagReady) {
      resolve();
      return;
    }

    if (typeof window.gtag === "function") {
      gtagReady = true;
      resolve();
      return;
    }

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    }
    window.gtag = gtag;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    script.onload = () => {
      console.info("[GA] gtag loaded and initialized");
      window.gtag?.("js", new Date());
      window.gtag?.("config", MEASUREMENT_ID, { debug_mode: true });
      gtagReady = true;
      flushPendingEvents();
      resolve();
    };
    script.onerror = (err) => {
      console.error("[GA] script failed to load", err);
      resolve();
    };

    document.head.appendChild(script);
  });
}

export function trackPageView(path: string, title?: string) {
  if (!gtagReady || typeof window.gtag !== "function") {
    console.warn("[GA] gtag not ready, event queued", { path, title });
    pendingEvents.push({ path, title });
    return;
  }

  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title ?? document.title,
    send_to: MEASUREMENT_ID
  });
  console.info("[GA] page_view sent", { path });
}

function flushPendingEvents() {
  console.info(`[GA] flushing ${pendingEvents.length} queued events`);
  while (pendingEvents.length > 0) {
    const ev = pendingEvents.shift();
    if (ev) {
      trackPageView(ev.path, ev.title);
    }
  }
}
