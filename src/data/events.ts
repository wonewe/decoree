import type { SupportedLanguage } from "../shared/i18n";
import { BLANK_IMAGE } from "../shared/placeholders";

export type EventCategory = "concert" | "traditional" | "atelier" | "theatre" | "festival";

export type KCultureEvent = {
  id: string;
  language: SupportedLanguage;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  category: EventCategory;
  price: string;
  bookingUrl?: string;
  imageUrl: string;
  longDescription: string[];
  tips: string[];
};

export const K_CULTURE_EVENTS: KCultureEvent[] = [
  {
    id: "fr-aespa-arena",
    language: "fr",
    title: "Aespa Hyperline Tour - Séoul",
    description:
      "Concert K-pop avec zones VR immersives avant le show et guides francophones sur place.",
    startDate: "2024-07-13",
    endDate: "2024-07-13",
    time: "19:30",
    location: "KSPO Dome, Séoul",
    category: "concert",
    price: "89€",
    imageUrl: BLANK_IMAGE,
    longDescription: [
      "La tournée Hyperline d'Aespa transforme le KSPO Dome en terrain de jeu immersif : zones VR, chorégraphies interactives et merchandising en édition limitée.",
      "Les portes ouvrent à 17h. Réservez votre créneau VR via l'app SM Town pour éviter la file. Les billets VIP incluent un mini meet & greet de 5 minutes."
    ],
    tips: [
      "Arrivez deux heures avant le show pour profiter de toutes les expériences.",
      "Téléchargez l'app SM Town : sous-titres français disponibles pour le briefing."
    ]
  },
  {
    id: "fr-bukchon-hanok-night",
    language: "fr",
    title: "Nuit Hanbok & Photowalk",
    description:
      "Tour nocturne de Bukchon avec location de hanbok premium et photographe francophone.",
    startDate: "2024-07-15",
    endDate: "2024-07-15",
    time: "20:00",
    location: "Bukchon Hanok Village, Séoul",
    category: "traditional",
    price: "49€",
    bookingUrl: "https://example.com/bukchon-night",
    imageUrl: BLANK_IMAGE,
    longDescription: [
      "Découvrez Bukchon de nuit avec un hanbok premium, un stylisme express et un photographe francophone qui guide chaque pose.",
      "Le parcours inclut Samcheongdong-gil, la ruelle des toits et un salon de thé caché où déguster des tisanes coréennes."
    ],
    tips: [
      "Choisissez le créneau de 20h pour capturer la lumière dorée au-dessus des toits.",
      "Apportez deux accessoires personnels pour personnaliser vos photos."
    ]
  },
  {
    id: "fr-makgeolli-class",
    language: "fr",
    title: "Atelier Makgeolli x Fromage",
    description:
      "Masterclass d'accords makgeolli et fromages français animée par un brasseur coréen.",
    startDate: "2024-07-18",
    endDate: "2024-07-18",
    time: "18:00",
    location: "Seongsu Silo Lab, Séoul",
    category: "atelier",
    price: "35€",
    imageUrl: BLANK_IMAGE,
    longDescription: [
      "Le maître brasseur Kim Min-su partage les secrets du makgeolli avant de proposer des accords inattendus avec des fromages importés.",
      "Les participants terminent par un mini-lab : toppings yuzu, basilic asiatique ou gingembre pour créer leur propre cuvée."
    ],
    tips: [
      "Places limitées à 14 personnes, réservez via Naver Booking.",
      "Apportez une boîte isotherme si vous souhaitez repartir avec une bouteille."
    ]
  },
  {
    id: "ko-seoul-summer-fest",
    language: "ko",
    title: "한강 썸머 뮤직 페스트",
    description:
      "한강 수변 무대에서 열리는 여름 음악 축제. 로컬 밴드와 디제이 라인업이 밤새 이어집니다.",
    startDate: "2024-07-27",
    endDate: "2024-07-28",
    time: "18:30",
    location: "한강 반포 야외무대",
    category: "festival",
    price: "무료 입장",
    imageUrl: BLANK_IMAGE,
    longDescription: [
      "썸머 뮤직 페스트는 반포 야외무대에서 진행되는 야간 음악축제로, 로컬 인디 밴드와 DJ가 번갈아 무대를 채웁니다.",
      "돗자리 대여와 푸드트럭이 운영되어 느긋한 피크닉 분위기를 즐길 수 있습니다. koraid 구독자는 사운드 체크 투어에 참여 가능합니다."
    ],
    tips: [
      "저녁 6시 이전에 도착해 선착순 좌석을 확보하세요.",
      "무선 이어폰 대신 현장 음향을 온전히 느끼고 싶다면 이어플러그를 준비해보세요."
    ]
  },
  {
    id: "ko-jeju-tea-atelier",
    language: "ko",
    title: "제주 녹차 블렌딩 클래스",
    description:
      "비밀스러운 다원에서 진행되는 차 블렌딩 클래스. 향과 색을 직접 조합해 나만의 티백을 완성합니다.",
    startDate: "2024-08-03",
    endDate: "2024-08-03",
    time: "14:00",
    location: "제주 서귀포 개인 다원",
    category: "atelier",
    price: "55,000원",
    bookingUrl: "https://example.com/jeju-tea",
    imageUrl: BLANK_IMAGE,
    longDescription: [
      "서귀포에 위치한 비공개 다원에서 티마스터가 제주산 녹차와 허브를 소개하고 블렌딩 기초를 알려드립니다.",
      "블렌딩을 마친 뒤에는 초록빛 다원을 바라보며 차와 디저트를 즐기는 티 타임이 이어집니다."
    ],
    tips: [
      "오후 햇살이 강하니 모자와 선크림을 준비하세요.",
      "예약 시 알레르기 정보를 기재하면 맞춤 허브를 추천받을 수 있습니다."
    ]
  },
  {
    id: "ja-osaka-k-market",
    language: "ja",
    title: "大阪Kカルチャーマーケット",
    description:
      "大阪・中之島で開催される韓国カルチャー複合イベント。トークショーとフードゾーンを同時に展開。",
    startDate: "2024-08-10",
    endDate: "2024-08-11",
    time: "11:00",
    location: "大阪 中之島バンクス",
    category: "festival",
    price: "前売り 3,500円",
    bookingUrl: "https://example.com/osaka-kmarket",
    imageUrl: BLANK_IMAGE,
    longDescription: [
      "韓国カルチャーを総合的に体験できるマーケット。最新コスメやファッションブランドのポップアップが集結します。",
      "ステージではドラマOSTライブやKカルチャートーク、日本語通訳付きのワークショップが行われます。"
    ],
    tips: [
      "午前中に入場すると限定グッズの整理券を受け取れます。",
      "フードゾーンは現金決済不可。交通系ICカードを事前にチャージしてください。"
    ]
  },
  {
    id: "ja-kyoto-night-hanbok",
    language: "ja",
    title: "京都・韓服ライティングウォーク",
    description:
      "京都の寺院で韓服を着て楽しむ夜間ライトアップ散策。韓国茶サロン付きの限定プログラム。",
    startDate: "2024-09-07",
    endDate: "2024-09-07",
    time: "19:00",
    location: "京都 東山エリア",
    category: "traditional",
    price: "8,900円",
    imageUrl: BLANK_IMAGE,
    longDescription: [
      "韓服スタイリストが着付けを担当し、韓国と日本の文化をつなぐナイトツアー。寺院の特別ライトアップを日本語の解説付きで堪能できます。",
      "後半は韓国茶サロンでティータイム。韓国伝統菓子とともに余韻を味わえます。"
    ],
    tips: [
      "ヒールの高い靴よりも歩きやすい靴を推奨します。",
        "写真撮影ポイントでは三脚の使用が禁止されているのでご注意ください."
      ]
  },
  {
    id: "ko-seoul-musical-night",
    language: "ko",
    title: "대학로 뮤지컬 나이트 패스",
    description:
      "대학로 인기 연극·뮤지컬을 하루 패스로 관람하고, 백스테이지 투어까지 이어지는 패키지.",
    startDate: "2024-09-15",
    endDate: "2024-09-17",
    time: "17:00",
    location: "서울 대학로 일대",
    category: "theatre",
    price: "89,000원",
    bookingUrl: "https://example.com/seoul-musical-night",
    imageUrl: BLANK_IMAGE,
    longDescription: [
      "저녁 5시에 대학로 아트홀에서 집결하여 공연 큐레이터의 하이라이트 설명을 듣습니다.",
      "1부는 선택한 연극 또는 뮤지컬 관람, 2부는 무대 뒤에서 조명과 세트를 체험하는 백스테이지 투어가 이어집니다."
    ],
    tips: [
      "좌석 업그레이드는 사전 신청 필수입니다.",
      "투어 중 사진 촬영이 제한될 수 있으니 진행 스태프 안내를 따르세요."
    ]
  },
  {
    id: "en-seoul-book-fair",
    language: "en",
    title: "Seoul Indie Book Fair",
    description:
      "Pop-up fair gathering independent Korean publishers, risograph artists and travel zines.",
    startDate: "2024-08-24",
    endDate: "2024-08-25",
    time: "13:00",
    location: "Dongdaemun Design Plaza, Seoul",
    category: "festival",
    price: "Free entry",
    imageUrl: BLANK_IMAGE,
    longDescription: [
      "Surf limited print runs, talk to indie editors and join mini-workshops on binding or Seoul neighbourhood storytelling.",
      "koraid curates an English-friendly circuit highlighting bilingual creators and ateliers shipping worldwide."
    ],
    tips: [
      "Arrive early to secure tote bags and special edition prints.",
      "Bring cashless payment (most vendors use QR / card only)."
    ]
  },
  {
    id: "en-busan-sunset-jazz",
    language: "en",
    title: "Busan Sunset Jazz Cruise",
    description:
      "Evening cruise along Busan’s coastline featuring local jazz ensembles and rooftop tastings.",
    startDate: "2024-09-05",
    endDate: "2024-09-05",
    time: "18:30",
    location: "Busan Marina Pier",
    category: "concert",
    price: "79,000 KRW",
    bookingUrl: "https://example.com/busan-jazz-cruise",
    imageUrl: BLANK_IMAGE,
    longDescription: [
      "Boarding begins 30 minutes before sunset with a welcome drink curated by a local distillery.",
      "Three live sets accompany the cruise, blending K-jazz standards and reimagined OST themes. Premium seating includes a captain’s deck tasting flight."
    ],
    tips: [
      "Bring a light jacket; ocean winds can be brisk after sunset.",
      "Reserve premium seats in advance—only 20 are available per sailing."
    ]
  }
];
