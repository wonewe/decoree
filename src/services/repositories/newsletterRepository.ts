import {
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  collection,
  Timestamp,
  setDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firestoreClient";
import { assertFirestoreAvailable } from "./runtimeConfig";
import type { SupportedLanguage } from "../../shared/i18n";

export type Newsletter = {
  id: string;
  title: string;
  content: string; // HTML content
  publishedAt: string; // ISO date string (YYYY-MM-DD)
  language?: SupportedLanguage;
  hidden?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

/**
 * 모든 뉴스레터 조회 (최신순)
 */
export async function fetchNewsletters(options?: { includeHidden?: boolean }): Promise<Newsletter[]> {
  assertFirestoreAvailable("Fetching newsletters");
  
  const newslettersCollection = collection(db, "newsletters");
  const q = query(newslettersCollection, orderBy("publishedAt", "desc"));
  const snapshot = await getDocs(q);
  
  let newsletters = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Newsletter[];
  
  if (!options?.includeHidden) {
    newsletters = newsletters.filter((newsletter) => !newsletter.hidden);
  }
  
  return newsletters;
}

/**
 * 뉴스레터 ID로 조회
 */
export async function getNewsletterById(id: string, options?: { includeHidden?: boolean }): Promise<Newsletter | null> {
  assertFirestoreAvailable("Getting newsletter by ID");
  
  const newsletterRef = doc(db, "newsletters", id);
  const newsletterDoc = await getDoc(newsletterRef);
  
  if (!newsletterDoc.exists()) {
    return null;
  }
  
  const data = newsletterDoc.data() as Omit<Newsletter, "id">;
  
  if (!options?.includeHidden && data.hidden) {
    return null;
  }
  
  return {
    id: newsletterDoc.id,
    ...data
  } as Newsletter;
}

/**
 * 뉴스레터 생성
 */
export async function addNewsletter(newsletter: Omit<Newsletter, "id" | "createdAt" | "updatedAt">): Promise<string> {
  assertFirestoreAvailable("Adding newsletter");
  
  const newslettersCollection = collection(db, "newsletters");
  const docRef = doc(newslettersCollection);
  
  const newsletterData: Omit<Newsletter, "id"> = {
    ...newsletter,
    hidden: newsletter.hidden ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  
  await setDoc(docRef, newsletterData);
  return docRef.id;
}

/**
 * 뉴스레터 업데이트
 */
export async function updateNewsletter(newsletter: Newsletter): Promise<void> {
  assertFirestoreAvailable("Updating newsletter");
  
  const newsletterRef = doc(db, "newsletters", newsletter.id);
  const { id, createdAt, ...updateData } = newsletter;
  
  await updateDoc(newsletterRef, {
    ...updateData,
    updatedAt: Timestamp.now()
  });
}

/**
 * 뉴스레터 삭제
 */
export async function deleteNewsletter(id: string): Promise<void> {
  assertFirestoreAvailable("Deleting newsletter");
  
  const newsletterRef = doc(db, "newsletters", id);
  await deleteDoc(newsletterRef);
}

