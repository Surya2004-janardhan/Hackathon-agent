import React, { useEffect, useState } from 'react';
import { Calendar, TrendingUp, Users, Eye, Heart, MessageCircle } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const USERNAME_KEY = 'leadsagent_username';

const PreviousData = ({ username: propUsername }) => {
  const { getPreviousData, loading, error } = useApi();
  const [data, setData] = useState([]);
  const username = propUsername || localStorage.getItem(USERNAME_KEY);

  useEffect(() => {
    if (username) {
      console.log('[PreviousData] Fetching previous data for:', username);
      getPreviousData(username)
        .then((result) => {
          console.log('[PreviousData] Data fetched:', result);
          setData(result);
        })
        .catch((err) => {
          console.log('[PreviousData] Error fetching data:', err);
        });
    }
  }, [username, getPreviousData]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">Li</div>;
      case 'instagram':
        return <div className="w-8 h-8 bg-pink-600 rounded text-white flex items-center justify-center text-xs font-bold">Ig</div>;
      case 'youtube':
        return <div className="w-8 h-8 bg-red-600 rounded text-white flex items-center justify-center text-xs font-bold">Yt</div>;
      default:
        return <TrendingUp className="w-8 h-8 text-gray-600" />;
    }
  };

  if (loading) return <div>Loading previous data...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Previous Analysis Data</h3>
        <div className="text-center py-8">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No previous analysis data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Previous Analysis Data</h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getPlatformIcon(item.platform)}
                <div>
                  <h4 className="font-semibold text-gray-800">{item.username}</h4>
                  <p className="text-sm text-gray-600 capitalize">{item.platform} • {item.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(item.analyzedAt)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">Followers</span>
                </div>
                <p className="text-lg font-bold text-blue-800">{item.metrics.followers.toLocaleString()}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Views</span>
                </div>
                <p className="text-lg font-bold text-green-800">{item.metrics.views.toLocaleString()}</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Likes</span>
                </div>
                <p className="text-lg font-bold text-red-800">{item.metrics.likes.toLocaleString()}</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-600 font-medium">Comments</span>
                </div>
                <p className="text-lg font-bold text-purple-800">{item.metrics.comments.toLocaleString()}</p>
              </div>
            </div>
            
            {item.summary && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{item.summary}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousData;