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
// const getGroqChatCompletion = require("./llm/llmCalls");
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

// app.post("/analyze-instagram", async (req, res) => {
//   console.log("[POST /analyze-instagram] Entry:", req.body);
//   const { instaProfileUsername, username } = req.body;
//   const instaData = await instagramScrapper(instaProfileUsername);
//   const instaPrompt = instagramPrompt(instaData);
//   const response = await getGroqChatCompletion(instaPrompt);
//   console.log(response , "here is the response")
//   console.log("response ended here")

//   const user = await User.findOne({ username });
//   if (user) {
//     user.socialMedia.instagram.handle = instaProfileUsername;
//     user.socialMedia.instagram.response = response;
//     await user.save();
//     console.log(
//       "[POST /analyze-instagram] Instagram analysis response:",
//       response
//     );
//     res.status(200).json(response);
//     console.log("[POST /analyze-instagram] Response sent");
//   } else {
//     console.log("[POST /analyze-instagram] User not found");
//     res.status(404).json({ message: "User not found" });
//     console.log("[POST /analyze-instagram] Response sent: User not found");
//   }
// });

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

// app.post("/analyze-linkedin", async (req, res) => {
// console.log("[POST /analyze-linkedin] Entry:", req.body);
// const { linkedinProfileLink, username } = req.body;
// const linkedinData = await linkedinScrapper(linkedinProfileLink);
// const linkedPrompt = linkedinPrompt(linkedinData);
// const response = await getGroqChatCompletion(linkedPrompt);

// const user = await User.findOne({ username });
// if (user) {
//   user.socialMedia.linkedin.handle = linkedinProfileLink;
//   user.socialMedia.linkedin.response = response;
//   await user.save();
//   console.log("[POST /analyze-linkedin] LinkedIn analysis response:", response);
//   res.status(200).json(response);
//   console.log("[POST /analyze-linkedin] Response sent");
// } else {
//   console.log("[POST /analyze-linkedin] User not found");
//   res.status(404).json({ message: "User not found" });
//   console.log("[POST /analyze-linkedin] Response sent: User not found");
// }
// });

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

// app.post("/analyze-youtube", async (req, res) => {
//   console.log("[POST /analyze-youtube] Entry:", req.body);
//   const { youtubeChannelId, username } = req.body;
//   const youtubeData = await youtubeScrapper(youtubeChannelId);
//   const ytPrompt = youtubePrompt(youtubeData);
//   const response = await getGroqChatCompletion(ytPrompt);
//   // console.log(response , "here is the response")
//   const user = await User.findOne({ username });
//   if (user) {
//     user.socialMedia.youtube.handle = youtubeChannelId;
//     user.socialMedia.youtube.response = response;
//     await user.save();
//     console.log("[POST /analyze-youtube] YouTube analysis response:", response);
//     res.status(200).json(response);
//     console.log("[POST /analyze-youtube] Response sent");
//   } else {
//     console.log("[POST /analyze-youtube] User not found");
//     res.status(404).json({ message: "User not found" });
//     console.log("[POST /analyze-youtube] Response sent: User not found");
//   }
// });

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

app.post("/overall-summary", async (req, res) => {
  console.log("[POST /overall-summary] Entry:", req.body);
  const { username } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    const A = user.socialMedia.linkedin.response;
    const B = user.socialMedia.instagram.response;
    const C = user.socialMedia.youtube.response;

    const summaryFromLLM = await getGroqChatCompletion(`
      SYSTEM: Analyze the user's LinkedIn, Instagram, and YouTube responses. Return a summary in JSON format. ONLY valid JSON.
      LINKEDIN RESPONSE: ${A}
      INSTAGRAM RESPONSE: ${B}
      YOUTUBE RESPONSE: ${C}
    `);

    user.summary.push(summaryFromLLM);
    await user.save();
    console.log("[POST /overall-summary] Summary response:", summaryFromLLM);
    res.json(summaryFromLLM);
    console.log("[POST /overall-summary] Response sent");
  } else {
    console.log("[POST /overall-summary] User not found");
    res.status(404).json({ message: "User not found" });
    console.log("[POST /overall-summary] Response sent: User not found");
  }
});

