// external-load-test.js
const https = require("https");

// CONFIG
const TARGET = "https://mentrawellness.vercel.app"; // external URL
const TOTAL_REQUESTS = 50000;     // total requests to send
const BATCH_SIZE = 10;           // number of requests per batch
const INTERVAL_MS = 200;         // delay between batches in ms
const MAX_RETRIES = 3;           // retry failed requests

let completed = 0;
let batchStart = 0;

console.log("Starting throttled load test on external URL...");

const sendRequest = (retries = 0) => {
  const options = {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    },
    timeout: 5000, // 5 seconds per request
  };

  https.get(TARGET, options, (res) => {
    completed++;
    if (completed % 50 === 0) {
      console.log(`Completed: ${completed}, Status: ${res.statusCode}`);
    }
  }).on("error", (err) => {
    if (retries < MAX_RETRIES) {
      sendRequest(retries + 1); // retry failed request
    } else {
      completed++;
      console.log(`Error after retries: ${err.message}`);
    }
  });
};

const interval = setInterval(() => {
  for (let i = 0; i < BATCH_SIZE && batchStart + i < TOTAL_REQUESTS; i++) {
    sendRequest();
  }

  batchStart += BATCH_SIZE;

  if (batchStart >= TOTAL_REQUESTS) {
    clearInterval(interval);
    console.log("Load test finished!");
  }
}, INTERVAL_MS);
