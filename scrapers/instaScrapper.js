const puppeteer = require("puppeteer");

 async function instagramScrapper(username) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  try {
    await page.goto(`https://www.instagram.com/${username}/`, {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector("article a");

    // Get first 3 post links
    const postLinks = await page.$$eval("article a", (links) =>
      links.slice(0, 3).map((a) => a.href)
    );

    const posts = [];

    for (const link of postLinks) {
      await page.goto(link, { waitUntil: "networkidle2" });
      await page.waitForSelector("time");

      const data = await page.evaluate(() => {
        const caption =
          document.querySelector("meta[property='og:description']")?.content ||
          "No caption";
        const img =
          document.querySelector("meta[property='og:image']")?.content || null;
        const time =
          document.querySelector("time")?.getAttribute("datetime") || null;
        const likesText =
          document.querySelector("section span span")?.innerText || "N/A";
        return {
          caption,
          img,
          time,
          likesText,
          url: window.location.href,
        };
      });

      posts.push(data);
    }

    console.log(posts);
    await browser.close();
    return posts;
  } catch (err) {
    console.error("Error:", err.message);
    await browser.close();
  }
}

module.exports = { instagramScrapper };

