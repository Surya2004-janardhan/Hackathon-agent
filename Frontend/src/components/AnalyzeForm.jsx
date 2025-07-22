import React, { useState } from 'react';
import { Linkedin, Instagram, Youtube, Send, Mail, Loader2, X } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const USERNAME_KEY = 'leadsagent_username';

const AnalyzeForm = ({ username: propUsername, onAnalyze, onSendMail, isLoading }) => {
  const {
    analyzeLinkedin,
    analyzeInstagram,
    analyzeYoutube,
    loading,
    error,
    createOrFetchUser,
  } = useApi();

  // Always get username from props or localStorage
  const username = propUsername || localStorage.getItem(USERNAME_KEY);

  const [formData, setFormData] = useState({
    linkedin: '',
    linkedinType: 'single',
    instagram: '',
    youtube: ''
  });

  const [visibleInputs, setVisibleInputs] = useState({
    linkedin: true,
    instagram: true,
    youtube: true
  });

  const [analyzeLoading, setAnalyzeLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasData = (visibleInputs.linkedin && formData.linkedin) ||
                    (visibleInputs.instagram && formData.instagram) ||
                    (visibleInputs.youtube && formData.youtube);

    if (hasData) {
      setAnalyzeLoading(true);
      const results = {};
      try {
        // Ensure user exists in DB before analysis
        console.log("[AnalyzeForm] Ensuring user exists in DB...");
        await createOrFetchUser(username);

        if (visibleInputs.linkedin && formData.linkedin) {
          console.log("[AnalyzeForm] Calling LinkedIn analysis API");
          const linkedinRes = await analyzeLinkedin(formData.linkedin, username);
          results.linkedin = linkedinRes;
        }
        if (visibleInputs.instagram && formData.instagram) {
          console.log("[AnalyzeForm] Calling Instagram analysis API");
          const instagramRes = await analyzeInstagram(formData.instagram, username);
          results.instagram = instagramRes;
        }
        if (visibleInputs.youtube && formData.youtube) {
          console.log("[AnalyzeForm] Calling YouTube analysis API");
          const youtubeRes = await analyzeYoutube(formData.youtube, username);
          results.youtube = youtubeRes;
        }
        console.log("[AnalyzeForm] All analysis results:", results);
        onAnalyze(results);
      } catch (err) {
        console.log("[AnalyzeForm] Error during analysis:", err);
      } finally {
        setAnalyzeLoading(false);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const removeInput = (inputType) => {
    const visibleCount = Object.values(visibleInputs).filter(Boolean).length;
    if (visibleCount > 1) {
      setVisibleInputs(prev => ({ ...prev, [inputType]: false }));
      // Clear the data for removed input
      if (inputType === 'linkedin') {
        setFormData(prev => ({ ...prev, linkedin: '', linkedinType: 'single' }));
      } else {
        setFormData(prev => ({ ...prev, [inputType]: '' }));
      }
    }
  };

  const hasData = (visibleInputs.linkedin && formData.linkedin) ||
                  (visibleInputs.instagram && formData.instagram) ||
                  (visibleInputs.youtube && formData.youtube);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Social Media Analysis</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* LinkedIn Section */}
        {visibleInputs.linkedin && (
          <div className="space-y-3 relative">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Linkedin className="w-5 h-5 text-blue-600" />
                <span>LinkedIn Profile</span>
              </label>
              {Object.values(visibleInputs).filter(Boolean).length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInput('linkedin')}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  title="Remove LinkedIn input"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="LinkedIn username or company"
              />
              
              <select
                value={formData.linkedinType}
                onChange={(e) => handleInputChange('linkedinType', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="single">Single User</option>
                <option value="organization">Organization</option>
              </select>
            </div>
          </div>
        )}

        {/* Instagram Section */}
        {visibleInputs.instagram && (
          <div className="space-y-3 relative">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Instagram className="w-5 h-5 text-pink-600" />
                <span>Instagram Profile</span>
              </label>
              {Object.values(visibleInputs).filter(Boolean).length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInput('instagram')}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  title="Remove Instagram input"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              placeholder="Instagram username"
            />
          </div>
        )}

        {/* YouTube Section */}
        {visibleInputs.youtube && (
          <div className="space-y-3 relative">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Youtube className="w-5 h-5 text-red-600" />
                <span>YouTube Channel</span>
              </label>
              {Object.values(visibleInputs).filter(Boolean).length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInput('youtube')}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  title="Remove YouTube input"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <input
              type="text"
              value={formData.youtube}
              onChange={(e) => handleInputChange('youtube', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              placeholder="YouTube channel ID"
            />
          </div>
        )}

        {/* Add buttons for removed inputs */}
        <div className="flex space-x-2 pt-2">
          {!visibleInputs.linkedin && (
            <button
              type="button"
              onClick={() => setVisibleInputs(prev => ({ ...prev, linkedin: true }))}
              className="bg-blue-100 text-blue-700 px-3 py-2 rounded flex items-center space-x-1 hover:bg-blue-200 transition"
            >
              <Linkedin className="w-4 h-4" />
              <span>Add LinkedIn</span>
            </button>
          )}
          {!visibleInputs.instagram && (
            <button
              type="button"
              onClick={() => setVisibleInputs(prev => ({ ...prev, instagram: true }))}
              className="bg-pink-100 text-pink-700 px-3 py-2 rounded flex items-center space-x-1 hover:bg-pink-200 transition"
            >
              <Instagram className="w-4 h-4" />
              <span>Add Instagram</span>
            </button>
          )}
          {!visibleInputs.youtube && (
            <button
              type="button"
              onClick={() => setVisibleInputs(prev => ({ ...prev, youtube: true }))}
              className="bg-red-100 text-red-700 px-3 py-2 rounded flex items-center space-x-1 hover:bg-red-200 transition"
            >
              <Youtube className="w-4 h-4" />
              <span>Add YouTube</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={!hasData || isLoading || analyzeLoading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center space-x-2"
          >
            {(isLoading || analyzeLoading) ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>{(isLoading || analyzeLoading) ? 'Analyzing...' : 'Analyze'}</span>
          </button>
          
          <button
            type="button"
            onClick={onSendMail}
            disabled={!hasData}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
          >
            <Mail className="w-5 h-5" />
            <span>Send Mail</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnalyzeForm;