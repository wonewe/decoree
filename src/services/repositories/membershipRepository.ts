import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  Timestamp,
  updateDoc,
  collection,
  runTransaction,
  increment
} from "firebase/firestore";
import { db } from "./firestoreClient";
import { assertFirestoreAvailable } from "./runtimeConfig";

export type MembershipTier = "basic" | "pro";
export type MembershipStatus = "active" | "expired" | "cancelled";

/**
 * 활성 멤버십이 없을 때 발생하는 에러
 */
export class MembershipRequiredError extends Error {
  constructor(message: string = "Active membership required") {
    super(message);
    this.name = "MembershipRequiredError";
  }
}

/**
 * 멤버십에 남은 세션이 없을 때 발생하는 에러
 */
export class NoRemainingSessionsError extends Error {
  constructor(message: string = "No remaining sessions in membership") {
    super(message);
    this.name = "NoRemainingSessionsError";
  }
}

export type Membership = {
  id?: string;
  userId: string;
  tier: MembershipTier;
  status: MembershipStatus;
  sessionsTotal: number; // 총 수업 횟수 (basic: 4, pro: 8)
  sessionsUsed: number; // 사용한 수업 횟수
  sessionsRemaining: number; // 남은 수업 횟수 (계산 필드)
  // TODO: Lemon Squeezy 통합 시 사용
  lemonSqueezyOrderId?: string; // Lemon Squeezy 주문 ID
  lemonSqueezySubscriptionId?: string; // Lemon Squeezy 구독 ID (구독형인 경우)
  purchasedAt?: Timestamp;
  activatedAt?: Timestamp;
  expiresAt?: Timestamp;
  cancelledAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

const MEMBERSHIP_SESSIONS: Record<MembershipTier, number> = {
  basic: 4,
  pro: 8
};

/**
 * 멤버십 생성 (구매)
 * TODO: Lemon Squeezy 통합 시 webhook에서 호출
 */
export async function createMembership(
  userId: string,
  tier: MembershipTier,
  lemonSqueezyOrderId?: string
): Promise<string> {
  assertFirestoreAvailable("Creating membership");
  
  const membershipsCollection = collection(db, "memberships");
  const sessionsTotal = MEMBERSHIP_SESSIONS[tier];
  const membershipData: Omit<Membership, "id"> = {
    userId,
    tier,
    status: "active",
    sessionsTotal,
    sessionsUsed: 0,
    sessionsRemaining: sessionsTotal,
    lemonSqueezyOrderId,
    purchasedAt: Timestamp.now(),
    activatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  
  const docRef = doc(membershipsCollection);
  await setDoc(docRef, membershipData);
  return docRef.id;
}

/**
 * 사용자의 활성 멤버십 조회
 */
export async function getActiveMembership(userId: string): Promise<Membership | null> {
  assertFirestoreAvailable("Getting active membership");
  
  const membershipsCollection = collection(db, "memberships");
  const q = query(
    membershipsCollection,
    where("userId", "==", userId),
    where("status", "==", "active")
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  
  // 가장 최근에 구매한 멤버십 반환
  const memberships = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  } as Membership));
  
  // purchasedAt 기준으로 정렬 (가장 최근 것)
  memberships.sort((a, b) => {
    const aTime = a.purchasedAt?.toMillis() ?? 0;
    const bTime = b.purchasedAt?.toMillis() ?? 0;
    return bTime - aTime;
  });
  
  const membership = memberships[0];
  // sessionsRemaining 계산하여 반환
  membership.sessionsRemaining = membership.sessionsTotal - membership.sessionsUsed;
  return membership;
}

/**
 * 사용자의 모든 멤버십 조회
 */
export async function getUserMemberships(userId: string): Promise<Membership[]> {
  assertFirestoreAvailable("Getting user memberships");
  
  const membershipsCollection = collection(db, "memberships");
  const q = query(
    membershipsCollection,
    where("userId", "==", userId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Membership, "id">;
    return {
      id: doc.id,
      ...data,
      sessionsRemaining: data.sessionsTotal - data.sessionsUsed
    };
  }) as Membership[];
}

/**
 * 멤버십 ID로 조회
 */
export async function getMembershipById(membershipId: string): Promise<Membership | null> {
  assertFirestoreAvailable("Getting membership by ID");
  
  const membershipRef = doc(db, "memberships", membershipId);
  const membershipDoc = await getDoc(membershipRef);
  
  if (!membershipDoc.exists()) {
    return null;
  }
  
  const data = membershipDoc.data() as Omit<Membership, "id">;
  return {
    id: membershipDoc.id,
    ...data,
    sessionsRemaining: data.sessionsTotal - data.sessionsUsed
  };
}

/**
 * 멤버십 세션 사용 (차감)
 * 원자적 트랜잭션을 사용하여 경쟁 조건 방지
 */
export async function useMembershipSession(membershipId: string): Promise<void> {
  assertFirestoreAvailable("Using membership session");

  const membershipRef = doc(db, "memberships", membershipId);

  await runTransaction(db, async (transaction) => {
    const membershipDoc = await transaction.get(membershipRef);

    if (!membershipDoc.exists()) {
      throw new Error("Membership not found");
    }

    const membership = membershipDoc.data() as Membership;
    if (membership.sessionsRemaining <= 0) {
      throw new NoRemainingSessionsError();
    }

    const newSessionsRemaining = membership.sessionsRemaining - 1;
    const newStatus: MembershipStatus =
      newSessionsRemaining <= 0 ? "expired" : membership.status;

    transaction.update(membershipRef, {
      sessionsUsed: increment(1),
      sessionsRemaining: increment(-1),
      status: newStatus,
      updatedAt: Timestamp.now(),
    });
  });
}

/**
 * 멤버십 취소
 */
export async function cancelMembership(membershipId: string): Promise<void> {
  assertFirestoreAvailable("Cancelling membership");
  
  const membershipRef = doc(db, "memberships", membershipId);
  await updateDoc(membershipRef, {
    status: "cancelled",
    cancelledAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
}

/**
 * 멤버십 만료 처리
 */
export async function expireMembership(membershipId: string): Promise<void> {
  assertFirestoreAvailable("Expiring membership");
  
  const membershipRef = doc(db, "memberships", membershipId);
  await updateDoc(membershipRef, {
    status: "expired",
    expiresAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
}

