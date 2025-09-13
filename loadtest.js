// massive-load-test.js
const https = require("https");

// CONFIG
const TARGET = "https://mentrawellness.vercel.app"; // Replace with your site
const TOTAL_REQUESTS = 1000000;         // 10 lakh requests for example
const BATCH_SIZE = 500;                 // requests per batch
const INTERVAL_MS = 50;                 // delay between batches in ms

let completed = 0;
let batchStart = 0;

console.log("Starting safe massive load test...");

const interval = setInterval(() => {
  for (let i = 0; i < BATCH_SIZE && batchStart + i < TOTAL_REQUESTS; i++) {
    https.get(TARGET, (res) => {
      completed++;
      if (completed % 1000 === 0) {
        console.log(`Completed: ${completed}, Status: ${res.statusCode}`);
      }
    }).on("error", (err) => {
      completed++;
      console.log(`Error: ${err.message}`);
    });
  }

  batchStart += BATCH_SIZE;

  if (batchStart >= TOTAL_REQUESTS) {
    clearInterval(interval);
    console.log("Load test finished!");
  }
}, INTERVAL_MS);
