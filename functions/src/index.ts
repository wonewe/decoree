import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

const N8N_WEBHOOK_URL = "https://afraid-teeth-itch.loca.lt/webhook/koraid-alert";

type FetchFn = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;
const fetchFn: FetchFn = (...args: Parameters<typeof fetch>) => fetch(...args);

export const koraidContentAlert = functions.firestore
  // Firestore document path must be collection/doc/collection/doc…
  // Example: each category doc holds an "items" subcollection.
  .document("content/{category}/items/{docId}")
  .onWrite(async (
    change: functions.Change<functions.firestore.DocumentSnapshot>,
    context: functions.EventContext
  ) => {
    const category = context.params.category as string;
    const docId = context.params.docId as string;

    const before = change.before.exists ? change.before.data() : null;
    const after = change.after.exists ? change.after.data() : null;

    if (!after) {
      console.log("Document deleted, skip alert");
      return;
    }

    const type = before ? "update" : "create";

    const payload = {
      category,
      docId,
      type,
      before,
      after,
      timestamp: Date.now(),
    };

    try {
      const res = await fetchFn(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      console.log("n8n webhook response status:", res.status);
    } catch (err) {
      console.error("Error calling n8n webhook:", err);
    }
  });
