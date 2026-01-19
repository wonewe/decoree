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
  
  // 중복 체크
  const subscriptionsCollection = collection(db, "newsletterSubscriptions");
  const q = query(subscriptionsCollection, where("email", "==", normalizedEmail));
  
  console.log("[Newsletter] Checking for duplicates...");
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    console.log("[Newsletter] Email already subscribed");
    // 이미 구독되어 있으면 에러 없이 성공으로 처리
    return;
  }
  
  // Stibee API로 구독 전송
  console.log("[Newsletter] Sending to Stibee API...");
  try {
    const formData = new FormData();
    formData.append("email", normalizedEmail);
    
    const response = await fetch(
      "https://stibee.com/api/v1.0/lists/oVUdazUb9JZUikJAyW5MUOZrRTvHPQ==/public/subscribers",
      {
        method: "POST",
        body: formData
      }
    );
    
    console.log("[Newsletter] Stibee API response status:", response.status);
    if (!response.ok) {
      console.error("[Newsletter] Stibee API error:", response.status, await response.text());
      // Stibee API 실패해도 계속 진행 (Firestore에는 저장)
    } else {
      console.log("[Newsletter] Successfully sent to Stibee");
    }
  } catch (error) {
    console.error("[Newsletter] Failed to send to Stibee:", error);
    // Stibee API 실패해도 계속 진행
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

