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

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/trends/:id" element={<TrendDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/phrasebook" element={<PhrasebookPage />} />
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
