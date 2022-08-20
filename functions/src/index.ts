import * as functions from "firebase-functions";

export const card = functions.https.onCall((request, response) => {
  console.log("request", request);
  functions.logger.info("Hello logs!", { structuredData: true });
  return "complete";
});
