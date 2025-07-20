const axios = require("axios");
require("dotenv").config();

// Replace with your key or use env
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Your API Key

// 1. Fetch YouTube Videos in last 48 hrs
async function fetchYouTubePostsLast48Hrs(channelId) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;

  try {
    const res = await axios.get(url);
    const videos = res.data.items;

    const now = new Date();
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const filtered = videos
      .filter((video) => {
        const publishedAt = new Date(video.snippet.publishedAt);
        return publishedAt > fortyEightHoursAgo;
      })
      .map((video) => ({
        text: `${video.snippet.title} - ${video.snippet.description}`,
        timestamp: video.snippet.publishedAt,
        videoId: video.id.videoId,
        link: `https://youtube.com/watch?v=${video.id.videoId}`,
      }));
    //   console.log(filtered)
    return filtered;
  } catch (error) {
    console.error("YouTube Fetch Error:", error.message);
    return [];
  }
}

// 2. Get stats/details of videos
async function getVideoDetails(videoIds) {
  const ids = videoIds.join(",");
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids}&key=${YOUTUBE_API_KEY}`;

  const res = await axios.get(url);
  //   console.log(res.data)

  return res.data.items.map((video) => ({
    id: video.id,
    title: video.snippet.title,
    // description: video.snippet.description,
    publishedAt: video.snippet.publishedAt,
    tags: video.snippet.tags,
    views: video.statistics.viewCount,
    likes: video.statistics.likeCount,
    comments: video.statistics.commentCount,
    // duration: video.contentDetails.duration,
  }));
}

// 4. Main Orchestrator
export async function youtubeScrapper(channelId) {
  const recent = await fetchYouTubePostsLast48Hrs(channelId);
  if (recent.length === 0) return console.log("No videos in last 48 hrs.");

  const videoIds = recent.map((v) => v.videoId);
  const details = await getVideoDetails(videoIds);
  console.log(details);
  const summary = await generateSummary(details);

  console.log("\n📺 Summary Report:");
  console.log(summary);
  return summary;
}
