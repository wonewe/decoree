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
  
  const normalizedEmail = email.toLowerCase().trim();
  
  // 중복 체크
  const subscriptionsCollection = collection(db, "newsletterSubscriptions");
  const q = query(subscriptionsCollection, where("email", "==", normalizedEmail));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    // 이미 구독되어 있으면 에러 없이 성공으로 처리
    return;
  }
  
  // Stibee API로 구독 전송
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
    
    if (!response.ok) {
      console.error("Stibee API error:", response.status);
      // Stibee API 실패해도 계속 진행 (Firestore에는 저장)
    }
  } catch (error) {
    console.error("Failed to send to Stibee:", error);
    // Stibee API 실패해도 계속 진행
  }
  
  // Firestore에 저장
  await addDoc(subscriptionsCollection, {
    email: normalizedEmail,
    subscribedAt: Timestamp.now(),
    createdAt: Timestamp.now()
  });
}

