import React, { useState } from "react";
import { useApi } from "../hooks/useApi";

export default function AnalyzeForm({ username, onAnalyze }) {
  console.log(username)
  const { analyzeInstagram, analyzeLinkedin, analyzeYoutube } = useApi();
  const [fields, setFields] = useState({
    linkedin: "",
    instagram: "",
    youtube: "",
  });
  const [visible, setVisible] = useState({
    linkedin: true,
    instagram: true,
    youtube: true,
  });
  const [loading, setLoading] = useState(false);

  const handleRemove = (key) => setVisible((v) => ({ ...v, [key]: false }));
  const handleAdd = (key) => setVisible((v) => ({ ...v, [key]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const results = {};
    if (visible.linkedin && fields.linkedin)
      results.linkedin = await analyzeLinkedin(fields.linkedin, username);
    if (visible.instagram && fields.instagram)
      results.instagram = await analyzeInstagram(fields.instagram, username);
    if (visible.youtube && fields.youtube)
      results.youtube = await analyzeYoutube(fields.youtube, username);
    setLoading(false);
    onAnalyze(results);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow mb-6 flex flex-col gap-4">
      <h3 className="font-bold text-lg mb-2">Analyze Social Media</h3>
      {visible.linkedin ? (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="LinkedIn Profile Link"
            value={fields.linkedin}
            onChange={(e) => setFields((f) => ({ ...f, linkedin: e.target.value }))}
            className="border rounded px-3 py-2 flex-1"
          />
          <button type="button" onClick={() => handleRemove("linkedin")} className="text-red-500">Remove</button>
        </div>
      ) : (
        <button type="button" onClick={() => handleAdd("linkedin")} className="text-blue-500">+ Add LinkedIn</button>
      )}
      {visible.instagram ? (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Instagram Username"
            value={fields.instagram}
            onChange={(e) => setFields((f) => ({ ...f, instagram: e.target.value }))}
            className="border rounded px-3 py-2 flex-1"
          />
          <button type="button" onClick={() => handleRemove("instagram")} className="text-red-500">Remove</button>
        </div>
      ) : (
        <button type="button" onClick={() => handleAdd("instagram")} className="text-pink-500">+ Add Instagram</button>
      )}
      {visible.youtube ? (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="YouTube Channel ID"
            value={fields.youtube}
            onChange={(e) => setFields((f) => ({ ...f, youtube: e.target.value }))}
            className="border rounded px-3 py-2 flex-1"
          />
          <button type="button" onClick={() => handleRemove("youtube")} className="text-red-500">Remove</button>
        </div>
      ) : (
        <button type="button" onClick={() => handleAdd("youtube")} className="text-red-500">+ Add YouTube</button>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded py-2 font-semibold mt-2"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </form>
  );
}