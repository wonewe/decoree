export type PhraseCategory = "food" | "shopping" | "entertainment";

export type Phrase = {
  id: string;
  korean: string;
  transliteration: string;
  french: string;
  culturalNote: string;
  category: PhraseCategory;
};

export const PHRASES: Phrase[] = [
  {
    id: "food-1",
    korean: "맛있어요!",
    transliteration: "Masisseoyo!",
    french: "C'est délicieux !",
    culturalNote: "Exprimez votre enthousiasme : les restaurateurs coréens apprécient les retours positifs.",
    category: "food"
  },
  {
    id: "food-2",
    korean: "추천 메뉴가 뭐예요?",
    transliteration: "Chucheon menyuga mwoyeyo?",
    french: "Quelle est la spécialité de la maison ?",
    culturalNote: "Laissez le serveur guider votre découverte, souvent une version moderne de plats traditionnels.",
    category: "food"
  },
  {
    id: "shopping-1",
    korean: "다른 색상 있어요?",
    transliteration: "Dareun saeksang isseoyo?",
    french: "Vous l'avez dans une autre couleur ?",
    culturalNote: "Les boutiques pop-up changent souvent les couleurs selon les collabs K-Pop.",
    category: "shopping"
  },
  {
    id: "shopping-2",
    korean: "택스 리펀드 가능해요?",
    transliteration: "Taekseu ripeondeu ganeunghaeyo?",
    french: "Puis-je bénéficier du tax free ?",
    culturalNote: "Présentez votre passeport : de nombreuses boutiques de Hongdae sont affiliées.",
    category: "shopping"
  },
  {
    id: "entertainment-1",
    korean: "사진 같이 찍어도 될까요?",
    transliteration: "Sajin gachi jjigeodo doelkkayo?",
    french: "On peut prendre une photo ensemble ?",
    culturalNote: "Toujours demander avant d'immortaliser une performance de rue.",
    category: "entertainment"
  },
  {
    id: "entertainment-2",
    korean: "공연 몇 시에 시작해요?",
    transliteration: "Gongyeon myeot sie sijakaeyo?",
    french: "Le spectacle commence à quelle heure ?",
    culturalNote: "Certaines scènes K-Indie démarrent plus tard que prévu, prévoyez une marge.",
    category: "entertainment"
  }
];
