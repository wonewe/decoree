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
    title: "koraid Team Lead",
    bio: "Find k-trends in koraid!",
    avatarUrl:
      "https://res.cloudinary.com/dfbjpfrno/image/upload/v1762441482/IMG_6004_jewfzd.jpg"
  },
  {
    id: "Dongha-lee",
    name: "Dongha Lee",
    title: "Marketing Specialist",
    bio: "French market Marketing Specialist at koraid",
    avatarUrl: ""
  },
  {
    id: "Taeho-ahn",
    name: "Taeho Ahn",
    title: "Japanese Contents Editor",
    bio: "Japanese Contents Editor at koraid",
    avatarUrl: ""
  },
];

export function getAuthorProfile(authorId: string | undefined) {
  if (!authorId) return null;
  return AUTHOR_PROFILES.find((author) => author.id === authorId) ?? null;
}
