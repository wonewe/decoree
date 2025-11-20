import * as admin from "firebase-admin";

const db = admin.firestore();

export interface SyncStatus {
  status: "running" | "completed" | "error";
  progress: number; // 0-100
  total: number;
  processed: number;
  message: string;
  startedAt: admin.firestore.Timestamp;
  completedAt?: admin.firestore.Timestamp;
  error?: string;
}

/**
 * Update sync status in Firestore for real-time UI updates
 * @param {string} syncId - Unique sync job ID
 * @param {Partial<SyncStatus>} update - Status update object
 * @return {Promise<void>}
 */
export const updateSyncStatus = async (
  syncId: string,
  update: Partial<SyncStatus>
) => {
  const docRef = db.collection("sync_status").doc(syncId);
  await docRef.set(update, { merge: true });
};

/**
 * Create initial sync status document
 * @param {string} syncId - Unique sync job ID
 * @param {number} total - Total number of events to process
 * @return {Promise<void>}
 */
export const createSyncStatus = async (syncId: string, total: number) => {
  const status: SyncStatus = {
    status: "running",
    progress: 0,
    total,
    processed: 0,
    message: "이벤트 목록을 가져오는 중...",
    startedAt: admin.firestore.Timestamp.now(),
  };
  await updateSyncStatus(syncId, status);
};

/**
 * Mark sync as completed
 * @param {string} syncId - Unique sync job ID
 * @return {Promise<void>}
 */
export const completeSyncStatus = async (syncId: string) => {
  await updateSyncStatus(syncId, {
    status: "completed",
    progress: 100,
    message: "완료되었습니다!",
    completedAt: admin.firestore.Timestamp.now(),
  });
};

/**
 * Mark sync as failed
 * @param {string} syncId - Unique sync job ID
 * @param {string} error - Error message
 * @return {Promise<void>}
 */
export const failSyncStatus = async (syncId: string, error: string) => {
  await updateSyncStatus(syncId, {
    status: "error",
    message: "오류 발생",
    error,
    completedAt: admin.firestore.Timestamp.now(),
  });
};
