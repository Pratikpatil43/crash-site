// stress-test.js
const https = require("https"); // for HTTPS targets

const TARGET = "https://mentrawellness.vercel.app"; // staging site
const TOTAL_REQUESTS = 10000; // safe number
let completed = 0;

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
