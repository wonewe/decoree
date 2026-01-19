import HeroSection from "../components/HeroSection";
import WeeklyTrendDecoder from "../components/WeeklyTrendDecoder";
// import EventCalendar from "../components/EventCalendar"; // 임시 숨김
// import PersonalizedPhrasebook from "../components/PersonalizedPhrasebook"; // 임시 숨김
import PopupRadarPreview from "../components/PopupRadarPreview";
import TutoringPreview from "../components/TutoringPreview";
import MembershipPreview from "../components/MembershipPreview";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WeeklyTrendDecoder />
      {/* <EventCalendar preview /> 임시 숨김 */}
      <PopupRadarPreview />
      <TutoringPreview />
      <MembershipPreview />
      {/* <PersonalizedPhrasebook /> 임시 숨김 */}
    </>
  );
}
