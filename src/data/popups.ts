import type { SupportedLanguage } from "../shared/i18n";

export type PopupStatus = "now" | "soon";

export type PopupEvent = {
  id: string;
  language: SupportedLanguage;
  title: string;
  brand: string;
  window: string;
  status: PopupStatus;
  location: string;
  posterUrl: string;
  heroImageUrl: string;
  tags: string[];
  description: string;
  highlights: string[];
  details: string[];
  reservationUrl?: string;
};

export const POPUP_EVENTS: PopupEvent[] = [
  {
    id: "pop-paperhood-muzikt",
    language: "ko",
    title: "Paperhood x Muzikt Studio",
    brand: "Paperhood",
    window: "2024.06.01 - 06.24 • 11:00-20:00",
    status: "now",
    location: "Layered 성수 2F",
    posterUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    heroImageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80",
    tags: ["capsule", "dessert", "limited"],
    description:
      "아이웨어 캡슐과 한정 디저트를 동시에 공개하는 팝업. 선착순 30명에게 실크스크린 토트를 증정합니다.",
    highlights: [
      "아이웨어 커스터마이징 부스",
      "페어링 디저트 세트",
      "실크스크린 토트 현장 제작"
    ],
    details: [
      "Layered 성수 2층을 통째로 변신시킨 페이퍼후드 x 뮤지크트 스튜디오는 잔잔한 조명과 포스터 월로 구성돼 SNS 인증샷 명소로 떠올랐습니다.",
      "현장 DJ의 분위기 속에서 디저트 페어링을 즐기고, 아이웨어 피팅을 돕는 스타일리스트에게 상담을 받을 수 있습니다."
    ],
    reservationUrl: "https://www.instagram.com/layered_seongsu/"
  },
  {
    id: "pop-standoil-archive",
    language: "ko",
    title: "Stand Oil Archive Market",
    brand: "Stand Oil",
    window: "2024.06.20 - 06.28 • 12:00-21:00",
    status: "now",
    location: "뚝섬로 8길 스탠드오일 아카이브",
    posterUrl:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80",
    heroImageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80",
    tags: ["design", "workshop", "upcycling"],
    description:
      "가방 커스터마이징과 업사이클 코너, 15시 포스트카드 스탬프 세션으로 구성된 마켓.",
    highlights: [
      "한정 어카이브 피스 판매",
      "업사이클 워크숍",
      "포스트카드 스탬프 라운지"
    ],
    details: [
      "디자이너와 1:1 커스터마이징 상담을 받을 수 있고, 워크숍 존에서는 가죽 조각을 활용한 액세서리를 제작합니다.",
      "마켓에서 구매한 제품은 무료로 각인 서비스를 제공하며, 예약 고객에게는 페이스트리 세트가 제공됩니다."
    ],
    reservationUrl: "https://www.instagram.com/standoil.official/"
  },
  {
    id: "pop-oreo-rooftop",
    language: "ko",
    title: "OR.EO Rooftop Listening Bar",
    brand: "OR.EO",
    window: "2024.07.05 오픈 • 18:00-23:00",
    status: "soon",
    location: "성수로 7 OR.EO 루프탑",
    posterUrl:
      "https://images.unsplash.com/photo-1529333166437-1c1f6db0ed76?auto=format&fit=crop&w=1200&q=80",
    heroImageUrl:
      "https://images.unsplash.com/photo-1529333166437-1c1f6db0ed76?auto=format&fit=crop&w=1600&q=80",
    tags: ["nightlife", "playlist", "zero-proof"],
    description:
      "논알콜 칵테일과 성수 뷰가 있는 리스닝 바. 로컬 DJ 플레이리스트를 라이브로 감상하세요.",
    highlights: [
      "제로프루프 칵테일 페어링",
      "DJ 라이브 클래스",
      "루프탑 포토존"
    ],
    details: [
      "예약 고객 대상 미리 구성된 칵테일 세트를 제공하며, 저녁 8시에는 DJ 토크 세션이 열립니다.",
      "오픈 첫 주는 인스타그램 DM을 통해 선착순 예약을 받고 있습니다."
    ],
    reservationUrl: "https://www.instagram.com/oreo.rooftop/"
  }
];
