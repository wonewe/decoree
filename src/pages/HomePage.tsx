import HeroSection from "../components/HeroSection";
import WeeklyTrendDecoder from "../components/WeeklyTrendDecoder";
import EventCalendar from "../components/EventCalendar";
import PersonalizedPhrasebook from "../components/PersonalizedPhrasebook";
import PopupRadarPreview from "../components/PopupRadarPreview";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WeeklyTrendDecoder />
      <EventCalendar preview />
      <PopupRadarPreview />
      <PersonalizedPhrasebook />
    </>
  );
}
