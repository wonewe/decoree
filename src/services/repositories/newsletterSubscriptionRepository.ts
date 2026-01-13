import { addDoc, collection, Timestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "./firestoreClient";
import { assertFirestoreAvailable } from "./runtimeConfig";

export type NewsletterSubscription = {
  id?: string;
  email: string;
  subscribedAt?: Timestamp;
  createdAt?: Timestamp;
};

/**
 * 뉴스레터 구독 신청
 */
export async function subscribeToNewsletter(email: string): Promise<void> {
  assertFirestoreAvailable("Subscribing to newsletter");
  
  // 중복 체크
  const subscriptionsCollection = collection(db, "newsletterSubscriptions");
  const q = query(subscriptionsCollection, where("email", "==", email.toLowerCase().trim()));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    // 이미 구독되어 있으면 에러 없이 성공으로 처리
    return;
  }
  
  await addDoc(subscriptionsCollection, {
    email: email.toLowerCase().trim(),
    subscribedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  });
}

