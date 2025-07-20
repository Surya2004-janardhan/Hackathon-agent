const express = require("express");
const app = express();
const PORT = 3000;

const {
  analyzeInstagram,
  analyzeLinkedIn,
  analyzeYouTube,
} = require("./prompts");


// Example update function
function update() {
  console.log("Update function executed at", new Date());
  // Your update logic here
}

// Scheduler: runs every 48 hours (48 * 60 * 60 * 1000 ms)
setInterval(update, 48 * 60 * 60 * 1000);

// Run update once on server start
update();

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
