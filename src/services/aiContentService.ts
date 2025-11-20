import { httpsCallable } from "firebase/functions";
import type { SupportedLanguage } from "../shared/i18n";
import { getFunctions } from "./firebase";

export interface GenerateEventContentParams {
  title: string;
  language: SupportedLanguage;
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  time?: string;
  price?: string;
  description?: string;
  longDescription?: string;
  tips?: string;
}

export interface GenerateEventContentResult {
  description: string;
  longDescription: string[];
  tips: string[];
}

export async function generateEventContentWithAI(
  params: GenerateEventContentParams
): Promise<GenerateEventContentResult> {
  const functions = await getFunctions();
  const callable = httpsCallable<GenerateEventContentParams, GenerateEventContentResult>(
    functions,
    "generateEventContent"
  );
  const { data } = await callable(params);
  return data;
}

