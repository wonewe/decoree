import {
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  collection,
  Timestamp
} from "firebase/firestore";
import { db } from "./firestoreClient";
import { assertFirestoreAvailable } from "./runtimeConfig";

export type Course = {
  id: string;
  title: string;
  description: string;
  price: number; // 원화 기준 가격
  duration: number; // 수업 시간 (분)
  level: "beginner" | "intermediate" | "advanced";
  tutor: {
    name: string;
    bio: string;
    image?: string;
  };
  topics: string[]; // 수업 주제
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  active?: boolean; // 활성화 여부
};

export async function fetchCourses(): Promise<Course[]> {
  assertFirestoreAvailable("Fetching courses");
  
  const coursesCollection = collection(db, "courses");
  const q = query(coursesCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data()
    } as Course))
    .filter((course) => course.active !== false);
}

export async function getCourseById(id: string): Promise<Course | null> {
  assertFirestoreAvailable("Getting course by ID");
  
  const courseRef = doc(db, "courses", id);
  const courseDoc = await getDoc(courseRef);
  
  if (!courseDoc.exists()) {
    return null;
  }
  
  return {
    id: courseDoc.id,
    ...courseDoc.data()
  } as Course;
}

