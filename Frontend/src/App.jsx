import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import UsernameModal from './components/UsernameModal';
import UserSummary from './components/UserSummary';
import AnalyzeForm from './components/AnalyzeForm';
import PreviousData from './components/PreviousData';
import AutoUpdateTimer from './components/AutoUpdateTimer';
import { useApi } from './hooks/useApi';

function App() {
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [userSummary, setUserSummary] = useState(null);
  const [previousData, setPreviousData] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const { loading, getUserSummary, analyzeProfiles, sendMail, getPreviousData, autoUpdate } = useApi();

  useEffect(() => {
    if (username) {
      loadUserData();
    }
  }, [username]);

  const loadUserData = async () => {
    try {
      const [summaryResponse, dataResponse] = await Promise.all([
        getUserSummary(username),
        getPreviousData(username)
      ]);
      
      setUserSummary(summaryResponse.data);
      setPreviousData(dataResponse.data);
    } catch (error) {
      toast.error('Failed to load user data');
    }
  };

  const handleUsernameSubmit = async (inputUsername) => {
    setUsername(inputUsername);
    setShowModal(false);
    toast.success(`Welcome, ${inputUsername}!`);
  };

  const handleAnalyze = async (formData) => {
    try {
      const response = await analyzeProfiles(formData);
      setAnalysisResults(response.data);
      toast.success('Analysis completed successfully!');
      
      // Refresh previous data
      const dataResponse = await getPreviousData(username);
      setPreviousData(dataResponse.data);
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    }
  };

  const handleSendMail = async () => {
    try {
      await sendMail({
        username,
        analysisResults,
        timestamp: new Date().toISOString()
      });
      toast.success('Summary sent to team successfully!');
    } catch (error) {
      toast.error('Failed to send mail. Please try again.');
    }
  };

  const handleAutoUpdate = async () => {
    try {
      await autoUpdate(previousData);
      toast.success('Auto update completed!');
      
      // Refresh data after auto update
      loadUserData();
    } catch (error) {
      toast.error('Auto update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" />
      
      <UsernameModal 
        isOpen={showModal} 
        onSubmit={handleUsernameSubmit} 
      />
      
      {username && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Social Media Analytics Dashboard
              </h1>
              <p className="text-gray-600">Comprehensive analysis and insights for your social media presence</p>
            </div>

            {/* User Summary */}
            {userSummary && (
              <UserSummary username={username} summary={userSummary} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Analysis Form */}
              <div className="lg:col-span-2 space-y-8">
                <AnalyzeForm 
                  onAnalyze={handleAnalyze}
                  onSendMail={handleSendMail}
                  isLoading={loading}
                />

                {/* Analysis Results */}
                {analysisResults && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Analysis Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Object.entries(analysisResults).map(([platform, data]) => (
                        <div key={platform} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 capitalize mb-3">{platform}</h4>
                          <div className="space-y-2">
                            {Object.entries(data).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-sm text-gray-600 capitalize">{key}:</span>
                                <span className="text-sm font-medium text-gray-800">
                                  {typeof value === 'number' ? value.toLocaleString() : value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Previous Data */}
                <PreviousData data={previousData} />
              </div>

              {/* Right Column - Auto Update Timer */}
              <div className="lg:col-span-1">
                <AutoUpdateTimer onAutoUpdate={handleAutoUpdate} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;