import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { I18nProvider } from "./shared/i18n";
import { AuthProvider } from "./shared/auth";
import { BookmarkProvider } from "./shared/bookmarks";
import { initAnalytics, trackPageView } from "./shared/analytics";
import "./styles/index.css";

(async () => {
  await initAnalytics();
  trackPageView(window.location.pathname + window.location.search, document.title);

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <BookmarkProvider>
            <I18nProvider>
              <App />
            </I18nProvider>
          </BookmarkProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
})();
