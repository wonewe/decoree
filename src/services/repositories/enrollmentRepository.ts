import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "./firestoreClient";
import { assertFirestoreAvailable } from "./runtimeConfig";
import type { Course } from "./courseRepository";
import { getActiveMembership } from "./membershipRepository";

export type EnrollmentStatus = "pending" | "scheduled" | "completed" | "cancelled";

export type Enrollment = {
  id?: string;
  userId: string;
  membershipId: string; // 멤버십 ID
  courseId: string;
  course?: Course; // 조인된 수업 정보
  status: EnrollmentStatus;
  tutorId?: string; // 배정된 튜터 ID (추후 추가)
  scheduledAt?: Timestamp; // 수업 예약 시간
  enrolledAt?: Timestamp;
  completedAt?: Timestamp;
  cancelledAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

/**
 * 멤버십 기반으로 수업 등록 생성
 * 활성 멤버십이 있고 남은 세션이 있어야 등록 가능
 */
export async function createEnrollment(
  userId: string,
  courseId: string
): Promise<string> {
  assertFirestoreAvailable("Creating enrollment");
  
  // 활성 멤버십 확인
  const membership = await getActiveMembership(userId);
  if (!membership) {
    throw new MembershipRequiredError();
  }
  
  if (membership.sessionsRemaining <= 0) {
    throw new NoRemainingSessionsError();
  }
  
  // Enrollment 생성
  const enrollmentsCollection = collection(db, "enrollments");
  const enrollmentData: Omit<Enrollment, "id"> = {
    userId,
    membershipId: membership.id!,
    courseId,
    status: "pending",
    enrolledAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  
  const docRef = await addDoc(enrollmentsCollection, enrollmentData);
  const enrollmentId = docRef.id;
  
  // TODO: 멤버십 세션 차감은 서버 측(Cloud Functions)에서 처리해야 함
  // Firestore 규칙이 관리자만 멤버십을 수정할 수 있도록 제한되어 있으므로,
  // 클라이언트에서 직접 useMembershipSession을 호출할 수 없음
  // Cloud Functions에서 enrollment 생성 후 webhook 또는 트리거로 세션 차감 처리 필요
  // await useMembershipSession(membership.id!);
  
  return enrollmentId;
}

export async function getUserEnrollments(userId: string): Promise<Enrollment[]> {
  assertFirestoreAvailable("Getting user enrollments");
  
  const enrollmentsCollection = collection(db, "enrollments");
  const q = query(
    enrollmentsCollection,
    where("userId", "==", userId),
    where("status", "in", ["pending", "scheduled", "completed"])
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Enrollment[];
}

export async function getEnrollmentById(enrollmentId: string): Promise<Enrollment | null> {
  assertFirestoreAvailable("Getting enrollment by ID");
  
  const enrollmentRef = doc(db, "enrollments", enrollmentId);
  const enrollmentDoc = await getDoc(enrollmentRef);
  
  if (!enrollmentDoc.exists()) {
    return null;
  }
  
  return {
    id: enrollmentDoc.id,
    ...enrollmentDoc.data()
  } as Enrollment;
}

export async function updateEnrollmentStatus(
  enrollmentId: string,
  status: EnrollmentStatus,
  scheduledAt?: Timestamp
): Promise<void> {
  assertFirestoreAvailable("Updating enrollment status");
  
  const enrollmentRef = doc(db, "enrollments", enrollmentId);
  const updateData: Partial<Enrollment> = {
    status,
    updatedAt: Timestamp.now()
  };
  
  if (status === "scheduled" && scheduledAt) {
    updateData.scheduledAt = scheduledAt;
  }
  
  if (status === "completed") {
    updateData.completedAt = Timestamp.now();
  }
  
  if (status === "cancelled") {
    updateData.cancelledAt = Timestamp.now();
  }
  
  await updateDoc(enrollmentRef, updateData);
}

export async function getEnrollmentByUserAndCourse(
  userId: string,
  courseId: string
): Promise<Enrollment | null> {
  assertFirestoreAvailable("Getting enrollment by user and course");
  
  const enrollmentsCollection = collection(db, "enrollments");
  const q = query(
    enrollmentsCollection,
    where("userId", "==", userId),
    where("courseId", "==", courseId)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  
  const enrollmentDoc = snapshot.docs[0];
  return {
    id: enrollmentDoc.id,
    ...enrollmentDoc.data()
  } as Enrollment;
}

