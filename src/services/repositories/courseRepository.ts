import {
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  collection,
  Timestamp,
  where
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

/**
 * 여러 수업 ID로 수업 정보를 한 번에 조회합니다.
 * Firestore의 'in' 쿼리 제한(최대 10개)을 고려하여 배치로 처리합니다.
 */
export async function getMultipleCoursesByIds(ids: string[]): Promise<Course[]> {
  assertFirestoreAvailable("Getting multiple courses by IDs");
  
  if (ids.length === 0) {
    return [];
  }
  
  // 중복 제거
  const uniqueIds = [...new Set(ids)];
  
  // Firestore의 'in' 쿼리는 최대 10개까지만 허용되므로 배치로 나눠서 처리
  const BATCH_SIZE = 10;
  const batches: string[][] = [];
  
  for (let i = 0; i < uniqueIds.length; i += BATCH_SIZE) {
    batches.push(uniqueIds.slice(i, i + BATCH_SIZE));
  }
  
  const coursesCollection = collection(db, "courses");
  const allCourses: Course[] = [];
  
  // 각 배치를 병렬로 처리 (document ID로 직접 getDoc 사용)
  await Promise.all(
    batches.map(async (batchIds) => {
      const coursePromises = batchIds.map((courseId) => 
        getDoc(doc(coursesCollection, courseId))
      );
      const courseDocs = await Promise.all(coursePromises);
      
      const courses = courseDocs
        .filter((doc) => doc.exists())
        .map((doc) => ({
          id: doc.id,
          ...doc.data()
        } as Course))
        .filter((course) => course.active !== false);
      
      allCourses.push(...courses);
    })
  );
  
  // 원래 ID 순서 유지
  const courseMap = new Map(allCourses.map((course) => [course.id, course]));
  return uniqueIds
    .map((id) => courseMap.get(id))
    .filter((course): course is Course => course !== undefined);
}

