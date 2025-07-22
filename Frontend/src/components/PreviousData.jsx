import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";

// Social media theme colors
const platformStyles = {
  instagram: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white",
  linkedin: "bg-blue-700 text-white",
  youtube: "bg-gradient-to-r from-red-600 to-red-400 text-white",
};

export default function PreviousData({ username, refresh }) {
  const { getPreviousData } = useApi();
  const [data, setData] = useState({});

  useEffect(() => {
    if (username) {
      const fetchData = async () => {
        try {
          const datata = await getPreviousData(username);
          setData(datata);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [username, refresh]);

  const socialMedia = data?.socialMedia || {};
  const isEmpty =
    !socialMedia ||
    Object.values(socialMedia).every((arr) => Array.isArray(arr) && arr.length === 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-bold text-lg mb-4">Previous Results</h3>
      {isEmpty ? (
        <div className="text-gray-400 italic py-4 text-center">
          No previous searches found.
        </div>
      ) : (
<div className="flex flex-col gap-6">
          {Object.entries(socialMedia).map(([platform, handles]) =>
            handles.length > 0
              ? handles.map((handleObj, idx) =>
                  Array.isArray(handleObj.responses) && handleObj.responses.length > 0
                    ? handleObj.responses.map((resp, rIdx) => (
                        <div
                          key={`${platform}-${idx}-${rIdx}`}
                          className={`rounded-xl shadow-lg p-4 flex flex-col gap-2 ${platformStyles[platform] || "bg-gray-100 text-gray-800"}`}
                        >
                          <h4 className="font-bold text-xl capitalize mb-2 flex items-center gap-2">
                            {platform === "instagram" && <span>📸</span>}
                            {platform === "linkedin" && <span>🔗</span>}
                            {platform === "youtube" && <span>📺</span>}
                            {platform}
                          </h4>
                          <div className="text-sm font-semibold mb-1">
                            Handle:{" "}
                            <span className="underline break-all">
                              {handleObj.handle || <span className="italic text-gray-200">N/A</span>}
                            </span>
                          </div>
                          <div className="border-l-4 border-white pl-3 mb-2">
                            <div className="text-xs whitespace-pre-line">
                              {resp.summary}
                            </div>
                          </div>
                        </div>
                      ))
                    : (
                        <div
                          key={`${platform}-${idx}-empty`}
                          className={`rounded-xl shadow-lg p-4 flex flex-col gap-2 ${platformStyles[platform] || "bg-gray-100 text-gray-800"}`}
                        >
                          <h4 className="font-bold text-xl capitalize mb-2 flex items-center gap-2">
                            {platform === "instagram" && <span>📸</span>}
                            {platform === "linkedin" && <span>🔗</span>}
                            {platform === "youtube" && <span>📺</span>}
                            {platform}
                          </h4>
                          <div className="text-sm font-semibold mb-1">
                            Handle:{" "}
                            <span className="underline break-all">
                              {handleObj.handle || <span className="italic text-gray-200">N/A</span>}
                            </span>
                          </div>
                          <div className="text-xs italic">No responses found.</div>
                        </div>
                      )
                )
              : null
          )}
        </div>
      )}
    </div>
  );
}