const puppeteer = require("puppeteer");
const fs = require("fs");
const cheerio = require("cheerio");
const { Parser } = require("json2csv");

async function linkedinScrapper(profileUrl) {
  const cookies = JSON.parse(fs.readFileSync("linkedin-cookies.json", "utf8"));

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setCookie(...cookies);

  console.log("✅ Logged in using cookies...");

  await page.goto(profileUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  console.log("📄 Navigated to recent activity page...");

  // Scroll to load more posts
  let previousHeight = 0;
  for (let i = 0; i < 5; i++) {
    previousHeight = await page.evaluate("document.body.scrollHeight");
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const html = await page.content();
  const $ = cheerio.load(html);

  const posts = [];

  $("div.feed-shared-update-v2").each((i, el) => {
    const id = $(el).attr("data-urn");
    const url = $(el).find("a.app-aware-link").attr("href");
    const author = $(el)
      .find("span.update-components-actor__title span span")
      .first()
      .text()
      .trim();
    const jobTitle = $(el)
      .find("span.update-components-actor__description span span")
      .text()
      .trim();
    const time = $(el)
      .find("span.feed-shared-actor__sub-description > span.visually-hidden")
      .text()
      .trim();
    const content = $(el)
      .find("div.update-components-text span[dir='ltr']")
      .text()
      .replace(/\s+/g, " ")
      .trim();
    const reactions = $(el)
      .find("li.social-details-social-counts__reactions span")
      .text()
      .trim();
    const comments = $(el)
      .find("li.social-details-social-counts__comments span")
      .text()
      .trim();
    const impressions = $(el)
      .find("li.social-details-social-counts__impression span")
      .text()
      .trim();

    posts.push({
      id,
      url,
      author,
      job_title: jobTitle,
      time,
      content,
      reactions,
      comments,
      impressions,
    });
  });

  await browser.close();

  // Save to CSV
  if (posts.length > 0) {
    const parser = new Parser();
    const csv = parser.parse(posts);
    // fs.writeFileSync("linkedin_posts.json", JSON.stringify(posts, null, 2));

    // console.log("✅ Data saved to linkedin_posts.csv");
    const postsJson = JSON.stringify(posts, null, 2);
    return posts; // Return the posts array, not 'post' or 'postsJson'
  } else {
    console.log("⚠️ No posts found to save.");
    return []; // Return empty array if no posts
  }
}

module.exports = { linkedinScrapper };
