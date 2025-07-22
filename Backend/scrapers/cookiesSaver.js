const fs = require("fs");
const path = require("path");

const cookiesPath = path.join(__dirname, "linkedin-cookies.json");

if (fs.existsSync(cookiesPath)) {
  const cookies = JSON.parse(fs.readFileSync(cookiesPath));
  await page.setCookie(...cookies);
  await page.goto(
    "https://www.linkedin.com/in/sundarpichai/recent-activity/all/",
    {
      waitUntil: "networkidle2",
    }
  );
} else {
  await page.goto("https://www.linkedin.com/login");
  console.log("Please login manually...");
  await new Promise((res) => setTimeout(res, 60000)); // Wait for login manually

  // Save cookies after login
  const cookies = await page.cookies();
  fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
}
