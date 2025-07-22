# 📊 AI Monitor – 48hr Influencer & Competitor Tracker

## 🚀 Overview

**AI TrendWatcher** is an intelligent monitoring system that helps **marketing teams, brand managers, and research analysts** stay ahead by tracking **influencer** or **competitor** activity across social media.

✅ **Supports input of LinkedIn, YouTube, and Instagram profile handles.**

### 🎯 What It Does

Just provide your **target social media handles**, and our agent will:

1. **Scrape and analyze** recent content from:
   - ✅ LinkedIn Profiles
   - ✅ YouTube Channels
   - ✅ Instagram Accounts
2. **Summarize activity** using AI (LLM-based) – highlighting key themes, strategies, and audience reactions.
3. **Compare trends**, highs/lows, and engagement metrics over time.
4. **Auto-email** your team a full summary every 48 hours.

No need to manually track your competitors or influencers again.

---

## 🧠 Key Features

- 🧩 **Multi-Platform Handle Input**:
  - `linkedin.com/in/username`
  - `youtube.com/@channel`
  - `instagram.com/handle`
- 🕵️ **Competitor/Influencer Intelligence**
- 📈 **Engagement Tracking** (likes, comments, views, shares)
- 🧠 **AI Insights** – from OpenAI GPT models
- ⏱ **Automatic 48hr Refresh**
- 📬 **Email Summaries Delivered Every 2 Days**
- 🗂️ **Database of Historical Insights**

---

## 🛠️ Tech Stack

| Layer         | Tech Used                    |
|---------------|------------------------------|
| **Frontend**  | React, TailwindCSS           |
| **Backend**   | Node.js, Express             |
| **Database**  | MongoDB                      |
| **Scraping**  | Puppeteer / Cheerio / APIs   |
| **AI Engine** | OpenAI GPT / LLM             |
| **Email**     | Nodemailer / Resend / SMTP   |
| **Scheduler** | `node-cron` or background jobs |

---

## 🧩 System Architecture

```plaintext
User Inputs IG/YT/LinkedIn Handles → DB
                ↓
   Scraping + Content Fetching
                ↓
   AI Summarizer (LLM + Rules)
                ↓
     Trend Analyzer + Formatter
                ↓
          Auto Email Summary
