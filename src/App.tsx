import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TrendsPage from "./pages/TrendsPage";
import EventsPage from "./pages/EventsPage";
import PhrasebookPage from "./pages/PhrasebookPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminListPage from "./pages/AdminListPage";
import AdminEditorPage from "./pages/AdminEditorPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RequireAuth from "./components/RequireAuth";
import TrendDetailPage from "./pages/TrendDetailPage";
import EventDetailPage from "./pages/EventDetailPage";
import CultureTestPage from "./pages/CultureTestPage";
import ProfilePage from "./pages/ProfilePage";
import LocalizedLandingPage from "./pages/LocalizedLandingPage";
import PopupRadarPage from "./pages/PopupRadarPage";
import PopupDetailPage from "./pages/PopupDetailPage";
import PublicServicesGuidePage from "./pages/PublicServicesGuidePage";
import PublicServiceDetailPage from "./pages/PublicServiceDetailPage";
import AppTutorialHubPage from "./pages/AppTutorialHubPage";
import AppTutorialDetailPage from "./pages/AppTutorialDetailPage";
import StudentCommunityPage from "./pages/StudentCommunityPage";
import CommunityBoardDetailPage from "./pages/CommunityBoardDetailPage";
import TutoringLandingPage from "./pages/TutoringLandingPage";
import TutoringEnrollPage from "./pages/TutoringEnrollPage";
import TutoringMembershipPage from "./pages/TutoringMembershipPage";
import NewsletterPage from "./pages/NewsletterPage";
import NewsletterDetailPage from "./pages/NewsletterDetailPage";

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
        <Route path="/local-support/services" element={<PublicServicesGuidePage />} />
        <Route path="/local-support/services/:id" element={<PublicServiceDetailPage />} />
        <Route path="/local-support/apps" element={<AppTutorialHubPage />} />
        <Route path="/local-support/apps/:id" element={<AppTutorialDetailPage />} />
        <Route path="/local-support/community" element={<StudentCommunityPage />} />
        <Route path="/local-support/community/:id" element={<CommunityBoardDetailPage />} />
        <Route path="/culture-test" element={<CultureTestPage />} />
        <Route path="/popups" element={<PopupRadarPage />} />
        <Route path="/popups/:id" element={<PopupDetailPage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/newsletter/:id" element={<NewsletterDetailPage />} />
        <Route path="/tutoring" element={<TutoringLandingPage />} />
        <Route path="/tutoring/membership" element={<TutoringMembershipPage />} />
        <Route
          path="/tutoring/enroll"
          element={
            <RequireAuth>
              <TutoringEnrollPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth requireAdmin>
              <AdminListPage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/edit/:type/:id?"
          element={
            <RequireAuth requireAdmin>
              <AdminEditorPage />
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
