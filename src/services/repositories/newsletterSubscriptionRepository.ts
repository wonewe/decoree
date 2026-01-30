import { addDoc, collection, Timestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "./firestoreClient";
import { assertFirestoreAvailable } from "./runtimeConfig";

export type NewsletterSubscription = {
  id?: string;
  email: string;
  subscribedAt?: Timestamp;
  createdAt?: Timestamp;
};

/**
 * 모든 뉴스레터 구독자 조회 (관리자용)
 */
export async function fetchNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
  assertFirestoreAvailable("Fetching newsletter subscriptions");
  
  const subscriptionsCollection = collection(db, "newsletterSubscriptions");
  const q = query(subscriptionsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as NewsletterSubscription[];
}

/**
 * 뉴스레터 구독 신청
 */
export async function subscribeToNewsletter(email: string): Promise<void> {
  console.log("[Newsletter] Starting subscription for:", email);
  
  try {
    assertFirestoreAvailable("Subscribing to newsletter");
  } catch (error) {
    console.error("[Newsletter] Firestore not available:", error);
    throw error;
  }
  
  const normalizedEmail = email.toLowerCase().trim();
  console.log("[Newsletter] Normalized email:", normalizedEmail);
  
  // Stibee API로 먼저 구독 전송 (중복 체크 전에 실행)
  console.log("[Newsletter] Sending to Stibee API...");
  const formData = new FormData();
  formData.append("email", normalizedEmail);
  
  const response = await fetch(
    "https://stibee.com/api/v1.0/lists/mwtp_rEwRi2pv38v2FjKCbN7TYOiCg==/public/subscribers",
    {
      method: "POST",
      body: formData
    }
  );
  
  console.log("[Newsletter] Stibee API response status:", response.status);
  
  if (!response.ok) {
    const responseText = await response.text();
    console.error("[Newsletter] Stibee API error:", response.status, responseText);
    // Stibee API 실패 시 에러를 던져서 사용자에게 알림
    throw new Error(`Stibee 구독 실패: ${response.status}`);
  }
  
  console.log("[Newsletter] Successfully sent to Stibee");
  
  // 중복 체크 (Stibee 전송 후)
  const subscriptionsCollection = collection(db, "newsletterSubscriptions");
  const q = query(subscriptionsCollection, where("email", "==", normalizedEmail));
  
  console.log("[Newsletter] Checking for duplicates in Firestore...");
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    console.log("[Newsletter] Email already in Firestore, skipping save");
    // 이미 Firestore에 있으면 저장하지 않음 (하지만 Stibee에는 이미 전송됨)
    return;
  }
  
  // Firestore에 저장
  console.log("[Newsletter] Saving to Firestore...");
  try {
    await addDoc(subscriptionsCollection, {
      email: normalizedEmail,
      subscribedAt: Timestamp.now(),
      createdAt: Timestamp.now()
    });
    console.log("[Newsletter] Successfully saved to Firestore");
  } catch (error) {
    console.error("[Newsletter] Failed to save to Firestore:", error);
    throw error;
  }
}

