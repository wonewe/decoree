import type { SupportedLanguage } from "../shared/i18n";

export type TrendIntensity = "highlight" | "insider" | "emerging";

export type TrendReport = {
  id: string;
  language: SupportedLanguage;
  hidden?: boolean;
  title: string;
  summary: string;
  details: string;
  neighborhood: string;
  tags: string[];
  intensity: TrendIntensity;
  publishedAt: string;
  imageUrl: string;
  content: string[];
  authorId: string;
};

export const TREND_REPORTS: TrendReport[] = [];
