import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { I18nProvider } from "./shared/i18n";
import { AuthProvider } from "./shared/auth";
import { BookmarkProvider } from "./shared/bookmarks";
import { PremiumAccessProvider } from "./shared/premiumAccess";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BookmarkProvider>
          <PremiumAccessProvider>
            <I18nProvider>
              <App />
            </I18nProvider>
          </PremiumAccessProvider>
        </BookmarkProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
