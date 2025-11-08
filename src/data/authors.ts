export type AuthorProfile = {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
};

export const AUTHOR_PROFILES: AuthorProfile[] = [
  {
    id: "jaewon-kim",
    name: "Jaewon Kim",
    title: "Decorée Team Lead",
    bio: "Find k-trends in Decorée!",
    avatarUrl:
      "https://res.cloudinary.com/dfbjpfrno/image/upload/v1762441482/IMG_6004_jewfzd.jpg"
  },
  {
    id: "Dongha-lee",
    name: "Dongha Lee",
    title: "Marketing Specialist",
    bio: "French market Marketing Specialist at Decorée",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "Taeho-ahn",
    name: "Taeho Ahn",
    title: "Japanese Contents Editor",
    bio: "Japanese Contents Editor at Decorée",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504385544-6b70041f87f2?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "sofia-l",
    name: "Sofia Lee",
    title: "Field Trend Curator",
    bio: "Covers sunset pop-ups and outdoor concepts across Seoul and Busan.",
    avatarUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "jiwoo-k",
    name: "Jiwoo Kang",
    title: "Nightlife & Listening Bars Editor",
    bio: "Spots K-indie listening rooms and late-night experiences before they blow up.",
    avatarUrl:
      "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "maya-h",
    name: "Maya Han",
    title: "Crossover Culture Producer",
    bio: "Connects cinema, design and food collectives for Decorée’s premium stories.",
    avatarUrl:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80"
  }
];

export function getAuthorProfile(authorId: string | undefined) {
  if (!authorId) return null;
  return AUTHOR_PROFILES.find((author) => author.id === authorId) ?? null;
}
