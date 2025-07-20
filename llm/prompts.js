// Social Media Analysis Prompts - JSON Only Output

export function linkedinPrompt(data) {
  const prompt = `SYSTEM: Professional LinkedIn content analyst. Output ONLY valid JSON.

ANALYSIS METHODOLOGY:
1. TREND IDENTIFICATION: Scan post titles, hashtags, and content themes to identify recurring professional topics, industry buzzwords, and emerging workplace discussions
2. ENGAGEMENT DETECTION: Calculate engagement ratios (likes/views, comments/likes, shares/impressions) to identify highest-performing content types
3. PROFESSIONAL CONTEXT: Analyze posting times, content formats, and audience interactions to understand professional networking patterns
4. INDUSTRY MAPPING: Cross-reference content themes with current business trends, skills demand, and career development patterns

ENGAGEMENT ANALYSIS PRIORITY:
- Posts with >100 likes OR >20 comments OR >10 shares = High engagement
- Posts with industry-specific hashtags + high comment-to-like ratio = Trending professional content
- Posts mentioning "AI", "Remote work", "Leadership", "Career growth" = Current trending themes
- Posts with questions or polls = High engagement potential
- Posts with personal stories + professional insights = Authentic engagement drivers

RULES:
- RETURN ONLY JSON
- NO explanations
- NO code blocks
- NO text outside JSON

ANALYZE: ${JSON.stringify(data)}

REQUIRED JSON OUTPUT:
{
  "professional_themes": ["theme1", "theme2", "theme3"],
  "most_engaging_post": {
    "content": "post_text_or_title",
    "reason": "why_it_performed_well",
    "engagement": {
      "likes": 0,
      "comments": 0,
      "shares": 0,
      "views": 0
    }
  },
  "industry_insights": {
    "primary_industry": "detected_industry",
    "trending_topics": ["topic1", "topic2"],
    "professional_level": "entry/mid/senior/executive"
  },
  "content_strategy": {
    "post_types": ["article", "image", "video", "poll"],
    "optimal_timing": "timing_pattern",
    "audience_engagement": "high/medium/low"
  },
  "network_analysis": {
    "connection_growth": "growth_pattern",
    "influencer_potential": "potential_score",
    "thought_leadership": "leadership_assessment"
  },
  "performance_metrics": {
    "total_likes": 0,
    "total_comments": 0,
    "total_shares": 0,
    "average_engagement_rate": 0.0
  },
  "future_recommendations": {
    "content_suggestions": "what_to_post_next",
    "networking_opportunities": "connection_strategies",
    "career_positioning": "brand_development_advice"
  }
}`;

  return prompt;
}

export function youtubePrompt(data) {
  const prompt = `SYSTEM: YouTube content strategist. Output ONLY valid JSON.

ANALYSIS METHODOLOGY:
1. TREND IDENTIFICATION: Examine video titles for trending keywords, analyze tags/descriptions for viral topics, monitor comment sentiment for emerging interests
2. ENGAGEMENT METRICS: Prioritize videos with high like-to-view ratios (>3%), strong comment engagement (>1% of views), and above-average watch time retention
3. ALGORITHM SIGNALS: Identify content that drives subscriptions, generates shares, and maintains viewer retention beyond 50% completion rate
4. VIRAL CONTENT PATTERNS: Look for videos with exponential view growth, cross-platform sharing indicators, and trending hashtag usage

ENGAGEMENT ANALYSIS PRIORITY:
- Videos with >10K views AND >3% like ratio = High-performing content
- Shorts with >50K views OR >500 comments = Trending format success
- Videos with "How to", "Tutorial", "Review" = Evergreen engagement
- Content posted during peak hours (7-9 PM) with consistent branding = Optimized performance
- Videos with custom thumbnails + compelling titles = Click-through optimization
- Content addressing current events, tech trends, lifestyle changes = Trend-riding potential

RULES:
- RETURN ONLY JSON
- NO explanations
- NO code blocks
- NO text outside JSON

ANALYZE: ${JSON.stringify(data)}

REQUIRED JSON OUTPUT:
{
  "content_categories": ["category1", "category2", "category3"],
  "most_engaging_video": {
    "title": "video_title",
    "reason": "performance_factors",
    "engagement": {
      "likes": 0,
      "comments": 0,
      "views": 0,
      "watch_time": 0,
      "subscribers_gained": 0
    }
  },
  "audience_demographics": {
    "primary_age_group": "age_range",
    "top_countries": ["country1", "country2"],
    "viewing_patterns": "when_they_watch"
  },
  "content_performance": {
    "trending_formats": ["shorts", "long_form", "live"],
    "successful_thumbnails": "thumbnail_style",
    "optimal_duration": "ideal_video_length"
  },
  "channel_growth": {
    "subscriber_trend": "growing/stable/declining",
    "retention_rate": "percentage",
    "monetization_potential": "high/medium/low"
  },
  "performance_metrics": {
    "total_views": 0,
    "total_likes": 0,
    "total_comments": 0,
    "average_watch_time": 0.0,
    "click_through_rate": 0.0
  },
  "optimization_strategy": {
    "seo_opportunities": "keyword_suggestions",
    "content_gaps": "missing_content_types",
    "collaboration_potential": "creator_partnership_ideas",
    "next_video_topics": ["topic1", "topic2", "topic3"]
  }
}`;

  return prompt;
}

