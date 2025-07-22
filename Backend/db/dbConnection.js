const mongoose = require("mongoose");

async function connectToMongo() {
  try {
    await mongoose.connect(
      "mongodb+srv://kushalkommireddy:F8sXTUGM97geJP84@jpath.0gteqvs.mongodb.net/",
      {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = connectToMongo;
