import { useState } from "react";

const BASE_URL = "http://localhost:3000";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (endpoint, data = null, method = "POST") => {
    setLoading(true);
    setError(null);
    console.log(`[API] Fetching: ${BASE_URL}${endpoint}`, data);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body:
          method === "GET"
            ? undefined
            : data
            ? JSON.stringify(data)
            : undefined,
      });
      const result = await response.json();
      console.log(`[API] Success: ${BASE_URL}${endpoint}`, result);
      setLoading(false);
      return result;
    } catch (err) {
      console.log(`[API] Error: ${BASE_URL}${endpoint}`, err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // User API endpoint
  const createOrFetchUser = async (username) => {
    console.log("[useApi] Calling /user API with:", username);
    const result = await callApi("/user", { username });
    console.log("[useApi] /user API response:", result);
    return result;
  };

  const analyzeInstagram = async (instaProfileUsername, username) => {
    console.log(
      "[useApi] Calling /analyze-instagram API with:",
      instaProfileUsername,
      username
    );
    const result = await callApi("/analyze-instagram", {
      instaProfileUsername,
      username,
    });
    console.log("[useApi] /analyze-instagram API response:", result);
    return result;
  };

  const analyzeLinkedin = async (linkedinProfileLink, username) => {
    console.log(
      "[useApi] Calling /analyze-linkedin API with:",
      linkedinProfileLink,
      username
    );
    const result = await callApi("/analyze-linkedin", {
      linkedinProfileLink,
      username,
    });
    console.log("[useApi] /analyze-linkedin API response:", result);
    return result;
  };

  const analyzeYoutube = async (youtubeChannelId, username) => {
    console.log(
      "[useApi] Calling /analyze-youtube API with:",
      youtubeChannelId,
      username
    );
    const result = await callApi("/analyze-youtube", {
      youtubeChannelId,
      username,
    });
    console.log("[useApi] /analyze-youtube API response:", result);
    return result;
  };

  const updateCreatedAt = async (username) => {
    console.log("[useApi] Calling /created-at API with:", username);
    const result = await callApi("/created-at", { username });
    console.log("[useApi] /created-at API response:", result);
    return result;
  };

  const getOverallSummary = async (username) => {
    console.log("[useApi] Calling /overall-summary API with:", username);
    const result = await callApi("/overall-summary", { username });
    console.log("[useApi] /overall-summary API response:", result);
    return result;
  };

  const getPreviousData = async (username) => {
    console.log("[useApi] Calling /previous-data API with:", username);
    // Use query param for GET
    const result = await callApi(
      `/previous-data?username=${username}`,
      null,
      "GET"
    );
    console.log("[useApi] /previous-data API response:", result);
    return result;
  };

  const sendDataNow = async (username, userEmail) => {
    console.log(
      "[useApi] Calling /send-data-now API with:",
      username,
      userEmail
    );
    const result = await callApi(
      "/send-data-now",
      { username, userEmail },
      "GET"
    );
    console.log("[useApi] /send-data-now API response:", result);
    return result;
  };

  return {
    loading,
    error,
    createOrFetchUser,
    analyzeInstagram,
    analyzeLinkedin,
    analyzeYoutube,
    updateCreatedAt,
    getOverallSummary,
    getPreviousData,
    sendDataNow,
  };
};
