// server.js
const https = require("https");
const express = require("express");
const app = express();
const PORT = 3000;

// Your regular server routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);

  // Stress test starts after server is up
  const TARGET = "https://mentrawellness.vercel.app"; // target URL
  const TOTAL_REQUESTS = 10000;
  let completed = 0;

  console.log("Starting stress test...");

  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    https.get(TARGET, (res) => {
      completed++;
      if (completed % 100 === 0) {
        console.log(`Completed: ${completed}, Status: ${res.statusCode}`);
      }
    }).on("error", (err) => {
      completed++;
      console.log(`Error: ${err.message}`);
    });
  }
});
