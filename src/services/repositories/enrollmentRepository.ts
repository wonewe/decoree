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

export type EnrollmentStatus = "pending" | "paid" | "completed" | "cancelled";

export type Enrollment = {
  id?: string;
  userId: string;
  courseId: string;
  course?: Course; // 조인된 수업 정보
  status: EnrollmentStatus;
  paymentIntentId?: string; // 결제 ID (Stripe 등)
  enrolledAt?: Timestamp;
  paidAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export async function createEnrollment(
  userId: string,
  courseId: string
): Promise<string> {
  assertFirestoreAvailable("Creating enrollment");
  
  const enrollmentsCollection = collection(db, "enrollments");
  const enrollmentData: Omit<Enrollment, "id"> = {
    userId,
    courseId,
    status: "pending",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  
  const docRef = await addDoc(enrollmentsCollection, enrollmentData);
  return docRef.id;
}

export async function getUserEnrollments(userId: string): Promise<Enrollment[]> {
  assertFirestoreAvailable("Getting user enrollments");
  
  const enrollmentsCollection = collection(db, "enrollments");
  const q = query(
    enrollmentsCollection,
    where("userId", "==", userId),
    where("status", "in", ["pending", "paid", "completed"])
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
  paymentIntentId?: string
): Promise<void> {
  assertFirestoreAvailable("Updating enrollment status");
  
  const enrollmentRef = doc(db, "enrollments", enrollmentId);
  const updateData: Partial<Enrollment> = {
    status,
    updatedAt: Timestamp.now()
  };
  
  if (status === "paid" && paymentIntentId) {
    updateData.paymentIntentId = paymentIntentId;
    updateData.paidAt = Timestamp.now();
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

