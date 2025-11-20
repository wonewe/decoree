import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { updateEvents } from "./updateEvents";

if (!admin.apps.length) {
  admin.initializeApp();
}

// Scheduled function (Cron)
// Run every day at midnight Seoul time
export const scheduledEventUpdate = onSchedule(
  {
    schedule: "0 0 * * *",
    timeZone: "Asia/Seoul",
  },
  async () => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const formatDate = (date: Date) => date.toISOString().split("T")[0].replace(/-/g, "");

    const startDate = formatDate(today);
    const endDate = formatDate(nextMonth);

    await updateEvents(startDate, endDate);
  }
);

// Manual trigger for testing (HTTP)
// Usage: https://us-central1-<project-id>.cloudfunctions.net/manualEventUpdate?stdate=20240101&eddate=20240131
// If no params provided, defaults to Today -> Next Month
export const manualEventUpdate = onRequest(async (req, res) => {
  const formatDate = (date: Date) => date.toISOString().split("T")[0].replace(/-/g, "");

  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  const defaultStart = formatDate(today);
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
});

// Callable function for Frontend (Studio)
export const triggerEventUpdate = onCall({ cors: true }, async (request) => {
  // Ensure user is authenticated
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  const data = request.data;
  const formatDate = (date: Date) => date.toISOString().split("T")[0].replace(/-/g, "");

  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  const startDate = data.startDate || formatDate(today);
  const endDate = data.endDate || formatDate(nextMonth);

  try {
    await updateEvents(startDate, endDate);
    return { success: true, message: `Events updated from ${startDate} to ${endDate}` };
  } catch (error) {
    console.error("Error in triggerEventUpdate:", error);
    throw new HttpsError("internal", "Failed to update events", error);
  }
});
