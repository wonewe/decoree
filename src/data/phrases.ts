import type { SupportedLanguage } from "../shared/i18n";

export type PhraseCategory = "food" | "shopping" | "entertainment";

export type Phrase = {
  id: string;
  language: SupportedLanguage;
  korean: string;
  transliteration: string;
  translation: string;
  culturalNote: string;
  category: PhraseCategory;
};

export const PHRASES: Phrase[] = [
  {
    id: "fr-food-1",
    language: "fr",
    korean: "맛있어요!",
    transliteration: "Masisseoyo!",
    translation: "C'est délicieux !",
    culturalNote:
      "Les chefs coréens adorent entendre un retour enthousiaste : dites-le avec un grand sourire.",
    category: "food"
  },
  {
    id: "fr-food-2",
    language: "fr",
    korean: "추천 메뉴가 뭐예요?",
    transliteration: "Chucheon menyuga mwoyeyo?",
    translation: "Quelle est la spécialité de la maison ?",
    culturalNote:
      "Demandez la recommandation du serveur pour découvrir un plat saisonnier ou un accord inattendu.",
    category: "food"
  },
  {
    id: "fr-shopping-1",
    language: "fr",
    korean: "다른 색상 있어요?",
    transliteration: "Dareun saeksang isseoyo?",
    translation: "Vous l'avez dans une autre couleur ?",
    culturalNote:
      "Les concept stores renouvellent les coloris chaque semaine, pensez à demander un aperçu du prochain drop.",
    category: "shopping"
  },
  {
    id: "fr-entertainment-1",
    language: "fr",
    korean: "공연 몇 시에 시작해요?",
    transliteration: "Gongyeon myeot sie sijakaeyo?",
    translation: "Le spectacle commence à quelle heure ?",
    culturalNote:
      "Arrivez 15 minutes en avance : les salles ajoutent souvent un pre-show surprise.",
    category: "entertainment"
  },
  {
    id: "ko-food-1",
    language: "ko",
    korean: "이 집 시그니처가 뭐예요?",
    transliteration: "I jip sigeuneocheoga mwoyeyo?",
    translation: "이곳에서 꼭 먹어야 하는 메뉴가 뭐예요?",
    culturalNote:
      "로컬 추천 메뉴를 먼저 묻고 주문하면 셰프가 감동하는 편. 한두 가지 추가 추천을 받아보세요.",
    category: "food"
  },
  {
    id: "ko-shopping-1",
    language: "ko",
    korean: "재입고 일정 알 수 있을까요?",
    transliteration: "Jae-ibgo iljeong al su isseulkkayo?",
    translation: "다음 입고 날짜를 알려주실 수 있나요?",
    culturalNote:
      "핫한 팝업은 빠르게 품절됩니다. 연락처를 남기면 사전 알림을 보내주는 매장도 있어요.",
    category: "shopping"
  },
  {
    id: "ko-entertainment-1",
    language: "ko",
    korean: "현장 포토카드 어디서 받아요?",
    transliteration: "Hyeonjang photocard eodiseo badayo?",
    translation: "현장에서 포토카드는 어디에서 받을 수 있나요?",
    culturalNote:
      "K-Pop 이벤트는 포토카드를 스탠드별로 배포하니, 입장 전에 부스 위치를 확인하세요.",
    category: "entertainment"
  },
  {
    id: "ja-food-1",
    language: "ja",
    korean: "디저트 추천해주세요.",
    transliteration: "Dijeoteu chucheonhaejuseyo.",
    translation: "デザートのおすすめはありますか？",
    culturalNote:
      "韓国カフェは季節限定のメニューが豊富。写真を見せながら頼むとスムーズです。",
    category: "food"
  },
  {
    id: "ja-shopping-1",
    language: "ja",
    korean: "포장 가능할까요?",
    transliteration: "Pojang ganeungalkkayo?",
    translation: "テイクアウトにできますか？",
    culturalNote:
      "ポップアップショップではラッピングサービスも人気。ギフト用と伝えると特別タグを選べる場合があります。",
    category: "shopping"
  },
  {
    id: "ja-entertainment-1",
    language: "ja",
    korean: "좌석 업그레이드 할 수 있어요?",
    transliteration: "Jwaseok upgrade hal su isseoyo?",
    translation: "座席のアップグレードはできますか？",
    culturalNote:
      "ライブ会場によっては当日アップグレードカウンターが設置されています。早めに交渉しましょう。",
    category: "entertainment"
  },
  {
    id: "en-food-1",
    language: "en",
    korean: "추천 메뉴가 뭐예요?",
    transliteration: "Chucheon menyuga mwoyeyo?",
    translation: "What's your signature dish?",
    culturalNote:
      "Ask for the house recommendation—many chefs feature seasonal twists that aren’t on the printed menu.",
    category: "food"
  },
  {
    id: "en-shopping-1",
    language: "en",
    korean: "이거 선물 포장 가능할까요?",
    transliteration: "Igeo seonmul pojang ganeunghalkkayo?",
    translation: "Could you gift wrap this?",
    culturalNote:
      "Pop-up stores often offer limited-edition wrapping or stickers for gifts. Ask to see the current design.",
    category: "shopping"
  },
  {
    id: "en-entertainment-1",
    language: "en",
    korean: "오늘 공연 몇 시에 끝나요?",
    transliteration: "Oneul gongyeon myeot sie kkeutnayo?",
    translation: "What time does tonight’s show finish?",
    culturalNote:
      "Knowing the end time helps you plan late-night transit—many venues share the last subway announcements.",
    category: "entertainment"
  }
];
