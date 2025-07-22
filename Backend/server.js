const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/User");
const nodeMailer = require("nodemailer");
const PORT = 3000;
const { instagramScrapper } = require("./scrapers/instaScrapper");
const { linkedinScrapper } = require("./scrapers/linkedinScrapper");
const { youtubeScrapper } = require("./scrapers/youtubeScrapper");
const {
  instagramPrompt,
  youtubePrompt,
  linkedinPrompt,
} = require("./llm/prompts");

const cors = require("cors");
app.use(cors());
app.use(express.json());
const { getGroqChatCompletion } = require("./llm/llmCalls");
const nodemailer = require("nodemailer");
const connectToMongo = require("./db/dbConnection");

// Create a transporter using your email service
const transporter = nodemailer.createTransport({
  service: "gmail", // or 'hotmail', 'yahoo', etc.
  auth: {
    user: "ddrive600@gmail.com",
    pass: "njdm hddr myaq tjoe", // use App Password if 2FA is enabled
  },
});

connectToMongo();
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/user", async (req, res) => {
  console.log("[POST /user] Entry: here in the route", req.body);
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    console.log("[POST /user] User exists:", user);
    res.status(200).json({ message: "user exits ", user: user });
    console.log("[POST /user] Response sent: user exist");
  } else {
    const newuser = new User({ username: username });
    await newuser.save();
    console.log("[POST /user] New user created:", newuser);
    res
      .status(200)
      .json({ user: newuser, message: "new user created success" });
    console.log("[POST /user] Response sent: new user created success");
  }
});

app.post("/analyze-instagram", async (req, res) => {
  const { instaProfileUsername, username } = req.body;
  console.log(req.body.instaProfileUsername);
  const instaData = await instagramScrapper(instaProfileUsername);
  const instaPrompt = instagramPrompt(instaData);
  const llmRaw = await getGroqChatCompletion(instaPrompt);
  const response = typeof llmRaw === "string" ? JSON.parse(llmRaw) : llmRaw;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const existingProfile = user.socialMedia.instagram.find(
    (profile) => profile.handle === instaProfileUsername
  );

  if (existingProfile) {
    existingProfile.responses.push(response);
  } else {
    user.socialMedia.instagram.push({
      handle: instaProfileUsername,
      responses: [response],
    });
  }

  await user.save();
  console.log(response, "here the insta analyzed");
  res.status(200).json(response);
});

app.post("/analyze-linkedin", async (req, res) => {
  const { linkedinProfileLink, username } = req.body;
  const linkedinData = await linkedinScrapper(linkedinProfileLink);
  const linkedPrompt = linkedinPrompt(linkedinData);
  const llmRaw = await getGroqChatCompletion(linkedPrompt);
  const response = typeof llmRaw === "string" ? JSON.parse(llmRaw) : llmRaw;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const existingProfile = user.socialMedia.linkedin.find(
    (profile) => profile.handle === linkedinProfileLink
  );

  if (existingProfile) {
    existingProfile.responses.push(response);
  } else {
    user.socialMedia.linkedin.push({
      handle: linkedinProfileLink,
      responses: [response],
    });
  }

  await user.save();
  res.status(200).json(response);
});

app.post("/analyze-youtube", async (req, res) => {
  const { youtubeChannelId, username } = req.body;
  const youtubeData = await youtubeScrapper(youtubeChannelId);
  const ytPrompt = youtubePrompt(youtubeData);
  const llmRaw = await getGroqChatCompletion(ytPrompt);
  const response = typeof llmRaw === "string" ? JSON.parse(llmRaw) : llmRaw;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const existingProfile = user.socialMedia.youtube.find(
    (profile) => profile.handle === youtubeChannelId
  );

  if (existingProfile) {
    existingProfile.responses.push(response);
  } else {
    user.socialMedia.youtube.push({
      handle: youtubeChannelId,
      responses: [response],
    });
  }

  await user.save();
  res.status(200).json(response);
});

app.post("/created-at", async (req, res) => {
  console.log("[POST /created-at] Entry:", req.body);
  const { username } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    user.createdAt = new Date();
    await user.save();
    console.log("[POST /created-at] Timestamp updated for user:", username);
    res.status(200).json({ message: "Timestamp updated" });
    console.log("[POST /created-at] Response sent: Timestamp updated");
  } else {
    console.log("[POST /created-at] User not found");
    res.status(404).json({ message: "User not found" });
    console.log("[POST /created-at] Response sent: User not found");
  }
});

app.get("/previous-data", async (req, res) => {
  console.log("[GET /previous-data] Entry:", req.query);
  const { username } = req.query;
  const user = await User.findOne({ username });

  if (user) {
    res.json(user.socialMedia);
    console.log("[GET /previous-data] Response sent");
  } else {
    console.log("[GET /previous-data] User not found");
    res.status(404).json({ message: "User not found" });
    console.log("[GET /previous-data] Response sent: User not found");
  }
});

app.post("/send-data-now", async (req, res) => {
  try {
    console.log("[POST /send-data-now] Entry:", req.body);
    const { username, userEmail } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      console.log("[POST /send-data-now] User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Get latest entries from each platform
    const latestInstagram = user.socialMedia?.instagram?.at(-1);
    const latestLinkedIn = user.socialMedia?.linkedin?.at(-1);
    const latestYouTube = user.socialMedia?.youtube?.at(-1);

    if (!latestInstagram && !latestLinkedIn && !latestYouTube) {
      return res
        .status(400)
        .json({ message: "Not enough data on all platforms" });
    }

    const latestInstagramResponse = latestInstagram?.responses?.at(-1) || "";
    const latestLinkedInResponse = latestLinkedIn?.responses?.at(-1) || "";
    const latestYouTubeResponse = latestYouTube?.responses?.at(-1) || "";

    const sendingResponse = {
      instagram: latestInstagramResponse,
      linkedin: latestLinkedInResponse,
      youtube: latestYouTubeResponse,
    };

    const mailOptions = {
      from: "ddrive600@gmail.com",
      to: userEmail,
      subject: "📬 48hr - Update from LeadsAgent",
      html: `
        <h2>🚀 48hr Social Media Insights from LeadsAgent</h2>
        <p><strong>👤 Username:</strong> ${username}</p>

        <h3>📸 Instagram (@${latestInstagram?.handle || "N/A"})</h3>
        <pre>${JSON.stringify(
          latestInstagramResponse.summary || "No summary available",
          null,
          2
        )}</pre>

        <h3>🔗 LinkedIn (${latestLinkedIn?.handle || "N/A"})</h3>
        <pre>${JSON.stringify(
          latestLinkedInResponse.summary || "No summary available",
          null,
          2
        )}</pre>

        <h3>📺 YouTube (${latestYouTube?.handle || "N/A"})</h3>
        <pre>${JSON.stringify(
          latestYouTubeResponse.summary || "No summary available",
          null,
          2
        )}</pre>

        <hr />
        <p style="font-size:14px; color:gray;">Generated by your Monitoring Bot 🤖</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("[POST /send-data-now] Error sending mail:", error);
        return res.status(500).json({ message: "Email sending failed", error });
      } else {
        console.log("[POST /send-data-now] Email sent:", info.response);
        return res.json({
          message: "Data sent successfully",
          data: sendingResponse,
        });
      }
    });
  } catch (err) {
    console.error("[POST /send-data-now] Unexpected error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
