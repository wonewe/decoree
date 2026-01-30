import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

// Critical pages - loaded immediately
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Lazy loaded pages - code splitting for better performance
const TrendsPage = lazy(() => import("./pages/TrendsPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const PhrasebookPage = lazy(() => import("./pages/PhrasebookPage"));
const TrendDetailPage = lazy(() => import("./pages/TrendDetailPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const CultureTestPage = lazy(() => import("./pages/CultureTestPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LocalizedLandingPage = lazy(() => import("./pages/LocalizedLandingPage"));
const PopupRadarPage = lazy(() => import("./pages/PopupRadarPage"));
const PopupDetailPage = lazy(() => import("./pages/PopupDetailPage"));
const PublicServicesGuidePage = lazy(() => import("./pages/PublicServicesGuidePage"));
const PublicServiceDetailPage = lazy(() => import("./pages/PublicServiceDetailPage"));
const AppTutorialHubPage = lazy(() => import("./pages/AppTutorialHubPage"));
const AppTutorialDetailPage = lazy(() => import("./pages/AppTutorialDetailPage"));
const StudentCommunityPage = lazy(() => import("./pages/StudentCommunityPage"));
const CommunityBoardDetailPage = lazy(() => import("./pages/CommunityBoardDetailPage"));
const TutoringLandingPage = lazy(() => import("./pages/TutoringLandingPage"));
const TutoringEnrollPage = lazy(() => import("./pages/TutoringEnrollPage"));
const TutoringMembershipPage = lazy(() => import("./pages/TutoringMembershipPage"));
const NewsletterPage = lazy(() => import("./pages/NewsletterPage"));
const NewsletterDetailPage = lazy(() => import("./pages/NewsletterDetailPage"));
const AdminListPage = lazy(() => import("./pages/AdminListPage"));
const AdminEditorPage = lazy(() => import("./pages/AdminEditorPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--ink)]" />
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}