app.get("/previous-data", async (req, res) => {
  console.log("[GET /previous-data] Entry:", req.query);
  const { username } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    // console.log("[GET /previous-data] Previous data:", user.summary);

    res.json(user.socialMedia);

    console.log("[GET /previous-data] Response sent");
  } else {
    console.log("[GET /previous-data] User not found");
    res.status(404).json({ message: "User not found" });
    console.log("[GET /previous-data] Response sent: User not found");
  }
});
// app.get("/send-data-now", async (req, res) => {
// console.log("[GET /send-data-now] Entry:", req.body);
// const { username, userEmail } = req.body;
// const user = await User.findOne({ username });

// if (
//   user &&
//   user.socialMedia.linkedin.response &&
//   user.socialMedia.instagram.response &&
//   user.socialMedia.youtube.response
// ) {
//   const A = user.socialMedia.linkedin.response;
//   const B = user.socialMedia.instagram.response;
//   const C = user.socialMedia.youtube.response;
//   const summary = user.summary;

//   const sendingResponse = {
//     linkedin: A,
//     instagram: B,
//     youtube: C,
//     summary,
//   };

//   const mailOptions = {
//     from: "your_email@gmail.com",
//     to: userEmail,
//     subject: "48hr - Update from LeadsAgent",
//     html: `
//         <h3>🚀 48hr - Update from LeadsAgent</h3>
//         <ul style="font-size:16px;">
//           <li><strong>🔗 LinkedIn:</strong> ${sendingResponse.linkedin}</li>
//           <li><strong>📸 Instagram:</strong> ${sendingResponse.instagram}</li>
//           <li><strong>📺 YouTube:</strong> ${sendingResponse.youtube}</li>
//         </ul>

//         <h3>🧠 Summary</h3>
//         <p>${sendingResponse.summary}</p>

//         <hr />
//         <p style="font-size:14px; color:gray;">Generated by your Monitoring Bot 🤖</p>
//       `,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("[GET /send-data-now] Error sending mail:", error);
//       res.status(500).json({ message: "Email sending failed", error });
//       console.log("[GET /send-data-now] Response sent: Email sending failed");
//     } else {
//       console.log("[GET /send-data-now] Email sent:", info.response);
//       res.json({ message: "Data sent successfully", data: sendingResponse });
//       console.log("[GET /send-data-now] Response sent: Data sent successfully");
//     }
//   });
// } else {
//   console.log("[GET /send-data-now] User not found or incomplete data");
//   res.status(404).json({ message: "User not found or incomplete data" });
//   console.log(
//     "[GET /send-data-now] Response sent: User not found or incomplete data"
//   );
// }
// });

//
app.post("/send-data-now", async (req, res) => {
  console.log("[POST /send-data-now] Entry:", req.body);
  const { username, userEmail } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    console.log("[POST /send-data-now] User not found");
    return res.status(404).json({ message: "User not found" });
  }

  // Get the latest entries from each platform
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

  // const latestS/ummary = user.summary?.at(-1) || "";

  // const sendingResponse = {
  //   ighandler: latestInstagram?.handle,
  //   instagram: latestInstagramResponse,

  //   linkedinhandler: latestLinkedIn?.handle,
  //   linkedin: latestLinkedInResponse,

  //   ythandler: latestYouTube?.handle,
  //   youtube: latestYouTubeResponse,
  //   // summary: latestSummary,
  // };


  // const resp = await getGroqChatCompletion(sendingResponse+"these are the handles and data of those handles if any of the field is empty pleas that field empty in the output also  i need a proper summary with full ananslyse based on the data given to ")

  const mailOptions = {
    from: "ddrive600@gmail.com",
    to: userEmail,
    subject: "📬 48hr - Update from LeadsAgent",
    html: `
      <h2>🚀 48hr Social Media Insights from LeadsAgent</h2>
      <p><strong>👤 Username:</strong> ${username}</p>

      <h3>📸 Instagram (@${latestInstagram?.handle || "N/A"})</h3>
      <pre>${JSON.stringify(latestInstagramResponse, null, 2)}</pre>

      <h3>🔗 LinkedIn (${latestLinkedIn?.handle || "N/A"})</h3>
      <pre>${JSON.stringify(latestLinkedInResponse, null, 2)}</pre>

      <h3>📺 YouTube (${latestYouTube?.handle || "N/A"})</h3>
      <pre>${JSON.stringify(latestYouTubeResponse, null, 2)}</pre>

      // <h3>🧠 Summary</h3>
      // <pre>${JSON.stringify(latestSummary, null, 2)}</pre>

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
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
