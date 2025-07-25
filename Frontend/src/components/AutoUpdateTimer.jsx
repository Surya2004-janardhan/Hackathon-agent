import React, { useEffect, useRef, useState } from "react";
import { Clock, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { useApi } from "../hooks/useApi";

const AutoUpdateTimer = ({ username, email, handles, onAutoUpdate }) => {
  const { analyzeInstagram, analyzeLinkedin, analyzeYoutube, sendDataNow } = useApi();
  const [seconds, setSeconds] = useState(48 * 60 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef();
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            handleAutoUpdate();
            return 48 * 60 * 60;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleAutoUpdate = async () => {
    if (handles.instagram)
      await analyzeInstagram(handles.instagram, username);
    if (handles.linkedin)
      await analyzeLinkedin(handles.linkedin, username);
    if (handles.youtube)
      await analyzeYoutube(handles.youtube, username);
    await sendDataNow(username, email);
    setLastUpdate(new Date());
    if (onAutoUpdate) onAutoUpdate();
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setSeconds(48 * 60 * 60);
  };

  const progress = ((48 * 60 * 60 - seconds) / (48 * 60 * 60)) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Auto Update Timer</h3>
          <p className="text-sm text-gray-600">48-hour automatic analysis cycle</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-gray-800 mb-2">
            {formatTime(seconds)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {running ? 'Timer is running' : 'Timer is paused'}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-3">
          {!running ? (
            <button
              onClick={handleStart}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Last Update Info */}
        {lastUpdate && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Last Auto Update</p>
                <p className="text-sm text-green-600">
                  {lastUpdate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Auto Update:</strong> The system will automatically analyze all previously entered social media profiles every 48 hours and send updated reports to your team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutoUpdateTimer;