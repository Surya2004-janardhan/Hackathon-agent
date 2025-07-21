import { useState } from 'react';

// Mock API functions - replace with actual API calls
const mockApiCall = (endpoint, data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`API Call to ${endpoint}:`, data);
      resolve({ success: true, data: mockData[endpoint] || {} });
    }, delay);
  });
};

const mockData = {
  '/api/user/summary': {
    totalAnalyses: 24,
    lastAnalysis: '2 days ago',
    successRate: 98
  },
  '/api/analyze': {
    linkedin: {
      followers: 15420,
      connections: 2340,
      posts: 156,
      engagement: 8.5
    },
    instagram: {
      followers: 8920,
      following: 1240,
      posts: 342,
      avgLikes: 450
    },
    youtube: {
      subscribers: 12500,
      videos: 89,
      totalViews: 450000,
      avgViews: 5056
    }
  },
  '/api/previous-data': [
    {
      id: 1,
      platform: 'linkedin',
      username: 'john.doe',
      type: 'single',
      analyzedAt: '2024-01-15T10:30:00Z',
      metrics: {
        followers: 15420,
        views: 89000,
        likes: 2340,
        comments: 456
      },
      summary: 'Strong professional presence with consistent engagement rates.'
    },
    {
      id: 2,
      platform: 'instagram',
      username: 'johndoe_official',
      type: 'personal',
      analyzedAt: '2024-01-14T15:45:00Z',
      metrics: {
        followers: 8920,
        views: 125000,
        likes: 12400,
        comments: 890
      },
      summary: 'Good engagement with lifestyle content performing well.'
    },
    {
      id: 3,
      platform: 'youtube',
      username: 'JohnDoeChannel',
      type: 'channel',
      analyzedAt: '2024-01-13T09:15:00Z',
      metrics: {
        followers: 12500,
        views: 450000,
        likes: 28900,
        comments: 3400
      },
      summary: 'Consistent upload schedule with growing subscriber base.'
    }
  ]
};

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (endpoint, data = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockApiCall(endpoint, data);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const getUserSummary = (username) => {
    return callApi('/api/user/summary', { username });
  };

  const analyzeProfiles = (profileData) => {
    return callApi('/api/analyze', profileData);
  };

  const sendMail = (data) => {
    return callApi('/api/send-mail', data);
  };

  const getPreviousData = (username) => {
    return callApi('/api/previous-data', { username });
  };

  const autoUpdate = (profiles) => {
    return callApi('/api/auto-update', profiles);
  };

  return {
    loading,
    error,
    getUserSummary,
    analyzeProfiles,
    sendMail,
    getPreviousData,
    autoUpdate
  };
};