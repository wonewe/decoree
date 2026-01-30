import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { I18nProvider } from "./shared/i18n";
import { AuthProvider } from "./shared/auth";
import { BookmarkProvider } from "./shared/bookmarks";
import { initAnalytics, trackPageView } from "./shared/analytics";
import "./styles/index.css";

// Defer analytics initialization to improve initial load
const initApp = async () => {
  // Initialize analytics in the background
  initAnalytics().catch(console.error);
  
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <BookmarkProvider>
              <I18nProvider>
                <App />
              </I18nProvider>
            </BookmarkProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
  
  // Track page view after initial render (defer to improve initial load)
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      trackPageView(window.location.pathname + window.location.search, document.title);
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      trackPageView(window.location.pathname + window.location.search, document.title);
    }, 100);
  }
};

initApp();
