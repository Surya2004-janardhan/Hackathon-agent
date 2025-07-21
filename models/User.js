const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  socialMedia: {
    instagram: {
      handle: { type: String, default: "" },
      response: { type: Array, default: [] },
    },
    linkedin: {
      handle: { type: String, default: "" },
      response: { type: Array, default: [] },
    },
    youtube: {
      handle: { type: String, default: "" },
      response: { type: Array, default: [] },
    },
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
