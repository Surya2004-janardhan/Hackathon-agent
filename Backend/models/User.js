const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  socialMedia: {
    instagram: [
      {
        handle: { type: String, required: true },
        responses: { type: [Object], default: [] },
      },
    ],
    linkedin: [
      {
        handle: { type: String, required: true },
        responses: { type: [Object], default: [] },
      },
    ],
    youtube: [
      {
        handle: { type: String, required: true },
        responses: { type: [Object], default: [] },
      },
    ],
  },

  summary: {
    type: Array,
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userschema);
