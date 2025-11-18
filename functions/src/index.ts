import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

const N8N_WEBHOOK_URL =
  "https://afraid-teeth-itch.loca.lt/webhook/koraid-alert";

type FetchFn = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;
const fetchFn: FetchFn = (...args: Parameters<typeof fetch>) => fetch(...args);

export const koraidContentAlert = functions.firestore
  .document("trends/{docId}")
  .onWrite(
    async (
      change: functions.Change<functions.firestore.DocumentSnapshot>,
      context: functions.EventContext
    ) => {
      const docId = context.params.docId as string;

      const before = change.before.exists ? change.before.data() : null;
      const after = change.after.exists ? change.after.data() : null;
      const type = before ? "update" : "create";

      try {
        const res = await fetchFn(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            category: "trends",
            docId,
            type,
            before,
            after,
            timestamp: Date.now(),
          }),
        });
        console.log("n8n webhook response status:", res.status);
      } catch (err) {
        console.error("Error calling n8n webhook:", err);
      }
    }
  );
