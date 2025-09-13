const https = require("https");
const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);

  const TARGET = "https://mentrawellness.vercel.app";
  const TOTAL_REQUESTS = 50000;
  const BATCH_SIZE = 100;
  const INTERVAL_MS = 50;

  let completed = 0;
  let batchStart = 0;

  console.log("Starting throttled stress test for 50,000 requests...");

  const interval = setInterval(() => {
    for (let i = 0; i < BATCH_SIZE && batchStart + i < TOTAL_REQUESTS; i++) {
      // Merge URL and headers into one options object
      const options = {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      };

      https.get(TARGET, options, (res) => {
        completed++;
        if (completed % 500 === 0) {
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
