import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TrendsPage from "./pages/TrendsPage";
import EventsPage from "./pages/EventsPage";
import PhrasebookPage from "./pages/PhrasebookPage";
import SubscribePage from "./pages/SubscribePage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RequireAuth from "./components/RequireAuth";
import TrendDetailPage from "./pages/TrendDetailPage";
import EventDetailPage from "./pages/EventDetailPage";
import CultureTestPage from "./pages/CultureTestPage";
import ProfilePage from "./pages/ProfilePage";
import LocalizedLandingPage from "./pages/LocalizedLandingPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/:lang(fr|ko|ja|en)" element={<LocalizedLandingPage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/trends/:id" element={<TrendDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/phrasebook" element={<PhrasebookPage />} />
        <Route path="/culture-test" element={<CultureTestPage />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route
          path="/admin"
          element={
            <RequireAuth requireAdmin>
              <AdminPage />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
