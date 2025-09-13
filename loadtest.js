// server.js
const https = require("https");
const express = require("express");
const app = express();
const PORT = 3000;

// Server route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);

  // Safe throttled stress test
  const TARGET = "https://mentrawellness.vercel.app";
  const TOTAL_REQUESTS = 50000;  // 50k requests
  const BATCH_SIZE = 100;        // requests per batch
  const INTERVAL_MS = 50;        // delay between batches

  let completed = 0;
  let batchStart = 0;

  console.log("Starting throttled stress test for 50,000 requests...");

  const interval = setInterval(() => {
    for (let i = 0; i < BATCH_SIZE && batchStart + i < TOTAL_REQUESTS; i++) {
      https.get(TARGET, (res) => {
        completed++;
        if (completed % 500 === 0) { // log every 500 requests
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
      console.log("Stress test finished!");
    }
  }, INTERVAL_MS);
});
