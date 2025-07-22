// Social Media Analysis Prompts - JSON Only Output

function linkedinPrompt(data) {
  const prompt = `You are an AI that analyzes recent LinkedIn posts from a user or brand.

Input: A JSON array of recent LinkedIn posts. Each post includes content, number of likes, comments, reactions, and date.
ANALYZE: ${JSON.stringify(data)}


Task: Carefully analyze:
- overal updates that we got from the data
- New or emerging topics the user is posting about.
- Which of these topics generated the most engagement.
- What kind of post content is resonating with the audience.
- Trends in the user's focus or audience response over time.
- summary must be  130-150 words consisting of thier new content summray with the trends they are follwing which trend is worked well for them.
- no extra charectors or / or \ spaces just contect with some emojes 
Return only a JSON object in this exact format by including everything stated above this is must :
{
  "summary": "..." 
}`;

  return prompt;
}

function youtubePrompt(data) {
  const prompt = `You are an AI assistant that analyzes YouTube channel videos and engagement.
ANALYZE: ${JSON.stringify(data)}

Input: A JSON array of recent videos with fields like title, description, views, likes, comments, and upload date.

Task: Summarize as a JSON string:
- Dominant content categories
- overal updates that we got from the data
- Video with best engagement (likes/views/comments)
- Viewer sentiment trend (based on comments)
- Optimal posting time/day (if detectable)
- Recommendation for content improvement
- summary must be strictly 130-150 words consisting of thier new content summray with the trends they are follwing which trend is worked well for them try to use the data given and state what recetn vedio out of all worked well and statrgety they must have followed.
- no extra charectors or / or \ spaces just contect with some emojes 
Return only a JSON object in this exact format by including everything stated above this is must :
{
  "summary": "..." 
}`;

  return prompt;
}

function instagramPrompt(data) {
  const prompt = `You are an AI agent that reviews Instagram posts of influencers or brands.

Input: A JSON array of recent posts including caption, likes, comments, hashtags, and post type (image, reel, story).
ANALYZE: ${JSON.stringify(data)}


Task: Generate a JSON string summarizing:
- Trending themes or visuals
- overal updates that we got from the data
- Most engaging format (reels, stories, posts)
- Frequently used hashtags and their performance
- Audience interaction tone
- Insights for future post strategy
- summary must be  130-150 words consisting of thier new content summray with the trends they are follwing which trend is worked well for them.
- no extra charectors or / or \ spaces just contect with some emojes 
Return only a JSON object in this exact format by including everything stated above this is must :
{
  "summary": "..." 
}`;

  return prompt;
}

module.exports = { linkedinPrompt, youtubePrompt, instagramPrompt };
