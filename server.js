const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { User } = require("./models/User");
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

const getGroqChatCompletion = require("./llm/llmCalls");
const nodemailer = require("nodemailer");

// Create a transporter using your email service
const transporter = nodemailer.createTransport({
  service: "gmail", // or 'hotmail', 'yahoo', etc.
  auth: {
    user: "your_email@gmail.com",
    pass: "your_app_password", // use App Password if 2FA is enabled
  },
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/verify-user", async (req, res) => {
  const { username, password } = req.body;
  const user = User.findOne({ username });
  if (user) {
    if (user.password === password) {
      res.status(200).json({ message: "login successfull" });
    }
    res.status(400).json({ message: "User Name already exists" });
  } else {
    const user = new User({
      username: username,
      password: password,
    });
    await user.save();
  }

  res.status(200).json(user).send("new user created success");
});

app.post("/analyze-instagram", async (req, res) => {
  const { instaProfileUsername, username } = req.body;
  const instaData = await instagramScrapper(instaProfileUsername);
  const instaPrompt = instagramPrompt(instaData);
  const response = await getGroqChatCompletion(instaPrompt);
  const user = await User.findOne({ username });

  if (user) {
    user.instagramResponse = response;
    await user.save();
  } else {
    console.log("User not found");
  }

  res.status(200).json(response);
});

app.post("/analyze-linkedin", async (req, res) => {
  const { linkedinProfileLink, username } = req.body;
  const linkedinData = await linkedinScrapper(linkedinProfileLink);
  const linkedPrompt = linkedinPrompt(linkedinData);
  const response = await getGroqChatCompletion(linkedPrompt);
  const user = await User.findOne({ username });

  if (user) {
    user.linkedinResponse = response;
    await user.save();
  } else {
    console.log("User not found");
  }
  res.status(200).json(response);
});

app.post("/analyze-youtube", async (req, res) => {
  const { youtubeChannelId, username } = req.body;
  const youtubeData = await youtubeScrapper(youtubeChannelId);
  const ytPrompt = youtubePrompt(youtubeData);
  const response = await getGroqChatCompletion(ytPrompt);
  const user = await User.findOne({ username });

  if (user) {
    user.youtubeResponse = response;
    await user.save();
  } else {
    console.log("User not found");
  }
  res.status(200).json(response);
});

app.post("/created-at", async (req, res) => {
  const username = req.body;
  const user = await User.findOne({ username });
  if (user) {
    user.createdAt = new Date();
    await user.save();
  } else {
    console.log("User not found");
  }
});

app.post("/overall-summary", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    const A = user.linkedinResponse;
    const B = user.instagramResponse;
    const C = user.youtubeResponse;
    const summaryFromLLM =
      await getGroqChatCompletion(`SYSTEM: Analyze the user's LinkedIn, Instagram, and YouTube responses. Return a summary in JSON format. ONLY valid JSON.
      LINKEDIN RESPONSE: ${A}
      INSTAGRAM RESPONSE: ${B}
      YOUTUBE RESPONSE: ${C}`);
    user.summary.push(summaryFromLLM);
    await user.save();
    res.json(summaryFromLLM);
  } else {
    res.json({ message: "User not found" });
  }
});

app.get("/previous-data", async (req, res) => {
  const { username } = req.body;
  const user = await User.findone({ username });
  if (user) {
    res.json(user.summary);
  } else {
    res.json({ message: "User not found" });
  }
});

app.get("/send-data-now", async (req, res) => {
  const { username, userEmail } = req.body;
  const user = await User.findOne({ username });
  if (
    user &&
    user.linkedinResponse &&
    user.instagramResponse &&
    user.youtubeResponse
  ) {
    const A = user.linkedinResponse;
    const B = user.instagramResponse;
    const C = user.youtubeResponse;
    const summary = user.summary;
    const sendingResponse = {
      linkedin: A,
      instagram: B,
      youtube: C,
      summary: summary,
    };
    const mailOptions = {
      from: "your_email@gmail.com",
      to: userEmail,
      subject: "48hr - Update from LeadsAgent",
      html: `
          <h3>🚀 48hr - Update from LeadsAgent</h3>
          <ul style="font-size:16px;">
            <li><strong>🔗 LinkedIn:</strong> ${sendingResponse.linkedin}</li>
            <li><strong>📸 Instagram:</strong> ${sendingResponse.instagram}</li>
            <li><strong>📺 YouTube:</strong> ${sendingResponse.youtube}</li>
          </ul>

          <h3>🧠 Summary</h3>
          <p>${sendingResponse.summary}</p>

          <hr />
          <p style="font-size:14px; color:gray;">Generated by your Monitoring Bot 🤖</p>
        `,
    }; // html: '<b>Hello!</b> This is a <i>test</i> email sent using Nodemailer.',

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending mail:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json({ message: "Data sent successfully", data: sendingResponse });
  } else {
    res.json({ message: "User not found" });
  }
});
// app.post("/update-user", async (req, res) => {

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
