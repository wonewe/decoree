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
    title: "Decorée Product Owner",
    bio: "I am Product Owner of Decorée",
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
  }
];

export function getAuthorProfile(authorId: string | undefined) {
  if (!authorId) return null;
  return AUTHOR_PROFILES.find((author) => author.id === authorId) ?? null;
}
