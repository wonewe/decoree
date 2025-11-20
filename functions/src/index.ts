import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { updateEvents } from './updateEvents';

admin.initializeApp();

// Scheduled function (Cron)
// Run every day at midnight Seoul time
export const scheduledEventUpdate = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0].replace(/-/g, '');

    const startDate = formatDate(today);
    const endDate = formatDate(nextMonth);

    await updateEvents(startDate, endDate);
    return null;
  });

// Manual trigger for testing (HTTP)
export const manualEventUpdate = functions.https.onRequest(async (req, res) => {
  const startDate = req.query.stdate as string || '20240101';
  const endDate = req.query.eddate as string || '20240131';

  try {
    await updateEvents(startDate, endDate);
    res.send(`Events updated from ${startDate} to ${endDate}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating events');
  }
});
