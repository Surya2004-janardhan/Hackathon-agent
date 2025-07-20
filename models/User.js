const mongoose = require("mongoose");
const userschema = mongoose.model("User", {
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  instagramResponse: {
    type: String,
    default: "",
  },
  linkedinResponse: {
    type: String,
    default: "",
  },
  youtubeResponse: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: "",
  },
  summary: {
    type: Array,
    default: "",
  },
  // Add other fields as needed
});

module.exports = mongoose.model("User", userschema);
