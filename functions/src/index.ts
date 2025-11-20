import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { updateEvents } from "./updateEvents";
export { generateEventContent } from "./generateEventContent";

if (!admin.apps.length) {
  admin.initializeApp();
}

// Scheduled function (Cron)
// Run every day at midnight Seoul time
// Scheduled function (Cron)
// Run every day at midnight Seoul time
export const scheduledEventUpdate = onSchedule(
  {
    schedule: "0 0 * * *",
    timeZone: "Asia/Seoul",
    timeoutSeconds: 540,
    memory: "1GiB",
  },
  async () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const formatDate = (date: Date) => date.toISOString().split("T")[0].replace(/-/g, "");

    const startDate = formatDate(lastMonth);
    const endDate = formatDate(nextMonth);

    await updateEvents(startDate, endDate);
  }
);

// Manual trigger for testing (HTTP)
// Usage: https://us-central1-<project-id>.cloudfunctions.net/manualEventUpdate?stdate=20240101&eddate=20240131
// If no params provided, defaults to Today -> Next Month
export const manualEventUpdate = onRequest(
  { timeoutSeconds: 300, memory: "1GiB" },
  async (req, res) => {
    const formatDate = (date: Date) => date.toISOString().split("T")[0].replace(/-/g, "");

    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const defaultStart = formatDate(lastMonth);
    const defaultEnd = formatDate(nextMonth);

    const startDate = (req.query.stdate as string) || defaultStart;
    const endDate = (req.query.eddate as string) || defaultEnd;

    try {
      await updateEvents(startDate, endDate);
      res.send(`Successfully triggered event update from ${startDate} to ${endDate}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating events");
    }
  }
);

// Callable function for Frontend (Studio)
export const triggerEventUpdate = onCall(
  { cors: true, timeoutSeconds: 300, memory: "1GiB" },
  async (request) => {
    // Ensure user is authenticated
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const data = request.data;
    const formatDate = (date: Date) => date.toISOString().split("T")[0].replace(/-/g, "");

    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const startDate = data.startDate || formatDate(lastMonth);
    const endDate = data.endDate || formatDate(nextMonth);

    // Generate unique sync ID for progress tracking
    const syncId = `sync_${Date.now()}_${request.auth.uid}`;

    // Start update in background (don't await)
    updateEvents(startDate, endDate, syncId).catch((error) => {
      console.error("Background event update failed:", error);
    });

    // Return immediately with syncId for progress tracking
    return {
      success: true,
      syncId,
      message: `이벤트 업데이트를 시작했습니다. ${startDate}부터 ${endDate}까지의 이벤트를 가져옵니다.`,
    };
  }
);