export function instagramPrompt(data) {
  const prompt = `SYSTEM: Instagram growth specialist. Output ONLY valid JSON.

ANALYSIS METHODOLOGY:
1. TREND IDENTIFICATION: Analyze hashtags for trending topics, monitor story highlights for consistent themes, examine reels for viral audio/effects usage
2. ENGAGEMENT PATTERNS: Focus on posts with high saves-to-likes ratio (indicates value), strong story completion rates (>70%), and consistent reel performance
3. AESTHETIC TRENDS: Identify visual patterns, color schemes, and content styles that generate higher engagement within specific niches
4. ALGORITHM OPTIMIZATION: Track posts that appear in Explore page, generate profile visits, and drive follower conversion rates

ENGAGEMENT ANALYSIS PRIORITY:
- Posts with >1K likes AND high save ratio = Valuable content
- Reels with >10K plays OR trending audio = Viral potential content
- Stories with >50% completion rate = Engaging narrative content
- Posts with location tags + local engagement = Geographic trend identification
- Content using trending hashtags (#aestheticvibes, #motivation, #lifestyle) = Current platform trends
- User-generated content with brand tags = Community engagement indicators
- Posts during peak engagement hours (12-3 PM, 7-9 PM) = Timing optimization

RULES:
- RETURN ONLY JSON
- NO explanations
- NO code blocks
- NO text outside JSON

ANALYZE: ${JSON.stringify(data)}

REQUIRED JSON OUTPUT:
{
  "visual_themes": ["theme1", "theme2", "theme3"],
  "most_engaging_post": {
    "type": "photo/video/reel/story",
    "caption": "post_caption_or_description",
    "reason": "engagement_factors",
    "engagement": {
      "likes": 0,
      "comments": 0,
      "shares": 0,
      "saves": 0,
      "reach": 0
    }
  },
  "content_strategy": {
    "dominant_formats": ["reels", "posts", "stories", "igtv"],
    "hashtag_performance": "hashtag_effectiveness",
    "posting_frequency": "posts_per_day_week"
  },
  "audience_insights": {
    "follower_growth": "growth_rate",
    "engagement_quality": "authentic/artificial",
    "demographic_reach": "target_audience_match"
  },
  "aesthetic_analysis": {
    "color_palette": ["color1", "color2", "color3"],
    "content_style": "minimalist/vibrant/professional/casual",
    "brand_consistency": "consistent/inconsistent"
  },
  "performance_metrics": {
    "total_likes": 0,
    "total_comments": 0,
    "total_shares": 0,
    "average_engagement_rate": 0.0,
    "story_completion_rate": 0.0
  },
  "growth_opportunities": {
    "trending_hashtags": ["hashtag1", "hashtag2", "hashtag3"],
    "content_recommendations": "what_to_create_next",
    "collaboration_targets": "influencer_partnership_ideas",
    "monetization_readiness": "ready/needs_work/not_ready"
  }
}`;

  return prompt;
}
