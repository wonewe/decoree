import type { SupportedLanguage } from "../shared/i18n";

export type TrendIntensity = "highlight" | "insider" | "emerging";

export type TrendReport = {
  id: string;
  language: SupportedLanguage;
  title: string;
  summary: string;
  details: string;
  neighborhood: string;
  tags: string[];
  intensity: TrendIntensity;
  isPremium: boolean;
  publishedAt: string;
  imageUrl: string;
  content: string[];
};

export const TREND_REPORTS: TrendReport[] = [
  {
    id: "fr-hanriver-concept-store",
    language: "fr",
    title: "Pop-up Han River Sunset Market",
    summary:
      "Concept-store en plein air sur les rives du Han mêlant jeunes créateurs, stands de street food et DJ set au coucher du soleil.",
    details:
      "Chaque week-end de juin, la Sunset Market rassemble designers émergents et chefs invités. Accès libre l'après-midi, réservation requise pour les sessions Sunset DJ.",
    neighborhood: "Yeouido",
    tags: ["pop-up", "mode", "street food"],
    intensity: "highlight",
    isPremium: false,
    publishedAt: "2024-06-03",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Les berges du fleuve Han deviennent un terrain de jeu pour les créateurs coréens : pendant tout le mois de juin, la Sunset Market réinvente le concept-store à ciel ouvert.",
      "Débutez votre visite vers 16h pour profiter des corners DIY et de la street food signée par des guest chefs. Au coucher du soleil, place aux DJ locaux.",
      "Réservez les sessions « Sunset DJ » via l'app officielle (onglet VIP) et arrivez 30 minutes à l'avance pour capturer la golden hour sur Yeouido."
    ]
  },
  {
    id: "fr-seongsu-vinyl-bar",
    language: "fr",
    title: "K-Indie Listening Room x Café",
    summary:
      "Nouvelle salle d'écoute dédiée à la scène K-indie avec desserts inspirés des dramas et cartes sans alcool.",
    details:
      "Needle & Beam propose playlists commentées par des DJ locaux, desserts signature et ateliers vinyles le dimanche matin.",
    neighborhood: "Seongsu-dong",
    tags: ["café", "musique", "k-indie"],
    intensity: "insider",
    isPremium: true,
    publishedAt: "2024-06-05",
    imageUrl:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Needle & Beam reprend le format des listening bars new-yorkais avec une sélection de vinyles pressés à Séoul et un dessert bar inspiré des dramas.",
      "Les places sont limitées : conseillez à vos lectrices/eurs de réserver le créneau de 19h via KakaoTalk. Les abonnés Decorée Premium bénéficient d'un code priorité.",
      "Chaque dimanche matin, une session « vinyle à emporter » permet d'acquérir des pressages exclusifs à ramener dans sa valise."
    ]
  },
  {
    id: "fr-busan-ocean-film",
    language: "fr",
    title: "Busan Ocean Film Night",
    summary:
      "Projection en plein air face à Haeundae Beach avec masterclasses express et lounge rooftop.",
    details:
      "Festival gratuit tous les vendredis de juillet. Pass backstage optionnel pour rencontrer les réalisateurs et déguster du makgeolli local.",
    neighborhood: "Busan Haeundae",
    tags: ["cinéma", "festival", "océan"],
    intensity: "emerging",
    isPremium: false,
    publishedAt: "2024-06-02",
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Un écran géant posé sur l'eau, des courts-métrages coréens et une ambiance seaside : Busan Ocean Film Night attire le public chaque vendredi de juillet.",
      "Les masterclasses de 25 minutes décodent les tendances du cinéma coréen sur Netflix. Pensez à réserver vos places via le site officiel.",
      "Le pass backstage (29 000 KRW) donne accès à un rooftop lounge avec dégustation de makgeolli artisanal et rencontre avec l'équipe curatoriale."
    ]
  },
  {
    id: "ko-seochon-sunset-walk",
    language: "ko",
    title: "서촌 노을 산책 플레이리스트",
    summary:
      "경복궁 서측 골목을 따라 노을과 카페를 즐기는 저녁 산책 코스. 로컬 큐레이션 플레이리스트 제공.",
    details:
      "오후 5시 이후 방문을 추천. 한옥 개조 카페, 독립 서점, 루프탑 바를 한 번에 둘러볼 수 있는 코스입니다.",
    neighborhood: "서촌",
    tags: ["산책", "카페", "루프탑"],
    intensity: "highlight",
    isPremium: false,
    publishedAt: "2024-06-10",
    imageUrl:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1600&q=80",
    content: [
      "서촌 노을 산책 로드맵은 통의동부터 시작합니다. 독립 서점에서 저녁을 준비하고, 골목 안쪽의 공예 숍을 들러보세요.",
      "노을이 물드는 시간에는 한옥 카페에서 전통차와 디저트를 즐기고, 루프탑 바로 이동해 서울 야경을 감상합니다.",
      "Decorée 구독자는 큐레이션 플레이리스트와 포토 스팟 지도를 다운로드할 수 있습니다."
    ]
  },
  {
    id: "ko-gangneung-brew-lab",
    language: "ko",
    title: "강릉 스페셜티 브루랩",
    summary:
      "바닷가 로스터리에서 바다가 내려다보이는 실험적 커피 테이스팅. 로컬 베이커리와 협업 중.",
    details:
      "Morning flight 프로그램은 3종 커피와 제철 빵 페어링으로 구성. 사전 예약 필수입니다.",
    neighborhood: "강릉 안목해변",
    tags: ["커피", "베이커리", "로컬"],
    intensity: "insider",
    isPremium: true,
    publishedAt: "2024-06-14",
    imageUrl:
      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&w=1600&q=80",
    content: [
      "강릉 스페셜티 브루랩은 해변 전망을 즐기며 커피를 연구하는 공간입니다. 로스터와 바리스타가 직접 테이스팅을 진행합니다.",
      "Morning flight는 가벼운 라이트 로스트, 과일향 중배전, 디저트 페어링이 어우러진 코스로 구성됩니다.",
      "워크숍 참가자는 자신만의 블렌드를 기록한 미니 로그북을 받아볼 수 있습니다."
    ]
  },
  {
    id: "ko-daegu-night-market",
    language: "ko",
    title: "대구 야시장 아트 마켓",
    summary:
      "약령시 골목을 배경으로 음식, 라이브 페인팅, DJ가 어우러지는 야시장. 신진 작가 부스가 특징입니다.",
    details:
      "금·토요일 19시부터 자정까지 운영. 라이브 아트 세션은 21시에 시작하니 미리 자리 확보 추천.",
    neighborhood: "대구 약령시",
    tags: ["야시장", "아트", "라이브"],
    intensity: "emerging",
    isPremium: false,
    publishedAt: "2024-06-18",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1600&q=80",
    content: [
      "대구 야시장 아트 마켓은 지역 작가들의 라이브 페인팅과 DJ 세트가 공존하는 밤 축제입니다.",
      "푸드 존에서는 막창 시그니처 메뉴와 디저트 샵의 마카롱이 인기. 모바일 결제가 편리합니다.",
      "Decorée에서는 작가별 추천 시간대와 팝업 부스 지도를 제공해 더욱 효율적인 동선을 제안합니다."
    ]
  },
  {
    id: "ja-nu-jeonghan-exhibition",
    language: "ja",
    title: "ヌリジョンハン美術館の夜間ツアー",
    summary:
      "韓国近現代美術を集めた美術館で、学芸員がナイトツアーを日本語で案内。限定ライトアップ付き。",
    details:
      "金曜・土曜19時スタート。日本語オーディオガイドとお茶会セットが含まれます。",
    neighborhood: "ソウル 松坡区",
    tags: ["美術館", "ナイトツアー", "ライトアップ"],
    intensity: "highlight",
    isPremium: false,
    publishedAt: "2024-06-07",
    imageUrl:
      "https://images.unsplash.com/photo-1529429617124-aee711a12003?auto=format&fit=crop&w=1600&q=80",
    content: [
      "ヌリジョンハン美術館は韓国の近現代作家を紹介する注目スポット。夜間は展示室全体が柔らかなライトアップに包まれます。",
      "日本語対応の学芸員が作品の背景やアーティストのエピソードを丁寧に解説。限定グッズもこの時間帯のみ購入可能。",
      "ツアー後は屋上庭園で韓国茶と和菓子のアレンジデザートを楽しめます。"
    ]
  },
  {
    id: "ja-ikseon-handcraft-route",
    language: "ja",
    title: "益善洞ハンドクラフト小路",
    summary:
      "韓屋を改装した工房でハングル判子やポジャギ雑貨を作るワークショップを1日で体験。",
    details:
      "午前は判子彫り、午後はポジャギ小物づくり。通訳スタッフが常駐し、初心者でも安心です。",
    neighborhood: "ソウル 益善洞",
    tags: ["ワークショップ", "ハンドクラフト", "韓屋"],
    intensity: "insider",
    isPremium: true,
    publishedAt: "2024-06-12",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    content: [
      "益善洞の細い路地には、韓屋を改装した工房やギャラリーが点在。Decoréeでは日本語サポート付きの工房を厳選しました。",
      "午前の判子ワークショップでは、ハングルのデザインから彫刻までを学び、自分だけの印章を持ち帰れます。",
      "午後のポジャギ小物づくりは色選びがポイント。講師がおすすめの色合わせを提案してくれるので失敗知らずです。"
    ]
  },
  {
    id: "ja-jeju-sunset-table",
    language: "ja",
    title: "済州サンセット・テーブル",
    summary:
      "海辺のポップアップレストランで、済州の食材を使ったフルコースとライブミュージックを楽しむ夕陽ディナー。",
    details:
      "7月限定開催。18時集合で夕陽鑑賞、19時から6品コース。プレミアム席はミュージシャンとのトーク付き。",
    neighborhood: "済州 月汀里",
    tags: ["ポップアップ", "ダイニング", "ライブ"],
    intensity: "emerging",
    isPremium: false,
    publishedAt: "2024-06-20",
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1600&q=80",
    content: [
      "済州の月汀里ビーチで開催されるサンセット・テーブルは、地元食材の魅力を五感で味わうポップアップダイニング。",
      "シェフが各皿の背景を日本語で紹介し、会場ではアコースティックライブが進行。波の音と音楽がシンクロします。",
        "Decoréeプレミアム会員は限定シグネチャードリンクとミュージシャンとのトークセッションに招待されます。"
      ]
  },
  {
    id: "en-seongsu-cafe-trail",
    language: "en",
    title: "Seongsu Café & Concept Trail",
    summary:
      "A self-guided afternoon through Seongsu’s design cafés, indie boutiques and riverside speakeasies.",
    details:
      "Start with a signature latte flight, browse limited-edition collabs, then finish with sunset cocktails overlooking the Han River.",
    neighborhood: "Seongsu-dong",
    tags: ["café", "design", "nightlife"],
    intensity: "highlight",
    isPremium: false,
    publishedAt: "2024-06-15",
    imageUrl:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Seongsu’s warehouse streets have evolved into Seoul’s laboratory for lifestyle brands. Spend the afternoon hopping between concept cafés and indie boutiques with curated playlists.",
      "Golden hour is best enjoyed from the revamped Seongsu Bridge deck. Grab a zero-proof cocktail or a seasonal dessert pairing with a view of the river.",
      "Decorée Premium subscribers can download an interactive map with time slots and queue intel to maximise the trail."
    ]
  },
  {
    id: "en-ikseon-night-classics",
    language: "en",
    title: "Ikseon Night of Classics",
    summary:
      "An evening itinerary across Ikseon-dong’s hanok alleys featuring modern hansik dining, retro dessert bars and vinyl lounges.",
    details:
      "Perfect for travellers pairing heritage with nightlife. Reservations recommended, especially on weekends.",
    neighborhood: "Ikseon-dong",
    tags: ["hanok", "dining", "vinyl"],
    intensity: "insider",
    isPremium: true,
    publishedAt: "2024-06-18",
    imageUrl:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Begin with a seasonal tasting menu in a restored hanok where each course references a different region of Korea.",
      "Move to a retro dessert bar inspired by 80s film sets, then wind down at a listening lounge spinning Seoul funk and city pop vinyl.",
      "Premium readers receive a booking cheat sheet with recommended seating times and bartender pairings."
    ]
  },
  {
    id: "en-jeju-nature-lab",
    language: "en",
    title: "Jeju Nature Lab Retreat",
    summary:
      "A day in Jeju blending volcanic coast hikes, tea estate tastings and regenerative farm workshops.",
    details:
      "Ideal for travellers chasing slower rhythms. Transport from Jeju City included on select dates.",
    neighborhood: "Jeju",
    tags: ["wellness", "outdoor", "local"],
    intensity: "emerging",
    isPremium: false,
    publishedAt: "2024-06-22",
    imageUrl:
      "https://images.unsplash.com/photo-1526481280695-3c46973b38f2?auto=format&fit=crop&w=1600&q=80",
    content: [
      "Kick off with a sunrise walk along Jusangjeolli Cliffs, guided by a local storyteller sharing Jeju myths.",
      "Lunch takes place on a regenerative farm where you’ll pick herbs and learn about slow food practices before a communal meal.",
      "Finish with a tea meditation in Seogwipo, sampling fresh green tea and tangerine blends while journaling your reflections."
    ]
  }
];
