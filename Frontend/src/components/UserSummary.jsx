import React, { useEffect } from 'react';
import { User, TrendingUp, Calendar, Award } from 'lucide-react';

const UserSummary = ({ username, summary }) => {
  useEffect(() => {
    console.log("[UserSummary] Rendering with data:", { username, summary });
  }, [username, summary]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{username}</h2>
          <p className="text-gray-600">Account Summary</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Analyses</p>
              <p className="text-2xl font-bold text-blue-800">{summary.totalAnalyses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Last Analysis</p>
              <p className="text-lg font-bold text-green-800">{summary.lastAnalysis}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-purple-800">{summary.successRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSummary;