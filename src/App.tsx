import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TrendsPage from "./pages/TrendsPage";
import EventsPage from "./pages/EventsPage";
import PhrasebookPage from "./pages/PhrasebookPage";
import SubscribePage from "./pages/SubscribePage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/phrasebook" element={<PhrasebookPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
